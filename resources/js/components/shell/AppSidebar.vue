<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { watch } from 'vue';
import Logo from '@/components/kit/Logo.vue';
import Sheet from '@/components/kit/Sheet.vue';
import { useSidebar } from '@/composables/useSidebar';
import NavigationList from './NavigationList.vue';

/**
 * The navigation sidebar: 216 px wide with the brand row (its title names the version that runs here), the pages and
 * the current page marked, collapsing to a 56 px rail of icons. On a phone it is not drawn; the topbar button opens the same navigation in a Sheet, which
 * closes when a page is chosen.
 */
const page = usePage();
const { isMini, isOpenOnPhone, closeOnPhone } = useSidebar();

watch(() => page.url, closeOnPhone);
</script>

<template>
    <aside
        class="relative z-100 flex shrink-0 flex-col border-r border-border bg-side pt-3 pb-3 max-[760px]:hidden"
        :class="isMini ? 'w-14' : 'w-54'"
    >
        <div
            class="flex items-center gap-2 overflow-hidden px-4 pt-0.5 pb-3.5 font-semibold whitespace-nowrap text-text"
            :class="{ 'justify-center px-0': isMini }"
            :title="`Agent journal ${page.props.version}`"
        >
            <Logo />
            <template v-if="!isMini">
                <span>{{ page.props.name }}</span>
            </template>
        </div>
        <NavigationList :is-mini="isMini" />
    </aside>
    <Sheet :is-open="isOpenOnPhone" title="Pages" @close="closeOnPhone">
        <template v-if="isOpenOnPhone">
            <div class="flex flex-col">
                <NavigationList :is-mini="false" />
            </div>
        </template>
    </Sheet>
</template>
