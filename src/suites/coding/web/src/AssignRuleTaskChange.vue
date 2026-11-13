<script setup>
import {ref} from "vue";
import {useWindow} from "@journal/window-kit";

// the changes a person makes to the tasks one rule reaches: apply it to the free tasks waiting now, move the
// waiting tasks it gave to its new target, or give them back; each first lists the tasks and changes nothing,
// and changes them only once the person confirms
const props = defineProps({rule: {type: Object, required: true}, revision: {type: String, required: true}});
const emit = defineEmits(["changed", "failed"]);
const view = useWindow();
const listing = ref(null);
const CHANGES = [
    {verb: "apply", label: "Apply now", title: "List the free tasks the rule would give now"},
    {verb: "reassign", label: "Move its tasks", title: "List the waiting tasks the rule gave that would move to its target"},
    {verb: "give-back", label: "Give back its tasks", title: "List the waiting tasks the rule gave that would be free again"},
];

async function ask(verb, confirmed) {
    const words = ["assign-rule", verb, String(props.rule.id), ...(confirmed ? ["--confirm"] : []), "--revision", props.revision, "--environment", view.environment];
    const answer = await view.run(words);
    if (!answer.ok) emit("failed", answer.error);
    return answer;
}

async function list(verb) {
    const answer = await ask(verb, false);
    listing.value = answer.ok ? {verb, tasks: answer.value.tasks, text: answer.value.text} : null;
}

async function confirm() {
    await ask(listing.value.verb, true);
    listing.value = null;
    emit("changed");
}
</script>

<template>
    <span class="changes" data-assign-task-change>
        <template v-for="change in CHANGES" :key="change.verb">
            <button type="button" :title="change.title" :data-assign-change="change.verb" @click="list(change.verb)">{{ change.label }}</button>
        </template>
    </span>
    <template v-if="listing">
        <div class="listing" data-assign-listing>
            <p class="heading">Tasks: {{ listing.tasks.length }}. Nothing changes until you confirm.</p>
            <template v-for="task in listing.tasks" :key="task.task_id">
                <p class="task">Task {{ task.task_id }}, {{ task.title }}: {{ task.target }}</p>
            </template>
            <button type="button" :disabled="!listing.tasks.length" data-assign-confirm @click="confirm">Change these tasks</button>
            <button type="button" @click="listing = null">Cancel</button>
        </div>
    </template>
</template>

<style scoped>
.changes { display: flex; gap: 4px; }
.listing { flex-basis: 100%; padding: 6px 10px; border: 1px solid var(--border-2); border-radius: 8px; }
.heading, .task { margin: 0; font-size: 12px; }
</style>
