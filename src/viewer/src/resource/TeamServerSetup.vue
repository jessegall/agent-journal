<script setup>
import {computed} from "vue";
import CopyButton from "../kit/CopyButton.vue";
import {store} from "../state/store.js";

const INSTALLER = "https://github.com/jessegall/agent-journal/releases/download/{tag}/install.sh";
const BACKUP = "docker exec agent-journal-<project> python -m sync_server backup --data /data/team";

// the release this journal's code carries, also on a development install, whose installed label names a branch and commit
const version = computed(() => store.summary?.version);
const command = computed(() => version.value && `curl -fsSL ${INSTALLER.replace("{tag}", `v${version.value}`)} | sh`);
</script>

<template>
    <div class="team-block">
        <h2 class="team-section">Set a team server up</h2>
        <p class="team-plain">Run this on the server, which needs Docker; Docker is installed first when the machine has none.</p>
        <template v-if="command">
            <div class="team-command">
                <code>{{ command }}</code>
                <CopyButton :text="command" hint="Copy the command" />
            </div>
        </template>
        <p class="team-plain">It asks for the project and the server's address, or reads them from TEAM_PROJECT and TEAM_ADDRESS.</p>
        <p class="team-plain">It listens on 8443 and 8080 unless TEAM_HTTPS_PORT and TEAM_HTTP_PORT say otherwise.</p>
        <p class="team-plain">At the end it prints the server's URL. Connect to it first: the first journal to connect becomes the team's admin.</p>
        <p class="team-fine">Back up a running server with:</p>
        <div class="team-command">
            <code>{{ BACKUP }}</code>
            <CopyButton :text="BACKUP" hint="Copy the backup command" />
        </div>
    </div>
</template>
