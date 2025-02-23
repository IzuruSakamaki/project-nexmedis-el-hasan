import { ref } from 'vue';
import { useCookie } from '#app';

interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  vote: number;
}

interface Vote {
  vote: number;
}

export const usePostApi = () => {
  const token = useCookie('token');
  const posts = ref<Post[]>([]);
  const loading = ref(true);
  const message = ref('');
  const messageClass = ref('');
  const config = useRuntimeConfig();
  
  const fetchPosts = async () => {
    try {
      const { data, error } = await useFetch<Post[]>(`${config.public.BACKEND_BASE_URL}/api/posts`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (error.value) {
        message.value = 'Failed to fetch posts. Please try again.';
        messageClass.value = 'bg-red-500 text-white';
      } else {
        posts.value = data.value || [];
      }
    } catch (err) {
      message.value = 'Failed to fetch posts. Please try again.';
      messageClass.value = 'bg-red-500 text-white';
    } finally {
      loading.value = false;
    }
  };

  const fetchUserPosts = async () => {
    try {
      const { data, error } = await useFetch<Post[]>(`${config.public.BACKEND_BASE_URL}/api/posts/user/all`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (error.value) {
        message.value = 'Failed to fetch posts. Please try again.';
        messageClass.value = 'bg-red-500 text-white';
      } else {
        posts.value = data.value || [];
      }
    } catch (err) {
      message.value = 'Failed to fetch posts. Please try again.';
      messageClass.value = 'bg-red-500 text-white';
    } finally {
      loading.value = false;
    }
  };

  const createPost = async (newPostContent: string, newPostImageUrl: string) => {
    try {
      const { data, error } = await useFetch(`${config.public.BACKEND_BASE_URL}/api/posts`, {
        method: 'POST',
        body: JSON.stringify({ content: newPostContent, imageUrl: newPostImageUrl }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (error.value) {
        message.value = 'Failed to create post. Please try again.';
        messageClass.value = 'bg-red-500 text-white';
      } else {
        message.value = 'Post created successfully!';
        messageClass.value = 'bg-green-500 text-white';
        fetchUserPosts();
      }
    } catch (err) {
      message.value = 'Failed to create post. Please try again.';
      messageClass.value = 'bg-red-500 text-white';
    }
  };

  const updatePost = async (editPostId: number | null, editPostContent: string, editPostImageUrl: string) => {
    if (!editPostId) return;

    try {
      const { data, error } = await useFetch(`${config.public.BACKEND_BASE_URL}/api/posts/${editPostId}`, {
        method: 'PUT',
        body: JSON.stringify({ content: editPostContent, imageUrl: editPostImageUrl }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (error.value) {
        message.value = 'Failed to update post. Please try again.';
        messageClass.value = 'bg-red-500 text-white';
      } else {
        message.value = 'Post updated successfully!';
        messageClass.value = 'bg-green-500 text-white';
        fetchUserPosts();
      }
    } catch (err) {
      message.value = 'Failed to update post. Please try again.';
      messageClass.value = 'bg-red-500 text-white';
    }
  };

  const handleDelete = async (postId: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const { error } = await useFetch(`${config.public.BACKEND_BASE_URL}/api/posts/${postId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });

        if (error.value) {
          message.value = 'Failed to delete post. Please try again.';
          messageClass.value = 'bg-red-500 text-white';
        } else {
          message.value = 'Post deleted successfully!';
          messageClass.value = 'bg-green-500 text-white';
          fetchUserPosts();
        }
      } catch (err) {
        message.value = 'Failed to delete post. Please try again.';
        messageClass.value = 'bg-red-500 text-white';
      }
    }
  };
  
  return {
    posts,
    loading,
    fetchPosts,
    fetchUserPosts,
    createPost,
    updatePost,
    handleDelete,
    message,
    messageClass
  };
};
