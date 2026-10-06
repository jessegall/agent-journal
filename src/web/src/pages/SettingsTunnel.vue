<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import Btn from "../kit/Btn.vue";
import ListBox from "../kit/ListBox.vue";
import {checkTunnel, tunnelStatus} from "../composables/shares.js";
import TunnelLogin from "./TunnelLogin.vue";
import TunnelDomain from "./TunnelDomain.vue";
import TunlerVersion from "./TunlerVersion.vue";

const domains = ref([]);
const switching = ref(false);
const leaving = ref(false);
const failure = ref("");

async function load() {
    const status = await checkTunnel();
    domains.value = status && status.logged_in ? await api.tunnelDomains().catch(() => []) : [];
}

async function logOut() {
    leaving.value = true;
    failure.value = "";
    try {
        store.tunnel = await api.tunnelLogout();
        domains.value = [];
    } catch (e) {
        failure.value = e.message;
    } finally {
        leaving.value = false;
    }
}

function ready() {
    switching.value = false;
    load();
}

onMounted(load);
</script>

<template>
    <div class="tunnel-settings">
        <ListBox title="Connection">
            <div class="tunnel-state">
                <template v-if="!tunnelStatus">
                    <p class="tunnel-line">Checking…</p>
                </template>
                <template v-else-if="!tunnelStatus.installed">
                    <p class="tunnel-line">tunler isn't installed on this machine, so sharing and phones can't reach it.</p>
                </template>
                <template v-else-if="tunnelStatus.logged_in && !switching">
                    <p class="tunnel-line">
                        Connected as
                        <b>{{ tunnelStatus.account }}</b>
                        on
                        <b>{{ tunnelStatus.host }}</b>
                        . Every journal on this machine uses this login.
                    </p>
                    <div class="tunnel-actions">
                        <Btn small @click="switching = true">Use another account</Btn>
                        <Btn small :busy="leaving" @click="logOut">Log out</Btn>
                    </div>
                </template>
                <template v-else>
                    <p class="tunnel-line">
                        {{
                            switching
                                ? "Logging in with another account replaces the current login for every journal here. Each journal's address stays with the account that claimed it, so those addresses stop answering until you switch back with that account's password."
                                : "Not connected. Connect once, and every journal on this machine uses it."
                        }}
                    </p>
                    <TunnelLogin :host="tunnelStatus.host" @ready="ready" />
                    <template v-if="switching">
                        <Btn small @click="switching = false">Keep the current account</Btn>
                    </template>
                </template>
                <template v-if="failure">
                    <p class="tunnel-failure">{{ failure }}</p>
                </template>
            </div>
            <TunlerVersion />
        </ListBox>
        <template v-if="domains.length">
            <ListBox title="Domains this account owns" :count="domains.length">
                <template v-for="domain in domains" :key="domain">
                    <TunnelDomain :domain="domain" @released="(left) => (domains = left)" />
                </template>
            </ListBox>
        </template>
    </div>
</template>

<style scoped>
.tunnel-settings {
    display: flex;
    flex-direction: column;
    gap: 18px;
    max-width: 640px;
}

.tunnel-state {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px 16px;
}

.tunnel-line,
.tunnel-failure {
    margin: 0;
    line-height: 1.5;
    color: var(--text-2);
}

.tunnel-failure {
    color: var(--danger);
}

.tunnel-actions {
    display: flex;
    gap: 8px;
}

.tunnel-state > .btn {
    align-self: flex-start;
}
</style>
