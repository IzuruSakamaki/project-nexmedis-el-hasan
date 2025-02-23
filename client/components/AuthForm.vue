<template>
    <form @submit.prevent="handleSubmit">
        <div class="mb-4">
            <label class="block text-sm font-medium mb-2" for="username">Nickname</label>
            <input 
                v-model="username" 
                type="text" 
                id="username" 
                class="w-full p-2 border rounded-lg"
                @input="formatUsername"
            />
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium mb-2" for="password">Password</label>
            <input v-model="password" type="password" id="password" class="w-full p-2 border rounded-lg" />
        </div>
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
            {{ type === 'login' ? 'Login' : 'Register' }}
        </button>
    </form>
</template>
  
<script setup lang="ts">
    import { ref } from 'vue';

    const props = defineProps<{
        type: 'login' | 'register';
    }>();
    const username = ref('');
    const password = ref('');
    const emit = defineEmits(['submit']);

    const formatUsername = () => {
        username.value = username.value
            .replace(/[^a-zA-Z]/g, '').toLowerCase()
            .replace(/^(.)/, (match) => match.toUpperCase());
    };

    const handleSubmit = () => {
        emit('submit', { username: username.value, password: password.value });
    };
</script>
