<script lang="ts">
  import Layout from '../components/Layout.svelte';
  import AssignmentCard from '../components/AssignmentCard.svelte';
  import { assignments } from '../stores/assignments';
</script>

<Layout>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Assignments</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each $assignments as assignment (assignment.id)}
        <AssignmentCard {assignment} />
      {/each}
    </div>
  </div>
</Layout>
