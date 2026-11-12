<script setup>
import {computed} from "vue";
import {filledPercent, isFull, overPercent} from "./usageFull.js";

// how many of a limit are in use: the count and the limit in words, and a bar that turns amber and says full once the
// limit is reached. With no limit (null) it shows the count alone.
const props = defineProps({count: {type: Number, required: true}, limit: {type: Number, default: null}});

const full = computed(() => isFull(props.count, props.limit));
const hasBar = computed(() => props.limit !== null && props.limit > 0);
</script>

<template>
    <span :class="['setting-usage', {full}]">
        <span class="words">
            {{ limit === null ? count : `${count} of ${limit}` }}
            <template v-if="full">
                <span class="full-word" data-usage-full>full</span>
            </template>
        </span>
        <template v-if="hasBar">
            <span class="bar"><span class="filled" :style="{width: `${filledPercent(count, limit)}%`}" /><i :style="{width: `${overPercent(count, limit)}%`}" /></span>
        </template>
    </span>
</template>

<style scoped>
.setting-usage { display: block; font-family: var(--mono); font-size: 12px; }
.setting-usage.full { color: var(--tone-warn); font-weight: 500; }
.full-word { margin-left: 6px; font-family: inherit; }
.bar { display: block; position: relative; height: 4px; margin-top: 5px; border-radius: 2px; background: var(--border-2); overflow: hidden; }
.filled { display: block; height: 100%; background: var(--text-3); }
.full .filled { background: var(--tone-warn); }
.bar i { position: absolute; top: 0; right: 0; height: 100%; background: var(--danger); }
</style>
