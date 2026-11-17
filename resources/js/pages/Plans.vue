<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import PlansView from '@/components/plans/PlansView.vue';
import { useLiveReload } from '@/composables/usePageChanges';
import type { PlansPage } from '@/types/generated';

useLiveReload();

defineProps<{ page: PlansPage }>();
</script>

<template>
    <Head title="Plans" />
    <PlansView :plans="page.plans" />
</template>
