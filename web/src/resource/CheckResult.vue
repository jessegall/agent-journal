<script setup>
import {computed} from "vue";
import {age} from "../format/time.js";

const props = defineProps({resource: Object});
const last = computed(() => props.resource.data.last || {});
const every = computed(() => Number(props.resource.data.every || 0));
</script>

<template>
    <section class="block">
        <h3>Runs</h3>
        <code class="command">{{ resource.data.command || "no command yet" }}</code>
        <p class="lead">{{ every ? `Every ${every} minutes, and by hand.` : "By hand." }}</p>
    </section>
    <template v-if="last.at">
        <section class="block">
            <h3>Last run</h3>
            <p :class="['verdict', last.ok ? 'passed' : 'failed']">
                {{ last.ok ? "Passed" : `Failed (exit ${last.code})` }} · {{ age(last.at) }} · {{ last.took }}s
            </p>
            <template v-if="last.said">
                <pre class="said">{{ last.said }}</pre>
            </template>
        </section>
    </template>
</template>

<style scoped>
.command {
    display: block;
    padding: 6px 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--code-bg);
    font-size: 12px;
    white-space: pre-wrap;
}

.lead {
    margin: 6px 0 0;
    color: var(--text-3);
    font-size: 12px;
}

.verdict {
    margin: 0 0 6px;
    font-size: 12.5px;
}

.verdict.passed {
    color: var(--created);
}

.verdict.failed {
    color: var(--danger);
}

.said {
    margin: 0;
    padding: 8px 10px;
    max-height: 260px;
    overflow: auto;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--code-bg);
    font-size: 11.5px;
    white-space: pre-wrap;
}
</style>
