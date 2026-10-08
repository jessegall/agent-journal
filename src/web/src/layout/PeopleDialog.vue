<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {api} from "../api/client.js";
import {loadPeople, people} from "../composables/people.js";
import {roleTitle} from "../domain/members.js";
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

onMounted(() => {
    loadPeople();
    timer = setInterval(loadPeople, REFRESH_MS);
});
onUnmounted(() => clearInterval(timer));
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
                <template v-if="people.owner">
                    <ListRow :title="people.owner.name" :text="people.owner.connected ? 'Connected now' : 'Not connected'" />
                </template>
                <template v-for="member in people.members" :key="member.id">
                    <MemberRow :member="member" :owner="me.owner" @assign="(role) => assign(member, role)" />
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
            <template v-if="failure">
                <p class="quiet" role="alert">{{ failure }}</p>
            </template>
        </div>
    </Dialog>
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
