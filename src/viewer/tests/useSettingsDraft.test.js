import {expect, test, vi} from "vitest";
import {useSettingsDraft} from "@journal/setting-components";

const NUMBER_RULE = JSON.stringify({rule: "number", minimum: 0, integer: true, maximum: null, exclusive: false});

const node = (key, kind, value, extra = {}) => ({key, kind, component: kind, section: "S", parent: null, title: key.toUpperCase(), description: "", value, default: value, source: "default", choices: [], rule: "", requires: [], read_only: false, ...extra});
const screens = (revisions = {work: "w1", tests: "t1"}) => [
    {screen: "work", revision: revisions.work, nodes: [node("auto", "flag", true), node("nested", "number", 3, {parent: "auto", requires: ["auto"], rule: NUMBER_RULE}), node("names", "list", ["a", "b"])]},
    {screen: "tests", revision: revisions.tests, nodes: [node("limit", "number", 3, {rule: NUMBER_RULE}), node("fast", "number list", [1, 2])]},
];

function drafted(answer = {ok: true}) {
    const run = vi.fn(async () => answer);
    const reload = vi.fn(async () => {});
    const draft = useSettingsDraft({run, reload});
    draft.load(screens());
    return {draft, run, reload};
}

test("an untouched draft holds the values as they were read and has no change", () => {
    const {draft} = drafted();
    expect(draft.value("auto")).toBe(true);
    expect(draft.value("limit")).toBe("3");
    expect(draft.value("names")).toEqual(["a", "b"]);
    expect(draft.changes()).toEqual([]);
    expect(draft.canSave.value).toBe(false);
});

test("one change on each of two screens gives two changes and one request that carries both", async () => {
    const {draft, run, reload} = drafted();
    draft.set("auto", false);
    draft.set("limit", "5");
    expect(draft.changes()).toEqual([{key: "auto", title: "AUTO", from: "on", to: "off"}, {key: "limit", title: "LIMIT", from: "3", to: "5"}]);
    expect(await draft.apply()).toBe(true);
    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(["setting-screen", "apply", "work", "--revision", "w1", "--also", "tests=t1", "auto=off", "limit=5"]);
    expect(reload).toHaveBeenCalledTimes(1);
});

test("a list is sent as a list and a number list as comma text", async () => {
    const {draft, run} = drafted();
    draft.set("names", ["a", "c"]);
    draft.set("fast", [1, 4]);
    await draft.apply();
    expect(run).toHaveBeenCalledWith(["setting-screen", "apply", "work", "--revision", "w1", "--also", "tests=t1", 'names=["a","c"]', "fast=1,4"]);
});

test("only the screens that changed are named in the request", async () => {
    const {draft, run} = drafted();
    draft.set("limit", "5");
    await draft.apply();
    expect(run).toHaveBeenCalledWith(["setting-screen", "apply", "tests", "--revision", "t1", "limit=5"]);
});

test("a blank number blocks saving and says a number is missing", async () => {
    const {draft, run} = drafted();
    draft.set("limit", "  ");
    expect(draft.errors("limit")).toBe("A number is missing.");
    expect(draft.canSave.value).toBe(false);
    expect(draft.reason.value).toBe("A number is missing.");
    expect(await draft.apply()).toBe(false);
    expect(run).not.toHaveBeenCalled();
});

test("a number that breaks the rule of its setting blocks saving and says the rule", () => {
    const {draft} = drafted();
    draft.set("limit", "-2");
    expect(draft.errors("limit")).toBe("Use a whole number of 0 or more.");
    expect(draft.canSave.value).toBe(false);
    draft.set("limit", "2.5");
    expect(draft.errors("limit")).toBe("Use a whole number of 0 or more.");
    draft.set("limit", "4");
    expect(draft.errors("limit")).toBe("");
    expect(draft.canSave.value).toBe(true);
});

test("a setting under a switch that is off in the draft is hidden and its change is not sent", async () => {
    const {draft, run} = drafted();
    draft.set("nested", "9");
    expect(draft.visible("nested")).toBe(true);
    expect(draft.changes().map((change) => change.key)).toEqual(["nested"]);
    draft.set("auto", false);
    expect(draft.visible("nested")).toBe(false);
    expect(draft.changes().map((change) => change.key)).toEqual(["auto"]);
    await draft.apply();
    expect(run).toHaveBeenCalledWith(["setting-screen", "apply", "work", "--revision", "w1", "auto=off"]);
});

test("a hidden setting with a blank number does not block saving", () => {
    const {draft} = drafted();
    draft.set("nested", "");
    draft.set("auto", false);
    expect(draft.errors("nested")).toBe("");
    expect(draft.canSave.value).toBe(true);
});

test("screens that changed under a draft with a change make it stale, which blocks saving until it is reset", async () => {
    const {draft, run} = drafted();
    draft.set("limit", "5");
    draft.load(screens({work: "w1", tests: "t2"}));
    expect(draft.stale.value).toBe(true);
    expect(draft.canSave.value).toBe(false);
    expect(draft.reason.value).toBe("These settings changed since you opened them. Cancel to read them again.");
    expect(await draft.apply()).toBe(false);
    expect(run).not.toHaveBeenCalled();
    draft.reset();
    expect(draft.stale.value).toBe(false);
    expect(draft.changes()).toEqual([]);
});

test("screens that changed under a draft with no change are taken at once", () => {
    const {draft} = drafted();
    const next = screens({work: "w1", tests: "t2"});
    next[1].nodes[0] = node("limit", "number", 8, {rule: NUMBER_RULE});
    draft.load(next);
    expect(draft.stale.value).toBe(false);
    expect(draft.value("limit")).toBe("8");
});

test("a refusal keeps the draft and shows the reason", async () => {
    const {draft, reload} = drafted({ok: false, error: "limit must be at least 0, not -1"});
    draft.set("limit", "5");
    expect(await draft.apply()).toBe(false);
    expect(draft.value("limit")).toBe("5");
    expect(draft.changes()).toHaveLength(1);
    expect(draft.reason.value).toBe("limit must be at least 0, not -1");
    expect(reload).not.toHaveBeenCalled();
});

test("reset drops the changes of every screen and the reason", async () => {
    const {draft} = drafted({ok: false, error: "refused"});
    draft.set("auto", false);
    draft.set("limit", "5");
    await draft.apply();
    draft.reset();
    expect(draft.changes()).toEqual([]);
    expect(draft.value("auto")).toBe(true);
    expect(draft.value("limit")).toBe("3");
    expect(draft.reason.value).toBe("");
});

test("after a save the draft holds what the screens say now and has no change", async () => {
    const {draft, reload} = drafted();
    reload.mockImplementation(async () => draft.load(screens({work: "w2", tests: "t2"}).map((screen) => ({...screen, nodes: screen.nodes.map((entry) => (entry.key === "limit" ? {...entry, value: 5} : entry))}))));
    draft.set("limit", "5");
    await draft.apply();
    expect(draft.changes()).toEqual([]);
    expect(draft.stale.value).toBe(false);
    expect(draft.value("limit")).toBe("5");
});

test("values filled together are sent even for a setting that is hidden, and a reset forgets them", async () => {
    const {draft, run} = drafted();
    draft.fill({auto: false, nested: "9", unknown: true});
    expect(draft.visible("nested")).toBe(false);
    expect(draft.changes().map((change) => change.key)).toEqual(["auto", "nested"]);
    await draft.apply();
    expect(run).toHaveBeenCalledWith(["setting-screen", "apply", "work", "--revision", "w1", "auto=off", "nested=9"]);
    draft.reset();
    draft.set("auto", false);
    expect(draft.changes().map((change) => change.key)).toEqual(["auto"]);
});

test("a screen read later is taken into a draft that holds a change, which keeps its change", async () => {
    const {draft, run} = drafted();
    draft.set("limit", "5");
    draft.load([{screen: "helper-type.workers", revision: "h1", nodes: [node("workers", "number", 2, {rule: NUMBER_RULE})]}]);
    expect(draft.stale.value).toBe(false);
    expect(draft.value("workers")).toBe("2");
    draft.set("workers", "4");
    await draft.apply();
    expect(run).toHaveBeenCalledWith(["setting-screen", "apply", "tests", "--revision", "t1", "--also", "helper-type.workers=h1", "limit=5", "workers=4"]);
});

test("a screen read again with a new revision makes a draft that began from it stale, and one that began from another does not", () => {
    const {draft} = drafted();
    draft.load([{screen: "helper-type.workers", revision: "h1", nodes: [node("workers", "number", 2, {rule: NUMBER_RULE})]}]);
    draft.set("workers", "4");
    draft.load([{screen: "tests", revision: "t1", nodes: screens().find((screen) => screen.screen === "tests").nodes}]);
    expect(draft.stale.value).toBe(false);
    draft.load([{screen: "helper-type.workers", revision: "h2", nodes: [node("workers", "number", 3, {rule: NUMBER_RULE})]}]);
    expect(draft.stale.value).toBe(true);
});
