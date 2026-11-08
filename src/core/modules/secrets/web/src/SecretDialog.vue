<script setup>
import {computed, reactive, ref} from "vue";
import {Btn, Dialog, Icon, TextInput} from "@journal/window-kit";

// the one place a secret changes: its values, programs, helpers, title and note; Save applies all of it, Cancel drops it
const props = defineProps({row: {type: Object, required: true}, run: {type: Function, required: true}});
const emit = defineEmits(["close"]);
const id = String(props.row.id);
const custom = computed(() => props.row.secret_type === "custom");
const title = ref(props.row.title);
const note = ref(props.row.brief);
const values = reactive({});
const fields = ref(props.row.fields.map((field) => ({...field, added: false})));
const dropped = ref([]);
const newField = ref("");
const programs = ref([...props.row.programs]);
const proposed = ref([...props.row.proposed]);
const newProgram = ref("");
const helpers = ref(props.row.helpers);
const refusal = ref("");
const saving = ref(false);

const isFilled = (field) => props.row.filled.includes(field.name);
const placeholder = (field) => (isFilled(field) ? "Leave blank to keep the saved credential" : "Paste or type your credential");

function addField() {
    const name = newField.value.trim();
    if (!name || fields.value.some((field) => field.name === name)) return;
    fields.value = [...fields.value, {name, hidden: true, added: true}];
    newField.value = "";
}

function removeField(field) {
    fields.value = fields.value.filter((held) => held.name !== field.name);
    if (!field.added) dropped.value = [...dropped.value, field.name];
    delete values[field.name];
}

function allow(name) {
    const program = name.trim();
    if (program && !programs.value.includes(program)) programs.value = [...programs.value, program];
    proposed.value = proposed.value.filter((held) => held !== program);
    newProgram.value = "";
}

// the commands Save runs, in order: a new field exists before its value is filled in
function changes() {
    const newlyAllowed = programs.value.filter((program) => !props.row.programs.includes(program));
    return [
        ...fields.value.filter((field) => field.added).map((field) => ["secret", "update", id, "--add-field", field.name]),
        ...dropped.value.map((name) => ["secret", "update", id, "--remove-field", name]),
        ...fields.value.filter((field) => (values[field.name] ?? "").trim()).map((field) => ["secret", "fill", id, field.name, values[field.name].trim()]),
        ...newlyAllowed.map((program) => ["secret", "allow", id, program]),
        ...(helpers.value && !props.row.helpers ? [["secret", "allow", id, "--helpers"]] : []),
        ...(title.value.trim() !== props.row.title || note.value.trim() !== props.row.brief ? [["secret", "update", id, "--title", title.value.trim(), "--brief", note.value.trim()]] : []),
    ];
}

async function save() {
    saving.value = true;
    for (const line of changes()) {
        const answer = await props.run(line);
        if (!answer.ok) {
            refusal.value = answer.error;
            saving.value = false;
            return;
        }
    }
    emit("close");
}
</script>

<template>
    <Dialog padded :title="row.title" @close="emit('close')">
        <div class="sections">
            <template v-if="row.waiting">
                <p class="lead">The agent requested these credentials. Add them below, then save.</p>
            </template>
            <section class="section">
                <span class="label">Credentials</span>
                <template v-for="field in fields" :key="field.name">
                    <div class="field">
                        <label :for="`secret-${field.name}`">{{ field.name }}</label>
                        <div class="line">
                            <input :id="`secret-${field.name}`" v-model="values[field.name]" class="value" :type="field.hidden ? 'password' : 'text'" autocomplete="off" :placeholder="placeholder(field)" :data-secret-value="field.name">
                            <template v-if="custom">
                                <Btn variant="icon" :title="`Remove the field ${field.name}`" :data-secret-field-remove="field.name" @click="removeField(field)"><Icon name="close" :size="12" /></Btn>
                            </template>
                        </div>
                    </div>
                </template>
                <template v-if="custom">
                    <form class="line" data-secret-field-add @submit.prevent="addField">
                        <TextInput v-model="newField" label="Add a field" />
                        <Btn bordered type="submit">Add</Btn>
                    </form>
                </template>
            </section>
            <section class="section">
                <span class="label">Allowed programs</span>
                <template v-if="programs.length">
                    <div class="chips">
                        <template v-for="program in programs" :key="program">
                            <span class="chip" data-secret-program>{{ program }}</span>
                        </template>
                    </div>
                </template>
                <template v-else>
                    <span class="muted">No programs have access to this secret yet.</span>
                </template>
                <template v-for="program in proposed" :key="program">
                    <div class="proposal">
                        <span>The agent proposed <code>{{ program }}</code></span>
                        <Btn small variant="primary" :data-secret-allow="program" @click="allow(program)">Allow {{ program }}</Btn>
                    </div>
                </template>
                <form class="line" data-secret-program-add @submit.prevent="allow(newProgram)">
                    <TextInput v-model="newProgram" label="Allow a program, such as curl" />
                    <Btn bordered type="submit" :disabled="!newProgram.trim()">Allow</Btn>
                </form>
            </section>
            <section class="section">
                <span class="label">Helpers</span>
                <template v-if="helpers">
                    <span class="muted">Helpers can use this secret too.</span>
                </template>
                <template v-else>
                    <div class="proposal">
                        <span>Helpers cannot use it.</span>
                        <Btn small bordered data-secret-helpers @click="helpers = true">Allow helpers</Btn>
                    </div>
                </template>
            </section>
            <section class="section">
                <span class="label">Title and note</span>
                <TextInput v-model="title" label="Title" data-secret-title />
                <TextInput v-model="note" label="Note for the agent" data-secret-note />
            </section>
            <template v-if="refusal">
                <p class="refusal" role="alert">{{ refusal }}</p>
            </template>
        </div>
        <template #foot>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn variant="primary" :disabled="saving || !title.trim()" data-secret-save @click="save">Save</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.sections {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.label {
    color: var(--text-4);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.lead {
    margin: 0;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.55;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: var(--text-2);
    font-size: 12.5px;
    font-weight: 500;
}

.line {
    display: flex;
    align-items: center;
    gap: 8px;
}

.line > :first-child {
    flex: 1;
    min-width: 0;
}

.value {
    box-sizing: border-box;
    width: 100%;
    height: 30px;
    padding: 0 9px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    outline: none;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-weight: 400;
}

.value:focus {
    border-color: var(--accent);
}

.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.chip {
    display: inline-flex;
    align-items: center;
    height: 22px;
    padding: 0 9px;
    border-radius: 6px;
    background: var(--chip);
    color: var(--text-2);
    font-family: var(--mono);
    font-size: 11.5px;
}

.muted {
    color: var(--text-3);
    font-size: 12.5px;
}

.proposal {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    color: var(--text-2);
    font-size: 12.5px;
}

code {
    padding: 1px 6px;
    border-radius: 5px;
    background: var(--chip);
    font-family: var(--mono);
    font-size: 11.5px;
}

.refusal {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
