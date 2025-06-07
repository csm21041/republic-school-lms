<script lang="ts">
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import { 
    BookOpen, 
    Calendar, 
    Clock, 
    TrendingUp, 
    FileText,
    GraduationCap,
    Target,
    CheckCircle,
    AlertCircle
  } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';

  let activeTab = 'program';
  let markdownContent = {
    program: '',
    planning: '',
    schedule: '',
    dates: '',
    progress: ''
  };

  const tabs = [
    { id: 'program', label: 'Program Details', icon: GraduationCap },
    { id: 'planning', label: 'Course Planning', icon: BookOpen },
    { id: 'schedule', label: 'Schedule', icon: Clock },
    { id: 'dates', label: 'Important Dates', icon: Calendar },
    { id: 'progress', label: 'Progress Tracking', icon: TrendingUp }
  ];

  onMount(async () => {
    try {
      // Load all markdown files
      const files = {
        program: '/academic_plan/program_details.md',
        planning: '/academic_plan/course_planning.md',
        schedule: '/academic_plan/schedule_management.md',
        dates: '/academic_plan/important_dates.md',
        progress: '/academic_plan/progress_tracking.md'
      };

      for (const [key, path] of Object.entries(files)) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            const text = await response.text();
            markdownContent[key] = marked(text);
          } else {
            markdownContent[key] = `<p class="text-error-600">Error loading ${key} content. File not found.</p>`;
          }
        } catch (error) {
          markdownContent[key] = `<p class="text-error-600">Error loading ${key} content: ${error.message}</p>`;
        }
      }
    } catch (error) {
      console.error('Error loading academic plan:', error);
    }
  });

  // Quick stats for the overview cards
  const quickStats = [
    {
      title: 'Credits Completed',
      value: '15/120',
      percentage: 12.5,
      icon: BookOpen,
      color: 'primary'
    },
    {
      title: 'Current GPA',
      value: '3.7',
      percentage: 92.5,
      icon: TrendingUp,
      color: 'success'
    },
    {
      title: 'Attendance Rate',
      value: '84%',
      percentage: 84,
      icon: CheckCircle,
      color: 'blue'
    },
    {
      title: 'Courses Enrolled',
      value: '2',
      percentage: 100,
      icon: Calendar,
      color: 'warning'
    }
  ];
</script>

<Layout>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Academic Plan</h1>
        <p class="text-gray-600 mt-1">Manage your academic journey and track your progress</p>
      </div>
      
      <div class="flex items-center space-x-2">
        <span class="px-3 py-1 bg-success-100 text-success-700 text-sm rounded-full font-medium">
          Spring 2024
        </span>
        <span class="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full font-medium">
          Bachelor of Journalism
        </span>
      </div>
    </div>

    <!-- Quick Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each quickStats as stat}
        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm font-medium text-gray-600">{stat.title}</p>
              <p class="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div class="w-12 h-12 bg-{stat.color}-100 rounded-lg flex items-center justify-center">
              <svelte:component this={stat.icon} class="w-6 h-6 text-{stat.color}-600" />
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-{stat.color}-600 h-2 rounded-full transition-all duration-300"
              style="width: {stat.percentage}%"
            ></div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Navigation Tabs -->
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

        <!-- Quick Actions -->
        <div class="mt-6 card p-4">
          <h3 class="font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div class="space-y-2">
            <a href="#/courses" class="w-full btn btn-secondary text-sm py-2">
              View Courses
            </a>
            <a href="#/assignments" class="w-full btn btn-secondary text-sm py-2">
              Check Assignments
            </a>
            <a href="#/grades" class="w-full btn btn-secondary text-sm py-2">
              View Grades
            </a>
            <a href="#/calendar" class="w-full btn btn-secondary text-sm py-2">
              Academic Calendar
            </a>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="lg:col-span-3">
        <div class="card p-8">
          {#if activeTab === 'program'}
            <div class="flex items-center space-x-3 mb-6">
              <GraduationCap class="w-8 h-8 text-primary-600" />
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Program Details</h2>
                <p class="text-gray-600">Your degree program curriculum and requirements</p>
              </div>
            </div>
          {:else if activeTab === 'planning'}
            <div class="flex items-center space-x-3 mb-6">
              <BookOpen class="w-8 h-8 text-primary-600" />
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Course Planning</h2>
                <p class="text-gray-600">Semester-by-semester course schedule and planning</p>
              </div>
            </div>
          {:else if activeTab === 'schedule'}
            <div class="flex items-center space-x-3 mb-6">
              <Clock class="w-8 h-8 text-primary-600" />
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Schedule Management</h2>
                <p class="text-gray-600">Current class timetable and faculty information</p>
              </div>
            </div>
          {:else if activeTab === 'dates'}
            <div class="flex items-center space-x-3 mb-6">
              <Calendar class="w-8 h-8 text-primary-600" />
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Important Dates</h2>
                <p class="text-gray-600">Academic calendar and key deadlines</p>
              </div>
            </div>
          {:else if activeTab === 'progress'}
            <div class="flex items-center space-x-3 mb-6">
              <TrendingUp class="w-8 h-8 text-primary-600" />
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Progress Tracking</h2>
                <p class="text-gray-600">Monitor your academic progress and achievements</p>
              </div>
            </div>
          {/if}

          <!-- Markdown Content -->
          <div class="prose prose-lg max-w-none">
            <div class="markdown-content">
              {@html markdownContent[activeTab]}
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <div class="flex flex-wrap gap-3">
              <button class="btn btn-primary flex items-center space-x-2">
                <FileText class="w-4 h-4" />
                <span>Export Plan</span>
              </button>
              <button class="btn btn-secondary flex items-center space-x-2">
                <Target class="w-4 h-4" />
                <span>Set Goals</span>
              </button>
              <a href="#/calendar" class="btn btn-secondary flex items-center space-x-2">
                <Calendar class="w-4 h-4" />
                <span>View Calendar</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</Layout>

<style>
  :global(.markdown-content) {
    @apply text-gray-700 leading-relaxed;
  }

  :global(.markdown-content h1) {
    @apply text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0;
  }

  :global(.markdown-content h2) {
    @apply text-xl font-semibold text-gray-900 mb-3 mt-5;
  }

  :global(.markdown-content h3) {
    @apply text-lg font-semibold text-gray-900 mb-2 mt-4;
  }

  :global(.markdown-content h4) {
    @apply text-base font-semibold text-gray-900 mb-2 mt-3;
  }

  :global(.markdown-content p) {
    @apply mb-4;
  }

  :global(.markdown-content ul) {
    @apply list-disc list-inside mb-4 space-y-1;
  }

  :global(.markdown-content ol) {
    @apply list-decimal list-inside mb-4 space-y-1;
  }

  :global(.markdown-content li) {
    @apply text-gray-700;
  }

  :global(.markdown-content strong) {
    @apply font-semibold text-gray-900;
  }

  :global(.markdown-content em) {
    @apply italic;
  }

  :global(.markdown-content code) {
    @apply bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono;
  }

  :global(.markdown-content pre) {
    @apply bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4;
  }

  :global(.markdown-content blockquote) {
    @apply border-l-4 border-primary-500 pl-4 italic text-gray-600 mb-4;
  }

  :global(.markdown-content table) {
    @apply w-full border-collapse border border-gray-300 mb-4;
  }

  :global(.markdown-content th) {
    @apply border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left;
  }

  :global(.markdown-content td) {
    @apply border border-gray-300 px-4 py-2;
  }

  :global(.markdown-content a) {
    @apply text-primary-600 hover:text-primary-700 underline;
  }

  :global(.markdown-content hr) {
    @apply border-gray-300 my-6;
  }
</style>