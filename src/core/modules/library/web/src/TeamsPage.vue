<script setup>
import {computed} from "vue";
import {TimeAgo, WindowRoom, usePoll, useReadLine} from "@journal/window-kit";
import LibraryBrowse from "./LibraryBrowse.vue";
import LibraryConnect from "./LibraryConnect.vue";

const ROLE_WORDS = {admin: "Admin", edit: "Edit", read: "Read-only"};
const POLL_MILLISECONDS = 5000;

// the page of the team's shared server: the connect form until this journal is connected, then the header and the library
const {value: status, failure, load} = useReadLine(() => "library status");
const isLinked = computed(() => Boolean(status.value?.is_connected) && !status.value.stopped);
const canWrite = computed(() => status.value?.role === "admin" || status.value?.role === "edit");

usePoll(load, () => true, POLL_MILLISECONDS);
</script>

<template>
    <WindowRoom>
        <div class="teams" data-teams>
            <h2 class="teams-title">Teams</h2>
            <template v-if="failure">
                <p class="teams-failure" role="alert" data-teams-failure>{{ failure }}</p>
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
                <LibraryBrowse :role="status.role" :can-write="canWrite" />
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
