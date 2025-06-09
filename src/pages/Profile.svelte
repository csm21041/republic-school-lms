<script lang="ts">
  import { FileEdit as Edit, Mail, Phone, MapPin, Calendar, Award, BookOpen, Trophy, Save, X } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';
  import { currentUser } from '../stores/auth';
  import { courses } from '../stores/courses';

  let isEditing = false;
  let editedUser = { ...$currentUser };

  // Extended profile fields based on the form
  let profileData = {
    // Personal Information
    firstName: $currentUser?.name?.split(' ')[0] || '',
    lastName: $currentUser?.name?.split(' ')[1] || '',
    email: $currentUser?.email || '',
    phone: $currentUser?.phone || '',
    whatsapp: '',
    dateOfBirth: '',
    gender: '',
    
    // Address Information
    currentAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    permanentAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    sameAsCurrent: false,
    
    // Educational Background
    education: {
      tenthBoard: '',
      tenthPercentage: '',
      tenthYear: '',
      twelfthBoard: '',
      twelfthPercentage: '',
      twelfthYear: '',
      graduationUniversity: '',
      graduationDegree: '',
      graduationPercentage: '',
      graduationYear: '',
      postGraduationUniversity: '',
      postGraduationDegree: '',
      postGraduationPercentage: '',
      postGraduationYear: ''
    },
    
    // Professional Information
    workExperience: '',
    currentEmployment: '',
    organization: '',
    designation: '',
    workExperienceYears: '',
    
    // Course Information
    courseInterest: '',
    learningGoals: '',
    preferredSchedule: '',
    technicalSkills: '',
    
    // Additional Information
    languagesKnown: [],
    hobbies: '',
    achievements: '',
    references: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    
    // Emergency Contact
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    
    // Documents
    documents: {
      photo: null,
      tenthCertificate: null,
      twelfthCertificate: null,
      graduationCertificate: null,
      experienceLetter: null,
      idProof: null
    }
  };

  function toggleEdit() {
    if (isEditing) {
      saveProfileData();
    } else {
      // Start editing
      editedUser = { ...$currentUser };
    }
    isEditing = !isEditing;
  }

  function saveProfileData() {
    try {
      // Update user data
      const updatedUser = {
        ...$currentUser,
        name: `${profileData.firstName} ${profileData.lastName}`.trim(),
        email: profileData.email,
        phone: profileData.phone,
        bio: profileData.bio || `${profileData.courseInterest ? 'Interested in ' + profileData.courseInterest : 'Journalism student'}`
      };
      
      // Save to stores and localStorage
      currentUser.set(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      localStorage.setItem('profileData', JSON.stringify(profileData));
      
      console.log('Profile data saved successfully!');
    } catch (error) {
      console.error('Error saving profile data:', error);
    }
  }

  function cancelEdit() {
    isEditing = false;
    editedUser = { ...$currentUser };
  }

  function copyCurrentToPermanent() {
    if (profileData.sameAsCurrent) {
      profileData.permanentAddress = { ...profileData.currentAddress };
    }
  }

  function handleFileUpload(event: Event, documentType: string) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      profileData.documents[documentType] = target.files[0];
    }
  }

  $: enrolledCourses = $courses.filter(course => course.isEnrolled);
  $: completedCourses = $courses.filter(course => 
    $currentUser?.completedCourses?.includes(course.id)
  );
  $: totalProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0) / enrolledCourses.length)
    : 0;

  // Load saved profile data
  if (typeof window !== 'undefined') {
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        profileData = { ...profileData, ...parsed };
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    }
  }

  // Calculate profile completion percentage
  function calculateProfileCompletion() {
    const requiredFields = [
      profileData.firstName,
      profileData.lastName,
      profileData.email,
      profileData.phone,
      profileData.dateOfBirth,
      profileData.gender,
      profileData.currentAddress.street,
      profileData.currentAddress.city,
      profileData.currentAddress.state,
      profileData.currentAddress.pincode,
      profileData.education.tenthBoard,
      profileData.education.tenthPercentage,
      profileData.education.tenthYear,
      profileData.education.twelfthBoard,
      profileData.education.twelfthPercentage,
      profileData.education.twelfthYear,
      profileData.emergencyContact.name,
      profileData.emergencyContact.relationship,
      profileData.emergencyContact.phone
    ];
    
    const filledFields = requiredFields.filter(field => field && field.toString().trim() !== '').length;
    return Math.round((filledFields / requiredFields.length) * 100);
  }

  $: profileCompletion = calculateProfileCompletion();
  $: hasProfileData = profileData.firstName && profileData.lastName && profileData.email;

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
    'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh'
  ];

  const languages = [
    'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Urdu', 
    'Kannada', 'Odia', 'Malayalam', 'Punjabi', 'Assamese', 'Maithili', 'Sanskrit'
  ];

  // Sample data for demonstration
  function loadSampleData() {
    profileData = {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+91 9876543210',
      whatsapp: '+91 9876543210',
      dateOfBirth: '1995-06-15',
      gender: 'female',
      
      currentAddress: {
        street: '123, Green Park Extension',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110016',
        country: 'India'
      },
      permanentAddress: {
        street: '456, Model Town',
        city: 'Chandigarh',
        state: 'Punjab',
        pincode: '160022',
        country: 'India'
      },
      sameAsCurrent: false,
      
      education: {
        tenthBoard: 'CBSE',
        tenthPercentage: '92%',
        tenthYear: '2011',
        twelfthBoard: 'CBSE',
        twelfthPercentage: '89%',
        twelfthYear: '2013',
        graduationUniversity: 'Delhi University',
        graduationDegree: 'Bachelor of Arts (English)',
        graduationPercentage: '85%',
        graduationYear: '2016',
        postGraduationUniversity: 'Jamia Millia Islamia',
        postGraduationDegree: 'Master of Arts (Mass Communication)',
        postGraduationPercentage: '88%',
        postGraduationYear: '2018'
      },
      
      workExperience: '3-5',
      currentEmployment: 'employed',
      organization: 'Digital Media Solutions',
      designation: 'Content Writer',
      workExperienceYears: '4',
      
      courseInterest: 'digital-journalism',
      learningGoals: 'To enhance my digital journalism skills and learn advanced reporting techniques for online media platforms.',
      preferredSchedule: 'evening',
      technicalSkills: 'Adobe Photoshop, Video Editing (Premiere Pro), WordPress, Social Media Management, SEO Writing',
      
      languagesKnown: ['Hindi', 'English', 'Punjabi'],
      hobbies: 'Reading, Photography, Traveling, Writing blogs, Watching documentaries',
      achievements: 'Best Content Writer Award 2022, Published articles in leading magazines, Completed Google Analytics certification',
      
      references: {
        name: 'Dr. Priya Sharma',
        relationship: 'Former Professor',
        phone: '+91 9876543211',
        email: 'priya.sharma@jmi.ac.in'
      },
      
      emergencyContact: {
        name: 'Rajesh Johnson',
        relationship: 'Father',
        phone: '+91 9876543212',
        email: 'rajesh.johnson@email.com'
      },
      
      documents: {
        photo: null,
        tenthCertificate: null,
        twelfthCertificate: null,
        graduationCertificate: null,
        experienceLetter: null,
        idProof: null
      }
    };
  }
</script>

<Layout>
  <div class="p-6 max-w-6xl mx-auto space-y-6">
    <!-- Profile Header -->
    <div class="card p-8">
      <div class="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        <div class="relative">
          <img 
            src={$currentUser?.avatar} 
            alt={$currentUser?.name}
            class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          {#if isEditing}
            <button class="absolute bottom-2 right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors duration-200">
              <Edit class="w-4 h-4" />
            </button>
          {/if}
        </div>
        
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{$currentUser?.name}</h1>
          <p class="text-gray-600 mb-4">{$currentUser?.bio || 'Complete your profile to get started'}</p>
          
          <div class="flex flex-wrap gap-4 text-sm text-gray-500">
            <div class="flex items-center space-x-1">
              <Mail class="w-4 h-4" />
              <span>{$currentUser?.email}</span>
            </div>
            <div class="flex items-center space-x-1">
              <Phone class="w-4 h-4" />
              <span>{$currentUser?.phone || 'Not provided'}</span>
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
              class="btn btn-primary flex items-center space-x-2"
            >
              <Save class="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button 
              on:click={cancelEdit}
              class="btn btn-secondary flex items-center space-x-2"
            >
              <X class="w-4 h-4" />
              <span>Cancel</span>
            </button>
          {:else if !hasProfileData}
            <button 
              on:click={loadSampleData}
              class="btn btn-secondary flex items-center space-x-2 mr-2"
            >
              <span>Load Sample Data</span>
            </button>
            <button 
              on:click={toggleEdit}
              class="btn btn-primary flex items-center space-x-2"
            >
              <Edit class="w-4 h-4" />
              <span>Edit Profile</span>
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
      
      <!-- Profile Completion Progress -->
      {#if !hasProfileData || profileCompletion < 100}
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-blue-900">Profile Completion</span>
            <span class="text-sm font-bold text-blue-700">{profileCompletion}%</span>
          </div>
          <div class="w-full bg-blue-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style="width: {profileCompletion}%"
            ></div>
          </div>
          <p class="text-sm text-blue-700 mt-2">
            Complete your profile to unlock all features and get personalized recommendations.
          </p>
        </div>
      {/if}
    </div>

    {#if isEditing}
      <!-- Comprehensive Profile Form -->
      <div class="space-y-6">
        <!-- Personal Information -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                bind:value={profileData.firstName}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                bind:value={profileData.lastName}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                bind:value={profileData.email}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                bind:value={profileData.phone}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
              <input
                type="tel"
                bind:value={profileData.whatsapp}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <input
                type="date"
                bind:value={profileData.dateOfBirth}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                bind:value={profileData.gender}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Address Information</h2>
          
          <!-- Current Address -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Current Address</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                <textarea
                  bind:value={profileData.currentAddress.street}
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  bind:value={profileData.currentAddress.city}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <select
                  bind:value={profileData.currentAddress.state}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select State</option>
                  {#each states as state}
                    <option value={state}>{state}</option>
                  {/each}
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                <input
                  type="text"
                  bind:value={profileData.currentAddress.pincode}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  bind:value={profileData.currentAddress.country}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Permanent Address -->
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                bind:checked={profileData.sameAsCurrent}
                on:change={copyCurrentToPermanent}
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label class="text-sm font-medium text-gray-700">Same as current address</label>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Permanent Address</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                <textarea
                  bind:value={profileData.permanentAddress.street}
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={profileData.sameAsCurrent}
                  required
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  bind:value={profileData.permanentAddress.city}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={profileData.sameAsCurrent}
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <select
                  bind:value={profileData.permanentAddress.state}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={profileData.sameAsCurrent}
                  required
                >
                  <option value="">Select State</option>
                  {#each states as state}
                    <option value={state}>{state}</option>
                  {/each}
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                <input
                  type="text"
                  bind:value={profileData.permanentAddress.pincode}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={profileData.sameAsCurrent}
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  bind:value={profileData.permanentAddress.country}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={profileData.sameAsCurrent}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Educational Background -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Educational Background</h2>
          
          <!-- 10th Standard -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">10th Standard</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Board *</label>
                <input
                  type="text"
                  bind:value={profileData.education.tenthBoard}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Percentage/CGPA *</label>
                <input
                  type="text"
                  bind:value={profileData.education.tenthPercentage}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Year of Passing *</label>
                <input
                  type="number"
                  bind:value={profileData.education.tenthYear}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          <!-- 12th Standard -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">12th Standard</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Board *</label>
                <input
                  type="text"
                  bind:value={profileData.education.twelfthBoard}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Percentage/CGPA *</label>
                <input
                  type="text"
                  bind:value={profileData.education.twelfthPercentage}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Year of Passing *</label>
                <input
                  type="number"
                  bind:value={profileData.education.twelfthYear}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Graduation -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Graduation</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">University/College</label>
                <input
                  type="text"
                  bind:value={profileData.education.graduationUniversity}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                <input
                  type="text"
                  bind:value={profileData.education.graduationDegree}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Percentage/CGPA</label>
                <input
                  type="text"
                  bind:value={profileData.education.graduationPercentage}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Year of Passing</label>
                <input
                  type="number"
                  bind:value={profileData.education.graduationYear}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />