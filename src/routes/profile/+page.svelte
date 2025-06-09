<script lang="ts">
  import { FileEdit as Edit, Mail, Phone, MapPin, Calendar, User, BookOpen, Heart, Globe, Award, FileText, Users, Briefcase } from 'lucide-svelte';
  import { currentUser, updateUser, authLoading } from '$lib/stores/auth';
  import { profileAPI } from '$lib/api/profile';
  import type { ProfileUpdateRequest } from '$lib/api/profile';
  import { onMount } from 'svelte';

  let isEditing = false;
  let isSaving = false;
  let saveError = '';
  let saveSuccess = '';
  let isLoadingProfile = false;
  let avatarFile: File | null = null;
  let avatarPreview = '';
  
  let profileData = {
    // Personal Information
    personal: {
      name: $currentUser?.name || '',
      email: $currentUser?.email || '',
      phone: $currentUser?.phone || '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      religion: '',
      category: '',
      maritalStatus: '',
      profilePhoto: $currentUser?.avatar || ''
    },
    
    // Address Information
    address: {
      currentAddress: '',
      currentCity: '',
      currentState: '',
      currentPincode: '',
      permanentAddress: '',
      permanentCity: '',
      permanentState: '',
      permanentPincode: '',
      sameAsCurrent: false
    },
    
    // Educational Background
    education: {
      tenthBoard: '',
      tenthSchool: '',
      tenthYear: '',
      tenthPercentage: '',
      twelfthBoard: '',
      twelfthSchool: '',
      twelfthYear: '',
      twelfthPercentage: '',
      graduationDegree: '',
      graduationUniversity: '',
      graduationYear: '',
      graduationPercentage: '',
      postGraduationDegree: '',
      postGraduationUniversity: '',
      postGraduationYear: '',
      postGraduationPercentage: '',
      lastQualificationDegree: '',
      lastQualificationInstitution: '',
      lastQualificationYear: ''
    },
    
    // Parent/Guardian Information
    parentGuardian: {
      name: '',
      relationship: '',
      contactNumber: '',
      email: '',
      occupation: '',
      address: ''
    },
    
    // Emergency Contact
    emergencyContact: {
      name: '',
      relationship: '',
      contactNumber: '',
      email: '',
      address: ''
    },
    
    // Medical Information
    medical: {
      bloodGroup: '',
      medicalConditions: '',
      allergies: '',
      medications: ''
    },
    
    // Professional Information
    professional: {
      currentEmployment: '',
      designation: '',
      organization: '',
      workExperience: '',
      previousEmployment: '',
      skills: ''
    },
    
    // Course & Learning Information
    learning: {
      courseInterests: '',
      careerGoals: '',
      technicalSkills: '',
      preferredLearningStyle: '',
      expectations: ''
    },
    
    // Additional Information
    additional: {
      languages: '',
      hobbies: '',
      achievements: '',
      extracurricular: '',
      socialMedia: ''
    },
    
    // References
    references: {
      academicRefName: '',
      academicRefDesignation: '',
      academicRefInstitution: '',
      academicRefContact: '',
      professionalRefName: '',
      professionalRefDesignation: '',
      professionalRefOrganization: '',
      professionalRefContact: ''
    }
  };

  // Load profile data from API
  async function loadProfileData() {
    isLoadingProfile = true;
    saveError = '';
    
    try {
      const response = await profileAPI.getProfile();
      
      if (response.success && response.data) {
        // Update current user
        updateUser(response.data);
        
        // Update profile data if available
        if (response.data.profileData) {
          profileData = { ...profileData, ...response.data.profileData };
        }
        
        // Update basic info from user data
        profileData.personal.name = response.data.name;
        profileData.personal.email = response.data.email;
        profileData.personal.phone = response.data.phone || '';
        profileData.personal.profilePhoto = response.data.avatar;
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      saveError = error.message || 'Failed to load profile data';
      
      // Fallback to localStorage
      const savedData = localStorage.getItem('profileData');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          profileData = { ...profileData, ...parsed };
        } catch (parseError) {
          console.error('Error parsing saved data:', parseError);
        }
      }
    } finally {
      isLoadingProfile = false;
    }
  }

  // Save profile data to API
  async function saveProfileData() {
    isSaving = true;
    saveError = '';
    saveSuccess = '';
    
    try {
      // Prepare update request
      const updateRequest: ProfileUpdateRequest = {
        personal: {
          name: profileData.personal.name,
          phone: profileData.personal.phone,
          dateOfBirth: profileData.personal.dateOfBirth,
          gender: profileData.personal.gender,
          nationality: profileData.personal.nationality,
          religion: profileData.personal.religion,
          category: profileData.personal.category,
          maritalStatus: profileData.personal.maritalStatus,
        },
        address: profileData.address,
        education: profileData.education,
        parentGuardian: profileData.parentGuardian,
        emergencyContact: profileData.emergencyContact,
        medical: profileData.medical,
        professional: profileData.professional,
        learning: profileData.learning,
        additional: profileData.additional,
        references: profileData.references
      };
      
      const response = await profileAPI.updateProfile(updateRequest);
      
      if (response.success && response.data) {
        // Update current user
        updateUser(response.data);
        
        // Save to localStorage as backup
        localStorage.setItem('profileData', JSON.stringify(profileData));
        
        saveSuccess = 'Profile updated successfully!';
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          saveSuccess = '';
        }, 3000);
      } else {
        saveError = response.message || 'Failed to update profile';
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      saveError = error.message || 'Failed to update profile. Please try again.';
      
      // Save to localStorage as fallback
      localStorage.setItem('profileData', JSON.stringify(profileData));
    } finally {
      isSaving = false;
    }
  }

  async function toggleEdit() {
    if (isEditing) {
      await saveProfileData();
    }
    isEditing = !isEditing;
  }

  function cancelEdit() {
    isEditing = false;
    saveError = '';
    saveSuccess = '';
    loadProfileData(); // Reload original data
  }

  // Handle avatar upload
  async function handleAvatarUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;
    
    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      saveError = 'File size must be less than 5MB';
      return;
    }
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      saveError = 'Only JPEG, PNG, and WebP images are allowed';
      return;
    }
    
    avatarFile = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
  
  // Upload avatar
  async function uploadAvatar() {
    if (!avatarFile) return;
    
    isSaving = true;
    saveError = '';
    
    try {
      const response = await profileAPI.uploadAvatar(avatarFile);
      
      if (response.success && response.data) {
        // Update profile photo
        profileData.personal.profilePhoto = response.data.avatarUrl;
        
        // Update current user
        if ($currentUser) {
          updateUser({
            ...$currentUser,
            avatar: response.data.avatarUrl
          });
        }
        
        saveSuccess = 'Profile photo updated successfully!';
        avatarFile = null;
        avatarPreview = '';
        
        setTimeout(() => {
          saveSuccess = '';
        }, 3000);
      } else {
        saveError = response.message || 'Failed to upload avatar';
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      saveError = error.message || 'Failed to upload avatar';
    } finally {
      isSaving = false;
    }
  }

  function loadSampleData() {
    profileData = {
      personal: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1995-08-15',
        gender: 'Female',
        nationality: 'American',
        religion: 'Christianity',
        category: 'General',
        maritalStatus: 'Single',
        profilePhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      address: {
        currentAddress: '123 Main Street, Apt 4B',
        currentCity: 'New York',
        currentState: 'NY',
        currentPincode: '10001',
        permanentAddress: '456 Oak Avenue',
        permanentCity: 'Boston',
        permanentState: 'MA',
        permanentPincode: '02101',
        sameAsCurrent: false
      },
      education: {
        tenthBoard: 'CBSE',
        tenthSchool: 'St. Mary\'s High School',
        tenthYear: '2011',
        tenthPercentage: '92%',
        twelfthBoard: 'CBSE',
        twelfthSchool: 'St. Mary\'s Senior Secondary School',
        twelfthYear: '2013',
        twelfthPercentage: '89%',
        graduationDegree: 'Bachelor of Arts in English Literature',
        graduationUniversity: 'Columbia University',
        graduationYear: '2017',
        graduationPercentage: '3.8 GPA',
        postGraduationDegree: 'Master of Arts in Journalism',
        postGraduationUniversity: 'New York University',
        postGraduationYear: '2019',
        postGraduationPercentage: '3.9 GPA',
        lastQualificationDegree: 'Master of Arts in Journalism',
        lastQualificationInstitution: 'New York University',
        lastQualificationYear: '2019'
      },
      parentGuardian: {
        name: 'Robert Johnson',
        relationship: 'Father',
        contactNumber: '+1 (555) 987-6543',
        email: 'robert.johnson@email.com',
        occupation: 'Engineer',
        address: '456 Oak Avenue, Boston, MA 02101'
      },
      emergencyContact: {
        name: 'Emily Johnson',
        relationship: 'Sister',
        contactNumber: '+1 (555) 456-7890',
        email: 'emily.johnson@email.com',
        address: '789 Pine Street, Boston, MA 02102'
      },
      medical: {
        bloodGroup: 'O+',
        medicalConditions: 'None',
        allergies: 'Peanuts',
        medications: 'None'
      },
      professional: {
        currentEmployment: 'Freelance Writer',
        designation: 'Content Writer',
        organization: 'Self-employed',
        workExperience: '2 years',
        previousEmployment: 'Junior Reporter at Local News',
        skills: 'Writing, Research, Interviewing, Social Media'
      },
      learning: {
        courseInterests: 'Digital Journalism, Investigative Reporting',
        careerGoals: 'To become a renowned investigative journalist',
        technicalSkills: 'Adobe Creative Suite, WordPress, Social Media Management',
        preferredLearningStyle: 'Visual and Hands-on',
        expectations: 'Gain practical experience and industry connections'
      },
      additional: {
        languages: 'English (Native), Spanish (Intermediate), French (Basic)',
        hobbies: 'Reading, Photography, Traveling, Blogging',
        achievements: 'Dean\'s List, University Scholarship Recipient',
        extracurricular: 'University Newspaper Editor, Debate Club President',
        socialMedia: 'LinkedIn: sarah-johnson-journalist, Twitter: @sarahjwriter'
      },
      references: {
        academicRefName: 'Dr. Michael Chen',
        academicRefDesignation: 'Professor',
        academicRefInstitution: 'New York University',
        academicRefContact: 'michael.chen@nyu.edu',
        professionalRefName: 'Jane Smith',
        professionalRefDesignation: 'Editor-in-Chief',
        professionalRefOrganization: 'Local News Network',
        professionalRefContact: 'jane.smith@localnews.com'
      }
    };
    saveProfileData();
  }

  // Calculate profile completion percentage
  function calculateCompletion() {
    const requiredFields = [
      profileData.personal.name,
      profileData.personal.email,
      profileData.personal.phone,
      profileData.personal.dateOfBirth,
      profileData.personal.gender,
      profileData.address.currentAddress,
      profileData.address.currentCity,
      profileData.address.currentState,
      profileData.education.lastQualificationDegree,
      profileData.education.lastQualificationInstitution,
      profileData.education.lastQualificationYear,
      profileData.parentGuardian.name,
      profileData.parentGuardian.relationship,
      profileData.parentGuardian.contactNumber,
      profileData.emergencyContact.name,
      profileData.emergencyContact.relationship,
      profileData.emergencyContact.contactNumber,
      profileData.medical.bloodGroup,
      profileData.medical.medicalConditions
    ];
    
    const filledFields = requiredFields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / requiredFields.length) * 100);
  }

  $: completionPercentage = calculateCompletion();
  
  // Load profile data on component mount
  onMount(() => {
    loadProfileData();
  });
</script>

<svelte:head>
  <title>Profile - Republic School of Journalism</title>
</svelte:head>

<div class="p-6 max-w-6xl mx-auto space-y-6">
  <!-- Loading State -->
  {#if isLoadingProfile}
    <div class="flex items-center justify-center py-12">
      <div class="flex items-center space-x-3">
        <div class="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        <span class="text-gray-600">Loading profile...</span>
      </div>
    </div>
  {:else}
    
  <!-- Success/Error Messages -->
  {#if saveSuccess}
    <div class="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg flex items-start space-x-2">
      <div class="flex-shrink-0 mt-0.5">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium">Success</p>
        <p class="text-sm">{saveSuccess}</p>
      </div>
    </div>
  {/if}
  
  {#if saveError}
    <div class="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg flex items-start space-x-2">
      <div class="flex-shrink-0 mt-0.5">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium">Error</p>
        <p class="text-sm">{saveError}</p>
      </div>
    </div>
  {/if}

  <!-- Profile Header -->
  <div class="card p-8">
    <div class="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
      <div class="relative">
        <img 
          src={avatarPreview || profileData.personal.profilePhoto || $currentUser?.avatar} 
          alt={profileData.personal.name || $currentUser?.name}
          class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
        />
        {#if isEditing}
          <div class="absolute bottom-2 right-2">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              on:change={handleAvatarUpload}
              class="hidden"
              id="avatar-upload"
            />
            <label
              for="avatar-upload"
              class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors duration-200 cursor-pointer"
            >
              <Edit class="w-4 h-4" />
            </label>
          </div>
        {/if}
        
        {#if avatarFile}
          <div class="mt-2 flex space-x-2">
            <button
              on:click={uploadAvatar}
              disabled={isSaving}
              class="btn btn-primary text-xs px-3 py-1 disabled:opacity-50"
            >
              {isSaving ? 'Uploading...' : 'Upload'}
            </button>
            <button
              on:click={() => {
                avatarFile = null;
                avatarPreview = '';
              }}
              class="btn btn-secondary text-xs px-3 py-1"
            >
              Cancel
            </button>
          </div>
        {/if}
      </div>
      
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {profileData.personal.name || $currentUser?.name || 'Complete Your Profile'}
        </h1>
        <p class="text-gray-600 mb-4">
          {profileData.learning.careerGoals || 'Student at Republic School of Journalism'}
        </p>
        
        <div class="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
          {#if profileData.personal.email}
            <div class="flex items-center space-x-1">
              <Mail class="w-4 h-4" />
              <span>{profileData.personal.email}</span>
            </div>
          {/if}
          {#if profileData.personal.phone}
            <div class="flex items-center space-x-1">
              <Phone class="w-4 h-4" />
              <span>{profileData.personal.phone}</span>
            </div>
          {/if}
          {#if profileData.address.currentCity}
            <div class="flex items-center space-x-1">
              <MapPin class="w-4 h-4" />
              <span>{profileData.address.currentCity}, {profileData.address.currentState}</span>
            </div>
          {/if}
          {#if $currentUser?.joinDate}
            <div class="flex items-center space-x-1">
              <Calendar class="w-4 h-4" />
              <span>Joined {new Date($currentUser.joinDate).toLocaleDateString()}</span>
            </div>
          {/if}
        </div>

        <!-- Profile Completion -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Profile Completion</span>
            <span class="text-sm font-bold text-primary-600">{completionPercentage}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
              style="width: {completionPercentage}%"
            ></div>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col space-y-2">
        {#if isEditing}
          <button 
            on:click={toggleEdit}
            disabled={isSaving || $authLoading}
            class="btn btn-primary disabled:opacity-50"
          >
            {#if isSaving}
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            {:else}
              Save Changes
            {/if}
          </button>
          <button 
            on:click={cancelEdit}
            disabled={isSaving}
            class="btn btn-secondary"
          >
            Cancel
          </button>
        {:else}
          <button 
            on:click={toggleEdit}
            disabled={$authLoading}
            class="btn btn-primary flex items-center space-x-2"
          >
            <Edit class="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        {/if}
        <button 
          on:click={loadSampleData}
          disabled={isSaving || $authLoading}
          class="btn btn-secondary text-sm"
        >
          Load Sample Data
        </button>
      </div>
    </div>
  </div>

  <!-- Network Status Warning -->
  {#if !navigator.onLine}
    <div class="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg">
      <p class="text-sm font-medium">No Internet Connection</p>
      <p class="text-sm">Changes will be saved locally and synced when connection is restored.</p>
    </div>
  {/if}

  <!-- Profile Information Sections -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    
    <!-- Personal Information -->
    <div class="card p-6">
      <div class="flex items-center space-x-2 mb-4">
        <User class="w-5 h-5 text-primary-600" />
        <h2 class="text-xl font-bold text-gray-900">Personal Information</h2>
      </div>
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="text-sm font-medium text-gray-600">Full Name:</span>
            <p class="text-gray-900">{profileData.personal.name || 'Not provided'}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-600">Date of Birth:</span>
            <p class="text-gray-900">{profileData.personal.dateOfBirth || 'Not provided'}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="text-sm font-medium text-gray-600">Gender:</span>
            <p class="text-gray-900">{profileData.personal.gender || 'Not provided'}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-600">Nationality:</span>
            <p class="text-gray-900">{profileData.personal.nationality || 'Not provided'}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="text-sm font-medium text-gray-600">Religion:</span>
            <p class="text-gray-900">{profileData.personal.religion || 'Not provided'}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-600">Category:</span>
            <p class="text-gray-900">{profileData.personal.category || 'Not provided'}</p>
          </div>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-600">Marital Status:</span>
          <p class="text-gray-900">{profileData.personal.maritalStatus || 'Not provided'}</p>
        </div>
      </div>
    </div>

    <!-- Contact Information -->
    <div class="card p-6">
      <div class="flex items-center space-x-2 mb-4">
        <Phone class="w-5 h-5 text-primary-600" />
        <h2 class="text-xl font-bold text-gray-900">Contact Information</h2>
      </div>
      <div class="space-y-3">
        <div>
          <span class="text-sm font-medium text-gray-600">Email Address:</span>
          <p class="text-gray-900">{profileData.personal.email || 'Not provided'}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-600">Phone Number:</span>
          <p class="text-gray-900">{profileData.personal.phone || 'Not provided'}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-600">Current Address:</span>
          <p class="text-gray-900">
            {profileData.address.currentAddress ? 
              `${profileData.address.currentAddress}, ${profileData.address.currentCity}, ${profileData.address.currentState} - ${profileData.address.currentPincode}` : 
              'Not provided'
            }
          </p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-600">Permanent Address:</span>
          <p class="text-gray-900">
            {profileData.address.permanentAddress ? 
              `${profileData.address.permanentAddress}, ${profileData.address.permanentCity}, ${profileData.address.permanentState} - ${profileData.address.permanentPincode}` : 
              'Not provided'
            }
          </p>
        </div>
      </div>
    </div>

    <!-- Educational Background -->
    <div class="card p-6">
      <div class="flex items-center space-x-2 mb-4">
        <BookOpen class="w-5 h-5 text-primary-600" />
        <h2 class="text-xl font-bold text-gray-900">Educational Background</h2>
      </div>
      <div class="space-y-4">
        <div>
          <h3 class="font-medium text-gray-900 mb-2">Last Qualification</h3>
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-sm"><span class="font-medium">Degree:</span> {profileData.education.lastQualificationDegree || 'Not provided'}</p>
            <p class="text-sm"><span class="font-medium">Institution:</span> {profileData.education.lastQualificationInstitution || 'Not provided'}</p>
            <p class="text-sm"><span class="font-medium">Year:</span> {profileData.education.lastQualificationYear || 'Not provided'}</p>
          </div>
        </div>
        
        {#if profileData.education.graduationDegree}
          <div>
            <h3 class="font-medium text-gray-900 mb-2">Graduation</h3>
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="text-sm"><span class="font-medium">Degree:</span> {profileData.education.graduationDegree}</p>
              <p class="text-sm"><span class="font-medium">University:</span> {profileData.education.graduationUniversity}</p>
              <p class="text-sm"><span class="font-medium">Year:</span> {profileData.education.graduationYear}</p>
              <p class="text-sm"><span class="font-medium">Grade:</span> {profileData.education.graduationPercentage}</p>
            </div>
          </div>
        {/if}

        {#if profileData.education.twelfthBoard}
          <div>
            <h3 class="font-medium text-gray-900 mb-2">12th Standard</h3>
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="text-sm"><span class="font-medium">Board:</span> {profileData.education.twelfthBoard}</p>
              <p class="text-sm"><span class="font-medium">School:</span> {profileData.education.twelfthSchool}</p>
              <p class="text-sm"><span class="font-medium">Year:</span> {profileData.education.twelfthYear}</p>
              <p class="text-sm"><span class="font-medium">Percentage:</span> {profileData.education.twelfthPercentage}</p>