import { useRouter } from 'vue-router';
import { useCookie } from '#app';
import { ref } from 'vue';

export const useUserApi = () => {
  const router = useRouter();
  const token = useCookie('token');
  const message = ref('');
  const messageClass = ref('');
  const config = useRuntimeConfig();

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      const response = await fetch(`${config.public.BACKEND_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const token = useCookie('token', { maxAge: 60 * 60 });
        token.value = data.token;
        message.value = 'Login successful!';
        messageClass.value = 'bg-green-500 text-white';
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        message.value = 'Login Failed! Please check your input.';
        messageClass.value = 'bg-red-500 text-white';
      }
    } catch (error) {
      message.value = 'Login Failed! Please try again later.';
      messageClass.value = 'bg-red-500 text-white';
    }
  };
  
  const handleRegister = async (credentials: { username: string; password: string }) => {
    try {
      const response = await fetch(`${config.public.BACKEND_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      if (response.ok) {
        message.value = 'Registration successful! Please log in.';
        messageClass.value = 'bg-green-500 text-white';
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        message.value = 'Registration failed! Please check your input.';
        messageClass.value = 'bg-red-500 text-white';
      }
    } catch (error) {
      message.value = 'Registration Failed! Please try again later.';
      messageClass.value = 'bg-red-500 text-white';
    }
  };

  const deleteAccount = async () => {
    try {
      const { error } = await useFetch(`${config.public.BACKEND_BASE_URL}/api/auth`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (error.value) {
        message.value = 'Failed to delete account. Please try again.';
        messageClass.value = 'bg-red-500 text-white';
      } else {
        message.value = 'Account deleted successfully!';
        messageClass.value = 'bg-green-500 text-white';
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    } catch (err) {
      message.value = 'Failed to delete account. Please try again.';
      messageClass.value = 'bg-red-500 text-white';
    }
  };

  return {
    handleLogin,
    handleRegister,
    deleteAccount,
    message,
    messageClass
  };
};