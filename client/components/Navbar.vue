<template>
    <nav class="bg-white shadow-md">
        <div class="container mx-auto p-4 flex justify-between items-center">
            <NuxtLink to="/" class="text-xl font-bold">Nexmedis</NuxtLink>
            <div class="flex space-x-4">
                <template v-if="isLoggedIn">
                    <div class="relative">
                        <button @click="toggleDropdown" class="text-gray-700 hover:text-blue-500">
                            Hi, {{ username }}
                        </button>
                        <div v-if="isDropdownOpen" class="absolute right-0 mt-2 bg-white shadow-md p-4 rounded-lg space-y-2">
                            <NuxtLink to="/profile" class="text-gray-700 hover:text-blue-500 block">Profile</NuxtLink>
                            <button @click="handleLogout" class="text-gray-700 hover:text-blue-500 block">Logout</button>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <NuxtLink to="/login" class="text-gray-700 hover:text-blue-500">Login</NuxtLink>
                    <NuxtLink to="/register" class="text-gray-700 hover:text-blue-500">Register</NuxtLink>
                </template>
            </div>
            
        </div>
    </nav>
</template>
  
<script setup lang="ts">
    import { useCookie } from '#app';
    import { useRouter } from 'vue-router';
    import { ref, watchEffect } from 'vue';

    const token = useCookie('token');
    const username = ref('');
    const isLoggedIn = ref(!!token.value);
    const isDropdownOpen = ref(false);
    const router = useRouter();

    watchEffect(() => {
        isLoggedIn.value = !!token.value;
        if (isLoggedIn.value && token.value) {
            const parsedToken = JSON.parse(atob(token.value.split('.')[1]));
            username.value = parsedToken.username;
        }
    });
    const toggleDropdown = () => {
        isDropdownOpen.value = !isDropdownOpen.value;
    };
    const handleLogout = () => {
        token.value = '';
        router.push('/login');
    };
    const handleClickOutside = (event: MouseEvent) => {
        const dropdown = document.querySelector('.relative');
        if (dropdown && !dropdown.contains(event.target as Node)) {
            isDropdownOpen.value = false;
        }
    };
    onMounted(() => {
        document.addEventListener('click', handleClickOutside);
    });
    onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside);
    });
</script>