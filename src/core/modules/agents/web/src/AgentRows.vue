<script setup>
import {computed, nextTick, onUnmounted, ref, watch} from "vue";
import {Btn, EmptyState, MenuItem, MenuLabel, RowList, SearchBar, Segmented, toggleFilter, useNow, useWindow} from "@journal/window-kit";
import AgentCard from "./AgentCard.vue";

// `texts` is what the window says when it is empty on each tab, {running, closed, all}, each {title, hint}: what is empty in its own terms and what brings rows
const props = defineProps({empty: {type: String, required: true}, texts: {type: Object, default: () => ({})}});
const view = useWindow();
const {rows: waits} = view.props.waits;
const {rows: progress} = view.props.progress;
const {rows, failure, loaded, more} = view.props.agents;
const progressOf = (row) => progress.value.find((progress) => progress.agent_id === row.id) ?? null;
const waitReasonOf = (row) => waits.value.find((wait) => wait.agent_id === row.id)?.reason ?? "";
const show = ref("running");
const words = ref("");
const FILTER_KEY = "journal.agents.filters";
const savedFilters = JSON.parse(localStorage.getItem(FILTER_KEY) || '{"roles":[],"profiles":[],"programs":[]}');
const filters = ref(savedFilters);
const filterOptions = computed(() => view.props.filters.data.value ?? {roles: [], profiles: [], states: [], upgrade_retired: 0});
const {rows: programs} = view.props.programs;
const filterCount = computed(() => filters.value.roles.length + filters.value.profiles.length + filters.value.programs.length);
const updateFilter = (group, value) => { filters.value = toggleFilter(filters.value, group, value); };
const clearFilters = () => { filters.value = {roles: [], profiles: [], programs: []}; };
const label = (value) => value.slice(0, 1).toUpperCase() + value.slice(1);
watch(filters, (value) => localStorage.setItem(FILTER_KEY, JSON.stringify(value)));

const limit = ref(25);
function setState() {
    Object.assign(view.state, {"agents.show": show.value, "agents.search": words.value, "agents.limit": String(limit.value),
        "agents.roles": filters.value.roles.join(","), "agents.profiles": filters.value.profiles.join(","), "agents.programs": filters.value.programs.join(",")});
}
async function older() {
    limit.value += 25;
    setState();
    await view.reload("agents");
    return true;
}
watch([show, words, filters], () => {
    limit.value = 25;
    setState();
    view.reload("agents");
});
setState();
const factsOf = (row) => row.facts ?? null;
const shown = rows;
// an agent that ends leaves the Working tab, so it stays at the bottom of that list, faded, for five minutes first
const LINGER_MILLISECONDS = 5 * 60 * 1000;
const now = useNow();
const lingering = ref([]);
const lingerIds = computed(() => new Set(lingering.value.filter((held) => now.value - held.left < LINGER_MILLISECONDS).map((held) => held.row.id)));
const lingerRows = computed(() => lingering.value.filter((held) => lingerIds.value.has(held.row.id)).map((held) => held.row));
const listed = computed(() => [...shown.value, ...lingerRows.value]);
let readFor = "";
let readRows = [];
async function keepEnded(row) {
    await view.reload(`card.${row.id}`);
    const fresh = view.props[`card.${row.id}`].rows.value.find((found) => found.id === row.id);
    if (fresh?.ended_at && !lingering.value.some((held) => held.row.id === row.id)) lingering.value = [...lingering.value, {row: fresh, left: Date.now()}];
}
watch(rows, (current) => {
    const sameRead = readFor === `${show.value}|${words.value}|${JSON.stringify(filters.value)}` && show.value === "running";
    const gone = sameRead ? readRows.filter((row) => !current.some((found) => found.id === row.id)) : [];
    readFor = `${show.value}|${words.value}|${JSON.stringify(filters.value)}`;
    readRows = current;
    lingering.value = sameRead ? lingering.value.filter((held) => now.value - held.left < LINGER_MILLISECONDS && !current.some((found) => found.id === held.row.id)) : [];
    gone.forEach(keepEnded);
}, {immediate: true});
// a search is what makes an empty list mean nothing matches; the tab alone does not
const searching = computed(() => Boolean(words.value.trim()) || filterCount.value > 0);
const emptyText = computed(() => props.texts[show.value] ?? {title: props.empty, hint: ""});

// one card is open at a time and takes the whole window, search bar included, until it closes
const openId = ref(null);
const openedRow = ref(null);
const agents = ref(null);
const list = ref(null);
const openRow = computed(() => {
    if (openId.value === null) return null;
    return view.props[`card.${openId.value}`].rows.value.find((row) => row.id === openId.value) ?? openedRow.value;
});
const visible = computed(() => (openRow.value ? [openRow.value] : listed.value));
const easing = "cubic-bezier(0.2, 0.9, 0.25, 1)";
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const changing = ref(false);
let scrollTop = 0;
async function open(row) {
    if (changing.value) return;
    changing.value = true;
    scrollTop = list.value.scrollTop;
    const card = agents.value.querySelector(`[data-agent-open="${row.id}"]`);
    if (!reduced()) {
        const others = [...agents.value.querySelectorAll(".agent-row")].filter((element) => !element.contains(card));
        await Promise.all(others.map((element) => element.animate([{opacity: 1}, {opacity: 0}], {duration: 140, fill: "forwards"}).finished));
    }
    const bands = [...card.querySelectorAll(".agent-head, .agent-line")];
    const elements = [...bands, ...card.querySelectorAll("[data-agent-motion]")];
    const before = elements.map((element) => element.getBoundingClientRect());
    openedRow.value = row;
    openId.value = row.id;
    view.reload(`card.${row.id}`);
    await nextTick();
    if (!reduced()) {
        const after = elements.map((element) => element.getBoundingClientRect());
        elements.forEach((element, index) => {
            const parent = bands.findIndex((band) => band !== element && band.contains(element));
            const x = before[index].left - after[index].left - (parent < 0 ? 0 : before[parent].left - after[parent].left);
            const y = before[index].top - after[index].top - (parent < 0 ? 0 : before[parent].top - after[parent].top);
            element.animate([{transform: `translate(${x}px, ${y}px)`}, {transform: "none"}], {duration: 280, easing});
        });
        agents.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((element) => {
            element.animate([{opacity: 0, transform: "translateY(6px)"}, {opacity: 1, transform: "none"}], {duration: 240, delay: 60, easing, fill: "backwards"});
        });
    }
    changing.value = false;
}
async function close() {
    if (changing.value || !openRow.value) return;
    changing.value = true;
    const card = agents.value.querySelector(`[data-agent-open="${openId.value}"]`);
    const parts = [...card.children];
    const fades = reduced() ? [] : parts.map((element) => element.animate([{opacity: 1}, {opacity: 0}], {duration: 120, fill: "forwards"}));
    await Promise.all(fades.map((animation) => animation.finished));
    openId.value = null;
    await nextTick();
    list.value.scrollTop = scrollTop;
    fades.forEach((animation) => animation.cancel());
    if (!reduced()) {
        card.animate([{transform: "translateY(-12px)"}, {transform: "none"}], {duration: 280, easing});
        agents.value.querySelectorAll(".agent-row").forEach((element) => {
            if (element.contains(card)) return;
            element.animate([{opacity: 0}, {opacity: 1}], {duration: 160, easing});
        });
    }
    changing.value = false;
}
function inspectAgent(row) {
    openedRow.value = row;
    openId.value = row.id;
    view.reload(`card.${row.id}`);
}
const toggle = (row) => { if (openId.value === row.id) return close(); return open(row); };
watch(words, (typed) => typed.trim() && (openId.value = null));
watch(show, () => { openId.value = null; });
const closeOnEscape = (event) => { if (event.key === "Escape") close(); };
window.addEventListener("keydown", closeOnEscape);
onUnmounted(() => window.removeEventListener("keydown", closeOnEscape));
</script>

<template>
    <div ref="agents" :class="['agents', {focused: openRow, 'card-changing': changing}]">
        <SearchBar v-if="!openRow" v-model="words" placeholder="Search agents" :menu-count="filterCount" data-agents-search>
                <template #menu>
                    <MenuLabel>Type</MenuLabel>
                    <template v-for="role in filterOptions.roles" :key="role"><MenuItem role="menuitemcheckbox" :aria-checked="filters.roles.includes(role)" :checked="filters.roles.includes(role)" :data-filter-role="role" @click="updateFilter('roles', role)">{{ label(role) }}</MenuItem></template>
                    <template v-if="filterOptions.profiles.length"><MenuLabel>Profile</MenuLabel></template>
                    <template v-for="profile in filterOptions.profiles" :key="profile.name"><MenuItem role="menuitemcheckbox" :aria-checked="filters.profiles.includes(profile.name)" :checked="filters.profiles.includes(profile.name)" :data-filter-profile="profile.name" @click="updateFilter('profiles', profile.name)">{{ profile.title }}</MenuItem></template>
                    <MenuLabel>Program</MenuLabel>
                    <template v-for="program in programs" :key="program.name"><MenuItem role="menuitemcheckbox" :aria-checked="filters.programs.includes(program.name)" :checked="filters.programs.includes(program.name)" :data-filter-program="program.name" @click="updateFilter('programs', program.name)">{{ program.title }}</MenuItem></template>
                    <template v-if="filterCount"><MenuItem data-filter-clear @click="clearFilters">Clear filters</MenuItem></template>
                </template>
                <Segmented :options="filterOptions.states" :value="show" @pick="show = $event" />
        </SearchBar>
        <template v-if="show === 'retired' && filterOptions.upgrade_retired"><p class="agents-upgrade" data-agents-upgrade>Retired during the upgrade: {{ filterOptions.upgrade_retired }}</p></template>
        <div ref="list" :class="['agents-view', {'agents-view-open': openRow}]">
        <template v-if="loaded && !failure && !visible.length && filterCount"><EmptyState title="No agents match the filters" data-filter-empty>
            <Btn small data-empty-clear @click="clearFilters">Clear filters</Btn>
        </EmptyState></template>
        <template v-else><RowList moves :leaves-at-once="changing" :rows="visible" :failure="failure" :loaded="loaded" :more="!openRow && more" :older="older" :empty="emptyText.title" :hint="emptyText.hint" :searching="searching">
            <template #default="{row}">
                <div :class="['agent-row', {lingering: lingerIds.has(row.id) && row.id !== openId}]" :data-agent-row="row.id" :data-agent-lingering="lingerIds.has(row.id) ? '' : null">
                    <AgentCard :row="row" :facts="factsOf(row)" :progress="progressOf(row)" :wait-reason="waitReasonOf(row)" :open="row.id === openId" @toggle="toggle(row)" />
                </div>
            </template>
        </RowList></template>
        </div>
    </div>
</template>

<style scoped>
.agents-upgrade { margin: 0; padding: 8px 14px; color: var(--text-3); font-size: 12px; border-bottom: 1px solid var(--border); }
.agents {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0;
    min-height: 0;
}

.agents :deep(.row-list) {
    gap: 0;
}

.agents :deep(.row-list-row) {
    padding: 0;
}

.agents-view {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

/* with a card open the list, its row and the card stretch down to the band at the foot */
.agents.card-changing :deep(.row-list-move) { transition: none; }

.agents.focused .agents-view {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

.agents.focused :deep(.row-list) {
    flex: 1;
    min-height: 0;
}

.agents.focused :deep(.row-list-row) {
    flex: 1;
    min-height: 0;
    align-items: stretch;
}

.agents.focused .agent-row {
    display: flex;
    min-height: 0;
}

.agent-row.lingering { opacity: 0.5; }

.agent-row {
    position: relative;
    flex: 1;
    min-width: 0;
}

</style>
