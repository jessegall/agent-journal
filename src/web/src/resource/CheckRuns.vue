<script setup>
import {computed} from "vue";
import {age} from "../format/time.js";
import {seconds} from "../domain/checks.js";

const props = defineProps({runs: {type: Array, default: () => []}, tall: {type: Boolean, default: false}});
const longest = computed(() => Math.max(1, ...props.runs.map((r) => Number(r.took || 0))));
const newestFirst = computed(() => [...props.runs].reverse());
</script>

<template>
    <div :class="['runs', {tall}]">
        <template v-for="(run, i) in newestFirst" :key="i">
            <span
                :class="['run', run.ok ? 'ok' : 'bad']"
                :style="{height: `${Math.max(18, (Number(run.took || 0) / longest) * 100)}%`}"
                :title="`${run.ok ? 'Passed' : `Failed (exit ${run.code})`} · ${age(run.at)} · ${seconds(run.took)}`"
            />
        </template>
    </div>
</template>

<style scoped>
.runs {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 22px;
}

.runs.tall {
    height: 64px;
    gap: 4px;
}

.run {
    flex: 1;
    max-width: 10px;
    min-width: 4px;
    border-radius: 2px;
    opacity: 0.85;
}

.tall .run {
    max-width: 18px;
}

.run.ok {
    background: var(--created);
}

.run.bad {
    background: var(--danger);
}

.run:hover {
    opacity: 1;
}
</style>
