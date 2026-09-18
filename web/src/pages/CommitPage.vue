<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api.js";
import {route} from "../route.js";
import {clock} from "../store.js";

const commit = ref(null);
const error = ref("");

async function load() {
    error.value = "";
    try {
        commit.value = await api("GET", `/${route.value.env}/commit/${route.value.n}`);
    } catch (e) {
        error.value = e.message;
    }
}
onMounted(load);
watch(() => route.value.n, load);

const files = computed(() =>
    (commit.value ? commit.value.stat : "")
        .split("\n")
        .filter((l) => l.includes("|"))
        .map((l) => {
            const [path, change] = l.split("|").map((x) => x.trim());
            return {path, adds: (change.match(/\+/g) || []).length, dels: (change.match(/-/g) || []).length, count: change.split(" ")[0]};
        })
);
const hunks = computed(() =>
    (commit.value ? commit.value.diff : "").split("\n").map((line) => ({
        line,
        kind:
            line.startsWith("+") && !line.startsWith("+++")
                ? "add"
                : line.startsWith("-") && !line.startsWith("---")
                  ? "del"
                  : line.startsWith("@@")
                    ? "hunk"
                    : line.startsWith("diff ")
                      ? "file"
                      : "",
    }))
);
</script>

<template>
    <section class="commit">
        <template v-if="error">
            <p class="empty">{{ error }}</p>
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
                        <span class="path">{{ f.path }}</span>
                        <span class="count">{{ f.count }}</span>
                        <span class="bar">
                            <span class="adds" :style="{width: `${f.adds * 4}px`}" />
                            <span class="dels" :style="{width: `${f.dels * 4}px`}" />
                        </span>
                    </div>
                </template>
            </div>
            <pre class="diff"><template v-for="(h, i) in hunks" :key="i"><span :class="['line', h.kind]">{{ h.line }}
</span></template></pre>
        </template>
    </section>
</template>

<style scoped>
.commit {
    max-width: 1080px;
    padding: 22px 28px 60px;
}

.empty {
    color: var(--text-3);
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
}

.count {
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.bar {
    display: inline-flex;
    width: 80px;
    height: 6px;
    overflow: hidden;
    border-radius: 3px;
    background: var(--line);
}

.adds {
    display: block;
    height: 100%;
    background: #3ecf74;
}

.dels {
    display: block;
    height: 100%;
    background: #d98c8c;
}

.diff {
    margin: 14px 0 0;
    padding: 12px 14px;
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: #121316;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
    line-height: 1.5;
    color: var(--text-2);
}

.line.add {
    color: #7fd9a0;
    background: rgba(62, 207, 116, 0.08);
}

.line.del {
    color: #e2a0a0;
    background: rgba(217, 140, 140, 0.08);
}

.line.hunk {
    color: var(--accent-text);
}

.line.file {
    display: block;
    margin-top: 8px;
    color: var(--text);
    font-weight: 600;
}
</style>
