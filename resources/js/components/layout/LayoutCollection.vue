<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import ListRow from '@/components/kit/ListRow.vue';
import RecordMenu from '@/components/kit/RecordMenu.vue';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import { useWindowQueryChange } from '@/framework/useWindowQuery';
import type { LayoutPartData, LayoutRowData } from '@/generated/types/core';
import LayoutChoices from './LayoutChoices.vue';
import LayoutFacts from './LayoutFacts.vue';
import LayoutPart from './LayoutPart.vue';
import { useLayoutAppend } from './layoutAppend';
import { rememberRow, restoreRow } from './listReturn';

// The keyed rows of a declared layout: facts as term and value pairs, choices that each set the window's query or open
// their own page, the chosen one marked current, or a list whose rows open their own page or their own window query. A row with an actions
// menu shows its actions button beside it, and a right click on the row, or the Menu key or Shift+F10 on it when it is
// focused, opens the same menu, bound to that row's record. A list keeps the rows it shows when a Show more is waiting
// for its answer, and adds the rows that answer brings; any other read replaces them. Every list row is drawn in a
// ListRow as the design draws its rows, its declared leading and trailing parts in its slots and its title linking;
// a click anywhere else on the row follows that link, while its own parts and its menu stay controls of their own; a fact's value draws each piece as its own link
// when it has an address.
const props = defineProps<{ part: LayoutPartData }>();
const windowQuery = useWindowQueryChange();
const isAppending = useLayoutAppend();
const page = usePage();
const list = useTemplateRef<HTMLElement>('list');
const shown = ref<LayoutRowData[]>(props.part.rows);

watch(
    () => props.part.rows,
    (rows) => {
        if (props.part.style !== 'list' || !isAppending.value) {
            shown.value = rows;

            return;
        }

        const keys = new Set(shown.value.map((row) => row.key));

        shown.value = [...shown.value, ...rows.filter((row) => !keys.has(row.key))];
    },
    { flush: 'sync' },
);
const rowMenus = new Map<string, InstanceType<typeof RecordMenu>>();

onMounted(() => {
    if (list.value !== null && props.part.style === 'list') {
        restoreRow(list.value, page.url);
    }
});

function keepRowMenu(key: string, menu: unknown): void {
    if (menu === null) {
        rowMenus.delete(key);

        return;
    }

    rowMenus.set(key, menu as InstanceType<typeof RecordMenu>);
}

function openRowMenu(event: MouseEvent, row: LayoutRowData): void {
    const menu = rowMenus.get(row.key);

    if (row.menu === undefined || row.menu.groups.length === 0 || menu === undefined) {
        return;
    }

    event.preventDefault();
    menu.openFromContext();
}

function openRowMenuFromKey(event: KeyboardEvent, row: LayoutRowData): void {
    const isMenuKey = event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey);
    const menu = rowMenus.get(row.key);

    if (!isMenuKey || row.menu === undefined || row.menu.groups.length === 0 || menu === undefined) {
        return;
    }

    event.preventDefault();
    menu.openFromContext();
}

// A click anywhere on a row that opens follows the row's own link, with the same keys held, unless it lands on a
// control of the row's own or ends a text selection.
function openRow(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (target.closest('a, button, input, select, textarea, [role="button"], [role="menuitem"]') !== null) {
        return;
    }

    if ((window.getSelection()?.toString() ?? '') !== '') {
        return;
    }

    (event.currentTarget as HTMLElement).querySelector('a[data-row-key]')?.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            button: event.button,
            ctrlKey: event.ctrlKey,
            metaKey: event.metaKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
        }),
    );
}

// A row in columns is the kit's grid row, whose trail holds two cells; a row with fewer parts leaves the first empty,
// so a state stands in the same column whether or not a meter stands before it.
const TRAILING_COLUMNS = 2;

function rowLayoutOf(row: LayoutRowData): 'single' | 'two' | 'grid' {
    if (row.hasColumns) {
        return 'grid';
    }

    return row.detail !== undefined ? 'two' : 'single';
}

function emptyColumnsOf(row: LayoutRowData): number {
    return Math.max(0, TRAILING_COLUMNS - (row.trailing ?? []).length);
}

function destinationOf(row: LayoutRowData): string | null {
    if (row.href !== undefined) {
        return row.href;
    }

    return Object.keys(row.query).length > 0 ? windowQuery(row.query) : null;
}
</script>

<template>
    <SwitchCase :value="part.style">
        <template #facts>
            <LayoutFacts :rows="shown" />
        </template>
        <template #choices>
            <LayoutChoices :rows="shown" />
        </template>
        <template #default>
            <ul ref="list" class="flex flex-col divide-y divide-line">
                <template v-for="row in shown" :key="row.key">
                    <li
                        class="flex items-center gap-1"
                        @contextmenu="openRowMenu($event, row)"
                        @keydown="openRowMenuFromKey($event, row)"
                    >
                        <ListRow
                            static
                            :opens="destinationOf(row) !== null"
                            :variant="rowLayoutOf(row)"
                            :selected="row.isCurrent"
                            class="flex-1"
                            @click="openRow"
                        >
                            <template #lead>
                                <template
                                    v-for="lead in row.leading ?? []"
                                    :key="lead.key"
                                >
                                    <LayoutPart :part="lead" />
                                </template>
                            </template>
                            <template #title>
                                <template v-if="destinationOf(row) !== null">
                                    <Link
                                        :href="destinationOf(row) ?? ''"
                                        :data-row-key="row.key"
                                        preserve-scroll
                                        :aria-current="row.isCurrent ? 'true' : undefined"
                                        class="focus-visible:outline-2 focus-visible:outline-focus"
                                        @click="rememberRow(page.url, row.key)"
                                        >{{ row.label }}</Link
                                    >
                                </template>
                                <template v-else>{{ row.label }}</template>
                            </template>
                            <template v-if="row.detail !== undefined" #subline>
                                {{ row.detail }}
                            </template>
                            <template #trail>
                                <template v-if="row.hasColumns">
                                    <template
                                        v-for="empty in emptyColumnsOf(row)"
                                        :key="empty"
                                    >
                                        <span />
                                    </template>
                                    <template
                                        v-for="trail in row.trailing ?? []"
                                        :key="trail.key"
                                    >
                                        <span class="flex min-w-0 items-center">
                                            <LayoutPart :part="trail" />
                                        </span>
                                    </template>
                                </template>
                                <template v-else>
                                    <template
                                        v-for="trail in row.trailing ?? []"
                                        :key="trail.key"
                                    >
                                        <LayoutPart :part="trail" />
                                    </template>
                                </template>
                                <template v-if="row.value !== ''">
                                    <span class="shrink-0 text-text-2">{{
                                        row.value
                                    }}</span>
                                </template>
                            </template>
                        </ListRow>
                        <template v-if="row.menu !== undefined">
                            <RecordMenu
                                :ref="(menu) => keepRowMenu(row.key, menu)"
                                :menu="row.menu"
                            />
                        </template>
                    </li>
                </template>
            </ul>
        </template>
    </SwitchCase>
</template>
