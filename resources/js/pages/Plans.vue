<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import PlansView from '@/components/plans/PlansView.vue';
import type { PlansPage } from '@/types/generated';

defineProps<{ page: PlansPage }>();
</script>

<template>
    <Head title="Plans" />
    <PlansView :plans="page.plans" />
</template>
