import json
import os
import random
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Agents, Works  # noqa: E402
from engine.hooks import handle  # noqa: E402
from features.statusline.feature import bar  # noqa: E402
from features.statusline.queue import DRAINING, GRAY, VERBS  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from resources.base import AGENT, SYSTEM  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

SAMPLES = 2000
SESSION = "s"
JOURNALS = ["journal message read 7", "journal todo add 12", "journal work log 3 x", "journal question answer 9"]
SHELL = ["git commit -m x", "npm run build", "curl http://x", "npx prettier --write a.vue"]
random.seed(20260920)

record = fresh("main")
project = record.root.parent
subprocess.run(["git", "init", "-q"], cwd=project, check=True)
subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "start"], cwd=project, check=True)
Works(record, actor=AGENT).create("change some files")
claude = PROVIDERS["claude"]()
agents = Agents(record, actor=SYSTEM)
payload = {"session_id": SESSION, "transcript_path": f"/t/{SESSION}.jsonl", "cwd": str(project)}


def hook(event, name, given, answer=None):
    handle(claude, record.root, "main", {**payload, "hook_event_name": event, "tool_name": name, "tool_input": given,
                                         **({"tool_response": answer} if answer else {})})


def ran(name, given, answer=None):
    hook("PreToolUse", name, given)
    hook("PostToolUse", name, given, answer)


def an_edit():
    path = project / f"{random.choice('abcdefgh')}{random.randint(1, 30)}.py"
    path.write_text("\n".join(str(random.random()) for _ in range(random.randint(1, 6))))
    ran("Edit", {"file_path": str(path)})
    return "editing", path.name


def a_read():
    path = project / "README.md"
    path.write_text("read me\n")
    ran("Read", {"file_path": str(path)})
    return "reading", path.name


def a_journal():
    ran("Bash", {"command": random.choice(JOURNALS)})
    return "journalling", ""


VERBS_FOR = {"npm run build": "building", "git commit -m x": "git"}


def a_shell():
    command = random.choice(SHELL)
    ran("Bash", {"command": command})
    return VERBS_FOR.get(command, "running"), ""


def a_test():
    passed = random.random() < 0.5
    ran("Bash", {"command": "python3 tests/test_queue.py"}, {"stdout": "9 passed, 0 failed" if passed else "0 passed, 3 failed"})
    return "testing", "test_queue.py"


def a_delete():
    path = project / "gone.txt"
    path.write_text("bye\n")
    ran("Bash", {"command": "true"})
    path.unlink()
    ran("Bash", {"command": f"rm {path.name}"})
    return "deleting", path.name


def an_install():
    ran("Bash", {"command": "pip install requests"})
    return "installing", "requests"


def a_build():
    ran("Bash", {"command": "npm run build"})
    return "building", ""


def a_search():
    ran("Grep", {"pattern": "def foo"})
    return "searching", "def foo"


def a_fetch():
    ran("WebFetch", {"url": "https://docs.example.com/a/b"})
    return "fetching", "docs.example.com"


def a_dispatch():
    ran("Agent", {"subagent_type": "auditor"})
    return "dispatching", "auditor"


def a_skill():
    ran("Skill", {"skill": "journal"})
    return "loading", "journal"


def an_mcp():
    ran("mcp__playwright__browser_take_screenshot", {})
    return "using", "playwright"


DOING = (an_edit, a_read, a_journal, a_shell, a_test, a_delete, an_install, a_build, a_search, a_fetch, a_dispatch, a_skill, an_mcp)


def settled(message, at=-1):
    said = []
    for part in message["parts"]:
        value = part["value"][at] if isinstance(part["value"], list) else part["value"]
        if value != "":
            said.append(f"{part.get('prefix', '')}{value}")
    return " ".join(said)


queues, wrong_verb, unnamed, grays, counted_reads, empties = [], [], [], [], [], []
began = time.time()
for _ in range(SAMPLES):
    verb, name = random.choice(DOING)()
    shown = bar(agents.by_session(SESSION), time.time())["queue"]
    queues.append(shown)
    last = shown[-1]
    said = settled(last)
    if last["parts"][0]["value"] != verb:
        wrong_verb.append((verb, said))
    if name and name not in said:
        unnamed.append((name, said))
    if any(p["color"] == GRAY for p in last["parts"][1:]) or last["parts"][0]["color"] != GRAY:
        grays.append(said)
    if last["parts"][0]["value"] == "reading" and any(p.get("increments") for p in last["parts"]):
        counted_reads.append(said)
    if "  " in said or said != said.strip():
        empties.append(said)

check(f"{SAMPLES} commands run through the hooks, and every one is on the bar under the right verb", wrong_verb[:3], [])
check("every command that worked on something names it", unnamed[:3], [])
check("the verb is the only gray part, on every one of them", grays[:3], [])
check("a reading message never carries line counts", counted_reads[:3], [])
check("no message ever renders an empty part or a double space", empties[:3], [])
check("every verb on the bar is one the journal knows",
      sorted({q[-1]["parts"][0]["value"] for q in queues} - set(VERBS.values()) - {"using"}), [])
check("every verb the journal has a word for is driven end to end",
      sorted((set(VERBS.values()) | {"using"}) - {q[-1]["parts"][0]["value"] for q in queues}), [])

script = """
import {line, shown} from "./web/src/layout/bar.js";
import {readFileSync} from "node:fs";
const runs = JSON.parse(readFileSync(process.argv[1], "utf8"));
console.log(JSON.stringify(runs.map((queue) => {
    let state = {at: 0, since: 0};
    const seen = [];
    for (let now = 0; now < 240; now += 0.25) {
        const got = shown(queue, state, now);
        state = {at: got.at, since: got.since};
        const said = line(got.message, got.message ? now - got.since : 0);
        const text = said ? said.parts.map((p) => `${p.prefix}${p.value}`).join(" ") : "";
        if (!seen.length || seen[seen.length - 1] !== text) seen.push(text);
    }
    return seen;
})));
"""
sampled = Path(os.environ.get("TMPDIR", "/tmp")) / "statusline-queues.json"
sampled.write_text(json.dumps(queues[::5]))
played = json.loads(subprocess.run(["node", "--input-type=module", "-e", script, str(sampled)],
                                   cwd=Path(__file__).resolve().parents[3], text=True, capture_output=True, check=True, timeout=300).stdout)
def shows(message):
    return settled(message, 0) if message["hold"] == DRAINING else settled(message)


missing = [(shows(m), frames) for queue, frames in zip(queues[::5], played) for m in queue if shows(m) not in frames]
check("the viewer plays every message of every queue, exactly as the journal wrote it, settled unless the queue is draining",
      missing[:2], [])
check("a queue of several messages shows several lines, one after the other", max(len(f) for f in played) > 2, True)
check("a sample costs less than a second", (time.time() - began) / SAMPLES < 1, True)

done()
