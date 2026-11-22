<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import ActivityItem from '@/components/kit/ActivityItem.vue';
import Button from '@/components/kit/Button.vue';
import EmptyState from '@/components/kit/EmptyState.vue';
import type { IconName } from '@/components/kit/Icon.vue';
import PanelToolbar from '@/components/kit/PanelToolbar.vue';
import Tabs from '@/components/kit/Tabs.vue';

/**
 * What the agents do, as it happens: level tabs over a feed that scrolls inside its window. It keeps the reader where
 * they are as events arrive, following the newest only while the reader is at the bottom. A connected feed with nothing
 * in it says it is waiting; a level that matches nothing offers Show all; when the connection drops the events stay,
 * with Reconnect. The window is told its events and the state of its connection; it listens to nothing itself.
 */
export type ActivityEvent = {
    id: string;
    time: string;
    level: 1 | 2 | 3;
    icon: IconName;
    who: string;
    text: string;
    found?: string[];
};

const props = defineProps<{ events: ActivityEvent[]; connection: 'connected' | 'disconnected' }>();
const emit = defineEmits<{ reconnect: [] }>();

const levels = [
    { key: 'all', label: 'All' },
    { key: '3', label: 'In the chat' },
    { key: '2', label: 'In the panel' },
    { key: '1', label: 'Detail' },
] as const;

const chosen = ref<string>('all');
const feed = useTemplateRef<HTMLElement>('feed');
const shown = computed(() =>
    chosen.value === 'all' ? props.events : props.events.filter((event) => String(event.level) === chosen.value),
);

watch(
    () => props.events.length,
    async () => {
        const element = feed.value;
        const wasAtBottom = element === null || element.scrollTop + element.clientHeight >= element.scrollHeight - 8;

        await nextTick();

        if (wasAtBottom && element !== null) {
            element.scrollTop = element.scrollHeight;
        }
    },
);
</script>

<template>
    <section aria-label="Activity" class="flex h-full min-h-0 flex-col">
        <PanelToolbar label="Activity levels">
            <Tabs v-model="chosen" label="Activity levels" variant="filters" :tabs="levels" />
        </PanelToolbar>
        <template v-if="connection === 'disconnected'">
            <p role="status" class="flex items-center gap-2 border-b border-line px-3 py-1.5 text-small text-text-3">
                Disconnected. The events below are kept.
                <Button size="small" variant="bordered" @click="emit('reconnect')">Reconnect</Button>
            </p>
        </template>
        <div ref="feed" class="min-h-0 flex-1 overflow-y-auto">
            <template v-if="events.length === 0">
                <EmptyState icon="activity" title="Waiting for activity" />
            </template>
            <template v-else-if="shown.length === 0">
                <EmptyState icon="activity" title="Nothing at this level">
                    <Button size="small" variant="bordered" @click="chosen = 'all'">Show all</Button>
                </EmptyState>
            </template>
            <template v-else>
                <ul class="m-0 list-none p-0" aria-live="polite">
                    <template v-for="event in shown" :key="event.id">
                        <ActivityItem
                            density="row"
                            :time="event.time"
                            :level="event.level"
                            :icon="event.icon"
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
