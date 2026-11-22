<script setup lang="ts">
import { computed } from 'vue';
import LayoutPart from '@/components/layout/LayoutPart.vue';
import ListReaderLayout from '@/components/kit/ListReaderLayout.vue';
import Card from '@/components/kit/Card.vue';
import Reader from '@/components/kit/Reader.vue';
import SettingGroup from '@/components/kit/SettingGroup.vue';
import SettingRow from '@/components/kit/SettingRow.vue';
import SettingsSection from '@/components/kit/SettingsSection.vue';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import type { LayoutPartData } from '@/generated/types/core';

// A box of a declared layout: a divider, a row, a stack of its children, a page header bar, or a split of its first
// child as a list beside the rest as its reader. The bar keeps the title, count and views together on the left, the
// search and creation at the other edge; on a phone the title and creation share the first line, and the views and
// search wrap below. A reader box draws its title, metadata line, abstract and actions in the kit Reader and the rest
// of its parts as the body. A card box draws its head, time and actions in the kit Card. The settings styles draw a
// group in the kit's SettingsSection, SettingGroup and SettingRow: a row's title and hint are its first parts, its
// control the rest, below the title in a block row and stacked below it on a phone, with long values breaking within
// their block.
const props = defineProps<{ part: LayoutPartData }>();
const slotClasses: Record<string, string> = {
    creation: 'order-3 ml-auto @2xl:order-none @2xl:ml-0',
    views: 'order-4 w-full @2xl:order-none @2xl:w-auto',
    search: 'order-5 w-full @2xl:order-none @2xl:w-auto',
};
const cardTitle = computed(() => {
    const head = props.part.children.find((child) => child.key === 'head');

    return head?.children.find((child) => child.key === 'title')?.text ?? undefined;
});
const readerSlots = new Set(['title', 'metadata', 'abstract', 'actions']);
const sectionSlots = new Set(['title', 'help']);
const rowSlots = new Set(['title', 'hint']);
const sectionBody = computed(() => props.part.children.filter((child) => !sectionSlots.has(child.key)));
const rowControl = computed(() => props.part.children.filter((child) => !rowSlots.has(child.key)));
const readerBody = computed(() => props.part.children.filter((child) => !readerSlots.has(child.key)));

function readerPart(key: string): LayoutPartData | undefined {
    return props.part.children.find((child) => child.key === key);
}

const firstTool = computed(
    () => props.part.children.find((child) => child.key === 'search' || child.key === 'creation')?.key,
);

// A page head as the design draws it: the title, its count and its views at the left, the search and the creation at
// the right edge.
const HEAD_LEAD_KEYS = ['title', 'count', 'views'];
const headLead = computed(() => props.part.children.filter((child) => HEAD_LEAD_KEYS.includes(child.key)));
const headTools = computed(() => props.part.children.filter((child) => !HEAD_LEAD_KEYS.includes(child.key)));
</script>

<template>
    <SwitchCase :value="part.style">
        <template #divider>
            <hr class="border-line" />
        </template>
        <template #row>
            <div
                data-layout-box="row"
                class="flex flex-row flex-wrap items-center gap-3"
            >
                <template v-for="child in part.children" :key="child.key">
                    <LayoutPart :part="child" />
                </template>
            </div>
        </template>
        <template #reader>
            <Reader
                :title="readerPart('title')?.text ?? ''"
                :abstract="readerPart('abstract')?.text ?? undefined"
            >
                <template #meta>
                    <template
                        v-for="child in readerPart('metadata')?.children ?? []"
                        :key="child.key"
                    >
                        <LayoutPart :part="child" />
                    </template>
                </template>
                <template #actions>
                    <template
                        v-for="child in readerPart('actions')?.children ?? []"
                        :key="child.key"
                    >
                        <LayoutPart :part="child" />
                    </template>
                </template>
                <div class="flex flex-col gap-3 pt-3">
                    <template v-for="child in readerBody" :key="child.key">
                        <LayoutPart :part="child" />
                    </template>
                </div>
            </Reader>
        </template>
        <template #card>
            <Card
                tone="plain"
                role="group"
                :aria-label="cardTitle"
                class="flex flex-col gap-2"
            >
                <template v-for="child in part.children" :key="child.key">
                    <LayoutPart :part="child" />
                </template>
            </Card>
        </template>
        <template #settings-page>
            <div data-layout-box="settings-page" class="flex w-full max-w-180 flex-col">
                <template v-for="child in part.children" :key="child.key">
                    <LayoutPart :part="child" />
                </template>
            </div>
        </template>
        <template #settings>
            <SettingsSection
                :title="readerPart('title')?.text ?? ''"
                :help="readerPart('help')?.text ?? undefined"
            >
                <template v-for="child in sectionBody" :key="child.key">
                    <LayoutPart :part="child" />
                </template>
            </SettingsSection>
        </template>
        <template #settings-group>
            <SettingGroup :label="readerPart('title')?.text ?? undefined">
                <template v-for="child in part.children" :key="child.key">
                    <LayoutPart :part="child" />
                </template>
            </SettingGroup>
        </template>
        <template #setting>
            <SettingRow
                :title="readerPart('title')?.text ?? ''"
                :hint="readerPart('hint')?.text ?? undefined"
                class="max-[760px]:flex-col max-[760px]:items-stretch"
            >
                <span
                    class="flex flex-wrap items-center justify-end gap-2 [overflow-wrap:anywhere] max-[760px]:justify-start"
                >
                    <template v-for="child in rowControl" :key="child.key">
                        <LayoutPart :part="child" />
                    </template>
                </span>
            </SettingRow>
        </template>
        <template #setting-block>
            <SettingRow
                block
                :title="readerPart('title')?.text ?? ''"
                :hint="readerPart('hint')?.text ?? undefined"
            >
                <span class="flex flex-wrap items-center gap-2 [overflow-wrap:anywhere]">
                    <template v-for="child in rowControl" :key="child.key">
                        <LayoutPart :part="child" />
                    </template>
                </span>
            </SettingRow>
        </template>
        <template #page-head>
            <header
                data-layout-box="page-head"
                class="flex min-h-13 flex-none flex-wrap items-center gap-2.5 border-b border-line px-4 py-2"
            >
                <template v-for="child in headLead" :key="child.key">
                    <LayoutPart :part="child" />
                </template>
                <div class="ml-auto flex flex-wrap items-center gap-1.5">
                    <template v-for="child in headTools" :key="child.key">
                        <LayoutPart :part="child" />
                    </template>
                </div>
            </header>
        </template>
        <template #bar>
            <div
                data-layout-box="bar"
                class="@container flex flex-wrap items-center gap-x-3 gap-y-2"
            >
                <template v-for="child in part.children" :key="child.key">
                    <template v-if="child.key === firstTool">
                        <span class="hidden flex-1 @2xl:block"></span>
                    </template>
                    <div :class="slotClasses[child.key]">
                        <LayoutPart :part="child" />
                    </div>
                </template>
            </div>
        </template>
        <template #split>
            <ListReaderLayout
                :list-width="part.split?.listWidth"
                :narrow-shows="part.split?.narrowShows"
                :back="part.split?.back"
                :reader-width="part.split?.readerWidth"
            >
                <template #list>
                    <template
                        v-for="child in part.children.slice(0, 1)"
                        :key="child.key"
                    >
                        <LayoutPart :part="child" />
                    </template>
                </template>
                <template #reader>
                    <template
                        v-for="child in part.children.slice(1)"
                        :key="child.key"
                    >
                        <LayoutPart :part="child" />
                    </template>
                </template>
            </ListReaderLayout>
        </template>
        <template #default>
            <div :data-layout-box="part.style" class="flex flex-col gap-3">
                <template v-for="child in part.children" :key="child.key">
                    <LayoutPart :part="child" />
                </template>
            </div>
        </template>
    </SwitchCase>
</template>
