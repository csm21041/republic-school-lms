import { writable } from 'svelte/store';
import { page } from '$app/stores';
import { get } from 'svelte/store';

export interface NavigationItem {
  id: string;
  href: string;
  label: string;
  icon: any;
  isActive?: boolean;
  badge?: number;
  children?: NavigationItem[];
}

// Active navigation state
export const activeNavItem = writable<string>('');
export const navigationHistory = writable<string[]>([]);

// Navigation items with unique IDs
export const navigationItems = writable<NavigationItem[]>([]);

// Initialize navigation tracking
export function initializeNavigation() {
  if (typeof window === 'undefined') return;

  // Set initial active item based on current path
  const currentPath = window.location.pathname;
  updateActiveNavigation(currentPath);

  // Listen for navigation changes
  page.subscribe(($page) => {
    if ($page?.url?.pathname) {
      updateActiveNavigation($page.url.pathname);
    }
  });

  // Listen for browser back/forward
  window.addEventListener('popstate', () => {
    const currentPath = window.location.pathname;
    updateActiveNavigation(currentPath);
  });
}

// Update active navigation item
export function updateActiveNavigation(path: string) {
  // Normalize path
  const normalizedPath = path === '/' ? '/dashboard' : path;
  
  // Update active item
  activeNavItem.set(normalizedPath);
  
  // Update history
  navigationHistory.update(history => {
    const newHistory = [normalizedPath, ...history.filter(p => p !== normalizedPath)];
    return newHistory.slice(0, 10); // Keep last 10 items
  });
  
  // Persist to localStorage
  try {
    localStorage.setItem('activeNavItem', normalizedPath);
    localStorage.setItem('navigationHistory', JSON.stringify(get(navigationHistory)));
  } catch (error) {
    console.warn('Failed to persist navigation state:', error);
  }
}

// Load navigation state from localStorage
export function loadNavigationState() {
  if (typeof window === 'undefined') return;
  
  try {
    const savedActiveItem = localStorage.getItem('activeNavItem');
    const savedHistory = localStorage.getItem('navigationHistory');
    
    if (savedActiveItem) {
      activeNavItem.set(savedActiveItem);
    }
    
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      if (Array.isArray(parsedHistory)) {
        navigationHistory.set(parsedHistory);
      }
    }
  } catch (error) {
    console.warn('Failed to load navigation state:', error);
  }
}

// Check if a path is active
export function isPathActive(path: string): boolean {
  const currentActive = get(activeNavItem);
  
  // Exact match
  if (currentActive === path) return true;
  
  // Parent path match (for nested routes)
  if (path !== '/' && currentActive.startsWith(path + '/')) return true;
  
  // Special case for dashboard
  if (path === '/dashboard' && (currentActive === '/' || currentActive === '/dashboard')) return true;
  
  return false;
}

// Navigate programmatically
export function navigateTo(path: string) {
  updateActiveNavigation(path);
  
  // Use SvelteKit's goto if available, otherwise fallback to window.location
  if (typeof window !== 'undefined') {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

// Get navigation breadcrumbs
export function getNavigationBreadcrumbs(currentPath: string): NavigationItem[] {
  const breadcrumbs: NavigationItem[] = [];
  const pathSegments = currentPath.split('/').filter(Boolean);
  
  let currentHref = '';
  for (const segment of pathSegments) {
    currentHref += `/${segment}`;
    
    // Convert segment to readable label
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    
    breadcrumbs.push({
      id: `breadcrumb-${segment}`,
      href: currentHref,
      label,
      icon: null
    });
  }
  
  return breadcrumbs;
}

// Clear navigation state
export function clearNavigationState() {
  activeNavItem.set('');
  navigationHistory.set([]);
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('activeNavItem');
    localStorage.removeItem('navigationHistory');
  }
}