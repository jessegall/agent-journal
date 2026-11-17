<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import { formSendingHooks } from '@kit/usePageChanges';
import { approve, deny } from '@generated/routes/rules';

/**
 * Approves or denies the proposed rule the reader shows. A rule's text never changes after it is proposed, so the
 * text on screen is the text approved. The server decides whether it may still be reviewed; a rule settled meanwhile
 * comes back as an error that stays visible. Its parent keys it by rule, so another rule never shows this error.
 */
const props = defineProps<{ ruleId: string }>();

const form = useForm({});

function review(action: typeof approve): void {
    form.submit(action({ rule: Number(props.ruleId) }), {
        preserveScroll: true,
        ...formSendingHooks(),
    });
}
</script>

<template>
    <div class="flex flex-col items-end gap-2">
        <div class="flex items-center gap-2">
            <Button
                type="button"
                variant="bordered"
                :disabled="form.processing"
                @click="review(deny)"
                >Deny</Button
            >
            <Button
                type="button"
                variant="primary"
                :pending="form.processing"
                @click="review(approve)"
                >Approve</Button
            >
        </div>
        <FormErrors :errors="form.errors" />
    </div>
</template>
