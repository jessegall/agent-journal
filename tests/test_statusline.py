import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tests.kit import check, done

root = Path(__file__).resolve().parents[1]
script = '''
import {doingOf, kindOf, lineOf, said, stateOf} from "./web/src/layout/statusline.js";
const work = (n, todo, completed) => ({n, title: "the thing", completed, data: {todo}});
const agent = (status, running) => ({data: {status, running}});
console.log(JSON.stringify({
    working: lineOf(agent("working"), [work(1, 12, 0)]),
    busyDoing: lineOf(agent("working", {what: "reading gist.js", tool: "Read", at: 1}), [work(1, 12, 1)]),
    doing: [
        {what: "journal message read 104"}, {what: "journal todo done 5"}, {what: "python3 tests/test_gist.py"}, {what: "npm run build"},
        {what: "git commit -m x"}, {what: "git log -3"}, {what: "grep -n foo bar.py"}, {what: "python3 - <<EOF"}, {what: "ls -la"},
        {what: "editing Turn.vue", tool: "Edit"}, {what: "playwright · browser evaluate", tool: "mcp__playwright__browser_evaluate"}, {what: "x", tool: "mcp__sentry__search"},
    ].map(kindOf),
    variety: ["inbox", "journal", "tests", "build", "commit", "history", "code", "script", "service", "command", "reading", "editing", "writing", "searching", "web", "helper", "skill", "list", "browser", "tool", "bearings"].map((k) => new Set(Array.from({length: 40}, (_, i) => said(k, i))).size),
    steady: [doingOf({what: "git log", at: 1789812345.6}), doingOf({what: "git log", at: 1789812345.6}), doingOf({what: "git log", at: 1789812346.6})],
    busyDone: lineOf(agent("working", {what: "ls", at: 1, done: 2}), [work(1, 12, 1)]),
    idleLast: lineOf(agent("idle"), [work(1, 12, 1)]),
    idleFresh: lineOf(agent("idle"), []),
    stopped: lineOf(null, []),
    states: [stateOf(agent("working"), [work(1, 0, 0)]), stateOf(agent("working"), []), stateOf(agent("idle"), [])],
}));
'''
got = json.loads(subprocess.run(["node", "--input-type=module", "-e", script], cwd=root, text=True, capture_output=True, check=True).stdout)
check("working names the row, without 'on'", got["working"], "to-do 12 · the thing")
check("busy with nothing declared says the kind of thing it is doing, never the command", got["busyDoing"] in ("reading the code", "reading a file", "looking at a file", "studying the source", "reading closely", "going through a file", "taking in a file", "reading the implementation", "looking it over", "reading"), True)
check("commands and tools map to kinds", got["doing"], ["inbox", "journal", "tests", "build", "commit", "history", "code", "script", "code", "editing", "browser", "service"])
check("every kind has at least ten wordings", all(n >= 10 for n in got["variety"]), True)
check("the wording is steady while the same thing runs and varies between runs", (got["steady"][0] == got["steady"][1], got["steady"][0] != got["steady"][2]), (True, True))
check("busy with nothing running is a bearings phrase, never the last work", got["busyDone"] in ("finding its bearings", "looking around", "thinking", "getting oriented", "working out what is next", "taking stock", "considering", "mulling it over", "reading the room", "gathering its thoughts"), True)
check("idle remembers the last work; fresh idle waits", (got["idleLast"], got["idleFresh"]), ("last on to-do 12 · the thing", "waiting for you"))
check("no agent, no line", got["stopped"], "no agent is on this environment")
check("states: declared work is working, undeclared is busy, idle is idle", got["states"], ["working", "busy", "idle"])
done()
