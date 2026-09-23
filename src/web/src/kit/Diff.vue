<script setup>
import {computed} from "vue";
import {route} from "../route.js";

const props = defineProps({text: String});

const KINDS = [
    [(line) => line.startsWith("+") && !line.startsWith("+++"), "add"],
    [(line) => line.startsWith("-") && !line.startsWith("---"), "del"],
    [(line) => line.startsWith("@@"), "hunk"],
    [(line) => line.startsWith("diff "), "file"],
];

const HEADER = /^diff --git a\/.* b\/(.*)$/;

const lines = computed(() =>
    (props.text || "").split("\n").map((line) => ({
        line,
        kind: (KINDS.find(([test]) => test(line)) || [null, ""])[1],
        path: (line.match(HEADER) || [])[1] || "",
    }))
);

const opens = (path) => `#/${route.value.env}/file?q=${encodeURIComponent(path)}`;
</script>

<template>
    <pre class="diff"><template v-for="(l, i) in lines" :key="i"><template v-if="l.path"><a :class="['line', l.kind]" :href="opens(l.path)" :title="`Open ${l.path}`">{{ l.line }}
</a></template><template v-else><span :class="['line', l.kind]">{{ l.line }}
</span></template></template></pre>
</template>

<style scoped>
.diff {
    margin: 14px 0 0;
    padding: 12px 14px;
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--code-bg);
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
    text-decoration: none;
}

a.line.file:hover {
    color: var(--accent-text);
    text-decoration: underline;
}
</style>
