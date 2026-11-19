<script setup lang="ts">
import { getJson } from '@kit/jsonRequests';
import { onMounted, ref } from 'vue';
import type { RecordCommentLocation, TextCommentLocation } from '@/generated/types/core';
import { location } from '@/routes/comments';
import Button from '@/components/kit/Button.vue';
import SwitchCase from '@/components/kit/SwitchCase.vue';
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
        <SwitchCase :value="loaded.state">
            <template #loading>
                <p class="text-small text-text-3">Opening the comment's place…</p>
            </template>
            <template #unavailable>
                <template v-if="loaded.state === 'unavailable'">
                    <p class="text-small text-warn">The place this comment points at is not available: {{ loaded.message }}</p>
                </template>
            </template>
            <template #found>
                <template v-if="loaded.state === 'found'">
                    <SwitchCase :value="loaded.place.type">
                        <template #record>
                            <a :href="loaded.place.target.route ?? undefined" class="text-small underline">Open {{ loaded.place.target.label }}</a>
                        </template>
                        <template #text>
                            <template v-if="loaded.place.type === 'text'">
                                <CommentSource :location="loaded.place" />
                            </template>
                        </template>
                    </SwitchCase>
                </template>
            </template>
        </SwitchCase>
        <div>
            <Button @click="$emit('close')">Close</Button>
        </div>
    </section>
</template>
