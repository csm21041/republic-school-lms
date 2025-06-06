<script lang="ts">
  import { Star, Users, BookOpen, Award, ChevronRight, Play } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';

  const featuredCourses = [
    {
      title: 'Digital Journalism Fundamentals',
      instructor: 'Dr. Michael Chen',
      rating: 4.8,
      students: 1247,
      price: 299,
      image: 'https://images.pexels.com/photos/97080/pexels-photo-97080.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
    },
    {
      title: 'Investigative Reporting Masterclass',
      instructor: 'Sarah Williams',
      rating: 4.9,
      students: 543,
      price: 599,
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
    },
    {
      title: 'Broadcast Journalism Essentials',
      instructor: 'James Rodriguez',
      rating: 4.7,
      students: 892,
      price: 449,
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
    }
  ];

  const testimonials = [
    {
      name: 'Emily Rodriguez',
      role: 'Freelance Journalist',
      content: 'The courses at Republic School of Journalism transformed my career. The practical approach and expert instructors gave me the skills I needed to succeed.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      name: 'David Kim',
      role: 'News Reporter',
      content: 'Exceptional quality education with real-world applications. The investigative reporting course opened doors I never thought possible.',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      name: 'Sarah Thompson',
      role: 'Digital Media Specialist',
      content: 'The digital journalism program is cutting-edge. I learned skills that are directly applicable to today\'s media landscape.',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    }
  ];

  const stats = [
    { number: '5,000+', label: 'Students Enrolled' },
    { number: '50+', label: 'Expert Instructors' },
    { number: '100+', label: 'Courses Available' },
    { number: '95%', label: 'Success Rate' }
  ];

  const news = [
    {
      title: 'New Data Journalism Program Launched',
      date: '2024-01-25',
      excerpt: 'We\'re excited to announce our comprehensive data journalism program, featuring hands-on training with industry-standard tools.'
    },
    {
      title: 'Partnership with Leading News Organizations',
      date: '2024-01-20',
      excerpt: 'Republic School of Journalism partners with top news organizations to provide internship opportunities for our students.'
    },
    {
      title: 'Alumni Success Stories',
      date: '2024-01-15',
      excerpt: 'Our graduates continue to make their mark in the journalism industry, with recent placements at major news outlets.'
    }
  ];
</script>

<Layout showSidebar={false}>
  <!-- Hero Section -->
  <section class="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
    <div class="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Master the Art of
            <span class="text-yellow-400">Modern Journalism</span>
          </h1>
          <p class="text-xl mb-8 text-primary-100 leading-relaxed">
            Join Republic School of Journalism and learn from industry experts. 
            Develop the skills needed to excel in today's dynamic media landscape.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a href="#/login" class="btn bg-yellow-400 text-primary-900 hover:bg-yellow-300 font-semibold px-8 py-3 text-lg">
              Start Learning Today
            </a>
            <button class="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-3 text-lg flex items-center space-x-2">
              <Play class="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
        <div class="relative">
          <img 
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1" 
            alt="Journalism students in action"
            class="rounded-lg shadow-2xl"
          />
          <div class="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-xl">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <Award class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="font-bold text-gray-900">Certified Programs</p>
                <p class="text-sm text-gray-600">Industry-recognized certificates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats Section -->
  <section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        {#each stats as stat}
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
            <div class="text-gray-600 font-medium">{stat.label}</div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Featured Courses -->
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Courses</h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover our most popular journalism courses, designed by industry experts 
          to give you practical skills and real-world experience.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each featuredCourses as course}
          <div class="card-hover overflow-hidden">
            <img 
              src={course.image} 
              alt={course.title}
              class="w-full h-48 object-cover"
            />
            <div class="p-6">
              <h3 class="font-bold text-xl text-gray-900 mb-2">{course.title}</h3>
              <p class="text-gray-600 mb-4">by {course.instructor}</p>
              
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-2">
                  <div class="flex items-center space-x-1">
                    <Star class="w-4 h-4 text-yellow-400 fill-current" />
                    <span class="text-sm font-medium">{course.rating}</span>
                  </div>
                  <div class="flex items-center space-x-1 text-gray-500">
                    <Users class="w-4 h-4" />
                    <span class="text-sm">{course.students}</span>
                  </div>
                </div>
                <div class="text-2xl font-bold text-primary-600">${course.price}</div>
              </div>
              
              <button class="w-full btn btn-primary">
                Enroll Now
              </button>
            </div>
          </div>
        {/each}
      </div>

      <div class="text-center mt-12">
        <a href="#/courses" class="btn btn-secondary inline-flex items-center space-x-2">
          <span>View All Courses</span>
          <ChevronRight class="w-4 h-4" />
        </a>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
        <p class="text-xl text-gray-600">
          Hear from our successful graduates who are making their mark in journalism.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each testimonials as testimonial}
          <div class="card p-8 text-center">
            <img 
              src={testimonial.avatar} 
              alt={testimonial.name}
              class="w-20 h-20 rounded-full mx-auto mb-6 object-cover"
            />
            <blockquote class="text-gray-600 mb-6 italic">
              "{testimonial.content}"
            </blockquote>
            <div>
              <div class="font-bold text-gray-900">{testimonial.name}</div>
              <div class="text-sm text-gray-500">{testimonial.role}</div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Latest News -->
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest News & Updates</h2>
        <p class="text-xl text-gray-600">
          Stay updated with the latest developments at Republic School of Journalism.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each news as article}
          <article class="card p-6 hover:shadow-lg transition-shadow duration-300">
            <div class="text-sm text-primary-600 font-medium mb-2">
              {new Date(article.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <h3 class="font-bold text-xl text-gray-900 mb-3">{article.title}</h3>
            <p class="text-gray-600 mb-4">{article.excerpt}</p>
            <button class="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center space-x-1">
              <span>Read More</span>
              <ChevronRight class="w-4 h-4" />
            </button>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-20 bg-primary-600 text-white">
    <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journalism Journey?</h2>
      <p class="text-xl mb-8 text-primary-100">
        Join thousands of students who have transformed their careers with our comprehensive journalism programs.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#/login" class="btn bg-yellow-400 text-primary-900 hover:bg-yellow-300 font-semibold px-8 py-3 text-lg">
          Get Started Today
        </a>
        <button class="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-3 text-lg">
          Contact Admissions
        </button>
      </div>
    </div>
  </section>
</Layout>