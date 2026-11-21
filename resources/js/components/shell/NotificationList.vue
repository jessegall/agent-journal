<script setup lang="ts">
import type { NotificationItem, NotificationPage } from '@/generated/types/core';
import { nextTick, onMounted, ref } from 'vue';
import Button from '@/components/kit/Button.vue';
import EmptyState from '@/components/kit/EmptyState.vue';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import { MARK_ALL } from '@/composables/notificationStore';
import type { NotificationLoadState } from '@/composables/notificationStore';
import NotificationRow from './NotificationRow.vue';

/**
 * The signed-in actor's notifications, newest first across read and unread: each row's title as plain text, an
 * unread marker and weight, an Open link to the server's destination and a Mark read button, two controls of their
 * own. Opening the list marks nothing. A failed first load never shows an empty list or a zero count.
 */
const props = defineProps<{
    id: string;
    state: NotificationLoadState;
    page: NotificationPage | null;
    // Every row loaded, the first page and the older pages, newest first.
    items: NotificationItem[];
    hasOlder: boolean;
    olderFailed: boolean;
    hasNewItems: boolean;
    pending: ReadonlySet<string>;
    canChange: boolean;
    // The row whose Open link was followed last, focused again when the list comes back.
    lastOpenedId: string | undefined;
}>();

const emit = defineEmits<{
    read: [receiptId: string];
    open: [receiptId: string];
    retry: [];
    loadOlder: [];
    revealNew: [];
    markAll: [];
}>();

const heading = ref<HTMLElement | null>(null);
const list = ref<HTMLElement | null>(null);

function openLinkOf(receiptId: string): HTMLElement | null {
    return list.value?.querySelector<HTMLElement>(`[data-open="${receiptId}"]`) ?? null;
}

/**
 * Focuses the list's heading, as the dialog does when it opens and a row does when its controls are gone.
 */
function focusHeading(): void {
    heading.value?.focus();
}

/**
 * Marks the row read; its button goes, so focus moves to the row's Open link, else the list heading.
 */
async function markRead(item: NotificationItem): Promise<void> {
    emit('read', item.id);
    await nextTick();
    (openLinkOf(item.id) ?? heading.value)?.focus();
}

onMounted(() => {
    if (props.lastOpenedId !== undefined) {
        openLinkOf(props.lastOpenedId)?.focus();
    }
});

defineExpose({ focusHeading });
</script>

<template>
    <section
        :id="id"
        class="flex w-[min(360px,calc(100vw-32px))] flex-col gap-1"
        aria-labelledby="notifications-heading"
    >
        <h2
            id="notifications-heading"
            ref="heading"
            tabindex="-1"
            class="px-2 pt-2 text-group font-semibold text-text-2"
        >
            Notifications
        </h2>
        <SwitchCase :value="state">
            <template #loading>
                <p class="px-2 py-3 text-small text-text-3" role="status">Loading notifications…</p>
            </template>
            <template #failed>
                <div class="flex flex-col items-start gap-2 px-2 py-3">
                    <p class="text-small text-text-2" role="alert">Couldn't load notifications</p>
                    <Button size="small" variant="bordered" @click="emit('retry')">Retry</Button>
                </div>
            </template>
            <template #expired>
                <div class="flex flex-col items-start gap-2 px-2 py-3">
                    <p class="text-small text-text-2" role="status">Checking your notifications again…</p>
                    <Button size="small" variant="bordered" @click="emit('retry')">Retry</Button>
                </div>
            </template>
            <template #default>
                <template v-if="state === 'refreshFailed'">
                    <p class="flex items-center gap-2 px-2 text-small text-text-2" role="alert">
                        Couldn't refresh notifications
                        <Button size="small" variant="bordered" @click="emit('retry')">Retry</Button>
                    </p>
                </template>
                <template v-if="hasNewItems">
                    <Button size="small" variant="bordered" @click="emit('revealNew')">New notifications</Button>
                </template>
                <template v-if="page === null || items.length === 0">
                    <EmptyState icon="bell" title="No notifications yet" />
                </template>
                <template v-else>
                    <div class="flex items-center justify-between gap-2 px-2">
                        <template v-if="page.unread === 0">
                            <p class="text-small text-text-3">All caught up</p>
                        </template>
                        <Button
                            size="small"
                            variant="bordered"
                            :pending="pending.has(MARK_ALL)"
                            :disabled="page.unread === 0 || !canChange"
                            @click="emit('markAll')"
                        >
                            Mark all read
                        </Button>
                    </div>
                    <ul ref="list" class="flex max-h-[60vh] flex-col overflow-y-auto">
                        <template v-for="item in items" :key="item.id">
                            <NotificationRow
                                :item="item"
                                :is-pending="pending.has(item.id)"
                                :can-change="canChange"
                                @read="markRead(item)"
                                @open="emit('open', item.id)"
                            />
                        </template>
                    </ul>
                    <template v-if="olderFailed">
                        <p class="flex items-center gap-2 px-2 text-small text-text-2" role="alert">
                            Couldn't refresh notifications
                            <Button size="small" variant="bordered" @click="emit('loadOlder')">Retry</Button>
                        </p>
                    </template>
                    <template v-else-if="hasOlder">
                        <Button size="small" variant="bordered" @click="emit('loadOlder')">Load older</Button>
                    </template>
                </template>
            </template>
        </SwitchCase>
    </section>
</template>
