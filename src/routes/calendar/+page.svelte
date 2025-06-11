<script lang="ts">
  import { ChevronLeft, ChevronRight, Download, Print } from 'lucide-svelte';
  
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Academic calendar data
  const academicEvents = {
    6: { // June 2025
      30: { type: 'course-start', text: 'RSJ Begins', description: 'Course Begins on the 30th of June - Reporting time 9am for all students on Day 1' }
    },
    7: { // July 2025 (Month 1)
      1: { type: 'session', text: 'Session 1\nSession 2' },
      2: { type: 'session', text: 'Session 1\nSession 2' },
      3: { type: 'session', text: 'Session 1\nSession 2' },
      4: { type: 'session', text: 'Session 1\nSession 2' },
      5: { type: 'masterclass', text: 'Masterclass' },
      6: { type: 'holiday', text: 'Muharram' },
      7: { type: 'session', text: 'Session 1\nSession 2' },
      8: { type: 'session', text: 'Session 1\nSession 2' },
      9: { type: 'session', text: 'Session 1\nSession 2' },
      10: { type: 'session', text: 'Session 1\nSession 2' },
      11: { type: 'open-hour', text: 'Session 1\nOpen Hour' },
      12: { type: 'masterclass', text: 'Masterclass' },
      14: { type: 'session', text: 'Session 1\nSession 2' },
      15: { type: 'session', text: 'Session 1\nSession 2' },
      16: { type: 'session', text: 'Session 1\nSession 2' },
      17: { type: 'session', text: 'Session 1\nSession 2' },
      18: { type: 'session', text: 'Session 1\nSession 2' },
      19: { type: 'masterclass', text: 'Masterclass' },
      21: { type: 'session', text: 'Session 1\nSession 2' },
      22: { type: 'session', text: 'Session 1\nSession 2' },
      23: { type: 'session', text: 'Session 1\nSession 2' },
      24: { type: 'session', text: 'Session 1\nSession 2' },
      25: { type: 'open-hour', text: 'Session 1\nOpen Hour' },
      26: { type: 'masterclass', text: 'Masterclass' },
      28: { type: 'session', text: 'Session 1\nSession 2' },
      29: { type: 'session', text: 'Session 1\nSession 2' },
      30: { type: 'session', text: 'Session 1\nSession 2' },
      31: { type: 'session', text: 'Session 1\nSession 2' }
    },
    8: { // August 2025 (Month 2)
      1: { type: 'session', text: 'Session 1\nSession 2' },
      2: { type: 'masterclass', text: 'Masterclass' },
      4: { type: 'session', text: 'Session 1\nSession 2' },
      5: { type: 'session', text: 'Session 1\nSession 2' },
      6: { type: 'session', text: 'Session 1\nSession 2' },
      7: { type: 'session', text: 'Session 1\nSession 2' },
      8: { type: 'open-hour', text: 'Session 1\nOpen Hour' },
      9: { type: 'special', text: 'Raksha Bandhan' },
      11: { type: 'session', text: 'Session 1\nSession 2' },
      12: { type: 'session', text: 'Session 1\nSession 2' },
      13: { type: 'session', text: 'Session 1\nSession 2' },
      14: { type: 'session', text: 'Session 1\nSession 2' },
      15: { type: 'holiday', text: 'Independence Day' },
      16: { type: 'special', text: 'Janmasthami' },
      18: { type: 'session', text: 'Session 1\nSession 2' },
      19: { type: 'session', text: 'Session 1\nSession 2' },
      20: { type: 'session', text: 'Session 1\nSession 2' },
      21: { type: 'session', text: 'Session 1\nSession 2' },
      22: { type: 'open-hour', text: 'Session 1\nOpen Hour' },
      23: { type: 'masterclass', text: 'Masterclass' },
      25: { type: 'session', text: 'Session 1\nSession 2' },
      26: { type: 'session', text: 'Session 1\nSession 2' },
      27: { type: 'session', text: 'Session 1\nSession 2' },
      28: { type: 'session', text: 'Session 1\nSession 2' },
      29: { type: 'session', text: 'Session 1\nSession 2' },
      30: { type: 'masterclass', text: 'Masterclass' }
    }
  };
  
  $: monthEvents = academicEvents[currentMonth + 1] || {};
  $: monthName = months[currentMonth];
  $: daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  $: firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  $: calendarDays = generateCalendarDays();
  
  function generateCalendarDays() {
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  }
  
  function navigateMonth(direction: 'prev' | 'next') {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
      } else {
        currentMonth--;
      }
    } else {
      if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
      } else {
        currentMonth++;
      }
    }
  }
  
  function getEventClass(eventType: string): string {
    switch (eventType) {
      case 'session': return 'bg-blue-50 text-blue-900';
      case 'masterclass': return 'bg-purple-50 text-purple-900';
      case 'holiday': return 'bg-red-50 text-red-900';
      case 'special': return 'bg-orange-50 text-orange-900';
      case 'open-hour': return 'bg-green-50 text-green-900';
      case 'course-start': return 'bg-yellow-50 text-yellow-900';
      default: return 'bg-gray-50 text-gray-900';
    }
  }
  
  function getSundayClass(day: number | null): string {
    if (!day) return '';
    const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
    return dayOfWeek === 0 ? 'text-red-600 font-semibold' : '';
  }
  
  function getMonthDescription(): string {
    if (currentMonth === 5 && currentYear === 2025) { // June 2025
      return 'Course Begins on the 30th of June - Reporting time 9am for all students on Day 1';
    } else if (currentMonth === 6 && currentYear === 2025) { // July 2025
      return '(Month 1)';
    } else if (currentMonth === 7 && currentYear === 2025) { // August 2025
      return '(Month 2)';
    }
    return '';
  }
  
  function getSessionInfo(): string {
    return 'Session 1: 10am-11:30am\nLunch\nSession 2: 1pm-2:30pm\nMasterclass: Saturday 11am-1pm\n*Schedule Subject to change as per news events';
  }
  
  function downloadCalendar() {
    console.log('Download calendar');
  }
  
  function printCalendar() {
    window.print();
  }
</script>

<svelte:head>
  <title>Academic Calendar - Republic School of Journalism</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-4 print:p-0 print:bg-white">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6 print:shadow-none print:rounded-none">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Academic Calendar</h1>
          <p class="text-gray-600 mt-1">Republic School of Journalism - Course Schedule</p>
        </div>
        
        <div class="mt-4 md:mt-0 flex items-center space-x-4 print:hidden">
          <button 
            on:click={downloadCalendar}
            class="btn btn-secondary flex items-center space-x-2"
          >
            <Download class="w-4 h-4" />
            <span>Download</span>
          </button>
          <button 
            on:click={printCalendar}
            class="btn btn-primary flex items-center space-x-2"
          >
            <Print class="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Calendar Container -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden print:shadow-none print:rounded-none">
      <!-- Calendar Header with Logo and Title -->
      <div class="border-b-2 border-gray-800 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-red-600 rounded flex items-center justify-center">
              <span class="text-white font-bold text-xl">RSJ</span>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">REPUBLIC SCHOOL OF JOURNALISM - RSJ</h2>
            </div>
          </div>
        </div>
      </div>

      <!-- Month Navigation and Info -->
      <div class="border-b border-gray-300">
        <div class="grid grid-cols-1 lg:grid-cols-4">
          <!-- Month and Year -->
          <div class="bg-gray-100 p-6 border-r border-gray-300 text-center">
            <div class="flex items-center justify-center space-x-4 mb-2 print:hidden">
              <button 
                on:click={() => navigateMonth('prev')}
                class="p-1 rounded hover:bg-gray-200 transition-colors duration-200"
              >
                <ChevronLeft class="w-5 h-5 text-gray-600" />
              </button>
              <div class="text-center">
                <h3 class="text-2xl font-bold text-gray-900">{monthName}</h3>
                <p class="text-xl text-gray-700">{currentYear}</p>
                <p class="text-sm text-gray-600">{getMonthDescription()}</p>
              </div>
              <button 
                on:click={() => navigateMonth('next')}
                class="p-1 rounded hover:bg-gray-200 transition-colors duration-200"
              >
                <ChevronRight class="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div class="print:block hidden">
              <h3 class="text-2xl font-bold text-gray-900">{monthName}</h3>
              <p class="text-xl text-gray-700">{currentYear}</p>
              <p class="text-sm text-gray-600">{getMonthDescription()}</p>
            </div>
          </div>
          
          <!-- Session Information -->
          <div class="lg:col-span-3 p-6">
            <div class="text-sm text-gray-800 whitespace-pre-line">
              {getSessionInfo()}
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px]">
          <!-- Week Headers -->
          <thead>
            <tr class="bg-gray-200">
              {#each weekDays as day}
                <th class="border border-gray-400 p-3 text-center font-bold text-gray-900 w-1/7">
                  {day}
                </th>
              {/each}
            </tr>
          </thead>
          
          <!-- Calendar Body -->
          <tbody>
            {#each Array(Math.ceil(calendarDays.length / 7)) as _, weekIndex}
              <tr>
                {#each Array(7) as _, dayIndex}
                  {@const dayNumber = calendarDays[weekIndex * 7 + dayIndex]}
                  {@const event = dayNumber ? monthEvents[dayNumber] : null}
                  <td class="border border-gray-400 h-24 w-1/7 align-top p-1">
                    {#if dayNumber}
                      <div class="h-full">
                        <!-- Date Number -->
                        <div class="text-right mb-1">
                          <span class="text-lg font-bold {getSundayClass(dayNumber)} {event?.type === 'holiday' || event?.type === 'special' ? 'text-red-600' : ''}">
                            {dayNumber}
                          </span>
                        </div>
                        
                        <!-- Event Content -->
                        {#if event}
                          <div class="text-xs {getEventClass(event.type)} p-1 rounded h-16 overflow-hidden">
                            <div class="whitespace-pre-line leading-tight">
                              {event.text}
                            </div>
                          </div>
                        {/if}
                      </div>
                    {/if}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-300 p-4 text-center">
        <p class="text-sm text-gray-500 italic">Calendar Template by calendarlabs.com</p>
      </div>
    </div>

    <!-- Legend -->
    <div class="bg-white rounded-lg shadow-sm p-6 mt-6 print:hidden">
      <h3 class="text-lg font-bold text-gray-900 mb-4">Legend</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
          <span class="text-sm text-gray-700">Regular Sessions</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-purple-50 border border-purple-200 rounded"></div>
          <span class="text-sm text-gray-700">Masterclass</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
          <span class="text-sm text-gray-700">Open Hour</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
          <span class="text-sm text-gray-700">Holidays</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-orange-50 border border-orange-200 rounded"></div>
          <span class="text-sm text-gray-700">Special Events</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
          <span class="text-sm text-gray-700">Course Start</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @media print {
    .print\:hidden {
      display: none !important;
    }
    
    .print\:block {
      display: block !important;
    }
    
    .print\:shadow-none {
      box-shadow: none !important;
    }
    
    .print\:rounded-none {
      border-radius: 0 !important;
    }
    
    .print\:p-0 {
      padding: 0 !important;
    }
    
    .print\:bg-white {
      background-color: white !important;
    }
    
    table {
      page-break-inside: avoid;
    }
    
    tr {
      page-break-inside: avoid;
    }
  }
</style>