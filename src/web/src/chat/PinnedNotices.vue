<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import Notice from "./Notice.vue";
import {remember, remembered} from "../composables/remembered.js";

const props = defineProps({notices: {type: Array, required: true}});

const MINIMISED = "chat.pins.minimised";
const minimised = ref(remembered(MINIMISED, false));
const asks = (notice) => Boolean(notice.data.action && notice.data.session);
const pins = computed(() => props.notices.filter((notice) => !asks(notice)));
const shown = computed(() => (minimised.value ? props.notices.filter(asks) : props.notices));

function toggle() {
    minimised.value = !minimised.value;
    remember(MINIMISED, minimised.value);
}
</script>

<template>
    <div class="pinned">
        <TransitionGroup name="act">
            <template v-for="x in shown" :key="x.n">
                <Notice :notice="x" />
            </template>
        </TransitionGroup>
        <template v-if="pins.length">
            <button
                type="button"
                :class="['pins-toggle', {minimised}]"
                :title="minimised ? 'Show the pinned links' : 'Tuck the pinned links into this corner'"
                @click="toggle"
            >
                <Icon :name="minimised ? 'pin' : 'up'" :size="12" />
                <template v-if="minimised">
                    <span class="pins-count">{{ pins.length }}</span>
                </template>
            </button>
        </template>
    </div>
</template>

<style scoped>
.pinned {
    position: relative;
    z-index: 3;
    flex: none;
    display: flex;
    flex-direction: column;
}

.pins-toggle {
    position: absolute;
    right: 10px;
    bottom: -30px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 24px;
    padding: 0 7px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--raised);
    color: var(--text-3);
    font: inherit;
    font-size: 11px;
    cursor: pointer;
    transition:
        color 0.15s,
        border-color 0.15s,
        transform 0.2s cubic-bezier(0.2, 0.9, 0.25, 1);
}

.pins-toggle:hover {
    border-color: var(--border-2);
    color: var(--text);
}

.pins-toggle.minimised {
    color: #4fc3d7;
}

.pins-count {
    font-variant-numeric: tabular-nums;
}
</style>
