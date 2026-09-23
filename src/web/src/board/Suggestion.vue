<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {useReveal} from "../composables/reveal.js";

const props = defineProps({ticket: Object, picked: Boolean});
const emit = defineEmits(["toggle"]);
const count = useReveal(props.ticket.title.length + props.ticket.brief.length);
const done = computed(() => count.value >= props.ticket.title.length + props.ticket.brief.length);
const title = computed(() => (done.value ? props.ticket.title : props.ticket.title.slice(0, count.value)));
const brief = computed(() =>
    done.value ? props.ticket.brief : props.ticket.brief.slice(0, Math.max(0, count.value - props.ticket.title.length))
);
const waits = computed(() => Object.keys(props.ticket.data.dependencies || {}).map((ref) => `#${ref.split(":")[1]}`));
</script>

<template>
    <button type="button" :class="['suggestion', {picked}]" :aria-pressed="picked" @click="emit('toggle')">
        <span class="top">
            <span class="title">{{ title }}</span>
            <span :class="['check', {on: picked}]">
                <template v-if="picked">
                    <Icon name="check" />
                </template>
            </span>
        </span>
        <span class="brief">{{ brief }}</span>
        <template v-if="waits.length">
            <span class="waits">Waits on {{ waits.join(", ") }}</span>
        </template>
    </button>
</template>

<style scoped>
.suggestion {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 140px;
    padding: 16px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
    animation: rise 0.45s cubic-bezier(0.2, 0.9, 0.25, 1) both;
    transition:
        border-color 0.15s,
        background 0.15s;
}

.suggestion:hover {
    border-color: var(--border-3);
}

.suggestion.picked {
    border-color: var(--border-3);
    background: var(--sel);
}

.top {
    display: flex;
    align-items: flex-start;
    gap: 10px;
}

.title {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
}

.check {
    display: grid;
    flex: none;
    place-items: center;
    width: 18px;
    height: 18px;
    border: 1.5px solid var(--border-3);
    border-radius: 50%;
    color: transparent;
}

.check.on {
    border-color: var(--text);
    background: var(--text);
    color: var(--bg);
}

.brief {
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.5;
}

.waits {
    margin-top: auto;
    color: var(--text-3);
    font-size: 12px;
}

@keyframes rise {
    from {
        opacity: 0;
        transform: translateY(12px);
    }
}
</style>
