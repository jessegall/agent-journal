<script setup lang="ts">
import Button from '@/components/kit/Button.vue';
import { Link } from '@inertiajs/vue3';
import type { FilePaneData } from '@generated/types/connections';
import SwitchCase from '@kit/SwitchCase';
import { useWindowReload } from '@kit/useWindowQuery';
import { usePendingPoll } from '../../usePendingPoll';

const props = defineProps<FilePaneData>();
const reload = useWindowReload();
const { gaveUp, retry } = usePendingPoll(
    () => props.lines,
    () => props.status === 'pending',
    () => reload({ path: props.path }),
);
</script>

<template>
    <div class="flex h-full min-h-0 min-w-0 flex-col gap-2 p-3 text-sm">
        <p v-if="path" class="break-all font-medium">{{ path }}</p>
        <SwitchCase :value="gaveUp ? 'failed' : status">
            <template #ready>
                <pre class="min-h-0 overflow-auto rounded border p-2 text-xs">{{ lines.join('\n') }}</pre>
                <p v-if="isTruncated" class="text-xs text-muted-foreground">Preview shortened.</p>
            </template>
            <template #pending><p>Reading file…</p></template>
            <template #empty><p>Choose a file from Project.</p></template>
            <template #none><p>No project is connected.</p></template>
            <template #binary><p>Only text files can be previewed.</p></template>
            <template #too_large><p>This file exceeds the preview size.</p></template>
            <template #default><Button variant="bare" class="self-start underline" @click="retry">Retry file read</Button></template>
        </SwitchCase>
        <Link :href="fullUrl" class="self-start text-xs font-medium underline">Open full file</Link>
    </div>
</template>
