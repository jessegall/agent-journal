<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';

/**
 * An anchored surface that is not modal and has no scrim: --raised, a --border-2 border, radius --radius-menu and
 * --shadow-pop. It sits 4 px below its anchor, aligned to the anchor's left or right edge (or at a point), stays 6 px
 * inside its frame (the nearest positioned parent) and flips above the anchor when it would pass the bottom. It is a
 * dialog with a label; Escape or a press outside closes it and focus returns to the anchor.
 */
const props = withDefaults(
    defineProps<{
        label: string;
        anchor?: HTMLElement | null;
        point?: { x: number; y: number };
        align?: 'left' | 'right';
        width?: number;
    }>(),
    { anchor: null, point: undefined, align: 'left', width: undefined },
);
const open = defineModel<boolean>('open', { default: false });

const GAP = 4;
const EDGE = 6;
const panel = useTemplateRef<HTMLElement>('panel');
const place = ref({ left: 0, top: 0 });

function close(): void {
    open.value = false;
    props.anchor?.focus();
}

async function position(): Promise<void> {
    await nextTick();
    const element = panel.value;

    if (!element) {
        return;
    }

    const frame = (element.offsetParent ?? document.documentElement).getBoundingClientRect();
    const box = props.anchor?.getBoundingClientRect();
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    let left = props.point?.x ?? 0;
    let top = props.point?.y ?? 0;

    if (box) {
        left = (props.align === 'right' ? box.right - width : box.left) - frame.left;
        top = box.bottom - frame.top + GAP;

        if (top + height > frame.height - EDGE) {
            top = box.top - frame.top - height - GAP;
        }
    }

    place.value = {
        left: Math.max(EDGE, Math.min(left, frame.width - width - EDGE)),
        top: Math.max(EDGE, Math.min(top, frame.height - height - EDGE)),
    };

    if (!element.contains(document.activeElement)) {
        element.focus();
    }
}

function pressOutside(event: PointerEvent): void {
    const target = event.target as Node;

    if (open.value && !panel.value?.contains(target) && !props.anchor?.contains(target)) {
        open.value = false;
    }
}

function escape(event: KeyboardEvent): void {
    if (open.value && event.key === 'Escape') {
        event.stopPropagation();
        close();
    }
}

watch(open, (isOpen) => isOpen && position(), { flush: 'post' });
onMounted(() => {
    window.addEventListener('pointerdown', pressOutside, true);
    open.value && position();
});
onBeforeUnmount(() => window.removeEventListener('pointerdown', pressOutside, true));
</script>

<template>
    <div
        v-if="open"
        ref="panel"
        role="dialog"
        tabindex="-1"
        :aria-label="label"
        class="absolute z-(--z-menu) overflow-hidden rounded-menu border border-border-2 bg-raised shadow-pop outline-none"
        :style="{ left: `${place.left}px`, top: `${place.top}px`, width: width ? `${width}px` : undefined }"
        @keydown="escape"
    >
        <slot />
    </div>
</template>
