import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import {context as agentContext} from "./support/agentWindowContext.js";
import {AGENT_EDIT_KEYS} from "./support/fileFeedWindowContext.js";
import AgentFileEdits from "../../suites/coding/web/src/AgentFileEdits.vue";
import TranscriptRows from "../../core/modules/agents/web/src/TranscriptRows.vue";
import {outputWindowContext} from "./support/outputWindowContext.js";
import Output from "../../core/modules/processes/web/src/Output.vue";

const FOOT = 1000;
const row = (id, fields = {}) => ({id, author: "worker", row_type: "assistant", text: `row ${id}`, time: `2026-11-03T05:00:0${id}.000Z`, ...fields});
const edit = (id) => ({id, path: `src/file${id}.py`, edit_type: "edit", added: 1, removed: 0, rows: "[]", created_at: "2026-11-03T05:00:00+00:00"});

beforeEach(() => {
    Object.defineProperties(HTMLElement.prototype, {scrollHeight: {value: FOOT, configurable: true}, clientHeight: {value: 100, configurable: true}});
    HTMLElement.prototype.scrollTo = function scrollTo({top}) {
        this.scrollTop = top;
    };
    vi.stubGlobal("ResizeObserver", class {
        observe() {}

        disconnect() {}
    });
});

afterEach(() => {
    delete HTMLElement.prototype.scrollHeight;
    delete HTMLElement.prototype.clientHeight;
    delete HTMLElement.prototype.scrollTo;
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
});

// a window whose rows the test changes, and the call a followed event makes
function feed(line, rows) {
    const held = {rows};
    const answers = {[line]: {get ok() {return true;}, get value() {return {rows: held.rows, page: 1, size: 50, total: held.rows.length};}}};
    const window = line.startsWith("agent transcript") ? agentContext(answers) : context(answers, null, AGENT_EDIT_KEYS);
    const follows = [];
    window.follow = (patterns, heard) => {
        const follow = {patterns, heard};
        follows.push(follow);
        return () => follows.splice(follows.indexOf(follow), 1);
    };
    held.heard = (event) => Promise.all(follows.filter(({patterns}) => patterns.some((pattern) => pattern.split(".")[0] === event.event.split(".")[0])).map(({heard}) => heard(event)));
    return {window, held};
}

const paneOf = (element) => element.querySelector(".auto-scroll-pane");
const scrolledTo = async (pane, top) => {
    pane.scrollTop = top;
    pane.dispatchEvent(new Event("scroll"));
    await settle();
};
const newest = (element) => element.querySelector("[data-scroll-newest]");

test("the output window opens at the foot and follows a new line", async () => {
    const run = {id: 3, line: "make", state: "finished"};
    const held = {lines: ["one"]};
    const window = outputWindowContext({"process feed --limit 1": page([run]), "process feed --id 3": page([run]), "output peek 3 --summary": {ok: true, get value() {return {lines: held.lines};}}});
    window.follow = (patterns, heard) => (held.heard = heard);
    const element = await mounted(Output, window);
    await vi.waitFor(() => expect(element.querySelector("[data-output-text]")?.textContent).toBe("one"));
    const pane = paneOf(element);
    expect(pane.querySelector("[data-output-text]").textContent).toBe("one");
    expect(pane.scrollTop).toBe(FOOT);
    pane.scrollTop = FOOT - 10;
    held.lines = ["one", "two"];
    await held.heard({event: "output.update"});
    await settle();
    expect(pane.querySelector("[data-output-text]").textContent).toBe("one\ntwo");
    expect(pane.scrollTop).toBe(FOOT);
});

test("the transcript tab says who wrote each row and when", async () => {
    const {window} = feed("agent transcript 7", [row(1, {author: "journal", row_type: "user"}), row(2)]);
    const element = await mounted(TranscriptRows, window, {name: "transcript.7"});
    expect([...element.querySelectorAll("[data-author]")].map((author) => author.dataset.author)).toEqual(["journal", "worker"]);
    expect([...element.querySelectorAll("[data-row-time]")].map((time) => time.getAttribute("datetime"))).toEqual(["2026-11-03T05:00:01.000Z", "2026-11-03T05:00:02.000Z"]);
    expect([...element.querySelectorAll("[data-row-time]")].every((time) => time.textContent.trim() !== "")).toBe(true);
});

test("the transcript tab opens at the foot and follows a new row", async () => {
    const {window, held} = feed("agent transcript 7", [row(1), row(2)]);
    const element = await mounted(TranscriptRows, window, {name: "transcript.7"});
    const pane = paneOf(element);
    expect(pane.scrollTop).toBe(FOOT);
    pane.scrollTop = 0;
    pane.dispatchEvent(new Event("scroll"));
    pane.scrollTop = FOOT;
    pane.dispatchEvent(new Event("scroll"));
    held.rows = [row(1), row(2), row(3)];
    pane.scrollTop = FOOT - 10;
    await held.heard({event: "hook_call.create"});
    await settle();
    expect(element.querySelectorAll("[data-row]")).toHaveLength(3);
    expect(pane.scrollTop).toBe(FOOT);
});

test("scrolling up in the transcript tab stops following and shows Newest, and a new row leaves the place", async () => {
    const {window, held} = feed("agent transcript 7", [row(1), row(2)]);
    const element = await mounted(TranscriptRows, window, {name: "transcript.7"});
    const pane = paneOf(element);
    expect(newest(element).style.display).toBe("none");
    await scrolledTo(pane, 200);
    expect(newest(element).style.display).not.toBe("none");
    held.rows = [row(1), row(2), row(3)];
    await held.heard({event: "hook_call.create"});
    await settle();
    expect(pane.scrollTop).toBe(200);
    newest(element).click();
    expect(pane.scrollTop).toBe(FOOT);
});

test("the file feed tab lists the oldest edit first and the newest at the foot", async () => {
    const {window} = feed("file-edit list --agent 7", [edit(3), edit(2), edit(1)]);
    const element = await mounted(AgentFileEdits, window, {agent: 7});
    expect([...element.querySelectorAll("[data-row]")].map((item) => item.dataset.row)).toEqual(["1", "2", "3"]);
});

test("the file feed tab opens at the foot and follows a new edit", async () => {
    const {window, held} = feed("file-edit list --agent 7", [edit(2), edit(1)]);
    const element = await mounted(AgentFileEdits, window, {agent: 7});
    const pane = paneOf(element);
    expect(pane.scrollTop).toBe(FOOT);
    held.rows = [edit(3), edit(2), edit(1)];
    pane.scrollTop = FOOT - 10;
    await held.heard({event: "file_edit.create", row_id: 3});
    await settle();
    expect(element.querySelectorAll("[data-row]")).toHaveLength(3);
    expect(pane.scrollTop).toBe(FOOT);
});

test("scrolling up in the file feed tab shows Newest, and the button goes back to the newest edit", async () => {
    const {window} = feed("file-edit list --agent 7", [edit(2), edit(1)]);
    const element = await mounted(AgentFileEdits, window, {agent: 7});
    const pane = paneOf(element);
    await scrolledTo(pane, 200);
    expect(newest(element).style.display).not.toBe("none");
    newest(element).click();
    expect(pane.scrollTop).toBe(FOOT);
});
