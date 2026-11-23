<script setup lang="ts">
import type { AccountListData } from '@generated/types/accounts';
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import { accounts } from '@generated/routes/accounts';
import AddAccountWizard from './AddAccountWizard.vue';
import type { WizardRequest } from './signIn';

/**
 * The Accounts layout's Add account action: the add-account wizard, open at once over the list, which goes back to
 * the plain list when it closes.
 */
const data = defineProps<AccountListData>();

const request = ref<WizardRequest | null>({ kind: 'new' });

function close(): void {
    request.value = null;
    router.visit(accounts().url);
}
</script>

<template>
    <AddAccountWizard
        :request="request"
        :methods="data.methods"
        :attempts="data.attempts"
        :rows="data.rows"
        @close="close"
    />
</template>
