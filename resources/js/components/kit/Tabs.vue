<script setup lang="ts">
import { computed, nextTick, provide, useId, useTemplateRef } from 'vue';
import Tab from './Tab.vue';
import { tabsKey } from './tabs';
import type { TabItem } from './tabs';

/**
 * A tab list bound to its panels with the tablist, tab and tabpanel roles: Left and Right move and choose round the
 * ends, Home and End jump. The tabs come as data with a panel slot per key, or as Tab parts in the tabs slot, in the
 * inline, pagehead, filters or toolbar style. Measures: docs/designs/kit-components.md.
 */
const props = withDefaults(
    defineProps<{
        tabs?: readonly TabItem[];
        label?: string;
        variant?: 'inline' | 'pagehead' | 'filters' | 'toolbar';
        line?: 'brand' | 'quiet';
    }>(),
    { tabs: () => [], label: undefined, variant: 'inline', line: 'brand' },
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
    hasLeastWidth: computed(() => props.variant === 'toolbar'),
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

// A toolbar's tabs sit 14 px apart, as the design's filters do; elsewhere the gap is the strip's or the page's.
const tabGap = computed(() => (props.variant === 'toolbar' ? 'gap-3.5' : 'gap-4'));
</script>

<template>
    <div class="flex flex-col">
        <div
            ref="list"
            role="tablist"
            :aria-label="label"
            class="flex"
            :class="[
                tabGap,
                {
                    inline: 'mt-2.5 mb-1.5 border-b border-line',
                    pagehead: 'h-13 items-center',
                    filters: 'border-b border-line px-3',
                    toolbar: '',
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
                class="outline-none focus-visible:outline-2 focus-visible:outline-focus"
                :class="{ 'pt-3': variant !== 'toolbar' }"
            >
                <slot :name="tab.key" />
            </div>
        </template>
    </div>
</template>
