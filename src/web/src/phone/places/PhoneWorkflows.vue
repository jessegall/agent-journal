<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import Icon from "../../kit/Icon.vue";
import ActionSheet from "../kit/ActionSheet.vue";
import Button from "../kit/Button.vue";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import EmptyList from "../kit/EmptyList.vue";
import Field from "../kit/Field.vue";
import PlaceScreen from "../kit/PlaceScreen.vue";
import SwipeRow from "../kit/SwipeRow.vue";
import PhoneSheet from "../PhoneSheet.vue";

const KIND = {trigger: "Trigger", check: "Check", action: "Action"};
const PORT = {then: "Next step", yes: "If yes, go to", no: "If no, go to"};
const WORD = {then: "Next", yes: "Yes", no: "No"};
const END = "End here (nothing follows)";
const HELP = "{{name}}";

const props = defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open"]);

const workflows = ref([]);
const catalogue = ref([]);
const current = ref(0);
const shipped = ref(false);
const title = ref("");
const revision = ref(0);
const nodes = ref([]);
const lines = ref([]);
const past = ref([]);
const busy = ref("");
const failed = ref("");
const loaded = ref(false);
const sheet = ref("");
const porting = ref(null);
const trial = ref(null);
let fresh = 0;

const entries = computed(() => Object.fromEntries(catalogue.value.map((e) => [`${e.kind}:${e.key}`, e])));
const entryOf = (node) => entries.value[`${node.kind}:${node.key}`] || {title: node.key, about: "", takes_text: false};
const byId = computed(() => Object.fromEntries(nodes.value.map((n) => [String(n.id), n])));
const trigger = computed(() => nodes.value.find((n) => n.kind === "trigger") || null);
const dirty = computed(() => past.value.length > 0);
const ports = (node) => (node.kind === "check" ? ["yes", "no"] : ["then"]);
const numberOf = (node) => nodes.value.indexOf(node) + 1;
const named = (node) => `${numberOf(node)} · ${entryOf(node).title}`;
const lineOf = (node, port) => lines.value.find((l) => String(l.from) === String(node.id) && l.port === port);
const targetOf = (node, port) => {
    const line = lineOf(node, port);
    return line ? byId.value[String(line.to)] || null : null;
};
const described = (entry) => (entry.about ? entry.about.charAt(0).toUpperCase() + entry.about.slice(1) : "");
const unsaved = computed(() => `${past.value.length} unsaved ${past.value.length === 1 ? "change" : "changes"}`);

function take(got) {
    current.value = got.id;
    shipped.value = got.shipped;
    title.value = got.title;
    revision.value = got.revision;
    nodes.value = got.nodes.map((n) => ({...n}));
    lines.value = got.lines.map((l) => ({...l}));
    past.value = [];
    trial.value = null;
}

async function open(id) {
    take(await api.chartOne(id));
}

onMounted(async () => {
    try {
        const got = await api.chart();
        workflows.value = got.workflows;
        catalogue.value = got.catalogue;
        const first = got.workflows.find((w) => w.shipped) || got.workflows[0];
        if (first) await open(first.id);
    } catch (error) {
        failed.value = error.message;
    } finally {
        loaded.value = true;
    }
});

// every change goes on the draft, kept apart from what the server holds until Save; Undo steps the draft back
function change(work) {
    past.value = [...past.value.slice(-39), {nodes: nodes.value.map((n) => ({...n})), lines: lines.value.map((l) => ({...l}))}];
    work();
}

function undo() {
    const last = past.value.pop();
    if (!last) return;
    nodes.value = last.nodes;
    lines.value = last.lines;
}

function discard() {
    if (!past.value.length) return;
    const first = past.value[0];
    nodes.value = first.nodes;
    lines.value = first.lines;
    past.value = [];
}

function setText(node, text) {
    change(() => {
        node.text = text;
    });
}

function connect(node, port, target) {
    change(() => {
        lines.value = lines.value.filter((l) => !(String(l.from) === String(node.id) && l.port === port));
        if (target) lines.value.push({from: node.id, to: target.id, port});
    });
}

function remove(node) {
    change(() => {
        nodes.value = nodes.value.filter((n) => n.id !== node.id);
        lines.value = lines.value.filter((l) => String(l.from) !== String(node.id) && String(l.to) !== String(node.id));
    });
}

// a new node goes to the end of the list, under the last node and connected to its first free output
function add(entry) {
    change(() => {
        fresh += 1;
        const last = nodes.value.at(-1) || null;
        const from = last && last.kind !== "trigger" ? ports(last).find((p) => !lineOf(last, p)) : last ? "then" : null;
        const node = {
            id: `new-${fresh}`,
            kind: entry.kind,
            key: entry.key,
            text: "",
            x: last ? last.x : 400,
            y: last ? last.y + 128 : 0,
            shipped: false,
        };
        nodes.value.push(node);
        if (last && from && node.kind !== "trigger") lines.value.push({from: last.id, to: node.id, port: from});
    });
}

async function act(name, work) {
    busy.value = name;
    failed.value = "";
    try {
        await work();
    } catch (error) {
        failed.value = error.message;
    } finally {
        busy.value = "";
    }
}
const save = () =>
    act("save", async () => {
        take(await api.chartSave(current.value, {revision: revision.value, nodes: nodes.value, lines: lines.value}));
        workflows.value = (await api.chart()).workflows;
    });
const reset = () => act("reset", async () => take(await api.chartReset(current.value)));
const removeWorkflow = () =>
    act("remove", async () => {
        await api.chartRemove(current.value);
        const got = await api.chart();
        workflows.value = got.workflows;
        const first = got.workflows.find((w) => w.shipped) || got.workflows[0];
        if (first) await open(first.id);
    });
const create = (event) =>
    act("create", async () => {
        const made = await api.chartNew({title: "", trigger: event.key});
        workflows.value = (await api.chart()).workflows;
        await open(made.id);
    });
const test = () =>
    act("try", async () => {
        const ran = await api.chartTry(trigger.value ? trigger.value.key : "idle", "");
        trial.value = ran;
    });

// the sheets: every choice is an action sheet, as the phone does it
const STATE_PLACE = {base: "Default · every state"};
function placeOf(workflow) {
    const place = placeWords(workflow);
    return workflow.off ? `${place} · off` : place;
}
function placeWords(workflow) {
    if (workflow.state) return STATE_PLACE[workflow.state] || `Default · the ${workflow.state.replace("_", " ")} state`;
    if (workflow.event)
        return `Yours · at ${catalogue.value.find((e) => e.kind === "trigger" && e.key === workflow.event)?.title || workflow.event}`;
    return "Yours";
}
const workflowActions = computed(() =>
    workflows.value.map((w) => ({key: String(w.id), label: w.title, sub: placeOf(w), check: w.id === current.value, run: () => open(w.id)}))
);
const eventActions = computed(() =>
    catalogue.value.filter((e) => e.kind === "trigger").map((e) => ({key: e.key, label: e.title, sub: described(e), run: () => create(e)}))
);
const nodeActions = computed(() =>
    catalogue.value
        .filter((e) => e.kind !== "trigger" || !trigger.value)
        .map((e) => ({
            key: `${e.kind}:${e.key}`,
            label: e.title,
            sub: `${KIND[e.kind]}${e.about ? ` · ${described(e)}` : ""}`,
            run: () => add(e),
        }))
);
const portActions = computed(() => {
    if (!porting.value) return [];
    const {node, port} = porting.value;
    const now = targetOf(node, port);
    return [
        {key: "", label: END, check: !now, run: () => connect(node, port, null)},
        ...nodes.value
            .filter((n) => n.id !== node.id && n.kind !== "trigger")
            .map((n) => ({key: String(n.id), label: named(n), check: now && now.id === n.id, run: () => connect(node, port, n)})),
    ];
});
const workflowOwn = computed(() => [
    {
        key: "reset",
        label: "Reset to default",
        sub: shipped.value
            ? "Replace this workflow with the version the journal ships"
            : "Only the default workflow has a version to reset to",
        danger: shipped.value,
        run: () => shipped.value && (sheet.value = "confirm-reset"),
    },
    {
        key: "remove",
        label: "Delete workflow",
        sub: shipped.value ? "The default workflow can be reset, not deleted" : "The workflow and its nodes are deleted",
        danger: !shipped.value,
        run: () => !shipped.value && (sheet.value = "confirm-remove"),
    },
]);
const confirmActions = computed(() =>
    sheet.value === "confirm-reset"
        ? [{key: "reset", label: "Reset to default", sub: "Your edits to this workflow are lost", danger: true, run: reset}]
        : [{key: "remove", label: "Delete workflow", sub: "The workflow and its nodes are deleted", danger: true, run: removeWorkflow}]
);
const deleteNode = (node) => [{key: "delete", label: "Delete node", tone: "danger", run: () => remove(node)}];

function pickPort(node, port) {
    porting.value = {node, port};
    sheet.value = "port";
}

// the test's steps: each node on the path with how it was left, Yes or No for a check, its kind otherwise
const steps = computed(() => {
    if (!trial.value) return [];
    return trial.value.nodes.map((id, i) => {
        const node = byId.value[String(id)];
        const next = trial.value.nodes[i + 1];
        const line =
            node && next !== undefined ? lines.value.find((l) => String(l.from) === String(id) && String(l.to) === String(next)) : null;
        return {
            id,
            title: node ? entryOf(node).title : String(id),
            answer: node && node.kind === "check" ? (line ? WORD[line.port] : "") : node ? KIND[node.kind] : "",
            tone: node && node.kind === "check" ? (line ? line.port : "") : "kind",
        };
    });
});
</script>

<template>
    <PlaceScreen title="Workflows" sub="What the journal does when the agent does something" :back="back" @back="emit('back')">
        <template #end>
            <Button kind="link" :disabled="!trigger" @click="sheet = 'test'">Test</Button>
        </template>

        <template v-if="loaded && failed && !nodes.length">
            <EmptyList icon="warn" title="The workflows did not load" :reason="failed" />
        </template>
        <template v-else-if="loaded">
            <CellGroup>
                <Cell
                    :label="title || 'Workflow'"
                    :sub="`${shipped ? 'Default · ' : ''}${nodes.length} ${nodes.length === 1 ? 'node' : 'nodes'}`"
                    icon="bolt"
                    @pick="sheet = 'workflows'"
                />
            </CellGroup>
            <div class="wf-row">
                <Button kind="plain" @click="sheet = 'events'">New workflow</Button>
            </div>
            <p v-if="failed" class="wf-failed">{{ failed }}</p>

            <template v-if="!nodes.length">
                <EmptyList
                    icon="bolt"
                    :title="shipped ? 'This workflow is off' : 'No nodes yet'"
                    :reason="
                        shipped
                            ? 'It has no nodes, so the journal does nothing here. Add a trigger, or reset it to the default.'
                            : 'Start with a trigger: the event that starts this workflow.'
                    "
                />
            </template>
            <template v-for="node in nodes" :key="node.id">
                <CellGroup
                    :head="`${numberOf(node)} · ${KIND[node.kind]}`"
                    :foot="entryOf(node).takes_text && node.kind === 'action' ? `Insert values with ${HELP}` : ''"
                >
                    <SwipeRow :label="entryOf(node).title" :trail="deleteNode(node)">
                        <Cell :label="entryOf(node).title" :sub="described(entryOf(node))" still />
                    </SwipeRow>
                    <template v-if="entryOf(node).takes_text">
                        <div class="wf-text">
                            <Field
                                :model-value="node.text"
                                :label="node.kind === 'check' ? 'A number, or a setting\'s name' : 'Message to the agent'"
                                :area="node.kind === 'action'"
                                @update:model-value="setText(node, $event)"
                            />
                        </div>
                    </template>
                    <template v-for="port in ports(node)" :key="port">
                        <Cell :label="PORT[port]" @pick="pickPort(node, port)">
                            <template #lead>
                                <span :class="['wf-dot', port, {on: targetOf(node, port)}]" aria-hidden="true" />
                            </template>
                            <template #end>
                                <span :class="['wf-target', {none: !targetOf(node, port)}]">
                                    {{ targetOf(node, port) ? named(targetOf(node, port)) : "End here" }}
                                </span>
                                <Icon name="chevronRight" :size="14" class="wf-chev" />
                            </template>
                        </Cell>
                    </template>
                </CellGroup>
            </template>

            <CellGroup head="Workflow" :foot="shipped ? 'The default workflow can be reset, not deleted.' : ''">
                <template v-for="action in workflowOwn" :key="action.key">
                    <Cell
                        :label="action.label"
                        :sub="action.sub"
                        :tone="action.danger ? 'danger' : 'off'"
                        :chevron="false"
                        @pick="action.run"
                    />
                </template>
            </CellGroup>
        </template>

        <template #foot>
            <div class="wf-foot">
                <div class="wf-footline">
                    <span>{{ dirty ? unsaved : "Nothing to save" }}</span>
                    <Button kind="link" :disabled="!dirty" @click="undo">Undo</Button>
                    <Button kind="link" :disabled="!dirty" @click="discard">Discard changes</Button>
                </div>
                <div class="wf-row">
                    <Button kind="plain" fill @click="sheet = 'nodes'">Add node</Button>
                    <Button kind="primary" fill :busy="busy === 'save'" :disabled="!dirty" @click="save">Save</Button>
                </div>
            </div>
        </template>
    </PlaceScreen>

    <template v-if="sheet === 'workflows'">
        <ActionSheet title="Workflow" :about="title" line="the one to edit" :actions="workflowActions" @close="sheet = ''" />
    </template>
    <template v-if="sheet === 'events'">
        <ActionSheet
            title="New workflow"
            about="Pick its event"
            line="the workflow is born with its trigger"
            :actions="eventActions"
            @close="sheet = ''"
        />
    </template>
    <template v-if="sheet === 'nodes'">
        <ActionSheet
            title="Add node"
            about="Checks and actions"
            line="added at the end and connected to the last node"
            :actions="nodeActions"
            @close="sheet = ''"
        />
    </template>
    <template v-if="sheet === 'port' && porting">
        <ActionSheet
            :title="PORT[porting.port]"
            :about="named(porting.node)"
            :line="`where the ${WORD[porting.port]} answer goes`"
            :actions="portActions"
            @close="sheet = ''"
        />
    </template>
    <template v-if="sheet === 'confirm-reset' || sheet === 'confirm-remove'">
        <ActionSheet
            :title="sheet === 'confirm-reset' ? `Replace ‘${title}’ with the default version?` : `Delete ‘${title}’?`"
            :about="title"
            line="the other workflows stay as they are"
            :actions="confirmActions"
            @close="sheet = ''"
        />
    </template>
    <template v-if="sheet === 'test'">
        <PhoneSheet label="Test with event" tall @close="sheet = ''">
            <template #head>
                <h2 class="wf-sheet-title">Test with event</h2>
                <p class="wf-sheet-sub">
                    {{ trigger ? entryOf(trigger).title : "No trigger" }} · changes nothing; runs against current data
                </p>
            </template>
            <div class="wf-sheet-body">
                <Button kind="primary" fill :busy="busy === 'try'" @click="test">Test</Button>
                <template v-if="trial">
                    <CellGroup head="Steps">
                        <template v-if="steps.length">
                            <template v-for="(step, i) in steps" :key="`${step.id}-${i}`">
                                <Cell :label="step.title" still>
                                    <template #lead>
                                        <span class="wf-step">{{ i + 1 }}</span>
                                    </template>
                                    <template #end>
                                        <span :class="['wf-answer', step.tone]">{{ step.answer }}</span>
                                    </template>
                                </Cell>
                            </template>
                        </template>
                        <template v-else>
                            <Cell label="No trigger for this event. Nothing happens." still :chevron="false" />
                        </template>
                    </CellGroup>
                    <CellGroup head="Result">
                        <template v-if="trial.would.length">
                            <template v-for="line in trial.would" :key="line">
                                <Cell :label="line" still :chevron="false" />
                            </template>
                        </template>
                        <template v-else>
                            <Cell label="Nothing is done: the path ends without an action." still :chevron="false" />
                        </template>
                    </CellGroup>
                </template>
            </div>
        </PhoneSheet>
    </template>
</template>

<style scoped>
.wf-row {
    display: flex;
    gap: 10px;
    margin: 12px 0 0;
}

.wf-failed {
    margin: 10px 4px 0;
    color: var(--danger-soft);
    font-size: 0.875rem;
}

.wf-text {
    padding: 8px 14px 10px;
}

.wf-dot {
    flex: none;
    width: 10px;
    height: 10px;
    border: 1.5px solid var(--border-3);
    border-radius: 50%;
    --c: var(--text-3);
}

.wf-dot.yes {
    --c: var(--tone-good);
}

.wf-dot.no {
    --c: var(--danger-soft);
}

.wf-dot.on {
    border-color: var(--c);
    background: var(--c);
}

.wf-target {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text-2);
    font-size: 1rem;
    text-align: right;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.wf-target.none {
    color: var(--text-3);
}

.wf-chev {
    flex: none;
    color: var(--text-3);
}

.wf-foot {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.wf-foot .wf-row {
    margin: 0;
}

.wf-footline {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--text-3);
    font-size: 0.9375rem;
}

.wf-footline span {
    margin-right: auto;
}

.wf-sheet-title {
    margin: 0;
    font-size: 1.0625rem;
}

.wf-sheet-sub {
    margin: 2px 0 0;
    color: var(--text-3);
    font-size: 0.8125rem;
}

.wf-sheet-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px 0 14px;
}

.wf-step {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 600;
}

.wf-answer {
    font-size: 0.9375rem;
}

.wf-answer.yes {
    color: var(--tone-good);
}

.wf-answer.no {
    color: var(--danger-soft);
}

.wf-answer.kind {
    color: var(--text-4);
}
</style>
