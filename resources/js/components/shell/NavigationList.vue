<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import type {
    NavigationCountsData,
    NavigationData,
    NavigationItemData,
} from '@/types/generated';
import SidebarRow from './SidebarRow.vue';

/**
 * The navigation the server merged for this user in its order: a head per sidebar group by the group's own key and
 * label, items without a group in their place, the foot items in their own region, and the current page marked. The
 * sidebar draws it, and the phone's sheet draws it again.
 */
type SidebarSection = {
    key: string;
    label: string | null;
    items: NavigationItemData[];
};

defineProps<{ isMini: boolean }>();

// The navigation comes with every signed-in page, the only pages with a sidebar; its counts follow after the page.
const page = usePage<{
    navigation: NavigationData;
    navigationCounts?: NavigationCountsData;
}>();

const navigation = computed(() => page.props.navigation);
const counts = computed(() => page.props.navigationCounts?.counts ?? {});
const currentKey = computed(() => navigation.value.current.at(-1) ?? null);
const groupLabels = computed(
    () =>
        new Map(navigation.value.groups.map((group) => [group.key, group.label])),
);

/**
 * The items above the foot in the server's order, cut into one section per run of items of the same group; a run
 * without a group has no head.
 */
const sections = computed<SidebarSection[]>(() => {
    const found: SidebarSection[] = [];

    for (const item of navigation.value.items.filter((root) => !root.atFoot)) {
        const key = item.group ?? '';
        const last = found.at(-1);

        if (last !== undefined && last.key === key) {
            last.items.push(item);

            continue;
        }

        found.push({ key, label: groupLabels.value.get(key) ?? null, items: [item] });
    }

    return found;
});

const footItems = computed(() =>
    navigation.value.items.filter((root) => root.atFoot),
);
</script>

<template>
    <nav
        class="flex min-h-0 flex-1 [scrollbar-width:none] flex-col gap-0.5 overflow-y-auto px-2.5 py-1.5"
        aria-label="Pages"
    >
        <template v-for="section in sections" :key="section.key">
            <template v-if="section.label !== null && !isMini">
                <h2
                    :id="`sidebar-group-${section.key}`"
                    class="mt-3.5 flex shrink-0 items-center px-2 py-1 text-meta font-semibold tracking-[.06em] text-text-3 uppercase"
                >
                    {{ section.label }}
                </h2>
            </template>
            <div
                class="flex flex-col gap-0.5"
                :role="section.label !== null ? 'group' : undefined"
                :aria-labelledby="
                    section.label !== null && !isMini
                        ? `sidebar-group-${section.key}`
                        : undefined
                "
                :aria-label="
                    section.label !== null && isMini ? section.label : undefined
                "
            >
                <template v-for="item in section.items" :key="item.key">
                    <SidebarRow
                        :item="item"
                        :current-key="currentKey"
                        :counts="counts"
                        :is-mini="isMini"
                        :depth="0"
                    />
                </template>
            </div>
        </template>
    </nav>
    <template v-if="footItems.length > 0">
        <nav
            class="flex shrink-0 flex-col gap-0.5 border-t border-border px-2.5 py-1.5"
            aria-label="More pages"
        >
            <template v-for="item in footItems" :key="item.key">
                <SidebarRow
                    :item="item"
                    :current-key="currentKey"
                    :counts="counts"
                    :is-mini="isMini"
                    :depth="0"
                />
            </template>
        </nav>
    </template>
</template>
