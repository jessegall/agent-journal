<script setup>
import {computed} from "vue";
import {Btn, useWindow} from "@journal/window-kit";

// the foot of a settings tab: what is waiting to be applied, or why it cannot be, with Cancel and Apply
const props = defineProps({changes: {type: Number, default: 0}, pending: {type: Boolean, default: false}, problem: {type: String, default: ""}, blocked: {type: Boolean, default: false}});
const emit = defineEmits(["cancel", "apply"]);
const view = useWindow();
const note = computed(() => {
    if (props.problem) return props.problem;
    if (props.pending) return "Applying.";
    if (!props.changes) return `No changes. For the environment ${view.environment}.`;
    return `${props.changes} ${props.changes === 1 ? "change" : "changes"} to apply to ${view.environment}.`;
});
</script>

<template>
    <div class="foot">
        <span :class="['foot-note', {bad: problem, busy: pending}]" role="status">{{ note }}</span>
        <Btn bordered :disabled="!changes || pending" data-settings-cancel @click="emit('cancel')">Cancel</Btn>
        <Btn variant="primary" :disabled="!changes || pending || blocked || view.readOnly" data-settings-apply @click="emit('apply')">Apply</Btn>
    </div>
</template>

<style scoped>
.foot { position: sticky; bottom: 0; display: flex; gap: 8px; align-items: center; min-height: 50px; margin: 18px -18px -22px; padding: 9px 16px; border-top: 1px solid var(--border); background: var(--raised, var(--bg)); }
.foot-note { flex: 1; min-width: 0; overflow: hidden; color: var(--text-3); font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.foot-note.bad { color: var(--danger); white-space: normal; }
.foot-note.busy { color: var(--text); }
</style>
