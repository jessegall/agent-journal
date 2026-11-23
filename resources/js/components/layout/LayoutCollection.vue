<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import ListRow from '@/components/kit/ListRow.vue';
import RecordMenu from '@/components/kit/RecordMenu.vue';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import TextLink from '@/components/kit/TextLink.vue';
import { useWindowQueryChange } from '@/framework/useWindowQuery';
import type { LayoutPartData, LayoutRowData } from '@/generated/types/core';
import LayoutPart from './LayoutPart.vue';
import { useLayoutAppend } from './layoutAppend';
import { rememberRow, restoreRow } from './listReturn';

// The keyed rows of a declared layout: facts as term and value pairs, choices that each set the window's query or open
// their own page, the chosen one marked current, or a list whose rows open their own page or their own window query. A row with an actions
// menu shows its actions button beside it, and a right click on the row, or the Menu key or Shift+F10 on it when it is
// focused, opens the same menu, bound to that row's record. A list keeps the rows it shows when a Show more is waiting
// for its answer, and adds the rows that answer brings; any other read replaces them. Every list row is drawn in a
// ListRow as the design draws its rows, its declared leading and trailing parts in its slots and only its title
// linking, so its own parts and its menu stay controls of their own; a fact's value draws each piece as its own link
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
            <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                <template v-for="row in shown" :key="row.key">
                    <dt class="text-text-3">{{ row.label }}</dt>
                    <dd class="text-text">
                        <template v-if="row.fact !== undefined">
                            <template
                                v-for="(piece, index) in row.fact.pieces"
                                :key="index"
                            >
                                <template v-if="index > 0">, </template>
                                <TextLink
                                    v-if="piece.href !== undefined"
                                    :href="piece.href"
                                    >{{ piece.label }}</TextLink
                                >
                                <template v-else>{{ piece.label }}</template>
                            </template>
                        </template>
                        <template v-else>{{ row.value }}</template>
                    </dd>
                </template>
            </dl>
        </template>
        <template #choices>
            <ul
                class="flex flex-wrap gap-4 border-b border-line px-3 in-data-[layout-box=page-head]:border-0 in-data-[layout-box=page-head]:px-0"
            >
                <template v-for="row in shown" :key="row.key">
                    <li class="flex">
                        <Link
                            :href="row.href ?? windowQuery(row.query)"
                            preserve-scroll
                            :aria-current="row.isCurrent ? 'true' : undefined"
                            class="block py-[7px] text-badge tracking-[.03em] focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-focus"
                            :class="{
                                'text-text shadow-[inset_0_-1px_0_var(--color-brand)]': row.isCurrent,
                                'text-text-3 hover:text-text-2': !row.isCurrent,
                            }"
                            >{{ row.label }}</Link
                        >
                    </li>
                </template>
            </ul>
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
                            :variant="row.detail !== undefined ? 'two' : 'single'"
                            :selected="row.isCurrent"
                            class="flex-1"
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
                                <Link
                                    v-if="destinationOf(row) !== null"
                                    :href="destinationOf(row) ?? ''"
                                    :data-row-key="row.key"
                                    preserve-scroll
                                    :aria-current="row.isCurrent ? 'true' : undefined"
                                    class="focus-visible:outline-2 focus-visible:outline-focus"
                                    @click="rememberRow(page.url, row.key)"
                                    >{{ row.label }}</Link
                                >
                                <template v-else>{{ row.label }}</template>
                            </template>
                            <template v-if="row.detail !== undefined" #subline>
                                {{ row.detail }}
                            </template>
                            <template #trail>
                                <template
                                    v-for="trail in row.trailing ?? []"
                                    :key="trail.key"
                                >
                                    <LayoutPart :part="trail" />
                                </template>
                                <span v-if="row.value !== ''" class="shrink-0 text-text-2">{{
                                    row.value
                                }}</span>
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
