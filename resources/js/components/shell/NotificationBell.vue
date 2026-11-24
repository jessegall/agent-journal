<script setup lang="ts">
import TextLink from '@kit/TextLink';
import { computed, nextTick, ref, watch } from 'vue';
import IconAction from '@/components/kit/IconAction.vue';
import Popover from '@/components/kit/Popover.vue';
import Sheet from '@/components/kit/Sheet.vue';
import { useBellPanel } from '@/composables/useBellPanel';
import { useNotifications } from '@/composables/useNotifications';
import { useToasts } from '@/composables/useToasts';
import { PHONE_WIDTH } from '@/composables/useSidebar';
import NotificationList from './NotificationList.vue';

/**
 * The shell's bell: its button names the exact unread count, a badge shows it to the eye (none at zero, 99+ from a
 * hundred), and it opens the list beside it on a desktop or as a titled sheet on a phone. Opening marks nothing;
 * Escape and closing return focus to the bell.
 */
const notifications = useNotifications();
const { state, shown, items, hasOlder, olderFailed, hasNewItems, pending, canChange } = notifications;
const panelId = 'notification-panel';
const { isOpen, registerFocus } = useBellPanel();
const isCompact = ref(false);
const lastOpenedId = ref<string | undefined>(undefined);
const bell = ref<InstanceType<typeof IconAction> | null>(null);
const bellElement = computed(() => (bell.value?.$el as HTMLElement | undefined) ?? null);

registerFocus(() => bell.value?.focus());

const { isQuiet, resumeForUser } = useToasts();

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
    isOpen.value = true;
}

/**
 * However the list opens, from the bell or from a toast summary, it lays itself out for the screen and reads again.
 */
watch(isOpen, (opened) => {
    if (!opened) {
        return;
    }

    isCompact.value = window.matchMedia(PHONE_WIDTH).matches;
    void notifications.refresh();
});

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
                    class="pointer-events-none absolute -top-1 -right-1 min-w-4 rounded-badge border border-border-3 bg-bg px-1 text-center text-meta leading-4 font-semibold text-text"
                    aria-hidden="true"
                    >{{ badge }}</span
                >
            </template>
        </IconAction>
        <template v-if="!isCompact">
            <Popover v-model:open="isOpen" :anchor="bellElement" align="right" label="Notifications">
              <div class="p-1.5">
                <NotificationList
                    :id="panelId"
                    :state="state"
                    :page="shown"
                    :items="items"
                    :has-older="hasOlder"
                    :older-failed="olderFailed"
                    :has-new-items="hasNewItems"
                    :pending="pending"
                    :can-change="canChange"
                    :last-opened-id="lastOpenedId"
                    @read="(receiptId) => notifications.markRead(receiptId)"
                    @open="followed"
                    @retry="notifications.refresh()"
                    @load-older="notifications.loadOlder()"
                    @reveal-new="notifications.revealNew()"
                    @mark-all="notifications.markAll()"
                />
                <template v-if="isQuiet">
                    <TextLink variant="quiet" class="px-2 pt-1" @click="resumeForUser">
                        Show pop-ups again
                    </TextLink>
                </template>
              </div>
            </Popover>
        </template>
        <template v-if="isCompact">
            <Sheet :is-open="isOpen" title="Notifications" @close="close">
                <NotificationList
                    :id="panelId"
                    :state="state"
                    :page="shown"
                    :items="items"
                    :has-older="hasOlder"
                    :older-failed="olderFailed"
                    :has-new-items="hasNewItems"
                    :pending="pending"
                    :can-change="canChange"
                    :last-opened-id="lastOpenedId"
                    @read="(receiptId) => notifications.markRead(receiptId)"
                    @open="followed"
                    @retry="notifications.refresh()"
                    @load-older="notifications.loadOlder()"
                    @reveal-new="notifications.revealNew()"
                    @mark-all="notifications.markAll()"
                />
                <template v-if="isQuiet">
                    <TextLink variant="quiet" @click="resumeForUser">
                        Show pop-ups again
                    </TextLink>
                </template>
            </Sheet>
        </template>
    </div>
</template>
