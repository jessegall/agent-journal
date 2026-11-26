<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import type { Component } from 'vue';
import { computed } from 'vue';
import PaneGrid from '@/web/pages/web/partials/PaneGrid.vue';
import { showWindow } from '@/components/panes/arrangement';
import { copyIdOf, openCopy, originalKeyOf, windowsIn } from '@/components/panes/paneLayout';
import { provideFileOpener } from '@/framework/fileOpener';
import type { PaneWindow } from '@/components/panes/paneLayout';
import { providePaneLayout } from '@/components/panes/usePaneLayout';
import { useWindowKeys } from '@/components/panes/useWindowKeys';
import WindowHost from '@/components/framework/WindowHost.vue';
import type { WindowResult } from '@/generated/types/page-props';
import { componentNamed } from '@/framework/manifestComponents';
import type { HomeData, HomeWindowData } from '@/types/generated';
import AgentBar from './AgentBar.vue';
import InformationBar from './InformationBar.vue';

/**
 * Home: the agent bar, the information bar, then the desk, which starts with the chat alone; every other window is
 * added from the bar, floats where it opened, and is loaded by its component name and fed by its own prop. A window's
 * links change only its own window[<key>] query.
 */
const props = defineProps<{ home: HomeData }>();
const page = usePage();

/**
 * A window's result once the browser has it, read for the pane's count when its data names a total, and for its tab's
 * title when its data names what it holds.
 */
function resultOf(
    propName: string,
): WindowResult<{ pagination?: { total: number }; name?: string }> | undefined {
    // page.props is replaced on each visit, so it is read here, never kept.
    return page.props[propName] as
        | WindowResult<{ pagination?: { total: number }; name?: string }>
        | undefined;
}

const layout = providePaneLayout('home-layout', () =>
    props.home.windows.map((window): PaneWindow => {
        const result = resultOf(window.propName);

        return {
            key: window.paneKey,
            title: window.title,
            icon: window.icon,
            place: window.place,
            count:
                result?.status === 'ready'
                    ? result.data.pagination?.total
                    : undefined,
        };
    }),
    (key) => {
        const hosted = hostedWindow(key);
        const result = hosted === undefined ? undefined : resultOf(hosted.propName);

        return result?.status === 'ready' && result.data.name ? result.data.name : undefined;
    },
);

useWindowKeys(layout);

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
/**
 * Opens a project file in the editor window: the tab showing that path, else an editor tab with no file, else a new
 * copy in the largest pane without the chat or the Project tree, else a new pane at the right. The copy reads its file
 * through its own query and prop.
 */
provideFileOpener((path) => {
    const fileWindow = props.home.windows.find((window) => window.place === 'editor');

    if (fileWindow === undefined) {
        return;
    }

    const url = new URL(window.location.href);
    const grid = layout.layout.value;
    const showing = windowsIn(grid).find(
        (key) =>
            originalKeyOf(key) === fileWindow.paneKey &&
            url.searchParams.get(`window[${hostedWindow(key)?.queryKey}][path]`) === path,
    );

    if (showing !== undefined) {
        layout.apply(showWindow(layout.arrangement.value, showing));

        return;
    }

    const unused = windowsIn(grid)
        .filter((key) => originalKeyOf(key) === fileWindow.paneKey)
        .map((key) => ({ key, hosted: hostedWindow(key) }))
        .find(({ hosted }) => hosted !== undefined && !url.searchParams.get(`window[${hosted.queryKey}][path]`));

    if (unused?.hosted !== undefined) {
        layout.apply(showWindow(layout.arrangement.value, unused.key));

        showIn(url, unused.hosted, path);

        return;
    }

    const clearOf = props.home.windows
        .filter((window) => window.place === 'tree' || window.paneKey === 'chat')
        .map((window) => window.paneKey);
    const opened = openCopy(grid, fileWindow.paneKey, clearOf);
    const hosted = hostedWindow(opened.key);

    layout.change(opened.grid);

    if (hosted === undefined) {
        return;
    }

    showIn(url, hosted, path);
});

/**
 * Has a File window read the file at the path, by a visit that changes only its own part of the query and its prop.
 */
function showIn(url: URL, hosted: { propName: string; queryKey: string }, path: string): void {
    url.searchParams.set(`window[${hosted.queryKey}][path]`, path);
    router.visit(`${url.pathname}${url.search}`, {
        only: [hosted.propName],
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}

function componentOf(window: HomeWindowData): Component {
    return componentNamed(window.component);
}
</script>

<template>
    <div class="relative flex h-full min-h-0 flex-col">
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
