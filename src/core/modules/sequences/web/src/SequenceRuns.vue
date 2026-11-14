<script setup>
defineProps({runs: {type: Array, required: true}});
</script>

<template>
    <template v-if="runs.length">
        <section class="runs" data-sequence-runs>
            <h3 class="runs-title">Running now</h3>
            <template v-for="run in runs" :key="run.id">
                <div class="run">
                    <div class="run-head">
                        <span>Agent {{ run.session_agent_id }}</span>
                        <span class="run-count">{{ run.step_started ? `Step ${run.step_number} of ${JSON.parse(run.steps).length}` : `Step ${run.step_number} of ${JSON.parse(run.steps).length}, not started yet` }}</span>
                    </div>
                    <ol class="run-steps">
                        <template v-for="(step, index) in JSON.parse(run.steps)" :key="index">
                            <li :class="{done: index + 1 < run.step_number, current: index + 1 === run.step_number}">{{ step }}</li>
                        </template>
                    </ol>
                </div>
            </template>
        </section>
    </template>
</template>

<style scoped>
.runs {
    margin-top: 20px;
}

.runs-title {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 600;
}

.run {
    margin-bottom: 10px;
    padding: 12px 14px;
    border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border-2));
    border-radius: 9px;
    background: var(--raised);
}

.run-head {
    display: flex;
    justify-content: space-between;
    color: var(--text-2);
    font-size: 12.5px;
}

.run-count {
    color: var(--text-3);
    font-size: 11.5px;
}

.run-steps {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 10px 0 0;
    padding-left: 20px;
    color: var(--text-3);
    font-size: 12.5px;
}

.run-steps .done {
    text-decoration: line-through;
}

.run-steps .current {
    color: var(--text);
    font-weight: 500;
}
</style>
