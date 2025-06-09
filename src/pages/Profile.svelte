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
                <option value="uncle">Uncle</option>
                <option value="aunt">Aunt</option>
                <option value="grandfather">Grandfather</option>
                <option value="grandmother">Grandmother</option>
                <option value="brother">Brother</option>
                <option value="sister">Sister</option>
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
                placeholder="Please mention any medical conditions, allergies, medications, or write 'None' if not applicable"
                required
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">This information is kept confidential and used only for emergency purposes</p>
            </div>
          </div>
        </div>

        <!-- Emergency Contact -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Emergency Contact</h2>
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
      </div>
    {:else}
      <!-- Profile Display Mode -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Profile Stats -->
        <div class="space-y-6">
          <!-- Learning Progress -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen class="w-5 h-5 mr-2 text-primary-600" />
              Learning Progress
            </h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Overall Progress</span>
                  <span>{totalProgress}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style="width: {totalProgress}%"
                  ></div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold text-primary-600">{enrolledCourses.length}</div>
                  <div class="text-sm text-gray-500">Active Courses</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-green-600">{completedCourses.length}</div>
                  <div class="text-sm text-gray-500">Completed</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Achievements -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Trophy class="w-5 h-5 mr-2 text-yellow-600" />
              Achievements
            </h3>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award class="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <div class="font-medium text-sm">First Course Completed</div>
                  <div class="text-xs text-gray-500">Completed your first journalism course</div>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen class="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div class="font-medium text-sm">Active Learner</div>
                  <div class="text-xs text-gray-500">Logged in for 7 consecutive days</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Profile Information -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Contact Information -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center space-x-3">
                <Mail class="w-5 h-5 text-gray-400" />
                <div>
                  <div class="text-sm text-gray-500">Email</div>
                  <div class="font-medium">{$currentUser?.email}</div>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <Phone class="w-5 h-5 text-gray-400" />
                <div>
                  <div class="text-sm text-gray-500">Phone</div>
                  <div class="font-medium">{$currentUser?.phone || 'Not provided'}</div>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <MapPin class="w-5 h-5 text-gray-400" />
                <div>
                  <div class="text-sm text-gray-500">Location</div>
                  <div class="font-medium">{profileData.currentAddress.city || 'Not provided'}</div>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <Calendar class="w-5 h-5 text-gray-400" />
                <div>
                  <div class="text-sm text-gray-500">Joined</div>
                  <div class="font-medium">{new Date($currentUser?.joinDate || '').toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Current Courses -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Current Courses</h3>
            {#if enrolledCourses.length > 0}
              <div class="space-y-4">
                {#each enrolledCourses as course}
                  <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex justify-between items-start mb-2">
                      <h4 class="font-medium text-gray-900">{course.title}</h4>
                      <span class="text-sm text-gray-500">{course.progress || 0}% complete</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        class="bg-primary-600 h-2 rounded-full"
                        style="width: {course.progress || 0}%"
                      ></div>
                    </div>
                    <p class="text-sm text-gray-600">{course.description}</p>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="text-gray-500">No courses enrolled yet. Browse our course catalog to get started!</p>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
</Layout>