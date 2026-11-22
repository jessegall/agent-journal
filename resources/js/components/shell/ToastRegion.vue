<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { nextTick, ref } from 'vue';
import Icon from '@/components/kit/Icon.vue';
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
                class="fixed right-4 bottom-4 z-90 flex w-[min(360px,calc(100vw-32px))] flex-col gap-2"
            >
                <template v-for="toast in shown" :key="toast.key">
                    <div
                        class="flex items-start gap-2 rounded-card border bg-raised p-3 text-small shadow-pop"
                        :class="toast.type === 'failure' ? 'border-danger' : 'border-border-2'"
                        @mouseenter="toasts.hold(toast.key, 'hover')"
                        @mouseleave="toasts.release(toast.key, 'hover')"
                        @focusin="toasts.hold(toast.key, 'focus')"
                        @focusout="toasts.release(toast.key, 'focus')"
                    >
                        <template v-if="toast.type === 'failure'">
                            <Icon name="warn" :size="14" class="mt-0.5 shrink-0 text-danger" />
                        </template>
                        <div class="flex min-w-0 flex-1 flex-col gap-1">
                            <p class="line-clamp-3 [overflow-wrap:anywhere] text-text" :title="toast.title">
                                {{ toast.title }}
                            </p>
                            <span class="flex flex-wrap gap-x-3 gap-y-1 text-text-3">
                                <Link :href="toast.href" class="underline">Open</Link>
                                <button type="button" class="underline" @click="dismiss(toast.key, $event)">
                                    Dismiss
                                </button>
                            </span>
                        </div>
                    </div>
                </template>
                <template v-if="summary.length > 0">
                    <div class="flex flex-col gap-1 rounded-card border border-border-2 bg-raised p-3 text-small">
                        <p class="text-text">{{ summary.length }} more outcomes</p>
                        <span class="flex gap-3 text-text-3">
                            <button type="button" class="underline" @click="openBell">Show in notifications</button>
                            <button type="button" class="underline" @click="dismissSummary">Dismiss</button>
                        </span>
                    </div>
                </template>
                <button type="button" class="self-end text-small text-text-3 underline" @click="quiet">
                    Hide pop-ups for now
                </button>
            </section>
        </template>
    </div>
</template>
