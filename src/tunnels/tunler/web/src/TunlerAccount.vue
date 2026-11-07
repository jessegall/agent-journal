<script setup>
import {ref} from "vue";
import {Btn, Skeleton, WindowRoom, useWindow} from "@journal/window-kit";
import TunlerDomain from "./TunlerDomain.vue";
import TunlerLoginForm from "./TunlerLoginForm.vue";

const SUBDOMAIN_SETTING = "journal.tunnels.tunler.subdomain";
const SERVICE_SETTING = "journal.core.tunnel.service";

const context = useWindow();
const status = ref(null);
const version = ref(null);
const domains = ref([]);
const failure = ref("");
const switching = ref(false);
const server = ref("");
const subdomain = ref("");

async function load() {
    const [statusAnswer, versionAnswer, domainsAnswer] = await Promise.all([context.read("tunler status"), context.read("tunler version"), context.read("tunler domains")]);
    failure.value = statusAnswer.ok ? "" : statusAnswer.error;
    status.value = statusAnswer.ok ? statusAnswer.value : null;
    version.value = versionAnswer.ok ? versionAnswer.value : null;
    domains.value = domainsAnswer.ok ? domainsAnswer.value.domains : [];
    subdomain.value = status.value?.subdomain ?? "";
}

async function run(...lines) {
    for (const line of lines) {
        const result = await context.run(line);
        failure.value = result.ok ? "" : result.error;
        if (!result.ok) break;
    }
    await load();
}

const setting = (key, value) => ["setting", "set", key, value, "--project"];
const useTunler = () => run(setting(SUBDOMAIN_SETTING, subdomain.value.trim()), setting(SERVICE_SETTING, "tunler"));

function ready() {
    switching.value = false;
    load();
}

load();
</script>

<template>
    <WindowRoom>
        <div class="account" data-tunler>
            <template v-if="failure">
                <p class="failure" role="alert" data-tunler-failure>{{ failure }}</p>
            </template>
            <template v-if="!status">
                <template v-if="!failure">
                    <Skeleton shape="text" />
                </template>
            </template>
            <template v-else>
                <section class="part">
                    <h3>Connection</h3>
                    <template v-if="!status.installed">
                        <p class="line">tunler isn't installed on this machine, so sharing and phones can't reach it.</p>
                        <form class="row" data-tunler-install @submit.prevent="run(['tunler', 'install', server.trim()])">
                            <input v-model="server" placeholder="tunler.example.com" aria-label="Tunler server address">
                            <Btn small variant="primary" type="submit">Install tunler</Btn>
                        </form>
                    </template>
                    <template v-else-if="status.authenticated && !switching">
                        <p class="line" data-tunler-account>Connected as <b>{{ status.account }}</b> on <b>{{ status.host }}</b>. Every journal on this machine uses this login.</p>
                        <p class="line">tunler is installed at <code>{{ status.command }}</code></p>
                        <div class="row">
                            <Btn small data-tunler-switch @click="switching = true">Use another account</Btn>
                            <Btn small data-tunler-logout @click="run(['tunler', 'logout'])">Log out</Btn>
                        </div>
                    </template>
                    <template v-else>
                        <template v-if="switching">
                            <p class="line">Logging in with another account replaces the current login for every journal here. Each journal's address stays with the account that claimed it, so those addresses stop answering until you switch back with that account's password.</p>
                        </template>
                        <template v-else-if="status.rejected">
                            <p class="line" data-tunler-rejected>The tunler server no longer accepts the saved login. Log in again.</p>
                        </template>
                        <template v-else>
                            <p class="line">No account is connected here. Log in once, and every journal on this machine uses that account.</p>
                        </template>
                        <TunlerLoginForm :host="status.host ?? ''" @ready="ready" />
                        <template v-if="switching">
                            <div class="row">
                                <Btn small @click="switching = false">Keep the current account</Btn>
                            </div>
                        </template>
                    </template>
                    <template v-if="version?.current">
                        <div class="row" data-tunler-version>
                            <span class="line">tunler {{ version.current }}</span>
                            <template v-if="version.update_available">
                                <span class="fine">{{ version.latest }} is available</span>
                                <Btn small variant="primary" data-tunler-update @click="run(['tunler', 'update'])">Update tunler</Btn>
                            </template>
                            <template v-else>
                                <span class="fine">up to date</span>
                            </template>
                        </div>
                    </template>
                </section>
                <template v-if="status.authenticated">
                    <section class="part">
                        <h3>This journal</h3>
                        <p class="line" data-tunler-in-use>{{ status.is_used ? "Phones and share links reach this journal through tunler." : "This journal doesn't use tunler yet." }}</p>
                        <form class="row" data-tunler-use @submit.prevent="useTunler">
                            <input v-model="subdomain" placeholder="The name in front of the server's address" aria-label="Subdomain">
                            <Btn small variant="primary" type="submit" :disabled="!subdomain.trim()">{{ status.is_used ? "Save" : "Use tunler" }}</Btn>
                            <template v-if="status.is_used">
                                <Btn small data-tunler-stop @click="run(setting(SERVICE_SETTING, 'none'))">Stop using tunler</Btn>
                            </template>
                        </form>
                    </section>
                </template>
                <template v-if="domains.length">
                    <section class="part">
                        <h3>Domains</h3>
                        <template v-for="domain in domains" :key="domain.name">
                            <TunlerDomain :domain="domain" @run="run(...$event)" />
                        </template>
                    </section>
                </template>
            </template>
        </div>
    </WindowRoom>
</template>

<style scoped>
.account {
    display: flex;
    flex-direction: column;
    gap: 18px;
    max-width: 640px;
}

.part {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
}

.line {
    margin: 0;
    color: var(--text-2);
    line-height: 1.5;
}

.fine {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.failure {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}

.row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}

input {
    flex: 1;
    min-width: 0;
    padding: 4px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    color: inherit;
    font-size: 13px;
}
</style>
