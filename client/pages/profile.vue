<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">My Profile</h1>
        <div v-if="message" :class="messageClass" class="mb-4 p-3 rounded-md">
            {{ message }}
        </div>
        <div v-if="postMessage" :class="postMessageClass" class="mb-4 p-3 rounded-md">
            {{ postMessage }}
        </div>
        <div class="flex justify-between w-full mb-6">
            <button @click="isCreateModalOpen = true" class="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Create Post
            </button>
            <button @click="isDeleteModalOpen = true" class="bg-red-500 text-white px-4 py-2 rounded-lg">
            Delete Account
            </button>
        </div>
        <div v-if="loading" class="text-center">Loading...</div>
        <div v-else>
            <div v-if="posts.length === 0" class="text-gray-500">You have no posts yet.</div>
            <div v-else class="grid gap-4">
                <PostCard v-for="post in posts" :key="post.id" :post="post" @edit="handleEdit" @delete="handleDelete" />
            </div>
        </div>
        <div v-if="isDeleteModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl">
            <h2 class="text-xl font-bold mb-4">Delete Account</h2>
            <div>Are you sure you want to delete your account? This action cannot be undone.</div>
            <div class="mt-4 flex justify-end space-x-4">
                <button @click="isDeleteModalOpen = false" class="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
                <button @click="handleDeleteAccount" class="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
            </div>
            </div>
        </div>
        <div v-if="isCreateModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl">
            <h2 class="text-xl font-bold mb-4">Create Post</h2>
            <TextEditor v-model="newPostContent" />
            <div class="mt-4">
                <label for="imageUrl" class="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                type="text"
                id="imageUrl"
                v-model="newPostImageUrl"
                class="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                placeholder="Enter image URL (optional)"
                />
            </div>
            <div class="mt-4 flex justify-end space-x-4">
                <button @click="isCreateModalOpen = false" class="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
                <button @click="handleCreate(newPostContent, newPostImageUrl)" class="bg-blue-500 text-white px-4 py-2 rounded-lg">Create</button>
            </div>
            </div>
        </div>
        <div v-if="isEditModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl">
                <h2 class="text-xl font-bold mb-4">Edit Post</h2>
                <TextEditor v-model="editPostContent" />
                <div class="mt-4">
                    <label for="imageUrl" class="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                    type="text"
                    id="imageUrl"
                    v-model="editPostImageUrl"
                    class="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                    placeholder="Enter image URL (optional)"
                    />
                </div>
                <div class="mt-4 flex justify-end space-x-4">
                    <button @click="isEditModalOpen = false" class="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
                    <button @click="handleUpdate(editPostId, editPostContent, editPostImageUrl)" class="bg-blue-500 text-white px-4 py-2 rounded-lg">Update</button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
    import { ref } from 'vue';
    import { usePostApi } from '~/composables/usePostApi';
    import { useUserApi } from '~/composables/useUserApi';
    import PostCard from '~/components/PostCard.vue';
    import TextEditor from '~/components/TextEditor.vue';

    definePageMeta({
        middleware: ['auth'],
    });

    interface Post {
        id: number;
        content: string;
        imageUrl?: string;
        vote: number;
    }

    const { posts, loading, message: postMessage, messageClass: postMessageClass, fetchUserPosts, createPost, updatePost, handleDelete } = usePostApi();
    const { message, messageClass, deleteAccount } = useUserApi();
    const isCreateModalOpen = ref(false);
    const isDeleteModalOpen = ref(false);
    const newPostContent = ref('');
    const newPostImageUrl = ref('');
    const isEditModalOpen = ref(false);
    const editPostContent = ref('');
    const editPostImageUrl = ref('');
    const editPostId = ref<number | null>(null);
    const handleEdit = (post: Post) => {
        editPostId.value = post.id;
        editPostContent.value = post.content;
        isEditModalOpen.value = true;
    };
    const handleDeleteAccount = async () => {
        await deleteAccount(); 
        isDeleteModalOpen.value = false;
    };
    const handleUpdate = async (editPostId: number | null, editPostContent: string, editPostImageUrl: string) => {
        await updatePost(editPostId, editPostContent, editPostImageUrl); 
        isEditModalOpen.value = false;
    };
    const handleCreate = async (newPostContent: string, newPostImageUrl: string) => {
        await createPost(newPostContent, newPostImageUrl); 
        isCreateModalOpen.value = false;
    };
    await fetchUserPosts();
</script>
  