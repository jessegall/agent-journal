<script setup>
import {computed} from "vue";
import Icon from "./Icon.vue";

const props = defineProps({
    href: {type: String, required: true},
    kind: {type: String, required: true},
    label: {type: String, default: ""},
});
const ICONS = {Design: "artboard", Figma: "artboard", Page: "webpage", Viewer: "webpage", "Pull request": "pull"};
const file = computed(() => new URL(props.href).searchParams.get("file")?.replace(/\.dc\.html$|\.html$/, "") || "");
const text = computed(() => props.label || file.value || props.kind);
</script>

<template>
    <a class="link-card" :href="href" target="_blank" rel="noopener" :title="`${kind} · ${href}`">
        <Icon :name="ICONS[kind] || 'open'" />
        <span class="link-place">{{ text }}</span>
    </a>
</template>

<style scoped>
.link-card {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    max-width: 200px;
    height: 26px;
    padding: 0 9px 0 8px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: transparent;
    color: var(--text-2);
    font-size: 12px;
    text-decoration: none;
}

.link-card .ico {
    flex: none;
    width: 13px;
    height: 13px;
    color: var(--accent-text);
}

.link-card:hover {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 10%, transparent);
    color: var(--text);
}

.link-place {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
