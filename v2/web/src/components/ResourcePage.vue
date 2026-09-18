<script setup>
import ResourceBody from "./ResourceBody.vue";

defineProps({ spec: Object, env: String, resource: Object });
const emit = defineEmits(["changed", "close"]);
</script>

<template>
  <div class="page">
    <ResourceBody :spec="spec" :env="env" :resource="resource" :document="true" @changed="emit('changed')" @close="emit('close')" />
  </div>
</template>

<style scoped>
.page { position: fixed; inset: 0; z-index: 20; overflow: auto; background: var(--bg); }
.page > :deep(.body) { max-width: 760px; margin: 0 auto; padding: 40px 32px 80px; }
</style>
