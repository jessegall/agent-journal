<script setup lang="ts">
import { computed, ref } from 'vue';
import Icon from '@/components/kit/Icon.vue';
import {
    bringToFront,
    changeDetached,
    closeDetached,
    dockWindow,
} from '@/components/panes/arrangement';
import type { DetachedWindow } from '@/components/panes/arrangement';
import { usePaneLayout } from '@/components/panes/usePaneLayout';
import MenuList from './MenuList.vue';

/**
 * Version 5's floating window (kit/FloatWindow.vue): a 1 px border, 10 px radius and a deep shadow; a 34 px bar that
 * moves it, with the title and three buttons: minimise to the bar, the window menu, and Dock; and a 14 px grip in
 * the corner that resizes it live.
 */
const props = defineProps<{ window: DetachedWindow }>();

const store = usePaneLayout();
const isMenuOpen = ref(false);

const shown = computed(() =>
    store.windows.value.find((each) => each.key === props.window.key),
);

function change(patch: Partial<Omit<DetachedWindow, 'key'>>): void {
    store.apply(
        changeDetached(
            store.arrangement.value,
            props.window.key,
            patch,
            store.screen(),
        ),
    );
}

function follow(
    event: PointerEvent,
    patchAt: (dx: number, dy: number) => Partial<Omit<DetachedWindow, 'key'>>,
): void {
    event.preventDefault();
    const start = { x: event.clientX, y: event.clientY };
    const move = (moved: PointerEvent): void =>
        change(patchAt(moved.clientX - start.x, moved.clientY - start.y));
    const stop = (): void => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', stop);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
}

function moveBy(event: PointerEvent): void {
    if (event.button !== 0 || (event.target as Element).closest('button')) {
        return;
    }

    const from = { left: props.window.left, top: props.window.top };
    follow(event, (dx, dy) => ({ left: from.left + dx, top: from.top + dy }));
}

function resizeBy(event: PointerEvent): void {
    const from = { width: props.window.width, height: props.window.height };
    follow(event, (dx, dy) => ({
        width: from.width + dx,
        height: from.height + dy,
    }));
}

function front(): void {
    store.apply(bringToFront(store.arrangement.value, props.window.key));
}

function close(): void {
    store.apply(closeDetached(store.arrangement.value, props.window.key));
}

function dock(): void {
    store.apply(dockWindow(store.arrangement.value, props.window.key));
}
</script>

<template>
    <section
        class="fixed z-20 flex flex-col overflow-hidden rounded-bubble border border-border-3 bg-bg shadow-[0_18px_48px_rgba(0,0,0,.5)]"
        :style="{
            left: `${window.left}px`,
            top: `${window.top}px`,
            width: `${window.width}px`,
            height: window.isMinimised ? 'auto' : `${window.height}px`,
        }"
        :aria-label="shown?.title"
        @pointerdown="front"
    >
        <div
            class="flex h-[34px] flex-none cursor-grab touch-none items-center gap-2 bg-float-bar pr-[5px] pl-3 text-small text-text"
            :class="{ 'border-b border-border': !window.isMinimised }"
            @pointerdown="moveBy"
        >
            <template v-if="shown">
                <Icon :name="shown.icon" :size="13" class="text-text-3" />
                <span class="truncate">{{ shown.title }}</span>
            </template>
            <span class="flex-1"></span>
            <button
                type="button"
                class="grid size-[26px] place-items-center rounded-control text-text-3 hover:bg-hover hover:text-text"
                :title="
                    window.isMinimised
                        ? 'Show the whole window'
                        : 'Show only this bar'
                "
                :aria-label="
                    window.isMinimised
                        ? 'Show the whole window'
                        : 'Show only this bar'
                "
                @click="change({ isMinimised: !window.isMinimised })"
            >
                <Icon
                    :name="window.isMinimised ? 'window' : 'minimize'"
                    :size="16"
                />
            </button>
            <button
                type="button"
                class="grid size-[26px] place-items-center rounded-control text-text-3 hover:bg-hover hover:text-text"
                title="Window menu"
                aria-label="Window menu"
                @click.stop="isMenuOpen = !isMenuOpen"
            >
                <Icon name="dots-vertical" :size="16" />
            </button>
            <button
                type="button"
                class="grid size-[26px] place-items-center rounded-control text-text-3 hover:bg-hover hover:text-text"
                title="Dock it back into the layout"
                aria-label="Dock"
                @click="dock"
            >
                <Icon name="dock" :size="16" />
            </button>
        </div>
        <template v-if="isMenuOpen">
            <MenuList
                :entries="[
                    { label: 'Dock', run: dock },
                    {
                        label: window.isMinimised
                            ? 'Show the whole window'
                            : 'Show only this bar',
                        run: () => change({ isMinimised: !window.isMinimised }),
                    },
                    {
                        label: 'Close',
                        startsGroup: true,
                        run: close,
                    },
                ]"
                class="absolute top-[34px] right-[5px]"
                @done="isMenuOpen = false"
            />
        </template>
        <div
            v-show="!window.isMinimised"
            class="relative min-h-0 flex-1 overflow-auto"
        >
            <slot />
        </div>
        <template v-if="!window.isMinimised">
            <span
                class="absolute right-0 bottom-0 z-3 size-3.5 cursor-nwse-resize touch-none bg-[linear-gradient(135deg,transparent_55%,var(--border-3)_55%,var(--border-3)_61%,transparent_61%,transparent_72%,var(--border-3)_72%,var(--border-3)_78%,transparent_78%)]"
                title="Resize"
                @pointerdown.stop="resizeBy"
            ></span>
        </template>
    </section>
</template>
