<script setup>
import {computed, onMounted, ref} from "vue";
import {useWindow} from "@journal/window-kit";

// the assign tab: the targets a person gives rules to, the rules of the chosen one in the order where the first match
// wins, and a form for a new rule; every change names the revision of the rules it was made from, so a change made
// from an older reading is refused and the tab reads the rules again; a rule is tried on one task before it is
// saved, which assigns nothing
const WRITES_CODE = "journal.suites.coding.main-writes-code";
const props = defineProps({draft: {type: Object, required: true}, readOnly: Boolean});
const view = useWindow();
const board = computed(() => view.props.assign.data.value);
const chosen = ref("main");
const failure = ref("");
let conditionCount = 0;
const newCondition = () => ({id: ++conditionCount, field: "complexity", operator: "minimum", value: ""});
const conditions = ref([newCondition()]);

onMounted(() => view.reload("assign"));

const target = computed(() => board.value?.targets.find((entry) => entry.key === chosen.value) ?? board.value?.targets[0]);
const rules = computed(() => (board.value?.rules ?? []).filter((rule) => rule.target_key === target.value?.key));
const operatorsOf = (field) => board.value?.fields.find((entry) => entry.field === field)?.operators ?? [];
const needsValue = (condition) => operatorsOf(condition.field).find((entry) => entry.operator === condition.operator)?.needs_value ?? false;
const mainWritesNoCode = computed(() => target.value?.target === "main" && props.draft.value(WRITES_CODE) === false);

function targetFlags(entry) {
    const flags = {main: ["--target", "main"], agent: ["--target", "agent", "--agent", `row:${entry.agent_id}`], model: ["--target", "model", "--program", entry.program, "--model", entry.program_model]};
    return flags[entry.target];
}

const conditionText = (condition) => [condition.field, condition.operator, needsValue(condition) ? condition.value : ""].filter(Boolean).join(" ");

async function change(words) {
    const answer = await view.run([...words, "--revision", board.value.revision, "--environment", view.environment]);
    failure.value = answer.ok ? "" : answer.error;
    await view.reload("assign");
    return answer.ok;
}

function chooseField(condition, field) {
    condition.field = field;
    condition.operator = operatorsOf(field)[0]?.operator ?? "";
    condition.value = "";
}

async function addRule() {
    const words = ["assign-rule", "make", ...targetFlags(target.value), ...conditions.value.flatMap((condition) => ["--condition", conditionText(condition)])];
    if (await change(words)) conditions.value = [newCondition()];
}

const move = (rule, step) => change(["assign-rule", "move", String(rule.id), "--to", String(rule.position + step)]);
const turn = (rule) => change(["assign-rule", rule.enabled ? "disable" : "enable", String(rule.id)]);
const remove = (rule) => change(["assign-rule", "delete", String(rule.id)]);

const trialTask = ref("");
const trial = ref(null);

const recent = ref("");
const conditionFlags = () => conditions.value.map((condition) => `--condition ${JSON.stringify(conditionText(condition))}`).join(" ");

async function tryRule() {
    const answer = await view.read(`assign-rule try ${Number(trialTask.value)} ${conditionFlags()} --environment ${view.environment}`);
    failure.value = answer.ok ? "" : answer.error;
    trial.value = answer.ok ? answer.value : null;
}

async function countRecent() {
    const answer = await view.read(`assign-rule recent ${conditionFlags()} --environment ${view.environment}`);
    failure.value = answer.ok ? "" : answer.error;
    recent.value = answer.ok ? answer.value.text : "";
}
</script>

<template>
    <section class="assign" data-agent-settings-assign>
        <template v-if="board">
            <div class="targets" role="listbox" aria-label="Give tasks to">
                <template v-for="entry in board.targets" :key="entry.key">
                    <button type="button" :class="['target', {chosen: entry.key === target?.key}]" :aria-selected="entry.key === target?.key" :data-assign-target="entry.key" @click="chosen = entry.key">
                        <span class="name">{{ entry.label }}</span>
                        <span class="facts">{{ entry.description }}</span>
                        <template v-if="entry.target === 'agent'">
                            <span class="facts">State: {{ entry.running ? "running" : "kept" }} · Open tasks: {{ entry.open_tasks }}</span>
                        </template>
                    </button>
                </template>
            </div>
            <div class="rules">
                <p class="note">The rules are tried in order and the first match wins.</p>
                <template v-for="rule in rules" :key="rule.id">
                    <div :class="['rule', {off: !rule.enabled, warned: rule.warning}]" :data-assign-rule="rule.id">
                        <span class="place">{{ rule.position }}</span>
                        <span class="summary">{{ rule.summary }}</span>
                        <template v-if="rule.warning">
                            <span class="warning" data-assign-warning>{{ rule.warning }}</span>
                        </template>
                        <template v-if="!readOnly">
                            <span class="actions">
                                <button type="button" title="Move the rule up" :disabled="rule.position === 1" @click="move(rule, -1)">↑</button>
                                <button type="button" title="Move the rule down" :disabled="rule.position === board.rules.length" @click="move(rule, 1)">↓</button>
                                <button type="button" :title="rule.enabled ? 'Turn the rule off' : 'Turn the rule on'" @click="turn(rule)">{{ rule.enabled ? "Turn off" : "Turn on" }}</button>
                                <button type="button" title="Delete the rule" @click="remove(rule)">Delete</button>
                            </span>
                        </template>
                    </div>
                </template>
                <template v-if="!rules.length">
                    <p class="empty">No rules give tasks to {{ target?.label }} yet.</p>
                </template>
                <template v-if="!readOnly">
                    <form class="editor" data-assign-editor @submit.prevent="addRule">
                        <p class="all">A task must meet all of these conditions:</p>
                        <template v-for="(condition, place) in conditions" :key="condition.id">
                            <div class="condition">
                                <select :value="condition.field" aria-label="Condition" @change="chooseField(condition, $event.target.value)">
                                    <template v-for="entry in board.fields" :key="entry.field">
                                        <option :value="entry.field">{{ entry.field === "any" ? "Any task" : entry.field }}</option>
                                    </template>
                                </select>
                                <select v-model="condition.operator" aria-label="Comparison">
                                    <template v-for="entry in operatorsOf(condition.field)" :key="entry.operator">
                                        <option :value="entry.operator">{{ entry.label }}</option>
                                    </template>
                                </select>
                                <template v-if="needsValue(condition)">
                                    <input v-model="condition.value" aria-label="Value" placeholder="For example: 4 or migration" />
                                </template>
                                <button type="button" title="Remove the condition" :disabled="conditions.length === 1" @click="conditions.splice(place, 1)">Remove</button>
                            </div>
                        </template>
                        <button type="button" @click="conditions.push(newCondition())">Add a condition</button>
                        <template v-if="mainWritesNoCode">
                            <p class="warning" data-assign-main-warning>The main agent writes no code here, so a rule that gives it a task is skipped.</p>
                        </template>
                        <div class="trial">
                            <input v-model="trialTask" type="number" min="1" aria-label="Task to try the rule on" placeholder="Task number" data-assign-trial-task />
                            <button type="button" :disabled="!trialTask" data-assign-try @click="tryRule">Try on this task</button>
                            <button type="button" data-assign-count @click="countRecent">Count the last 20 tasks</button>
                        </div>
                        <template v-if="recent">
                            <p class="verdict" data-assign-recent>{{ recent }}</p>
                        </template>
                        <template v-if="trial">
                            <div class="trial-result" data-assign-trial>
                                <p class="verdict">{{ trial.matches ? "The rule would match" : "The rule would not match" }} task {{ trial.task_id }}. Nothing is assigned.</p>
                                <template v-for="result in trial.conditions" :key="result.label">
                                    <p :class="['said', {missed: !result.matched}]">{{ result.label }}: {{ result.matched ? "met" : "not met" }}</p>
                                </template>
                            </div>
                        </template>
                        <button type="submit" class="save">Add the rule</button>
                    </form>
                </template>
                <template v-if="failure">
                    <p class="failure" role="alert" data-assign-failure>{{ failure }}</p>
                </template>
            </div>
        </template>
    </section>
</template>

<style scoped>
.assign { display: grid; grid-template-columns: minmax(180px, 1fr) 2fr; gap: 16px; padding: 14px 18px 22px; overflow-y: auto; }
.targets { display: flex; flex-direction: column; gap: 4px; }
.target { display: flex; flex-direction: column; align-items: flex-start; padding: 6px 10px; border: 1px solid var(--border-2); border-radius: 8px; background: none; color: var(--text); text-align: left; cursor: pointer; }
.target.chosen { border-color: var(--accent); background: var(--accent-dim, var(--hover)); }
.facts { color: var(--text-3); font-size: 11.5px; }
.rules { display: flex; flex-direction: column; gap: 8px; }
.note, .all, .empty { margin: 0; color: var(--text-3); font-size: 12px; }
.rule { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border: 1px solid var(--border-2); border-radius: 8px; }
.rule.off { opacity: 0.6; }
.rule.warned { border-color: var(--warn); }
.place { min-width: 18px; color: var(--text-3); }
.summary { flex: 1; }
.warning { color: var(--warn); font-size: 12px; }
.actions { display: flex; gap: 4px; }
.editor { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
.condition { display: flex; gap: 6px; }
.trial { display: flex; gap: 6px; }
.trial-result { padding: 6px 10px; border: 1px solid var(--border-2); border-radius: 8px; }
.verdict, .said { margin: 0; font-size: 12px; }
.said.missed { color: var(--warn); }
.failure { margin: 0; color: var(--danger, var(--warn)); font-size: 12px; }
</style>
