<script setup lang="ts">
import type { GatewayRevisionData, GatewaySettingsData } from '@/types/generated';
import { router, useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import PageHeader from '@kit/PageHeader';
import { ref } from 'vue';

/**
 * The owner's share gateways: each settings revision with why it is not ready, whether its endpoint answers and the
 * shares disabling it would revoke; a form to configure a gateway whose secrets are typed into password fields and
 * never shown again; and Offline when the sharing service is not running. Every write carries a new Idempotency-Key.
 */
const props = defineProps<{ data: GatewaySettingsData }>();

const form = useForm({
    gatewayKey: props.data.gatewayKeys[0] ?? '',
    executableVersion: '',
    providerHost: '',
    publicOrigin: 'https://',
    listenerPort: 8100,
    secrets: [{ name: '', value: '' }] as { name: string; value: string }[],
    makeDefault: false,
});

const confirmingDisable = ref<string | null>(null);

function configure(): void {
    form.transform((data) => ({ ...data, secrets: data.secrets.filter((secret) => secret.name !== '') })).post('/sharing/gateways', {
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        preserveScroll: true,
        onSuccess: () => form.secrets.forEach((secret) => (secret.value = '')),
    });
}

function addSecret(): void {
    form.secrets.push({ name: '', value: '' });
}

function makeDefault(revision: GatewayRevisionData): void {
    router.post(`/sharing/gateways/${revision.id}/default`, {}, { headers: { 'Idempotency-Key': crypto.randomUUID() }, preserveScroll: true });
}

function disable(revision: GatewayRevisionData): void {
    confirmingDisable.value = null;
    router.delete(`/sharing/gateways/${revision.id}`, { headers: { 'Idempotency-Key': crypto.randomUUID() }, preserveScroll: true });
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <PageHeader title="Share gateways" />
        <p v-if="data.isOffline" role="status">Offline: start the sharing service.</p>
        <section class="flex flex-col gap-1" aria-label="Before you choose a gateway">
            <p>The gateway provider can see the public address and everything a share shows.</p>
            <p>Turning off traffic inspection does not hide the content from the provider.</p>
        </section>
        <section class="flex flex-col gap-3" aria-label="Gateways">
            <p v-if="data.revisions.length === 0">No gateway is configured yet.</p>
            <article v-for="revision in data.revisions" :key="revision.id" class="flex flex-col gap-1">
                <h2>{{ revision.gatewayKey }} version {{ revision.version }}<span v-if="revision.isDefault"> (default)</span><span v-if="revision.isDisabled"> (disabled)</span></h2>
                <p>{{ revision.publicOrigin }} through {{ revision.providerHost }}, program {{ revision.executableVersion }}</p>
                <p v-if="revision.secretReferences.length > 0">Secrets: {{ revision.secretReferences.join(', ') }}</p>
                <ul v-if="revision.readinessProblems.length > 0" aria-label="Not ready because">
                    <li v-for="problem in revision.readinessProblems" :key="problem">{{ problem }}</li>
                </ul>
                <p v-else-if="!revision.isDisabled">Ready.</p>
                <p v-if="revision.isHealthy !== null">{{ revision.isHealthy ? 'Answering.' : 'Not answering health checks.' }}</p>
                <div v-if="!revision.isDisabled" class="flex gap-2">
                    <Button v-if="!revision.isDefault" type="button" @click="makeDefault(revision)">Make default</Button>
                    <Button type="button" @click="confirmingDisable = revision.id">Disable</Button>
                </div>
                <div v-if="confirmingDisable === revision.id" class="flex flex-col gap-1" role="alertdialog" aria-label="Confirm disabling">
                    <p v-if="revision.dependentShares.length === 0">No share uses this gateway.</p>
                    <template v-else>
                        <p>Disabling revokes these shares:</p>
                        <ul>
                            <li v-for="share in revision.dependentShares" :key="share.id">Share {{ share.number }} ({{ share.state }})</li>
                        </ul>
                    </template>
                    <div class="flex gap-2">
                        <Button type="button" @click="disable(revision)">Disable and revoke</Button>
                        <Button type="button" @click="confirmingDisable = null">Keep it</Button>
                    </div>
                </div>
            </article>
        </section>
        <form class="flex flex-col gap-2" aria-label="Configure a gateway" @submit.prevent="configure">
            <label class="flex flex-col">
                <span>Gateway</span>
                <select v-model="form.gatewayKey">
                    <option v-for="key in data.gatewayKeys" :key="key" :value="key">{{ key }}</option>
                </select>
            </label>
            <label class="flex flex-col"><span>Program version</span><input v-model="form.executableVersion" type="text" /></label>
            <label class="flex flex-col"><span>Provider host</span><input v-model="form.providerHost" type="text" /></label>
            <label class="flex flex-col"><span>Fixed public address</span><input v-model="form.publicOrigin" type="url" /></label>
            <label class="flex flex-col"><span>Listener port</span><input v-model.number="form.listenerPort" type="number" /></label>
            <fieldset class="flex flex-col gap-1">
                <legend>Secrets</legend>
                <div v-for="(secret, index) in form.secrets" :key="index" class="flex gap-2">
                    <input v-model="secret.name" type="text" placeholder="Name" />
                    <input v-model="secret.value" type="password" autocomplete="new-password" placeholder="Leave blank to keep the stored one" />
                </div>
                <Button type="button" @click="addSecret">Add a secret</Button>
            </fieldset>
            <label class="flex items-center gap-2"><input v-model="form.makeDefault" type="checkbox" /><span>Make it the default once it is ready</span></label>
            <Button type="submit" :disabled="form.processing">Save gateway</Button>
            <FormErrors :errors="form.errors" />
        </form>
    </div>
</template>
