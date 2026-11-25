<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { onMounted, ref, watch } from 'vue';
import type { RecordCommentLocation, TextCommentLocation } from '@generated/types/comments';
import Button from '@kit/Button';
import SwitchItem from '@kit/SwitchItem';
import CommentSource from './CommentSource.vue';

/**
 * Where one comment leads: a whole-record comment opens its record and shows no text; a text comment shows the
 * version it was left on with its exact place marked. The record page reads it when asked, beside the record; a
 * refused or missing source says so and shows no text.
 */
const props = defineProps<{ target: string; commentId: string; found?: RecordCommentLocation | TextCommentLocation }>();

defineEmits<{ close: [] }>();

type Loaded = { state: 'loading' } | { state: 'unavailable'; message: string } | { state: 'found'; place: RecordCommentLocation | TextCommentLocation };

const loaded = ref<Loaded>({ state: 'loading' });

// The page answers the location it was asked for beside the record.
watch(
    () => props.found,
    (place) => {
        if (place !== undefined) {
            loaded.value = { state: 'found', place };
        }
    },
);

onMounted(() => {
    router.reload({
        only: ['page'],
        data: { commentLocation: props.commentId },
        onError: (errors) => {
            loaded.value = { state: 'unavailable', message: Object.values(errors)[0] ?? 'it could not be read' };
        },
    });
});
</script>

<template>
    <section class="flex flex-col gap-2" aria-live="polite">
        <SwitchItem :item="loaded" by="state">
            <template #loading>
                <p class="text-small text-text-3">Opening the comment's place…</p>
            </template>
            <template #unavailable="{ item: unavailable }">
                <p class="text-small text-warn">The place this comment points at is not available: {{ unavailable.message }}</p>
            </template>
            <template #found="{ item: found }">
                <SwitchItem :item="found.place" by="type">
                    <template #record="{ item: record }">
                        <a :href="record.target.route ?? undefined" class="text-small underline">Open {{ record.target.label }}</a>
                    </template>
                    <template #text="{ item: text }">
                        <CommentSource :location="text" />
                    </template>
                </SwitchItem>
            </template>
        </SwitchItem>
        <div>
            <Button @click="$emit('close')">Close</Button>
        </div>
    </section>
</template>
