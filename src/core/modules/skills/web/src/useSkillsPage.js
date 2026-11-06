import {computed, onUnmounted, ref, watch} from "vue";
import {READ_RATES, coalesced, useWindow} from "@journal/window-kit";

export function useSkillsPage() {
    const window = useWindow();
    const {rows: catalogue} = window.props.catalogue;
    const {rows: loaded} = window.props.loaded;
    const {rows: triggers} = window.props.triggers;
    const requirements = computed(() => window.props.requirements.data.value ?? {session_start: [], after_compaction: [], main_agent: [], environment_overrides: false});
    const mainAgent = computed(() => window.props["main-agent"].data.value?.id ?? null);
    const answered = computed(() => window.props.catalogue.loaded.value && window.props.requirements.loaded.value && window.props.triggers.loaded.value);
    const commandFailure = ref("");
    const failure = computed(() => commandFailure.value || ["catalogue", "requirements", "triggers", "loaded"].map((name) => window.props[name].failure.value).find(Boolean) || "");
    const busy = ref([]);
    const opened = ref("");
    const text = ref(null);
    const openFailure = ref("");
    window.state.tab = "skills";
    const tab = computed({get: () => window.state.tab, set: (value) => (window.state.tab = value)});
    const draft = ref(null);
    const marked = window.option("row");
    let opening = 0;
    const skills = computed(() => catalogue.value.map((skill) => {
        const held = loaded.value.find((row) => row.skill === skill.folder);
        return {...skill, required: requirements.value.session_start.includes(skill.folder) || requirements.value.main_agent.includes(skill.folder),
            agents: requirements.value.main_agent.includes(skill.folder) ? "main" : "all",
            again: requirements.value.after_compaction.includes(skill.folder), held,
            read: held?.state === "loaded", changed: held?.state === "loaded" && held.digest !== skill.digest};
    }));
    const selected = computed(() => skills.value.find((skill) => skill.folder === opened.value));
    const selectedTriggers = computed(() => triggers.value.filter((trigger) => trigger.skill === opened.value));

    async function load() {
        await window.reload({only: ["main-agent", "catalogue", "requirements", "triggers", ...(mainAgent.value ? ["loaded"] : [])]});
    }

    watch(mainAgent, async (agent) => {
        loaded.value = [];
        if (!agent) return;
        window.state["loaded.agent"] = String(agent);
        await window.reload("loaded");
    });

    async function open(folder, address = true) {
        opened.value = folder;
        text.value = null;
        openFailure.value = "";
        draft.value = null;
        if (address && !marked.value) {
            const url = new URL(location.href);
            folder ? url.searchParams.set("skill", folder) : url.searchParams.delete("skill");
            history.pushState(null, "", url);
        }
        const request = ++opening;
        if (!folder) return;
        window.state["text.folder"] = folder;
        const answer = await window.readKey("text");
        if (request !== opening) return;
        text.value = answer.ok ? answer.value : null;
        openFailure.value = answer.ok ? "" : answer.failure === "refused" ? `The skill ${folder} is no longer available.` : answer.error;
    }

    async function run(line) {
        const answer = await window.run(line);
        commandFailure.value = answer.ok ? "" : answer.error;
        if (answer.ok) await load();
        return answer.ok;
    }

    async function requireSkill(folder, agents, again = true) {
        if (busy.value.includes(folder)) return;
        busy.value = [...busy.value, folder];
        await run(["skill", "set-required", folder, "--agents", agents, ...(again ? [] : ["--no-after-compaction"])]);
        busy.value = busy.value.filter((held) => held !== folder);
    }

    async function readNow() {
        if (!mainAgent.value || !selected.value) return;
        const held = selected.value.held;
        await run(held?.state === "loaded" ? ["agent-skill", "reset", String(held.id)] : ["skill", "require", String(mainAgent.value), opened.value]);
    }

    const followHistory = () => open(new URLSearchParams(location.search).get("skill") || "", false);
    globalThis.addEventListener("popstate", followHistory);
    onUnmounted(() => globalThis.removeEventListener("popstate", followHistory));
    window.follow(["agent_skill.*"], coalesced(() => {if (mainAgent.value) window.reload("loaded");}, READ_RATES.openPanel));
    if (marked.value) window.readKey(`agent-skill.${marked.value.skillId}`).then((answer) => answer.ok ? open(answer.value.skill, false) : (openFailure.value = answer.error));
    else followHistory();
    return {window, skills, selected, selectedTriggers, triggers, requirements, mainAgent, answered, failure, busy, opened, text, openFailure, tab, draft, marked, load, open, run, requireSkill, readNow};
}
