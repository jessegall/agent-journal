<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import StateDot from "../kit/StateDot.vue";
import TextDisplay from "../kit/TextDisplay.vue";

const CHECK_TRIES = 20;
const UPDATE_TRIES = 150;
const about = ref(null);
const error = ref("");
const target = ref("");
const pause = (ms) => new Promise((done) => setTimeout(done, ms));

const status = computed(() => {
    const a = about.value;
    if (!a) return null;
    if (target.value) return {busy: true, text: `Updating to ${target.value}. The page reloads when it's done.`};
    if (a.repository) return {text: "This is the journal's own repository, so it updates from its own code, not from a release."};
    if (a.checking) return {busy: true, text: "Checking for a newer version…"};
    if (a.newer) return {text: `Version ${a.latest} is out.`, update: true};
    return a.latest ? {text: "This is the newest version."} : null;
});

async function load() {
    about.value = await api.changelog();
}

async function check() {
    await api.checkForUpdate();
    for (let tries = 0; tries < CHECK_TRIES; tries++) {
        await load();
        if (!about.value.checking) return;
        await pause(1000);
    }
}

async function update() {
    target.value = about.value.latest;
    error.value = "";
    try {
        await api.update();
    } catch (failed) {
        target.value = "";
        error.value = failed.message;
        return;
    }
    for (let tries = 0; tries < UPDATE_TRIES; tries++) {
        await pause(2000);
        const now = await api.changelog().catch(() => null);
        if (now && now.version === target.value) return location.reload();
    }
    target.value = "";
    error.value = "The update is taking longer than expected. It carries on in the background; reload this page in a while.";
}

onMounted(async () => {
    try {
        await load();
        await check();
    } catch (failed) {
        error.value = failed.message;
    }
});
</script>

<template>
    <section class="about">
        <template v-if="error">
            <p class="error">{{ error }}</p>
        </template>
        <template v-if="about">
            <p class="version">Agent journal {{ about.version }}</p>
            <template v-if="status">
                <div class="update-line">
                    <template v-if="status.busy">
                        <StateDot state="running" />
                    </template>
                    <span>{{ status.text }}</span>
                    <template v-if="status.update">
                        <Btn kind="primary" @click="update">Update to {{ about.latest }}</Btn>
                    </template>
                </div>
            </template>
            <TextDisplay class="changelog" :text="about.changelog" />
        </template>
    </section>
</template>

<style scoped>
.about {
    padding: 16px 20px;
    max-width: 760px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.version {
    font-weight: 600;
}

.update-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-2);
    font-size: 13px;
}

.update-line .btn {
    margin-left: auto;
}

.error {
    color: var(--danger);
}
</style>
