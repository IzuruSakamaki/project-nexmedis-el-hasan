<template>
  <div class="bg-white shadow-md rounded-lg p-4">
    <img v-if="post.imageUrl" :src="post.imageUrl" alt="Post Image" class="w-full h-48 object-cover rounded-lg" />
    <div v-html="post.content" class="mt-2 text-gray-700"></div>
    <div class="mt-4 flex space-x-4">
      <button 
        @click="likePost(post.id)" 
        class="text-gray-500 hover:text-blue-500">
        Like
      </button>
      <div>{{ post.vote }}</div>
      <button @click="toggleComments(post.id)" class="text-gray-500 hover:text-blue-500">Comment</button>
      <button @click="$emit('edit', post)" class="text-gray-500 hover:text-green-500">Edit</button>
      <button @click="$emit('delete', post.id)" class="text-gray-500 hover:text-red-500">Delete</button>
    </div>
    <CommentSection v-if="showComments === post.id" :postId="post.id" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useCookie } from '#app';

  interface Vote {
    vote: number;
  }

  interface Post {
    id: number;
    content: string;
    imageUrl?: string;
    vote: number;
  }

  const props = defineProps<{
    post: Post;
  }>();

  const voteState = ref<Vote>({ vote: 0 });
  const showComments = ref<number | null>(null);
  const token = useCookie('token').value;
  const config = useRuntimeConfig();

  const likePost = async (postId: number) => {
    if (!token) {
      return;
    }

    try {
      const { data } = await useFetch<Vote>(`${config.public.BACKEND_BASE_URL}/api/posts/${postId}/vote`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      voteState.value = data.value || { vote: 0 };

      const response = await fetch(`${config.public.BACKEND_BASE_URL}/api/posts/${postId}/vote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vote: voteState.value.vote === 0 ? 1 : -1,
        }),
      });

      if (response.ok) {
        props.post.vote = props.post.vote + (voteState.value.vote === 0 ? 1 : -1);
      }
    } catch (error) {
      return;
    }
  };

  const toggleComments = (postId: number) => {
    showComments.value = showComments.value === postId ? null : postId;
  };
</script>
