export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token').value
  if (!token) {
    return navigateTo('/login');
  }
});
  