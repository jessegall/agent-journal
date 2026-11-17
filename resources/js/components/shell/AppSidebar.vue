<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import Icon from '@/components/kit/Icon.vue';
import type { IconName } from '@/components/kit/Icon.vue';

/**
 * The sidebar (doc 4, 4.1): 232 wide, rows 28 high, and only the pages that exist are listed.
 */
const page = usePage();

const rows: { label: string; icon: IconName; href: string }[] = [
    { label: 'Home', icon: 'home', href: '/' },
    { label: 'Plans', icon: 'plan', href: '/plans' },
];

const appName = computed(() => page.props.name);

function isActive(href: string): boolean {
    return (
        page.url === href ||
        page.url.startsWith(`${href}?`) ||
        page.url.startsWith(`${href}/`)
    );
}
</script>

<template>
    <aside
        class="flex w-[232px] shrink-0 flex-col border-r border-border bg-side"
    >
        <div class="flex h-12 items-center gap-2.5 px-3">
            <span
                class="grid size-[26px] place-items-center rounded-button bg-brand font-semibold text-white"
                >A</span
            >
            <span class="text-field font-semibold text-text">{{
                appName
            }}</span>
        </div>
        <nav
            class="flex flex-1 flex-col gap-px overflow-y-auto px-2 pt-0.5 pb-2"
        >
            <template v-for="row in rows" :key="row.href">
                <Link
                    :href="row.href"
                    class="flex h-7 items-center gap-2.5 rounded-control px-2 text-field text-text-2 transition-colors duration-(--duration-hover) hover:bg-hover hover:text-text focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                    :class="{ 'bg-sel text-text': isActive(row.href) }"
                    :aria-current="isActive(row.href) ? 'page' : undefined"
                >
                    <Icon
                        :name="row.icon"
                        :size="14"
                        :class="
                            isActive(row.href)
                                ? 'text-brand-text'
                                : 'text-text-3'
                        "
                    />
                    {{ row.label }}
                </Link>
            </template>
        </nav>
        <div class="border-t border-border px-2 py-1.5">
            <slot name="foot" />
        </div>
    </aside>
</template>
