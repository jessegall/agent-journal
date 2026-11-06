import {computed, onUnmounted, ref} from "vue";
import {useWindow} from "@journal/window-kit";

export function useSkillsPage() {
    const context = useWindow();
    const catalogue = ref([]);
    const loaded = ref([]);
    const triggers = ref([]);
    const requirements = ref({session_start: [], after_compaction: [], main_agent: [], environment_overrides: false});
    const mainAgent = ref(null);
    const answered = ref(false);
    const failure = ref("");
    const busy = ref([]);
    const opened = ref("");
    const text = ref(null);
    const openFailure = ref("");
    const tab = ref("skills");
    const draft = ref(null);
    const marked = context.option("row");
    let opening = 0;
    let loading = 0;
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
        const request = ++loading;
        const [main, entries, settings, rules] = await Promise.all([context.read("agent main"), context.read("skill list"), context.read("skill requirements"), context.read("trigger list --skill")]);
        if (request !== loading) return;
        mainAgent.value = main.ok ? main.value.id : null;
        const read = mainAgent.value ? await context.read(`agent-skill list --agent ${mainAgent.value} --limit 1000`) : null;
        if (request !== loading) return;
        catalogue.value = entries.ok ? entries.value.rows : [];
        loaded.value = read?.ok ? read.value.rows : [];
        triggers.value = rules.ok ? rules.value.rows : [];
        if (settings.ok) requirements.value = settings.value;
        failure.value = [entries, settings, rules, read].find((answer) => answer && !answer.ok)?.error || "";
        answered.value = true;
    }

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
        const answer = await context.read(["skill", "show", folder]);
        if (request !== opening) return;
        text.value = answer.ok ? answer.value : null;
        openFailure.value = answer.ok ? "" : answer.failure === "refused" ? `The skill ${folder} is no longer available.` : answer.error;
    }

    async function run(line) {
        const answer = await context.run(line);
        failure.value = answer.ok ? "" : answer.error;
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
    window.addEventListener("popstate", followHistory);
    onUnmounted(() => window.removeEventListener("popstate", followHistory));
    context.follow(["agent.*", "agent_skill.*", "setting.*", "trigger.*"], load);
    load();
    if (marked.value) context.read(`agent-skill show ${marked.value.skillId}`).then((answer) => answer.ok ? open(answer.value.skill, false) : (openFailure.value = answer.error));
    else followHistory();
    return {context, skills, selected, selectedTriggers, triggers, requirements, mainAgent, answered, failure, busy, opened, text, openFailure, tab, draft, marked, load, open, run, requireSkill, readNow};
}
