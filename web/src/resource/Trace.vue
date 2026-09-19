<script setup>
import {computed} from "vue";
import {route} from "../route.js";

const props = defineProps({resource: Object});
const files = computed(() => props.resource.data.changed || []);
const commits = computed(() => props.resource.data.commits || []);
</script>

<template>
    <template v-if="files.length">
        <section class="block">
            <h3>
                Files changed
                <span class="muted">{{ files.length }}</span>
            </h3>
            <div class="trace-files">
                <template v-for="f in files" :key="f.path">
                    <div class="trace-file" :title="f.path">
                        <a class="trace-path" :href="`#/${route.env}/file?q=${encodeURIComponent(f.path)}`" :title="`Open ${f.path}`">
                            {{ f.path }}
                        </a>
                        <template v-if="f.created">
                            <span class="trace-new">new</span>
                        </template>
                        <span class="trace-add">+{{ f.added }}</span>
                        <span class="trace-del">−{{ f.removed }}</span>
                    </div>
                </template>
            </div>
        </section>
    </template>
    <template v-if="commits.length">
        <section class="block">
            <h3>
                Commits
                <span class="muted">{{ commits.length }}</span>
            </h3>
            <div class="trace-commits">
                <template v-for="c in commits" :key="c.sha">
                    <div class="trace-commit">
                        <a class="trace-sha" :href="`#/${route.env}/commit/${c.sha}`">{{ c.sha.slice(0, 7) }}</a>
                        <span class="trace-subject">{{ c.subject }}</span>
                    </div>
                </template>
            </div>
        </section>
    </template>
</template>

<style scoped>
.block {
    margin-top: 16px;
}

.block h3 {
    margin: 0 0 4px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.muted {
    margin-left: 4px;
    font-weight: 400;
}

.trace-files,
.trace-commits {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.trace-file,
.trace-commit {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
    padding: 3px 0;
    font-size: 12px;
}

.trace-path,
.trace-subject {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-2);
}

.trace-path {
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
    text-decoration: none;
}

.trace-path:hover {
    color: var(--accent-text);
}

.trace-new {
    flex: none;
    padding: 0 5px;
    border: 1px solid var(--border-2);
    border-radius: 4px;
    font-size: 10px;
    color: var(--text-3);
}

.trace-add {
    flex: none;
    color: var(--created);
    font-variant-numeric: tabular-nums;
}

.trace-del {
    flex: none;
    color: var(--danger-soft);
    font-variant-numeric: tabular-nums;
}

.trace-sha {
    flex: none;
    text-decoration: none;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    padding: 1px 5px;
    border-radius: 4px;
    background: var(--raised);
    font-size: 11px;
    color: var(--accent-text);
}
</style>
