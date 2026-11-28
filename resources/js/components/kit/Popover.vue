<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';

/**
 * A labelled, non-modal dialog anchored below or above its anchor, kept inside the window with its own scroll, so
 * nothing around it moves; Escape or a press outside closes it. Measures: docs/designs/kit-components.md.
 */
const props = withDefaults(
    defineProps<{
        label: string;
        anchor?: HTMLElement | null;
        point?: { x: number; y: number };
        align?: 'left' | 'right';
        width?: number;
        placement?: 'below' | 'above';
    }>(),
    { anchor: null, point: undefined, align: 'left', width: undefined, placement: 'below' },
);
const open = defineModel<boolean>('open', { default: false });

const GAP = 4;
const EDGE = 6;
const panel = useTemplateRef<HTMLElement>('panel');
const place = ref({ left: 0, top: 0 });
// Above its anchor the panel is fixed to the window, with the room above the anchor as its most height.
const above = ref({ left: 0, bottom: 0, maxHeight: 0 });

function positionAbove(element: HTMLElement, box: DOMRect): void {
    const width = element.offsetWidth;
    const left = props.align === 'right' ? box.right - width : box.left;

    above.value = {
        left: Math.max(EDGE, Math.min(left, window.innerWidth - width - EDGE)),
        bottom: window.innerHeight - box.top + GAP,
        maxHeight: Math.max(0, box.top - GAP - EDGE),
    };
}

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

    const anchorBox = props.anchor?.getBoundingClientRect();

    if (props.placement === 'above' && anchorBox) {
        positionAbove(element, anchorBox);

        if (!element.contains(document.activeElement)) {
            element.focus();
        }

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

watch(
    open,
    (isOpen) => {
        if (isOpen) {
            position();
        }
    },
    { flush: 'post' },
);
onMounted(() => {
    window.addEventListener('pointerdown', pressOutside, true);

    if (open.value) {
        position();
    }
});
onBeforeUnmount(() => window.removeEventListener('pointerdown', pressOutside, true));
</script>

<template>
    <template v-if="open">
        <template v-if="placement === 'above'">
            <div
                ref="panel"
                role="dialog"
                tabindex="-1"
                :aria-label="label"
                class="fixed z-(--z-menu) overflow-y-auto rounded-menu border border-border-2 bg-raised shadow-pop outline-none"
                :style="{
                    left: `${above.left}px`,
                    bottom: `${above.bottom}px`,
                    maxHeight: `${above.maxHeight}px`,
                    width: width ? `${width}px` : undefined,
                }"
                data-popover-above
                @keydown="escape"
            >
                <slot />
            </div>
        </template>
        <template v-else>
            <div
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
    </template>
</template>
