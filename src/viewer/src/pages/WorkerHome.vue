<script setup>
import {computed, watch} from "vue";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import Icon from "../kit/Icon.vue";
import WorkerHomePanes from "./WorkerHomePanes.vue";
import {workerName} from "../domain/workers.js";
import {go, href, route} from "../route.js";
import {holding, rows} from "../sync/rows.js";

const id = computed(() => Number(route.value.n));
const worker = computed(() => rows("workers").find((row) => row.id === id.value) || null);
watch(id, (n) => n && holding("workers", [n]), {immediate: true});
const back = () => (location.hash = href.opened("home", `workers:${id.value}`));
</script>

<template>
    <div class="worker-home">
        <header class="worker-home-head">
            <Btn small @click="back">
                <Icon name="back" :size="12" />
                Back to the inspector
            </Btn>
            <b class="worker-home-name">{{ worker ? `Worker ${worker.id}, ${workerName(worker)}` : `Worker ${id}` }}</b>
        </header>
        <template v-if="worker">
            <WorkerHomePanes :key="worker.id" :worker="worker" />
        </template>
        <template v-else>
            <EmptyState title="Loading the worker">Its chat, terminal and edits show here once it is read.</EmptyState>
        </template>
    </div>
</template>

<style scoped>
.worker-home {
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.worker-home-head {
    display: flex;
    flex: none;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
}

.worker-home-name {
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
}
</style>
