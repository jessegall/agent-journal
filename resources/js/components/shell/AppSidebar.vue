<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed, watch } from 'vue';
import { useSidebar } from '@/composables/useSidebar';
import type {
    NavigationCountsData,
    NavigationData,
    NavigationItemData,
} from '@/types/generated';
import SidebarRow from './SidebarRow.vue';

/**
 * Version 5's sidebar (shell/SidebarPages.vue, doc 12 section 1.4): 220 px, the navigation the server merged for this
 * user in its order, a head per sidebar group by the group's own key and label, items without a group in their place,
 * the foot items in their own region, rows of 6 by 8 with a 7 px radius, and the foot line; the 52 px mini form shows
 * icons only. On a phone it is hidden until the menu button opens it over the page. The current item and the counts
 * come from the same server index.
 */
type SidebarSection = {
    key: string;
    label: string | null;
    items: NavigationItemData[];
};

// The navigation comes with every signed-in page, the only pages with a sidebar; its counts follow after the page.
const page = usePage<{
    navigation: NavigationData;
    navigationCounts?: NavigationCountsData;
}>();
const appName = computed(() => page.props.name);
const { isMini, isOpenOnPhone, closeOnPhone } = useSidebar();

watch(() => page.url, closeOnPhone);

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
    <aside
        class="flex shrink-0 flex-col border-r border-border bg-side max-[760px]:fixed max-[760px]:inset-y-0 max-[760px]:left-0 max-[760px]:z-90 max-[760px]:w-[220px]"
        :class="[
            isMini ? 'w-[52px]' : 'w-[220px]',
            isOpenOnPhone ? '' : 'max-[760px]:hidden',
        ]"
    >
        <div
            class="flex items-center gap-2.5 py-3.5"
            :class="isMini ? 'justify-center' : 'px-[18px]'"
        >
            <span
                class="grid size-5 shrink-0 place-items-center rounded-[6px] bg-brand text-meta font-semibold text-on-brand"
                >A</span
            >
            <template v-if="!isMini">
                <span class="text-[14px] font-semibold text-text">{{
                    appName
                }}</span>
            </template>
        </div>
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
                        section.label !== null && isMini
                            ? section.label
                            : undefined
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
        <template v-if="!isMini">
            <div
                class="flex justify-between border-t border-border px-[18px] py-2.5 text-small text-text-3"
            >
                <span>Agent journal</span>
                <span class="font-mono" title="The version that runs here">{{
                    page.props.version
                }}</span>
            </div>
        </template>
    </aside>
</template>
