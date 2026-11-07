<script setup>
import {computed, onMounted, ref} from "vue";
import {Btn, MenuItem, MenuPanel, TaskStatusIcon, useWindow} from "@journal/window-kit";
import {readPlanPlaces} from "./planPlaces.js";

// a new task being written, at the top of the list as version 4 had it
const emit = defineEmits(["filed", "cancel"]);
const context = useWindow();
const title = ref("");
const brief = ref("");
const failure = ref("");
const input = ref(null);
const ready = computed(() => Boolean(title.value.trim()));

async function file() {
    if (!ready.value) return;
    const answer = await context.run(["task", "make", title.value.trim(), ...(brief.value.trim() ? ["--brief", brief.value.trim()] : [])]);
    failure.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    if (place.value) {
        const placed = await context.run(["phase", "place", String(answer.value.id), "--phase", String(place.value.phaseId)]);
        failure.value = placed.ok ? "" : placed.error;
    }
    emit("filed", answer.value.id);
}

const place = ref(null);
const places = ref([]);
const anchor = ref(null);

async function openPlaces(event) {
    anchor.value = event.currentTarget;
    places.value = await readPlanPlaces(context);
}

function pickPlace(picked) {
    place.value = picked;
    anchor.value = null;
}

const fileOnCommand = (event) => (event.metaKey || event.ctrlKey) && (event.preventDefault(), file());
onMounted(() => input.value.focus());
</script>

<template>
    <div class="task-draft" data-task-draft @keydown.esc.stop.prevent="emit('cancel')">
        <div class="line">
            <TaskStatusIcon status="open" />
            <input ref="input" v-model="title" class="title" placeholder="Task title" aria-label="Task title" @keydown.enter.prevent="file" />
        </div>
        <textarea v-model="brief" class="brief" rows="1" placeholder="Describe the work and how to tell it is done (optional)." aria-label="Brief" @keydown.enter="fileOnCommand" />
        <template v-if="failure">
            <p class="failure" role="alert">{{ failure }}</p>
        </template>
        <div class="foot">
            <span class="hint">Enter to create, Esc to cancel</span>
            <Btn small data-task-place @click="openPlaces">{{ place ? place.label : "Place in a plan" }}</Btn>
            <template v-if="anchor">
                <MenuPanel :anchor="anchor" :min-width="260" @close="anchor = null">
                    <MenuItem data-task-place-none @click="pickPlace(null)">Not in a plan</MenuItem>
                    <template v-for="one in places" :key="one.phaseId">
                        <MenuItem :data-task-place-phase="one.phaseId" @click="pickPlace(one)">{{ one.label }}</MenuItem>
                    </template>
                </MenuPanel>
            </template>
            <Btn small @click="emit('cancel')">Cancel</Btn>
            <Btn small variant="primary" :disabled="!ready" data-file-task @click="file">Create task</Btn>
        </div>
    </div>
</template>

<style scoped>
.task-draft {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 14px;
    padding: 12px 14px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
}

.line {
    display: flex;
    gap: 8px;
    align-items: center;
}

.title,
.brief {
    width: 100%;
    padding: 0;
    border: 0;
    outline: 0;
    background: none;
    color: var(--text);
    font: inherit;
}

.title {
    font-weight: 500;
}

.brief {
    resize: vertical;
    color: var(--text-2);
    font-size: 13px;
}

.failure {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}

.foot {
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: flex-end;
}

.hint {
    flex: 1;
    color: var(--text-3);
    font-size: 11.5px;
}
</style>
