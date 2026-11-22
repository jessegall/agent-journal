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

// The keyed rows of a declared layout: facts as term and value pairs, choices that each set the window's query, the
// chosen one marked current, or a list whose rows open their own page or their own window query. A row with an actions
// menu shows its actions button beside it, and a right click on the row opens the same menu, bound to that row's
// record. A list keeps the rows it shows when a Show more is waiting for its answer, and adds the rows that answer
// brings; any other read replaces them. A row that declares leading or trailing parts is drawn in a ListRow with them
// in its slots, only its title linking, so its own parts and its menu stay controls of their own; a fact's value draws
// each piece as its own link when it has an address.
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

function hasParts(row: LayoutRowData): boolean {
    return row.leading !== undefined || row.trailing !== undefined;
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
            <ul class="flex flex-wrap gap-1">
                <template v-for="row in shown" :key="row.key">
                    <li>
                        <Link
                            :href="windowQuery(row.query)"
                            preserve-scroll
                            :aria-current="row.isCurrent ? 'true' : undefined"
                            class="block rounded-sm border border-line px-2 py-1 text-small hover:bg-hover focus-visible:outline-2 focus-visible:outline-brand"
                            :class="{
                                'bg-sel text-text': row.isCurrent,
                                'text-text-2': !row.isCurrent,
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
                    >
                        <template v-if="hasParts(row)">
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
                        </template>
                        <template v-else-if="destinationOf(row) !== null">
                            <Link
                                :href="destinationOf(row) ?? ''"
                                :data-row-key="row.key"
                                preserve-scroll
                                :aria-current="
                                    row.isCurrent ? 'true' : undefined
                                "
                                class="flex min-w-0 flex-1 justify-between gap-3 px-3 py-2 hover:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                                :class="{ 'bg-sel': row.isCurrent }"
                                @click="rememberRow(page.url, row.key)"
                            >
                                <span class="flex min-w-0 flex-col">
                                    <span class="line-clamp-2 text-text">{{
                                        row.label
                                    }}</span>
                                    <template v-if="row.detail !== undefined">
                                        <span
                                            class="line-clamp-2 text-small text-text-3"
                                            >{{ row.detail }}</span
                                        >
                                    </template>
                                </span>
                                <span class="shrink-0 text-text-2">{{
                                    row.value
                                }}</span>
                            </Link>
                        </template>
                        <template v-else>
                            <span class="flex flex-1 justify-between gap-3 py-2">
                                <span class="text-text">{{ row.label }}</span>
                                <span class="text-text-2">{{ row.value }}</span>
                            </span>
                        </template>
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
