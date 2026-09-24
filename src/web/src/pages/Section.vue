<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import {store} from "../state/store.js";

const emit = defineEmits(["saveColor"]);
const identity = computed(() => store.identity || {});
</script>

<template>
    <span class="color-control">
        <template v-if="identity.custom_color">
            <Btn small title="Go back to the color picked from the project name" @click="emit('saveColor', null)">Reset</Btn>
        </template>
        <label class="swatch" :style="{'--swatch': identity.color || 'var(--text-4)'}" title="Pick a color">
            <input
                class="swatch-input"
                type="color"
                :value="identity.color || '#000000'"
                aria-label="Project color"
                @change="emit('saveColor', $event.target.value)"
            />
            <span class="swatch-code">{{ identity.color }}</span>
        </label>
    </span>
</template>

<style scoped>
.color-control {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.swatch {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 28px;
    padding: 0 10px 0 6px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    color: var(--text-2);
    font-family: var(--mono);
    font-size: 11.5px;
    cursor: pointer;
}

.swatch::before {
    content: "";
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--swatch);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--text) 18%, transparent);
}

.swatch:hover {
    border-color: var(--border-3);
    background: var(--hover);
    color: var(--text);
}

.swatch:focus-within {
    border-color: var(--accent);
}

.swatch-input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}
</style>
