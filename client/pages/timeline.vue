<template>
    <div class="container mx-auto p-4">
      <Navbar />
      <div class="grid gap-4">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  interface Post {
    id: number;
    content: string;
    imageUrl?: string;
  }
  
  const { data: posts } = await useFetch<Post[]>('http://localhost:5000/api/posts');
  </script>