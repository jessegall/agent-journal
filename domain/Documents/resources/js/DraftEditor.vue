<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3';
import { onBeforeUnmount, onMounted } from 'vue';
import type { DraftView } from '@generated/types/documents';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import { formSendingHooks } from '@kit/usePageChanges';

/**
 * The editor of the viewer's own draft. A refused save keeps the unsent text here and offers to reload or copy it; it
 * never merges or overwrites. Leaving with unsent text asks first.
 */
const props = defineProps<{ number: string; draft: DraftView }>();

const form = useForm({
    token: props.draft.token,
    version: props.draft.version,
    title: props.draft.title,
    abstract: props.draft.abstract,
    body: props.draft.body,
});

const base = `/documents/docs/${props.number}`;

function save(): void {
    form.post(`${base}/save`, {
        preserveScroll: true,
        onSuccess: () => form.defaults(),
        ...formSendingHooks(),
    });
}

function close(): void {
    router.post(`${base}/close`, { token: form.token, version: form.version }, { preserveScroll: true, ...formSendingHooks() });
}

function refresh(): void {
    router.reload();
}

function copy(): void {
    void navigator.clipboard.writeText(form.body);
}

function warnBeforeUnload(event: BeforeUnloadEvent): void {
    if (form.isDirty) {
        event.preventDefault();
    }
}

let stopListening: () => void = () => {};

onMounted(() => {
    window.addEventListener('beforeunload', warnBeforeUnload);
    stopListening = router.on('before', (event) => {
        const leavesThePage = event.detail.visit.method === 'get';

        return !(leavesThePage && form.isDirty) || window.confirm('Your draft has unsaved text. Leave and discard it?');
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', warnBeforeUnload);
    stopListening();
});
</script>

<template>
    <form class="flex flex-col gap-2" @submit.prevent="save">
        <p class="text-text-3">
            Your draft, version {{ draft.version }}, from revision {{ draft.baseRevisionNumber }}.
        </p>
        <input v-model="form.title" class="input" placeholder="Title" />
        <input v-model="form.abstract" class="input" placeholder="One line saying what it is" />
        <textarea v-model="form.body" class="input font-mono" rows="16" />
        <div class="flex gap-2">
            <Button type="submit" variant="primary" :pending="form.processing" :disabled="form.processing">Save</Button>
            <Button :disabled="form.processing || form.isDirty" @click="close">Close</Button>
        </div>
        <template v-if="form.hasErrors">
            <div class="flex gap-2">
                <Button @click="refresh">Refresh</Button>
                <Button @click="copy">Copy my text</Button>
            </div>
        </template>
        <FormErrors :errors="form.errors" />
    </form>
</template>
