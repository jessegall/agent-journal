<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import HomePanes from '@/web/pages/web/partials/HomePanes.vue';
import type { HomeData } from '@/types/generated';

/**
 * Home, Web's own page: its layouts and the windows the installed domains offer it. Each window brings its own prop.
 */
defineProps<{ data: HomeData }>();
</script>

<template>
    <Head title="Home" />
    <div class="@container h-full">
        <HomePanes :home="data" />
    </div>
</template>
