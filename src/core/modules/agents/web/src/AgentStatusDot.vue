<script setup>
import {computed} from "vue";
import {HoverTip} from "@journal/window-kit";

// the dot in the top-right corner of an agent's header and of each list row: it pulses while the agent works or thinks, stays still
// when it waits, is blocked or idle, and is a ring once retired; on hover or focus it says what the agent does and since when
const PULSING = new Set(["running", "working", "thinking"]);
const props = defineProps({state: {type: String, default: ""}, doing: {type: String, required: true}, since: {type: String, default: ""}});
const pulses = computed(() => PULSING.has(props.state));
const label = computed(() => (props.since ? `${props.doing}. ${props.since}` : props.doing));
</script>

<template>
    <HoverTip as="button" place="corner" :class="['agent-dot', {pulse: pulses}]" :data-state="state" :aria-label="label" data-agent-status @click.stop>
        <i />
        <template #tip><b>{{ doing }}</b><span v-if="since">{{ since }}</span></template>
    </HoverTip>
</template>

<style scoped>
.agent-dot {
    --c: var(--text-3);
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 2;
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: none;
    color: inherit;
    font: inherit;
    cursor: default;
}

.agent-dot:focus-visible { outline: 2px solid var(--accent); }
.agent-dot i { position: relative; z-index: 1; width: 8px; height: 8px; border-radius: 50%; background: var(--c); }
.agent-dot[data-state="running"], .agent-dot[data-state="working"], .agent-dot[data-state="thinking"] { --c: var(--accent); }
.agent-dot[data-state="waiting"] { --c: var(--paused); }
.agent-dot[data-state="blocked"] { --c: var(--blocking); }
.agent-dot[data-state="retired"] i { background: none; box-shadow: inset 0 0 0 1.5px var(--text-3); }

.agent-dot.pulse::before {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--c);
    animation: ping 1.8s cubic-bezier(.2, .8, .2, 1) infinite;
}

@keyframes ping {
    0% { transform: scale(1); opacity: .55; }
    75%, 100% { transform: scale(2.7); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
    .agent-dot.pulse::before { animation: none; opacity: .25; transform: scale(1.9); }
}

@media (pointer: coarse) {
    .agent-dot { top: 4px; right: 4px; width: 40px; height: 40px; }
}
</style>
