<script setup>
import {computed} from "vue";
import Dot from "./Dot.vue";

const TONES = {
    working: "var(--progress)",
    busy: "var(--progress)",
    compacting: "var(--parked)",
    waiting: "var(--tone-warn)",
    idle: "var(--text-3)",
    stopped: "var(--text-4)",
};
const LIT = ["working", "busy", "compacting", "waiting"];

const props = defineProps({
    state: {type: String, required: true},
    note: {type: String, default: ""},
    size: {type: Number, default: 8},
});
const lit = computed(() => LIT.includes(props.state));
</script>

<template>
    <span :class="['status-label', state]" :style="{'--tone': TONES[state] || TONES.idle}">
        <Dot :kind="state" :size="size" :glow="lit" :solid="state === 'idle'" :pulsing="state === 'working'" />
        <span class="status-word"><slot /></span>
        <template v-if="note">
            <span class="status-note">{{ note }}</span>
        </template>
    </span>
</template>

<style scoped>
.status-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    font-size: 12.5px;
    white-space: nowrap;
}

.status-word {
    color: var(--tone);
    font-weight: 500;
}

.status-label.idle .status-word,
.status-label.stopped .status-word {
    color: var(--text-2);
}

.status-note {
    overflow: hidden;
    color: var(--text-3);
    text-overflow: ellipsis;
    font-variant-numeric: tabular-nums;
}
</style>
