<script setup>
import {computed, useId} from "vue";

const props = defineProps({
    lines: {type: Number, default: 0},
    draft: Boolean,
    clipped: Boolean,
    fresh: Boolean,
    label: {type: String, default: ""},
    read: {type: Number, default: -1},
});
const clip = useId();
const LABEL_AT_MOST = 4;
const WIDTHS = [16, 12, 15, 9, 14, 11, 13];
const room = computed(() => (props.label ? 3 : WIDTHS.length));
const shown = computed(() => WIDTHS.slice(0, Math.min(Math.max(props.lines, 1), room.value)));
const tag = computed(() => props.label.slice(0, LABEL_AT_MOST).toUpperCase());
</script>

<template>
    <svg :class="['page-thumb', {draft, done: read >= 1}]" viewBox="0 0 32 40" width="32" height="40" aria-hidden="true">
        <path class="page-thumb-sheet" d="M5 1h16l9 9v27a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" />
        <template v-if="read >= 0">
            <clipPath :id="clip">
                <path d="M5 1h16l9 9v27a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" />
            </clipPath>
            <rect
                class="page-thumb-read"
                :clip-path="`url(#${clip})`"
                x="3"
                y="1"
                width="27"
                height="38"
                :style="{transform: `scaleY(${Math.min(read, 1)})`}"
            />
        </template>
        <path class="page-thumb-fold" d="M21 1v7a2 2 0 0 0 2 2h7z" />
        <template v-for="(w, i) in shown" :key="i">
            <rect class="page-thumb-line" x="8" :y="14 + i * 3.4" :width="w" height="1.5" rx="0.75" />
        </template>
        <template v-if="tag">
            <rect class="page-thumb-tag" x="0" y="26" :width="tag.length * 5 + 6" height="9" rx="2" />
            <text class="page-thumb-tag-text" x="3" y="32.9">{{ tag }}</text>
        </template>
        <template v-if="clipped">
            <path class="page-thumb-clip" d="M9.5 -1.5v9a2.3 2.3 0 0 0 4.6 0v-7.2a1.5 1.5 0 0 0-3 0v6.4" />
        </template>
        <template v-if="fresh">
            <circle class="page-thumb-fresh" cx="30" cy="3" r="2.6" />
        </template>
    </svg>
</template>

<style scoped>
.page-thumb {
    flex: none;
    overflow: visible;
}

.page-thumb-sheet {
    fill: var(--raised);
    stroke: var(--text-4);
    stroke-width: 1.1;
    transition: stroke 0.15s;
}

.page-thumb-fold {
    fill: var(--border-2);
    stroke: var(--text-4);
    stroke-width: 1.1;
    stroke-linejoin: round;
}

.page-thumb.draft .page-thumb-sheet {
    stroke-dasharray: 2.6 2.2;
}

.page-thumb-read {
    fill: color-mix(in srgb, var(--accent) 26%, transparent);
    transform-box: view-box;
    transform-origin: 0 1px;
    transition:
        transform var(--move),
        fill var(--fade);
}

.page-thumb.done .page-thumb-read {
    fill: color-mix(in srgb, var(--tone-good) 22%, transparent);
}

.page-thumb-line {
    fill: var(--text-4);
}

.page-thumb-tag {
    fill: var(--accent);
}

.page-thumb-tag-text {
    fill: var(--bg);
    font-family: var(--mono);
    font-size: 7px;
    font-weight: 700;
    letter-spacing: 0.02em;
}

.page-thumb-clip {
    fill: none;
    stroke: var(--text-2);
    stroke-width: 1.2;
    stroke-linecap: round;
}

.page-thumb-fresh {
    fill: var(--accent);
    stroke: var(--bg);
    stroke-width: 1.5;
}
</style>
