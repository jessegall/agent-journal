<script setup>
import {ref, watch} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import SidePanel from "../kit/SidePanel.vue";
import TextDisplay from "../kit/TextDisplay.vue";

const text = ref("");
const failed = ref("");

watch(
    () => store.skill,
    async (name) => {
        text.value = "";
        failed.value = "";
        if (!name) return;
        try {
            const got = await api.skill(name);
            text.value = got.text.replace(/^---\n[\s\S]*?\n---\n/, "");
        } catch (e) {
            failed.value = e.message;
        }
    },
    {immediate: true}
);
</script>

<template>
    <SidePanel :title="store.skill" @close="store.skill = ''">
        <template v-if="failed">
            <p class="skill-panel-note">{{ failed }}</p>
        </template>
        <template v-else-if="!text">
            <p class="skill-panel-note">Loading the skill…</p>
        </template>
        <template v-else>
            <TextDisplay :text="text" />
        </template>
    </SidePanel>
</template>

<style scoped>
.skill-panel-note {
    color: var(--text-3);
}
</style>
