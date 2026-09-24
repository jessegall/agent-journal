<script setup>
import {computed} from "vue";
import Icon from "./Icon.vue";

const props = defineProps({
    href: {type: String, required: true},
    kind: {type: String, required: true},
    label: {type: String, default: ""},
    compact: Boolean,
});
const ICONS = {Design: "artboard", Figma: "artboard", Page: "webpage", Viewer: "webpage", "Pull request": "pull"};
const file = computed(() => new URL(props.href).searchParams.get("file")?.replace(/\.dc\.html$|\.html$/, "") || "");
const place = computed(() => {
    const url = new URL(props.href);
    return file.value || `${url.host}${url.pathname}`;
});
const text = computed(() => props.label || (props.compact ? file.value || props.kind : place.value));
</script>

<template>
    <a :class="['link-card', {compact}]" :href="href" target="_blank" rel="noopener" :title="compact ? `${kind} · ${href}` : href">
        <Icon :name="compact ? ICONS[kind] || 'open' : 'open'" />
        <template v-if="!compact">
            <span class="link-kind">{{ kind }}</span>
        </template>
        <span class="link-place">{{ text }}</span>
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

.link-card.compact {
    display: inline-flex;
    gap: 6px;
    max-width: 200px;
    height: 26px;
    padding: 0 9px 0 8px;
    border-color: var(--border-2);
    border-radius: 7px;
    background: transparent;
    color: var(--text-2);
    font-size: 12px;
}

.link-card.compact .ico {
    flex: none;
    width: 13px;
    height: 13px;
    color: var(--accent-text);
}

.link-card.compact:hover {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 10%, transparent);
    color: var(--text);
}
</style>
