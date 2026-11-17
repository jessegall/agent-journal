<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { computed } from 'vue';
import HomePanes from '@/components/home/HomePanes.vue';
import { useLiveReload } from '@/composables/usePageChanges';
import type { HomePage } from '@/types/generated';

const props = defineProps<{ page: HomePage }>();

useLiveReload();

const session = computed(() => props.page.chat.conversation?.sessionId);
</script>

<template>
    <Head title="Home" />
    <div class="@container h-full">
        <HomePanes :page="page" :session="session" />
    </div>
</template>
