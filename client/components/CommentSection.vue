<template>
  <div class="mt-4">
    <input
      v-model="newComment"
      type="text"
      placeholder="Add a comment..."
      class="w-full p-2 border rounded-lg mt-2"
    />
    <button
      @click="addComment"
      class="my-2 bg-blue-500 text-white p-2 rounded-lg"
    >
      Submit
    </button>
    <div v-for="comment in comments" :key="comment.id" class="py-2 border-b-2">
      <p class="text-gray-600 font-bold">{{ comment.user.username }}</p>
      <p class="text-gray-600">{{ comment.content }}</p>
      <button
        v-if="comment.user.username === username"
        @click="deleteComment(comment.id)"
        class="mt-2 text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useCookie } from '#app';

  interface Comment {
    id: number;
    content: string;
    user: User;
  }

  interface User {
    username: string;
  }

  const props = defineProps<{
    postId: number;
  }>();

  const comments = ref<Comment[]>([]);
  const newComment = ref('');
  const username = ref('');
  const config = useRuntimeConfig();
  const token = useCookie('token').value;

  if (token) {
    const parsedToken = JSON.parse(atob(token.split('.')[1]));
    username.value = parsedToken.username;
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`${config.public.BACKEND_BASE_URL}/api/posts/${props.postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        comments.value = data.comments || [];
      } else {
        alert('Failed to load comments.');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      alert('An error occurred while fetching comments.');
    }
  };

  const addComment = async () => {
    if (!newComment.value.trim()) {
      alert('Please write a comment before submitting.');
      return;
    }

    try {
      const response = await fetch(`${config.public.BACKEND_BASE_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId: props.postId,
          content: newComment.value,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        comments.value.unshift(data);  
        newComment.value = '';
      } else {
        alert('Failed to submit the comment.');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('An error occurred while adding the comment.');
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      const response = await fetch(`${config.public.BACKEND_BASE_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        comments.value = comments.value.filter(comment => comment.id !== commentId);
      } else {
        alert('Failed to delete the comment.');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('An error occurred while deleting the comment.');
    }
  };

  onMounted(fetchComments);
</script>
