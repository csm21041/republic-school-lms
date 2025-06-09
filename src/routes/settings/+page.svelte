<script lang="ts">
  import { Save, Bell, Shield, Palette, Globe, Download, Trash2, Eye, EyeOff } from 'lucide-svelte';
  import { currentUser, updateUser } from '$lib/stores/auth';

  let selectedTab = 'profile'; // 'profile', 'notifications', 'privacy', 'appearance', 'account'
  
  // Profile settings
  let profileData = {
    name: $currentUser?.name || '',
    email: $currentUser?.email || '',
    phone: $currentUser?.phone || '',
    bio: $currentUser?.bio || '',
    location: $currentUser?.location || ''
  };
  
  // Notification settings
  let notifications = {
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    assignmentReminders: true,
    gradeNotifications: true,
    chatMessages: true,
    weeklyDigest: false,
    marketingEmails: false
  };
  
  // Privacy settings
  let privacy = {
    profileVisibility: 'public', // 'public', 'students', 'private'
    showEmail: false,
    showPhone: false,
    allowDirectMessages: true,
    shareProgress: true,
    dataCollection: true
  };
  
  // Appearance settings
  let appearance = {
    theme: 'light', // 'light', 'dark', 'auto'
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    compactMode: false
  };
  
  // Account settings
  let showCurrentPassword = false;
  let showNewPassword = false;
  let showConfirmPassword = false;
  let passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  function saveProfileSettings() {
    if ($currentUser) {
      const updatedUser = {
        ...$currentUser,
        ...profileData
      };
      updateUser(updatedUser);
    }
    console.log('Profile settings saved:', profileData);
  }

  function saveNotificationSettings() {
    console.log('Notification settings saved:', notifications);
  }

  function savePrivacySettings() {
    console.log('Privacy settings saved:', privacy);
  }

  function saveAppearanceSettings() {
    console.log('Appearance settings saved:', appearance);
  }

  function changePassword() {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    console.log('Password change requested');
    // Reset form
    passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  function exportData() {
    console.log('Data export requested');
  }

  function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
    }
  }
</script>

<svelte:head>
  <title>Settings - Republic School of Journalism</title>
</svelte:head>

<div class="p-6 space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
    <p class="text-gray-600 mt-1">Manage your account preferences and privacy settings</p>
  </div>

  <div class="flex flex-col lg:flex-row gap-6">
    <!-- Settings Navigation -->
    <div class="lg:w-64">
      <nav class="space-y-1">
        <button
          class="w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 {selectedTab === 'profile' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}"
          on:click={() => selectedTab = 'profile'}
        >
          Profile Information
        </button>
        <button
          class="w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 {selectedTab === 'notifications' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}"
          on:click={() => selectedTab = 'notifications'}
        >
          Notifications
        </button>
        <button
          class="w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 {selectedTab === 'privacy' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}"
          on:click={() => selectedTab = 'privacy'}
        >
          Privacy & Security
        </button>
        <button
          class="w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 {selectedTab === 'appearance' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}"
          on:click={() => selectedTab = 'appearance'}
        >
          Appearance
        </button>
        <button
          class="w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 {selectedTab === 'account' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}"
          on:click={() => selectedTab = 'account'}
        >
          Account Management
        </button>
      </nav>
    </div>

    <!-- Settings Content -->
    <div class="flex-1">
      {#if selectedTab === 'profile'}
        <!-- Profile Settings -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
          
          <form on:submit|preventDefault={saveProfileSettings} class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  bind:value={profileData.name}
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  bind:value={profileData.email}
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  bind:value={profileData.phone}
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label for="location" class="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  bind:value={profileData.location}
                  placeholder="City, Country"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                bind:value={profileData.bio}
                rows="4"
                placeholder="Tell us about yourself..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>
            
            <div class="flex justify-end">
              <button type="submit" class="btn btn-primary flex items-center space-x-2">
                <Save class="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

      {:else if selectedTab === 'notifications'}
        <!-- Notification Settings -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
          
          <form on:submit|preventDefault={saveNotificationSettings} class="space-y-6">
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900">General Notifications</h3>
              
              <div class="space-y-3">
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Email Notifications</span>
                  <input
                    type="checkbox"
                    bind:checked={notifications.emailNotifications}
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
                
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Push Notifications</span>
                  <input
                    type="checkbox"
                    bind:checked={notifications.pushNotifications}
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
              </div>
            </div>
            
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900">Course Notifications</h3>
              
              <div class="space-y-3">
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Course Updates</span>
                  <input
                    type="checkbox"
                    bind:checked={notifications.courseUpdates}
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
                
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Assignment Reminders</span>
                  <input
                    type="checkbox"
                    bind:checked={notifications.assignmentReminders}
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
                
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Grade Notifications</span>
                  <input
                    type="checkbox"
                    bind:checked={notifications.gradeNotifications}
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
                
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Chat Messages</span>
                  <input
                    type="checkbox"
                    bind:checked={notifications.chatMessages}
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
              </div>
            </div>
            
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900">Marketing & Updates</h3>
              
              <div class="space-y-3">
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Weekly Digest</span>
                  <input
                    type="checkbox"
                    bind:checked={notifications.weeklyDigest}
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
                
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Marketing Emails</span>
                  <input
                    type="checkbox"
                    bind:checked={notifications.marketingEmails}
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button type="submit" class="btn btn-primary flex items-center space-x-2">
                <Bell class="w-4 h-4" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        </div>

      {:else if selectedTab === 'privacy'}
        <!-- Privacy Settings -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Privacy & Security</h2>
          
          <form on:submit|preventDefault={savePrivacySettings} class="space-y-6">
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900">Profile Visibility</h3>
              
              <div class="space-y-3">
                <label class="flex items-center space-x-3">
                  <input
                    type="radio"
                    bind:group={privacy.profileVisibility}
                    value="public"
                    class="text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span class="text-sm font-medium text-gray-900">Public</span>
                    <p class="text-xs text-gray-500">Anyone can see your profile</p>
                  </div>
                </label>
                
                <label class="flex items-center space-x-3">
                  <input
                    type="radio"
                    bind:group={privacy.profileVisibility}
                    value="students"
                    class="text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span class="text-sm font-medium text-gray-900">Students Only</span>
                    <p class="text-xs text-gray-500">Only other students can see your profile</p>
                  </div>
                </label>
                
                <label class="flex items-center space-x-3">
                  <input
                    type="radio"
                    bind:group={privacy.profileVisibility}
                    value="private"
                    class="text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span class="text-sm font-medium text-gray-900">Private</span>
                    <p class="text-xs text-gray-500">Only you can see your profile</p>
                  </div>
                </label>
              </div>
            </div>
            
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900">Contact Information</h3>
              
              <div class="space-y-3">
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Show Email Address</span>
                  <input
                    type="checkbox"
                    bind:checked={privacy.showEmail}
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
                
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Show Phone Number</span>
                  <input
                    type="checkbox"
                    bind:checked={privacy.showPhone}
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
              </div>
            </div>
            
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900">Communication</h3>
              
              <div class="space-y-3">
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Allow Direct Messages</span>
                  <input
                    type="checkbox"
                    bind:checked={privacy.allowDirectMessages}
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
                
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Share Course Progress</span>
                  <input
                    type="checkbox"
                    bind:checked={privacy.shareProgress}
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
                
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Allow Data Collection for Analytics</span>
                  <input
                    type="checkbox"
                    bind:checked={privacy.dataCollection}
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button type="submit" class="btn btn-primary flex items-center space-x-2">
                <Shield class="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </form>
        </div>

      {:else if selectedTab === 'appearance'}
        <!-- Appearance Settings -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Appearance & Language</h2>
          
          <form on:submit|preventDefault={saveAppearanceSettings} class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="theme" class="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <select
                  id="theme"
                  bind:value={appearance.theme}
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              
              <div>
                <label for="language" class="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  id="language"
                  bind:value={appearance.language}
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <div>
                <label for="timezone" class="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  id="timezone"
                  bind:value={appearance.timezone}
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              
              <div>
                <label for="dateFormat" class="block text-sm font-medium text-gray-700 mb-1">
                  Date Format
                </label>
                <select
                  id="dateFormat"
                  bind:value={appearance.dateFormat}
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="flex items-center space-x-3">
                <input
                  type="checkbox"
                  bind:checked={appearance.compactMode}
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span class="text-sm font-medium text-gray-900">Compact Mode</span>
                  <p class="text-xs text-gray-500">Use a more compact layout to fit more content</p>
                </div>
              </label>
            </div>
            
            <div class="flex justify-end">
              <button type="submit" class="btn btn-primary flex items-center space-x-2">
                <Palette class="w-4 h-4" />
                <span>Save Appearance</span>
              </button>
            </div>
          </form>
        </div>

      {:else if selectedTab === 'account'}
        <!-- Account Management -->
        <div class="space-y-6">
          <!-- Change Password -->
          <div class="card p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
            
            <form on:submit|preventDefault={changePassword} class="space-y-4">
              <div>
                <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div class="relative">
                  {#if showCurrentPassword}
                    <input
                      id="currentPassword"
                      type="text"
                      bind:value={passwordData.currentPassword}
                      required
                      class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  {:else}
                    <input
                      id="currentPassword"
                      type="password"
                      bind:value={passwordData.currentPassword}
                      required
                      class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  {/if}
                  <button
                    type="button"
                    on:click={() => showCurrentPassword = !showCurrentPassword}
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {#if showCurrentPassword}
                      <EyeOff class="w-4 h-4" />
                    {:else}
                      <Eye class="w-4 h-4" />
                    {/if}
                  </button>
                </div>
              </div>
              
              <div>
                <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div class="relative">
                  {#if showNewPassword}
                    <input
                      id="newPassword"
                      type="text"
                      bind:value={passwordData.newPassword}
                      required
                      class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  {:else}
                    <input
                      id="newPassword"
                      type="password"
                      bind:value={passwordData.newPassword}
                      required
                      class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  {/if}
                  <button
                    type="button"
                    on:click={() => showNewPassword = !showNewPassword}
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {#if showNewPassword}
                      <EyeOff class="w-4 h-4" />
                    {:else}
                      <Eye class="w-4 h-4" />
                    {/if}
                  </button>
                </div>
              </div>
              
              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div class="relative">
                  {#if showConfirmPassword}
                    <input
                      id="confirmPassword"
                      type="text"
                      bind:value={passwordData.confirmPassword}
                      required
                      class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  {:else}
                    <input
                      id="confirmPassword"
                      type="password"
                      bind:value={passwordData.confirmPassword}
                      required
                      class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  {/if}
                  <button
                    type="button"
                    on:click={() => showConfirmPassword = !showConfirmPassword}
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {#if showConfirmPassword}
                      <EyeOff class="w-4 h-4" />
                    {:else}
                      <Eye class="w-4 h-4" />
                    {/if}
                  </button>
                </div>
              </div>
              
              <div class="flex justify-end">
                <button type="submit" class="btn btn-primary">
                  Change Password
                </button>
              </div>
            </form>
          </div>
          
          <!-- Data Export -->
          <div class="card p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Data Export</h2>
            <p class="text-gray-600 mb-4">Download a copy of your personal data and course progress.</p>
            
            <button 
              on:click={exportData}
              class="btn btn-secondary flex items-center space-x-2"
            >
              <Download class="w-4 h-4" />
              <span>Export My Data</span>
            </button>
          </div>
          
          <!-- Delete Account -->
          <div class="card p-6 border-error-200">
            <h2 class="text-xl font-bold text-error-900 mb-4">Delete Account</h2>
            <p class="text-error-700 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            
            <button 
              on:click={deleteAccount}
              class="btn bg-error-600 text-white hover:bg-error-700 flex items-center space-x-2"
            >
              <Trash2 class="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>