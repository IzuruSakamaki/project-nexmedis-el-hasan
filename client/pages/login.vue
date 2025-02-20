<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 class="text-2xl font-bold mb-6">Login</h1>
        <form @submit.prevent="login">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2" for="username">Username</label>
            <input v-model="username" type="text" id="username" class="w-full p-2 border rounded-lg" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2" for="password">Password</label>
            <input v-model="password" type="password" id="password" class="w-full p-2 border rounded-lg" />
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
            Login
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const username = ref('');
  const password = ref('');
  
  const login = async () => {
    try {
      const { data: token } = await useFetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        body: { username: username.value, password: password.value },
      });
      console.log('Login successful:', token.value);
      // Simpan token ke state atau localStorage
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  </script>