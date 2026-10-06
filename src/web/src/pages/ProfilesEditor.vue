<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import {loadProfiles, person, profileInUse, profiles, standing, useProfile} from "../composables/profiles.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import Notice from "../kit/Notice.vue";
import SectionHeading from "../kit/SectionHeading.vue";
import Toast from "../kit/Toast.vue";
import ProfilePanel from "./ProfilePanel.vue";
import ProfileRow from "./ProfileRow.vue";

const NEW = "new";
const open = ref(0);
const saved = ref(null);
const shipped = computed(() => profiles.value.filter((row) => row.data.system));
const own = computed(() => profiles.value.filter((row) => !row.data.system));
const panelRow = computed(() => (open.value === NEW ? null : profiles.value.find((row) => row.n === open.value)));

const tell = (text) => (saved.value = {text});
const guarded = (call) => call().catch((e) => tell(e.message));

function use(row) {
    return guarded(async () => {
        await useProfile(row);
        tell(`The agent now talks as ${row.title}. It was told at once.`);
    });
}

function duplicate(row) {
    return guarded(async () => {
        const copy = await api.duplicateProfile(row.n);
        await loadProfiles();
        open.value = copy.n;
    });
}

function remove(row) {
    return guarded(async () => {
        await api.deleteProfile(row.n);
        open.value = 0;
        await loadProfiles();
    });
}

function create(fields) {
    return guarded(async () => {
        const made = await api.createProfile(fields);
        await loadProfiles();
        open.value = made.n;
    });
}

watch(person, loadProfiles);
onMounted(loadProfiles);
</script>

<template>
    <section class="profiles">
        <header class="profiles-head">
            <div class="profiles-text">
                <h2>How the agent talks</h2>
                <p>
                    A profile is the agent's voice: its tone, its humour, how it uses your name and when it reacts to your messages. What
                    the agent may say about the journal itself is the same in every profile.
                </p>
            </div>
            <Btn small @click="open = NEW">New profile</Btn>
        </header>
        <template v-if="!profileInUse && standing">
            <Notice>No profile is chosen yet, so the agent talks as Butler.</Notice>
        </template>
        <div class="profiles-card">
            <SectionHeading class="profiles-group">Included with the journal</SectionHeading>
            <template v-for="row in shipped" :key="row.n">
                <ProfileRow
                    :row="row"
                    :in-use="row.n === profileInUse"
                    :standing="!profileInUse && standing && row.n === standing.n"
                    @open="open = $event.n"
                    @use="use"
                    @duplicate="duplicate"
                    @remove="remove"
                />
            </template>
            <SectionHeading class="profiles-group">Your profiles</SectionHeading>
            <template v-for="row in own" :key="row.n">
                <ProfileRow
                    :row="row"
                    :in-use="row.n === profileInUse"
                    @open="open = $event.n"
                    @use="use"
                    @duplicate="duplicate"
                    @remove="remove"
                />
            </template>
            <template v-if="!own.length">
                <EmptyState class="profiles-empty">None yet. Duplicate one above to change it, or press New profile.</EmptyState>
            </template>
        </div>
        <template v-if="open && (open === NEW || panelRow)">
            <ProfilePanel :row="panelRow" @close="open = 0" @use="use" @duplicate="duplicate" @remove="remove" @create="create" @changed="loadProfiles" />
        </template>
        <Toast :toast="saved" :lasts="3500" @done="saved = null" />
    </section>
</template>

<style scoped>
.profiles {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 18px 0 26px;
}

.profiles-head {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding-right: 15px;
}

.profiles-text {
    flex: 1;
    min-width: 0;
}

.profiles-text h2 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.005em;
}

.profiles-text p {
    margin: 2px 0 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.profiles-card {
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    overflow: hidden;
}

.profiles-group {
    margin: 0;
    padding: 10px 15px 6px;
}

.profiles-empty {
    padding: 14px 15px;
    border-top: 1px solid var(--border);
}
</style>
