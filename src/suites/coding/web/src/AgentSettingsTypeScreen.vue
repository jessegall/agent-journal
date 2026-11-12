<script setup>
import {computed, onMounted, watch} from "vue";
import {useWindow} from "@journal/window-kit";
import {SettingBackPath, SettingPerTypeOverrideRow, SettingRow, SettingThreeWayCap, SettingsScreen} from "@journal/setting-components";
import AgentTypeAgents from "../../../../core/modules/agents/web/src/AgentTypeAgents.vue";
import {CAP_SIZES, CONTEXT_KINDS, CONTEXT_PROFILES, CONTEXT_TOKENS, PROFILE_LIMITS, READ_ONLY_KEPT, READ_ONLY_RUN, valueOf} from "./helperRows.js";

// the screen of one helper type over the table: its settings on the left, drawn from what they declare and kept in
// the one draft of the modal, and its agents on the right. A profile has no settings of its own to draw: it shows
// the limits of every read-only profile, and a value changed here becomes the profile's own.
const props = defineProps({row: {type: Object, required: true}, draft: {type: Object, required: true}, readOnly: {type: Boolean, default: false}});
const emit = defineEmits(["back"]);
const view = useWindow();

const screen = computed(() => view.props["type-screen"].data.value);
const nodes = computed(() => screen.value?.nodes ?? []);
const isProfile = computed(() => props.row.profile !== "");

async function read() {
    view.state["type-screen.type"] = props.row.screen;
    await view.reload("type-screen");
}

watch(screen, (value) => { if (value) props.draft.load([value]); });
onMounted(read);

// the entry of this profile in the list of profile limits, as its running and kept numbers
const entries = computed(() => (props.draft.value(PROFILE_LIMITS) ?? []).map((text) => text.split(":")));
const entry = computed(() => entries.value.find((parts) => parts[0] === props.row.profile));
const every = computed(() => ({running: Number(props.draft.value(READ_ONLY_RUN)), kept: Number(props.draft.value(READ_ONLY_KEPT))}));
const own = (field) => (entry.value ? Number(entry.value[field === "running" ? 1 : 2]) : null);

function change(field, value) {
    const others = entries.value.filter((parts) => parts[0] !== props.row.profile).map((parts) => parts.join(":"));
    if (value === null) return props.draft.set(PROFILE_LIMITS, others);
    if (value === "") return;
    const running = field === "running" ? value : own("running") ?? every.value.running;
    const kept = field === "kept" ? value : own("kept") ?? every.value.kept;
    props.draft.set(PROFILE_LIMITS, [...others, `${props.row.profile}:${running}:${kept}`]);
}

// the context cap of the type: its own entry in the list of caps of profiles, else the size of its kind of agent
const NO_CAP = "none";
const capProfile = computed(() => (props.row.group ? "" : props.row.profile || props.row.defaultProfile || ""));
const ownCap = computed(() => valueOf(props.draft.value(CONTEXT_PROFILES), capProfile.value));
const capMode = computed(() => (ownCap.value === undefined ? "kind" : ownCap.value === NO_CAP ? "none" : "own"));
const kindCap = computed(() => {
    const kind = valueOf(props.draft.value(CONTEXT_KINDS), props.row.role);
    if (kind === NO_CAP) return null;
    return Number(kind ?? props.draft.value(CONTEXT_TOKENS));
});

function chooseCap({mode, size}) {
    const others = (props.draft.value(CONTEXT_PROFILES) ?? []).filter((text) => text.slice(0, text.lastIndexOf(":")).trim() !== capProfile.value);
    props.draft.set(CONTEXT_PROFILES, mode === "kind" ? others : [...others, `${capProfile.value}:${mode === "none" ? NO_CAP : size}`]);
}

const openAgent = (agent) => view.open("agents.agents", agent.id);
</script>

<template>
    <div class="type" data-agent-type-screen>
        <SettingBackPath parent="Helpers" :current="row.name" @back="emit('back')" />
        <div class="typebody">
            <div class="typemain" data-type-settings>
                <template v-if="isProfile && row.screen === 'read-only'">
                    <SettingPerTypeOverrideRow label="Running" help="Agents of this profile that run at once." :every-value="every.running" :own-value="own('running')" :disabled="readOnly" data-override-running @update:own-value="(value) => change('running', value)" />
                    <SettingPerTypeOverrideRow label="Kept" help="Agents of this profile kept until retired, running or idle. At 0 there is no limit." :every-value="every.kept" :own-value="own('kept')" :disabled="readOnly" data-override-kept @update:own-value="(value) => change('kept', value)" />
                </template>
                <template v-else>
                    <SettingsScreen :nodes="nodes" :draft="draft" :read-only="readOnly" />
                </template>
                <template v-if="capProfile">
                    <SettingRow label="Context cap" help="The context size at which this type is compacted." :source="capMode === 'own' || capMode === 'none' ? 'own' : 'default'" data-context-cap>
                        <SettingThreeWayCap :mode="capMode" :kind-value="kindCap" :own-value="capMode === 'own' ? Number(ownCap) : null" :sizes="CAP_SIZES" :disabled="readOnly" @change="chooseCap" />
                    </SettingRow>
                </template>
            </div>
            <aside class="typeside">
                <h3>Agents</h3>
                <AgentTypeAgents :role="row.role" :profile="row.profile" @open-agent="openAgent" />
            </aside>
        </div>
    </div>
</template>

<style scoped>
.type { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.typebody { display: grid; grid-template-columns: minmax(0, 1fr) 340px; flex: 1; min-height: 0; overflow: hidden; }
.typemain { padding: 6px 28px 24px; overflow-y: auto; }
.typeside { padding: 18px; border-left: 1px solid var(--border); background: var(--bg-2); overflow-y: auto; }
h3 { margin: 0 0 8px; color: var(--text); font-size: 12.5px; font-weight: 600; }
</style>
