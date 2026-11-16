import {afterEach, vi} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {page, settle} from "./windowContext.js";
import ProfileRows from "../../../core/modules/profiles/web/src/ProfileRows.vue";
import {profileWindowContext, PROGRAMS} from "./profileWindowContext.js";

// the Profiles page drawn in the document for the tests of its rows and of its editor
vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
    unobserve() {}
});

export const RESEARCHER = {name: "journal-researcher", description: "Researches a question and reports what it found", agent_type: "helper", access: "read-only", program: "", occupant: "when-cold", mcp_tools: [], fallback_programs: [], changed: [], module: "journal.suites.coding", notes: [], problem: "", module_text_changed: false, model: "sonnet", codex_model: "gpt-6.1-sol", program_models: {claude: "sonnet", codex: "gpt-6.1-sol"}, body: "You research.", shipped: true, uses: 3, last_used: Date.now() / 1000 - 600};
export const BUILDER = {name: "builder", description: "Writes a bounded change", agent_type: "worker", access: "writing", program: "", occupant: "when-cold", mcp_tools: [], fallback_programs: [], changed: [], module: "", notes: [], problem: "", module_text_changed: false, model: "", codex_model: "gpt-6-luna", program_models: {claude: "", codex: "gpt-6-luna"}, body: "You build.", shipped: false, uses: 0, last_used: 0};
export const ROUTED = {...BUILDER, name: "routed", description: "Reads on one program, then another", program: "claude", preferred_program: true, fallback_programs: ["codex"]};
export const TYPES = [{key: "helper", label: "Helper", access: "read-only", extends: "", declares_occupant: true}, {key: "worker", label: "Worker", access: "writing", extends: "helper", declares_occupant: false}];
export const SKILLS = {ok: true, value: {profile: "journal-researcher", rows: [
    {key: "journal", description: "Find your way in the journal", state: "on", own: false, required: false, locked: true},
    {key: "journal-helpers", description: "Start a helper for a bounded read", state: "on", own: true, required: true, locked: false},
    {key: "journal-tasks", description: "Declare, log and finish the work", state: "on", own: false, required: false, locked: false},
    {key: "journal-dumps", description: "File what the user dropped", state: "off", own: false, required: false, locked: false},
]}};
let app;
export let host;

afterEach(() => {
    app?.unmount();
    host?.remove();
    document.body.innerHTML = "";
});

// the page drawn in the document, over a journal that lists these profiles and answers each line it runs as the given function says
export async function drawn(profiles = [RESEARCHER, BUILDER], run = async () => ({ok: true, value: null}), programs = PROGRAMS) {
    const lines = [];
    const window_ = {...profileWindowContext({"agent programs": page(programs), "profile skills": SKILLS, "profile list": {...page(profiles), value: {...page(profiles).value, types: TYPES}}}), run: async (line) => (lines.push(line), run(line))};
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(ProfileRows)});
    app.provide(WINDOW_CONTEXT, window_);
    app.mount(host);
    await settle();
    return lines;
}

export const open = async (name) => {
    host.querySelector(`[data-row="${name}"]`).click();
    await settle();
};
export const panel = () => document.querySelector("[data-profile-panel]");
export const type = async (element, text) => {
    element.value = text;
    element.dispatchEvent(new Event("input", {bubbles: true}));
    await settle();
};
