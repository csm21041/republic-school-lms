<script lang="ts">
  import router from 'svelte-spa-router';
  import { routes } from './routes';
  import { onMount } from 'svelte';
  import { currentUser, isAuthenticated } from './stores/auth';
  import './app.css';

  onMount(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      currentUser.set(JSON.parse(savedUser));
      isAuthenticated.set(true);
    }
  });
</script>

<main>
  <svelte:component this={router} {routes} />
</main>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
  
  :global(body) {
    margin: 0;
    overflow-x: hidden;
  }
</style>
