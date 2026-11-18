<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3';
import type { CommentCard } from '@generated/types/documents';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import { formSendingHooks } from '@kit/usePageChanges';

/**
 * The comments on a record, oldest first, and the form that posts one: in general, or on the text selected in the
 * record's current revision, which is sent with its revision and its place in the raw text for the server to check.
 */
const props = defineProps<{
    comments: CommentCard[];
    action: string;
    body: string;
    revision?: string;
    revisionPath?: string;
}>();

const form = useForm({
    body: '',
    revision: null as number | null,
    quote: '',
    first_line: null as number | null,
    last_line: null as number | null,
    start_offset: null as number | null,
    end_offset: null as number | null,
});

const bytes = new TextEncoder();

function takeSelection(): void {
    const quote = window.getSelection()?.toString() ?? '';
    const at = quote === '' || props.revision === undefined ? -1 : props.body.indexOf(quote);

    if (at === -1) {
        form.quote = '';

        return;
    }

    const lineStart = props.body.lastIndexOf('\n', at - 1) + 1;
    const firstLine = props.body.slice(0, at).split('\n').length;
    const startOffset = bytes.encode(props.body.slice(lineStart, at)).length;

    form.revision = Number(props.revision);
    form.quote = quote;
    form.first_line = firstLine;
    form.last_line = firstLine + quote.split('\n').length - 1;
    form.start_offset = startOffset;
    form.end_offset = startOffset + bytes.encode(quote).length;
}

function post(): void {
    const sending = formSendingHooks();

    form.transform((fields) => (fields.quote === '' ? { body: fields.body } : fields)).post(props.action, {
        preserveScroll: true,
        onSuccess: () => form.reset(),
        onStart: sending.onStart,
        onFinish: () => {
            sending.onFinish();

            if (!form.wasSuccessful && !form.hasErrors) {
                router.reload();
            }
        },
    });
}
</script>

<template>
    <section class="flex flex-col gap-3">
        <h2 class="text-heading">Comments</h2>
        <template v-for="comment in comments" :key="comment.id">
            <article class="flex flex-col gap-1">
                <p class="text-small text-text-3">user {{ comment.authorId }} · {{ comment.createdAt }}</p>
                <template v-if="comment.revision && revisionPath">
                    <a class="text-small" :href="`${revisionPath}/${comment.revision}?quote=${encodeURIComponent(comment.quote ?? '')}`">
                        On revision {{ comment.revision }}: “{{ comment.quote }}”
                    </a>
                </template>
                <div class="prose" v-html="comment.bodyHtml" />
            </article>
        </template>
        <form class="flex flex-col gap-2" @submit.prevent="post">
            <template v-if="form.quote">
                <p class="text-small text-text-3">On revision {{ form.revision }}: “{{ form.quote }}”</p>
            </template>
            <textarea v-model="form.body" class="input" rows="3" placeholder="Write a comment" />
            <div class="flex gap-2">
                <template v-if="revision">
                    <Button @click="takeSelection">Comment on selected text</Button>
                </template>
                <Button type="submit" variant="primary" :pending="form.processing" :disabled="form.processing">Post comment</Button>
            </div>
            <FormErrors :errors="form.errors" />
        </form>
    </section>
</template>
