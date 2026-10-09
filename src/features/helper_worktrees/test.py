from pathlib import Path

import features
from engine.worktree import tip
from controllers.types import Environments
from features.helper_worktrees.controller import Worktrees
from providers import PROVIDERS
from resources.base import AGENT, SYSTEM
from runner.hooks import handle
from tests.conftest import refused
from tests.kit import commit, git, nudges_with_briefs, project_on


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
    (project / "deps").mkdir()
    (project / ".worktreelinks").write_text("deps\n")
    said = Worktrees(record, actor=AGENT).cut("rhea", helper="Rhea")
    row = Worktrees(record, actor=AGENT).all()[0]
    folder = Path(row.path)
    assert (row.working, row.base, row.branch, row.helper) == ("phone-connection", working_tip, "helper-rhea", "Rhea"), \
        "the row names the working branch, the commit it was cut at, its branch and its helper"
    assert git(folder, "rev-parse", "HEAD") == working_tip and (folder / "later.txt").is_file(), \
        "the worktree starts at the working branch's tip, with its latest commit, not at main"
    assert str(folder) in said and "helper-rhea" in said, "the path and branch are printed for the dispatch prompt"
    assert (folder / ".journal").resolve() == record.root.resolve(), "the helper writes to the project's journal"
    assert (folder / "deps").resolve() == (project / "deps").resolve(), "a folder .worktreelinks lists, like node_modules, is linked in, not copied"
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
    from engine.gates import Runs
    from features.helper_worktrees.interceptors import TellDrift
    assert TellDrift.runs == Runs.ASYNC, "drift is told in a message after the call is answered, never by holding the call back"
    assert "rebase it onto phone-connection" in refused(lambda: worktrees.take(row.n)), "a stale branch is refused, with the rebase to do"
    git(folder, "rebase", "-q", "phone-connection")
    assert worktrees.take(row.n).startswith("took 1 commit from helper-rhea onto phone-connection"), "a rebased branch is taken"
    assert (project / "helper.txt").read_text() == "from the helper\n" and git(project, "log", "-1", "--format=%s") == "write helper.txt", \
        "the helper's commit lands on the working branch by cherry-pick"


def test_take_asks_for_a_wording_review_when_the_helper_changed_viewer_text():
    features.load()
    repo = project_on("phone-connection")
    worktrees = Worktrees(repo.record, actor=AGENT)
    worktrees.cut("rhea")
    row = worktrees.all()[0]
    folder = Path(row.path)
    (folder / "src" / "web" / "src").mkdir(parents=True)
    commit(folder, "src/web/src/Field.vue", '<FormField label="Watch for the words in" />\n')
    asked = refused(lambda: worktrees.take(row.n))
    assert "Watch for the words in" in asked and f"journal worktree take {row.n} --reviewed" in asked, \
        "a helper's new viewer text is read against rule 59 before it is taken, and the refusal names a line and the way on"
    assert worktrees.take(row.n, reviewed=True).startswith("took 1 commit"), "once reviewed, it is taken"


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
    worktrees.cut("gus")
    other = next(found for found in worktrees.all() if found.title == "gus")
    assert "nothing to take" in refused(lambda: worktrees.take(other.n)), "a worktree with no commits of its own has nothing to take"
    side = Path(other.path)
    git(side, "checkout", "-q", "-b", "side")
    commit(side, "side.txt", "aside\n")
    git(side, "checkout", "-q", other.branch)
    commit(side, "own.txt", "own\n")
    git(side, "merge", "--no-ff", "-q", "-m", "merge the side", "side")
    assert "carries merge commits" in refused(lambda: worktrees.take(other.n)), "a branch with a merge in it is rebased flat before it is taken"
    git(project, "checkout", "-q", "-b", "elsewhere")
    assert "switch it back before taking" in refused(lambda: worktrees.take(other.n)), "a main checkout that moved to another branch takes nothing"
    git(project, "checkout", "-q", "phone-connection")
    worktrees.update(other.n, base="")
    assert "no working branch to measure against" in refused(lambda: worktrees.drift(other.n)), "a worktree that lost its base cannot be measured"


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
    drifts = lambda: [f"{title}. {brief}" for title, brief in nudges_with_briefs(record) if "since your worktree was cut" in title]

    def told(hook: dict) -> str:
        before = len(drifts())
        reason = handle(provider, record.root, record.env, hook).get("reason", "")
        return " ".join([*drifts()[before:], reason]).strip()
    helper = lambda: told({**read, "agent_id": "rhea"})
    assert helper() == "", "nothing is said while the working branch has not moved"
    assert worktrees._checked_tips().get(str(worktrees.all()[0].n)) == tip(project, "phone-connection"), \
        "the tip it checked is kept on this machine, not in the shared row, so the next tool call runs no git"
    commit(project, "main.txt", "meanwhile\n")
    told_tip = helper()
    assert (told_tip.startswith("phone-connection moved since your worktree was cut"), "1 commit" in told_tip, f"Rebase onto phone-connection in {folder}" in told_tip) == \
        (True, True, True), "the helper is told the branch moved, what it gained and where to rebase"
    assert helper() == "", "once for that tip"
    assert "moved" not in told(read), "the main agent reading the helper's files is never told to rebase"
    commit(project, "again.txt", "and again\n")
    assert "It gained 2 commits" in helper(), "a new tip is told again"
    strayed = {**read, "cwd": str(folder)}
    assert "another checkout" in handle(provider, record.root, record.env, strayed).get("reason", ""), \
        "the main agent sitting in a helper's checkout is refused before a compaction can move it there"
    going_home = {**strayed, "tool_name": "Bash", "tool_input": {"command": f"cd {project}"}}
    assert "another checkout" not in handle(provider, record.root, record.env, going_home).get("reason", ""), "going back is let through"
    codex = lambda command: handle(PROVIDERS["codex"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "codex-1", "cwd": str(folder),
                                                                                    "tool_name": "exec_command", "tool_input": {"cmd": command}}).get("reason", "")
    assert ("another checkout" in codex("ls"), "another checkout" in codex(f"cd {project}")) == (True, False), "a Codex agent is held to its own checkout the same way"
    Environments(record, actor=SYSTEM).create("helper-env", folder=str(folder))
    inside = {**strayed, "agent_id": "rhea"}
    assert "another checkout" not in handle(provider, record.root, "helper-env", inside).get("reason", ""), "a helper environment whose folder is a worktree works inside it"
    assert "another checkout" in handle(provider, record.root, record.env, strayed).get("reason", ""), "the main agent in that same folder is still refused"
    from engine.worktree import git
    by_hand = project.parent / "by-hand"
    git(project, "worktree", "add", "-q", "-b", "by-hand", str(by_hand), "HEAD")
    adopted = worktrees._adopt(by_hand, "Ada")
    assert (adopted.adopted, adopted.working, adopted.helper, adopted.path) == (True, "phone-connection", "Ada", str(by_hand)), \
        "a checkout cut by hand and given to a helper is followed as the journal's own worktrees are"
    commit(project, "later.txt", "moved on\n")
    row, found = worktrees._drifted((by_hand,), ())
    assert (row.helper, found.commits.startswith("1 commit")) == ("Ada", True), "and its helper is told when the branch it came from moves"
    worktrees._released("Ada")
    assert not [r for r in worktrees.rows.standing() if r.adopted], "finishing the helper lets the followed checkout go, and leaves the checkout itself"
    assert by_hand.is_dir(), "the checkout is left as it was"


def test_drop_removes_the_worktree_and_its_branch_but_keeps_its_last_commit():
    features.load()
    repo = project_on("phone-connection")
    record, project = repo.record, repo.project
    worktrees = Worktrees(record, actor=AGENT)
    worktrees.cut("rhea")
    row = worktrees.all()[0]
    folder = Path(row.path)
    commit(folder, "helper.txt", "kept\n")
    (folder / "loose.txt").write_text("not committed\n")
    worktrees.complete(row.n)
    assert (folder.exists(), git(project, "branch", "--list", "helper-rhea")) == (False, ""), "the worktree and its branch are gone"
    kept = git(project, "rev-parse", "refs/journal/helpers/rhea")
    assert git(project, "show", f"{kept}:loose.txt") == "not committed", "work left uncommitted is committed to the branch first and kept under refs/journal/helpers, never refused or thrown away"
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


def test_a_new_repository_a_detached_head_and_a_missing_git_identity_are_refused_in_plain_words(monkeypatch):
    from tests.conftest import fresh
    features.load()
    record = fresh()
    record.root.mkdir(parents=True, exist_ok=True)
    project = record.root.resolve().parent
    git(project, "init", "-q", "-b", "main")
    said = refused(lambda: Worktrees(record, actor=AGENT).cut("rhea"))
    assert "has no commits" in said and "invalid reference" not in said, said
    from engine.worktree import branched
    assert "could not be made from main" in branched(project, "ticket-1", "main"), "a branch off a repository with no commits is refused, not skipped"
    repo = project_on("phone-connection")
    git(repo.project, "checkout", "-q", "--detach")
    assert "is on no branch" in refused(lambda: Worktrees(repo.record, actor=AGENT).cut("rhea"))
    git(repo.project, "checkout", "-q", "phone-connection")
    worktrees = Worktrees(repo.record, actor=AGENT)
    worktrees.cut("rhea")
    row = worktrees.all()[0]
    commit(Path(row.path), "helper.txt", "from the helper\n")
    git(repo.project, "config", "--unset", "user.email")
    git(repo.project, "config", "--unset", "user.name")
    monkeypatch.setenv("GIT_CONFIG_GLOBAL", "/dev/null")
    monkeypatch.setenv("GIT_CONFIG_SYSTEM", "/dev/null")
    monkeypatch.setenv("GIT_AUTHOR_NAME", "")
    monkeypatch.setenv("GIT_COMMITTER_NAME", "")
    monkeypatch.setenv("EMAIL", "")
    said = refused(lambda: worktrees.take(row.n))
    assert "was undone" in said and "Traceback" not in said and git(repo.project, "status", "--porcelain") == "", said


def test_a_branch_is_merged_where_it_is_checked_out_or_without_a_checkout_and_conflicts_are_named(tmp_path):
    from engine.worktree import branched, checked_out, contains, merged_into

    repo = project_on("work")
    project = repo.project
    base = commit(project, "shared.txt", "base\n")
    git(project, "checkout", "-q", "-b", "side")
    commit(project, "side.txt", "side\n")
    git(project, "checkout", "-q", "work")
    assert (merged_into(project, "side", "work"), (project / "side.txt").exists()) == ("", True), "a branch is merged into the one checked out here"
    assert checked_out(project, "work") == project.resolve() and checked_out(project, "nowhere") is None, "the checkout of a branch is found, or there is none"

    git(project, "checkout", "-q", "-b", "clash", base)
    commit(project, "shared.txt", "clash\n")
    git(project, "checkout", "-q", "work")
    commit(project, "shared.txt", "work\n")
    outcome = merged_into(project, "clash", "work")
    assert outcome and git(project, "status", "--porcelain") == "", "a merge that conflicts here is named and undone"

    git(project, "checkout", "-q", "main")
    assert merged_into(project, "clash", "work").startswith("it conflicts with work"), "a conflict without any checkout is named too"
    git(project, "checkout", "-q", "-b", "clean", "work")
    commit(project, "clean.txt", "clean\n")
    git(project, "checkout", "-q", "main")
    commit_on_work = git(project, "rev-parse", "work")
    assert (merged_into(project, "clean", "work"), contains(project, "clean", "work"), git(project, "rev-parse", "work") != commit_on_work) == ("", True, True), \
        "without a checkout the merge is written straight into the branch"

    assert branched(project, "fresh-one", "work") == "" and git(project, "rev-parse", "fresh-one") == git(project, "rev-parse", "work"), "a missing branch is made at the start"
    assert "could not be made" in branched(project, "other", "no-such-start"), "a start that does not exist is named"
    git(project, "branch", "behind", base)
    assert branched(project, "behind", "work", fresh=True) == "" and git(project, "rev-parse", "behind") == git(project, "rev-parse", "work"), "a branch that only fell behind is moved up"
    assert branched(project, "behind", "work", fresh=True) == "", "a branch already at the start is left alone"
    held = tmp_path / "held"
    git(project, "worktree", "add", "-q", "-b", "held-branch", str(held), base)
    assert branched(project, "held-branch", "work", fresh=True) == "" and git(held, "rev-parse", "HEAD") == git(project, "rev-parse", "work"), \
        "a checked out branch that fell behind is brought up where it is checked out"
    git(held, "checkout", "-q", "-b", "diverged")
    commit(held, "own.txt", "own work\n")
    assert "holds work from before and is checked out" in branched(project, "diverged", "work", fresh=True), "a checked out branch with work of its own is not touched"
    git(project, "worktree", "remove", "--force", str(held))
    assert branched(project, "diverged", "work", fresh=True) == "" and git(project, "branch", "--list", "diverged-set-aside-*"), \
        "a branch with work of its own that nobody holds is set aside and made again"
