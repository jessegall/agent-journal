<script setup>
import {onMounted, ref} from "vue";
import Btn from "../kit/Btn.vue";
import {peek} from "../route.js";

// what an agent's panel adds to its fields: the task it holds and the plan of that task, its subagents and the skills it loaded
const props = defineProps({id: {type: Number, required: true}, read: {type: Function, required: true}});
const subagents = ref([]);
const skills = ref([]);
const task = ref(null);
const place = ref(null);
const shown = ref("");

onMounted(async () => {
    const [children, loaded, held] = await Promise.all([
        props.read(["agent", "list", "--parent", String(props.id)]),
        props.read(["agent-skill", "list", "--agent", String(props.id)]),
        props.read(["task", "list", "--holder", String(props.id), "--state", "started"]),
    ]);
    subagents.value = children.ok ? children.value.rows : [];
    skills.value = loaded.ok ? loaded.value.rows : [];
    task.value = held.ok ? (held.value.rows[0] ?? null) : null;
    if (!task.value) return;
    const where = await props.read(["plan", "place", String(task.value.id)]);
    place.value = where.ok ? where.value : null;
});

const toggle = (name) => (shown.value = shown.value === name ? "" : name);
</script>

<template>
    <section class="agent-facts" data-agent-facts>
        <template v-if="task">
            <Btn kind="text" data-agent-task-link @click="peek('tasks', task.id)">Task {{ task.id }}: {{ task.title }}</Btn>
        </template>
        <template v-if="place?.plan_id">
            <Btn kind="text" data-agent-plan-link @click="peek('plans', place.plan_id)">Show the plan</Btn>
        </template>
        <div class="agent-counts">
            <Btn kind="text" data-agent-subagents @click="toggle('subagents')">{{ subagents.length }} subagents</Btn>
            <Btn kind="text" data-agent-skills @click="toggle('skills')">{{ skills.length }} skills loaded</Btn>
        </div>
        <template v-if="shown === 'subagents'">
            <template v-for="row in subagents" :key="row.id">
                <Btn kind="text" data-agent-subagent @click="peek('agents', row.id)">#{{ row.id }} {{ row.session }}</Btn>
            </template>
        </template>
        <template v-if="shown === 'skills'">
            <template v-for="row in skills" :key="row.id">
                <span class="agent-skill" data-agent-skill>{{ row.name }}</span>
            </template>
        </template>
    </section>
</template>

<style scoped>
.agent-facts {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin-bottom: 12px;
}

.agent-counts {
    display: flex;
    gap: 12px;
}

.agent-skill {
    color: var(--text-2);
    font-size: 12.5px;
}
</style>
