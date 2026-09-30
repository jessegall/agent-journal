<script setup>
import {computed} from "vue";

const props = defineProps({message: {type: Object, required: true}});
const SAID = {sent: "sent", delivered: "delivered to the agent", read: "read", filed: "processed"};
const state = computed(() => {
    if (props.message.completed) return "filed";
    if (props.message.seen.includes("agent")) return "read";
    return props.message.data && props.message.data.delivered ? "delivered" : "sent";
});
</script>

<template>
    <span :class="['ticks', state]" :title="SAID[state]" :aria-label="SAID[state]">
        <svg viewBox="0 0 19 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1.5 6.6 4.4 9.5 10 2.8" />
            <template v-if="state !== 'sent'">
                <path d="M8 6.6 10.9 9.5 16.5 2.8" />
            </template>
        </svg>
    </span>
</template>

<style scoped>
.ticks {
    display: inline-flex;
    margin-left: 1px;
    opacity: 0.45;
}

.ticks svg {
    width: 16px;
    height: 10px;
}

.ticks.read {
    opacity: 0.8;
}

.ticks.filed {
    opacity: 1;
    color: var(--accent-text);
}
</style>
