<script setup>
import {computed} from "vue";
import {plainText} from "../text/words.js";

const props = defineProps({text: {type: String, default: ""}, words: {type: Array, default: () => []}});
const escaped = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const flat = computed(() => plainText(props.text));
const parts = computed(() => {
    if (!props.words.length || !flat.value) return [{text: flat.value, hit: false}];
    const pattern = new RegExp(`(${props.words.map(escaped).join("|")})`, "gi");
    return flat.value
        .split(pattern)
        .filter(Boolean)
        .map((part, at) => ({at, text: part, hit: props.words.includes(part.toLowerCase())}));
});
</script>

<template>
    <template v-for="part in parts" :key="part.at">
        <template v-if="part.hit">
            <mark class="marked">{{ part.text }}</mark>
        </template>
        <template v-else>{{ part.text }}</template>
    </template>
</template>

<style scoped>
.marked {
    border-radius: 3px;
    background: color-mix(in srgb, var(--accent) 26%, transparent);
    color: var(--text);
}
</style>
