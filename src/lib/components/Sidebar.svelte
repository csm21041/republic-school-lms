<script lang="ts">
  import { page } from '$app/stores';
  import { 
    Home, 
    BookOpen, 
    FileText, 
    Calendar, 
    MessageSquare, 
    BarChart3, 
    Users, 
    Settings,
    X
  } from 'lucide-svelte';

  export let isOpen = false;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Assignments', href: '/assignments', icon: FileText },
    { name: 'Lectures', href: '/lectures', icon: Calendar },
    { name: 'Discussions', href: '/chat', icon: MessageSquare },
    { name: 'Grades', href: '/grades', icon: BarChart3 },
    { name: 'Attendance', href: '/attendance', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  function closeSidebar() {
    isOpen = false;
  }

  $: currentPath = $page.url.pathname;
</script>

<!-- Mobile sidebar overlay -->
{#if isOpen}
  <div class="fixed inset-0 z-40 lg:hidden">
    <div class="fixed inset-0 bg-gray-600 bg-opacity-75" on:click={closeSidebar}></div>
  </div>
{/if}

<!-- Sidebar -->
<div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform {isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0">
  <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
    <span class="text-lg font-semibold text-gray-900">Menu</span>
    <button
      on:click={closeSidebar}
      class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
    >
      <X class="h-6 w-6" />
    </button>
  </div>

  <nav class="mt-5 px-2 space-y-1">
    {#each navigation as item}
      <a
        href={item.href}
        class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 {
          currentPath === item.href
            ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }"
        on:click={closeSidebar}
      >
        <svelte:component 
          this={item.icon} 
          class="mr-3 h-5 w-5 {currentPath === item.href ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}" 
        />
        {item.name}
      </a>
    {/each}
  </nav>

  <!-- User info at bottom -->
  <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
    <div class="text-xs text-gray-500 text-center">
      Republic School of Journalism
    </div>
  </div>
</div>