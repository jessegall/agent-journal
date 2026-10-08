<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {api} from "../api/client.js";
import {loginPage} from "../api/transport.js";
import {loadPeople, people} from "../composables/people.js";
import {roleTitle} from "../domain/members.js";
import {store} from "../state/store.js";
import AlertDialog from "../kit/AlertDialog.vue";
import Btn from "../kit/Btn.vue";
import CopyButton from "../kit/CopyButton.vue";
import Dialog from "../kit/Dialog.vue";
import ListRow from "../kit/ListRow.vue";
import AbilityList from "./AbilityList.vue";
import InviteForm from "./InviteForm.vue";
import MemberRow from "./MemberRow.vue";

const props = defineProps({me: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const REFRESH_MS = 15000;
const invited = ref(null);
const failure = ref("");
const confirming = ref(null);
let timer = 0;

async function attempt(work) {
    failure.value = "";
    try {
        await work();
        await loadPeople();
    } catch (e) {
        failure.value = e.message;
    }
}

const invite = (name, role) => attempt(async () => (invited.value = await api.inviteMember(name, role)));
const assign = (member, role) => attempt(() => api.assignRole(member.id, role));
const endLogins = (member) => attempt(() => api.endLogins(member.id));
const share = (member, names) => attempt(() => api.shareEnvironments(member.id, names));
const environments = computed(() => (store.summary?.environments || []).map((environment) => environment.name));

const askRemove = (member) =>
    (confirming.value = {
        title: `Remove ${member.name}?`,
        text: `${member.name} is logged out now and cannot log in again. What they wrote stays in the journal under their name.`,
        label: "Remove",
        act: () => attempt(() => api.removeMember(member.id)),
    });

const askLeave = () =>
    (confirming.value = {
        title: "Leave this journal?",
        text: "You are logged out now and cannot log in again unless the owner invites you once more. What you wrote stays under your name.",
        label: "Leave",
        act: () => attempt(async () => loginPage.open((await api.leaveJournal()).login)),
    });

async function confirm() {
    const act = confirming.value.act;
    confirming.value = null;
    await act();
}

onMounted(() => {
    loadPeople();
    timer = setInterval(loadPeople, REFRESH_MS);
});
onUnmounted(() => clearInterval(timer));
const owner = computed(() => people.value.owner);
</script>

<template>
    <Dialog title="People" fits @close="emit('close')">
        <div class="people">
            <template v-if="!me.owner">
                <p class="you">You are {{ me.name }}, a {{ roleTitle(me.role).toLowerCase() }} in this journal.</p>
            </template>
            <AbilityList :abilities="me.abilities" />
            <section class="members" aria-label="Members">
                <h3 class="heading">Members</h3>
                <template v-if="owner">
                    <ListRow :title="owner.name" :text="owner.connected ? 'Connected now' : 'Not connected'" />
                </template>
                <template v-for="member in people.members" :key="member.id">
                    <MemberRow
                        :member="member"
                        :owner="me.owner"
                        :environments="environments"
                        @assign="(role) => assign(member, role)"
                        @share="(names) => share(member, names)"
                        @end-logins="endLogins(member)"
                        @remove="askRemove(member)"
                    />
                </template>
                <template v-if="!people.members.length">
                    <p class="quiet">No one else can log in to this journal.</p>
                </template>
            </section>
            <template v-if="me.owner">
                <InviteForm @invite="invite" />
                <template v-if="invited">
                    <div class="link">
                        <span class="link-text">Send this link to {{ invited.member.name }}.</span>
                        <CopyButton :text="invited.link" label="Copy link" />
                    </div>
                </template>
            </template>
            <template v-if="!me.owner">
                <div class="leave">
                    <Btn small @click="askLeave">Leave this journal</Btn>
                </div>
            </template>
            <template v-if="failure">
                <p class="quiet" role="alert">{{ failure }}</p>
            </template>
        </div>
    </Dialog>
    <template v-if="confirming">
        <AlertDialog :title="confirming.title">
            <p>{{ confirming.text }}</p>
            <template #actions>
                <Btn small @click="confirming = null">Cancel</Btn>
                <Btn kind="primary" small @click="confirm">{{ confirming.label }}</Btn>
            </template>
        </AlertDialog>
    </template>
</template>

<style scoped>
.people,
.members {
    display: grid;
    gap: 14px;
}

.members {
    gap: 6px;
}

.heading {
    margin: 4px 0 0;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
}

.you,
.quiet {
    margin: 0;
    font-size: 13px;
}

.quiet {
    color: var(--text-3);
}

.leave {
    display: flex;
    justify-content: flex-end;
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
