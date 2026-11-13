import {computed, reactive, ref} from "vue";
import {listItems, sentList} from "./listText.js";
import {numberRuleProblem} from "./numberRule.js";

const BLANK_NUMBER = "A number is missing.";
const STALE_TEXT = "These settings changed since you opened them. Cancel to read them again.";
const NUMBER_LIST = "number list";

const isList = (node) => node.node_type === "list" || node.node_type === NUMBER_LIST;

// the value a draft holds for a node: a switch is on or off, a list is the entries, anything else is its text
function drafted(node) {
    if (node.node_type === "flag") return Boolean(node.value);
    if (isList(node)) return Array.isArray(node.value) ? [...node.value] : listItems(node.value);
    return node.value === null || node.value === undefined ? "" : String(node.value);
}

// one value compared with another in the form it is shown in
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

// the words that show a value in the foot and that go to the server
function worded(node, value) {
    if (node.node_type === "flag") return value ? "on" : "off";
    if (isList(node)) return value.join(", ");
    return String(value).trim();
}

// the draft of every screen of a settings modal at once: what each setting holds now in the draft, which are
// changed, what is wrong with them, and one save of all of them together or none. view.run sends a line of the
// journal; reload reads the screens again and gives them to load.
export function useSettingsDraft({run, reload}) {
    const draft = reactive({});
    const pinned = reactive({});
    const base = ref([]);
    const latest = ref([]);
    const failure = ref("");
    const pending = ref(false);

    const nodes = computed(() => base.value.flatMap((screen) => screen.nodes));
    const nodeOf = (key) => nodes.value.find((node) => node.key === key);
    const changedUnder = () => base.value.some((screen) => latest.value.find((entry) => entry.screen === screen.screen)?.revision !== screen.revision);

    const visible = (key) => (nodeOf(key)?.requires ?? []).every((required) => draft[required] !== false);
    const isChanged = (key) => {
        const node = nodeOf(key);
        return node !== undefined && !same(draft[key], drafted(node));
    };
    const changedNodes = computed(() => nodes.value.filter((node) => (visible(node.key) || pinned[node.key]) && isChanged(node.key)));
    const dirty = computed(() => changedNodes.value.length > 0);
    const stale = computed(() => dirty.value && changedUnder());

    function errors(key) {
        const node = nodeOf(key);
        if (node === undefined || !visible(key) || node.node_type !== "number") return "";
        const text = String(draft[key]).trim();
        return text === "" ? BLANK_NUMBER : numberRuleProblem(node.rule, text);
    }

    const problems = computed(() => changedNodes.value.map((node) => errors(node.key)).filter(Boolean));
    const canSave = computed(() => dirty.value && problems.value.length === 0 && !stale.value && !pending.value);
    const reason = computed(() => failure.value || (stale.value ? STALE_TEXT : "") || problems.value[0] || "");

    function rebase() {
        base.value = latest.value;
        for (const key of Object.keys(draft)) delete draft[key];
        for (const key of Object.keys(pinned)) delete pinned[key];
        for (const node of nodes.value) draft[node.key] = drafted(node);
        failure.value = "";
    }

    // the screens as the journal gave them, in whole or the ones that were read again: a screen the draft has not met is
    // taken into it, and a draft that holds a change keeps its values and goes stale when a screen it began from changed
    function load(screens) {
        const names = new Set(screens.map((screen) => screen.screen));
        latest.value = [...latest.value.filter((screen) => !names.has(screen.screen)), ...screens];
        if (!dirty.value) return rebase();
        const known = new Set(base.value.map((screen) => screen.screen));
        const added = screens.filter((screen) => !known.has(screen.screen));
        base.value = [...base.value, ...added];
        for (const node of added.flatMap((screen) => screen.nodes)) draft[node.key] = drafted(node);
    }

    const changes = () => changedNodes.value.map((node) => ({key: node.key, title: node.title, from: worded(node, drafted(node)), to: worded(node, draft[node.key])}));

    function sentLine() {
        const sent = changedNodes.value;
        const screens = base.value.filter((screen) => screen.nodes.some((node) => sent.includes(node)));
        const [first, ...others] = screens;
        const pairs = sent.map((node) => `${node.key}=${isList(node) ? sentList(draft[node.key], node.node_type === NUMBER_LIST) : worded(node, draft[node.key])}`);
        return ["setting-screen", "apply", first.screen, "--revision", first.revision, ...others.flatMap((screen) => ["--also", `${screen.screen}=${screen.revision}`]), ...pairs];
    }

    // one request for every change of every screen; a refusal keeps the draft and says why
    async function apply() {
        if (!canSave.value) return false;
        pending.value = true;
        const answer = await run(sentLine());
        pending.value = false;
        failure.value = answer.ok ? "" : answer.error;
        if (!answer.ok) return false;
        await reload();
        rebase();
        return true;
    }

    // values given together, such as a preset: each is kept in the request even while the setting it belongs to is hidden
    function fill(values) {
        for (const [key, value] of Object.entries(values)) {
            if (!(key in draft)) continue;
            draft[key] = value;
            pinned[key] = true;
        }
    }

    return {draft, load, fill, value: (key) => draft[key], set: (key, value) => { draft[key] = value; }, isChanged, changes, errors, visible, dirty, stale, canSave, reason, pending, failure, apply, reset: rebase};
}
