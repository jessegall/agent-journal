<script setup>
import {computed, ref} from "vue";
import {Btn, PageHeader, Segmented, SwitchCase, TimeAgo, WindowRoom, useRunLine, useWindow} from "@journal/window-kit";
import LibraryConnect from "./LibraryConnect.vue";
import LibraryPeople from "./LibraryPeople.vue";
import ShareDialog from "./ShareDialog.vue";
import TeamLibrary from "./TeamLibrary.vue";

const ROLE_WORDS = {admin: "Admin", edit: "Edit", read: "Read-only"};

// the page of the team's shared server: the connect form until this journal is connected, then the header with Sync and Share, the library and what was shared from here, and the users
const context = useWindow();
const {data: status, failure} = context.props.status;
const {data: copies} = context.props.copies;
const tab = ref("library");
const isLinked = computed(() => Boolean(status.value?.is_connected) && !status.value.stopped);
const canWrite = computed(() => status.value?.role === "admin" || status.value?.role === "edit");
const followed = computed(() => copies.value?.rows ?? []);
const isAdmin = computed(() => status.value?.role === "admin");
const counts = ref({library: 0, here: 0});
const sharing = ref(false);
const shared = ref(null);
const tabs = computed(() => [
    {key: "library", label: "Library", count: counts.value.library},
    {key: "here", label: "Shared from here", count: counts.value.here},
    ...(isAdmin.value ? [{key: "people", label: "Users"}] : []),
]);

// a local edit writes no copy, and the status is worked out when it is read, so the copies are read again every few seconds as well as when one changes
async function load() {
    await context.reload(["status", "copies"]);
}

const {refusal, run} = useRunLine(load);

</script>

<template>
    <WindowRoom padding="0">
        <div class="teams" data-teams>
            <PageHeader title="Teams">
                <template v-if="isLinked" #primary>
                    <Btn v-if="canWrite" small variant="primary" data-library-share-submit @click="sharing = true">Share</Btn>
                    <Btn small data-teams-sync @click="run(['library', 'sync'])">Sync</Btn>
                </template>
            </PageHeader>
            <template v-if="failure">
                <p class="teams-note failure" role="alert" data-teams-failure>{{ failure }}</p>
            </template>
            <template v-if="refusal">
                <p class="teams-note failure" role="alert" data-teams-refusal>{{ refusal }}</p>
            </template>
            <template v-if="shared">
                <p class="teams-note" data-library-shared>{{ shared.line }}</p>
                <p v-if="shared.warning" class="teams-note failure" role="alert" data-library-warning>{{ shared.warning }}</p>
            </template>
            <template v-if="status?.is_connected">
                <div class="teams-header" data-teams-header>
                    <span data-teams-server>Connected: {{ status.server_name }}</span>
                    <span data-teams-role>Role: {{ ROLE_WORDS[status.role] }}</span>
                    <template v-if="status.reached_at">
                        <span data-teams-reached>Last reached: <TimeAgo :at="status.reached_at" /></span>
                    </template>
                    <template v-if="!status.is_encrypted">
                        <span data-teams-plain>Connection: not encrypted</span>
                    </template>
                </div>
                <template v-if="status.stopped">
                    <p class="teams-note failure" role="alert" data-teams-stopped>{{ status.stopped }}</p>
                </template>
            </template>
            <template v-if="status && !isLinked">
                <LibraryConnect :address="status.address" @connected="load" />
            </template>
            <template v-if="isLinked">
                <Segmented :options="tabs" :value="tab" data-teams-tabs @pick="tab = $event" />
                <SwitchCase :value="tab">
                    <template #library>
                        <TeamLibrary :copies="followed" :user-name="status.user_name" :can-write="canWrite" @changed="load" @counted="counts = $event" />
                    </template>
                    <template #here>
                        <TeamLibrary mine :copies="followed" :user-name="status.user_name" :can-write="canWrite" @changed="load" @counted="counts = $event" />
                    </template>
                    <template #people>
                        <LibraryPeople />
                    </template>
                </SwitchCase>
            </template>
        </div>
        <template v-if="sharing"><ShareDialog @close="sharing = false" @shared="shared = $event; load()" /></template>
    </WindowRoom>
</template>

<style scoped>
.teams {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
    min-height: 0;
}

.teams-header {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    padding: 0 var(--inset);
    color: var(--text-2);
    font-size: 13px;
}

.teams-note {
    margin: 0;
    padding: 0 var(--inset);
    color: var(--text-2);
    font-size: 13px;
}

.failure {
    color: var(--danger);
}
</style>
