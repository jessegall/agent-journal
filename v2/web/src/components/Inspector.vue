<script setup>
import ResourceBody from "./ResourceBody.vue";

defineProps({ spec: Object, env: String, resource: Object, size: String });
const emit = defineEmits(["changed", "close"]);
</script>

<template>
  <div class="scrim" @click.self="emit('close')">
    <aside :class="['inspector', size]">
      <ResourceBody :spec="spec" :env="env" :resource="resource" @changed="emit('changed')" @close="emit('close')" />
    </aside>
  </div>
</template>

<style scoped>
.scrim { position: fixed; inset: 0; z-index: 20; background: rgba(0, 0, 0, .35); }
.inspector { position: absolute; top: 0; right: 0; bottom: 0; overflow: auto; background: var(--bg); border-left: 1px solid var(--border); box-shadow: -20px 0 50px rgba(0, 0, 0, .4); }
.inspector.small { width: min(440px, 100%); }
.inspector.wide { width: min(760px, 100%); }
</style>
