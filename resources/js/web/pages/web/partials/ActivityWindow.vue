<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import ActivityItem from '@/components/kit/ActivityItem.vue';
import Button from '@/components/kit/Button.vue';
import EmptyState from '@/components/kit/EmptyState.vue';
import type { IconName } from '@/components/kit/Icon.vue';
import type { ActivityEventData } from '@/types/generated';
import PanelToolbar from '@/components/kit/PanelToolbar.vue';
import Tabs from '@/components/kit/Tabs.vue';

/**
 * What the agents do, as it happens: level tabs over a feed that scrolls inside its window, each time shown on the
 * viewer's own clock. It keeps the reader where they are as events arrive, following the newest only while the reader
 * is at the bottom, and asks for older events when the reader reaches the top while there are more, keeping the
 * reader's place as they are added above. A connected feed with nothing in it says it is waiting; a level that
 * matches nothing offers Show everything; when the connection drops the events stay, with Reconnect.
 */
const props = defineProps<{
    events: ActivityEventData[];
    connection: 'connected' | 'disconnected';
    hasOlder?: boolean;
}>();
const emit = defineEmits<{ reconnect: []; older: [] }>();

// Each tab shows its level and every level above it, as the design's filters do.
const levels = [
    { key: '3', label: 'Important' },
    { key: '2', label: 'Normal and up' },
    { key: '1', label: 'Everything' },
] as const;

const clock = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

const chosen = ref<string>('1');
const feed = useTemplateRef<HTMLElement>('feed');
const shown = computed(() =>
    props.events.filter((event) => event.level >= Number(chosen.value)),
);

watch(
    () => props.events.map((event) => event.id),
    async (ids, previous) => {
        const element = feed.value;
        const wasAtBottom = element === null || element.scrollTop + element.clientHeight >= element.scrollHeight - 8;
        const addedAbove = previous !== undefined && previous.length > 0 && ids[0] !== previous[0];
        const heightBefore = element?.scrollHeight ?? 0;

        await nextTick();

        if (element === null) {
            return;
        }

        if (addedAbove) {
            element.scrollTop += element.scrollHeight - heightBefore;
        } else if (wasAtBottom) {
            element.scrollTop = element.scrollHeight;
        }
    },
);

function readOlderAtTop(): void {
    if (props.hasOlder === true && feed.value !== null && feed.value.scrollTop === 0) {
        emit('older');
    }
}
</script>

<template>
    <section aria-label="Activity" class="flex h-full min-h-0 flex-col">
        <PanelToolbar label="Activity levels">
            <Tabs v-model="chosen" label="Activity levels" variant="toolbar" :tabs="levels" />
        </PanelToolbar>
        <template v-if="connection === 'disconnected'">
            <p role="status" class="flex items-center gap-2 border-b border-line px-3 py-1.5 text-small text-text-3">
                Disconnected. The events below are kept.
                <Button size="small" variant="bordered" @click="emit('reconnect')">Reconnect</Button>
            </p>
        </template>
        <div ref="feed" class="min-h-0 flex-1 overflow-y-auto" @scroll="readOlderAtTop">
            <template v-if="events.length === 0">
                <EmptyState icon="activity" title="Waiting for activity" />
            </template>
            <template v-else-if="shown.length === 0">
                <EmptyState icon="activity" title="Nothing at this level">
                    <Button size="small" variant="bordered" @click="chosen = '1'">Show everything</Button>
                </EmptyState>
            </template>
            <template v-else>
                <ul class="m-0 list-none p-0" aria-live="polite">
                    <template v-for="event in shown" :key="event.id">
                        <ActivityItem
                            density="row"
                            :time="clock.format(new Date(event.occurredAt))"
                            :level="event.level as 1 | 2 | 3"
                            :icon="event.icon as IconName"
                            :who="event.who"
                            :text="event.text"
                            :found="event.found"
                        />
                    </template>
                </ul>
            </template>
        </div>
    </section>
</template>
