<script setup>
import EmptyState from "../kit/EmptyState.vue";
import Skeleton from "../kit/Skeleton.vue";
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import {href, route} from "../route.js";
import {clock} from "../format/time.js";
import Diff from "../kit/Diff.vue";
import {renamedTo, statBlocks, statFiles} from "../domain/commits.js";

const commit = ref(null);
const error = ref("");

async function load() {
    error.value = "";
    try {
        commit.value = await api.commit(route.value.n);
    } catch (e) {
        error.value = e.message;
    }
}
onMounted(load);
watch(() => route.value.n, load);

const files = computed(() => statFiles(commit.value?.stat));
const largest = computed(() => Math.max(1, ...files.value.map((f) => f.count)));
const blocks = (f) => statBlocks(f, largest.value);
</script>

<template>
    <section class="commit">
        <template v-if="error">
            <EmptyState class="empty">{{ error }}</EmptyState>
        </template>
        <template v-if="!commit && !error">
            <Skeleton shape="text" label="Loading the commit" />
        </template>
        <template v-if="commit">
            <header class="head">
                <code class="sha">{{ commit.sha.slice(0, 9) }}</code>
                <span class="when">{{ commit.author }} · {{ clock(commit.at) }}</span>
                <h2 class="subject">{{ commit.subject }}</h2>
                <template v-if="commit.body.trim()">
                    <pre class="body">{{ commit.body.trim() }}</pre>
                </template>
            </header>
            <div class="files">
                <template v-for="f in files" :key="f.path">
                    <div class="file">
                        <a class="path" :href="href.file(route.env, renamedTo(f.path))" :title="`Open ${f.path}`">
                            {{ f.path }}
                        </a>
                        <span class="count">{{ f.count }}</span>
                        <span class="bar">
                            <template v-for="(kind, i) in blocks(f)" :key="i">
                                <span :class="['block', kind]" />
                            </template>
                        </span>
                    </div>
                </template>
            </div>
            <Diff :text="commit.diff" :file-href="(path) => href.file(route.env, path)" />
        </template>
    </section>
</template>

<style scoped>
.commit {
    max-width: 1080px;
    padding: 22px 28px 60px;
}

.empty {
}

.head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px 12px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
}

.sha {
    padding: 1px 6px;
    border-radius: 4px;
    background: var(--raised);
    font-size: 12px;
    color: var(--accent-text);
}

.when {
    font-size: 12px;
    color: var(--text-3);
}

.subject {
    flex-basis: 100%;
    margin: 4px 0 0;
    font-size: 17px;
    font-weight: 600;
}

.body {
    flex-basis: 100%;
    margin: 0;
    white-space: pre-wrap;
    font: inherit;
    color: var(--text-2);
}

.files {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
}

.file {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
}

.path {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    color: var(--text-2);
    text-decoration: none;
}

.path:hover {
    color: var(--accent-text);
}

.count {
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.bar {
    display: inline-flex;
    gap: 2px;
}

.block {
    width: 9px;
    height: 9px;
    background: var(--line);
}

.block.adds {
    background: #3ecf74;
}

.block.dels {
    background: var(--danger-soft);
}
</style>
