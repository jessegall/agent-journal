<script setup>
import {computed} from "vue";

const props = defineProps({message: {type: Object, required: true}, tone: {type: String, default: ""}});
const LABELS = {sent: "Sent", delivered: "Delivered to the agent", read: "Read", filed: "Processed"};
const state = computed(() => {
    if (props.message.completed) return "filed";
    if ((props.message.seen || []).includes("agent")) return "read";
    return props.message.data && props.message.data.delivered ? "delivered" : "sent";
});
</script>

<template>
    <span :class="['ticks', state, tone]" role="img" :title="LABELS[state]" :aria-label="LABELS[state]">
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
    opacity: 1;
    color: var(--read-tick);
}

.ticks.filed {
    opacity: 1;
    color: var(--accent-text);
}

.ticks.bubble {
    opacity: 1;
    color: rgb(255 255 255 / 75%);
}

.ticks.bubble svg {
    width: 17px;
    height: 11px;
    stroke-width: 1.7;
}

.ticks.bubble.read {
    color: #8fd3ff;
}

.ticks.bubble.filed {
    color: #b9f6ca;
}

.ticks.bubble.filed svg {
    stroke-width: 2.3;
}
</style>
