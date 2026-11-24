<script setup lang="ts">
import type {
    AccountRowData,
    SignInMethodData,
} from '@generated/types/accounts';
import Field from '@kit/Field';
import { nextTick, onMounted, ref, useId } from 'vue';
import ChosenSignIn from './ChosenSignIn.vue';
import { useAccountNaming } from './accountNaming';

/**
 * The wizard's third step after a key or token works: it has no email to name the account by, so the account is
 * saved under a default name and the step asks for a better one, all of it selected so typing replaces it.
 */
const props = defineProps<{
    driver: string;
    method: SignInMethodData;
    account: AccountRowData;
    formId: string;
    // The name an agent's draft chose, put in the field in place of the default.
    suggestedName?: string;
}>();
const emit = defineEmits<{ named: [] }>();

const { naming, refusal, canSave, startFrom, save } = useAccountNaming(
    () => props.account,
);
// Ids per mount, so the same account named in two windows keeps two fields; focus goes through this form only.
const fieldId = `new-account-name-${useId()}`;
const form = ref<HTMLFormElement | null>(null);

onMounted(async () => {
    const field = form.value?.querySelector<HTMLInputElement>('input') ?? null;
    startFrom(field);

    if (props.suggestedName !== undefined) {
        naming.label = props.suggestedName;
        await nextTick();
        field?.select();
    }
});

function saveOrSkip(): void {
    if (!canSave.value) {
        emit('named');

        return;
    }

    save(() => emit('named'));
}
</script>

<template>
    <ChosenSignIn :driver="driver" :method="method" />
    <form
        :id="formId"
        ref="form"
        class="flex flex-1 flex-col gap-3"
        @submit.prevent="saveOrSkip"
    >
        <p class="text-field text-brand-text" data-mark="done">
            ✓ {{ method.title }} works.
        </p>
        <div class="flex flex-col gap-1">
            <h4 class="font-semibold text-card text-text">Name this account</h4>
            <p class="text-field text-text-2">
                It has no email, so give it a name you'll recognise.
            </p>
        </div>
        <Field
            :id="fieldId"
            v-model="naming.label"
            label="Name"
            :maxlength="80"
            :error="refusal"
            hint="You can change it later from the list."
        />
    </form>
</template>
