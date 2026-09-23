<script setup>
import {computed} from "vue";
import {route} from "../route.js";

const props = defineProps({report: Object});

const groups = computed(() => {
    const found = new Map();
    for (const finding of props.report.findings || []) {
        const name = finding.group || "";
        if (!found.has(name)) found.set(name, []);
        found.get(name).push(finding);
    }
    return [...found].map(([name, findings]) => ({name, findings}));
});

const opens = (finding) => `#/${route.value.env}/file?q=${encodeURIComponent(finding.file)}${finding.line ? `&line=${finding.line}` : ""}`;
const place = (finding) => (finding.line ? `${finding.file}:${finding.line}` : finding.file);
</script>

<template>
    <section class="block">
        <h3>{{ report.title || "Findings" }}</h3>
        <template v-if="report.summary">
            <p class="lead">{{ report.summary }}</p>
        </template>
        <template v-for="group in groups" :key="group.name">
            <div class="group">
                <template v-if="group.name">
                    <p class="group-name">{{ group.name }} · {{ group.findings.length }}</p>
                </template>
                <ul class="findings">
                    <template v-for="(finding, i) in group.findings" :key="`${finding.file}:${finding.line}:${i}`">
                        <li class="finding">
                            <div class="head">
                                <span class="name">{{ finding.name }}</span>
                                <template v-if="finding.where">
                                    <span class="where">{{ finding.where }}</span>
                                </template>
                                <span class="grow" />
                                <template v-if="finding.file">
                                    <a class="place" :href="opens(finding)">{{ place(finding) }}</a>
                                </template>
                            </div>
                            <template v-if="finding.text">
                                <p class="text">{{ finding.text }}</p>
                            </template>
                        </li>
                    </template>
                </ul>
            </div>
        </template>
    </section>
</template>

<style scoped>
.lead {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 12px;
}

.group {
    margin-top: 10px;
}

.group-name {
    margin: 0 0 4px;
    color: var(--text-3);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.findings {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.finding {
    padding: 8px 10px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
}

.head {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
}

.name {
    font-weight: 600;
}

.where {
    color: var(--text-3);
    font-size: 12px;
}

.grow {
    flex: 1;
}

.place {
    color: var(--text-2);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 12px;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.place:hover {
    color: var(--text);
}

.text {
    margin: 4px 0 0;
    color: var(--text-2);
    font-size: 12.5px;
}
</style>
