<script setup>
import {computed, ref} from "vue";
import {Btn, Segmented, SwitchCase, TimeAgo, WindowRoom, useRunLine, useWindow} from "@journal/window-kit";
import LibraryBrowse from "./LibraryBrowse.vue";
import LibraryConnect from "./LibraryConnect.vue";
import LibraryCopies from "./LibraryCopies.vue";
import LibraryPeople from "./LibraryPeople.vue";

const ROLE_WORDS = {admin: "Admin", edit: "Edit", read: "Read-only"};

// the page of the team's shared server: the connect form until this journal is connected, then the header, the library and the items that follow it
const context = useWindow();
const {data: status, failure} = context.props.status;
const {data: copies} = context.props.copies;
const tab = ref("library");
const isLinked = computed(() => Boolean(status.value?.is_connected) && !status.value.stopped);
const canWrite = computed(() => status.value?.role === "admin" || status.value?.role === "edit");
const followed = computed(() => copies.value?.rows ?? []);
const isAdmin = computed(() => status.value?.role === "admin");
const tabs = computed(() => [
    {key: "library", label: "Library"},
    {key: "copies", label: "On this journal", count: followed.value.length},
    ...(isAdmin.value ? [{key: "people", label: "Users"}] : []),
]);

// a local edit writes no copy, and the status is worked out when it is read, so the copies are read again every few seconds as well as when one changes
async function load() {
    await context.reload(["status", "copies"]);
}

const {refusal, run} = useRunLine(load);

</script>

<template>
    <WindowRoom>
        <div class="teams" data-teams>
            <div class="teams-top">
                <h2 class="teams-title">Teams</h2>
                <template v-if="isLinked">
                    <Btn small data-teams-sync @click="run(['library', 'sync'])">Sync now</Btn>
                </template>
            </div>
            <template v-if="failure">
                <p class="teams-failure" role="alert" data-teams-failure>{{ failure }}</p>
            </template>
            <template v-if="refusal">
                <p class="teams-failure" role="alert" data-teams-refusal>{{ refusal }}</p>
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
                    <p class="teams-stopped" role="alert" data-teams-stopped>{{ status.stopped }}</p>
                </template>
            </template>
            <template v-if="status && !isLinked">
                <LibraryConnect :address="status.address" @connected="load" />
            </template>
            <template v-if="isLinked">
                <Segmented :options="tabs" :value="tab" data-teams-tabs @pick="tab = $event" />
                <SwitchCase :value="tab">
                    <template #library>
                        <LibraryBrowse :role="status.role" :can-write="canWrite" @changed="load" />
                    </template>
                    <template #copies>
                        <LibraryCopies :copies="followed" :role="status.role" :can-write="canWrite" @changed="load" />
                    </template>
                    <template #people>
                        <LibraryPeople />
                    </template>
                </SwitchCase>
            </template>
        </div>
    </WindowRoom>
</template>

<style scoped>
.teams {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.teams-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.teams-title {
    margin: 0;
    font-size: 16px;
}

.teams-header {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    color: var(--text-2);
    font-size: 13px;
}

.teams-failure,
.teams-stopped {
    margin: 0;
    color: var(--danger);
    font-size: 13px;
}
</style>
