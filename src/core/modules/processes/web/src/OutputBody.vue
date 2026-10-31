<script setup>
import {computed} from "vue";

const props = defineProps({row: {type: Object, default: null}});
const percent = computed(() => Math.round((props.row?.fraction ?? 0) * 100));
</script>

<template>
    <template v-if="row">
        <div class="output-body">
            <template v-if="row.figure">
                <div class="progress"><span class="bar" :style="{width: `${percent}%`}"></span></div>
                <span class="figure">{{ row.figure }}</span>
            </template>
            <template v-if="row.lines">
                <pre class="last-lines">{{ row.lines }}</pre>
            </template>
        </div>
    </template>
</template>

<style scoped>
.output-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 2px 0 0 20px;
    font-size: 12px;
}

.progress {
    height: 3px;
    border-radius: 2px;
    background: var(--border, #ddd);
}

.bar {
    display: block;
    height: 100%;
    border-radius: 2px;
    background: var(--text-3);
}

.figure {
    color: var(--text-3);
}

.last-lines {
    margin: 0;
    color: var(--text-2);
    line-height: 1.45;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
</style>
