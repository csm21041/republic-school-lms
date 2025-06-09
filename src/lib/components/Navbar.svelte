<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Menu, Bell, User, LogOut } from 'lucide-svelte';
  import { currentUser, logout } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  const dispatch = createEventDispatcher();

  function toggleSidebar() {
    dispatch('toggleSidebar');
  }

  function handleLogout() {
    logout();
    goto('/login');
  }

  function goToProfile() {
    goto('/profile');
  }
</script>

<nav class="bg-white shadow-sm border-b border-gray-200">
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex items-center">
        <button
          on:click={toggleSidebar}
          class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
        >
          <Menu class="h-6 w-6" />
        </button>
        
        <div class="flex-shrink-0 flex items-center ml-4 lg:ml-0">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">R</span>
          </div>
          <span class="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
            Republic School of Journalism
          </span>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <!-- Notifications -->
        <button class="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
          <Bell class="h-6 w-6" />
        </button>

        <!-- User Menu -->
        {#if $currentUser}
          <div class="relative flex items-center space-x-3">
            <img
              src={$currentUser.avatar}
              alt={$currentUser.name}
              class="h-8 w-8 rounded-full object-cover"
            />
            <div class="hidden md:block">
              <p class="text-sm font-medium text-gray-900">{$currentUser.name}</p>
              <p class="text-xs text-gray-500">{$currentUser.email}</p>
            </div>
            
            <!-- Dropdown Menu -->
            <div class="flex items-center space-x-1">
              <button
                on:click={goToProfile}
                class="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
                title="Profile"
              >
                <User class="h-5 w-5" />
              </button>
              <button
                on:click={handleLogout}
                class="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
                title="Logout"
              >
                <LogOut class="h-5 w-5" />
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</nav>