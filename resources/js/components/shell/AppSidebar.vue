<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed, watch } from 'vue';
import Icon from '@/components/kit/Icon.vue';
import type { IconName } from '@/components/kit/Icon.vue';
import { useSidebar } from '@/composables/useSidebar';

/**
 * Version 5's sidebar (shell/SidebarPages.vue, doc 12 section 1.4): 220 px, Home pinned first, then a fold head per
 * group, rows of 6 by 8 with a 7 px radius, and the foot line; the 52 px mini form shows icons only. On a phone it
 * is hidden until the menu button opens it over the page.
 */
type SidebarRow = { label: string; icon: IconName; href: string };

const groups: { label: string; rows: SidebarRow[] }[] = [
    { label: 'Work', rows: [{ label: 'Plans', icon: 'plan', href: '/plans' }] },
    {
        label: 'Agents',
        rows: [
            { label: 'Rules', icon: 'rules', href: '/rules' },
            { label: 'Accounts', icon: 'accounts', href: '/accounts' },
        ],
    },
];

const home: SidebarRow = { label: 'Home', icon: 'home', href: '/' };

const page = usePage();
const appName = computed(() => page.props.name);
const { isMini, isOpenOnPhone, closeOnPhone } = useSidebar();

watch(() => page.url, closeOnPhone);

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
                <template v-if="!isMini">
                    <span class="min-w-0 flex-1 truncate">{{
                        home.label
                    }}</span>
                </template>
            </Link>
            <template v-for="group in groups" :key="group.label">
                <template v-if="!isMini">
                    <div
                        class="mt-3.5 flex shrink-0 items-center px-2 py-1 text-meta font-semibold tracking-[.06em] text-text-3 uppercase"
                    >
                        {{ group.label }}
                    </div>
                </template>
                <template v-for="row in group.rows" :key="row.href">
                    <Link
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
                        <template v-if="!isMini">
                            <span class="min-w-0 flex-1 truncate">{{
                                row.label
                            }}</span>
                        </template>
                    </Link>
                </template>
            </template>
        </nav>
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
