<script setup>
import {computed} from "vue";

const props = defineProps({message: {type: Object, required: true}});
const SAID = {sent: "Sent", delivered: "Delivered to the agent", read: "Read", filed: "Processed"};
const state = computed(() => {
    if (props.message.completed) return "filed";
    if ((props.message.seen || []).includes("agent")) return "read";
    return props.message.data && props.message.data.delivered ? "delivered" : "sent";
});
</script>

<template>
    <span :class="['ticks', state]" role="img" :aria-label="SAID[state]">
        <svg viewBox="0 0 19 12" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
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
    color: rgb(255 255 255 / 75%);
}

.ticks svg {
    width: 17px;
    height: 11px;
    stroke-width: 1.7;
}

.ticks.read,
.ticks.filed {
    color: #b9f6ca;
}

.ticks.filed svg {
    stroke-width: 2.3;
}
</style>
