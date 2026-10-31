<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import {useAttempt} from "../composables/attempt.js";
import Btn from "../kit/Btn.vue";
import FormField from "../kit/FormField.vue";
import TextInput from "../kit/TextInput.vue";

const emit = defineEmits(["connected"]);
const {busy, failure, attempt} = useAttempt();
const form = ref({url: "", email: "", name: "", password: "", team: ""});

async function connect() {
    const {done, got} = await attempt(() => api.connectTeam(form.value));
    if (!done) return;
    form.value = {url: "", email: "", name: "", password: "", team: ""};
    emit("connected", got.team);
}
</script>

<template>
    <form class="team-block" @submit.prevent="connect">
        <h2 class="team-section">Connect to a team</h2>
        <p class="team-plain">A new server's address makes you its admin; an invitation URL makes you a member; your account on a server logs you in.</p>
        <FormField label="Server address or invitation URL">
            <TextInput v-model="form.url" placeholder="https://team.example.com" />
        </FormField>
        <FormField label="Name of the team in this journal" help="Left empty, the server's host name is used.">
            <TextInput v-model="form.team" />
        </FormField>
        <FormField label="Your email">
            <TextInput v-model="form.email" placeholder="you@example.com" />
        </FormField>
        <FormField label="Your name, as the team sees it">
            <TextInput v-model="form.name" />
        </FormField>
        <FormField label="Your password">
            <TextInput v-model="form.password" type="password" />
        </FormField>
        <template v-if="failure">
            <p class="team-failure">{{ failure }}</p>
        </template>
        <div class="team-choices">
            <Btn kind="primary" :busy="busy" @click="connect">Connect to the team</Btn>
            <slot />
        </div>
    </form>
</template>
