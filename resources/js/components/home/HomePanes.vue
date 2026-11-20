<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import type { Component } from 'vue';
import { computed, defineAsyncComponent } from 'vue';
import PaneGrid from '@/components/panes/PaneGrid.vue';
import type { PaneWindow } from '@/components/panes/paneLayout';
import { providePaneLayout } from '@/components/panes/usePaneLayout';
import WindowHost from '@/framework/WindowHost.vue';
import type { WindowResult } from '@/generated/types/page-props';
import { components } from '@/generated/ui-manifest';
import type { HomeData, HomeWindowData } from '@/types/generated';
import AgentBar from './AgentBar.vue';
import InformationBar from './InformationBar.vue';

/**
 * Home as version 5 draws it: the agent bar, the information bar, then the pane grid with the windows the installed
 * domains offer, each loaded by its component name and fed by its own prop. A window's links change only its own part
 * of Home's query, window[<key>].
 */
const props = defineProps<{ home: HomeData }>();
const pageProps = usePage().props;

/**
 * A window's result once the browser has it, read for the pane's count when its data names a total.
 */
function resultOf(window: HomeWindowData): WindowResult<{ pagination?: { total: number } }> | undefined {
    return pageProps[window.propName] as WindowResult<{ pagination?: { total: number } }> | undefined;
}

providePaneLayout('home-layout', () =>
    props.home.windows.map((window): PaneWindow => {
        const result = resultOf(window);

        return {
            key: window.paneKey,
            title: window.title,
            icon: window.icon,
            count: result?.state === 'ready' ? result.data.pagination?.total : undefined,
        };
    }),
);

const windowsByPane = computed(() => new Map(props.home.windows.map((window) => [window.paneKey, window])));
const loaded = new Map<string, Component>();

function componentOf(window: HomeWindowData): Component {
    const known = loaded.get(window.component);

    if (known !== undefined) {
        return known;
    }

    const component = defineAsyncComponent(async () => (await components[window.component]()).default as Component);
    loaded.set(window.component, component);

    return component;
}

/**
 * The first section in Home's bar that names something, such as the agent the chat talks to.
 */
const barLabel = computed(() => {
    for (const name of props.home.barProps) {
        const result = pageProps[name] as WindowResult<{ label?: string }> | null | undefined;

        if (result?.state === 'ready' && result.data.label !== undefined) {
            return result.data.label;
        }
    }

    return undefined;
});
</script>

<template>
    <div class="flex h-full min-h-0 flex-col">
        <AgentBar :agent-name="barLabel" />
        <InformationBar :agent-name="barLabel" :layouts="home.layouts" />
        <PaneGrid>
            <template #default="{ windowKey }">
                <template v-if="windowsByPane.get(windowKey)">
                    <WindowHost
                        :component="componentOf(windowsByPane.get(windowKey)!)"
                        :prop-name="windowsByPane.get(windowKey)!.propName"
                        :page-key="windowsByPane.get(windowKey)!.key"
                    />
                </template>
            </template>
        </PaneGrid>
    </div>
</template>
