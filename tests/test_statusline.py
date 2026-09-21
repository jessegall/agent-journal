import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = '''
import {lineOf, queued, said, stateOf, wordOf} from "./web/src/layout/statusline.js";
const work = (n, todo, completed) => ({n, title: "the thing", completed, data: {todo}});
const agent = (status, running) => ({data: {status, running}});
console.log(JSON.stringify({
    working: lineOf(agent("working"), [work(1, 12, 0)]),
    busyDoing: lineOf(agent("working", {what: "reading gist.js", tool: "Read", at: 1}), [work(1, 12, 1)], false, "reading gist.js"),
    variety: ["auto", "idle", "bearings"].map((k) => new Set(Array.from({length: 40}, (_, i) => said(k, i))).size),
    busyDone: lineOf(agent("working", {what: "ls", at: 1, done: 2}), [work(1, 12, 1)], false, ""),
    idleLast: lineOf(agent("idle"), [work(1, 12, 1)]),
    idleFresh: lineOf(agent("idle"), []),
    autoIdle: [wordOf("idle", true), wordOf("idle", false), wordOf("working", true), lineOf(agent("idle"), [], true).startsWith("for ")],
    queue: [
        queued([{n: 1, completed: 0, deleted: 0, data: {}}], true),
        queued([{n: 1, completed: 0, deleted: 0, data: {}}], false),
        queued([{n: 1, completed: 1, deleted: 0, data: {}}], true),
        queued([{n: 1, completed: 0, deleted: 0, data: {blocked: "x"}}], true),
        queued([{n: 1, completed: 0, deleted: 0, data: {after: 2}}, {n: 2, completed: 0, deleted: 0, data: {}}], true),
        queued([{n: 1, completed: 0, deleted: 0, data: {}}], true, [{completed: 0, deleted: 0, refs: ["todo:1"]}]),
    ],
    stopped: lineOf(null, []),
    states: [stateOf(agent("working"), [work(1, 0, 0)]), stateOf(agent("working"), []), stateOf(agent("idle"), [])],
}));
'''


def test_statusline_wording_for_working_idle_and_stopped_agents():
    got = json.loads(subprocess.run(["node", "--input-type=module", "-e", SCRIPT], cwd=ROOT, text=True, capture_output=True, check=True, timeout=60).stdout)
    assert got["working"] == "to-do 12 · the thing", "working names the row, without 'on'"
    assert got["busyDoing"] == "reading gist.js", "busy with nothing declared says what the journal says it is doing, in the journal's words"
    assert all(n >= 10 for n in got["variety"]) is True, "every state the viewer words for itself has at least ten wordings"
    assert got["busyDone"] in ("finding its bearings", "looking around", "thinking", "getting oriented", "working out what is next",
                               "taking stock", "considering", "mulling it over", "reading the room", "gathering its thoughts"), \
        "busy with nothing running is a bearings phrase, never the last work"
    assert ("the thing" in got["idleLast"], "the thing" in got["idleFresh"]) == (False, False), \
        "idle says one of its ten wordings, never the last work"
    assert got["autoIdle"] == ["Waiting", "Idle", "Working", True], "under auto an idle moment reads as Waiting for the next row, not Idle"
    assert got["queue"] == [True, False, False, False, True, False], \
        "waiting only while auto has a ready row: not with auto off, an empty list, a blocked row; a row waiting on another still counts the other"
    assert got["stopped"] == "no agent is on this environment", "no agent, no line"
    assert got["states"] == ["working", "busy", "idle"], "states: declared work is working, undeclared is busy, idle is idle"
