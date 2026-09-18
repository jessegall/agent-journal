<script setup>
defineProps({ resource: Object, selected: Boolean });
</script>

<template>
  <button type="button" :class="['row', { selected, completed: resource.completed }]">
    <span class="n">{{ resource.n }}</span>
    <span class="title">{{ resource.title }}</span>
    <span class="abstract">{{ resource.abstract }}</span>
    <span class="seen" :title="`seen by ${resource.seen.join(', ')}`">{{ resource.seen.length }}</span>
  </button>
</template>

<style scoped>
.row { display: flex; align-items: center; gap: 12px; width: 100%; padding: 10px 14px; border: 0; border-bottom: 1px solid var(--border); background: none; text-align: left; cursor: pointer; }
.row:last-child { border-bottom: 0; }
.row:hover { background: var(--hover); }
.row.selected { background: var(--sel); }
.row.completed .title { color: var(--text-3); text-decoration: line-through; }
.n { flex: none; width: 32px; color: var(--text-3); font-variant-numeric: tabular-nums; }
.title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.abstract { flex: 0 1 40%; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-3); font-size: 12px; }
.seen { flex: none; color: var(--text-3); font-size: 11px; }
</style>
