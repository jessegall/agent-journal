<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import type { Component } from 'vue';
import { computed } from 'vue';
import PaneGrid from '@/components/panes/PaneGrid.vue';
import { copyIdOf, originalKeyOf } from '@/components/panes/paneLayout';
import type { PaneWindow } from '@/components/panes/paneLayout';
import { providePaneLayout } from '@/components/panes/usePaneLayout';
import WindowHost from '@/framework/WindowHost.vue';
import type { WindowResult } from '@/generated/types/page-props';
import { componentNamed } from '@/framework/manifestComponents';
import type { HomeData, HomeWindowData } from '@/types/generated';
import AgentBar from './AgentBar.vue';
import InformationBar from './InformationBar.vue';

/**
 * Home: the agent bar with the domains' bar sections, the information bar, then the desk, which starts with the chat
 * alone at the reading width; every other window the installed domains offer is added from the bar and floats where it
 * opened, each loaded by its component name and fed by its own prop. A window's links change only its own part of
 * Home's query, window[<key>].
 */
const props = defineProps<{ home: HomeData }>();
const pageProps = usePage().props;

/**
 * A window's result once the browser has it, read for the pane's count when its data names a total.
 */
function resultOf(
    window: HomeWindowData,
): WindowResult<{ pagination?: { total: number } }> | undefined {
    return pageProps[window.propName] as
        | WindowResult<{ pagination?: { total: number } }>
        | undefined;
}

providePaneLayout('home-layout', () =>
    props.home.windows.map((window): PaneWindow => {
        const result = resultOf(window);

        return {
            key: window.paneKey,
            title: window.title,
            icon: window.icon,
            count:
                result?.state === 'ready'
                    ? result.data.pagination?.total
                    : undefined,
        };
    }),
);

const windowsByPane = computed(
    () => new Map(props.home.windows.map((window) => [window.paneKey, window])),
);

/**
 * The window a pane tab shows: a copy reads the same page under its own prop and its own part of the query, so two
 * copies keep their own filters, pages and failures.
 */
function hostedWindow(
    windowKey: string,
): { window: HomeWindowData; propName: string; queryKey: string } | undefined {
    const window = windowsByPane.value.get(originalKeyOf(windowKey));
    const copyId = copyIdOf(windowKey);

    if (window === undefined) {
        return undefined;
    }

    if (copyId === null) {
        return { window, propName: window.propName, queryKey: window.key };
    }

    return {
        window,
        propName: `${window.propName}__${copyId}`,
        queryKey: `${window.key}~${copyId}`,
    };
}
function componentOf(window: HomeWindowData): Component {
    return componentNamed(window.component);
}
</script>

<template>
    <div class="flex h-full min-h-0 flex-col">
        <AgentBar :layouts="home.layouts">
            <template
                v-for="section in home.barSections"
                :key="section.propName"
            >
                <WindowHost
                    :component="componentNamed(section.component)"
                    :prop-name="section.propName"
                />
            </template>
        </AgentBar>
        <div class="relative flex min-h-0 flex-1 flex-col">
            <InformationBar />
            <PaneGrid>
                <template #default="{ windowKey }">
                    <template
                        v-for="hosted in [hostedWindow(windowKey)]"
                        :key="windowKey"
                    >
                        <template v-if="hosted !== undefined">
                            <WindowHost
                                :component="componentOf(hosted.window)"
                                :prop-name="hosted.propName"
                                :page-key="hosted.queryKey"
                                :subject="hosted.window.title"
                            />
                        </template>
                    </template>
                </template>
            </PaneGrid>
        </div>
    </div>
</template>
