<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    CreditCard, 
    DollarSign, 
    Calendar, 
    CheckCircle, 
    Clock, 
    AlertCircle,
    Download,
    Filter,
    Search,
    ArrowUpDown,
    Receipt
  } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';
  import { currentUser } from '../stores/auth';
  import { courses } from '../stores/courses';
  import { payments, transactions } from '../stores/payments';

  let activeTab = 'overview';
  let searchQuery = '';
  let filterStatus = 'all';
  let sortBy = 'date';
  let sortOrder = 'desc';

  // Filter and sort transactions
  $: filteredTransactions = $transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.courseName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  function getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-700';
      case 'pending':
        return 'bg-warning-100 text-warning-700';
      case 'failed':
        return 'bg-error-100 text-error-700';
      case 'refunded':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'failed':
        return AlertCircle;
      case 'refunded':
        return ArrowUpDown;
      default:
        return Clock;
    }
  }

  function downloadReceipt(transactionId: string) {
    // In a real app, this would download the receipt
    console.log('Downloading receipt for transaction:', transactionId);
  }

  function toggleSort(field: string) {
    if (sortBy === field) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortBy = field;
      sortOrder = 'desc';
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<Layout>
  <div class="p-6 max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Payment Center</h1>
        <p class="text-gray-600 mt-1">Manage your course payments and view transaction history</p>
      </div>
      
      <!-- Tab Navigation -->
      <div class="flex bg-gray-100 rounded-lg p-1">
        <button
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 {activeTab === 'overview' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
          on:click={() => activeTab = 'overview'}
        >
          Payment Overview
        </button>
        <button
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 {activeTab === 'transactions' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
          on:click={() => activeTab = 'transactions'}
        >
          Transaction History
        </button>
      </div>
    </div>

    {#if activeTab === 'overview'}
      <!-- Payment Overview -->
      <div class="space-y-6">
        <!-- Payment Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Spent</p>
                <p class="text-2xl font-bold text-gray-900">{formatCurrency($payments.totalSpent)}</p>
              </div>
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <DollarSign class="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Courses Purchased</p>
                <p class="text-2xl font-bold text-gray-900">{$payments.coursesPurchased}</p>
              </div>
              <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <CheckCircle class="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>

          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Pending Payments</p>
                <p class="text-2xl font-bold text-gray-900">{formatCurrency($payments.pendingAmount)}</p>
              </div>
              <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <Clock class="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </div>

          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Next Payment</p>
                <p class="text-2xl font-bold text-gray-900">{$payments.nextPaymentDate ? formatDate($payments.nextPaymentDate) : 'None'}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar class="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Methods -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Payment Methods</h2>
          <div class="space-y-4">
            {#each $payments.paymentMethods as method}
              <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CreditCard class="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{method.type} ending in {method.last4}</p>
                    <p class="text-sm text-gray-600">Expires {method.expiryMonth}/{method.expiryYear}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  {#if method.isDefault}
                    <span class="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">Default</span>
                  {/if}
                  <button class="text-sm text-primary-600 hover:text-primary-700">Edit</button>
                </div>
              </div>
            {/each}
            
            <button class="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors duration-200">
              + Add New Payment Method
            </button>
          </div>
        </div>

        <!-- Course Payment Status -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Course Payment Status</h2>
          <div class="space-y-4">
            {#each $payments.coursePayments as coursePayment}
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900">{coursePayment.courseName}</h3>
                    <p class="text-sm text-gray-600">by {coursePayment.instructor}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-lg text-gray-900">{formatCurrency(coursePayment.totalAmount)}</p>
                    <span class="px-2 py-1 text-xs rounded-full {getStatusColor(coursePayment.status)}">
                      {coursePayment.status}
                    </span>
                  </div>
                </div>
                
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm text-gray-600">Payment Progress</span>
                  <span class="text-sm font-medium text-primary-600">
                    {formatCurrency(coursePayment.paidAmount)} / {formatCurrency(coursePayment.totalAmount)}
                  </span>
                </div>
                
                <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style="width: {(coursePayment.paidAmount / coursePayment.totalAmount) * 100}%"
                  ></div>
                </div>
                
                <div class="flex items-center justify-between text-sm text-gray-600">
                  <span>Purchased: {formatDate(coursePayment.purchaseDate)}</span>
                  {#if coursePayment.nextPaymentDate}
                    <span>Next payment: {formatDate(coursePayment.nextPaymentDate)}</span>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

    {:else}
      <!-- Transaction History -->
      <div class="space-y-6">
        <!-- Filters and Search -->
        <div class="card p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="md:col-span-2">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  bind:value={searchQuery}
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <!-- Status Filter -->
            <div>
              <select 
                bind:value={filterStatus}
                class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <!-- Sort -->
            <div>
              <select 
                bind:value={sortBy}
                class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Transaction List -->
        <div class="card overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Transaction History</h2>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      class="flex items-center space-x-1 hover:text-gray-700"
                      on:click={() => toggleSort('date')}
                    >
                      <span>Date</span>
                      <ArrowUpDown class="w-3 h-3" />
                    </button>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      class="flex items-center space-x-1 hover:text-gray-700"
                      on:click={() => toggleSort('amount')}
                    >
                      <span>Amount</span>
                      <ArrowUpDown class="w-3 h-3" />
                    </button>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      class="flex items-center space-x-1 hover:text-gray-700"
                      on:click={() => toggleSort('status')}
                    >
                      <span>Status</span>
                      <ArrowUpDown class="w-3 h-3" />
                    </button>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each filteredTransactions as transaction}
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(transaction.date)}
                    </td>
                    <td class="px-6 py-4">
                      <div>
                        <p class="text-sm font-medium text-gray-900">{transaction.description}</p>
                        {#if transaction.courseName}
                          <p class="text-sm text-gray-600">{transaction.courseName}</p>
                        {/if}
                        <p class="text-xs text-gray-500">ID: {transaction.id}</p>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-sm font-medium {transaction.type === 'refund' ? 'text-error-600' : 'text-gray-900'}">
                        {transaction.type === 'refund' ? '-' : ''}{formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center space-x-2">
                        <svelte:component 
                          this={getStatusIcon(transaction.status)} 
                          class="w-4 h-4 {transaction.status === 'completed' ? 'text-success-500' : transaction.status === 'pending' ? 'text-warning-500' : 'text-error-500'}" 
                        />
                        <span class="px-2 py-1 text-xs rounded-full {getStatusColor(transaction.status)}">
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      {#if transaction.status === 'completed'}
                        <button 
                          class="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                          on:click={() => downloadReceipt(transaction.id)}
                        >
                          <Receipt class="w-4 h-4" />
                          <span>Receipt</span>
                        </button>
                      {:else}
                        <span class="text-gray-400">-</span>
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>

          {#if filteredTransactions.length === 0}
            <div class="text-center py-12">
              <Receipt class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p class="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          {/if}
        </div>

        <!-- Transaction Summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card p-6 text-center">
            <div class="text-2xl font-bold text-success-600 mb-2">
              {formatCurrency($transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0))}
            </div>
            <div class="text-sm text-gray-600">Total Completed</div>
          </div>
          
          <div class="card p-6 text-center">
            <div class="text-2xl font-bold text-warning-600 mb-2">
              {formatCurrency($transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0))}
            </div>
            <div class="text-sm text-gray-600">Total Pending</div>
          </div>
          
          <div class="card p-6 text-center">
            <div class="text-2xl font-bold text-error-600 mb-2">
              {formatCurrency($transactions.filter(t => t.status === 'failed').reduce((sum, t) => sum + t.amount, 0))}
            </div>
            <div class="text-sm text-gray-600">Total Failed</div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</Layout>