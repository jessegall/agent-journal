<script setup>
import {WindowRoom, useWindow} from "@journal/window-kit";

// what an agent's load is made of: the messages reaching it an hour against those it answers, and those waiting to be read
const view = useWindow();
view.state["fitness.agent"] = String(view.agent);
const {data: fitness, failure} = view.props.fitness;
</script>

<template>
    <WindowRoom padding="14px 16px">
        <div class="load" data-load>
            <template v-if="failure">
                <p class="load-note">{{ failure }}</p>
            </template>
            <template v-if="fitness">
                <p class="load-head" data-load-head>Load {{ fitness.workload.toFixed(2) }}</p>
                <p class="load-row" data-load-row="arrivals"><span>Your messages per hour</span><span>{{ Math.round(fitness.arrivals_hourly) }}</span></p>
                <p class="load-row" data-load-row="answers"><span>Agent replies per hour</span><span>{{ Math.round(fitness.answers_hourly) }}</span></p>
                <p class="load-row" data-load-row="waiting"><span>Your messages waiting to be read</span><span>{{ fitness.waiting_messages }}</span></p>
                <p class="load-note">Load is messages arriving against those answered, over the last half hour.</p>
            </template>
        </div>
    </WindowRoom>
</template>

<style scoped>
.load {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 300px;
}

.load-head {
    margin: 0;
    font-weight: 600;
}

.load-row {
    display: flex;
    gap: 12px;
    justify-content: space-between;
    margin: 0;
    font-size: 13px;
}

.load-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
