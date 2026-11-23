<script setup lang="ts">
import Input from '@/components/kit/Input.vue';
import Textarea from '@/components/kit/Textarea.vue';
import { router, useForm } from '@inertiajs/vue3';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { DraftEditorPartData } from '@generated/types/documents';
import { useHostProp } from '@kit/hostProp';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import { formSendingHooks } from '@kit/usePageChanges';
import { useWindowParam } from '@kit/useWindowQuery';

/**
 * The editor of the viewer's own draft, a native part that stays mounted across the document's tabs. A refused save
 * keeps the unsent text here and offers to reload or copy it; it never merges or overwrites. A refresh with the same
 * token keeps unsent text and shows a newer version as a conflict; a new token starts from the new draft. Leaving with
 * unsent text asks first, but only for a visit that would dispose this editor: a tab change of this window or a read
 * of another pane leaves it alone.
 */
const props = defineProps<DraftEditorPartData>();

const form = useForm({
    token: props.draft.token,
    version: props.draft.version,
    title: props.draft.title,
    abstract: props.draft.abstract,
    body: props.draft.body,
});

const isConflicted = ref(false);
const takesNextDraft = ref(false);
const hostProp = useHostProp();
const windowParam = useWindowParam();
const base = `/documents/docs/${props.number}`;

watch(
    () => props.draft,
    (draft) => {
        if (draft.token !== form.token || !form.isDirty || takesNextDraft.value) {
            form.defaults({
                token: draft.token,
                version: draft.version,
                title: draft.title,
                abstract: draft.abstract,
                body: draft.body,
            });
            form.reset();
            isConflicted.value = false;
            takesNextDraft.value = false;

            return;
        }

        isConflicted.value = draft.version !== form.version;
    },
);

function save(): void {
    form.post(`${base}/save`, {
        preserveScroll: true,
        onSuccess: () => form.defaults(),
        ...formSendingHooks(),
    });
}

function close(): void {
    router.post(
        `${base}/close`,
        { token: form.token, version: form.version },
        { preserveScroll: true, ...formSendingHooks() },
    );
}

function refresh(): void {
    takesNextDraft.value = true;
    router.reload({ only: [hostProp] });
}

function copy(): void {
    void navigator.clipboard.writeText(form.body);
}

/**
 * The address without this window's tab, so a tab change compares equal to staying.
 */
function withoutTab(address: URL): string {
    const kept = new URL(address.href);
    kept.searchParams.delete(windowParam('tab'));

    return `${kept.pathname}?${kept.searchParams.toString()}`;
}

function disposesThisEditor(visit: { method: string; url: URL; only: string[] }): boolean {
    if (visit.method !== 'get') {
        return false;
    }

    if (visit.only.length > 0 && !visit.only.includes(hostProp)) {
        return false;
    }

    return withoutTab(visit.url) !== withoutTab(new URL(window.location.href));
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
        if (!form.isDirty || !disposesThisEditor(event.detail.visit)) {
            return true;
        }

        return window.confirm(
            'Your draft has unsaved text. Leave and discard it?',
        );
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
            Your draft, version {{ draft.version }}, from revision
            {{ draft.baseRevisionNumber }}.
        </p>
        <template v-if="isConflicted">
            <p role="alert" class="text-warn">
                A newer version of this draft was saved elsewhere. Your text
                here is kept: copy it, then refresh to see the newer one.
            </p>
        </template>
        <Input
            v-model="form.title"
           
            aria-label="Title"
            placeholder="Title"
        />
        <Input
            v-model="form.abstract"
           
            aria-label="Abstract"
            placeholder="One line saying what it is"
        />
        <Textarea
            v-model="form.body"
            class="font-mono"
            aria-label="Text"
            :rows="16"
        />
        <div class="flex gap-2">
            <Button
                type="submit"
                variant="primary"
                :pending="form.processing"
                :disabled="form.processing || isConflicted"
                >Save</Button
            >
            <Button :disabled="form.processing || form.isDirty" @click="close"
                >Close</Button
            >
        </div>
        <template v-if="form.hasErrors || isConflicted">
            <div class="flex gap-2">
                <Button @click="refresh">Refresh</Button>
                <Button @click="copy">Copy my text</Button>
            </div>
        </template>
        <FormErrors :errors="form.errors" />
    </form>
</template>
