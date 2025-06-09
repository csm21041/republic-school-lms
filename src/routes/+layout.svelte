<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { currentUser, isAuthenticated } from '$lib/stores/auth';
  import Navbar from '$lib/components/Navbar.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import '../app.css';

  let sidebarOpen = $state(false);
  let showSidebar = $state(true);
  let showNavbar = $state(true);

  // Determine layout based on current route using runes
  $effect(() => {
    const path = $page.url.pathname;
    showSidebar = isAuthenticated.value && path !== '/login' && path !== '/';
    showNavbar = true;
  });

  onMount(() => {
    // Redirect to login if not authenticated and not on login page
    $effect(() => {
      const currentPath = $page.url.pathname;
      
      if (!isAuthenticated.value && currentPath !== '/login' && currentPath !== '/') {
        goto('/login');
      } else if (isAuthenticated.value && (currentPath === '/login' || currentPath === '/')) {
        goto('/dashboard');
      }
    });
  });

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

<div class="min-h-screen bg-gray-50">
  {#if showNavbar}
    <div class="fixed top-0 left-0 right-0 z-50">
      <Navbar on:toggleSidebar={toggleSidebar} />
    </div>
  {/if}
  
  <div class="flex {showNavbar ? 'pt-16' : ''}">
    {#if showSidebar && isAuthenticated.value}
      <Sidebar bind:isOpen={sidebarOpen} />
    {/if}
    
    <main class="flex-1 {showSidebar && isAuthenticated.value ? 'lg:ml-64' : ''} transition-all duration-300 overflow-y-auto max-h-screen">
      <slot />
    </main>
  </div>
</div>