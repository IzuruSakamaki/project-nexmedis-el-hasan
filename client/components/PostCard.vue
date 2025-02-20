<template>
    <div class="bg-white shadow-md rounded-lg p-4">
      <img v-if="post.imageUrl" :src="post.imageUrl" alt="Post Image" class="w-full h-48 object-cover rounded-lg" />
      <p class="mt-2 text-gray-700">{{ post.content }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  interface Post {
    id: number;
    content: string;
    imageUrl?: string;
  }
  
  const props = defineProps<{
    post: Post;
  }>();
  </script>