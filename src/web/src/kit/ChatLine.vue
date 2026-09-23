<script setup>
import {computed, onUnmounted, ref} from "vue";
import {useReveal} from "../composables/reveal.js";

const props = defineProps({
    text: {type: String, default: ""},
    mine: Boolean,
    typed: Boolean,
    thinking: Boolean,
    notes: {type: Array, default: () => []},
});
const NOTE_MS = 2400;
const noteAt = ref(0);
const flipping = setInterval(() => (noteAt.value = (noteAt.value + 1) % Math.max(1, props.notes.length)), NOTE_MS);
onUnmounted(() => clearInterval(flipping));
const count = useReveal(props.typed ? props.text.length : 0);
const shown = computed(() => (props.typed && count.value < props.text.length ? props.text.slice(0, count.value) : props.text));
const writing = computed(() => props.typed && count.value < props.text.length);
</script>

<template>
    <template v-if="mine">
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
                            <span :key="noteAt" class="note">{{ notes[noteAt] }}</span>
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
    animation: fadein 0.3s both;
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
        opacity 0.28s,
        transform 0.28s;
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

@keyframes fadein {
    from {
        opacity: 0;
    }
}
</style>
