<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import Icon from '@/components/kit/Icon.vue';
import type { NavigationItemData } from '@/types/generated';

/**
 * One navigation item of the sidebar: its icon and label, its count once the counts arrive (0 is shown, an unavailable
 * count shows nothing), marked as the current page when it is, and its visible children indented below it in the full
 * form. The current page has the selection colour, weight 500 and the brand's marker bar at the sidebar's edge. An item without a link of its own is shown but cannot be followed.
 */
const props = defineProps<{
    item: NavigationItemData;
    currentKey: string | null;
    counts: Record<string, number>;
    isMini: boolean;
    depth: number;
}>();

const isCurrent = computed(() => props.item.key === props.currentKey);
const count = computed(() => props.counts[props.item.key]);
const hasCount = computed(() => props.item.isCounted && count.value !== undefined);
const rowClass = computed(() => [
    props.isMini ? 'justify-center py-[7px]' : 'px-2 py-1.5',
    props.depth > 0 && !props.isMini ? 'pl-7' : '',
    isCurrent.value ? 'bg-sel font-medium text-text' : 'text-text-3',
]);
</script>

<template>
    <template v-if="item.url !== undefined">
        <Link
            :href="item.url"
            :title="isMini ? item.label : undefined"
            class="relative flex shrink-0 items-center gap-[9px] rounded-button text-body whitespace-nowrap hover:bg-hover hover:text-text-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
            :class="rowClass"
            :aria-current="isCurrent ? 'page' : undefined"
        >
            <template v-if="isCurrent">
                <span
                    aria-hidden="true"
                    data-current-marker
                    class="absolute inset-y-2 -left-2 w-0.5 rounded-full bg-brand"
                ></span>
            </template>
            <template v-if="item.icon !== undefined">
                <Icon :name="item.icon" :size="16" />
            </template>
            <template v-if="!isMini">
                <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
                <template v-if="hasCount">
                    <span class="font-mono text-small text-text-3 tabular-nums">{{
                        count
                    }}</span>
                </template>
            </template>
        </Link>
    </template>
    <template v-else>
        <span
            class="flex shrink-0 items-center gap-[9px] rounded-button text-body whitespace-nowrap"
            :class="rowClass"
            aria-disabled="true"
        >
            <template v-if="item.icon !== undefined">
                <Icon :name="item.icon" :size="16" />
            </template>
            <template v-if="!isMini">
                <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
            </template>
        </span>
    </template>
    <template v-if="!isMini">
        <template v-for="child in item.children" :key="child.key">
            <SidebarRow
                :item="child"
                :current-key="currentKey"
                :counts="counts"
                :is-mini="isMini"
                :depth="depth + 1"
            />
        </template>
    </template>
</template>
