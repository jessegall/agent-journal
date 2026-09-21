import subprocess
import time

import pytest

import features
from controllers.types import Agents, Works
from engine.record import Record
from features.work.tracker import changes, internal, journals_own, tree_file
from features.work import tracker
from resources.base import AGENT, SYSTEM
from tests.features.kit import report
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_writes_are_attributed_to_the_open_work_by_reading_git_and_the_tree():
    record = fresh()
    project = record.root.parent
    subprocess.run(["git", "init", "-q"], cwd=project, check=True, timeout=10)
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "start"], cwd=project, check=True, timeout=10)
    (project / "kept.txt").write_text("one\ntwo\n")
    (project / "same.txt").write_text("clean\n")
    subprocess.run(["git", "add", "kept.txt", "same.txt"], cwd=project, check=True, timeout=10)
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "-m", "kept"], cwd=project, check=True, timeout=10)
    (project / "same.txt").write_text("before\n")
    (project / "prior.txt").write_text("not this work\n")
    (project / "remove.txt").write_text("gone\nsoon\n")
    works = Works(record, actor=AGENT)
    time.sleep(1.1)
    work = works.create("change some files")

    (project / "kept.txt").write_text("one\nthree\nfour\n")
    (project / "fresh.txt").write_text("a\nb\nc\n")
    report(record, "working", "PostToolUse", tool="Edit", file=str(project / "kept.txt"), wrote=True)
    files = {f["path"]: f for f in works.load(work.n).data["changed"]}
    assert (files["kept.txt"]["added"], files["kept.txt"]["removed"], files["kept.txt"]["created"]) == (2, 1, False), \
        "an edit reported with its path records that file with its line counts"
    assert sorted((p, f["created"]) for p, f in files.items()) == [("fresh.txt", True), ("kept.txt", False)], \
        "every file the step changed is on the work, the new one as created"
    agent = Agents(record, actor=SYSTEM).by_session("claude-1")
    Agents(record, actor=SYSTEM).update(agent.n, running={"what": "first", "at": time.time(), "done": time.time()})

    (project / "same.txt").write_text("during\n")
    report(record, "working", "PostToolUse", tool="Edit", file=str(project / "same.txt"), wrote=True)
    files = {f["path"]: f for f in works.load(work.n).data["changed"]}
    assert ("same.txt" in files) is True, "a dirty file edited with unchanged numstat is still attributed by content"
    first = Agents(record, actor=SYSTEM).by_session("claude-1").running["changed"]

    (project / "remove.txt").unlink()
    report(record, "working", "PostToolUse", tool="Bash", file="", wrote=True)
    files = {f["path"]: f for f in works.load(work.n).data["changed"]}
    assert (files["fresh.txt"]["created"], files["fresh.txt"]["added"]) == (True, 3), \
        "a script's writes count too: the new file is created, with its lines"
    assert ("prior.txt" in files, files["remove.txt"]["removed"]) == (False, 2), \
        "pre-existing dirt stays off the work while a deletion stays on it"
    assert any(path.startswith(".journal/") for path in files) is False, \
        "the journal's own runtime writes are never attributed to the work"
    linked = fresh("linked")
    elsewhere = linked.root.parent
    (elsewhere / "worktree").mkdir()
    (elsewhere / "worktree" / ".journal").symlink_to(elsewhere / ".journal")
    marks = internal(Record(elsewhere / "worktree" / ".journal", "linked"), elsewhere / "worktree")
    assert (journals_own(".journal/environments/main/todo/001.json", marks), journals_own(".agents/skills/journal-auto/SKILL.md", marks),
            journals_own(".claude/skills/style-imports/SKILL.md", marks), journals_own("src/app.js", marks),
            journals_own(".claude/skills/mine/SKILL.md", marks)) == (True, True, True, False, False), \
        "a journal reached through a symlink is still the journal's own, and so are the skills it generates"
    second = Agents(record, actor=SYSTEM).by_session("claude-1").running["changed"]
    assert (second["edited"], second["created"], second["deleted"]) == (first["edited"], first["created"], 1), \
        "one active turn accumulates its writes, each file counted once"

    Agents(record, actor=SYSTEM).update(agent.n, running={"what": "shrink", "at": time.time(), "done": time.time()})
    (project / "fresh.txt").write_text("a\n")
    report(record, "working", "PostToolUse", tool="Bash", file="", wrote=True)
    shrunk = Agents(record, actor=SYSTEM).by_session("claude-1").running["changed"]
    assert (shrunk["added"], shrunk["removed"]) == (0, 2), "a file cut from three lines to one shows two removed"

    agents = Agents(record, actor=SYSTEM)
    agents.update(agent.n, running={"what": "next", "at": time.time(), "before": {"what": "edit", "at": 1.0, "done": 2.0}})
    one = {"edited": 1, "created": 0, "deleted": 0, "added": 1, "removed": 0}
    tracker.count(record, agent.n, 1.0, one, ["web/src/a.vue"], [])
    running = agents.load(agent.n).running
    assert (running["what"], running["before"]["changed"]["added"], "changed" in running) == ("next", 1, False), \
        "late counts go on the finished command, the running one is kept"
    assert running["before"]["files"] == ["web/src/a.vue"], "and the files it touched go with them"
    agents.update(agent.n, running={"what": "after a prompt", "at": time.time()})
    tracker.count(record, agent.n, 1.0, one, ["web/src/a.vue"], [])
    assert ("changed" in agents.load(agent.n).running) is False, "counts whose command is gone are dropped, never put on another"

    subprocess.run(["git", "add", "-A"], cwd=project, check=True, timeout=10)
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "-m", "the change"], cwd=project, check=True, timeout=10)
    Agents(record, actor=SYSTEM).update(agent.n, running={"what": "commit", "at": 5.0, "done": 6.0})
    report(record, "working", "PostToolUse", tool="Bash", file="", wrote=True)
    assert ("changed" in Agents(record, actor=SYSTEM).by_session("claude-1").running) is False, "a commit adds and removes no lines"
    assert "fresh.txt" in {f["path"] for f in works.load(work.n).data["changed"]}, \
        "a commit keeps the work's changed files, counted against the work's start"

    Agents(record, actor=SYSTEM).update(agent.n, running={"what": "swap", "at": 7.0, "done": 8.0})
    (project / "kept.txt").write_text("one\nTHREE\nfour\n")
    report(record, "working", "PostToolUse", tool="Edit", file=str(project / "kept.txt"), wrote=True)
    swapped = Agents(record, actor=SYSTEM).by_session("claude-1").running["changed"]
    assert (swapped["edited"], swapped["added"], swapped["removed"]) == (1, 1, 1), "a changed line is one added, one removed"
    Agents(record, actor=SYSTEM).update(agent.n, running={"what": "delete", "at": 9.0, "done": 10.0})
    (project / "kept.txt").unlink()
    report(record, "working", "PostToolUse", tool="Bash", file="", wrote=True)
    gone = Agents(record, actor=SYSTEM).by_session("claude-1").running["changed"]
    assert (gone["deleted"], gone["added"], gone["removed"]) == (1, 0, 3), "deleting a file removes all its lines"
    assert [c["subject"] for c in works.load(work.n).data["commits"]] == ["the change"], \
        "the commits made since the work started are on it"

    before = works.load(work.n).updated
    report(record, "working", "PostToolUse", tool="Read", file=str(project / "kept.txt"), wrote=False)
    assert works.load(work.n).updated == before, "a read changes nothing on the work"

    baseline = tree_file(record, work.n, "base")
    works.complete(work.n, how="done")
    assert (baseline.exists(), works.load(work.n).completed > 0) == (False, True), \
        "the feature baseline lives only as long as the work"

    logged = changes(record)
    assert [(c["path"], c["kind"]) for c in logged][:2] == [("fresh.txt", "created"), ("kept.txt", "edited")], \
        "each file change is kept with when it happened, what became of it and its counts"
    assert any(c["kind"] == "deleted" for c in logged) is True, "a removal is logged as one"
