<script setup lang="ts">
import type { RecordSharePartData } from '@generated/types/documents';
import ShareButton from '@kit/ShareButton';

/**
 * A record's share control as a native part of its layout.
 */
defineProps<RecordSharePartData>();
</script>

<template>
    <ShareButton :reference="reference" />
</template>
