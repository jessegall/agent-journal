<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Icon from '@/components/kit/Icon.vue';
import type { IconName } from '@/components/kit/Icon.vue';
import MenuList from './MenuList.vue';
import type { MenuEntry } from './MenuList.vue';
import type { SplitSide } from './paneLayout';

/**
 * Version 5's tab strip (kit/EditorTabs.vue): 34 px on the sidebar colour, each tab with its icon, label, count and a
 * close cross whose slot is always kept so no tab changes width. A middle click or Delete closes a tab, a right click
 * opens its menu, and a strip too tight for every label shows only the icon of its inactive tabs. The pane's own
 * buttons come in the slot at the right.
 */
export type PaneTab = {
    key: string;
    title: string;
    icon: IconName;
    count?: number;
    isActive: boolean;
};

const props = defineProps<{ tabs: PaneTab[] }>();

const emit = defineEmits<{
    pick: [key: string];
    close: [key: string];
    split: [key: string, side: SplitSide];
}>();

const row = ref<HTMLElement | null>(null);
const isCompact = ref(false);
const menu = ref<{ tab: PaneTab; left: number; top: number } | null>(null);
let watcher: ResizeObserver | null = null;

async function fit(): Promise<void> {
    isCompact.value = false;
    await nextTick();

    if (row.value) {
        isCompact.value = row.value.scrollWidth > row.value.clientWidth;
    }
}

function closeEach(tabs: PaneTab[]): void {
    tabs.forEach((tab) => emit('close', tab.key));
}

function menuOf(tab: PaneTab): MenuEntry[] {
    const place = props.tabs.indexOf(tab);
    const isAlone = props.tabs.length < 2;

    return [
        { label: 'Close', run: () => emit('close', tab.key) },
        {
            label: 'Close others',
            disabled: isAlone,
            run: () => closeEach(props.tabs.filter((other) => other !== tab)),
        },
        {
            label: 'Close to the right',
            disabled: place === props.tabs.length - 1,
            run: () => closeEach(props.tabs.slice(place + 1)),
        },
        { label: 'Close all', run: () => closeEach(props.tabs) },
        {
            label: 'Split right',
            disabled: isAlone,
            run: () => emit('split', tab.key, 'right'),
            startsGroup: true,
        },
        {
            label: 'Split below',
            disabled: isAlone,
            run: () => emit('split', tab.key, 'below'),
        },
    ];
}

function openMenu(event: MouseEvent, tab: PaneTab): void {
    menu.value = { tab, left: event.clientX, top: event.clientY };
}

function closeByMiddleClick(event: MouseEvent, key: string): void {
    if (event.button === 1) {
        event.preventDefault();
        emit('close', key);
    }
}

watch(
    () => props.tabs.map((tab) => `${tab.title}:${tab.count ?? ''}`).join('|'),
    fit,
);

onMounted(() => {
    void fit();
    watcher = new ResizeObserver(() => void fit());

    if (row.value) {
        watcher.observe(row.value);
    }
});

onBeforeUnmount(() => watcher?.disconnect());
</script>

<template>
    <div
        class="flex h-[34px] flex-none items-stretch gap-2 border-b border-border bg-side pr-[5px] pl-3.5"
    >
        <div
            ref="row"
            role="tablist"
            class="flex min-w-0 flex-1 gap-3 overflow-hidden"
        >
            <template v-for="tab in tabs" :key="tab.key">
                <div
                    role="tab"
                    tabindex="0"
                    :aria-selected="tab.isActive"
                    class="group relative inline-flex flex-none cursor-pointer items-center gap-1.5 text-badge tracking-[.03em] whitespace-nowrap transition-colors duration-150 hover:text-text-2 focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-brand"
                    :class="
                        tab.isActive
                            ? 'text-text! shadow-[inset_0_-1px_0_var(--brand)]'
                            : 'text-text-3'
                    "
                    @click="emit('pick', tab.key)"
                    @mousedown.middle.prevent
                    @auxclick="closeByMiddleClick($event, tab.key)"
                    @contextmenu.prevent="openMenu($event, tab)"
                    @keydown.enter.prevent="emit('pick', tab.key)"
                    @keydown.space.prevent="emit('pick', tab.key)"
                    @keydown.delete.prevent="emit('close', tab.key)"
                >
                    <Icon :name="tab.icon" :size="13" />
                    <span v-show="!isCompact || tab.isActive">{{
                        tab.title
                    }}</span>
                    <template v-if="tab.count !== undefined">
                        <span
                            class="text-meta tabular-nums"
                            :class="
                                tab.isActive ? 'text-brand-text' : 'text-text-3'
                            "
                            >{{ tab.count }}</span
                        >
                    </template>
                    <button
                        v-show="!isCompact || tab.isActive"
                        type="button"
                        tabindex="-1"
                        :aria-label="`Close ${tab.title}`"
                        class="grid size-4 flex-none place-items-center rounded-badge text-text-4 hover:bg-hover hover:text-text"
                        :class="
                            tab.isActive
                                ? 'opacity-100'
                                : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                        "
                        @click.stop="emit('close', tab.key)"
                    >
                        <Icon name="close" :size="10" />
                    </button>
                </div>
            </template>
        </div>
        <div class="flex flex-none items-center gap-0.5">
            <slot />
        </div>
        <template v-if="menu">
            <MenuList
                :title="menu.tab.title"
                :entries="menuOf(menu.tab)"
                class="fixed"
                :style="{ left: `${menu.left}px`, top: `${menu.top}px` }"
                @done="menu = null"
            />
        </template>
    </div>
</template>
