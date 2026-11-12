<script setup>
import {computed} from "vue";
import {Btn} from "@journal/window-kit";

// the one foot of a settings window: every change waiting to be saved, or the reason it cannot be, with Save and
// Cancel. Save works only when the changes can be saved; Cancel always works, and it is all that works while the
// settings are stale.
const props = defineProps({
    changes: {type: Array, default: () => []},
    canSave: {type: Boolean, default: false},
    pending: {type: Boolean, default: false},
    reason: {type: String, default: ""},
    environment: {type: String, default: ""},
});
const emit = defineEmits(["save", "cancel"]);

const named = (change) => (change.to === "on" || change.to === "off" ? `${change.title} ${change.to}` : `${change.title}: ${change.to}`);
const note = computed(() => {
    if (props.reason) return props.reason;
    if (props.pending) return "Saving.";
    if (!props.changes.length) return props.environment ? `No changes. For the environment ${props.environment}.` : "No changes.";
    return `${props.changes.length} ${props.changes.length === 1 ? "change" : "changes"}: ${props.changes.map(named).join(", ")}`;
});
</script>

<template>
    <div class="foot">
        <span :class="['note', {bad: reason, busy: pending}]" role="status" data-settings-note>{{ note }}</span>
        <Btn bordered :disabled="pending" data-settings-cancel @click="emit('cancel')">Cancel</Btn>
        <Btn variant="primary" :disabled="!canSave" data-settings-apply @click="emit('save')">Save</Btn>
    </div>
</template>

<style scoped>
.foot { display: flex; gap: 12px; align-items: center; height: 56px; padding: 0 18px; border-top: 1px solid var(--border); background: var(--raised); }
.note { flex: 1; min-width: 0; overflow: hidden; color: var(--text-3); font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.note.bad { color: var(--danger); white-space: normal; }
.note.busy { color: var(--text); }
</style>
