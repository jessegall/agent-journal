<script setup lang="ts">
import { ref } from 'vue';
import { router, useForm } from '@inertiajs/vue3';
import type { CommentList, TextCommentLocation } from '@kit/CoreTypes';
import { location, post as postRoute } from '@kit/CommentRoutes';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import SwitchCase from '@kit/SwitchCase';
import { formSendingHooks } from '@kit/usePageChanges';
import CommentEntry from './CommentEntry.vue';
import CommentPlace from './CommentPlace.vue';
import CommentSource from './CommentSource.vue';

/**
 * The comments on a record, oldest first, and the form that posts one. A comment is about the whole record unless the
 * reader chooses text in the record's source, which is sent with its version, lines and exact byte offsets.
 */
const props = defineProps<{
    comments: CommentList;
    target: string;
    body: string;
    version?: string;
}>();

const form = useForm({
    target: props.target,
    body: '',
    submission_key: crypto.randomUUID(),
    version: '',
    first_line: null as number | null,
    last_line: null as number | null,
    quote: '',
    start_offset: null as number | null,
    end_offset: null as number | null,
});

const choosing = ref(false);
const source = ref<HTMLTextAreaElement | null>(null);
const opened = ref<TextCommentLocation | null>(null);
const bytes = new TextEncoder();

/**
 * Turns the characters selected in the source into the line span and the UTF-8 byte offsets within it.
 */
function takeSelection(): void {
    const area = source.value;

    if (area === null || props.version === undefined || area.selectionEnd <= area.selectionStart) {
        return;
    }

    const start = area.selectionStart;
    const end = area.selectionEnd;
    const firstLineStart = props.body.lastIndexOf('\n', start - 1) + 1;
    const firstLine = props.body.slice(0, start).split('\n').length;
    const quote = props.body.slice(start, end);
    const startOffset = bytes.encode(props.body.slice(firstLineStart, start)).length;

    form.version = props.version;
    form.first_line = firstLine;
    form.last_line = firstLine + quote.split('\n').length - 1;
    form.quote = quote;
    form.start_offset = startOffset;
    form.end_offset = startOffset + bytes.encode(quote).length;
    choosing.value = false;
}

function aboutWholeRecord(): void {
    form.reset('version', 'first_line', 'last_line', 'quote', 'start_offset', 'end_offset');
}

function post(): void {
    const sending = formSendingHooks();

    form.transform((fields) =>
        fields.quote === '' ? { target: fields.target, body: fields.body, submission_key: fields.submission_key } : fields,
    ).post(postRoute.url(), {
        preserveScroll: true,
        onSuccess: () => {
            form.reset();
            form.submission_key = crypto.randomUUID();
        },
        onStart: sending.onStart,
        onFinish: () => {
            sending.onFinish();

            if (!form.wasSuccessful && !form.hasErrors) {
                router.reload();
            }
        },
    });
}

async function open(commentId: string): Promise<void> {
    const reply = await fetch(location.url({ query: { target: props.target, comment: commentId } }), {
        headers: { Accept: 'application/json' },
    });

    opened.value = reply.ok ? ((await reply.json()) as TextCommentLocation) : null;
}
</script>

<template>
    <section class="flex flex-col gap-3">
        <h2 class="text-heading">Comments</h2>
        <template v-for="item in comments.items" :key="item.comment.id">
            <CommentEntry :comment="item.comment">
                <SwitchCase :value="item.type">
                    <template #record>
                        <p class="text-small text-text-3">On the whole record</p>
                    </template>
                    <template #text>
                        <template v-if="item.type === 'text'">
                            <CommentPlace :anchor="item.anchor" @open="open(item.comment.id)" />
                        </template>
                    </template>
                </SwitchCase>
            </CommentEntry>
        </template>
        <template v-if="opened">
            <CommentSource :location="opened" @close="opened = null" />
        </template>
        <form class="flex flex-col gap-2" @submit.prevent="post">
            <template v-if="form.quote">
                <p class="text-small text-text-3">On version {{ form.version }}, lines {{ form.first_line }}–{{ form.last_line }}: “{{ form.quote }}”</p>
            </template>
            <template v-if="choosing">
                <textarea ref="source" class="input font-mono" rows="10" readonly :value="body" />
            </template>
            <textarea v-model="form.body" class="input" rows="3" placeholder="Write a comment" />
            <div class="flex gap-2">
                <template v-if="version">
                    <template v-if="choosing">
                        <Button @click="takeSelection">Use the selected text</Button>
                    </template>
                    <template v-else>
                        <Button @click="choosing = true">Choose text</Button>
                    </template>
                    <template v-if="form.quote">
                        <Button @click="aboutWholeRecord">About the whole record</Button>
                    </template>
                </template>
                <Button type="submit" variant="primary" :pending="form.processing" :disabled="form.processing">Post comment</Button>
            </div>
            <FormErrors :errors="form.errors" />
        </form>
    </section>
</template>
