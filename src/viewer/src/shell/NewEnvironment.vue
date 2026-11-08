<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";

// a new environment: a name, the checkout folder it works in and the branch it stays on
const props = defineProps({run: {type: Function, required: true}});
const emit = defineEmits(["close", "made"]);
const name = ref("");
const folder = ref("");
const branch = ref("");
const failure = ref("");
const missing = computed(() => (!name.value.trim() ? "Give it a name." : folder.value.trim() ? "" : "Name the folder it works in."));

async function create() {
    const branchFlags = branch.value.trim() ? ["--branch", branch.value.trim()] : [];
    const answer = await props.run(["environment", "make", name.value.trim(), folder.value.trim(), ...branchFlags]);
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) emit("made", name.value.trim());
}
</script>

<template>
    <Dialog padded title="New environment" small @close="emit('close')">
        <div class="new-environment">
            <label class="field"><span class="label">Name</span><input v-model="name" placeholder="review" data-environment-name></label>
            <label class="field"><span class="label">Folder</span><input v-model="folder" placeholder="/path/to/checkout" data-environment-folder></label>
            <label class="field"><span class="label">Branch, if it stays on one</span><input v-model="branch" placeholder="main" data-environment-branch></label>
        </div>
        <template #foot>
            <span class="note" role="status">{{ failure || missing }}</span>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn variant="primary" :disabled="Boolean(missing)" data-environment-create @click="create">Create environment</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.new-environment {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.label,
.note {
    color: var(--text-3);
    font-size: 12px;
}

.note {
    flex: 1;
}

input {
    box-sizing: border-box;
    width: 100%;
    padding: 7px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 13px;
}
</style>
