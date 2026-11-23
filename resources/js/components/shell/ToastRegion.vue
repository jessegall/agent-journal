<script setup lang="ts">
import TextLink from '@kit/TextLink';
import { router, usePage } from '@inertiajs/vue3';
import { nextTick, onBeforeUnmount, ref } from 'vue';
import Button from '@kit/Button';
import Icon from '@/components/kit/Icon.vue';
import { flashedNoticeToast } from '@/composables/flashedNotice';
import { notificationToasts } from '@/composables/notificationToasts';
import { holdsPresentation } from '@/composables/presentationLease';
import { useBellPanel } from '@/composables/useBellPanel';
import { onNotificationArrivals } from '@/composables/useNotifications';
import { useToasts } from '@/composables/useToasts';

/**
 * The shell's one toast region and its one polite status: two outcomes one by one and a summary of the rest with a
 * way into the bell, each toast held while hovered or focused, a failure kept until dismissed. Dismissing marks
 * nothing read. Quiet clears every toast and keeps the region silent for the session.
 */
const toasts = useToasts();
const bell = useBellPanel();
const { toasts: shown, summary, announcement, isQuiet } = toasts;
const region = ref<HTMLElement | null>(null);
const page = usePage();

/**
 * Only the tab that holds the presentation claim shows new arrivals; every other tab only counts them.
 */
onNotificationArrivals((arrivals) => {
    const userId = page.props.currentUser?.id;

    if (userId === undefined || !holdsPresentation(userId)) {
        return;
    }

    notificationToasts(arrivals, page.url).forEach((outcome) => toasts.show(outcome));
});

/**
 * A page action's flashed notice shows as a success toast, once, on the page it came back to.
 */
const stopHearingFlash = router.on('flash', (event) =>
    flashedNoticeToast(event.detail.flash, page.url).forEach((outcome) => toasts.show(outcome)),
);
onBeforeUnmount(stopHearingFlash);

function holdsFocus(element: Element | null): boolean {
    return element !== null && region.value?.contains(element) === true;
}

/**
 * After a surface goes, focus moves to the next surviving toast action, or the bell when none remain, but only when
 * focus was inside what went.
 */
async function afterRemoval(hadFocus: boolean): Promise<void> {
    await nextTick();

    if (!hadFocus) {
        return;
    }

    const next = region.value?.querySelector<HTMLElement>('a, button');

    if (next) {
        next.focus();

        return;
    }

    bell.focusBell();
}

function dismiss(key: string, event: Event): void {
    const hadFocus = holdsFocus(event.currentTarget as Element | null);
    toasts.dismiss(key);
    void afterRemoval(hadFocus);
}

function dismissSummary(event: Event): void {
    const hadFocus = holdsFocus(event.currentTarget as Element | null);
    toasts.dismissSummary();
    void afterRemoval(hadFocus);
}

function openBell(): void {
    toasts.dismissSummary();
    bell.open();
}

function quiet(event: Event): void {
    const hadFocus = holdsFocus(event.currentTarget as Element | null);
    toasts.quietForUser();
    void afterRemoval(hadFocus);
}
</script>

<template>
    <div>
        <p role="status" aria-live="polite" class="sr-only">{{ announcement }}</p>
        <template v-if="!isQuiet && (shown.length > 0 || summary.length > 0)">
            <section
                ref="region"
                aria-label="Outcomes"
                class="fixed right-4 bottom-26 z-(--z-toast) flex w-[min(360px,calc(100vw-32px))] flex-col gap-2"
            >
                <template v-for="toast in shown" :key="toast.key">
                    <div
                        class="flex animate-[toast-in_var(--duration-pop)_var(--ease-journal)] items-center gap-2.5 rounded-menu border bg-raised px-3 py-[9px] text-small text-text-2 shadow-pop"
                        :class="toast.type === 'failure' ? 'border-danger' : 'border-border-2'"
                        @mouseenter="toasts.hold(toast.key, 'hover')"
                        @mouseleave="toasts.release(toast.key, 'hover')"
                        @focusin="toasts.hold(toast.key, 'focus')"
                        @focusout="toasts.release(toast.key, 'focus')"
                    >
                        <template v-if="toast.type === 'failure'">
                            <Icon name="warn" :size="14" class="shrink-0 text-danger" />
                        </template>
                        <p class="m-0 line-clamp-3 min-w-0 flex-1 [overflow-wrap:anywhere]" :title="toast.title">
                            {{ toast.title }}
                        </p>
                        <Button variant="bordered" size="sm" :href="toast.href">Open</Button>
                        <Button variant="bordered" size="sm" @click="dismiss(toast.key, $event)">Dismiss</Button>
                    </div>
                </template>
                <template v-if="summary.length > 0">
                    <div
                        class="flex items-center gap-2.5 rounded-menu border border-border-2 bg-raised px-3 py-[9px] text-small text-text-2 shadow-pop"
                    >
                        <p class="m-0 min-w-0 flex-1">{{ summary.length }} more outcomes</p>
                        <Button variant="bordered" size="sm" @click="openBell">Show in notifications</Button>
                        <Button variant="bordered" size="sm" @click="dismissSummary">Dismiss</Button>
                    </div>
                </template>
                <TextLink variant="quiet" class="self-end" @click="quiet">
                    Hide pop-ups for now
                </TextLink>
            </section>
        </template>
    </div>
</template>
