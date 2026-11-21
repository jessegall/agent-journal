<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import IconAction from '@/components/kit/IconAction.vue';
import Modal from '@/components/kit/Modal.vue';
import { useNotifications } from '@/composables/useNotifications';
import { PHONE_WIDTH } from '@/composables/useSidebar';
import NotificationList from './NotificationList.vue';

/**
 * The shell's bell: its button names the exact unread count, a badge shows it to the eye (none at zero, 99+ from a
 * hundred), and it opens the list beside it on a desktop or as a dialog on a phone. Opening marks nothing; Escape and
 * closing return focus to the bell.
 */
const notifications = useNotifications();
const { state, shown, pending, canChange } = notifications;
const panelId = 'notification-panel';
const isOpen = ref(false);
const isCompact = ref(false);
const lastOpenedId = ref<string | undefined>(undefined);
const bell = ref<InstanceType<typeof IconAction> | null>(null);
const list = ref<InstanceType<typeof NotificationList> | null>(null);

const unread = computed(() => shown.value?.unread);
const label = computed(() =>
    unread.value === undefined ? 'Notifications' : `Notifications, ${unread.value} unread`,
);
const badge = computed(() => {
    if (unread.value === undefined || unread.value === 0) {
        return null;
    }

    return unread.value > 99 ? '99+' : String(unread.value);
});

function open(): void {
    isCompact.value = window.matchMedia(PHONE_WIDTH).matches;
    isOpen.value = true;
    void notifications.refresh();
}

async function close(): Promise<void> {
    isOpen.value = false;
    await nextTick();
    bell.value?.focus();
}

function toggle(): void {
    if (isOpen.value) {
        void close();

        return;
    }

    open();
}

function closeOnEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        event.stopPropagation();
        void close();
    }
}

/**
 * Remembers the row followed, so Back finds it again; on a phone the dialog closes for the destination page.
 */
function followed(receiptId: string): void {
    lastOpenedId.value = receiptId;

    if (isCompact.value) {
        isOpen.value = false;
    }
}
</script>

<template>
    <div class="relative" @keydown="closeOnEscape">
        <IconAction
            ref="bell"
            icon="bell"
            tip="Notifications"
            :label="label"
            :icon-size="13"
            :expanded="isOpen && !isCompact"
            :controls="isOpen && !isCompact ? panelId : undefined"
            @click="toggle"
        >
            <template v-if="badge !== null">
                <span
                    class="pointer-events-none absolute -top-1 -right-1 min-w-4 rounded-full border border-border-2 bg-bg px-1 text-center text-[10px] leading-4 text-text"
                    aria-hidden="true"
                    >{{ badge }}</span
                >
            </template>
        </IconAction>
        <template v-if="isOpen && !isCompact">
            <div class="absolute top-8 right-0 z-90 rounded-menu border border-border-2 bg-raised p-1.5 shadow-[0_14px_36px_rgba(0,0,0,.45)]">
                <NotificationList
                    :id="panelId"
                    :state="state"
                    :page="shown"
                    :pending="pending"
                    :can-change="canChange"
                    :last-opened-id="lastOpenedId"
                    @read="(receiptId) => notifications.markRead(receiptId)"
                    @open="followed"
                    @retry="notifications.refresh()"
                />
            </div>
        </template>
        <template v-if="isCompact">
            <Modal :is-open="isOpen" title="Notifications" @close="close" @opened="list?.focusHeading()">
                <NotificationList
                    ref="list"
                    :id="panelId"
                    :state="state"
                    :page="shown"
                    :pending="pending"
                    :can-change="canChange"
                    :last-opened-id="lastOpenedId"
                    @read="(receiptId) => notifications.markRead(receiptId)"
                    @open="followed"
                    @retry="notifications.refresh()"
                />
            </Modal>
        </template>
    </div>
</template>
