<script setup>
import {computed, reactive, ref, watch} from "vue";
import {api} from "../api/client.js";
import {callings, profileInUse, profiles, sampleOf} from "../composables/profiles.js";
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import ChoiceList from "../kit/ChoiceList.vue";
import FormField from "../kit/FormField.vue";
import Notice from "../kit/Notice.vue";
import SidePanel from "../kit/SidePanel.vue";
import TextArea from "../kit/TextArea.vue";
import TextInput from "../kit/TextInput.vue";
import ProfileMenu from "./ProfileMenu.vue";

const QUESTION = "Is the fix in?";
const SAVE_AFTER_MS = 500;
const props = defineProps({row: {type: Object, default: null}});
const emit = defineEmits(["close", "use", "duplicate", "remove", "create", "changed"]);

const isNew = computed(() => props.row === null);
const locked = computed(() => !isNew.value && props.row.data.system);
const inUse = computed(() => !isNew.value && props.row.n === profileInUse.value);
const draft = reactive({title: "", brief: "", calling: "title and name", sample: ""});
const start = ref(0);
const failed = ref("");
let timer = 0;

const copyOf = (row) => ({title: row.title, brief: row.brief, calling: row.data.calling, sample: sampleOf(row)});
const resetDraft = (row) => Object.assign(draft, row ? copyOf(row) : {title: "", brief: "", calling: "title and name", sample: ""});

watch(
    () => props.row && props.row.n,
    () => {
        clearTimeout(timer);
        failed.value = "";
        resetDraft(props.row);
    },
    {immediate: true}
);

const choices = computed(() => {
    const titled = callings.value["title and name"] !== callings.value.name;
    return [
        {
            value: "title and name",
            label: callings.value["title and name"],
            hint: titled ? "Your title and first name." : "Your first name: no title is set in Your title and name.",
        },
        {value: "name", label: callings.value.name, hint: "Your first name only."},
        {value: "none", label: "No name", hint: "It never addresses you by name."},
    ].map((choice) => ({...choice, current: choice.value === draft.calling}));
});
const sample = computed(() => (locked.value ? sampleOf(props.row) : draft.sample));
const missing = computed(() => {
    if (!draft.title.trim()) return "Give it a name.";
    if (!draft.brief.trim()) return "Write how it talks.";
    return draft.sample.trim() ? "" : "Write a sample line.";
});

async function save() {
    try {
        await api.updateProfile(props.row.n, {...draft});
        failed.value = "";
        emit("changed", props.row);
    } catch (e) {
        failed.value = e.message;
    }
}

function edit(field, value) {
    draft[field] = value;
    if (isNew.value) return;
    clearTimeout(timer);
    timer = setTimeout(save, SAVE_AFTER_MS);
}

function startFrom(row) {
    start.value = row ? row.n : 0;
    Object.assign(draft, row ? {...copyOf(row), title: ""} : {title: draft.title, brief: "", calling: "title and name", sample: ""});
}
</script>

<template>
    <SidePanel :title="isNew ? 'New profile' : 'Profile'" @close="$emit('close')">
        <template #actions>
            <template v-if="inUse">
                <Chip tone="good">In use</Chip>
            </template>
            <template v-if="locked">
                <Chip>Comes with the journal</Chip>
            </template>
            <template v-if="!isNew">
                <ProfileMenu :row="row" @duplicate="$emit('duplicate', $event)" @remove="$emit('remove', $event)" />
            </template>
        </template>
        <div class="profile-panel">
            <template v-if="locked">
                <Notice>
                    Comes with the journal, so it can't be changed, and an update may change its wording. Duplicate it to make a version
                    of your own.
                </Notice>
            </template>
            <template v-if="isNew">
                <FormField label="Copy an existing profile" help="Copies how it talks, what it calls you and the sample line. You change them below.">
                    <div class="profile-panel-starts">
                        <template v-for="other in profiles" :key="other.n">
                            <Btn small :kind="start === other.n ? 'primary' : 'ghost'" @click="startFrom(other)">{{ other.title }}</Btn>
                        </template>
                        <Btn small :kind="start === 0 ? 'primary' : 'ghost'" @click="startFrom(null)">Nothing</Btn>
                    </div>
                </FormField>
            </template>
            <FormField label="Profile name">
                <TextInput
                    :value="draft.title"
                    :disabled="locked"
                    placeholder="Name it, for example: Quiet butler"
                    @input="edit('title', $event.target.value)"
                />
            </FormField>
            <FormField label="Preview of this profile’s answer">
                <p class="profile-panel-question">{{ QUESTION }}</p>
                <p class="profile-panel-answer">{{ sample || "Write a sample line below to hear it." }}</p>
            </FormField>
            <FormField
                label="How it talks"
                :help="`Plain words, as you would brief a person: the tone, the humour, how it uses your name and when it reacts to your messages. The agent reads this when it starts${isNew || locked ? '' : ', and is told as soon as you change it'}.`"
            >
                <TextArea
                    :value="draft.brief"
                    :disabled="locked"
                    placeholder="For example: Talk like a calm colleague. Keep answers short. Use my first name now and then. No jokes."
                    @input="edit('brief', $event.target.value)"
                />
            </FormField>
            <FormField label="How the agent addresses you" help="Your title and first name are set in Settings › Agent, under Your title and name.">
                <ChoiceList stacked :choices="choices" :disabled="locked" @pick="edit('calling', $event)" />
            </FormField>
            <FormField
                label="How it answers the sample question"
                :help="`You write it, in the voice above, as this profile would answer “${QUESTION}”. It is only an example: it is shown in How it sounds and when you choose a profile. The agent's real answers follow How it talks.`"
            >
                <TextInput
                    :value="sample"
                    :disabled="locked"
                    placeholder="For example: Yes, it's in. All tests pass."
                    @input="edit('sample', $event.target.value)"
                />
            </FormField>
            <template v-if="failed">
                <Notice tone="danger">{{ failed }}</Notice>
            </template>
        </div>
        <template #foot>
            <template v-if="isNew">
                <span class="profile-panel-status">{{ missing }}</span>
                <Btn small @click="$emit('close')">Cancel</Btn>
                <Btn small kind="primary" :disabled="Boolean(missing)" @click="$emit('create', {...draft})">Create profile</Btn>
            </template>
            <template v-else-if="locked">
                <span class="profile-panel-status" />
                <template v-if="!inUse">
                    <Btn small @click="$emit('use', row)">Use this profile</Btn>
                </template>
                <Btn small kind="primary" @click="$emit('duplicate', row)">Duplicate to change it</Btn>
            </template>
            <template v-else-if="inUse">
                <span class="profile-panel-status">You're editing the profile in use. Each change is saved and the agent is told at once.</span>
            </template>
            <template v-else>
                <span class="profile-panel-status">Changes are saved as you make them. The agent hears them once you use this profile.</span>
                <Btn small @click="$emit('use', row)">Use this profile</Btn>
            </template>
        </template>
    </SidePanel>
</template>

<style scoped>
.profile-panel {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.profile-panel-starts {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.profile-panel-question {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.profile-panel-answer {
    margin: 0;
    padding: 8px 10px;
    border-radius: 8px;
    background: var(--border);
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.5;
}

.profile-panel-status {
    flex: 1;
    color: var(--text-3);
    font-size: 12px;
}
</style>
