<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import type { DraftView } from '@generated/types/documents';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import { formSendingHooks } from '@kit/usePageChanges';

/**
 * A user recovers someone else's held draft: it shows who holds it, when it was last saved and the text that will
 * be kept, and closes it at the version shown with a required reason.
 */
const props = defineProps<{
    number: string;
    holder: string;
    held: DraftView;
}>();

const form = useForm({
    token: props.held.token,
    version: props.held.version,
    reason: '',
});

function recover(): void {
    form.post(`/documents/docs/${props.number}/recover`, {
        preserveScroll: true,
        ...formSendingHooks(),
    });
}
</script>

<template>
    <form class="flex flex-col gap-2" @submit.prevent="recover">
        <p class="text-text-3">
            {{ holder }} holds a draft at version {{ held.version }}, last saved
            {{ held.savedAt }}. Recovering keeps this text:
        </p>
        <pre class="input font-mono whitespace-pre-wrap">{{ held.body }}</pre>
        <input
            v-model="form.reason"
            class="input"
            required
            maxlength="2000"
            placeholder="Why you close this draft"
        />
        <Button
            type="submit"
            variant="primary"
            :pending="form.processing"
            :disabled="form.processing || form.reason.trim() === ''"
            >Recover</Button
        >
        <FormErrors :errors="form.errors" />
    </form>
</template>
