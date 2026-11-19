<script setup lang="ts">
import { activate } from '@generated/routes/accounts';
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import { formSendingHooks } from '@kit/usePageChanges';

/**
 * Chooses the account for new launches of its program. Only a signed-in account can be chosen; the server decides
 * whether it still may be, and a refusal stays visible under the button.
 */
const props = defineProps<{ accountId: string; isSignedIn: boolean }>();

const form = useForm({});

function choose(): void {
    form.submit(activate({ account: props.accountId }), {
        preserveScroll: true,
        ...formSendingHooks(),
    });
}
</script>

<template>
    <div class="flex flex-col items-end gap-1">
        <Button
            variant="bordered"
            size="small"
            :pending="form.processing"
            :disabled="!isSignedIn"
            @click="choose"
            >Use for new launches</Button
        >
        <FormErrors :errors="form.errors" />
    </div>
</template>
