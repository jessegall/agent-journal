<script setup>
import {computed, ref} from "vue";
import {Btn, Dialog, Icon, MenuItem, MenuPanel, Switch} from "@journal/window-kit";
import PluginServiceTerminal from "./PluginServiceTerminal.vue";

// one installed plugin as version 4 drew it: its initials, title, version and switch, what it is for, any fault, where it came from, the services it runs, each opening its log,
// and along its foot its settings, its dashboard, its log and a menu to check for updates or remove it; what opens below it comes in the slot
const props = defineProps({plugin: {type: Object, required: true}, description: {type: String, default: ""}, services: {type: Array, default: () => []}, board: {type: Object, default: null}});
const emit = defineEmits(["toggle", "settings", "board", "record", "latest", "remove"]);
const more = ref(null);
const shownService = ref(null);
const menu = ref(false);
const initials = computed(() => props.plugin.title.split(/[\s_-]+/).filter(Boolean).slice(0, 2).map((word) => word[0].toUpperCase()).join(""));
const where = computed(() => props.plugin.source.replace(/^https?:\/\/(www\.)?/, ""));

function pick(event) {
    menu.value = false;
    emit(event);
}
</script>

<template>
    <article :class="['plugin', {off: !plugin.enabled}]" :data-row="plugin.id">
        <header class="head">
            <span class="mark" aria-hidden="true">{{ initials }}</span>
            <span class="names">
                <span class="title">{{ plugin.title }}</span>
                <span class="version">{{ plugin.release }}</span>
            </span>
            <Switch :on="plugin.enabled" :title="plugin.enabled ? 'Turn it off' : 'Turn it on'" @change="emit('toggle')" />
        </header>
        <template v-if="description">
            <p class="description" data-plugin-description>{{ description }}</p>
        </template>
        <template v-if="plugin.failing">
            <p class="fault" data-plugin-fault>Failing, so events go through without it: {{ plugin.last_fault }}</p>
        </template>
        <template v-else-if="plugin.last_fault">
            <p class="fault quiet" data-plugin-fault>Last fault: {{ plugin.last_fault }}</p>
        </template>
        <p class="source" :title="plugin.source">
            <Icon name="branch" :size="12" />
            <span class="source-text">{{ where }}</span>
        </p>
        <template v-if="services.length">
            <div class="runs" data-plugin-runs>
                <span class="label">Services</span>
                <template v-for="service in services" :key="service.id">
                    <button type="button" class="service" title="Show what this service prints" :data-plugin-service="service.id" @click="shownService = service">
                        <span class="service-name">{{ service.service }}</span>
                        <span class="service-state">{{ service.running ? `running, process ${service.pid}` : "stopped" }}</span>
                    </button>
                </template>
            </div>
        </template>
        <slot />
        <footer class="acts">
            <Btn small data-plugin-settings @click="emit('settings')">Settings</Btn>
            <template v-if="board">
                <Btn small data-plugin-board @click="emit('board')">{{ board.title }}</Btn>
            </template>
            <Btn small data-plugin-record @click="emit('record')">Log</Btn>
            <span ref="more" class="more">
                <Btn variant="icon" small data-plugin-more title="Check for updates or remove" @click.stop="menu = !menu"><Icon name="dots" :size="14" /></Btn>
            </span>
        </footer>
        <template v-if="shownService">
            <Dialog padded wide :title="`${shownService.service} log`" @close="shownService = null">
                <PluginServiceTerminal :plugin="plugin.name" :service="shownService.service" />
            </Dialog>
        </template>
        <template v-if="menu">
            <MenuPanel :anchor="more" align="end" :min-width="190" @click.stop @close="menu = false">
                <MenuItem data-plugin-latest @click="pick('latest')">Check for updates</MenuItem>
                <MenuItem class="danger" data-plugin-remove @click="pick('remove')">Remove</MenuItem>
            </MenuPanel>
        </template>
    </article>
</template>

<style scoped>
.plugin {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 18px 18px 14px;
    border: 1px solid var(--border-2);
    border-radius: 14px;
    background: var(--raised);
    transition:
        border-color 0.2s,
        opacity 0.2s;
}

.plugin:hover {
    border-color: var(--border-3);
}

.plugin.off > :not(.head),
.plugin.off .names,
.plugin.off .mark {
    opacity: 0.55;
}

.head {
    display: flex;
    align-items: center;
    gap: 12px;
}

.mark {
    flex: none;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--border-2);
    border-radius: 11px;
    background: var(--bg-2);
    color: var(--text-2);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.02em;
}

.names {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.title {
    overflow: hidden;
    color: var(--text);
    font-size: 14.5px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.version {
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
}

.description {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.55;
}

.source {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    margin: 0;
    color: var(--text-3);
    font-family: var(--mono);
    font-size: 11.5px;
}

.source-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

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

.fault {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
    line-height: 1.5;
    overflow-wrap: anywhere;
}

.fault.quiet {
    color: var(--text-3);
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

.acts {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid var(--border);
}

.more {
    margin-left: auto;
    color: var(--text-2);
}

.danger {
    color: var(--danger);
}
</style>
