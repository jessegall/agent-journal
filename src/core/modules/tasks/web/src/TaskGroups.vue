<script setup>
import {computed, ref} from "vue";
import {Skeleton, useRows} from "@journal/window-kit";

// tasks as version 4 drew them: a search box, and the tasks in a group for each state, each with its number, state mark and priority
const {rows, failure, loaded} = useRows("task list", ["task.*"]);
const ORDER = ["started", "testing", "blocked", "open", "completed", "cancelled"];
const query = ref("");
const groups = computed(() => {
    const wanted = query.value.trim().toLowerCase();
    const kept = rows.value.filter((row) => !wanted || `${row.title} ${row.id}`.toLowerCase().includes(wanted));
    return ORDER.map((state) => ({state, tasks: kept.filter((row) => row.state === state)})).filter((group) => group.tasks.length);
});
const name = (state) => state.slice(0, 1).toUpperCase() + state.slice(1);
</script>

<template>
    <div class="tasks">
        <template v-if="!loaded">
            <Skeleton shape="rows" />
        </template>
        <template v-else-if="failure">
            <p class="tasks-note">{{ failure }}</p>
        </template>
        <template v-else>
            <input v-model="query" class="tasks-search" type="search" placeholder="Search the tasks" aria-label="Search the tasks" />
            <template v-if="!groups.length">
                <p class="tasks-note">{{ query ? "No task matches" : "No tasks yet" }}</p>
            </template>
            <template v-for="group in groups" :key="group.state">
                <section class="tasks-group" :data-state="group.state">
                    <h3 class="tasks-group-head">{{ name(group.state) }} <span class="tasks-count">{{ group.tasks.length }}</span></h3>
                    <template v-for="row in group.tasks" :key="row.id">
                        <div class="task" :data-row="row.id">
                            <span :class="['task-mark', row.state]" />
                            <span class="task-id">{{ row.id }}</span>
                            <span class="task-title">{{ row.title }}</span>
                            <template v-if="row.priority && row.priority !== 'normal'">
                                <span class="task-priority">{{ row.priority }}</span>
                            </template>
                        </div>
                    </template>
                </section>
            </template>
        </template>
    </div>
</template>

<style scoped>
.tasks {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.tasks-search {
    max-width: 320px;
    padding: 6px 12px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: transparent;
    color: var(--text);
}

.tasks-group-head {
    margin: 0 0 4px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.tasks-count {
    margin-left: 4px;
}

.task {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 6px 8px;
    border-radius: 6px;
}

.task:hover {
    background: var(--hover);
}

.task-mark {
    flex: none;
    width: 12px;
    height: 12px;
    border: 1.5px solid var(--text-4);
    border-radius: 50%;
}

.task-mark.started,
.task-mark.testing {
    border-color: var(--accent);
    background: linear-gradient(90deg, var(--accent) 50%, transparent 50%);
}

.task-mark.blocked {
    border-color: var(--danger);
}

.task-mark.completed {
    border-color: var(--accent);
    background: var(--accent);
}

.task-mark.cancelled {
    opacity: 0.4;
}

.task-id {
    flex: none;
    width: 40px;
    color: var(--text-3);
    font-size: 12px;
}

.task-title {
    flex: 1;
    min-width: 0;
}

.task-priority,
.tasks-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
