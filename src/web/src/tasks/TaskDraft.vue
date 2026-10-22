<script setup>
import {computed, onMounted, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import {isClosed} from "../domain/row.js";
import {useScope} from "../composables/scope.js";
import {taskBoard} from "../state/taskBoard.js";
import TaskStatusIcon from "./TaskStatusIcon.vue";

const emit = defineEmits(["file", "cancel"]);
const scope = useScope();
const draft = taskBoard.draft;
const title = ref(null);
const where = ref(null);
const plans = computed(() => scope.rows("plans").filter((p) => !isClosed(p)));
const placeOf = (id) => (id ? `Plan ${id}: ${plans.value.find((p) => p.id === id)?.title || ""}` : "Not in a plan");
const ready = computed(() => Boolean(draft.title.trim()));

function file() {
    if (ready.value) emit("file", {title: draft.title.trim(), brief: draft.brief.trim(), plan: draft.plan});
}

function put(plan) {
    draft.plan = plan;
    where.value = null;
    title.value.focus();
}

const fileOnCommand = (e) => (e.metaKey || e.ctrlKey) && (e.preventDefault(), file());
onMounted(() => title.value.focus());
</script>

<template>
    <div class="task-draft" @keydown.esc.stop.prevent="emit('cancel')">
        <div class="line">
            <TaskStatusIcon status="open" />
            <input
                ref="title"
                v-model="draft.title"
                class="title"
                placeholder="Task title"
                aria-label="Task title"
                @keydown.enter.prevent="file"
            />
        </div>
        <textarea
            v-model="draft.brief"
            class="brief"
            rows="1"
            placeholder="Add a brief: what done looks like. You can leave this empty."
            aria-label="Brief"
            @keydown.enter="fileOnCommand"
        />
        <div class="foot">
            <button type="button" class="where" title="Where the task goes" @click="where = where ? null : $event.currentTarget">
                Put it in: {{ placeOf(draft.plan) }}
                <Icon name="caret" :size="11" />
            </button>
            <span class="grow" />
            <span class="hint">Enter to file it, Esc to cancel</span>
            <Btn small @click="emit('cancel')">Cancel</Btn>
            <Btn small kind="primary" :disabled="!ready" @click="file">File the task</Btn>
        </div>
        <template v-if="where">
            <MenuPanel :anchor="where" :min-width="240" :max-width="320" @close="where = null">
                <MenuLabel>Put the new task in</MenuLabel>
                <MenuItem :on="!draft.plan" @click="put(0)">Not in a plan</MenuItem>
                <template v-for="p in plans" :key="p.id">
                    <MenuItem :on="draft.plan === p.id" @click="put(p.id)">{{ placeOf(p.id) }}</MenuItem>
                </template>
            </MenuPanel>
        </template>
    </div>
</template>

<style scoped>
.task-draft {
    margin: 8px 12px;
    overflow: hidden;
    border: 1px solid var(--border-3);
    border-radius: 10px;
    background: var(--raised);
}

.line {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 12px 2px;
}

.title {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    background: none;
    color: var(--text);
    font: 500 14px var(--font);
}

.brief {
    display: block;
    width: 100%;
    min-height: 30px;
    padding: 4px 12px 8px 36px;
    border: 0;
    outline: 0;
    background: none;
    color: var(--text-2);
    font: 12.5px/1.5 var(--font);
    resize: none;
    field-sizing: content;
}

.title::placeholder,
.brief::placeholder {
    color: var(--text-4);
}

.foot {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px 8px 12px;
    border-top: 1px solid var(--border);
}

.where {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    height: 24px;
    padding: 0 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer;
}

.where:hover {
    border-color: var(--border-3);
    color: var(--text);
}

.grow {
    flex: 1;
}

.hint {
    color: var(--text-4);
    font-size: 11.5px;
    white-space: nowrap;
}

@media (max-width: 600px) {
    .hint {
        display: none;
    }
}
</style>
