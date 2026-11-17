<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import Icon from '@/components/kit/Icon.vue';
import type { IconName } from '@/components/kit/Icon.vue';
import { useSidebar } from '@/composables/useSidebar';

/**
 * Version 5's sidebar (shell/SidebarPages.vue, doc 12 section 1.4): 220 px, Home pinned first, then a fold head per
 * group, rows of 6 by 8 with a 7 px radius, and the foot line; the 52 px mini form shows icons only.
 */
type SidebarRow = { label: string; icon: IconName; href: string };

const groups: { label: string; rows: SidebarRow[] }[] = [
    { label: 'Work', rows: [{ label: 'Plans', icon: 'plan', href: '/plans' }] },
    {
        label: 'Agents',
        rows: [{ label: 'Rules', icon: 'rules', href: '/rules' }],
    },
];

const home: SidebarRow = { label: 'Home', icon: 'home', href: '/' };

const page = usePage();
const appName = computed(() => page.props.name);
const { isMini } = useSidebar();

function isActive(href: string): boolean {
    if (href === '/') {
        return page.url === '/' || page.url.startsWith('/?');
    }

    return (
        page.url === href ||
        page.url.startsWith(`${href}?`) ||
        page.url.startsWith(`${href}/`)
    );
}
</script>

<template>
    <aside
        class="flex shrink-0 flex-col border-r border-border bg-side"
        :class="isMini ? 'w-[52px]' : 'w-[220px]'"
    >
        <div
            class="flex items-center gap-2.5 py-3.5"
            :class="isMini ? 'justify-center' : 'px-[18px]'"
        >
            <span
                class="grid size-5 shrink-0 place-items-center rounded-[6px] bg-brand text-meta font-semibold text-white"
                >A</span
            >
            <span v-if="!isMini" class="text-[14px] font-semibold text-text">{{
                appName
            }}</span>
        </div>
        <nav
            class="flex min-h-0 flex-1 [scrollbar-width:none] flex-col gap-0.5 overflow-y-auto px-2.5 py-1.5"
            aria-label="Pages"
        >
            <Link
                :href="home.href"
                :title="isMini ? home.label : undefined"
                class="flex shrink-0 items-center gap-2.5 rounded-button py-1.5 text-body text-text hover:bg-raised focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                :class="[
                    isMini ? 'justify-center' : 'px-2',
                    { 'bg-raised': isActive(home.href) },
                ]"
                :aria-current="isActive(home.href) ? 'page' : undefined"
            >
                <Icon :name="home.icon" :size="14" class="text-text-3" />
                <span v-if="!isMini" class="min-w-0 flex-1 truncate">{{
                    home.label
                }}</span>
            </Link>
            <template v-for="group in groups" :key="group.label">
                <div
                    v-if="!isMini"
                    class="mt-3.5 flex shrink-0 items-center px-2 py-1 text-meta font-semibold tracking-[.06em] text-text-3 uppercase"
                >
                    {{ group.label }}
                </div>
                <Link
                    v-for="row in group.rows"
                    :key="row.href"
                    :href="row.href"
                    :title="isMini ? row.label : undefined"
                    class="flex shrink-0 items-center gap-2.5 rounded-button py-1.5 text-body text-text hover:bg-raised focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                    :class="[
                        isMini ? 'justify-center' : 'px-2',
                        { 'bg-raised': isActive(row.href) },
                    ]"
                    :aria-current="isActive(row.href) ? 'page' : undefined"
                >
                    <Icon :name="row.icon" :size="13" class="text-text-3" />
                    <span v-if="!isMini" class="min-w-0 flex-1 truncate">{{
                        row.label
                    }}</span>
                </Link>
            </template>
        </nav>
        <div
            v-if="!isMini"
            class="flex justify-between border-t border-border px-[18px] py-2.5 text-small text-text-3"
        >
            <span>Agent journal</span>
        </div>
    </aside>
</template>
