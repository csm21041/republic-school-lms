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
      lastQualificationDegree: '',
      lastQualificationInstitution: '',
      lastQualificationYear: '',
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
    workExperienceDetails: '',
    
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
    
    // Parent/Guardian Information
    parentGuardian: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    
    // Medical Information
    medicalInfo: {
      bloodGroup: '',
      medicalConditions: ''
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
      profileData.parentGuardian.name,
      profileData.parentGuardian.relationship,
      profileData.parentGuardian.phone,
      profileData.medicalInfo.bloodGroup,
      profileData.medicalInfo.medicalConditions,
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
        lastQualificationDegree: 'Master of Arts (Mass Communication)',
        lastQualificationInstitution: 'Jamia Millia Islamia',
        lastQualificationYear: '2018',
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
      workExperienceDetails: 'Working as a content writer for digital media platforms, creating engaging articles and managing social media content.',
      
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
      
      parentGuardian: {
        name: 'Rajesh Johnson',
        relationship: 'Father',
        phone: '+91 9876543212',
        email: 'rajesh.johnson@email.com'
      },
      
      medicalInfo: {
        bloodGroup: 'O+',
        medicalConditions: 'No known allergies or medical conditions'
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
          
          <!-- Last Qualification -->
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Last Qualification *</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Degree/Qualification *</label>
                <input
                  type="text"
                  bind:value={profileData.education.lastQualificationDegree}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Bachelor of Arts, Master of Science"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Institution/University *</label>
                <input
                  type="text"
                  bind:value={profileData.education.lastQualificationInstitution}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Delhi University, IIT Delhi"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Year of Passing *</label>
                <input
                  type="number"
                  bind:value={profileData.education.lastQualificationYear}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="1980"
                  max="2030"
                  placeholder="e.g., 2020"
                  required
                />
              </div>
            </div>
          </div>
          
          <!-- 10th Standard -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">10th Standard</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Board/University</label>
                <input
                  type="text"
                  bind:value={profileData.education.tenthBoard}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Percentage/Grade</label>
                <input
                  type="text"
                  bind:value={profileData.education.tenthPercentage}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Year of Passing</label>
                <input
                  type="number"
                  bind:value={profileData.education.tenthYear}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="1980"
                  max="2030"
                />
              </div>
            </div>
          </div>

          <!-- 12th Standard -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">12th Standard</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Board/University</label>
                <input
                  type="text"
                  bind:value={profileData.education.twelfthBoard}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Percentage/Grade</label>
                <input
                  type="text"
                  bind:value={profileData.education.twelfthPercentage}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Year of Passing</label>
                <input
                  type="number"
                  bind:value={profileData.education.twelfthYear}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="1980"
                  max="2030"
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
                  min="1980"
                  max="2030"
                />
              </div>
            </div>
          </div>

          <!-- Post Graduation -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Post Graduation (if applicable)</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">University/College</label>
                <input
                  type="text"
                  bind:value={profileData.education.postGraduationUniversity}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                <input
                  type="text"
                  bind:value={profileData.education.postGraduationDegree}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Percentage/CGPA</label>
                <input
                  type="text"
                  bind:value={profileData.education.postGraduationPercentage}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Year of Passing</label>
                <input
                  type="number"
                  bind:value={profileData.education.postGraduationYear}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="1980"
                  max="2030"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Professional Information -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Professional Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Work Experience</label>
              <select
                bind:value={profileData.workExperience}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select Experience</option>
                <option value="fresher">Fresher</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Employment Status</label>
              <select
                bind:value={profileData.currentEmployment}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select Status</option>
                <option value="employed">Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
                <option value="freelancer">Freelancer</option>
                <option value="entrepreneur">Entrepreneur</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Organization</label>
              <input
                type="text"
                bind:value={profileData.organization}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Designation</label>
              <input
                type="text"
                bind:value={profileData.designation}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Work Experience Details</label>
              <textarea
                bind:value={profileData.workExperienceDetails}
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe your work experience, roles, and responsibilities..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Course & Learning Information -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Course & Learning Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Course of Interest</label>
              <select
                bind:value={profileData.courseInterest}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select Course</option>
                <option value="digital-journalism">Digital Journalism</option>
                <option value="investigative-reporting">Investigative Reporting</option>
                <option value="broadcast-journalism">Broadcast Journalism</option>
                <option value="sports-journalism">Sports Journalism</option>
                <option value="photojournalism">Photojournalism</option>
                <option value="data-journalism">Data Journalism</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Schedule</label>
              <select
                bind:value={profileData.preferredSchedule}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select Schedule</option>
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (1 PM - 4 PM)</option>
                <option value="evening">Evening (5 PM - 8 PM)</option>
                <option value="weekend">Weekend</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Learning Goals</label>
              <textarea
                bind:value={profileData.learningGoals}
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="What do you hope to achieve through this course?"
              ></textarea>
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
              <textarea
                bind:value={profileData.technicalSkills}
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="List your technical skills (software, tools, programming languages, etc.)"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Parent/Guardian Information -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Parent/Guardian Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Name *</label>
              <input
                type="text"
                bind:value={profileData.parentGuardian.name}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Relationship to Student *</label>
              <select
                bind:value={profileData.parentGuardian.relationship}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Select Relationship</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="guardian">Guardian</option>
                <option value="spouse">Spouse</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Contact Number *</label>
              <input
                type="tel"
                bind:value={profileData.parentGuardian.phone}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Email</label>
              <input
                type="email"
                bind:value={profileData.parentGuardian.email}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <!-- Emergency Contact Details -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Emergency Contact Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name *</label>
              <input
                type="text"
                bind:value={profileData.emergencyContact.name}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
              <select
                bind:value={profileData.emergencyContact.relationship}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Select Relationship</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="spouse">Spouse</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
                <option value="relative">Relative</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Number *</label>
              <input
                type="tel"
                bind:value={profileData.emergencyContact.phone}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Email</label>
              <input
                type="email"
                bind:value={profileData.emergencyContact.email}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <!-- Medical Information -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Medical Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Blood Group *</label>
              <select
                bind:value={profileData.medicalInfo.bloodGroup}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Any Medical Conditions (if applicable) *</label>
              <textarea
                bind:value={profileData.medicalInfo.medicalConditions}
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Please mention any medical conditions, allergies, or medications. Write 'None' if not applicable."
                required
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Additional Information</h2>
          
          <!-- Languages Known -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Languages Known</label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              {#each languages as language}
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    bind:group={profileData.languagesKnown}
                    value={language}
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span class="text-sm text-gray-700">{language}</span>
                </label>
              {/each}
            </div>
          </div>
          
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Hobbies & Interests</label>
              <textarea
                bind:value={profileData.hobbies}
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Tell us about your hobbies and interests..."
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Achievements & Awards</label>
              <textarea
                bind:value={profileData.achievements}
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="List your achievements, awards, certifications, etc."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- References -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">References</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Reference Name</label>
              <input
                type="text"
                bind:value={profileData.references.name}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
              <input
                type="text"
                bind:value={profileData.references.relationship}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Former Professor, Manager, etc."
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Reference Phone</label>
              <input
                type="tel"
                bind:value={profileData.references.phone}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Reference Email</label>
              <input
                type="email"
                bind:value={profileData.references.email}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <!-- Document Upload -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Document Upload</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
              <input
                type="file"
                on:change={(e) => handleFileUpload(e, 'photo')}
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">10th Certificate</label>
              <input
                type="file"
                on:change={(e) => handleFileUpload(e, 'tenthCertificate')}
                accept=".pdf,.jpg,.jpeg,.png"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">12th Certificate</label>
              <input
                type="file"
                on:change={(e) => handleFileUpload(e, 'twelfthCertificate')}
                accept=".pdf,.jpg,.jpeg,.png"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Graduation Certificate</label>
              <input
                type="file"
                on:change={(e) => handleFileUpload(e, 'graduationCertificate')}
                accept=".pdf,.jpg,.jpeg,.png"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Experience Letter</label>
              <input
                type="file"
                on:change={(e) => handleFileUpload(e, 'experienceLetter')}
                accept=".pdf,.jpg,.jpeg,.png"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ID Proof (Aadhar/PAN/Passport)</label>
              <input
                type="file"
                on:change={(e) => handleFileUpload(e, 'idProof')}
                accept=".pdf,.jpg,.jpeg,.png"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </div>
    {:else}
      <!-- Profile Display Mode -->
      <div class="space-y-6">
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

        <!-- Profile Completion Notice -->
        {#if !hasProfileData}
          <div class="card p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Profile Completion</h2>
            <div class="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <p class="text-warning-800">
                Complete your profile to get the most out of your learning experience. Click "Edit Profile" to add your educational background, contact information, and more.
              </p>
            </div>
          </div>
        {/if}

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
    {/if}
  </div>
</Layout>