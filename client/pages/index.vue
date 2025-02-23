<template>
    <div>
        <div class="grid gap-4">
            <PostCard v-for="post in posts" :key="post.id" :post="post" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { usePostApi } from '~/composables/usePostApi';
    import PostCard from '~/components/PostCard.vue';

    definePageMeta({
        middleware: ['auth'],
    });

    const { posts, fetchPosts } = usePostApi();
    await fetchPosts();
</script>