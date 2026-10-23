<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import FormField from "../kit/FormField.vue";
import ListBox from "../kit/ListBox.vue";
import TextInput from "../kit/TextInput.vue";
import {choose} from "../state/environment.js";
import "./team.css";

const emit = defineEmits(["joined"]);
const address = ref("");
const code = ref("");
const fingerprint = ref("");
const name = ref("");
const password = ref("");
const busy = ref(false);
const failure = ref("");
// a server on a bare IP address serves its own certificate, which the join checks against the fingerprint in its line
const bareAddress = computed(() => /^https?:\/\/[0-9.]+(:[0-9]+)?\/?$/.test(address.value.trim()));

async function join() {
    busy.value = true;
    failure.value = "";
    try {
        const got = await api.joinTeam({address: address.value, code: code.value, fingerprint: fingerprint.value, name: name.value, password: password.value});
        password.value = "";
        choose(got.environment);
        emit("joined", got.outcome);
    } catch (e) {
        failure.value = e.message;
    } finally {
        busy.value = false;
    }
}
</script>

<template>
    <ListBox title="Team server">
        <form class="team-block" @submit.prevent="join">
            <FormField label="Address" for="team-address" help="The address in the line the setup or an invitation printed.">
                <TextInput id="team-address" :value="address" placeholder="https://team.example.com" @input="address = $event.target.value" />
            </FormField>
            <div class="team-pair">
                <FormField label="Code" for="team-code">
                    <TextInput id="team-code" :value="code" autocomplete="off" @input="code = $event.target.value" />
                </FormField>
            </div>
            <template v-if="bareAddress">
                <FormField label="Fingerprint" for="team-fingerprint" help="A server on a bare IP address uses its own certificate. Its fingerprint is in the same line.">
                    <TextInput id="team-fingerprint" class="team-mono" :value="fingerprint" autocomplete="off" @input="fingerprint = $event.target.value" />
                </FormField>
            </template>
            <div class="team-pair">
                <FormField label="Name" for="team-name" help="Left empty, git's user.name.">
                    <TextInput id="team-name" :value="name" autocomplete="name" @input="name = $event.target.value" />
                </FormField>
                <FormField label="Password" for="team-password" help="At least 10 characters for a new account, or your account's password.">
                    <TextInput id="team-password" :value="password" type="password" autocomplete="current-password" @input="password = $event.target.value" />
                </FormField>
            </div>
            <template v-if="failure">
                <p class="team-failure">{{ failure }}</p>
            </template>
            <Btn kind="primary" :busy="busy" @click="join">Connect</Btn>
            <p class="team-fine">
                The first journal to connect becomes the team's: everything in it, files too, is uploaded. Every journal after it downloads the team's copy
                and keeps what it held before in a backup file.
            </p>
        </form>
    </ListBox>
</template>

<style scoped>
.team-pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.team-mono {
    font-family: var(--mono);
}

@media (max-width: 600px) {
    .team-pair {
        grid-template-columns: 1fr;
    }
}
</style>
