<script setup>
import {computed} from "vue";
import Icon from "./Icon.vue";

const props = defineProps({href: {type: String, required: true}, kind: {type: String, required: true}});
const place = computed(() => {
    const url = new URL(props.href);
    const file = url.searchParams.get("file");
    return file ? file.replace(/\.dc\.html$|\.html$/, "") : `${url.host}${url.pathname}`;
});
</script>

<template>
    <a class="link-card" :href="href" target="_blank" rel="noopener" :title="href">
        <Icon name="open" />
        <span class="link-kind">{{ kind }}</span>
        <span class="link-place">{{ place }}</span>
    </a>
</template>

<style scoped>
.link-card {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
    padding: 9px 12px;
    border: 1px solid var(--accent);
    border-radius: 8px;
    background: color-mix(in srgb, var(--accent) 10%, var(--bg));
    color: var(--text);
    text-decoration: none;
}

.link-card:hover {
    background: color-mix(in srgb, var(--accent) 18%, var(--bg));
}

.link-kind {
    flex: none;
    color: var(--accent-text);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.link-place {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
