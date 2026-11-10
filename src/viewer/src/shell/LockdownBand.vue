<script setup>
import {computed} from "vue";

// one line across the top while a program is stopped at a usage limit: until when, how many agents are stopped, and a way to the limits
const props = defineProps({lockdowns: {type: Array, default: () => []}});
const emit = defineEmits(["open"]);
const stoppedWords = (count) => (count === 1 ? "1 agent is stopped." : `${count} agents are stopped.`);
const lines = computed(() => props.lockdowns.map((lockdown) => ({program: lockdown.program, text: `${lockdown.reason}. ${stoppedWords(lockdown.halted_count)}`, liftable: lockdown.limit_id !== null && lockdown.limit_id !== undefined})));
</script>

<template>
    <template v-for="line in lines" :key="line.program">
        <div class="lockdown" role="status" data-lockdown-band>
            <span>{{ line.text }}</span>
            <template v-if="line.liftable">
                <button type="button" data-lockdown-limits @click="emit('open', $event.currentTarget)">Change the limit</button>
            </template>
            <template v-else>
                <span class="note">The plan's own allowance is used up.</span>
            </template>
        </div>
    </template>
</template>

<style scoped>
.lockdown {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 6px 16px;
    background: var(--warning-soft, #5a3d00);
    color: var(--text);
    font-size: 12px;
}

.lockdown button {
    border: 1px solid currentColor;
    border-radius: 6px;
    background: none;
    color: inherit;
    font: inherit;
    padding: 2px 8px;
    cursor: pointer;
}

.note {
    opacity: 0.8;
}
</style>
