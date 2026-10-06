<script setup>
import {callings} from "../composables/profiles.js";
import ProfilesEditor from "./ProfilesEditor.vue";
</script>

<template>
    <div class="agent-voice">
        <ProfilesEditor />
        <header class="agent-voice-name">
            <h2>Your title and name</h2>
            <p>Profiles that use your title and name call you “{{ callings["title and name"] }}”.</p>
        </header>
    </div>
</template>

<style scoped>
.agent-voice-name {
    margin-bottom: 10px;
}

.agent-voice-name h2 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.005em;
}

.agent-voice-name p {
    margin: 2px 0 0;
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
