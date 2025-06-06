<script lang="ts">
  import router from 'svelte-spa-router';
  import { routes } from './routes';
  import './app.css';
</script>

<main>
  <svelte:component this={router} {routes} />
</main>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
  
  :global(body) {
    margin: 0;
    overflow-x: hidden;
  }
</style>