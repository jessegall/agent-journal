<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import Switch from "../../kit/Switch.vue";
import TextDisplay from "../../kit/TextDisplay.vue";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import Field from "../kit/Field.vue";
import {toast} from "../kit/toast.js";
import PhonePage from "./PhonePage.vue";

const props = defineProps({target: {type: String, required: true}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
const skill = ref(null);
const text = ref("");
const failed = ref("");
const busy = ref(false);
const status = computed(() =>
    skill.value.stale ? "Changed since the agent loaded it." : skill.value.loaded ? "Loaded in the agent's current context." : "Not loaded in the agent's current context."
);

async function load() {
    skill.value = (await api.skills(0)).find((one) => one.name === props.target) || null;
}

async function whileBusy(work) {
    busy.value = true;
    try {
        await work();
    } catch (error) {
        toast(error.message);
    } finally {
        busy.value = false;
    }
}

const loadNow = () => whileBusy(async () => toast((await api.loadSkill(props.target)).notice));

const always = (on) =>
    whileBusy(async () => {
        await api.alwaysSkill(props.target, on);
        await load();
    });

const keywords = (words) =>
    whileBusy(async () => {
        await api.skillKeywords(props.target, words);
        toast("Saved: trigger words");
        await load();
    });

onMounted(async () => {
    await load();
    try {
        text.value = (await api.skill(props.target)).text.replace(/^---\n[\s\S]*?\n---\n/, "");
    } catch (error) {
        failed.value = error.message;
    }
});
</script>

<template>
    <PhonePage :title="target" :line="skill ? skill.description : ''" :back="back" @back="emit('back')">
        <template v-if="skill">
            <CellGroup>
                <Cell label="Loaded in the agent" :sub="status" still />
                <Cell :label="skill.loaded ? 'Ask the agent to reload it' : 'Ask the agent to load it now'" tone="accent" :chevron="false" @pick="busy || loadNow()" />
                <Cell label="Load at session start" sub="The agent loads it when each session starts." still>
                    <template #end>
                        <Switch large :on="skill.always" title="Load at session start" @change="always" />
                    </template>
                </Cell>
            </CellGroup>
            <Field
                class="skill-words"
                :model-value="(skill.keywords || []).join(', ')"
                label="Trigger words"
                placeholder="dump, drop, paste"
                hint="Separate words with commas. Saved when you leave the field."
                @change="keywords($event.target.value)"
            />
            <h2 class="skill-head">Instructions</h2>
            <template v-if="failed">
                <p class="skill-status">{{ failed }}</p>
            </template>
            <template v-else-if="!text">
                <p class="skill-status">Loading the skill…</p>
            </template>
            <template v-else>
                <TextDisplay :text="text" />
            </template>
        </template>
    </PhonePage>
</template>

<style scoped>
.skill-words {
    display: block;
    margin: 18px 0 0;
}

.skill-head {
    display: block;
    margin: 0 4px 6px;
    color: var(--text-3);
    font-size: 0.8125rem;
    font-weight: 600;
}

.skill-head {
    margin-top: 22px;
}

.skill-status {
    display: block;
    margin: 6px 4px 0;
    color: var(--text-3);
    font-size: 0.8125rem;
}
</style>
