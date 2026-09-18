<script setup>
import { computed } from "vue";
import SwitchCase from "../kit/SwitchCase.vue";
import Inspector from "./Inspector.vue";
import ResourcePage from "./ResourcePage.vue";

const props = defineProps({ spec: Object, env: String, resource: Object });
const emit = defineEmits(["changed", "close"]);
const meta = computed(() => props.spec.types[props.resource.type]);
</script>

<template>
  <SwitchCase :value="meta.view">
    <template #document>
      <ResourcePage :spec="spec" :env="env" :resource="resource" @changed="emit('changed')" @close="emit('close')" />
    </template>
    <template #default>
      <Inspector :spec="spec" :env="env" :resource="resource" :size="meta.view" @changed="emit('changed')" @close="emit('close')" />
    </template>
  </SwitchCase>
</template>
