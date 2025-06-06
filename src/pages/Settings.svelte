<script lang="ts">
  import { Bell, Shield, Globe, Accessibility, Smartphone, Key, Download, Trash2 } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';
  import { currentUser } from '../stores/auth';
  
  let activeTab = 'account';
  
  // Settings state
  let settings = {
    notifications: {
      email: true,
      push: true,
      assignments: true,
      announcements: true,
      messages: true,
      grades: true
    },
    privacy: {
      profileVisibility: 'public',
      showProgress: true,
      showAchievements: true,
      allowMessages: true
    },
    preferences: {
      language: 'en',
      timezone: 'UTC-5',
      theme: 'light',
      autoplay: true,
      subtitles: false
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false
    }
  };
  
  function saveSettings() {
    // In a real app, this would save to backend
    console.log('Settings saved:', settings);
    // Show success message
  }
  
  function exportData() {
    // In a real app, this would trigger data export
    console.log('Exporting user data...');
  }
  
  function deleteAccount() {
    // In a real app, this would show confirmation and delete account
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account...');
    }
  }
  
  const tabs = [
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'devices', label: 'Devices', icon: Smartphone },
    { id: 'security', label: 'Security', icon: Key }
  ];
</script>

<Layout>
  <div class="p-6 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
      <p class="text-gray-600 mt-1">Manage your account preferences and privacy settings</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Settings Navigation -->
      <div class="lg:col-span-1">
        <nav class="space-y-1">
          {#each tabs as tab}
            <button
              class="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 {activeTab === tab.id ? 'bg-primary-100 text-primary-700 border-r-4 border-primary-600' : 'text-gray-600 hover:bg-gray-100'}"
              on:click={() => activeTab = tab.id}
            >
              <svelte:component this={tab.icon} class="w-5 h-5" />
              <span class="font-medium">{tab.label}</span>
            </button>
          {/each}
        </nav>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-3">
        <div class="card p-6">
          {#if activeTab === 'account'}
            <div class="space-y-6">
              <h2 class="text-xl font-semibold text-gray-900">Account Information</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={$currentUser?.name}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={$currentUser?.email}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={$currentUser?.phone}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={$currentUser?.location}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  rows="4"
                  value={$currentUser?.bio}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
            </div>
            
          {:else if activeTab === 'notifications'}
            <div class="space-y-6">
              <h2 class="text-xl font-semibold text-gray-900">Notification Preferences</h2>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">Email Notifications</h3>
                    <p class="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" bind:checked={settings.notifications.email} class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">Push Notifications</h3>
                    <p class="text-sm text-gray-600">Receive push notifications on your device</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" bind:checked={settings.notifications.push} class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">Assignment Reminders</h3>
                    <p class="text-sm text-gray-600">Get reminded about upcoming assignments</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" bind:checked={settings.notifications.assignments} class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">Course Announcements</h3>
                    <p class="text-sm text-gray-600">Notifications for course updates and announcements</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" bind:checked={settings.notifications.announcements} class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
          {:else if activeTab === 'privacy'}
            <div class="space-y-6">
              <h2 class="text-xl font-semibold text-gray-900">Privacy Settings</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                  <select
                    bind:value={settings.privacy.profileVisibility}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="public">Public</option>
                    <option value="students">Students Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">Show Progress</h3>
                    <p class="text-sm text-gray-600">Allow others to see your course progress</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" bind:checked={settings.privacy.showProgress} class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">Show Achievements</h3>
                    <p class="text-sm text-gray-600">Display your achievements on your profile</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" bind:checked={settings.privacy.showAchievements} class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
          {:else if activeTab === 'preferences'}
            <div class="space-y-6">
              <h2 class="text-xl font-semibold text-gray-900">Learning Preferences</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    bind:value={settings.preferences.language}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    bind:value={settings.preferences.timezone}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC+0">GMT (UTC+0)</option>
                    <option value="UTC+1">Central European Time (UTC+1)</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select
                    bind:value={settings.preferences.theme}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">Auto-play Videos</h3>
                    <p class="text-sm text-gray-600">Automatically play next video in sequence</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" bind:checked={settings.preferences.autoplay} class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">Show Subtitles</h3>
                    <p class="text-sm text-gray-600">Display subtitles by default for videos</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" bind:checked={settings.preferences.subtitles} class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
          {:else if activeTab === 'accessibility'}
            <div class="space-y-6">
              <h2 class="text-xl font-semibold text-gray-900">Accessibility Options</h2>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">High Contrast Mode</h3>
                    <p class="text-sm text-gray-600">Increase contrast for better visibility</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" bind:checked={settings.accessibility.highContrast} class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">Large Text</h3>
                    <p class="text-sm text-gray-600">Increase text size for better readability</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" bind:checked={settings.accessibility.largeText} class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">Reduced Motion</h3>
                    <p class="text-sm text-gray-600">Minimize animations and transitions</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" bind:checked={settings.accessibility.reducedMotion} class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">Screen Reader Support</h3>
                    <p class="text-sm text-gray-600">Optimize for screen reader compatibility</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" bind:checked={settings.accessibility.screenReader} class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
          {:else if activeTab === 'devices'}
            <div class="space-y-6">
              <h2 class="text-xl font-semibold text-gray-900">Connected Devices</h2>
              
              <div class="space-y-4">
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <Smartphone class="w-8 h-8 text-gray-600" />
                      <div>
                        <h3 class="font-medium text-gray-900">iPhone 13 Pro</h3>
                        <p class="text-sm text-gray-600">Last active: 2 hours ago</p>
                        <p class="text-xs text-gray-500">New York, NY</p>
                      </div>
                    </div>
                    <span class="px-2 py-1 bg-success-100 text-success-700 text-xs rounded-full">Current</span>
                  </div>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <span class="text-gray-600 text-xs font-bold">💻</span>
                      </div>
                      <div>
                        <h3 class="font-medium text-gray-900">MacBook Pro</h3>
                        <p class="text-sm text-gray-600">Last active: 1 day ago</p>
                        <p class="text-xs text-gray-500">New York, NY</p>
                      </div>
                    </div>
                    <button class="text-error-600 hover:text-error-700 text-sm font-medium">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          {:else if activeTab === 'security'}
            <div class="space-y-6">
              <h2 class="text-xl font-semibold text-gray-900">Security Settings</h2>
              
              <div class="space-y-6">
                <div>
                  <h3 class="font-medium text-gray-900 mb-4">Password</h3>
                  <button class="btn btn-secondary">
                    Change Password
                  </button>
                </div>
                
                <div>
                  <h3 class="font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <p class="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                  <button class="btn btn-primary">
                    Enable 2FA
                  </button>
                </div>
                
                <div>
                  <h3 class="font-medium text-gray-900 mb-4">Data Management</h3>
                  <div class="space-y-3">
                    <button 
                      class="btn btn-secondary flex items-center space-x-2"
                      on:click={exportData}
                    >
                      <Download class="w-4 h-4" />
                      <span>Export My Data</span>
                    </button>
                    
                    <button 
                      class="btn bg-error-600 text-white hover:bg-error-700 flex items-center space-x-2"
                      on:click={deleteAccount}
                    >
                      <Trash2 class="w-4 h-4" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          {/if}
          
          <!-- Save Button -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <button 
              class="btn btn-primary"
              on:click={saveSettings}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</Layout>