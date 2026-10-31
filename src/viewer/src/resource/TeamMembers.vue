<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {useAttempt} from "../composables/attempt.js";
import Btn from "../kit/Btn.vue";
import FormField from "../kit/FormField.vue";
import TextInput from "../kit/TextInput.vue";

// one team's people, for an admin its devices and invitations, and this person's password there
const props = defineProps({entry: {type: Object, required: true}});
const {busy, failure, attempt} = useAttempt();
const people = ref([]);
const devices = ref([]);
const invited = ref(null);
const inviteEmail = ref("");
const passwords = ref({old: "", fresh: ""});
const changed = ref(false);

async function load() {
    people.value = (await api.teamPeople(props.entry.team)).people;
    devices.value = props.entry.role === "admin" ? (await api.teamDevices(props.entry.team)).devices : [];
}

const invite = () => attempt(async () => (invited.value = await api.inviteToTeam(inviteEmail.value, props.entry.team)));
const revoke = (device) => attempt(async () => (await api.revokeTeamDevice(device.id, props.entry.team), await load()));
const changePassword = () => attempt(async () => (await api.changeTeamPassword(passwords.value.old, passwords.value.fresh, props.entry.team), (changed.value = true), (passwords.value = {old: "", fresh: ""})));

onMounted(() => attempt(load));
</script>

<template>
    <div class="team-columns">
        <template v-if="failure">
            <p class="team-failure">{{ failure }}</p>
        </template>
        <section class="team-part">
            <h2 class="team-section">People</h2>
            <template v-for="person in people" :key="person.id">
                <p class="team-plain">{{ person.name }}, {{ person.role }}</p>
            </template>
        </section>
        <template v-if="entry.role === 'admin'">
            <section class="team-part">
                <h2 class="team-section">Devices</h2>
                <template v-for="device in devices" :key="device.id">
                    <p class="team-mini">
                        <span class="team-word">{{ device.name }}, user {{ device.account_id }}</span>
                        <template v-if="!device.revoked_at">
                            <Btn small :busy="busy" @click="revoke(device)">Revoke this device</Btn>
                        </template>
                    </p>
                </template>
            </section>
            <section class="team-part">
                <h2 class="team-section">Invite a person</h2>
                <FormField label="Their email">
                    <TextInput v-model="inviteEmail" />
                </FormField>
                <Btn :busy="busy" @click="invite">Make an invitation URL</Btn>
                <template v-if="invited">
                    <p class="team-plain">{{ invited.email }} connects with: {{ invited.url }}</p>
                </template>
            </section>
        </template>
        <section class="team-part">
            <h2 class="team-section">Your password</h2>
            <FormField label="Your password now">
                <TextInput v-model="passwords.old" type="password" />
            </FormField>
            <FormField label="Your new password">
                <TextInput v-model="passwords.fresh" type="password" />
            </FormField>
            <Btn :busy="busy" @click="changePassword">Change your password</Btn>
            <template v-if="changed">
                <p class="team-plain">Your password is changed.</p>
            </template>
        </section>
    </div>
</template>

<style scoped>
.team-columns {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    align-items: start;
    gap: 24px;
}

.team-part {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.team-part .btn {
    align-self: flex-start;
}

.team-section {
    margin: 0;
}
</style>
