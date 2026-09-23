<script setup>
import {computed} from "vue";
import {useReveal} from "../composables/reveal.js";
import {store} from "../state/store.js";

const props = defineProps({ticket: {type: Object, default: null}, picked: Boolean});
const emit = defineEmits(["toggle"]);
const title = computed(() => (props.ticket ? props.ticket.title : ""));
const brief = computed(() => (props.ticket ? props.ticket.brief : ""));
const count = useReveal(title.value.length + brief.value.length);
const typing = computed(() => !props.ticket || count.value < title.value.length + brief.value.length);
const shownTitle = computed(() => (typing.value ? title.value.slice(0, count.value) : title.value));
const shownBrief = computed(() => (typing.value ? brief.value.slice(0, Math.max(0, count.value - title.value.length)) : brief.value));
const onTitle = computed(() => typing.value && count.value <= title.value.length);
const waits = computed(() => Object.keys((props.ticket && props.ticket.data.dependencies) || {}).map((ref) => `#${ref.split(":")[1]}`));
const owner = computed(() => {
    const name = props.ticket ? props.ticket.data.owner : "";
    return name ? (store.board.roles.find((role) => role.name === name) || {title: name}).title : "";
});
const tag = computed(() => (typing.value ? "Drafting" : props.picked ? "Picked" : "Suggested ticket"));
</script>

<template>
    <button type="button" :class="['pick', {picked, writing: typing}]" :aria-pressed="picked" @click="!typing && emit('toggle')">
        <span class="pick-top">
            <span>{{ tag }}</span>
            <span :class="['check', {on: picked}]">✓</span>
        </span>
        <span :class="['pick-title', {caret: onTitle}]">{{ shownTitle }}</span>
        <span :class="['pick-brief', {caret: typing && !onTitle}]">{{ shownBrief }}</span>
        <template v-if="owner">
            <span class="owner">For {{ owner }}</span>
        </template>
        <template v-if="waits.length">
            <span class="waits">
                Waits on
                <b>{{ waits.join(", ") }}</b>
            </span>
        </template>
    </button>
</template>

<style scoped>
.pick {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 150px;
    padding: 16px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    animation: rise 0.5s cubic-bezier(0.2, 0.9, 0.25, 1) both;
    transition: border-color 0.2s;
}

.pick:hover {
    border-color: var(--border-3);
}

.pick.picked {
    border-color: var(--accent);
}

.pick.writing {
    cursor: default;
}

.pick-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--text-3);
    font-size: 11px;
}

.check {
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    border: 1.5px solid var(--border-3);
    border-radius: 50%;
    color: transparent;
    font-size: 11px;
    transition:
        background 0.15s,
        border-color 0.15s,
        color 0.15s;
}

.check.on {
    border-color: var(--accent);
    background: var(--accent);
    color: #fff;
}

.pick-title {
    min-height: 20px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
}

.pick-brief {
    color: var(--text-2);
    line-height: 1.5;
}

.owner {
    color: var(--text-3);
    font-size: 12px;
}

.waits {
    margin-top: auto;
    padding-top: 6px;
    color: var(--text-3);
    font-size: 12px;
}

.waits b {
    color: var(--text-2);
    font-weight: 500;
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

@keyframes blink {
    50% {
        opacity: 0;
    }
}

@keyframes rise {
    from {
        opacity: 0;
        transform: translateY(14px);
    }
}
</style>
