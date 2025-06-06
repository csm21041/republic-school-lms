<script lang="ts">
  import { onMount } from 'svelte';
  import { isAuthenticated } from '../stores/auth';
  import Navbar from './Navbar.svelte';
  import Sidebar from './Sidebar.svelte';
  import { push } from 'svelte-spa-router';

  export let showSidebar = true;
  export let showNavbar = true;

  let sidebarOpen = false;

  onMount(() => {
    // Redirect to login if not authenticated and not on home page
    const unsubscribe = isAuthenticated.subscribe(authenticated => {
      if (!authenticated && window.location.hash !== '#/' && window.location.hash !== '#/login') {
        push('/login');
      }
    });

    return unsubscribe;
  });

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

<div class="min-h-screen bg-gray-50">
  {#if showNavbar}
    <Navbar on:toggleSidebar={toggleSidebar} />
  {/if}
  
  <div class="flex">
    {#if showSidebar && $isAuthenticated}
      <Sidebar bind:isOpen={sidebarOpen} />
    {/if}
    
    <main class="flex-1 {showSidebar && $isAuthenticated ? 'lg:ml-64' : ''} transition-all duration-300">
      <slot />
    </main>
  </div>
</div>