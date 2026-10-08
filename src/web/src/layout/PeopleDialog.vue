<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {memberStatus, ROLES, roleTitle} from "../domain/members.js";
import CopyButton from "../kit/CopyButton.vue";
import Dialog from "../kit/Dialog.vue";
import ListRow from "../kit/ListRow.vue";
import Segmented from "../kit/Segmented.vue";
import AbilityList from "./AbilityList.vue";
import InviteForm from "./InviteForm.vue";

const props = defineProps({me: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const members = ref([]);
const invited = ref(null);
const failure = ref("");

async function load() {
    if (props.me.owner) members.value = (await api.members()).members;
}

async function attempt(work) {
    failure.value = "";
    try {
        await work();
        await load();
    } catch (e) {
        failure.value = e.message;
    }
}

const invite = (name, role) => attempt(async () => (invited.value = await api.inviteMember(name, role)));
const assign = (member, role) => attempt(() => api.assignRole(member.id, role));

onMounted(load);
</script>

<template>
    <Dialog title="People" fits @close="emit('close')">
        <div class="people">
            <template v-if="!me.owner">
                <p class="you">You are {{ me.name }}, a {{ roleTitle(me.role).toLowerCase() }} in this journal.</p>
            </template>
            <AbilityList :abilities="me.abilities" />
            <template v-if="me.owner">
                <section class="members" aria-label="Members">
                    <h3 class="heading">Members</h3>
                    <template v-for="member in members" :key="member.id">
                        <ListRow :title="member.name" :text="memberStatus(member)">
                            <template #end>
                                <Segmented :options="ROLES" :value="member.role" @pick="(role) => assign(member, role)" />
                            </template>
                        </ListRow>
                    </template>
                    <template v-if="!members.length">
                        <p class="quiet">Only you can log in to this journal.</p>
                    </template>
                </section>
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
