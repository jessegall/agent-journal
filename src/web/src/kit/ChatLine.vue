<script setup>
import {computed} from "vue";
import {useReveal} from "../composables/reveal.js";

const props = defineProps({text: {type: String, default: ""}, mine: Boolean, typed: Boolean, thinking: Boolean});
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
    gap: 4px;
    padding: 6px 0;
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
