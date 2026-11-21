<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref, useId } from 'vue';
import { useHostProp } from '@/framework/hostProp';
import { useWindowQueryChange } from '@/framework/useWindowQuery';
import type { LayoutPartData } from '@/generated/types/core';
import LayoutPart from './LayoutPart.vue';

// A tab set of a declared layout: a named tablist whose one chosen tab is reachable by Tab, arrows, Home and End move
// between tabs and Enter or Space chooses one, which changes only this window's tab key and reads only its prop, so
// Back brings the earlier tab again; the server sends the chosen tab's content alone.
const props = defineProps<{ part: LayoutPartData }>();
const windowQuery = useWindowQueryChange();
const hostProp = useHostProp();
const idBase = `layout-tabs-${useId()}`;
const buttons = ref<HTMLButtonElement[]>([]);

function choose(key: string): void {
    router.visit(windowQuery({ tab: key }), {
        only: [hostProp],
        preserveState: true,
        preserveScroll: true,
    });
}

function move(event: KeyboardEvent, index: number): void {
    const last = props.part.tabs.length - 1;
    const targets: Record<string, number> = {
        ArrowRight: index === last ? 0 : index + 1,
        ArrowLeft: index === 0 ? last : index - 1,
        Home: 0,
        End: last,
    };
    const target = targets[event.key];

    if (target === undefined) {
        return;
    }

    event.preventDefault();
    buttons.value[target]?.focus();
}
</script>

<template>
    <div class="flex flex-col gap-3">
        <div
            role="tablist"
            :aria-label="part.key"
            class="flex gap-1 border-b border-border"
        >
            <template v-for="(tab, index) in part.tabs" :key="tab.key">
                <button
                    :id="`${idBase}-${tab.key}`"
                    ref="buttons"
                    type="button"
                    role="tab"
                    :aria-selected="tab.isChosen ? 'true' : 'false'"
                    :aria-controls="`${idBase}-panel`"
                    :tabindex="tab.isChosen ? 0 : -1"
                    class="-mb-px border-b-2 px-3 py-1.5 text-body focus-visible:outline-2 focus-visible:outline-brand"
                    :class="
                        tab.isChosen
                            ? 'border-brand text-text'
                            : 'border-transparent text-text-3 hover:text-text'
                    "
                    @click="choose(tab.key)"
                    @keydown="move($event, index)"
                >
                    {{ tab.label }}
                </button>
            </template>
        </div>
        <div
            :id="`${idBase}-panel`"
            role="tabpanel"
            :aria-labelledby="`${idBase}-${part.tabs.find((tab) => tab.isChosen)?.key}`"
            tabindex="0"
        >
            <template v-for="child in part.children" :key="child.key">
                <LayoutPart :part="child" />
            </template>
        </div>
    </div>
</template>
