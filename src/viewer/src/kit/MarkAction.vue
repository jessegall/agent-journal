<script setup>
import MarkIcon from "./MarkIcon.vue";

// The one-click action at the end of a mark or a card: it opens what the mark is about, named in a tip, and in words once the mark is open
defineProps({label: {type: String, required: true}, open: Boolean});
</script>

<template>
    <button type="button" :class="['mact', {open}]" :data-tip="label" :aria-label="label">
        <MarkIcon name="open" />
        <template v-if="open">
            <span class="mact-word">{{ label }}</span>
        </template>
        <span class="hit"></span>
    </button>
</template>

<style scoped>
.mact {
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-width: 19px;
    height: 19px;
    margin: -1px -4px -1px 6px;
    padding: 0;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11px;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    transition:
        opacity 0.12s ease,
        background 0.12s ease,
        color 0.12s ease;
}

.mact :deep(svg) {
    width: 12px;
    height: 12px;
    stroke-width: 1.5;
}

.mact:hover {
    background: var(--sel);
    color: var(--text);
}

.mact:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--accent-text) 70%, transparent);
    outline-offset: 0;
}

.mact.open {
    padding: 0 6px 0 4px;
}

/* the tip in plain words, under the button, after a moment */
.mact::after {
    content: attr(data-tip);
    position: absolute;
    top: calc(100% + 7px);
    right: -2px;
    z-index: 20;
    padding: 4px 9px 5px;
    border: 1px solid var(--tip-edge);
    border-radius: 7px;
    background: var(--tip-bg);
    box-shadow: var(--tip-shadow);
    color: var(--text);
    font-size: 12px;
    font-weight: 400;
    line-height: 1.4;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.12s ease;
}

.mact:hover::after,
.mact:focus-visible::after {
    opacity: 1;
    transition-delay: 0.45s;
}

.mact.open::after {
    display: none;
}

/* a phone has no pointer to point with: no tip, and a 40 by 44 pixel touch area */
.hit {
    position: absolute;
    top: 50%;
    left: 50%;
    display: none;
    width: 40px;
    height: 44px;
    transform: translate(-50%, -50%);
}

:global(html.phone .mact::after) {
    display: none;
}

:global(html.phone .mact .hit) {
    display: block;
}

@media (hover: none) {
    .mact::after {
        display: none;
    }

    .hit {
        display: block;
    }
}
</style>
