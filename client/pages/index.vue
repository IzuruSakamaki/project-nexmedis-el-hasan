<template>
    <div>
        <Navbar />
        <h1>Welcome to My Social Media App</h1>
    </div>
</template>

<script>
    export default {
        middleware: 'auth',
    };
</script>