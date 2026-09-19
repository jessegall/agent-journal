import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tests.kit import check, done

root = Path(__file__).resolve().parents[1]
script = '''
import {lineOf, stateOf} from "./web/src/layout/statusline.js";
const work = (n, todo, completed) => ({n, title: "the thing", completed, data: {todo}});
const agent = (status, running) => ({data: {status, running}});
console.log(JSON.stringify({
    working: lineOf(agent("working"), [work(1, 12, 0)]),
    busyDoing: lineOf(agent("working", {what: "reading gist.js", at: 1}), [work(1, 12, 1)]),
    busyDone: lineOf(agent("working", {what: "ls", at: 1, done: 2}), [work(1, 12, 1)]),
    idleLast: lineOf(agent("idle"), [work(1, 12, 1)]),
    idleFresh: lineOf(agent("idle"), []),
    stopped: lineOf(null, []),
    states: [stateOf(agent("working"), [work(1, 0, 0)]), stateOf(agent("working"), []), stateOf(agent("idle"), [])],
}));
'''
got = json.loads(subprocess.run(["node", "--input-type=module", "-e", script], cwd=root, text=True, capture_output=True, check=True).stdout)
check("working names the row, without 'on'", got["working"], "to-do 12 · the thing")
check("busy with nothing declared says what it is doing", got["busyDoing"], "reading gist.js")
check("busy with nothing running is finding its bearings, never the last work", got["busyDone"], "finding its bearings")
check("idle remembers the last work; fresh idle waits", (got["idleLast"], got["idleFresh"]), ("last on to-do 12 · the thing", "waiting for you"))
check("no agent, no line", got["stopped"], "no agent is on this environment")
check("states: declared work is working, undeclared is busy, idle is idle", got["states"], ["working", "busy", "idle"])
done()
