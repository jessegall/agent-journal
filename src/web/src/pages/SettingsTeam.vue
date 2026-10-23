<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import FormField from "../kit/FormField.vue";
import TextInput from "../kit/TextInput.vue";
import {colleaguesEnvironments} from "../domain/people.js";
import {href} from "../route.js";
import {choose} from "../state/environment.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";

const standing = ref(null);
const colleagues = computed(() => colleaguesEnvironments(rows("environments"), store.people));
const address = ref("");
const code = ref("");
const name = ref("");
const password = ref("");
const fingerprint = ref("");
const email = ref("");
const busy = ref(false);
const failure = ref("");
const outcome = ref("");
const invitation = ref(null);
// a server on a bare address serves its own certificate, which the join checks against the fingerprint its line carries
const bareAddress = computed(() => /^https?:\/\/[0-9.]+(:[0-9]+)?\/?$/.test(address.value.trim()));

async function load() {
    standing.value = await api.team();
}

async function join() {
    busy.value = true;
    failure.value = "";
    try {
        const got = await api.joinTeam({address: address.value, code: code.value, name: name.value, password: password.value, fingerprint: fingerprint.value});
        password.value = "";
        outcome.value = got.outcome;
        await load();
    } catch (e) {
        failure.value = e.message;
    } finally {
        busy.value = false;
    }
}

async function invite() {
    busy.value = true;
    failure.value = "";
    try {
        invitation.value = await api.inviteToTeam(email.value);
        email.value = "";
    } catch (e) {
        failure.value = e.message;
    } finally {
        busy.value = false;
    }
}

onMounted(load);
</script>

<template>
    <div class="team-pane">
        <template v-if="standing && !standing.joined">
            <form class="team-form" @submit.prevent="join">
                <FormField label="Team server address" for="team-address" help="From the line the setup or an invitation printed.">
                    <TextInput id="team-address" :value="address" placeholder="https://team.example.com" @input="address = $event.target.value" />
                </FormField>
                <FormField label="Code" for="team-code">
                    <TextInput id="team-code" :value="code" autocomplete="off" @input="code = $event.target.value" />
                </FormField>
                <template v-if="bareAddress">
                    <FormField label="Fingerprint" for="team-fingerprint" help="The server on a bare address serves its own certificate; its fingerprint is in the line.">
                        <TextInput id="team-fingerprint" :value="fingerprint" autocomplete="off" @input="fingerprint = $event.target.value" />
                    </FormField>
                </template>
                <FormField label="Your name" for="team-name" help="Left empty, git's user.name.">
                    <TextInput id="team-name" :value="name" autocomplete="name" @input="name = $event.target.value" />
                </FormField>
                <FormField label="Password" for="team-password" help="A new account's password, at least 10 characters, or the one your account has.">
                    <TextInput id="team-password" :value="password" type="password" autocomplete="current-password" @input="password = $event.target.value" />
                </FormField>
                <template v-if="failure">
                    <p class="team-failure">{{ failure }}</p>
                </template>
                <Btn kind="primary" :busy="busy" @click="join">Connect</Btn>
                <p class="team-fine">
                    The first journal to connect to a team server becomes the team's: its rows and files are uploaded. Every journal after it
                    downloads the team's copy, and what it held before is kept in a backup file.
                </p>
            </form>
        </template>
        <template v-else-if="standing">
            <template v-if="outcome">
                <p class="team-outcome">{{ outcome }}</p>
            </template>
            <dl class="team-standing">
                <dt>Team server</dt>
                <dd>{{ standing.address }}</dd>
                <dt>Sync</dt>
                <dd>{{ standing.line }}</dd>
                <dt>Team's version</dt>
                <dd>{{ standing.version || "not known yet" }}</dd>
            </dl>
            <template v-if="colleagues.length">
                <section class="team-people">
                    <h3 class="team-heading">Your colleagues' environments</h3>
                    <template v-for="person in colleagues" :key="person.id">
                        <p class="team-person">{{ person.name }}</p>
                        <template v-for="environment in person.environments" :key="environment.id">
                            <a class="team-environment" :href="href.page()" @click="choose(environment.name)">{{ environment.name }}</a>
                        </template>
                    </template>
                </section>
            </template>
            <form class="team-form" @submit.prevent="invite">
                <FormField label="Invite a person" for="team-invite" help="Admins only: the line they join with comes back here.">
                    <TextInput id="team-invite" :value="email" type="email" placeholder="name@example.com" @input="email = $event.target.value" />
                </FormField>
                <template v-if="failure">
                    <p class="team-failure">{{ failure }}</p>
                </template>
                <Btn :busy="busy" @click="invite">Invite</Btn>
                <template v-if="invitation">
                    <p class="team-fine">{{ invitation.email }} joins with:</p>
                    <code class="team-line">{{ invitation.line }}</code>
                </template>
            </form>
        </template>
    </div>
</template>

<style scoped>
.team-pane {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 560px;
}

.team-form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
}

.team-form .btn {
    align-self: flex-start;
}

.team-standing {
    display: grid;
    gap: 4px;
    margin: 0;
}

.team-standing dt {
    color: var(--text-3);
    font-size: 12px;
}

.team-standing dd {
    margin: 0 0 8px;
}

.team-people {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.team-heading {
    margin: 0 0 4px;
    font-size: 13px;
    font-weight: 600;
}

.team-person {
    margin: 8px 0 0;
    color: var(--text-3);
    font-size: 12px;
}

.team-environment {
    color: var(--text);
}

.team-outcome,
.team-fine,
.team-failure {
    margin: 0;
    line-height: 1.45;
}

.team-outcome {
    color: var(--text-2);
}

.team-fine {
    color: var(--text-3);
    font-size: 12px;
}

.team-failure {
    color: var(--danger);
}

.team-line {
    display: block;
    padding: 8px 10px;
    border-radius: 6px;
    background: var(--bg-2);
    font-size: 12px;
    overflow-wrap: anywhere;
}
</style>
