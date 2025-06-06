<script lang="ts">
  import { Search, Filter, Star, Users, Clock, BookOpen, Play } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';
  import { courses } from '../stores/courses';

  let searchQuery = '';
  let selectedCategory = 'All';
  let selectedLevel = 'All';
  let sortBy = 'popular';

  const categories = ['All', 'Digital Media', 'Investigative', 'Broadcast', 'Data Journalism', 'Ethics'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  $: filteredCourses = $courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return 0; // Would sort by creation date in real app
      default: // popular
        return b.studentsEnrolled - a.studentsEnrolled;
    }
  });

  function getLevelColor(level: string): string {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  function handleEnroll(courseId: string) {
    courses.update(courseList => 
      courseList.map(course => 
        course.id === courseId 
          ? { ...course, isEnrolled: true, progress: 0 }
          : course
      )
    );
  }
</script>

<Layout>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Course Catalog</h1>
        <p class="text-gray-600 mt-1">Discover and enroll in journalism courses</p>
      </div>
      <div class="text-sm text-gray-500">
        {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} available
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Search -->
        <div class="lg:col-span-2">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              bind:value={searchQuery}
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <!-- Category Filter -->
        <div>
          <select 
            bind:value={selectedCategory}
            class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {#each categories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
        </div>

        <!-- Level Filter -->
        <div>
          <select 
            bind:value={selectedLevel}
            class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {#each levels as level}
              <option value={level}>{level}</option>
            {/each}
          </select>
        </div>

        <!-- Sort -->
        <div>
          <select 
            bind:value={sortBy}
            class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {#each sortOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <!-- Course Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredCourses as course}
        <div class="card-hover overflow-hidden">
          <div class="relative">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              class="w-full h-48 object-cover"
            />
            <div class="absolute top-4 left-4">
              <span class="px-2 py-1 text-xs font-medium rounded-full {getLevelColor(course.level)}">
                {course.level}
              </span>
            </div>
            {#if course.isEnrolled}
              <div class="absolute top-4 right-4">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  Enrolled
                </span>
              </div>
            {/if}
          </div>
          
          <div class="p-6">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-bold text-lg text-gray-900 line-clamp-2">{course.title}</h3>
            </div>
            
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
            
            <div class="flex items-center space-x-2 mb-3">
              <img 
                src={course.instructorAvatar} 
                alt={course.instructor}
                class="w-6 h-6 rounded-full object-cover"
              />
              <span class="text-sm text-gray-600">by {course.instructor}</span>
            </div>
            
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <div class="flex items-center space-x-1">
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{course.rating}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <Users class="w-4 h-4" />
                  <span>{course.studentsEnrolled}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <Clock class="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
              </div>
            </div>
            
            {#if course.isEnrolled}
              <div class="mb-4">
                <div class="flex items-center justify-between mb-1">
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
            {/if}
            
            <div class="flex items-center justify-between">
              <div class="text-2xl font-bold text-primary-600">${course.price}</div>
              {#if course.isEnrolled}
                <a href="#/courses/{course.id}" class="btn btn-primary flex items-center space-x-2">
                  <Play class="w-4 h-4" />
                  <span>Continue</span>
                </a>
              {:else}
                <button 
                  class="btn btn-primary"
                  on:click={() => handleEnroll(course.id)}
                >
                  Enroll Now
                </button>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>

    {#if filteredCourses.length === 0}
      <div class="text-center py-12">
        <BookOpen class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
        <p class="text-gray-600">Try adjusting your search criteria or filters</p>
      </div>
    {/if}
  </div>
</Layout>