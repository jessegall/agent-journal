<script setup>
import {ref} from "vue";
import {RowList, useWindow} from "@journal/window-kit";

const POINT_PREFIX = "- ";

const context = useWindow();
const points = ref([]);
const failure = ref("");
const loaded = ref(false);

// the points of the worker's task brief, its lines that start with "- ", or the whole brief as one point when it has none
function briefPoints(task) {
    const lines = task.brief
        .split("\n")
        .filter((line) => line.startsWith(POINT_PREFIX))
        .map((line) => line.slice(POINT_PREFIX.length));
    return lines.length ? lines : [task.brief || task.title];
}

async function load() {
    const worktrees = await context.read(`worker-worktree list --agent ${context.agent}`);
    const worktree = worktrees.ok ? worktrees.value.rows[0] : null;
    if (!worktree) {
        failure.value = worktrees.ok ? "" : worktrees.error;
        points.value = [];
        loaded.value = true;
        return;
    }
    const [task, proofs] = await Promise.all([context.read(`task show ${worktree.task_id}`), context.read(`proof list --worktree ${worktree.id}`)]);
    if (!task.ok || !proofs.ok) {
        failure.value = task.ok ? proofs.error : task.error;
        loaded.value = true;
        return;
    }
    failure.value = "";
    loaded.value = true;
    points.value = briefPoints(task.value).map((text, index) => ({
        id: index + 1,
        text,
        proof: proofs.value.rows.find((proof) => proof.point === index + 1),
    }));
}

context.follow(["proof.*", "worker_worktree.*"], load);
load();
</script>

<template>
    <RowList :rows="points" :failure="failure" :loaded="loaded" empty="This agent has no task brief to prove">
        <template #default="{row}">
            <span class="number">{{ row.id }}</span>
            <span class="main">
                <span>{{ row.text }}</span>
                <span class="note">{{ row.proof ? `${row.proof.state}: ${row.proof.text}` : "no proof yet" }}</span>
                <template v-if="row.proof && row.proof.shortfall">
                    <span class="note">missing: {{ row.proof.shortfall }}</span>
                </template>
            </span>
        </template>
    </RowList>
</template>

<style scoped>
.number {
    color: var(--text-3);
    font-size: 12px;
}

.main {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
}

.note {
    color: var(--text-3);
    font-size: 12px;
}
</style>
