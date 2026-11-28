<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import type { ProjectPaneData } from '@generated/types/connections';
import SwitchCase from '@kit/SwitchCase';
import { useFileOpener } from '@kit/fileOpener';
import { useWindowReload } from '@kit/useWindowQuery';
import { usePendingPoll } from '../../usePendingPoll';

const props = defineProps<ProjectPaneData>();
const openFile = useFileOpener();
const reload = useWindowReload();
const { gaveUp, retry } = usePendingPoll(
    () => props.items,
    () => props.status === 'pending',
    () => reload({}),
);
</script>

<template>
    <div class="min-w-0 p-3 text-sm">
        <SwitchCase :value="gaveUp ? 'failed' : status">
            <template #ready>
                <ul class="divide-y divide-border">
                    <li v-for="entry in items" :key="entry.path" class="py-2">
                        <span v-if="entry.isFolder" class="break-all">{{ entry.name }}/</span>
                        <button v-else class="break-all text-left hover:underline" @click="openFile(entry.path)">
                            {{ entry.name }}
                        </button>
                    </li>
                </ul>
            </template>
            <template #none>
                <Link :href="connectUrl" class="underline">Connect a project</Link>
            </template>
            <template #pending>
                <p>Reading the project's files…</p>
            </template>
            <template #default>
                <button class="underline" @click="retry">Retry project read</button>
            </template>
        </SwitchCase>
        <Link :href="fullUrl" class="mt-2 inline-flex text-xs font-medium underline">Open project</Link>
    </div>
</template>
