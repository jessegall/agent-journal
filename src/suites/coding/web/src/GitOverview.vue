<script setup>
import {onMounted, ref} from "vue";
import {ago, Btn, EmptyState, Skeleton, useWindow} from "@journal/window-kit";
import {checksLine, distanceLine, reviewLine, shortSha} from "./gitWords.js";

// the project's repository as version 4's Git page showed it: its branches, the recent commits and the open pull requests
const context = useWindow();

function pagedList(line) {
    const list = {rows: ref([]), failure: ref(""), loaded: ref(false), more: ref(false)};
    list.load = async () => {
        const answer = await context.read(`${line} --skip ${list.rows.value.length}`);
        list.failure.value = answer.ok ? "" : answer.error;
        list.loaded.value = true;
        if (!answer.ok) return;
        list.rows.value = [...list.rows.value, ...answer.value.rows];
        list.more.value = !answer.value.is_last_page;
    };
    return list;
}

const branches = pagedList("git-overview branches");
const commits = pagedList("git-overview commits");
const pulls = ref(null);
const pullsFailure = ref("");
const when = (seconds) => ago(new Date(seconds * 1000).toISOString());

onMounted(async () => {
    branches.load();
    commits.load();
    const answer = await context.read("git-overview pulls");
    pulls.value = answer.ok ? answer.value : null;
    pullsFailure.value = answer.ok ? "" : answer.error;
});
</script>

<template>
    <section class="git" data-git>
        <div class="part">
            <h3>Branches</h3>
            <template v-if="branches.failure.value">
                <EmptyState>{{ branches.failure.value }}</EmptyState>
            </template>
            <template v-else-if="!branches.loaded.value">
                <Skeleton shape="rows" />
            </template>
            <template v-else-if="!branches.rows.value.length">
                <EmptyState>This project has no branches yet.</EmptyState>
            </template>
            <template v-for="branch in branches.rows.value" :key="branch.name">
                <div :class="['row', {current: branch.current}]" data-git-branch>
                    <span class="name">{{ branch.name }}</span>
                    <span class="fact">{{ distanceLine(branch) }}</span>
                    <span class="subject">{{ branch.subject }}</span>
                    <span class="fact">{{ branch.author }}, {{ when(branch.time) }}</span>
                </div>
            </template>
            <template v-if="branches.more.value">
                <Btn small data-git-more-branches @click="branches.load">Show more</Btn>
            </template>
        </div>
        <div class="part">
            <h3>Recent commits</h3>
            <template v-if="commits.failure.value">
                <EmptyState>{{ commits.failure.value }}</EmptyState>
            </template>
            <template v-else-if="!commits.loaded.value">
                <Skeleton shape="rows" />
            </template>
            <template v-else-if="!commits.rows.value.length">
                <EmptyState>The current branch has no commits yet.</EmptyState>
            </template>
            <template v-for="commit in commits.rows.value" :key="commit.sha">
                <div class="row" data-git-commit>
                    <span class="sha">{{ shortSha(commit.sha) }}</span>
                    <span class="subject">{{ commit.subject }}</span>
                    <span class="fact">{{ commit.author }}, {{ when(commit.time) }}</span>
                </div>
            </template>
            <template v-if="commits.more.value">
                <Btn small data-git-more-commits @click="commits.load">Show more</Btn>
            </template>
        </div>
        <div class="part">
            <h3>Open pull requests</h3>
            <template v-if="pullsFailure">
                <EmptyState>{{ pullsFailure }}</EmptyState>
            </template>
            <template v-else-if="!pulls">
                <Skeleton shape="rows" />
            </template>
            <template v-else-if="!pulls.available">
                <EmptyState>The pull requests are read through gh, which is not installed or not signed in here.</EmptyState>
            </template>
            <template v-else-if="!pulls.rows.length">
                <EmptyState>No pull request is open.</EmptyState>
            </template>
            <template v-else>
                <template v-for="pull in pulls.rows" :key="pull.number">
                    <div class="row" data-git-pull>
                        <a class="name" :href="pull.url" target="_blank" rel="noopener">#{{ pull.number }} {{ pull.title }}</a>
                        <span class="fact">{{ pull.branch }} by {{ pull.author }}</span>
                        <span class="fact">{{ reviewLine(pull) }}</span>
                        <span :class="['fact', {failed: pull.checks_failed}]">{{ checksLine(pull) }}</span>
                    </div>
                </template>
            </template>
        </div>
    </section>
</template>

<style scoped>
.git {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px 28px;
}

.part {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
}

h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
}

.row {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 10px;
    align-items: baseline;
    width: 100%;
    font-size: 13px;
}

.row.current .name {
    font-weight: 600;
}

.name,
.subject {
    min-width: 0;
    overflow-wrap: anywhere;
}

.subject {
    flex: 1;
}

.sha,
.fact {
    color: var(--text-3);
    font-size: 12px;
}

.sha {
    font-family: var(--font-mono, ui-monospace, monospace);
}

.fact.failed {
    color: var(--danger);
}
</style>
