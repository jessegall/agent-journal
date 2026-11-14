<script setup>
import {checkOutcomeLabel, ruleLabel} from "./labels.js";
defineProps({checks: {type: Array, required: true}});
</script>

<template>
    <details data-stop-checks>
        <summary>Stop checks</summary>
        <template v-for="check in checks" :key="`${check.rule}:${check.layer || ''}`">
            <div class="check" data-stop-check>
                <strong>{{ ruleLabel(check.rule) }}</strong><span>{{ checkOutcomeLabel(check.outcome) }}</span>
                <template v-if="!check.applied"><span class="note">Not applied</span></template>
                <p>{{ check.reason }}</p>
            </div>
        </template>
    </details>
</template>

<style scoped>
details { width: 100%; font-size: 12px; }
summary { cursor: pointer; }
.check { padding: 8px 0; border-bottom: 1px solid var(--border); }
.check span { margin-left: 8px; }
.note { color: var(--text-3); }
p { margin: 4px 0 0; white-space: pre-wrap; }
</style>
