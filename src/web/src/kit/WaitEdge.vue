<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import Chip from "./Chip.vue";
import Icon from "./Icon.vue";

const NOTE_SECONDS = 5;
const TAIL = [0, 1, 2, 3, 4, 5];
const props = defineProps({waiting: {type: Object, default: null}});
const emit = defineEmits(["list"]);
const note = ref(null);
const lit = ref(false);
let timer = 0;

const open = computed(() => (props.waiting ? props.waiting.items.filter((item) => !item.reported).length : 0));
const plural = (n) => `${n} ${n === 1 ? "helper" : "helpers"}`;
const capital = (text) => text.charAt(0).toUpperCase() + text.slice(1);
function setNote(words, ended) {
    clearTimeout(timer);
    note.value = {words, tick: true, ended};
    lit.value = ended;
    timer = setTimeout(() => {
        note.value = null;
        lit.value = false;
    }, NOTE_SECONDS * 1000);
}

watch(
    () => props.waiting,
    (now, before) => {
        if (!before || now) return;
        setNote(before.helping ? `All ${plural(before.items.length)} reported` : `${capital(before.text)} finished`, true);
    }
);
watch(open, (now, before) => {
    if (!props.waiting?.helping || now >= before) return;
    setNote(`${before - now} ${before - now === 1 ? "helper" : "helpers"} reported, ${now} still at work`, false);
});
onUnmounted(() => clearTimeout(timer));
</script>

<template>
    <div :class="['wait-edge', {waiting: Boolean(waiting), lit}]">
        <slot />
        <svg class="edge" aria-hidden="true">
            <rect class="ring" pathLength="1" />
            <template v-for="i in TAIL" :key="i">
                <rect class="spot" pathLength="1" :style="{'--i': i}" />
            </template>
        </svg>
        <template v-if="note">
            <span class="note">
                <Icon name="tick" :size="11" />
                {{ note.words }}
            </span>
        </template>
        <template v-else-if="waiting">
            <button type="button" class="legend" @click="emit('list', $event)">
                Waiting
                <span class="chev" />
                <template v-if="waiting.kind">
                    <Chip>{{ waiting.kind }}</Chip>
                </template>
            </button>
        </template>
    </div>
</template>

<style scoped>
.wait-edge {
    position: relative;
    border-radius: var(--edge-radius, 12px);
}

.edge {
    position: absolute;
    inset: -1px;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    overflow: visible;
    pointer-events: none;
    opacity: 0;
}

.edge rect {
    x: 1px;
    y: 1px;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    rx: var(--edge-radius, 12px);
    fill: none;
    stroke: var(--accent-text);
    stroke-width: 2px;
}

.ring {
    opacity: 0;
}

.spot {
    stroke-dasharray: 0.05 0.95;
    stroke-dashoffset: 0;
    opacity: calc(1 - var(--i) * 0.17);
    animation: lap 8s linear infinite;
    animation-delay: calc(-8s + var(--i) * 0.4s);
}

.waiting .edge {
    opacity: 1;
}

.lit .edge {
    opacity: 1;
}

.lit .spot {
    display: none;
}

.lit .ring {
    opacity: 0.85;
    animation: settle 1.6s ease-out forwards;
}

.legend {
    position: absolute;
    top: 0;
    left: 12px;
    z-index: 1;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 1px 9px;
    border: 1px solid color-mix(in oklab, var(--accent-text) 35%, var(--border-2));
    border-radius: 999px;
    background: var(--bg);
    color: var(--text-2);
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer;
}

.legend:disabled {
    cursor: default;
}

.legend:hover:not(:disabled) {
    color: var(--text);
}

.legend .chev {
    width: 5px;
    height: 5px;
    border-right: 1.3px solid var(--text-3);
    border-bottom: 1.3px solid var(--text-3);
    transform: rotate(-45deg);
    margin-left: 1px;
}

.note {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 1;
    transform: translate(-50%, -50%);
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 1px 9px;
    border: 1px solid color-mix(in oklab, var(--tone-good) 45%, var(--border-2));
    border-radius: 999px;
    background: var(--bg);
    color: var(--text);
    font-size: 12px;
    white-space: nowrap;
}

@keyframes lap {
    to {
        stroke-dashoffset: -1;
    }
}

@keyframes settle {
    from {
        opacity: 0.9;
    }

    to {
        opacity: 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .spot {
        animation: none;
        display: none;
    }

    .waiting .ring {
        opacity: 0.6;
    }
}
</style>
