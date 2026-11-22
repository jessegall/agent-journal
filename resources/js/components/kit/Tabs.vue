<script setup lang="ts">
import { computed, nextTick, provide, useId, useTemplateRef } from 'vue';
import Tab from './Tab.vue';
import { tabsKey } from './tabs';
import type { TabItem } from './tabs';

/**
 * A tab list bound to its panels: tablist, tab and tabpanel roles with aria-controls and aria-labelledby. Left and
 * Right move and choose the tab, round the ends, and Home and End go to the first and last (roving tabindex). The
 * caller gives the tabs as data (with a panel slot per tab key) or draws its own Tab parts in the tabs slot. Variants:
 * inline (margin 10 0 6, a --line rule), pagehead (52 px high, no rule) and filters (padding 0 12, a --line rule); the
 * gap is 12 px in a strip and 16 px on a page; the chosen line is the brand colour or quiet.
 */
const props = withDefaults(
    defineProps<{
        tabs?: readonly TabItem[];
        label?: string;
        variant?: 'inline' | 'pagehead' | 'filters';
        line?: 'brand' | 'quiet';
        gap?: 12 | 16;
    }>(),
    { tabs: () => [], label: undefined, variant: 'inline', line: 'brand', gap: 12 },
);
const active = defineModel<string>({ required: true });
const emit = defineEmits<{ close: [key: string] }>();

const idPrefix = useId();
const list = useTemplateRef<HTMLElement>('list');

provide(tabsKey, {
    active,
    select: (value) => (active.value = value),
    close: (value) => emit('close', value),
    tabId: (value) => `${idPrefix}-tab-${value}`,
    panelId: (value) => `${idPrefix}-panel-${value}`,
    line: computed(() => props.line),
});

function panelId(key: string): string {
    return `${idPrefix}-panel-${key}`;
}

async function move(event: KeyboardEvent): Promise<void> {
    const tabs = [...(list.value?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [])];
    const current = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    const last = tabs.length - 1;
    const targets: Record<string, number> = {
        ArrowRight: current === last ? 0 : current + 1,
        ArrowLeft: current <= 0 ? last : current - 1,
        Home: 0,
        End: last,
    };

    if (!(event.key in targets) || last < 0) {
        return;
    }

    event.preventDefault();
    tabs[targets[event.key]].click();
    await nextTick();
    tabs[targets[event.key]].focus();
}
</script>

<template>
    <div class="flex flex-col">
        <div
            ref="list"
            role="tablist"
            :aria-label="label"
            class="flex"
            :class="[
                gap === 12 ? 'gap-3' : 'gap-4',
                {
                    inline: 'mt-2.5 mb-1.5 border-b border-line',
                    pagehead: 'h-13 items-center',
                    filters: 'border-b border-line px-3',
                }[variant],
            ]"
            @keydown="move"
        >
            <slot name="tabs">
                <Tab
                    v-for="tab in tabs"
                    :key="tab.key"
                    :value="tab.key"
                    :label="tab.label"
                    :icon="tab.icon"
                    :count="tab.count"
                    :closable="tab.closable"
                />
            </slot>
        </div>
        <template v-for="tab in tabs" :key="tab.key">
            <div
                v-show="tab.key === active"
                :id="panelId(tab.key)"
                role="tabpanel"
                :aria-labelledby="`${idPrefix}-tab-${tab.key}`"
                tabindex="0"
                class="pt-3 outline-none focus-visible:outline-2 focus-visible:outline-focus"
            >
                <slot :name="tab.key" />
            </div>
        </template>
    </div>
</template>
