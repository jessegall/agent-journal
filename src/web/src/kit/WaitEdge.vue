<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import Icon from "./Icon.vue";

const NOTE_SECONDS = 5;
const props = defineProps({waiting: {type: Object, default: null}});
const emit = defineEmits(["list"]);
const note = ref(null);
const lit = ref(false);
let timer = 0;

const open = computed(() => (props.waiting ? props.waiting.items.filter((item) => !item.reported).length : 0));
const plural = (n) => `${n} ${n === 1 ? "helper" : "helpers"}`;
const capital = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const legend = computed(() => {
    if (note.value) return note.value;
    if (!props.waiting) return null;
    return {words: `Waiting on ${props.waiting.helping ? plural(open.value || props.waiting.items.length) : props.waiting.text}`, tick: false};
});

function say(words, ended) {
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
        say(before.helping ? `All ${plural(before.items.length)} reported` : `${capital(before.text)} finished`, true);
    }
);
watch(open, (now, before) => {
    if (!props.waiting?.helping || now >= before) return;
    say(`${before - now} ${before - now === 1 ? "helper" : "helpers"} reported, ${now} still at work`, false);
});
onUnmounted(() => clearTimeout(timer));
</script>

<template>
    <div :class="['wait-edge', {waiting: Boolean(waiting), lit}]">
        <slot />
        <span class="edge" />
        <template v-if="legend">
            <button type="button" :class="['legend', {done: legend.tick}]" :disabled="!waiting" @click="emit('list', $event)">
                <template v-if="legend.tick">
                    <Icon name="tick" :size="11" />
                </template>
                {{ legend.words }}
                <template v-if="waiting && !legend.ended">
                    <span class="meta">{{ waiting.line.includes("·") ? waiting.line.split("·").pop().trim() : "" }}</span>
                    <span class="chev" />
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
    border-radius: inherit;
    padding: 2px;
    overflow: hidden;
    pointer-events: none;
    opacity: 0;
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
}

.edge::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 150%;
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
}

.waiting .edge {
    opacity: 1;
}

.waiting .edge::before {
    background: conic-gradient(
        transparent 0turn,
        transparent 0.5turn,
        color-mix(in oklab, var(--accent-text) 30%, transparent) 0.75turn,
        var(--accent-text) 0.96turn,
        transparent 1turn
    );
    animation: lap 8s linear infinite;
}

.lit .edge {
    opacity: 0.85;
    background: var(--accent-text);
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

.legend .meta {
    color: var(--text-3);
}

.legend .chev {
    width: 5px;
    height: 5px;
    border-right: 1.3px solid var(--text-3);
    border-bottom: 1.3px solid var(--text-3);
    transform: rotate(-45deg);
    margin-left: 1px;
}

.legend.done {
    border-color: color-mix(in oklab, var(--tone-good) 45%, var(--border-2));
    color: var(--text);
}

@keyframes lap {
    to {
        transform: translate(-50%, -50%) rotate(360deg);
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
    .waiting .edge {
        background: color-mix(in oklab, var(--accent-text) 60%, transparent);
    }

    .waiting .edge::before,
    .lit .edge {
        animation: none;
        background: none;
    }

    .lit .edge {
        opacity: 0.85;
        background: var(--accent-text);
    }
}
</style>
