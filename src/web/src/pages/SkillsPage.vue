<script setup>
import EmptyState from "../kit/EmptyState.vue";
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Icon from "../kit/Icon.vue";
import {route} from "../route.js";
import {agent} from "../state/store.js";
import {polled} from "../sync/polled.js";
import SkillsRow from "./SkillsRow.vue";
import {usePoll} from "../poll.js";

usePoll(...polled.agents);

const rows = ref([]);
const loaded = ref(false);
const opened = ref("");
const text = ref("");
const busy = ref("");
const notice = ref("");
const folded = ref(new Set());

async function reload() {
    const got = await api.skills(agent.value ? agent.value.n : 0);
    if (!loaded.value) {
        folded.value = new Set(
            groups(got).flatMap((group) =>
                group.skill ? [] : [group.key]
            )
        );
    }
    rows.value = got;
    loaded.value = true;
}
onMounted(reload);
watch(() => agent.value && agent.value.data.uses, reload);

const loadedCount = computed(() => rows.value.filter((s) => s.loaded).length);
const skillGroups = computed(() => groups(rows.value));

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

function fold(key) {
    const next = new Set(folded.value);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    folded.value = next;
}

async function open(s) {
    if (opened.value === s.name) {
        opened.value = "";
        return;
    }
    const got = await api.skill(s.name);
    text.value = got.text.replace(/^---\n[\s\S]*?\n---\n/, "");
    opened.value = s.name;
}

async function loadNow(s) {
    busy.value = s.name;
    const got = await api.loadSkill(s.name);
    notice.value = got.notice;
    busy.value = "";
}

async function always(s, on) {
    busy.value = s.name;
    await api.alwaysSkill(s.name, on);
    await reload();
    busy.value = "";
}

async function keywords(s, words) {
    busy.value = s.name;
    await api.skillKeywords(s.name, words);
    await reload();
    busy.value = "";
}
</script>

<template>
    <section class="skills">
        <div class="bar">
            <span class="count">{{ rows.length }} skills · {{ loadedCount }} loaded in the agent's window</span>
            <template v-if="notice">
                <span class="notice">{{ notice }}</span>
            </template>
        </div>
        <template v-if="loaded && !rows.length">
            <EmptyState class="empty">No skills are installed under .claude/skills or .codex/skills.</EmptyState>
        </template>
        <template v-if="rows.length">
            <div class="rows">
                <template v-for="group in skillGroups" :key="group.key">
                    <div :class="['cluster', group.skill ? 'individual' : 'named']">
                        <template v-if="group.skill">
                            <SkillsRow
                                :skill="group.skill"
                                :busy="busy"
                                :opened="opened"
                                :text="text"
                                @open="open"
                                @load="loadNow"
                                @always="always"
                                @keywords="keywords"
                            />
                        </template>
                        <template v-else>
                            <button type="button" :class="['group', {folded: folded.has(group.key)}]" @click="fold(group.key)">
                                <span class="group-name">{{ group.name }}</span>
                                <span class="group-count">{{ group.count }}</span>
                                <Icon name="down" />
                            </button>
                            <template v-if="!folded.has(group.key)">
                                <template v-for="item in group.items" :key="item.key">
                                    <SkillsRow
                                        :skill="item.skill"
                                        :busy="busy"
                                        :opened="opened"
                                        :text="text"
                                        :depth="1"
                                        @open="open"
                                        @load="loadNow"
                                        @always="always"
                                        @keywords="keywords"
                                    />
                                </template>
                            </template>
                        </template>
                    </div>
                </template>
            </div>
        </template>
    </section>
</template>

<style scoped>
.skills {
    padding: 0 0 40px;
}

.bar {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 44px;
    padding: 0 14px 0 22px;
    border-bottom: 1px solid var(--border);
    color: var(--text-2);
}

.notice {
    margin-left: auto;
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
