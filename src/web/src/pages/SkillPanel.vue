<script setup>
import {ref, watch} from "vue";
import {api} from "../api/client.js";
import {route, showFile} from "../route.js";
import Btn from "../kit/Btn.vue";
import FormField from "../kit/FormField.vue";
import SidePanel from "../kit/SidePanel.vue";
import Switch from "../kit/Switch.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import TextInput from "../kit/TextInput.vue";

const props = defineProps({skill: {type: Object, required: true}, busy: Boolean});
defineEmits(["close", "load", "always", "keywords"]);

const text = ref("");
const failed = ref("");

watch(
    () => props.skill.name,
    async (name) => {
        text.value = "";
        failed.value = "";
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
    <SidePanel :title="skill.name" :abstract="skill.description" @close="$emit('close')">
        <div class="skill-panel">
            <div class="skill-panel-load">
                <span class="skill-panel-status">
                    {{
                        skill.stale
                            ? "Changed since the agent loaded it."
                            : skill.loaded
                              ? "Loaded in the agent's current context."
                              : "Not loaded in the agent's current context."
                    }}
                </span>
                <Btn small kind="primary" :disabled="busy" @click="$emit('load', skill)">
                    {{ skill.loaded ? "Ask the agent to reload it" : "Ask the agent to load it now" }}
                </Btn>
            </div>
            <div class="skill-panel-switch">
                <div class="skill-panel-switch-text">
                    <span>Load at session start</span>
                    <small>The agent loads it when each session starts.</small>
                </div>
                <Switch :on="skill.always" title="Load at session start" @change="$emit('always', skill, $event)" />
            </div>
            <FormField
                label="Load it when these words appear"
                :for="`skill-words-${skill.name}`"
                help="Separate words with commas. Saved when you leave the field."
            >
                <TextInput
                    :id="`skill-words-${skill.name}`"
                    :value="(skill.keywords || []).join(', ')"
                    placeholder="dump, drop, paste"
                    @change="$emit('keywords', skill, $event.target.value)"
                />
            </FormField>
            <div class="skill-panel-text">
                <div class="skill-panel-head">
                    <h3>What the skill says</h3>
                    <Btn small @click="showFile(route.env, skill.path)">Open SKILL.md</Btn>
                </div>
                <template v-if="failed">
                    <p class="skill-panel-status">{{ failed }}</p>
                </template>
                <template v-else-if="!text">
                    <p class="skill-panel-status">Loading the skill…</p>
                </template>
                <template v-else>
                    <TextDisplay :text="text" />
                </template>
            </div>
        </div>
    </SidePanel>
</template>

<style scoped>
.skill-panel {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 16px 20px 28px;
}

.skill-panel-load,
.skill-panel-switch,
.skill-panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.skill-panel-status {
    margin: 0;
    color: var(--text-2);
    font-size: 12.5px;
}

.skill-panel-switch {
    color: var(--text);
    font-size: 13px;
}

.skill-panel-switch-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.skill-panel-switch-text small {
    color: var(--text-3);
    font-size: 11.5px;
}

.skill-panel-head h3 {
    margin: 0;
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.skill-panel-text {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
