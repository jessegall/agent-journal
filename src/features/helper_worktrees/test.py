from pathlib import Path

import features
from engine.worktree import tip
from features.helper_worktrees.controller import Worktrees
from providers import PROVIDERS
from resources.base import AGENT
from runner.hooks import handle
from tests.conftest import refused
from tests.kit import commit, git, project_on


def test_a_helper_is_not_told_about_another_environments_worktrees():
    from engine.record import Record
    from providers import DRIVERS
    from resources.base import SYSTEM
    from runner.engine import Engine
    from tests.conftest import fresh

    record = fresh("main")
    row = Worktrees(record, actor=SYSTEM).create("main-helper")
    helper = Record(record.root, "main-helper")
    assert Worktrees(helper, actor=SYSTEM).rows.summaries()[0]["environment"] == "main"
    assert f"unread worktree {row.n}" in Engine(record, DRIVERS["claude"](record, "main")).owed()
    assert "unread worktree" not in Engine(helper, DRIVERS["claude"](helper, "helper")).owed()


def test_a_worktree_is_cut_from_the_tip_of_the_working_branch_not_from_main():
    features.load()
    repo = project_on("phone-connection")
    record, project = repo.record, repo.project
    working_tip = commit(project, "later.txt", "later\n")
    said = Worktrees(record, actor=AGENT).cut("rhea", helper="Rhea")
    row = Worktrees(record, actor=AGENT).all()[0]
    folder = Path(row.path)
    assert (row.working, row.base, row.branch, row.helper) == ("phone-connection", working_tip, "helper-rhea", "Rhea"), \
        "the row names the working branch, the commit it was cut at, its branch and its helper"
    assert git(folder, "rev-parse", "HEAD") == working_tip and (folder / "later.txt").is_file(), \
        "the worktree starts at the working branch's tip, with its latest commit, not at main"
    assert str(folder) in said and "helper-rhea" in said, "the path and branch are printed for the dispatch prompt"
    assert (folder / ".journal").resolve() == record.root.resolve(), "the helper writes to the project's journal"
    assert refused(lambda: Worktrees(record, actor=AGENT).cut("rhea")).startswith("the worktree rhea is taken"), "a name is cut once"


def test_take_refuses_a_branch_behind_the_working_tip_and_lands_it_once_rebased():
    features.load()
    repo = project_on("phone-connection")
    record, project = repo.record, repo.project
    worktrees = Worktrees(record, actor=AGENT)
    worktrees.cut("rhea")
    row = worktrees.all()[0]
    folder = Path(row.path)
    commit(folder, "helper.txt", "from the helper\n")
    commit(project, "main.txt", "meanwhile\n")
    assert "phone-connection gained 1 commit" in worktrees.drift(row.n) and "does not contain" in worktrees.drift(row.n), \
        "drift names what the working branch gained and that the helper lacks its tip"
    assert "rebase it onto phone-connection" in refused(lambda: worktrees.take(row.n)), "a stale branch is refused, with the rebase to do"
    git(folder, "rebase", "-q", "phone-connection")
    assert worktrees.take(row.n).startswith("took 1 commit from helper-rhea onto phone-connection"), "a rebased branch is taken"
    assert (project / "helper.txt").read_text() == "from the helper\n" and git(project, "log", "-1", "--format=%s") == "write helper.txt", \
        "the helper's commit lands on the working branch by cherry-pick"


def test_take_refuses_a_dirty_main_checkout_only_for_the_files_it_touches():
    features.load()
    repo = project_on("phone-connection")
    record, project = repo.record, repo.project
    worktrees = Worktrees(record, actor=AGENT)
    worktrees.cut("rhea")
    row = worktrees.all()[0]
    commit(Path(row.path), "shared.txt", "changed by the helper\n")
    (project / "shared.txt").write_text("someone else's edit\n")
    assert "shared.txt" in refused(lambda: worktrees.take(row.n)), "another agent's edit to a touched file is never overwritten"
    git(project, "checkout", "--", "shared.txt")
    (project / "unrelated.txt").write_text("someone else's work\n")
    assert worktrees.take(row.n).startswith("took 1 commit"), "an unrelated uncommitted file does not stop the take"
    assert (project / "unrelated.txt").read_text() == "someone else's work\n", "and it is left as it was"


def test_a_helper_is_told_once_for_each_new_working_tip_and_the_main_agent_never():
    features.load()
    repo = project_on("phone-connection")
    record, project = repo.record, repo.project
    worktrees = Worktrees(record, actor=AGENT)
    worktrees.cut("rhea")
    folder = Path(worktrees.all()[0].path)
    provider = PROVIDERS["claude"]()
    read = {"hook_event_name": "PreToolUse", "session_id": "claude-1", "cwd": str(project), "tool_name": "Read",
            "tool_input": {"file_path": str(folder / "shared.txt")}}
    helper = lambda: handle(provider, record.root, record.env, {**read, "agent_id": "rhea"}).get("reason", "")
    assert helper() == "", "nothing is said while the working branch has not moved"
    assert worktrees.all()[0].told == tip(project, "phone-connection"), "the tip it checked is kept, so the next tool call runs no git"
    commit(project, "main.txt", "meanwhile\n")
    told = helper()
    assert told.startswith("phone-connection moved 1 commit") and "rebase onto phone-connection" in told, "the helper is told the branch moved"
    assert helper() == "", "once for that tip"
    assert "moved" not in handle(provider, record.root, record.env, read).get("reason", ""), \
        "the main agent reading the helper's files is never told to rebase"
    commit(project, "again.txt", "and again\n")
    assert helper().startswith("phone-connection moved 2 commits"), "a new tip is told again"


def test_drop_removes_the_worktree_and_its_branch_but_keeps_its_last_commit():
    features.load()
    repo = project_on("phone-connection")
    record, project = repo.record, repo.project
    worktrees = Worktrees(record, actor=AGENT)
    worktrees.cut("rhea")
    row = worktrees.all()[0]
    folder = Path(row.path)
    last = commit(folder, "helper.txt", "kept\n")
    (folder / "loose.txt").write_text("not committed\n")
    assert "uncommitted changes" in refused(lambda: worktrees.complete(row.n)), "uncommitted work is never thrown away"
    (folder / "loose.txt").unlink()
    worktrees.complete(row.n)
    assert (folder.exists(), git(project, "branch", "--list", "helper-rhea")) == (False, ""), "the worktree and its branch are gone"
    assert git(project, "rev-parse", "refs/journal/helpers/rhea") == last, "its last commit is kept under refs/journal/helpers"
    assert refused(lambda: worktrees.take(row.n)) == f"worktree {row.n} is dropped", "a dropped worktree takes nothing"


def test_a_worktree_is_not_dropped_while_an_agent_runs_in_it():
    import json
    import os
    import subprocess
    from engine import runtime
    features.load()
    repo = project_on("phone-connection")
    worktrees = Worktrees(repo.record, actor=AGENT)
    worktrees.cut("rhea")
    row = worktrees.all()[0]
    launched = runtime.sessions(repo.record.root) / "claude-1" / "launched.json"
    launched.parent.mkdir(parents=True, exist_ok=True)
    launched.write_text(json.dumps({"pid": os.getpid(), "cwd": row.path}))
    assert "still running" in refused(lambda: worktrees.complete(row.n)), "a worktree with a live agent in it is kept"
    ended = subprocess.Popen(["true"])
    ended.wait()
    launched.write_text(json.dumps({"pid": ended.pid, "cwd": row.path}))
    assert worktrees.complete(row.n).completed, "once the agent is gone the worktree drops"
