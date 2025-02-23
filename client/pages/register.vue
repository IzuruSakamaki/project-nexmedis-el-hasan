<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-96">
            <h1 class="text-2xl font-bold mb-6">Register</h1>
            <div v-if="message" :class="messageClass" class="mb-4 p-3 rounded-md">
                {{ message }}
            </div>
            <AuthForm type="register" @submit="handleRegister" />
        </div>
    </div>
</template>
  
<script setup lang="ts">
    import { useUserApi } from '~/composables/useUserApi';
    const { message, messageClass, handleRegister } = useUserApi();
</script>
