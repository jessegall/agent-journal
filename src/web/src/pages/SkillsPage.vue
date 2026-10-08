<script setup>
import {agent} from "../composables/leadAgent.js";
import {useToggledSet} from "../composables/toggledSet.js";
import EmptyState from "../kit/EmptyState.vue";
import Btn from "../kit/Btn.vue";
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Icon from "../kit/Icon.vue";
import Segmented from "../kit/Segmented.vue";
import TextInput from "../kit/TextInput.vue";
import SkillPanel from "./SkillPanel.vue";
import SkillsRow from "./SkillsRow.vue";

const rows = ref([]);
const loaded = ref(false);
const opened = ref("");
const busy = ref(false);
const notice = ref("");
const query = ref("");
const filter = ref("all");
const {members: folded, toggle: fold} = useToggledSet();

async function reload() {
    const got = await api.skills(agent.value ? agent.value.n : 0);
    if (!loaded.value) {
        folded.value = new Set(groups(got).flatMap((group) => (group.skill ? [] : [group.key])));
    }
    rows.value = got;
    loaded.value = true;
}
onMounted(reload);
watch(() => agent.value && agent.value.data.uses, reload);

const FILTERS = {all: () => true, loaded: (s) => s.loaded, always: (s) => s.always};
const loadedCount = computed(() => rows.value.filter((s) => s.loaded).length);
const filters = computed(() => [
    {key: "all", label: "All"},
    {key: "loaded", label: "Loaded now", count: loadedCount.value},
    {key: "always", label: "At session start", count: rows.value.filter((s) => s.always).length},
]);
const searching = computed(() => Boolean(query.value.trim()) || filter.value !== "all");
const matching = computed(() => {
    const words = query.value.toLowerCase().split(/\s+/).filter(Boolean);
    return rows.value.filter((s) => FILTERS[filter.value](s) && words.every((w) => `${s.name} ${s.description}`.toLowerCase().includes(w)));
});
const skillGroups = computed(() => groups(matching.value));
const panel = computed(() => rows.value.find((s) => s.name === opened.value) || null);

function groups(list) {
    const under = (top) => list.filter((s) => s.name === top || s.name.startsWith(`${top}-`));
    const seen = new Set();
    const named = [];
    const individual = [];
    for (const skill of list) {
        const top = skill.name.split("-")[0];
        if (seen.has(top)) continue;
        seen.add(top);
        const members = under(top);
        if (members.length < 2) {
            individual.push({key: skill.name, skill});
            continue;
        }
        const items = members.map((member) => ({key: member.name, skill: member}));
        named.push({key: top, name: top, count: members.length, items});
    }
    return [...named, ...individual];
}

async function whileBusy(work) {
    busy.value = true;
    try {
        await work();
    } finally {
        busy.value = false;
    }
}

const loadNow = (s) => whileBusy(async () => (notice.value = (await api.loadSkill(s.name)).notice));

const always = (s, on) =>
    whileBusy(async () => {
        await api.alwaysSkill(s.name, on);
        await reload();
    });

const keywords = (s, words) =>
    whileBusy(async () => {
        await api.skillKeywords(s.name, words);
        await reload();
    });
</script>

<template>
    <section class="skills">
        <div class="bar">
            <TextInput
                class="skills-find"
                icon="search"
                :value="query"
                placeholder="Find a skill"
                aria-label="Find a skill"
                @input="query = $event.target.value"
                @keydown.esc="query = ''"
            />
            <Segmented :options="filters" :value="filter" @pick="filter = $event" />
            <span class="count">{{ rows.length }} skills · {{ loadedCount }} loaded here</span>
            <template v-if="notice">
                <span class="notice">{{ notice }}</span>
            </template>
        </div>
        <template v-if="!loaded || !rows.length">
            <EmptyState class="empty" :loading="!loaded">No skills are installed under .claude/skills or .codex/skills.</EmptyState>
        </template>
        <template v-else-if="loaded && !matching.length">
            <EmptyState class="empty" title="No skill matches">Try other words.</EmptyState>
        </template>
        <template v-if="matching.length">
            <div class="rows">
                <template v-for="group in skillGroups" :key="group.key">
                    <div :class="['cluster', group.skill ? 'individual' : 'named']">
                        <template v-if="group.skill">
                            <SkillsRow :skill="group.skill" @open="opened = $event.name" @always="always" />
                        </template>
                        <template v-else>
                            <Btn fill :class="['group', {folded: folded.has(group.key) && !searching}]" @click="fold(group.key)">
                                <span class="group-name">{{ group.name }}</span>
                                <span class="group-count">{{ group.count }}</span>
                                <Icon name="down" />
                            </Btn>
                            <template v-if="!folded.has(group.key) || searching">
                                <template v-for="item in group.items" :key="item.key">
                                    <SkillsRow :skill="item.skill" :depth="1" @open="opened = $event.name" @always="always" />
                                </template>
                            </template>
                        </template>
                    </div>
                </template>
            </div>
        </template>
        <template v-if="panel">
            <SkillPanel :skill="panel" :busy="busy" @close="opened = ''" @load="loadNow" @always="always" @keywords="keywords" />
        </template>
    </section>
</template>

<style scoped>
.skills {
    padding: 0 0 40px;
}

.bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    min-height: 44px;
    padding: 8px 14px 8px 22px;
    border-bottom: 1px solid var(--border);
    color: var(--text-2);
}

.skills-find {
    flex: 0 1 280px;
}

@media (max-width: 640px) {
    .skills-find {
        flex: 1 1 100%;
    }
}

.count {
    margin-left: auto;
    color: var(--text-3);
    font-size: 12.5px;
}

.notice {
    margin-left: 12px;
    font-size: 12px;
    color: var(--accent-text);
}

.empty {
    padding: 24px 22px;
}

.rows {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 18px 14px 0 22px;
}

.cluster {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.cluster.named + .cluster.named,
.cluster.named + .cluster.individual {
    margin-top: 12px;
}

.group {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 38px;
    padding: 6px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    font-weight: 600;
    text-align: left;
}

.group:hover {
    background: var(--hover);
}

.group .ico {
    width: 13px;
    height: 13px;
    margin-left: auto;
    color: var(--text-3);
    transition: transform 0.12s ease;
}

.group.folded .ico {
    transform: rotate(-90deg);
}

.group-count {
    font-size: 11px;
    font-weight: 400;
    color: var(--text-4);
}
</style>
