<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import CopyButton from "../kit/CopyButton.vue";
import FormField from "../kit/FormField.vue";
import ListBox from "../kit/ListBox.vue";
import TextInput from "../kit/TextInput.vue";
import "./team.css";

const email = ref("");
const busy = ref(false);
const failure = ref("");
const invitation = ref(null);
const who = computed(() => {
    const local = invitation.value ? invitation.value.email.split("@")[0].split(/[._-]/)[0] : "";
    return local ? local.charAt(0).toUpperCase() + local.slice(1) : "They";
});

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
</script>

<template>
    <ListBox title="Invite a person">
        <form class="team-block" @submit.prevent="invite">
            <FormField label="Email" for="team-invite">
                <div class="team-inline">
                    <TextInput id="team-invite" class="team-email" :value="email" type="email" placeholder="name@example.com" @input="email = $event.target.value" />
                    <Btn :busy="busy" @click="invite">Invite</Btn>
                </div>
            </FormField>
            <template v-if="failure">
                <p class="team-failure">{{ failure }}</p>
            </template>
            <template v-if="invitation">
                <FormField :label="`Join line for ${invitation.email}`" :help="`${who} runs it in a terminal, in a clone of this repository. The code works once.`">
                    <div class="team-command">
                        <code>{{ invitation.line }}</code>
                        <CopyButton :text="invitation.line" label="Copy" />
                    </div>
                </FormField>
            </template>
        </form>
    </ListBox>
</template>

<style scoped>
.team-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.team-email {
    flex: 1 1 220px;
}
</style>
