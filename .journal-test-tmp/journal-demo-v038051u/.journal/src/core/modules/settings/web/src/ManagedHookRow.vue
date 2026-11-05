<script setup>
import { Switch } from "@journal/window-kit";
import HookDetails from "./HookDetails.vue";
import HookRunHistory from "./HookRunHistory.vue";

const props = defineProps({
  hook: { type: Object, required: true },
  history: { type: Object, required: true },
  disabled: Boolean,
  failure: String,
});
const emit = defineEmits(["save"]);
const saveState = (on) =>
  emit("save", {
    hook_id: props.hook.id,
    state: on ? "on" : "off",
    timeout: props.hook.timeout,
  });
const saveTimeout = (event) =>
  emit("save", {
    hook_id: props.hook.id,
    state: props.hook.state,
    timeout: Number(event.target.value),
  });
</script>

<template>
  <div class="managed-hook" :data-managed-hook="hook.id">
    <HookDetails :hook="hook" />
    <div class="hook-controls">
      <Switch
        :on="hook.state === 'on'"
        :word="hook.state === 'on' ? 'On' : 'Off'"
        :disabled="disabled"
        title="Manage this command"
        @change="saveState"
      />
      <label
        >Time limit (seconds)<input
          :value="hook.timeout"
          type="number"
          min="1"
          step="1"
          :disabled="disabled"
          @change="saveTimeout"
      /></label>
      <template v-if="failure"
        ><p class="hook-failure" role="alert">{{ failure }}</p></template
      >
    </div>
    <HookRunHistory :history="history" />
  </div>
</template>

<style scoped>
.managed-hook {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}
.hook-controls {
  display: flex;
  flex: 0 0 145px;
  flex-direction: column;
  gap: 8px;
}
.hook-controls label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--text-3);
  font-size: 11px;
}
.hook-controls input {
  width: 100%;
  box-sizing: border-box;
  padding: 5px 8px;
  border: 1px solid var(--border-2);
  border-radius: 5px;
  background: transparent;
  color: var(--text);
}
.hook-failure {
  margin: 0;
  color: var(--danger);
  font-size: 12px;
}

@media (max-width: 700px) {
    .managed-hook :deep(.hook-details) {
        flex-basis: 100%;
    }
}
</style>
