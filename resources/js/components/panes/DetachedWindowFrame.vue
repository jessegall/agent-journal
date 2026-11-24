<script setup lang="ts">
import { computed } from 'vue';
import Icon from '@/components/kit/Icon.vue';
import IconButton from '@/components/kit/IconButton.vue';
import ResizeGrip from '@/components/kit/ResizeGrip.vue';
import WindowHeader from '@/components/kit/WindowHeader.vue';
import {
    bringToFront,
    changeDetached,
    closeDetached,
    dockWindow,
} from '@/components/panes/arrangement';
import type { DetachedWindow } from '@/components/panes/arrangement';
import { usePaneLayout } from '@/components/panes/usePaneLayout';
import Menu from '@/components/kit/Menu.vue';
import MenuItem from '@/components/kit/MenuItem.vue';
import MenuSeparator from '@/components/kit/MenuSeparator.vue';

/**
 * Version 5's floating window (kit/FloatWindow.vue): a 1 px border, 10 px radius and a deep shadow; a 34 px bar that
 * moves it, with the title and three buttons: minimise to the bar, the window menu, and Dock; and a 14 px grip in
 * the corner that resizes it live.
 */
const props = defineProps<{ window: DetachedWindow }>();

const store = usePaneLayout();

const shown = computed(() => store.windowOf(props.window.key));

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

const SMALL_STEP = 12;
const LARGE_STEP = 48;

/**
 * Option or Alt with an arrow resizes the window from the keyboard: 12 px, or 48 px with Shift.
 */
function resizeByKey(event: KeyboardEvent): void {
    const step = event.shiftKey ? LARGE_STEP : SMALL_STEP;
    const changes: Record<string, { width?: number; height?: number }> = {
        ArrowRight: { width: props.window.width + step },
        ArrowLeft: { width: props.window.width - step },
        ArrowDown: { height: props.window.height + step },
        ArrowUp: { height: props.window.height - step },
    };

    if (!event.altKey || !(event.key in changes)) {
        return;
    }

    event.preventDefault();
    change(changes[event.key]);
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
        @keydown="resizeByKey"
    >
        <WindowHeader
            variant="bar"
            :title="shown?.title"
            :active="true"
            class="touch-none"
            :class="{ 'border-b-0': window.isMinimised }"
            @pointerdown="moveBy"
        >
            <template #leading>
                <template v-if="shown">
                    <Icon :name="shown.icon" :size="13" class="text-text-3" />
                </template>
            </template>
            <template #actions>
                <IconButton
                    :icon="window.isMinimised ? 'window' : 'minimize'"
                    :label="window.isMinimised ? 'Show the whole window' : 'Show only this bar'"
                    @click="change({ isMinimised: !window.isMinimised })"
                />
                <Menu label="Window menu">
                    <MenuItem @click="dock">Dock</MenuItem>
                    <MenuItem @click="change({ isMinimised: !window.isMinimised })">{{
                        window.isMinimised ? 'Show the whole window' : 'Show only this bar'
                    }}</MenuItem>
                    <MenuSeparator />
                    <MenuItem @click="close">Close</MenuItem>
                </Menu>
                <IconButton icon="dock" label="Dock" @click="dock" />
            </template>
        </WindowHeader>
        <div
            v-show="!window.isMinimised"
            class="relative min-h-0 flex-1 overflow-auto"
        >
            <slot />
        </div>
        <template v-if="!window.isMinimised">
            <ResizeGrip
                class="z-3"
                @pointerdown.stop
                @resize="(dx: number, dy: number) => change({ width: window.width + dx, height: window.height + dy })"
            />
        </template>
    </section>
</template>
