<script setup lang="ts">
import Input from '@kit/Input';
import type { GatewayConfigurePartData } from '@generated/types/sharing';
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import Select from '@kit/Select';

/**
 * The form that configures a share gateway, a native part of the gateway settings: its secrets are typed into
 * password fields, as many as are needed, and never shown again; each save carries a new Idempotency-Key, and a
 * refused save keeps what was typed except the secret values.
 */
const props = defineProps<GatewayConfigurePartData>();

const form = useForm({
    gatewayKey: props.gatewayKeys[0] ?? '',
    executableVersion: '',
    providerHost: '',
    publicOrigin: 'https://',
    listenerPort: 8100,
    secrets: [{ name: '', value: '' }] as { name: string; value: string }[],
    makeDefault: false,
});

function configure(): void {
    form.transform((data) => ({
        ...data,
        secrets: data.secrets.filter((secret) => secret.name !== ''),
    })).post('/sharing/gateways', {
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        preserveScroll: true,
        onSuccess: () => form.secrets.forEach((secret) => (secret.value = '')),
    });
}

function addSecret(): void {
    form.secrets.push({ name: '', value: '' });
}
</script>

<template>
    <form
        class="flex flex-col gap-2"
        aria-label="Configure a gateway"
        @submit.prevent="configure"
    >
        <label class="flex flex-col">
            <span>Gateway</span>
            <Select v-model="form.gatewayKey" :options="gatewayKeys.map((key) => ({ value: key, label: key }))" />
        </label>
        <label class="flex flex-col"
            ><span>Program version</span
            ><Input v-model="form.executableVersion"
        /></label>
        <label class="flex flex-col"
            ><span>Provider host</span
            ><Input v-model="form.providerHost"
        /></label>
        <label class="flex flex-col"
            ><span>Fixed public address</span
            ><Input v-model="form.publicOrigin" type="url"
        /></label>
        <label class="flex flex-col"
            ><span>Listener port</span
            ><input v-model.number="form.listenerPort" type="number"
        /></label>
        <fieldset class="flex flex-col gap-1">
            <legend>Secrets</legend>
            <template v-for="(secret, index) in form.secrets" :key="index">
                <div class="flex gap-2">
                    <Input
                        v-model="secret.name"
                       
                        placeholder="Name"
                    />
                    <Input
                        v-model="secret.value"
                        type="password"
                        autocomplete="new-password"
                        placeholder="Leave blank to keep the stored one"
                    />
                </div>
            </template>
            <Button type="button" @click="addSecret">Add a secret</Button>
        </fieldset>
        <label class="flex items-center gap-2"
            ><input v-model="form.makeDefault" type="checkbox" /><span
                >Make it the default once it is ready</span
            ></label
        >
        <Button type="submit" :disabled="form.processing"
            >Save gateway</Button
        >
        <FormErrors :errors="form.errors" />
    </form>
</template>
