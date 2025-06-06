<script lang="ts">
  import { Search, Plus, ThumbsUp, MessageCircle, CheckCircle, Filter, Tag } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';
  import { doubts, doubtCategories } from '../stores/doubts';
  import { currentUser } from '../stores/auth';
  
  let searchQuery = '';
  let selectedCategory = 'All';
  let showResolved = false;
  let showNewDoubtModal = false;
  let newDoubt = {
    title: '',
    content: '',
    category: 'General',
    tags: ''
  };
  
  // Filter doubts based on search, category, and resolution status
  $: filteredDoubts = $doubts.filter(doubt => {
    const matchesSearch = doubt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doubt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doubt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || doubt.category === selectedCategory;
    const matchesResolution = showResolved || !doubt.isResolved;
    
    return matchesSearch && matchesCategory && matchesResolution;
  }).sort((a, b) => {
    // Sort by resolution status (unresolved first) then by timestamp
    if (a.isResolved !== b.isResolved) {
      return a.isResolved ? 1 : -1;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  
  function openNewDoubtModal() {
    showNewDoubtModal = true;
  }
  
  function closeNewDoubtModal() {
    showNewDoubtModal = false;
    newDoubt = {
      title: '',
      content: '',
      category: 'General',
      tags: ''
    };
  }
  
  function submitDoubt() {
    if (!newDoubt.title.trim() || !newDoubt.content.trim()) return;
    
    const doubt = {
      id: Date.now().toString(),
      title: newDoubt.title.trim(),
      content: newDoubt.content.trim(),
      category: newDoubt.category,
      authorId: $currentUser?.id || '1',
      authorName: $currentUser?.name || 'Anonymous',
      authorAvatar: $currentUser?.avatar || '',
      timestamp: new Date().toISOString(),
      upvotes: 0,
      isResolved: false,
      tags: newDoubt.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      responses: []
    };
    
    doubts.update(doubtList => [doubt, ...doubtList]);
    closeNewDoubtModal();
  }
  
  function upvoteDoubt(doubtId: string) {
    doubts.update(doubtList => 
      doubtList.map(doubt => 
        doubt.id === doubtId 
          ? { ...doubt, upvotes: doubt.upvotes + 1 }
          : doubt
      )
    );
  }
  
  function formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
  
  function getCategoryColor(category: string): string {
    const colors = {
      'Research': 'bg-blue-100 text-blue-700',
      'Writing': 'bg-green-100 text-green-700',
      'Ethics': 'bg-purple-100 text-purple-700',
      'Tools': 'bg-orange-100 text-orange-700',
      'Career': 'bg-pink-100 text-pink-700',
      'Technical': 'bg-red-100 text-red-700',
      'General': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors['General'];
  }
</script>

<Layout>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Q&A Forum</h1>
        <p class="text-gray-600 mt-1">Ask questions and get help from instructors and peers</p>
      </div>
      <button 
        class="btn btn-primary flex items-center space-x-2"
        on:click={openNewDoubtModal}
      >
        <Plus class="w-4 h-4" />
        <span>Ask Question</span>
      </button>
    </div>

    <!-- Filters and Search -->
    <div class="card p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
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
            <option value="All">All Categories</option>
            {#each $doubtCategories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
        </div>

        <!-- Show Resolved Toggle -->
        <div class="flex items-center">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              bind:checked={showResolved}
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span class="text-sm text-gray-700">Show resolved</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Questions List -->
    <div class="space-y-4">
      {#each filteredDoubts as doubt}
        <div class="card p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-start space-x-4">
            <!-- Author Avatar -->
            <img 
              src={doubt.authorAvatar} 
              alt={doubt.authorName}
              class="w-12 h-12 rounded-full object-cover"
            />
            
            <div class="flex-1">
              <!-- Question Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <h3 class="text-lg font-semibold text-gray-900">{doubt.title}</h3>
                    {#if doubt.isResolved}
                      <CheckCircle class="w-5 h-5 text-success-500" />
                    {/if}
                  </div>
                  
                  <div class="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <span>by {doubt.authorName}</span>
                    <span>{formatTimeAgo(doubt.timestamp)}</span>
                    {#if doubt.courseName}
                      <span class="text-primary-600">{doubt.courseName}</span>
                    {/if}
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <span class="px-2 py-1 text-xs font-medium rounded-full {getCategoryColor(doubt.category)}">
                    {doubt.category}
                  </span>
                </div>
              </div>
              
              <!-- Question Content -->
              <p class="text-gray-700 mb-4 line-clamp-3">{doubt.content}</p>
              
              <!-- Tags -->
              {#if doubt.tags.length > 0}
                <div class="flex flex-wrap gap-2 mb-4">
                  {#each doubt.tags as tag}
                    <span class="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      <Tag class="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  {/each}
                </div>
              {/if}
              
              <!-- Actions -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <button 
                    class="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors duration-200"
                    on:click={() => upvoteDoubt(doubt.id)}
                  >
                    <ThumbsUp class="w-4 h-4" />
                    <span class="text-sm">{doubt.upvotes}</span>
                  </button>
                  
                  <div class="flex items-center space-x-1 text-gray-500">
                    <MessageCircle class="w-4 h-4" />
                    <span class="text-sm">{doubt.responses.length} answers</span>
                  </div>
                </div>
                
                <button class="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View Details
                </button>
              </div>
              
              <!-- Latest Response Preview -->
              {#if doubt.responses.length > 0}
                <div class="mt-4 pt-4 border-t border-gray-100">
                  <div class="flex items-start space-x-3">
                    <img 
                      src={doubt.responses[0].authorAvatar} 
                      alt={doubt.responses[0].authorName}
                      class="w-8 h-8 rounded-full object-cover"
                    />
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-1">
                        <span class="text-sm font-medium text-gray-900">{doubt.responses[0].authorName}</span>
                        {#if doubt.responses[0].authorRole === 'instructor'}
                          <span class="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">Instructor</span>
                        {/if}
                        {#if doubt.responses[0].isAccepted}
                          <CheckCircle class="w-4 h-4 text-success-500" />
                        {/if}
                      </div>
                      <p class="text-sm text-gray-600 line-clamp-2">{doubt.responses[0].content}</p>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/each}
      
      {#if filteredDoubts.length === 0}
        <div class="text-center py-12">
          <MessageCircle class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
          <p class="text-gray-600 mb-4">Try adjusting your search criteria or be the first to ask a question!</p>
          <button 
            class="btn btn-primary"
            on:click={openNewDoubtModal}
          >
            Ask First Question
          </button>
        </div>
      {/if}
    </div>
  </div>

  <!-- New Question Modal -->
  {#if showNewDoubtModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-semibold text-gray-900 mb-6">Ask a Question</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Question Title</label>
            <input
              type="text"
              bind:value={newDoubt.title}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="What's your question?"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              bind:value={newDoubt.category}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {#each $doubtCategories as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Question Details</label>
            <textarea
              bind:value={newDoubt.content}
              rows="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Provide more details about your question..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              bind:value={newDoubt.tags}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., research, sources, ethics"
            />
            <p class="text-xs text-gray-500 mt-1">Add relevant tags to help others find your question</p>
          </div>
        </div>
        
        <div class="flex space-x-3 mt-6">
          <button
            class="flex-1 btn btn-primary"
            on:click={submitDoubt}
            disabled={!newDoubt.title.trim() || !newDoubt.content.trim()}
          >
            Post Question
          </button>
          <button
            class="flex-1 btn btn-secondary"
            on:click={closeNewDoubtModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}
</Layout>