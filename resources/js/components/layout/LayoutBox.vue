<script setup lang="ts">
import { computed } from 'vue';
import LayoutBar from '@/components/layout/LayoutBar.vue';
import LayoutEmptyPage from '@/components/layout/LayoutEmptyPage.vue';
import LayoutPageHead from '@/components/layout/LayoutPageHead.vue';
import LayoutPart from '@/components/layout/LayoutPart.vue';
import LayoutReaderBox from '@/components/layout/LayoutReaderBox.vue';
import LayoutSettingBox from '@/components/layout/LayoutSettingBox.vue';
import LayoutSettingsBox from '@/components/layout/LayoutSettingsBox.vue';
import ListReaderLayout from '@/components/kit/ListReaderLayout.vue';
import Card from '@/components/kit/Card.vue';
import SettingGroup from '@/components/kit/SettingGroup.vue';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import type { LayoutPartData } from '@/generated/types/core';

// A box of a declared layout, by its style: a divider, a row, a card, a reader, the settings parts, a page with its
// head, list, empty state and footer, a bar, or a split of its first child as a list beside the rest as its reader.
// Each larger style is drawn by a component of its own; a card box draws its head, time and actions in the kit Card.
const props = defineProps<{ part: LayoutPartData }>();
const cardTitle = computed(() => {
    const head = props.part.children.find((child) => child.key === 'head');

    return head?.children.find((child) => child.key === 'title')?.text ?? undefined;
});

function readerPart(key: string): LayoutPartData | undefined {
    return props.part.children.find((child) => child.key === key);
}
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
            <LayoutReaderBox :part="part" />
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
            <div data-layout-box="settings-page" class="w-full max-w-180 px-6 py-5">
                <template v-for="child in part.children" :key="child.key">
                    <LayoutPart :part="child" />
                </template>
            </div>
        </template>
        <template #settings>
            <LayoutSettingsBox :part="part" />
        </template>
        <template #settings-group>
            <SettingGroup :label="readerPart('title')?.text ?? undefined" class="[&>form]:gap-0">
                <template v-for="child in part.children" :key="child.key">
                    <LayoutPart :part="child" />
                </template>
            </SettingGroup>
        </template>
        <template #setting>
            <LayoutSettingBox :part="part" />
        </template>
        <template #setting-block>
            <LayoutSettingBox :part="part" />
        </template>
        <template #page>
            <div data-layout-box="page" class="flex h-full min-h-0 flex-col">
                <template v-for="child in part.children.slice(0, 1)" :key="child.key">
                    <LayoutPart :part="child" />
                </template>
                <div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
                    <template v-for="child in part.children.slice(1)" :key="child.key">
                        <LayoutPart :part="child" />
                    </template>
                </div>
            </div>
        </template>
        <template #page-list>
            <div data-layout-box="page-list" class="flex flex-col">
                <template v-for="child in part.children" :key="child.key">
                    <LayoutPart :part="child" />
                </template>
            </div>
        </template>
        <template #page-empty>
            <LayoutEmptyPage :part="part" />
        </template>
        <template #page-head>
            <LayoutPageHead :part="part" />
        </template>
        <template #settings-footer>
            <div data-layout-box="settings-footer" class="flex items-center justify-end gap-2 px-4 py-2.5">
                <template v-for="child in part.children" :key="child.key">
                    <LayoutPart :part="child" />
                </template>
            </div>
        </template>
        <template #bar>
            <LayoutBar :part="part" />
        </template>
        <template #split>
            <ListReaderLayout v-bind="part.split">
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
