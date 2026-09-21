import json
import random
import subprocess
import time
from pathlib import Path

import pytest

import features
from controllers.types import Agents, Works
from engine.hooks import handle
from features.statusline.feature import bar
from features.statusline.queue import DRAINING, GRAY, VERBS
from providers import PROVIDERS
from resources.base import AGENT, SYSTEM
from tests.conftest import fresh

SAMPLES = 5000
SESSION = "s"
JOURNALS = ["journal message read 7", "journal todo add 12", "journal work log 3 x", "journal question answer 9",
            "journal message unread", "journal pin strike 4", "journal report archive 2", "journal plan acknowledge 1",
            "journal doc final 5", "journal suggestion withdraw 3", "journal environment prepare side"]
SHELL = ["curl http://x", "npx prettier --write a.vue", "mkdir -p a/b/c", "mv one.py two.py", "echo hi",
         "while read -r l; do echo $l; done < a.txt", "timeout 60 node build.js", "env FOO=1 python3 -c 'print(1)'"]
GIT = ["git commit -m x", "git add -A", "git push", "git checkout -b dev", "git stash", "git merge main"]
READS = ["cat notes.md", "sed -n 1,20p features/statusline/queue.py", "ls -la", "head -3 VERSION", "wc -l web/src/store.js",
         "git log --oneline -5", "curl -s http://127.0.0.1/api | head -c 200; ls runtime/changes.json"]
SEARCHES = ["grep -rn def features", "rg needle src", "find . -name 'test_*.py'", "cat *.md", "ls web/src/*.js"]
BUILDS = ["npm run build", "cd web && npm run build", "npx vite build"]
PICTURES = ["shot.png", "diagram.svg", "notes.pdf"]
MOVIES = ["clip.mp4", "screen.mov"]


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_five_thousand_sampled_commands_render_correctly_on_the_bar_and_the_viewer_plays_them_back(tmp_path):
    random.seed(20260920)
    record = fresh("main")
    project = record.root.parent
    subprocess.run(["git", "init", "-q"], cwd=project, check=True, timeout=30)
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "start"], cwd=project, check=True, timeout=30)
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

    def a_shell():
        ran("Bash", {"command": random.choice(SHELL)})
        return "running", ""

    def a_git():
        ran("Bash", {"command": random.choice(GIT)})
        return "git", ""

    def a_shell_read():
        ran("Bash", {"command": random.choice(READS)})
        return "reading", ""

    def a_build():
        ran("Bash", {"command": random.choice(BUILDS)})
        return "building", ""

    def a_picture():
        name = random.choice(PICTURES)
        (project / name).write_text(str(random.random()))
        ran("Read", {"file_path": str(project / name)})
        return "viewing", name

    def a_film():
        name = random.choice(MOVIES)
        (project / name).write_text(str(random.random()))
        ran("Read", {"file_path": str(project / name)})
        return "watching", name

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

    def a_search():
        if random.random() < 0.5:
            ran("Bash", {"command": random.choice(SEARCHES)})
            return "searching", ""
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

    doing = (an_edit, a_read, a_journal, a_shell, a_test, a_delete, an_install, a_build, a_search, a_fetch, a_dispatch, a_skill,
             an_mcp, a_git, a_shell_read, a_picture, a_film)

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
        verb, name = random.choice(doing)()
        shown = bar(agents.by_session(SESSION), time.time())["queue"]
        queues.append(shown)
        last = shown[-1]
        said = settled(last)
        if last["parts"][0]["value"] != verb:
            wrong_verb.append((verb, said))
        values = " ".join(str(v) for part in last["parts"] for v in (part["value"] if isinstance(part["value"], list) else [part["value"]]))
        if name and name not in values:
            unnamed.append((name, values))
        if any(p["color"] == GRAY for p in last["parts"][1:]) or last["parts"][0]["color"] != GRAY:
            grays.append(said)
        if last["parts"][0]["value"] == "reading" and any(p.get("increments") for p in last["parts"]):
            counted_reads.append(said)
        if "  " in said or said != said.strip():
            empties.append(said)

    assert wrong_verb[:3] == [], "5000 commands run through the hooks, and every one is on the bar under the right verb"
    assert unnamed[:3] == [], "every command that worked on something names it"
    assert grays[:3] == [], "the verb is the only gray part, on every one of them"
    assert counted_reads[:3] == [], "a reading message never carries line counts"
    assert empties[:3] == [], "no message ever renders an empty part or a double space"
    assert sorted({q[-1]["parts"][0]["value"] for q in queues} - set(VERBS.values()) - {"using"}) == [], \
        "every verb on the bar is one the journal knows"
    assert sorted((set(VERBS.values()) | {"using"}) - {q[-1]["parts"][0]["value"] for q in queues}) == [], \
        "every verb the journal has a word for is driven end to end"

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
    sampled = tmp_path / "statusline-queues.json"
    sampled.write_text(json.dumps(queues[::5]))
    played = json.loads(subprocess.run(["node", "--input-type=module", "-e", script, str(sampled)],
                                       cwd=Path(__file__).resolve().parents[3], text=True, capture_output=True, check=True, timeout=300).stdout)

    def shows(message):
        return settled(message, 0) if message["hold"] == DRAINING else settled(message)

    missing = [(shows(m), frames) for queue, frames in zip(queues[::5], played) for m in queue if shows(m) not in frames]
    assert missing[:2] == [], "the viewer plays every message of every queue, exactly as the journal wrote it, settled unless the queue is draining"
    assert max(len(f) for f in played) > 2, "a queue of several messages shows several lines, one after the other"
    assert (time.time() - began) / SAMPLES < 1, "a sample costs less than a second"
