<script setup>
import {onUnmounted, ref} from "vue";
import Icon from "./Icon.vue";

const props = defineProps({text: {type: String, required: true}, label: {type: String, default: ""}});
const FLASH = 1500;
const copied = ref(false);
let timer = 0;

async function copy() {
    await navigator.clipboard.writeText(props.text);
    copied.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), FLASH);
}

onUnmounted(() => clearTimeout(timer));
</script>

<template>
    <button type="button" :class="['copy-button', {copied, labelled: label}]" :title="copied ? 'Copied' : 'Copy'" @click.stop="copy">
        <Icon :name="copied ? 'tick' : 'copy'" :size="12" />
        <template v-if="label">
            <span>{{ copied ? "Copied" : label }}</span>
        </template>
    </button>
</template>

<style scoped>
.copy-button {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-width: 26px;
    height: 26px;
    padding: 0 6px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: transparent;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    transition:
        color 0.15s,
        border-color 0.15s;
}

.copy-button.labelled {
    padding: 0 10px 0 8px;
}

.copy-button:hover {
    background: var(--hover);
    color: var(--text);
}

.copy-button.copied {
    border-color: color-mix(in srgb, var(--tone-good) 60%, transparent);
    color: var(--tone-good);
}
</style>
