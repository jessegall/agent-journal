<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {useReveal} from "../composables/reveal.js";

const props = defineProps({
    text: {type: String, default: ""},
    mine: Boolean,
    typed: Boolean,
    thinking: Boolean,
    notes: {type: Array, default: () => []},
    shuffled: Boolean,
    bare: Boolean,
    kind: {type: String, default: ""},
});
const NOTE_SOONEST = 4000;
const NOTE_LATEST = 5000;
const order = ref([]);
const step = ref(0);
const noteAt = computed(() => order.value[step.value] ?? 0);

function arrange(avoid = "") {
    const at = props.notes.map((_, i) => i);
    for (let i = at.length - 1; props.shuffled && i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [at[i], at[j]] = [at[j], at[i]];
    }
    if (at.length > 1 && props.notes[at[0]] === avoid) at.push(at.shift());
    order.value = at;
    step.value = 0;
}

function flip() {
    if (step.value + 1 < order.value.length) return (step.value += 1);
    arrange(props.notes[noteAt.value]);
}

watch(
    () => props.notes,
    (notes, before) => arrange(before ? before[noteAt.value] : ""),
    {immediate: true}
);
let flipping = 0;
const later = () => (flipping = setTimeout(() => (flip(), later()), NOTE_SOONEST + Math.random() * (NOTE_LATEST - NOTE_SOONEST)));
later();
onUnmounted(() => clearTimeout(flipping));
const count = useReveal(props.typed ? props.text.length : 0);
const shown = computed(() => (props.typed && count.value < props.text.length ? props.text.slice(0, count.value) : props.text));
const writing = computed(() => props.typed && count.value < props.text.length);
</script>

<template>
    <template v-if="bare">
        <div class="bare" aria-hidden="true">
            <span class="dots">
                <i />
                <i />
                <i />
            </span>
            <span class="bare-notes">
                <Transition name="bare-note">
                    <span :key="`${step}-${notes[noteAt]}`" class="bare-note">{{ notes[noteAt] }}</span>
                </Transition>
            </span>
        </div>
    </template>
    <template v-else-if="kind">
        <div :class="['msg', 'agent', kind]">{{ text }}</div>
    </template>
    <template v-else-if="mine">
        <div class="msg me">{{ text }}</div>
    </template>
    <template v-else>
        <div class="msg agent">
            <div class="speaker">
                <span class="avatar" />
                Agent
            </div>
            <template v-if="thinking">
                <div class="thinking">
                    <i />
                    <i />
                    <i />
                    <template v-if="notes.length">
                        <Transition name="note" mode="out-in">
                            <span :key="`${step}-${notes[noteAt]}`" class="note">{{ notes[noteAt] }}</span>
                        </Transition>
                    </template>
                </div>
            </template>
            <template v-else>
                <span :class="{caret: writing}">{{ shown }}</span>
            </template>
        </div>
    </template>
</template>

<style scoped>
.msg {
    max-width: 86%;
    font-size: 13px;
    line-height: 1.5;
    white-space: pre-wrap;
    animation: line-rise 0.24s var(--ease) both;
}

.msg.lead {
    max-width: none;
    color: var(--text);
    font-size: 17px;
    font-weight: 500;
    line-height: 26px;
    text-wrap: pretty;
}

.msg.aside {
    max-width: none;
    color: var(--text-3);
    text-wrap: pretty;
}

.bare {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 100%;
    min-width: 0;
}

.dots {
    display: flex;
    flex: none;
    gap: 3px;
}

.dots i {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--text-3);
    animation: dim 1.2s infinite ease-in-out;
}

.dots i:nth-child(2) {
    animation-delay: 0.15s;
}

.dots i:nth-child(3) {
    animation-delay: 0.3s;
}

.bare-notes {
    position: relative;
    flex: 1;
    min-width: 0;
    height: 20px;
}

.bare-note {
    position: absolute;
    inset: 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 20px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.bare-note-enter-active {
    transition:
        opacity 0.18s ease-out 0.06s,
        transform 0.18s var(--ease) 0.06s;
}

.bare-note-leave-active {
    transition:
        opacity 0.12s ease-in,
        transform 0.12s ease-in;
}

.bare-note-enter-from {
    opacity: 0;
    transform: translateY(3px);
}

.bare-note-leave-to {
    opacity: 0;
    transform: translateY(-3px);
}

@keyframes line-rise {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .msg {
        animation: none;
    }

    .dots i {
        animation: none;
    }

    .bare-note-enter-active,
    .bare-note-leave-active {
        transition: none;
    }
}

.msg.agent {
    align-self: flex-start;
}

.msg.me {
    align-self: flex-end;
    padding: 8px 12px;
    border-radius: 10px;
    background: var(--sel);
}

.speaker {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 3px;
    color: var(--text-3);
    font-size: 12px;
}

.avatar {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    background: var(--accent);
}

.thinking {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 0;
}

.thinking .note {
    margin-left: 6px;
    color: var(--text-3);
    font-size: 13px;
}

.note-enter-active,
.note-leave-active {
    transition:
        opacity var(--fade),
        transform var(--move);
}

.note-enter-from {
    opacity: 0;
    transform: translateY(4px);
}

.note-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

.thinking i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--text-3);
    animation: dim 1.2s infinite ease-in-out;
}

.thinking i:nth-child(2) {
    animation-delay: 0.2s;
}

.thinking i:nth-child(3) {
    animation-delay: 0.4s;
}

.caret::after {
    content: "";
    display: inline-block;
    width: 2px;
    height: 1.05em;
    margin-left: 2px;
    vertical-align: -3px;
    background: var(--text-2);
    animation: blink 0.9s steps(1) infinite;
}

@keyframes dim {
    0%,
    100% {
        opacity: 0.25;
    }

    50% {
        opacity: 1;
    }
}

@keyframes blink {
    50% {
        opacity: 0;
    }
}
</style>
