<script setup lang="ts">
import type { ReportReceiptPartData } from '@generated/types/documents';
import { useNotifications } from '@kit/notifications';
import { onMounted } from 'vue';

/**
 * A report page's receipt part: once the report is shown, the reader's own report-ready receipt of it, if any,
 * becomes read. It draws nothing.
 */
const props = defineProps<ReportReceiptPartData>();
const notifications = useNotifications();

onMounted(() => void notifications.markTargetRead('report', props.number));
</script>

<template>
    <span hidden></span>
</template>
