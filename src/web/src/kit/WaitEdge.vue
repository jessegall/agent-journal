<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import Icon from "./Icon.vue";
import WorkingDots from "./WorkingDots.vue";

const NOTE_SECONDS = 5;
const props = defineProps({waiting: {type: Object, default: null}});
const emit = defineEmits(["list"]);
const note = ref(null);
let timer = 0;

const open = computed(() => (props.waiting ? props.waiting.items.filter((item) => !item.reported).length : 0));
const plural = (n) => `${n} ${n === 1 ? "helper" : "helpers"}`;
function setNote(words) {
    clearTimeout(timer);
    note.value = {words};
    timer = setTimeout(() => (note.value = null), NOTE_SECONDS * 1000);
}

watch(open, (now, before) => {
    if (!props.waiting?.helping || now >= before) return;
    setNote(`${before - now} ${before - now === 1 ? "helper" : "helpers"} reported, ${now} still at work`);
});
onUnmounted(() => clearTimeout(timer));
</script>

<template>
    <div :class="['wait-edge', {waiting: Boolean(waiting)}]">
        <slot />
        <template v-if="note">
            <span class="note">
                <Icon name="tick" :size="11" />
                {{ note.words }}
            </span>
        </template>
        <template v-else-if="waiting">
            <button type="button" class="legend" @click="emit('list', $event)">
                Waiting
                <WorkingDots />
            </button>
        </template>
    </div>
</template>

<style scoped>
.wait-edge {
    position: relative;
    border-radius: var(--edge-radius, 12px);
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
</style>
