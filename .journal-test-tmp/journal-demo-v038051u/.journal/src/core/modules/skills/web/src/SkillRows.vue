<script setup>
import {ref} from "vue";
import {WindowRoom, useWindow} from "@journal/window-kit";
import LoadedSkills from "./LoadedSkills.vue";
import SkillCatalogue from "./SkillCatalogue.vue";
import SkillText from "./SkillText.vue";

const context = useWindow();
const skillId = context.option("row");
const loaded = ref([]);
const failure = ref("");
const answered = ref(false);
const catalogue = ref([]);
const opened = ref(null);
const openFailure = ref("");

async function load() {
    const [main, skills] = await Promise.all([context.read("agent main"), context.read("skill list")]);
    catalogue.value = skills.ok ? skills.value.rows : [];
    const agent = main.ok && main.value.id;
    const result = agent ? await context.read(`agent-skill list --agent ${agent} --limit 100`) : null;
    loaded.value = result?.ok ? result.value.rows.filter((row) => row.state === "loaded") : [];
    failure.value = result && !result.ok ? result.error : skills.ok ? "" : skills.error;
    answered.value = true;
}
context.follow(["agent.*", "agent_skill.*"], load);
if (skillId.value) {
    context.read(`agent-skill show ${skillId.value.skillId}`).then((result) => {
        if (result.ok) open(result.value.skill);
        else openFailure.value = result.error;
    });
} else load();

function back() {
    opened.value = null;
    openFailure.value = "";
}

async function open(folder) {
    const result = await context.read(`skill show ${folder}`);
    openFailure.value = result.ok ? "" : result.failure === "refused" ? `The skill ${folder} is no longer available.` : result.error;
    opened.value = result.ok ? result.value : null;
}
</script>

<template>
    <WindowRoom>
        <template v-if="opened || openFailure"><SkillText :skill="opened" :failure="openFailure" :back="!skillId" @back="back" /></template>
        <template v-else>
            <div class="skills-page">
                <LoadedSkills :rows="loaded" :failure="failure" :answered="answered" @open="open" />
                <SkillCatalogue :rows="catalogue" @open="open" />
            </div>
        </template>
    </WindowRoom>
</template>

<style scoped>
.skills-page { display:flex; flex-direction:column; gap:24px; }
</style>
