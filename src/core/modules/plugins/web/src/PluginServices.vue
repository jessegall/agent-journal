<script setup>
import {computed, ref} from "vue";
import {Dialog} from "@journal/window-kit";
import PluginServiceTerminal from "./PluginServiceTerminal.vue";

// the services a plugin runs, each opening its log in a dialog
const props = defineProps({plugin: {type: String, required: true}, services: {type: Array, required: true}});
const shownServiceId = ref(null);
const shownService = computed(() => props.services.find((service) => service.id === shownServiceId.value) ?? null);
</script>

<template>
    <template v-if="services.length">
        <div class="runs" data-plugin-runs>
            <span class="label">Services</span>
            <template v-for="service in services" :key="service.id">
                <button type="button" class="service" title="Show what this service prints" :data-plugin-service="service.id" @click="shownServiceId = service.id">
                    <span class="service-name">{{ service.service }}</span>
                    <span class="service-state">{{ service.running ? `running, process ${service.pid}` : "stopped" }}</span>
                </button>
            </template>
        </div>
    </template>
    <template v-if="shownService">
        <Dialog wide tall :title="`${shownService.service} log`" @close="shownServiceId = null">
            <PluginServiceTerminal :plugin="plugin" :service="shownService" />
        </Dialog>
    </template>
</template>

<style scoped>
.runs {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 10px;
    border-top: 1px solid var(--border);
}

.label {
    margin-bottom: 4px;
    color: var(--text-4);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.service {
    display: flex;
    flex-direction: column;
    gap: 1px;
    align-items: flex-start;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    padding: 5px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.service:hover {
    background: var(--hover);
}

.service-name,
.service-state {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.service-name {
    color: var(--text);
    font-size: 12.5px;
    font-weight: 500;
}

.service-state {
    color: var(--text-3);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
}
</style>
