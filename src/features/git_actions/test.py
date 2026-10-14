# Stays a test: it runs real git (init, switch, worktree add) and real sh -c to prove a stepped command runs as the original, and tests how a checkout is named from its folder directly, which a Given cannot state because the project folder is the play's own.
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


def test_a_chained_command_runs_part_by_part_and_each_part_marks_the_chat_once_it_has_run(tmp_path):
    import json
    from engine.stepped import SteppedCall, file_of
    from engine.stored import write_json
    from providers import PROVIDERS
    from payload import Hook
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
    report_step(root, call, 2, "end", 1, "tk")
    assert marks() == ["Tagged `v9`"], "an end that arrives twice is taken quietly: the parts report in the background, so one can be delivered again"


def test_a_repository_nested_in_the_project_is_named_apart_so_entering_it_is_no_switch(tmp_path):
    from resources.checkout import MAIN, checkout_name
    project = tmp_path / "project"
    nested = project / "services" / "api"
    nested.mkdir(parents=True)
    assert (checkout_name(project, False, project), checkout_name(nested, False, project), checkout_name(tmp_path / "app-wt", True, project)) == \
        (MAIN, "repository services/api", "worktree app-wt"), \
        "the project's own repository is the main checkout, a nested one is named by its path, so each keeps its own branch and stepping into one is no switch"
