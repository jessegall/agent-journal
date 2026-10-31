<script setup>
import {computed, ref} from "vue";
import MarkIcon from "../kit/MarkIcon.vue";
import {api} from "../api/client.js";
import {pressable, pressButton} from "./markButtons.js";

const props = defineProps({buttons: {type: Array, default: () => []}, mark: {type: Object, required: true}, allowedRuns: {type: Array, default: null}});
const offered = computed(() => pressable(props.buttons, props.allowedRuns));
const refusal = ref("");

// a button the server refuses shows the refusal beside it, until the next press
async function press(button) {
    const result = await pressButton(button, props.mark, api.env());
    refusal.value = result.ok ? "" : result.error;
}
</script>

<template>
    <template v-for="button in offered" :key="button.runs">
        <button type="button" class="mark-button" :title="button.label" :aria-label="button.label" @click.stop="press(button)">
            <MarkIcon :name="button.icon" />
        </button>
    </template>
    <template v-if="refusal">
        <span class="mark-refusal" role="alert">{{ refusal }}</span>
    </template>
</template>

<style scoped>
.mark-refusal {
    color: var(--danger);
    font-size: 11.5px;
}

.mark-button {
    display: grid;
    flex: none;
    place-items: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-4);
    cursor: pointer;
    opacity: 0;
    transition:
        opacity 0.12s ease,
        background 0.12s ease,
        color 0.12s ease;
}

.mark-button :deep(svg) {
    width: 14px;
    height: 14px;
}

.mark-button:hover {
    background: var(--hover);
    color: var(--text-2);
}

.mark-button:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--accent-text) 70%, transparent);
    outline-offset: 0;
}

:global(.mark-row:hover .mark-button),
:global(.mark-row:focus-within .mark-button),
:global(html.phone .mark-button) {
    opacity: 1;
}

@media (hover: none) {
    .mark-button {
        opacity: 1;
    }
}
</style>
