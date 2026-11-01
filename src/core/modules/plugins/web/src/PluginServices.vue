<script setup>
import {onMounted, onUnmounted} from "vue";
import {useRows} from "@journal/window-kit";

const POLL_MS = 5000;

// the services of the plugins switched on and whether each runs, read again while the page is open; a list with none draws nothing
const {rows, load} = useRows("plugin services", ["plugin.*"]);
let timer = 0;

onMounted(() => {
    timer = setInterval(load, POLL_MS);
});
onUnmounted(() => clearInterval(timer));
</script>

<template>
    <template v-if="rows.length">
        <section class="plugin-services" data-plugin-services>
            <h3 class="plugin-services-heading">Services</h3>
            <template v-for="row in rows" :key="row.id">
                <div class="plugin-service" :data-plugin-service="row.id">
                    <span class="plugin-service-name">{{ row.plugin }} · {{ row.service }}</span>
                    <span :class="['plugin-service-state', {running: row.running}]">{{ row.running ? `Running, process ${row.pid}` : "Stopped" }}</span>
                </div>
            </template>
        </section>
    </template>
</template>

<style scoped>
.plugin-services {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 16px;
}

.plugin-services-heading {
    margin: 0 0 4px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.plugin-service {
    display: flex;
    gap: 12px;
    justify-content: space-between;
    padding: 4px 0;
}

.plugin-service-state {
    color: var(--text-3);
    font-size: 12px;
}

.plugin-service-state.running {
    color: var(--accent-text);
}
</style>
