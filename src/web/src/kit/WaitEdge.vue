<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import Icon from "./Icon.vue";

const NOTE_SECONDS = 5;
const SETTLE_SECONDS = 1.6;
const props = defineProps({waiting: {type: Object, default: null}});
const emit = defineEmits(["list"]);
const note = ref(null);
const lit = ref(false);
let timer = 0;

const open = computed(() => (props.waiting ? props.waiting.items.filter((item) => !item.reported).length : 0));
const plural = (n) => `${n} ${n === 1 ? "helper" : "helpers"}`;
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
        clearTimeout(timer);
        note.value = null;
        lit.value = true;
        timer = setTimeout(() => (lit.value = false), SETTLE_SECONDS * 1000);
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
        <span class="glow" aria-hidden="true" />
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
            </button>
        </template>
    </div>
</template>

<style scoped>
.wait-edge {
    position: relative;
    border-radius: var(--edge-radius, 12px);
}

.glow {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent-text) 30%, transparent),
        0 0 16px 3px color-mix(in srgb, var(--accent-text) 45%, transparent);
}

.waiting .glow {
    animation: breathe 3.6s ease-in-out infinite;
}

.lit .glow {
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

@keyframes breathe {
    0%,
    100% {
        opacity: 0.2;
    }

    50% {
        opacity: 0.85;
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
    .waiting .glow {
        animation: none;
        opacity: 0.5;
    }
}
</style>
