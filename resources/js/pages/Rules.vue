<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import RulesView from '@/components/rules/RulesView.vue';
import { useLiveReload } from '@/composables/usePageChanges';
import type { RulesPage } from '@/types/generated';

useLiveReload();

defineProps<{ page: RulesPage }>();
</script>

<template>
    <Head title="Rules" />
    <RulesView :rules="page.rules" />
</template>
