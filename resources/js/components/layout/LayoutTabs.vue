<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { computed } from 'vue';
import Tabs from '@/components/kit/Tabs.vue';
import { useHostProp } from '@/framework/hostProp';
import { useWindowQueryChange } from '@/framework/useWindowQuery';
import type { LayoutPartData } from '@/generated/types/core';
import LayoutPart from './LayoutPart.vue';

// A tab set of a declared layout: the kit's tabs, whose choice changes only this window's tab key and reads only its
// prop, so Back brings the earlier tab again; the server sends the chosen tab's content alone.
const props = defineProps<{ part: LayoutPartData }>();
const windowQuery = useWindowQueryChange();
const hostProp = useHostProp();
const tabs = computed(() => props.part.tabs.map((tab) => ({ key: tab.key, label: tab.label })));
const chosen = computed(() => props.part.tabs.find((tab) => tab.isChosen)?.key ?? props.part.tabs[0]?.key ?? '');

function choose(key: string): void {
    router.visit(windowQuery({ tab: key }), {
        only: [hostProp],
        preserveState: true,
        preserveScroll: true,
    });
}
</script>

<template>
    <Tabs :model-value="chosen" :tabs="tabs" :label="part.key" @update:model-value="choose">
        <template v-for="tab in part.tabs" :key="tab.key" #[tab.key]>
            <template v-if="tab.isChosen">
                <template v-for="child in part.children" :key="child.key">
                    <LayoutPart :part="child" />
                </template>
            </template>
        </template>
    </Tabs>
</template>
