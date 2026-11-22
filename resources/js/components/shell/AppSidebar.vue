<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { watch } from 'vue';
import Logo from '@/components/kit/Logo.vue';
import Sheet from '@/components/kit/Sheet.vue';
import { useSidebar } from '@/composables/useSidebar';
import NavigationList from './NavigationList.vue';

/**
 * The navigation sidebar: 216 px wide with the Logo, the page records and the current page marked, collapsing to a
 * 56 px rail of icons. On a phone it is not drawn; the topbar button opens the same navigation in a Sheet, which
 * closes when a page is chosen.
 */
const page = usePage();
const { isMini, isOpenOnPhone, closeOnPhone } = useSidebar();

watch(() => page.url, closeOnPhone);
</script>

<template>
    <aside
        class="flex shrink-0 flex-col border-r border-border bg-side max-[760px]:hidden"
        :class="isMini ? 'w-14' : 'w-54'"
    >
        <div
            class="flex items-center gap-2.5 py-3.5"
            :class="isMini ? 'justify-center' : 'px-[18px]'"
        >
            <Logo />
            <template v-if="!isMini">
                <span class="text-[14px] font-semibold text-text">{{
                    page.props.name
                }}</span>
            </template>
        </div>
        <NavigationList :is-mini="isMini" />
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
    <Sheet :is-open="isOpenOnPhone" title="Pages" @close="closeOnPhone">
        <template v-if="isOpenOnPhone">
            <div class="flex flex-col">
                <NavigationList :is-mini="false" />
            </div>
        </template>
    </Sheet>
</template>
