<script setup>
import {computed, ref} from "vue";
import {Btn, Icon, MenuItem, MenuPanel, Switch} from "@journal/window-kit";
import PluginServiceTerminal from "./PluginServiceTerminal.vue";

// one installed plugin as version 4 drew it: its initials, title, version and switch, what it is for, any fault, where it came from, the services it runs,
// and along its foot its settings, its dashboard, its log and a menu to check for updates or remove it; what opens below it comes in the slot
const props = defineProps({plugin: {type: Object, required: true}, description: {type: String, default: ""}, services: {type: Array, default: () => []}, events: {type: Array, default: () => []}, board: {type: Object, default: null}});
const emit = defineEmits(["toggle", "settings", "board", "record", "latest", "remove"]);
const more = ref(null);
const terminalOf = ref(null);
const toggleTerminal = (service) => (terminalOf.value = terminalOf.value === service.id ? null : service.id);
const menu = ref(false);
const initials = computed(() => props.plugin.title.split(/[\s_-]+/).filter(Boolean).slice(0, 2).map((word) => word[0].toUpperCase()).join(""));
const where = computed(() => props.plugin.source.replace(/^https?:\/\/(www\.)?/, ""));

const FORM_WORDS = {guard: "Before a change", listen: "During a change", commit: "After a change"};
const WRONG_WORDS = {
    "wrong key": ["Wrong event", () => "Nothing reaches this script. journal event keys lists the events."],
    "wrong script": ["Wrong script", (row) => `${row.script} is not in the plugin's folder or cannot run, so it never runs.`],
    "wrong project read": ["Wrong folder", (row) => `${row.script} is not a folder inside the project, so it is not opened.`],
    "form not offered": ["Wrong form", () => "This event takes only After a change."],
    "needs a newer journal": ["Newer journal needed", () => "It needs a newer journal, so it runs nothing."],
    renamed: ["Renamed", (row) => `This event is now called ${row.current_key}.`],
};
const scriptText = (row) => (row.limit_ms ? `${row.script}. Runs under the journal limit of ${row.limit_ms} ms.` : row.script);
const eventLabel = (row) => (row.started_at ? "Running" : WRONG_WORDS[row.state]?.[0] ?? FORM_WORDS[row.form] ?? "");
const minutesSince = (moment) => Math.max(1, Math.round((Date.now() - Date.parse(moment)) / 60000));
const minutesRunning = (row) => minutesSince(row.started_at);
const eventText = (row) => (row.started_at ? `for ${minutesRunning(row)} minutes. Turn the plugin off to stop it.` : WRONG_WORDS[row.state]?.[1](row) ?? scriptText(row));

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
                <span class="label">Runs</span>
                <template v-for="service in services" :key="service.id">
                    <button type="button" class="service" :disabled="!service.running" :aria-expanded="terminalOf === service.id" :title="service.running ? 'Show what this service prints' : ''" :data-plugin-service="service.id" @click="toggleTerminal(service)">
                        <span class="service-name">{{ service.service }}</span>
                        <span class="service-state">{{ service.running ? `running, process ${service.pid}` : "stopped" }}</span>
                    </button>
                    <template v-if="terminalOf === service.id && service.running">
                        <PluginServiceTerminal :plugin="plugin.name" :service="service.service" />
                    </template>
                </template>
            </div>
        </template>
        <template v-if="events.length">
            <div class="runs" data-plugin-events>
                <span class="label">Listens to</span>
                <template v-for="row in events" :key="row.id">
                    <span class="run" :data-plugin-event="row.state">
                        <span class="run-state">{{ eventLabel(row) }}</span>
                        <span class="run-name">{{ row.key }}</span>
                        <span class="run-state">{{ eventText(row) }}</span>
                    </span>
                    <template v-if="row.skip_reason">
                        <span class="run" data-plugin-skip>
                            <span class="run-state">Skipped {{ row.key }} {{ minutesSince(row.last_skipped_at) }} minutes ago: {{ row.skip_reason }}</span>
                        </span>
                    </template>
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

.run {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 3px 0;
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

.service:disabled {
    cursor: default;
}

.service:not(:disabled):hover,
.service[aria-expanded="true"] {
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

.run-name {
    color: var(--text);
    font-size: 12.5px;
    font-weight: 500;
}

.run-state {
    flex: 1;
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
