<script setup lang="ts">
import type {
    AccountRowData,
    SignInMethodData,
} from '@generated/types/accounts';
import TextField from '@kit/TextField';
import { computed, onMounted } from 'vue';
import ChosenSignIn from './ChosenSignIn.vue';
import { useAccountNaming } from './accountNaming';

/**
 * The wizard's third step after a key or token works: it has no email to name the account by, so the account is
 * saved under a default name and the step asks for a better one, all of it selected so typing replaces it.
 */
const props = defineProps<{
    program: string;
    method: SignInMethodData;
    account: AccountRowData;
    formId: string;
}>();
const emit = defineEmits<{ named: [] }>();

const { naming, canSave, startFrom, save } = useAccountNaming(
    () => props.account,
);
const fieldId = computed(() => `new-account-name-${props.account.id}`);

onMounted(() =>
    startFrom(document.querySelector<HTMLInputElement>(`#${fieldId.value}`)),
);

function saveOrSkip(): void {
    if (!canSave.value) {
        emit('named');

        return;
    }

    save(() => emit('named'));
}
</script>

<template>
    <ChosenSignIn :program="program" :method="method" />
    <form
        :id="formId"
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
        <TextField
            :id="fieldId"
            v-model="naming.label"
            label="Name"
            :maxlength="80"
            :error="naming.errors.label"
            hint="You can change it later from the list."
        />
    </form>
</template>
