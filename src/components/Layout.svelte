<script lang="ts">
  import { onMount } from 'svelte';
  import { useAuthStore } from '../stores/auth';
  import Navbar from './Navbar.svelte';
  import Sidebar from './Sidebar.svelte';
  import { push } from 'svelte-spa-router';

  export let showSidebar = true;
  export let showNavbar = true;

  let sidebarOpen = false;
  
  // Get auth state from Zustand store
  $: authState = useAuthStore();
  $: isAuthenticated = authState.isAuthenticated;

  onMount(() => {
    // Redirect to login if not authenticated and not on home page
    if (!isAuthenticated && window.location.hash !== '#/login') {
      push('/login');
    }
  });
  
  // Watch for auth state changes and redirect if needed
  $: {
    if (!isAuthenticated && window.location.hash !== '#/login') {
      push('/login');
    }
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

<div class="min-h-screen bg-gray-50">
  {#if showNavbar}
    <Navbar on:toggleSidebar={toggleSidebar} />
  {/if}
  
  <div class="flex">
    {#if showSidebar && isAuthenticated}
      <Sidebar bind:isOpen={sidebarOpen} />
    {/if}
    
    <main class="flex-1 {showSidebar && isAuthenticated ? 'lg:ml-64' : ''} transition-all duration-300">
      <slot />
    </main>
  </div>
</div>