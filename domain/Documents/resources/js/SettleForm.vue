<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import { formSendingHooks } from '@kit/usePageChanges';

/**
 * Settles a record as needing no more attention; the reason is required, and a document is settled at the
 * revision on screen.
 */
const props = defineProps<{ action: string; revision: string }>();

const form = useForm({ reason: '', revision: Number(props.revision) });

function settle(): void {
    form.post(props.action, { preserveScroll: true, onSuccess: () => form.reset('reason'), ...formSendingHooks() });
}
</script>

<template>
    <form class="flex gap-2" @submit.prevent="settle">
        <input v-model="form.reason" class="input flex-1" required maxlength="2000" placeholder="Why it needs no more attention" />
        <Button type="submit" :pending="form.processing" :disabled="form.processing || form.reason.trim() === ''">Settle</Button>
        <FormErrors :errors="form.errors" />
    </form>
</template>
