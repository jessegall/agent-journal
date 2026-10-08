<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {memberStatus} from "../domain/members.js";
import Btn from "../kit/Btn.vue";
import CopyButton from "../kit/CopyButton.vue";
import Dialog from "../kit/Dialog.vue";
import FormField from "../kit/FormField.vue";
import Icon from "../kit/Icon.vue";
import ListRow from "../kit/ListRow.vue";
import TextInput from "../kit/TextInput.vue";

const me = ref(null);
const open = ref(false);
const members = ref([]);
const name = ref("");
const invited = ref(null);
const failure = ref("");

onMounted(async () => {
    try {
        me.value = await api.hostingMe();
    } catch (e) {}
});

async function load() {
    members.value = (await api.members()).members;
}

async function show() {
    open.value = true;
    invited.value = null;
    failure.value = "";
    await load();
}

async function invite() {
    failure.value = "";
    try {
        invited.value = await api.inviteMember(name.value);
        name.value = "";
        await load();
    } catch (e) {
        failure.value = e.message;
    }
}
</script>

<template>
    <template v-if="me && me.owner">
        <button type="button" class="icon-btn" aria-label="People" v-tip="'People who can log in to this journal'" @click="show">
            <Icon name="people" />
        </button>
    </template>
    <template v-if="open">
        <Dialog title="People" fits @close="open = false">
            <div class="people">
                <template v-for="member in members" :key="member.id">
                    <ListRow :title="member.name" :text="memberStatus(member)" />
                </template>
                <template v-if="!members.length">
                    <p class="empty">Only you can log in to this journal.</p>
                </template>
                <form class="invite" @submit.prevent="invite">
                    <FormField label="Invite a person" for="invite-name" help="They get a link that works once, for seven days.">
                        <TextInput id="invite-name" :value="name" placeholder="Their name" @input="name = $event.target.value" />
                    </FormField>
                    <Btn kind="primary" small :disabled="!name.trim()" @click="invite">Invite</Btn>
                </form>
                <template v-if="invited">
                    <div class="link">
                        <span class="link-text">Send this link to {{ invited.member.name }}.</span>
                        <CopyButton :text="invited.link" label="Copy link" />
                    </div>
                </template>
                <template v-if="failure">
                    <p class="failure" role="alert">{{ failure }}</p>
                </template>
            </div>
        </Dialog>
    </template>
</template>

<style scoped>
.people {
    display: grid;
    gap: 12px;
}

.empty,
.failure {
    margin: 0;
    font-size: 13px;
    color: var(--text-3);
}

.invite {
    display: flex;
    align-items: flex-end;
    gap: 8px;
}

.invite > :first-child {
    flex: 1;
}

.link {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
}

.link-text {
    flex: 1;
}
</style>
