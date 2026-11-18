<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import Button from '@/components/kit/Button.vue';

/**
 * Opens the owner's share preview of a record, named as people name it, such as doc 12; shown to the owner only.
 */
const props = defineProps<{ reference: string }>();

const page = usePage();
const canShare = computed(() => page.props.canShare === true);
</script>

<template>
    <Button v-if="canShare" variant="bordered" :href="`/sharing/${encodeURIComponent(props.reference)}`">Share</Button>
</template>
