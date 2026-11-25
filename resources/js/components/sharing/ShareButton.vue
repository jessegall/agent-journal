<script setup lang="ts">
import { computed } from 'vue';
import Button from '@/components/kit/Button.vue';
import { useAppContext } from '@/framework/appContext';

/**
 * Opens the owner's share preview of a record, named as users name it, such as doc 12; shown to the owner only.
 */
const props = defineProps<{ reference: string }>();

const { viewer } = useAppContext();
const canShare = computed(() => viewer.value.canShare);
</script>

<template>
    <template v-if="canShare">
        <Button
            variant="bordered"
            :href="`/sharing/${encodeURIComponent(props.reference)}`"
            >Share</Button
        >
    </template>
</template>
