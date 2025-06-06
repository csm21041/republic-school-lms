<script lang="ts">
  import { Edit, Mail, Phone, MapPin, Calendar, Award, BookOpen, Trophy } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';
  import { currentUser } from '../stores/auth';
  import { courses } from '../stores/courses';

  let isEditing = false;
  let editedUser = { ...$currentUser };

  function toggleEdit() {
    if (isEditing) {
      // Save changes
      currentUser.set(editedUser);
      localStorage.setItem('currentUser', JSON.stringify(editedUser));
    } else {
      // Start editing
      editedUser = { ...$currentUser };
    }
    isEditing = !isEditing;
  }

  function cancelEdit() {
    isEditing = false;
    editedUser = { ...$currentUser };
  }

  $: enrolledCourses = $courses.filter(course => course.isEnrolled);
  $: completedCourses = $courses.filter(course => 
    $currentUser?.completedCourses?.includes(course.id)
  );
  $: totalProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0) / enrolledCourses.length)
    : 0;
</script>

<Layout>
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <!-- Profile Header -->
    <div class="card p-8">
      <div class="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        <div class="relative">
          <img 
            src={isEditing ? editedUser.avatar : $currentUser?.avatar} 
            alt={isEditing ? editedUser.name : $currentUser?.name}
            class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          {#if isEditing}
            <button class="absolute bottom-2 right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors duration-200">
              <Edit class="w-4 h-4" />
            </button>
          {/if}
        </div>
        
        <div class="flex-1">
          {#if isEditing}
            <input 
              bind:value={editedUser.name}
              class="text-3xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 focus:border-primary-600 outline-none bg-transparent"
              placeholder="Full Name"
            />
            <textarea 
              bind:value={editedUser.bio}
              class="text-gray-600 mb-4 w-full border border-gray-300 rounded-lg p-2 focus:border-primary-600 outline-none resize-none"
              rows="3"
              placeholder="Tell us about yourself..."
            ></textarea>
          {:else}
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{$currentUser?.name}</h1>
            <p class="text-gray-600 mb-4">{$currentUser?.bio || 'No bio available'}</p>
          {/if}
          
          <div class="flex flex-wrap gap-4 text-sm text-gray-500">
            <div class="flex items-center space-x-1">
              <Mail class="w-4 h-4" />
              {#if isEditing}
                <input 
                  bind:value={editedUser.email}
                  class="border-b border-gray-300 focus:border-primary-600 outline-none bg-transparent"
                  type="email"
                />
              {:else}
                <span>{$currentUser?.email}</span>
              {/if}
            </div>
            <div class="flex items-center space-x-1">
              <Phone class="w-4 h-4" />
              {#if isEditing}
                <input 
                  bind:value={editedUser.phone}
                  class="border-b border-gray-300 focus:border-primary-600 outline-none bg-transparent"
                  placeholder="Phone number"
                />
              {:else}
                <span>{$currentUser?.phone || 'Not provided'}</span>
              {/if}
            </div>
            <div class="flex items-center space-x-1">
              <MapPin class="w-4 h-4" />
              {#if isEditing}
                <input 
                  bind:value={editedUser.location}
                  class="border-b border-gray-300 focus:border-primary-600 outline-none bg-transparent"
                  placeholder="Location"
                />
              {:else}
                <span>{$currentUser?.location || 'Not provided'}</span>
              {/if}
            </div>
            <div class="flex items-center space-x-1">
              <Calendar class="w-4 h-4" />
              <span>Joined {new Date($currentUser?.joinDate || '').toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div class="flex space-x-2">
          {#if isEditing}
            <button 
              on:click={toggleEdit}
              class="btn btn-primary"
            >
              Save Changes
            </button>
            <button 
              on:click={cancelEdit}
              class="btn btn-secondary"
            >
              Cancel
            </button>
          {:else}
            <button 
              on:click={toggleEdit}
              class="btn btn-primary flex items-center space-x-2"
            >
              <Edit class="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          {/if}
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6 text-center">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <BookOpen class="w-6 h-6 text-primary-600" />
        </div>
        <div class="text-2xl font-bold text-gray-900">{enrolledCourses.length}</div>
        <div class="text-sm text-gray-600">Enrolled Courses</div>
      </div>
      
      <div class="card p-6 text-center">
        <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Trophy class="w-6 h-6 text-success-600" />
        </div>
        <div class="text-2xl font-bold text-gray-900">{completedCourses.length}</div>
        <div class="text-sm text-gray-600">Completed Courses</div>
      </div>
      
      <div class="card p-6 text-center">
        <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Award class="w-6 h-6 text-warning-600" />
        </div>
        <div class="text-2xl font-bold text-gray-900">{$currentUser?.achievements?.length || 0}</div>
        <div class="text-sm text-gray-600">Achievements</div>
      </div>
      
      <div class="card p-6 text-center">
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <div class="text-blue-600 font-bold text-lg">{totalProgress}%</div>
        </div>
        <div class="text-2xl font-bold text-gray-900">Progress</div>
        <div class="text-sm text-gray-600">Average</div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Current Courses -->
      <div class="card p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Current Courses</h2>
        <div class="space-y-4">
          {#each enrolledCourses as course}
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center space-x-3 mb-3">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  class="w-12 h-12 rounded-lg object-cover"
                />
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">{course.title}</h3>
                  <p class="text-sm text-gray-600">by {course.instructor}</p>
                </div>
              </div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600">Progress</span>
                <span class="text-sm font-medium text-primary-600">{course.progress}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style="width: {course.progress}%"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Achievements -->
      <div class="card p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
        <div class="space-y-4">
          {#each $currentUser?.achievements || [] as achievement}
            <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div class="text-2xl">{achievement.icon}</div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{achievement.title}</h3>
                <p class="text-sm text-gray-600 mb-1">{achievement.description}</p>
                <p class="text-xs text-gray-500">
                  Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          {/each}
          
          {#if !$currentUser?.achievements || $currentUser.achievements.length === 0}
            <div class="text-center py-8 text-gray-500">
              <Award class="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No achievements yet</p>
              <p class="text-sm">Complete courses and assignments to earn achievements!</p>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Learning Progress -->
    <div class="card p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Learning Progress</h2>
      <div class="space-y-6">
        {#each enrolledCourses as course}
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900">{course.title}</h3>
              <span class="text-sm text-gray-600">{course.progress}% complete</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
                style="width: {course.progress}%"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>{course.lessons?.filter(l => l.isCompleted).length || 0} lessons completed</span>
              <span>{course.lessons?.length || 0} total lessons</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</Layout>