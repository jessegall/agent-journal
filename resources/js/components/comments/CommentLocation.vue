<script setup lang="ts">
import { getJson } from '@kit/jsonRequests';
import { onMounted, ref } from 'vue';
import type { RecordCommentLocation, TextCommentLocation } from '@/generated/types/core';
import { location } from '@/routes/comments';
import Button from '@/components/kit/Button.vue';
import SwitchItem from '@/components/kit/SwitchItem.vue';
import CommentSource from './CommentSource.vue';

/**
 * Where one comment leads: a whole-record comment opens its record and shows no text; a text comment shows the
 * version it was left on with its exact place marked. A refused or missing source says so and shows no text.
 */
const props = defineProps<{ target: string; commentId: string }>();

defineEmits<{ close: [] }>();

type Loaded = { state: 'loading' } | { state: 'unavailable'; message: string } | { state: 'found'; place: RecordCommentLocation | TextCommentLocation };

const loaded = ref<Loaded>({ state: 'loading' });

onMounted(async () => {
    const reply = await getJson<RecordCommentLocation | TextCommentLocation>(
        location.url({ query: { target: props.target, comment: props.commentId } }),
    );

    loaded.value = reply.ok ? { state: 'found', place: reply.value } : { state: 'unavailable', message: reply.message };
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
