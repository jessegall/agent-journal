import {readFileSync, readdirSync, statSync} from "node:fs";
import {join, resolve} from "node:path";
import {expect, test} from "vitest";
import {agentName, agentNumber, agentTitle} from "../src/domain/agentTitle.js";

const SOURCE_ROOT = resolve(import.meta.dirname, "../..");
const FUNNEL = join(SOURCE_ROOT, "viewer/src/domain/agentTitle.js");

function sourceFiles(folder) {
    return readdirSync(folder).flatMap((name) => {
        const path = join(folder, name);
        if (["node_modules", "dist", "tests", "__pycache__"].includes(name)) return [];
        if (statSync(path).isDirectory()) return sourceFiles(path);
        return /\.(vue|js)$/.test(name) ? [path] : [];
    });
}

const WINDOW_SOURCES = [join(SOURCE_ROOT, "viewer/src"), join(SOURCE_ROOT, "viewer/kit"), join(SOURCE_ROOT, "core/modules"), join(SOURCE_ROOT, "suites")];

test("an agent is titled by its profile's name and has its role and number beside it", () => {
    expect(agentTitle({id: 900, role: "worker", number: 848, given_name: "Ada"}, {profile: "journal-worker-senior"})).toEqual({title: "Worker senior", subtext: "worker 848", text: "Worker senior · worker 848", name: "Worker 848"});
    expect(agentTitle({id: 7, role: "helper", number: 820, profile: "journal-planner"}, {given_name: "Madame Curie"})).toEqual({title: "Planner", subtext: "helper 820", text: "Planner · helper 820", name: "Helper 820"});
    expect(agentTitle({id: 8, role: "helper", number: 5, profile: "journal-merger", given_name: "Noah"}).title).toBe("Merger");
});

test("an agent with no profile shows its role and number, and the main agent only its title", () => {
    expect(agentTitle({id: 3, role: "worker", number: 3}).text).toBe("Worker 3");
    expect(agentTitle({id: 1, role: "main", number: 1}, {profile: "journal-orchestrator"})).toEqual({title: "Main agent", subtext: "", text: "Main agent", name: "Main agent"});
    expect(agentNumber({role: "helper", number: 12})).toBe("helper 12");
});

test("no other code builds an agent's title: none reads a given name or joins a role with an id", () => {
    const builders = WINDOW_SOURCES.flatMap(sourceFiles).filter((path) => path !== FUNNEL).filter((path) => {
        const text = readFileSync(path, "utf8");
        return /given_name|givenName/.test(text) || /\$\{[^}]*role[^}]*\} \$\{[^}]*\b(number|id)\b[^}]*\}/.test(text);
    });
    expect(builders.map((path) => path.slice(SOURCE_ROOT.length))).toEqual([]);
});

test("the name of an agent is the one the server builds for a worker, a helper and the main agent", () => {
    const names = JSON.parse(readFileSync(join(SOURCE_ROOT, "../tests/snapshots/agent_names.json"), "utf8"));
    expect(names.map((each) => agentName(each))).toEqual(names.map((each) => each.title));
    expect(names.map((each) => agentTitle(each).name)).toEqual(names.map((each) => each.title));
});
