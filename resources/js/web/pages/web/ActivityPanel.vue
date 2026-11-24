<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import ActivityWindow from '@/web/pages/web/partials/ActivityWindow.vue';
import { liveStage, retryLiveConnection } from '@kit/liveConnection';
import { useWindowReload } from '@kit/useWindowQuery';
import type { ActivityEventData, ActivityWindowData } from '@/types/generated';

/**
 * The Activity window on Home: what the agents of this project did, newest at the bottom. Every read the server pushes
 * is merged into the events already held by id, so nothing the reader sees is dropped; reaching the top reads the page
 * before the oldest event held, once, and the window then asks for the newest page again.
 */
const props = defineProps<{ data: ActivityWindowData }>();

const reload = useWindowReload();
const held = ref(new Map<string, ActivityEventData>());
const hasOlder = ref(props.data.hasOlder);
const readingOlder = ref(false);

const events = computed(() =>
    [...held.value.values()].sort((first, second) =>
        first.occurredAt === second.occurredAt
            ? first.id.localeCompare(second.id)
            : Date.parse(first.occurredAt) - Date.parse(second.occurredAt),
    ),
);

function hold(read: ActivityEventData[]): void {
    const merged = new Map(held.value);

    for (const event of read) {
        merged.set(event.id, event);
    }

    held.value = merged;
}

hold(props.data.events);

const ignoreFailure = { onNetworkError: () => true, onHttpException: () => true };

watch(
    () => props.data,
    (data) => {
        hold(data.events);

        if (!readingOlder.value) {
            return;
        }

        hasOlder.value = data.hasOlder;
        readingOlder.value = false;
        // Back to the newest page, so the next pushed read is of the newest entries again.
        reload({ before: '' }, ignoreFailure);
    },
);

function readOlder(): void {
    const oldest = events.value[0];

    if (oldest === undefined || readingOlder.value) {
        return;
    }

    readingOlder.value = true;
    reload({ before: oldest.id }, ignoreFailure);
}
</script>

<template>
    <ActivityWindow
        :events="events"
        :connection="liveStage === 'subscribed' ? 'connected' : 'disconnected'"
        :has-older="hasOlder"
        @older="readOlder"
        @reconnect="retryLiveConnection"
    />
</template>
