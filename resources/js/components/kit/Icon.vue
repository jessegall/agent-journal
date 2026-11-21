<script setup lang="ts">
import { computed } from 'vue';

/**
 * The hand-drawn version 5 icons (16 px box, stroke 1.4), only the shapes version 6 uses so far.
 */
const shapes = {
    home: '<path d="M2.5 7.5L8 2.75l5.5 4.75v6.25h-3.75v-4h-3.5v4H2.5V7.5Z"/>',
    todos: '<circle cx="8" cy="8" r="5.75"/><path d="M5.6 8.1l1.7 1.7 3.2-3.5"/>',
    plan: '<path d="M4 14V2.5M4 3h7.5l-1.5 2.75 1.5 2.75H4"/>',
    rules: '<path d="M3 3.5h10M3 8h10M3 12.5h6"/>',
    docs: '<path d="M4 1.8h5.5L12.5 5v9.2H4V1.8Z"/><path d="M9.5 1.8V5h3"/>',
    search: '<circle cx="7" cy="7" r="4.25"/><path d="M10.25 10.25L13.5 13.5"/>',
    settings:
        '<path d="M2.75 5h3.5M9.75 5h3.5M2.75 11h1.5M7.75 11h5.5"/><circle cx="8" cy="5" r="1.75"/><circle cx="6" cy="11" r="1.75"/>',
    bell: '<path d="M4.5 11V7.5a3.5 3.5 0 0 1 7 0V11l1 1.5h-9z"/><path d="M6.8 13.5a1.3 1.3 0 0 0 2.4 0"/>',
    close: '<path d="M4 4l8 8M12 4l-8 8"/>',
    plus: '<path d="M8 3.5v9M3.5 8h9"/>',
    arrow: '<path d="M3.5 8h9M9 4.5L12.5 8 9 11.5"/>',
    caret: '<path d="M5 6.5l3 3 3-3"/>',
    warn: '<path d="M8 2.6 14 13H2zM8 6.6v3.2M8 11.6v.1"/>',
    users: '<circle cx="6" cy="5.5" r="2.2"/><path d="M2.2 13c.4-2.2 1.9-3.5 3.8-3.5s3.4 1.3 3.8 3.5"/><circle cx="11.2" cy="6" r="1.8"/><path d="M11 9.6c1.6 0 2.8 1.1 3.1 3"/>',
    dot: '<circle cx="8" cy="8" r="2.5"/>',
    info: '<circle cx="8" cy="8" r="5.75"/><path d="M8 7.3v3.4"/><path d="M8 5.1v.1"/>',
    tick: '<path d="M3.8 8.3l2.6 2.6 5.8-6.1"/>',
    phone: '<rect x="4.5" y="1.5" width="7" height="13" rx="1.6"/><path d="M7 12.2h2"/>',
    activity:
        '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10M11 6h1M11 8.5h1"/>',
    start: '<path d="M5.5 3.8v8.4L12 8z" stroke-linejoin="round"/>',
    power: '<path d="M8 2v6"/><path d="M4.5 4.2a5 5 0 1 0 7 0"/>',
    dots: '<path d="M4 8h.01M8 8h.01M12 8h.01"/>',
    list: '<path d="M3 3.5h10M3 8h10M3 12.5h6"/>',
    scheme: '<circle cx="8" cy="8" r="5.75"/><path d="M8 2.25a5.75 5.75 0 0 1 0 11.5z" fill="currentColor" stroke="none"/>',
    wide: '<path d="M6.2 2.6H2.6v3.6M9.8 2.6h3.6v3.6M6.2 13.4H2.6V9.8M9.8 13.4h3.6V9.8"/>',
    chevron: '<path d="M6 3.5 10.5 8 6 12.5"/>',
    chat: '<path d="M2.5 3h11v7.5H8L5 13v-2.5H2.5z"/>',
    agents: '<circle cx="6" cy="5.5" r="2"/><path d="M2.5 13a3.5 3.5 0 0 1 7 0"/><path d="M10.5 3.8a2 2 0 0 1 0 3.4"/><path d="M11.5 9.8a3.5 3.5 0 0 1 2 3.2"/>',
    layout: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9 3v10M9 8h4.5"/>',
    window: '<rect x="3.5" y="3.5" width="9" height="9" rx="1.5"/>',
    accounts:
        '<circle cx="6.5" cy="6" r="2.25"/><path d="M2.5 13a4 4 0 0 1 8 0"/><path d="M11 5.5h2.5M11 8h2.5"/>',
    trash: '<path d="M3 4.5h10M6.4 4.5V3h3.2v1.5M4.4 4.5l.7 8.5h5.8l.7-8.5"/>',
    download: '<path d="M8 2.5v7.5M5 7l3 3 3-3"/><path d="M3 11v2h10v-2"/>',
    upload: '<path d="M8 10V2.5M5 5.5l3-3 3 3"/><path d="M3 11v2h10v-2"/>',
    columns:
        '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M8 3v10"/>',
    rows: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M2.5 8h11"/>',
    tab: '<path d="M2.5 5.5h11V13h-11zM2.5 5.5V3h5v2.5"/>',
    minimize: '<path d="M4 8h8"/>',
    dock: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M8 5.5V10M5.8 7.8 8 10l2.2-2.2"/>',
    pencil: '<path d="M10.6 2.8l2.6 2.6-7.4 7.4-3.3.7.7-3.3z"/><path d="M9.2 4.2l2.6 2.6"/>',
    star: '<path d="M8 1.9l1.85 3.8 4.15.6-3 2.95.7 4.15L8 11.45 4.3 13.4l.7-4.15-3-2.95 4.15-.6Z" stroke-linejoin="round"/>',
    'star-filled':
        '<path d="M8 1.9l1.85 3.8 4.15.6-3 2.95.7 4.15L8 11.45 4.3 13.4l.7-4.15-3-2.95 4.15-.6Z" fill="currentColor" stroke-linejoin="round"/>',
    'dots-vertical':
        '<circle cx="8" cy="3.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="12.5" r="1.3" fill="currentColor" stroke="none"/>',
} as const;

export type IconName = keyof typeof shapes;

const props = withDefaults(
    defineProps<{ name: IconName; size?: number; bold?: boolean }>(),
    { size: 16, bold: false },
);

const shape = computed(() => shapes[props.name]);
</script>

<template>
    <svg
        :width="size"
        :height="size"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        :stroke-width="bold ? 2 : 1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="shrink-0"
        v-html="shape"
    />
</template>
