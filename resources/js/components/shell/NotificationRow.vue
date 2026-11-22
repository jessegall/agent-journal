<script setup lang="ts">
import type { NotificationItem } from '@/generated/types/core';
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';

/**
 * One notification: its title as plain text, wrapping to two lines with the whole title in its controls' names, an
 * unread marker and weight in the text colour, never the accent alone, and two controls of its own that wrap below
 * the title at any width: Open, to the server's destination, and Mark read.
 */
const props = defineProps<{
    item: NotificationItem;
    isPending: boolean;
    canChange: boolean;
}>();

const emit = defineEmits<{
    read: [];
    open: [];
}>();

const isUnread = computed(() => props.item.readAt === null);
</script>

<template>
    <li class="flex items-start gap-2 rounded-control px-2 py-1.5">
        <span
            class="mt-1.5 size-1.5 shrink-0 rounded-full"
            :class="isUnread ? 'bg-text' : 'bg-transparent'"
            aria-hidden="true"
        ></span>
        <div class="flex min-w-0 flex-1 flex-col gap-1">
            <p
                :title="item.title"
                class="line-clamp-2 text-small [overflow-wrap:anywhere]"
                :class="isUnread ? 'font-semibold text-text' : 'text-text-2'"
            >
                <template v-if="isUnread"><span class="sr-only">Unread: </span></template>{{ item.title }}
            </p>
            <span class="flex flex-wrap gap-x-3 gap-y-1 text-small text-text-3">
                <template v-if="item.target">
                    <Link
                        :href="item.target.url"
                        :data-open="item.id"
                        :aria-label="`Open ${item.title}`"
                        class="underline"
                        @click="emit('open')"
                        >Open</Link
                    >
                </template>
                <template v-if="isUnread">
                    <button
                        type="button"
                        class="underline disabled:opacity-50"
                        :aria-label="`Mark ${item.title} read`"
                        :disabled="!canChange || isPending"
                        @click="emit('read')"
                    >
                        Mark read
                    </button>
                </template>
            </span>
        </div>
    </li>
</template>
