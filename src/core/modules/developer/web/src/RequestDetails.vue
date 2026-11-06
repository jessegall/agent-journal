<script setup>
import {highlight} from "@journal/window-kit";

defineProps({request: {type: Object, default: null}});
const shown = (value) => highlight(JSON.stringify(value, null, 2), "json").join("\n");
const isRefused = (row) => row.outcome === "refused";
const isSlow = (row) => !isRefused(row) && row.duration_ms >= 500;
const durationOf = (row) => `${Math.round(row.duration_ms)} ms`;
</script>

<template>
    <template v-if="request">
        <div data-hook-request-detail>
            <div class="detail-head">
                <h2>{{ request.event }}</h2>
                <span :class="{slow: isSlow(request), refused: isRefused(request)}">{{ request.sender }} · queued {{ Math.round(request.queued_ms) }} ms · {{ request.outcome }} · {{ durationOf(request) }}</span>
            </div>
            <h3 class="heading">Headers</h3>
            <pre data-hook-request-headers v-html="shown(request.headers)" />
            <h3 class="heading">Body</h3>
            <pre data-hook-request-body v-html="shown(request.body)" />
        </div>
    </template>
    <template v-else><p class="note message">Select a request to see its headers and body.</p></template>
</template>

<style scoped>
.detail-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 24px; font-size: 12px; color: var(--text-3); }
.detail-head h2 { margin: 0; color: var(--text); font-size: 14px; }
.slow { color: #c58b35; }
.refused { color: #d76b6b; }
.heading { margin: 0 0 8px; font-size: 12px; }
pre { margin: 0 0 24px; padding: 12px; overflow: auto; border: 1px solid var(--border); border-radius: 6px; font-size: 12px; line-height: 1.6; }
.note { margin: 0; color: var(--text-3); font-size: 12px; }
.message { padding: 16px; line-height: 1.6; }
</style>
