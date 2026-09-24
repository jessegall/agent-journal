<script setup>
import {computed} from "vue";

const props = defineProps({text: {type: String, default: ""}, words: {type: Array, default: () => []}});
const escaped = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const parts = computed(() => {
    if (!props.words.length || !props.text) return [{text: props.text, hit: false}];
    const pattern = new RegExp(`(${props.words.map(escaped).join("|")})`, "gi");
    return props.text
        .split(pattern)
        .filter(Boolean)
        .map((part) => ({text: part, hit: props.words.includes(part.toLowerCase())}));
});
</script>

<template>
    <template v-for="(part, i) in parts" :key="i">
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
