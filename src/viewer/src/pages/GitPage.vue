<script setup>
import EmptyState from "../kit/EmptyState.vue";
import PagedList from "../kit/PagedList.vue";
import SectionHeading from "../kit/SectionHeading.vue";
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {useGitList} from "../composables/gitList.js";
import {distanceLine, checksLine, reviewLine, shortSha} from "../domain/gitPage.js";
import {ago} from "../format/time.js";

const PAGE = 30;
const branches = useGitList((skip) => api.gitBranches(skip, PAGE));
const commits = useGitList((skip) => api.gitCommits(skip, PAGE));
const pulls = ref(null);
const pullsFailure = ref("");

onMounted(async () => {
    branches.load();
    commits.load();
    try {
        pulls.value = await api.gitPulls();
    } catch (e) {
        pullsFailure.value = e.message;
    }
});
</script>

<template>
    <section class="git">
        <div class="part">
            <SectionHeading>Branches</SectionHeading>
            <template v-if="branches.failure.value">
                <EmptyState>{{ branches.failure.value }}</EmptyState>
            </template>
            <template v-else-if="!branches.loaded.value">
                <EmptyState loading shape="rows" />
            </template>
            <template v-else-if="!branches.rows.value.length">
                <EmptyState>This project has no branches yet.</EmptyState>
            </template>
            <template v-else>
                <PagedList :shown="branches.rows.value.length" :more="branches.more.value" :load="branches.load">
                    <template v-for="branch in branches.rows.value" :key="branch.name">
                        <div :class="['row', 'branch', {current: branch.current}]">
                            <span class="name">{{ branch.name }}</span>
                            <span class="fact">{{ distanceLine(branch) }}</span>
                            <span class="subject">{{ branch.subject }}</span>
                            <span class="fact">{{ branch.author }}, {{ ago(branch.time) }}</span>
                        </div>
                    </template>
                </PagedList>
            </template>
        </div>
        <div class="part">
            <SectionHeading>Recent commits</SectionHeading>
            <template v-if="commits.failure.value">
                <EmptyState>{{ commits.failure.value }}</EmptyState>
            </template>
            <template v-else-if="!commits.loaded.value">
                <EmptyState loading shape="rows" />
            </template>
            <template v-else-if="!commits.rows.value.length">
                <EmptyState>The current branch has no commits yet.</EmptyState>
            </template>
            <template v-else>
                <PagedList :shown="commits.rows.value.length" :more="commits.more.value" :load="commits.load">
                    <template v-for="commit in commits.rows.value" :key="commit.sha">
                        <div class="row commit">
                            <span class="sha">{{ shortSha(commit.sha) }}</span>
                            <span class="subject">{{ commit.subject }}</span>
                            <span class="fact">{{ commit.author }}, {{ ago(commit.time) }}</span>
                        </div>
                    </template>
                </PagedList>
            </template>
        </div>
        <div class="part">
            <SectionHeading>Open pull requests</SectionHeading>
            <template v-if="pullsFailure">
                <EmptyState>{{ pullsFailure }}</EmptyState>
            </template>
            <template v-else-if="!pulls">
                <EmptyState loading shape="rows" />
            </template>
            <template v-else-if="!pulls.available">
                <EmptyState>The pull requests are read through gh, which is not installed or not signed in here.</EmptyState>
            </template>
            <template v-else-if="!pulls.rows.length">
                <EmptyState>No pull request is open.</EmptyState>
            </template>
            <template v-else>
                <template v-for="pull in pulls.rows" :key="pull.number">
                    <div class="row pull">
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
    gap: 28px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px 28px 48px;
}

.row {
    display: flex;
    align-items: baseline;
    gap: 16px;
    padding: 7px 0;
    border-bottom: 1px solid var(--border-3);
}

.row.current .name {
    font-weight: 600;
}

.name {
    flex: none;
    color: var(--text);
    text-decoration: none;
}

.sha {
    flex: none;
    color: var(--text-4);
    font-family: var(--mono);
    font-size: 12px;
}

.subject {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text-2);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.fact {
    flex: none;
    color: var(--text-4);
    font-size: 12px;
}

.fact.failed {
    color: var(--danger);
}

.pull .name {
    flex: 1;
    min-width: 0;
}
</style>
