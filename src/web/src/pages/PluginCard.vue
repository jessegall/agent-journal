<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import StateDot from "../kit/StateDot.vue";
import Switch from "../kit/Switch.vue";
import {route} from "../route.js";
import {span} from "../format/time.js";
import {useNow} from "../composables/now.js";
import {dotOf, isFailing, isRunning, stateWord} from "../domain/services.js";

const props = defineProps({
    plugin: {type: Object, required: true},
    services: {type: Array, default: () => []},
    pages: {type: Array, default: () => []},
    busy: Boolean,
    reading: Boolean,
});
const emit = defineEmits(["toggle", "upgrade", "setup", "settings", "dashboard", "log", "remove", "services"]);

const now = useNow();
const more = ref(null);
const menu = ref(false);
const initials = computed(() =>
    props.plugin.title
        .split(/[\s_-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("")
);
const where = computed(() => (props.plugin.source || "").replace(/^https?:\/\/(www\.)?/, ""));

function pick(event) {
    menu.value = false;
    emit(event);
}
</script>

<template>
    <article :class="['plugin', {off: !plugin.enabled}]">
        <header class="head">
            <span class="mark" aria-hidden="true">{{ initials }}</span>
            <span class="names">
                <span class="title">{{ plugin.title }}</span>
                <span class="version">
                    {{ plugin.version }}
                    <span class="commit">{{ plugin.commit }}</span>
                </span>
            </span>
            <Switch :on="plugin.enabled" :title="plugin.enabled ? 'Turn it off' : 'Turn it on'" @change="(on) => emit('toggle', on)" />
        </header>

        <p class="description">{{ plugin.description }}</p>

        <p class="source" :title="plugin.source">
            <Icon name="branch" :size="12" />
            <span class="source-text">{{ where }}</span>
        </p>

        <template v-if="services.length">
            <div class="runs">
                <span class="label">Runs</span>
                <template v-for="s in services" :key="s.id">
                    <button type="button" :class="['run', {failing: isFailing(s)}]" title="Show its services" @click="emit('services')">
                        <StateDot :state="dotOf(s)" />
                        <span class="run-name">{{ s.service }}</span>
                        <span class="run-state">
                            {{ stateWord(s) }}
                            <template v-if="isRunning(s) && s.since">· up {{ span(now - s.since) }}</template>
                        </span>
                        <Icon name="sidepanel" :size="13" class="run-open" />
                    </button>
                </template>
            </div>
        </template>

        <template v-if="pages.length">
            <div class="pages">
                <span class="label">Pages</span>
                <template v-for="page in pages" :key="page.name">
                    <a class="page" :href="`#/${route.env}/page/${page.plugin}.${page.name}`">
                        {{ page.title }}
                        <Icon name="arrow" :size="11" />
                    </a>
                </template>
            </div>
        </template>

        <footer class="acts">
            <template v-if="plugin.settings.length">
                <Btn small @click="emit('settings')">Settings</Btn>
            </template>
            <template v-for="board in plugin.dashboards" :key="board.name">
                <Btn small @click="emit('dashboard', board)">{{ board.title }}</Btn>
            </template>
            <Btn small @click="emit('log')">{{ reading ? "Hide log" : "Log" }}</Btn>
            <span ref="more" class="more">
                <Btn kind="icon" small :busy="busy" title="Upgrade, set up again or remove" @click.stop="menu = !menu">
                    <Icon name="dots" :size="14" />
                </Btn>
            </span>
        </footer>

        <template v-if="menu">
            <MenuPanel :anchor="more" align="end" :min-width="190" @click.stop @close="menu = false">
                <MenuItem @click="pick('upgrade')">Check for updates</MenuItem>
                <MenuItem @click="pick('setup')">Run setup again</MenuItem>
                <MenuItem class="danger" @click="pick('remove')">Remove</MenuItem>
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
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
}

.commit {
    padding: 0 6px;
    border: 1px solid var(--border);
    border-radius: 5px;
    color: var(--text-4);
    font-family: var(--mono);
    font-size: 10.5px;
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

.runs,
.pages {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 10px;
    border-top: 1px solid var(--border);
}

.pages {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 14px;
}

.label {
    margin-bottom: 4px;
    color: var(--text-4);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.pages .label {
    width: 100%;
    margin-bottom: 0;
}

.run {
    display: flex;
    align-items: center;
    gap: 9px;
    width: 100%;
    margin: 0 -8px;
    padding: 6px 8px;
    border: 0;
    border-radius: 7px;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
    box-sizing: content-box;
}

.run:hover {
    background: var(--hover);
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

.run.failing .run-state {
    color: var(--danger);
}

.run-open {
    color: var(--text-4);
    opacity: 0;
    transition: opacity 0.15s;
}

.run:hover .run-open {
    color: var(--text-2);
    opacity: 1;
}

.page {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--accent-text);
    font-size: 12.5px;
    text-decoration: none;
}

.page:hover {
    text-decoration: underline;
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
