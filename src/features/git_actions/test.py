import subprocess

import features
from controllers.types import Agents
from engine import ran
from engine.record import Record
from resources.base import SYSTEM
from tests.kit import report


def test_a_checkout_that_changes_branch_is_marked_in_the_chat(tmp_path):
    features.load()

    def git(*args, cwd=tmp_path):
        return subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True, timeout=5, check=True)

    git("init", "-q", "-b", "main")
    git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "--allow-empty", "-m", "start")
    record = Record(tmp_path / ".journal", "t")
    marks = lambda session: [card["label"] for card in Agents(record, actor=SYSTEM).by_session(session).data.get("cards") or []]
    report(record, "working", "PostToolUse", cwd=str(tmp_path))
    git("switch", "-q", "-c", "custom-rule-checks")
    report(record, "working", "PostToolUse", cwd=str(tmp_path))
    report(record, "working", "PostToolUse", cwd=str(tmp_path))
    assert marks("claude-1") == ["The main checkout switched from `main` to `custom-rule-checks`"], \
        "a switch shows once, naming the checkout and both branches; the first look only notes where it stands"
    folder = tmp_path.parent / f"{tmp_path.name}-wt"
    git("worktree", "add", "-q", "-b", "worktree-ticket-16", str(folder))
    report(record, "working", "PostToolUse", session="claude-2", cwd=str(folder))
    assert marks("claude-2") == [f"Worktree {folder.name} started on `worktree-ticket-16`"], "a session starting in a worktree says which branch it starts on"


def test_each_git_command_the_agent_runs_is_marked_in_the_chat(tmp_path):
    features.load()

    def git(*args):
        return subprocess.run(["git", *args], cwd=tmp_path, capture_output=True, text=True, timeout=5, check=True).stdout

    git("init", "-q", "-b", "main")
    git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "--allow-empty", "-m", "start")
    (tmp_path / "a.txt").write_text("a")
    (tmp_path / "b.txt").write_text("b")
    git("add", "-A")
    git("stash", "push", "-q")
    record = Record(tmp_path / ".journal", "t")
    report(record, "working", "PostToolUse", cwd=str(tmp_path))
    agent = Agents(record, actor=SYSTEM).by_session("claude-1").n
    marks = lambda: [card["label"] for card in Agents(record, actor=SYSTEM).by_session("claude-1").data.get("cards") or []]

    def ran_git(command, output=""):
        ran.announce(record, agent, "Bash", command, output)

    ran_git("git stash push -m wip", "Saved working directory and index state On main: wip")
    ran_git("git stash pop", "On branch main")
    ran_git("git stash drop", "Dropped refs/stash@{0} (abc)")
    ran_git("git merge feature-x && git rebase -q main", "")
    ran_git("git cherry-pick abc1234def", "")
    ran_git("git reset --hard HEAD~1", "")
    ran_git("git revert --no-edit abc1234", "")
    ran_git("git tag v1.2", "")
    ran_git("git -C . push origin main", "")
    ran_git("git pull --rebase origin main", "")
    ran_git("git fetch", "")
    ran_git("git worktree add ../wt -b helper-x", "")
    ran_git("git worktree remove ../wt", "")
    ran_git("git branch helper-y", "")
    ran_git("git branch -D helper-y", "")
    ran_git("git status && git log --oneline && git commit -m x && git stash list", "")
    ran_git("git merge nope", "fatal: nope - not something we can merge")
    ran_git("""git commit -q -m "$(printf 'it'"'"'s done')" && git tag v1.3""", "")
    ran_git("git branch -D quote-hotfix 2>&1 | tail -1", "Deleted branch quote-hotfix (was abc1234).")
    ran_git("git worktree remove $S/quote-hotfix", "")
    ran_git('git worktree add "${S:?}/x-hotfix" origin/main', "")
    ran_git("""git commit -q -m "$(printf 'subject\\n\\nbody')" """, "")
    ran_git("for c in v1.4 v1.5; do git tag $c; done; git tag $c", "")
    ran_git('git tag "$e" && git tag -d "${e}" && git push origin "$e"', "")
    assert marks() == [
        "Stashed 2 changed files", "Popped the latest stash", "Dropped the latest stash",
        "Merged `feature-x` into `main`", "Rebased `main` onto `main`", "Cherry-picked `abc1234` onto `main`",
        "Reset `main` hard to `HEAD~1`", "Reverted `abc1234` on `main`", "Tagged `v1.2`",
        "Pushed `main` to `origin`", "Pulled `main` from `origin`", "Fetched from `origin`",
        "Added worktree `../wt` on branch `helper-x`", "Removed worktree `../wt`",
        "Created branch `helper-y`", "Deleted branch `helper-y`", "Tagged `v1.3`",
        "Deleted branch `quote-hotfix`", "Removed worktree `quote-hotfix`",
        "Added worktree `x-hotfix` on branch `origin/main`",
    ], "every other git action reads in plain words, a failed one and a plain read leave no mark, and a command shlex cannot split is still read"
    earlier = len(marks())
    for command, output in (("git -c core.pager=cat tag -d v1.2", ""), ("git push --tags", ""), ("git push origin --delete old", ""), ("git push --dry-run", ""),
                            ("git branch -m helper-z helper-w", ""), ("git fetch --all", ""), ("git reset nonexistent", ""), ("git reset --soft", ""),
                            ("git tag -l", ""), ("git tag", ""), ("git pull", "Already up to date."), ("git worktree list", ""), ("git worktree add ../w2", ""),
                            ("git cherry-pick", ""), ("git revert", ""), ("git branch", ""), ("git branch --list", "")):
        ran_git(command, output)
    assert marks()[earlier:] == [
        "Deleted tag `v1.2`", "Pushed tags to `origin`", "Deleted `old` on `origin`", "Renamed branch `helper-z` to `helper-w`",
        "Fetched from every remote", "Reset `main` soft to `HEAD`", "Added worktree `../w2`",
    ], "a deleted tag, pushed tags, a deleted remote branch, a rename, a fetch of every remote, a soft reset and a worktree read in plain words; a dry run, a listing and an up to date pull leave no mark"


def test_a_chained_command_runs_part_by_part_and_each_part_marks_the_chat_once_it_has_run(tmp_path):
    import json
    from engine.stepped import SteppedCall, file_of
    from engine.stored import write_json
    from providers import PROVIDERS
    from providers.payload import Hook
    from providers.steps import chain_of
    from runner.stepping import report_step, rewrite
    features.load()
    cut = lambda command: chain_of(command) and (chain_of(command).parts, chain_of(command).joins)
    assert [cut("a; b && c"), cut("echo 'a;b' && ls"), cut("git push origin main 2>&1 | tail -2; echo done")] == \
        [(("a", "b", "c"), (";", "&&")), (("echo 'a;b'", "ls"), ("&&",)), (("git push origin main 2>&1 | tail -2", "echo done"), (";",))], "a command is cut at its top-level separators only"
    assert [chain_of(c) for c in ("ls", "(cd x; ls) && b", "for i in 1 2; do echo $i; done", "a & b", "cat <<EOF\nx\nEOF", "x=$(date); y", "echo 'open; b")] == [None] * 7, \
        "a command that cannot be cut with certainty stays whole"
    for command in ("cd /tmp && pwd; false || echo $?", "echo one; echo two >&2; exit 3", "true && false; echo $?", "echo a\necho b && cd / && pwd"):
        stepped = chain_of(command).stepped("tok", str(tmp_path / "no-heartbeat"))
        run = lambda text: subprocess.run(["sh", "-c", text], capture_output=True, text=True, timeout=10)
        original, through = run(command), run(stepped)
        assert (through.stdout, through.stderr, through.returncode) == (original.stdout, original.stderr, original.returncode), f"{command!r} runs the same in steps: output, errors and exit status"
    for args in (("init", "-q", "-b", "main"), ("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "--allow-empty", "-m", "start")):
        subprocess.run(["git", *args], cwd=tmp_path, capture_output=True, timeout=5, check=True)
    root = tmp_path / ".journal"
    record = Record(root, "t")
    report(record, "working", "PreToolUse", cwd=str(tmp_path))
    agent = Agents(record, actor=SYSTEM).by_session("claude-1")
    hook = Hook.read({"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_use_id": "toolu_x1", "permission_mode": "bypassPermissions", "tool_name": "Bash",
                      "tool_input": {"command": "git tag v9; git push origin main", "description": "tag and push"}}, PROVIDERS["claude"]().tool_kinds)
    answer = rewrite(PROVIDERS["claude"](), root, "t", hook, {})["hookSpecificOutput"]
    assert (answer["permissionDecision"], answer["updatedInput"]["description"], "journal_step 2 'git push origin main'" in answer["updatedInput"]["command"]) == ("allow", "tag and push", True), \
        "the agent runs the stepped command, with the rest of its input as it was"
    assert not rewrite(PROVIDERS["claude"](), root, "t", Hook.read({**json.loads(json.dumps({"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_use_id": "toolu_x2",
                      "tool_name": "Bash", "tool_input": {"command": "a; b"}}))}, PROVIDERS["claude"]().tool_kinds), {}), "a session that asks before it runs commands is never answered with an allow"
    call = SteppedCall("claude-1", "t", "git tag v9; git push origin main", ("git tag v9", "git push origin main"))
    write_json(file_of(root, "toolu_x1"), call.to_json())
    marks = lambda: [card["label"] for card in Agents(record, actor=SYSTEM).by_session("claude-1").data.get("cards") or []]
    report_step(root, call, 1, "start", 0, "tk")
    report_step(root, call, 1, "end", 0, "tk")
    report_step(root, call, 2, "start", 0, "tk")
    assert (marks(), Agents(record, actor=SYSTEM).by_session("claude-1").step["command"]) == (["Tagged `v9`"], "git push origin main"), \
        "a part marks the chat when it has run, while the part after it still runs and is the one the card names"
    ran.announce(record, agent.n, "Bash", call.command, "", stepped=True)
    report_step(root, call, 2, "end", 1, "tk")
    assert marks() == ["Tagged `v9`"] and not Agents(record, actor=SYSTEM).by_session("claude-1").step, "the whole call marks nothing again, and a part that failed marks nothing"
