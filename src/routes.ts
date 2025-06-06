import Home from './pages/Home.svelte';
import Dashboard from './pages/Dashboard.svelte';
import Profile from './pages/Profile.svelte';
import Courses from './pages/Courses.svelte';
import CourseDetail from './pages/CourseDetail.svelte';
import Assignments from './pages/Assignments.svelte';
import Calendar from './pages/Calendar.svelte';
import Chat from './pages/Chat.svelte';
import Doubts from './pages/Doubts.svelte';
import Settings from './pages/Settings.svelte';
import Login from './pages/Login.svelte';

export const routes = {
  '/': Home,
  '/login': Login,
  '/dashboard': Dashboard,
  '/profile': Profile,
  '/courses': Courses,
  '/courses/:id': CourseDetail,
  '/assignments': Assignments,
  '/calendar': Calendar,
  '/chat': Chat,
  '/doubts': Doubts,
  '/settings': Settings,
};