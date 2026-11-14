<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {HostedWindow, Skeleton, Switch, WindowRoom, matchesSearch, useWindow} from "@journal/window-kit";
import {ChangeFoot} from "@journal/setting-components";
import CommandSettings from "./CommandSettings.vue";
import SettingNode from "./SettingNode.vue";
import SettingsEnvironments from "./SettingsEnvironments.vue";
import LeaveDialog from "./LeaveDialog.vue";
import SettingsLayout from "./SettingsLayout.vue";
import {GROUPS, SECTIONS, sectionOf} from "./settingSections.js";

// the settings of the journal in the design's sections: the declared settings of each module sit in the section the design gives it, the agent settings are drawn by their own window,
// and a search over every declared row replaces the section while words are typed
const context = useWindow();
const {rows, failure, loaded, load} = context.props.settings;
const query = ref("");
// the environments are read when their section opens, as the key is tied to a tab
context.state.tab = "settings";
// a change is a draft until Save: each is held by the key of its setting with the line that makes it, and the row shows the new value meanwhile
const draft = ref({});
const refusals = ref({});
const saving = ref(false);
const wordsOf = (value) => (typeof value === "boolean" ? (value ? "on" : "off") : String(value));
const listed = computed(() => rows.value.filter((row) => !row.key.endsWith(".*")).map((row) => (row.key in draft.value ? {...row, value: draft.value[row.key].value, shown: wordsOf(draft.value[row.key].value)} : row)));
const changes = computed(() => Object.entries(draft.value).map(([key, held]) => ({key, title: rows.value.find((row) => row.key === key)?.title ?? key, to: held.secret ? "changed" : wordsOf(held.value)})));
const readOnly = context.face === "phone";
const groups = computed(() => GROUPS.map((group) => ({...group, sections: group.sections.map((key) => ({key, ...SECTIONS[key]})).filter((section) => !section.modules || topsOf(section.key).length)})).filter((group) => group.sections.length));
const topsOf = (key) => listed.value.filter((row) => row.parent === null && sectionOf(row.module) === key);
const current = ref("look");
const open = computed(() => (groups.value.flatMap((group) => group.sections).some((section) => section.key === current.value) ? current.value : groups.value[0].sections[0].key));
function pick(key) {
    current.value = key;
    query.value = "";
    context.state.tab = key === "environments" ? "environments" : "settings";
}
const section = computed(() => SECTIONS[open.value]);

// a search keeps each declared setting whose title, description or key has the words, and the groups above it
const shown = computed(() => {
    const wanted = query.value.trim().toLowerCase();
    if (!wanted) return listed.value;
    const hits = listed.value.filter((row) => matchesSearch(row, wanted, context.search?.fields));
    const keys = new Set(hits.map((row) => row.key));
    for (const row of hits) {
        for (let up = listed.value.find((other) => other.key === row.parent); up; up = listed.value.find((other) => other.key === up.parent)) keys.add(up.key);
    }
    return listed.value.filter((row) => keys.has(row.key));
});
const found = computed(() => groups.value.flatMap((group) => group.sections).map((entry) => ({...entry, tops: shown.value.filter((row) => row.parent === null && sectionOf(row.module) === entry.key)})).filter((entry) => entry.tops.length));

// a setting joins the draft; a change back to what the server holds leaves it
function saved(words, change) {
    const key = words[2];
    const held = rows.value.find((row) => row.key === key);
    const next = {...draft.value};
    if (change && held && wordsOf(change.value) === wordsOf(held.value)) delete next[key];
    else next[key] = {words, value: change?.value, secret: !change};
    draft.value = next;
    return Promise.resolve({ok: true});
}

// Save sends every change; the ones the server accepts leave the draft, and each one it refuses stays with its refusal
async function save() {
    saving.value = true;
    const kept = {};
    const failed = {};
    for (const [key, held] of Object.entries(draft.value)) {
        const answer = await context.run(held.words);
        if (!answer.ok) {
            kept[key] = held;
            failed[key] = answer.error;
        }
    }
    draft.value = kept;
    refusals.value = failed;
    await load();
    saving.value = false;
}
const cancel = () => {
    draft.value = {};
    refusals.value = {};
};

// the Developer pages switch is the developer tools setting: on, the journal offers the developer pages and the sidebar shows their group
const toolsRow = computed(() => listed.value.find((row) => row.key.endsWith(".developer.tools")));
const toolsRows = computed(() => (toolsRow.value ? listed.value.filter((row) => row.parent === toolsRow.value.key) : []));
const switchTools = (on) => saved(["setting", "switch", toolsRow.value.key, on ? "on" : "off", "--project"], {key: toolsRow.value.key, value: on});

// leaving the page with changes that are not saved asks first: a click on a link outside the page waits for the answer
const root = ref(null);
const leaving = ref(null);
function guard(event) {
    const link = event.target.closest?.("a[href]");
    if (!changes.value.length || !link || root.value?.contains(link) || link.dataset.leaveAsked) return;
    event.preventDefault();
    event.stopPropagation();
    leaving.value = link;
}
function leave() {
    const link = leaving.value;
    leaving.value = null;
    cancel();
    link.dataset.leaveAsked = "true";
    link.click();
}
const warn = (event) => changes.value.length && event.preventDefault();
onMounted(() => {
    document.addEventListener("click", guard, true);
    window.addEventListener("beforeunload", warn);
});
onUnmounted(() => {
    document.removeEventListener("click", guard, true);
    window.removeEventListener("beforeunload", warn);
});
</script>

<template>
    <WindowRoom>
        <div ref="root" class="settings-page" data-settings-page>
        <SettingsLayout v-model:query="query" :groups="groups" :current="open" @pick="pick">
            <template v-if="!loaded"><Skeleton shape="text" /></template>
            <template v-else-if="failure"><p class="settings-failure" data-settings-failure>{{ failure }}</p></template>
            <template v-else-if="query.trim()">
                <template v-if="!found.length"><p class="settings-empty" data-settings-none>No setting matches.</p></template>
                <template v-for="entry in found" :key="entry.key">
                    <section class="settings-section" :data-found-section="entry.key">
                        <h3 class="settings-heading">{{ entry.label }}</h3>
                        <template v-for="row in entry.tops" :key="row.key"><SettingNode :row="row" :rows="shown" :read-only="readOnly" :save="saved" :refusals="refusals" /></template>
                    </section>
                </template>
            </template>
            <template v-else>
                <section class="settings-section" :data-section-body="open">
                    <h3 class="settings-heading">{{ section.label }}</h3>
                    <template v-if="section.body === 'commands'"><CommandSettings /></template>
                    <template v-else-if="section.body === 'environments'"><SettingsEnvironments /></template>
                    <template v-else>
                        <template v-if="section.window"><HostedWindow :key="open" :name="section.window" :options="{sections: section.tabs}" /></template>
                        <template v-if="open === 'developer' && toolsRow">
                            <label class="settings-developer" data-developer-pages><span>Developer pages</span><Switch :on="toolsRow.value !== false" title="Developer pages" :disabled="readOnly" data-developer-switch @change="switchTools" /></label>
                            <template v-for="row in toolsRows" :key="row.key"><SettingNode :row="row" :rows="listed" :read-only="readOnly" :save="saved" :refusals="refusals" /></template>
                        </template>
                        <template v-for="row in topsOf(open).filter((top) => !(open === 'developer' && top.key === toolsRow?.key))" :key="row.key"><SettingNode :row="row" :rows="listed" :read-only="readOnly" :save="saved" :refusals="refusals" /></template>
                    </template>
                </section>
            </template>
        </SettingsLayout>
        <template v-if="!readOnly"><ChangeFoot :changes="changes" :can-save="changes.length > 0 && !saving" :pending="saving" :environment="context.environment" @save="save" @cancel="cancel" /></template>
        <template v-if="leaving"><LeaveDialog :count="changes.length" @stay="leaving = null" @leave="leave" /></template>
        </div>
    </WindowRoom>
</template>

<style scoped>
.settings-section {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.settings-heading {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
}

.settings-failure,
.settings-empty {
    margin: 0;
    color: var(--text-2);
}
</style>
