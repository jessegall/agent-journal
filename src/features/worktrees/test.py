from features import FEATURES
from features.parts import Context
from features.worktrees.interceptors import LinkWorktreeJournal
from providers.payload import Hook
from tests.conftest import fresh


def linked(feature, record, cwd: str) -> None:
    hook = Hook.read({"hook_event_name": "PreToolUse", "cwd": cwd}, {})
    LinkWorktreeJournal().intercept(Context.of(feature, record, hook=hook), hook.tool)


def test_a_linked_worktree_without_a_journal_is_linked_to_the_projects_and_kept_out_of_git(tmp_path):
    record = fresh()
    main = tmp_path / "main"
    (main / ".git" / "worktrees" / "wt").mkdir(parents=True)
    worktree = tmp_path / "wt"
    (worktree / "src").mkdir(parents=True)
    (worktree / ".git").write_text(f"gitdir: {main / '.git' / 'worktrees' / 'wt'}\n")
    feature = FEATURES["worktrees"]
    for _ in range(2):
        linked(feature, record, str(worktree / "src"))
    link = worktree / ".journal"
    assert (link.is_symlink(), link.resolve() == record.root.resolve()) == (True, True), "the worktree writes the project's record"
    assert (main / ".git" / "info" / "exclude").read_text().splitlines().count("/.journal") == 1, "git never sees the link, and the line is written once"
    own = tmp_path / "other"
    (own / ".journal").mkdir(parents=True)
    (own / ".git").write_text(f"gitdir: {main / '.git' / 'worktrees' / 'other'}\n")
    linked(feature, record, str(own))
    assert (own / ".journal").is_symlink() is False, "a worktree with a journal of its own is left alone"


def worktree_of(tmp_path, name: str):
    main = tmp_path / "main"
    (main / ".git" / "worktrees" / name).mkdir(parents=True, exist_ok=True)
    worktree = tmp_path / name
    worktree.mkdir()
    (worktree / ".git").write_text(f"gitdir: {main / '.git' / 'worktrees' / name}\n")
    return worktree


def hooked(record, session: str, cwd, pid: int, **given) -> None:
    from engine.hooks import answer
    from providers import PROVIDERS
    answer(PROVIDERS["claude"](), record.root, {"hook_event_name": "UserPromptSubmit", "session_id": session, "cwd": str(cwd), **given}, pid)


def test_a_session_started_in_a_worktree_works_the_environment_named_after_it(tmp_path):
    from engine.sessions import Sessions
    record = fresh()
    Sessions(record.root).bind("claude-4242", record.env, pid=4242, provider="claude")
    hooked(record, "in-the-worktree", worktree_of(tmp_path, "feature-x"), 4242)
    sessions = Sessions(record.root)
    assert (sessions.environment("in-the-worktree"), sessions.environment("claude-4242")) == ("feature-x", "feature-x"), \
        "the session and the terminal it runs in both work the worktree's environment"


def test_a_resumed_conversation_in_a_worktree_moves_there_with_its_terminal(tmp_path):
    from controllers.types import Environments
    from engine.sessions import Sessions
    from resources.base import SYSTEM
    record = fresh()
    sessions = Sessions(record.root)
    environments = Environments(record, actor=SYSTEM)
    sessions.bind("claude-5151", record.env, pid=5151, provider="claude")
    environments._seat(record.env, "claude-5151")
    sessions.bind("resumed", record.env, pid=5151, provider="claude")
    hooked(record, "resumed", worktree_of(tmp_path, "feature-z") / "src", 5151)
    assert (sessions.environment("resumed"), sessions.environment("claude-5151")) == ("feature-z", "feature-z"), \
        "a conversation the journal already knew follows the worktree it now runs in, and so does its restarted terminal"
    hooked(record, "resumed", tmp_path / "main", 5151, agent_id="helper")
    assert sessions.environment("resumed") == "feature-z", "a subagent's hook outside the worktree never moves the main conversation"


def test_a_subagent_in_its_own_worktree_never_moves_the_main_conversation(tmp_path):
    from engine.sessions import Sessions
    record = fresh()
    Sessions(record.root).bind("main-conversation", record.env, pid=6161, provider="claude")
    hooked(record, "main-conversation", worktree_of(tmp_path, "agent-a1b2"), 6161, agent_id="a1b2")
    assert Sessions(record.root).environment("main-conversation") == record.env, "an isolated subagent's worktree is the subagent's, not the session's"


def test_a_restarted_worker_keeps_the_seat_its_terminal_moved_to():
    from engine.sessions import Sessions
    from engine.terminal import Seat, seated
    record = fresh()
    first = seated(Seat(record.root, record.env, "claude", "claude-7171"))
    Sessions(record.root).bind("claude-7171", "elsewhere")
    again = seated(Seat(record.root, record.env, "claude", "claude-7171"))
    assert (first.env, again.env, Sessions(record.root).environment("claude-7171")) == (record.env, "elsewhere", "elsewhere"), \
        "a new build restarts the worker, and the terminal stays where it was moved"


def test_journal_claude_with_a_worktree_makes_it_itself_and_starts_claude_inside_it(tmp_path):
    import subprocess
    import pytest
    from providers.claude import ClaudeDriver
    project = tmp_path / "project"
    project.mkdir()
    for command in (["git", "init", "-q"], ["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "start"]):
        subprocess.run(command, cwd=project, check=True, timeout=30)
    (project / ".env").write_text("SECRET=1\n")
    (project / ".worktreeinclude").write_text(".env\n")
    cwd, args = ClaudeDriver.placed(project, ["--dangerously-skip-permissions", "--worktree=feature-q", "--resume", "c1"])
    assert (cwd, args) == (project / ".claude" / "worktrees" / "feature-q", ["--dangerously-skip-permissions", "--resume", "c1"]), \
        "Claude starts inside the worktree without a worktree of its own to clean up"
    assert ((cwd / ".env").read_text(), subprocess.run(["git", "branch", "--show-current"], cwd=cwd, capture_output=True, text=True, timeout=30).stdout.strip()) == \
        ("SECRET=1\n", "worktree-feature-q"), "it is made on Claude's branch name, with the files .worktreeinclude lists"
    assert ClaudeDriver.placed(project, ["-w", "feature-q"]) == (cwd, []), "an existing worktree is reused"
    git = ["git", "-c", "user.email=t@t", "-c", "user.name=t"]
    subprocess.run([*git, "commit", "-q", "--allow-empty", "-m", "work in the worktree"], cwd=cwd, check=True, timeout=30)
    ClaudeDriver.placed(project, ["-w", "feature-q"])
    subprocess.run(["git", "worktree", "remove", "--force", str(cwd)], cwd=project, check=True, timeout=30)
    subprocess.run(["git", "branch", "-D", "worktree-feature-q"], cwd=project, check=True, capture_output=True, timeout=30)
    assert ClaudeDriver.placed(project, ["-w", "feature-q"])[0] == cwd and "work in the worktree" in \
        subprocess.run(["git", "log", "-1", "--format=%s"], cwd=cwd, capture_output=True, text=True, timeout=30).stdout, \
        "a worktree removed with its branch comes back with the work its last launch recorded"
    assert ClaudeDriver.placed(project, ["-c"]) == (project, ["-c"]), "without a worktree Claude starts in the project"
    for name in ("a:b", "a/b"):
        with pytest.raises(SystemExit):
            ClaudeDriver.placed(project, ["-w", name])


def test_a_command_run_inside_a_worktree_works_the_worktrees_environment(tmp_path):
    from commands.cli import captured
    record = fresh()
    main = tmp_path / "main"
    (main / ".git" / "worktrees" / "feature-y").mkdir(parents=True)
    worktree = tmp_path / "feature-y"
    worktree.mkdir()
    (worktree / ".git").write_text(f"gitdir: {main / '.git' / 'worktrees' / 'feature-y'}\n")
    (record.root / "environments" / "feature-y").mkdir(parents=True)
    text, code = captured(["--cwd", str(worktree), "todo", "create", "from the worktree"], record.root)
    assert (code, (record.root / "environments" / "feature-y" / "todo").is_dir()) == (0, True), text


def test_continuing_names_the_folders_latest_conversation(tmp_path, monkeypatch):
    import os
    import re
    from providers.claude import ClaudeDriver
    monkeypatch.setenv("HOME", str(tmp_path))
    project = tmp_path / "my.project"
    folder = tmp_path / ".claude" / "projects" / re.sub(r"[^A-Za-z0-9]", "-", str(project))
    folder.mkdir(parents=True)
    for age, name in ((20, "older"), (10, "newer")):
        (folder / f"{name}.jsonl").write_text("{}\n")
        os.utime(folder / f"{name}.jsonl", (0, 1_000_000 - age))
    assert (ClaudeDriver.continued(["-c"], project), ClaudeDriver.continued(["--resume"], project), ClaudeDriver.continued([], tmp_path / "elsewhere")) == \
        ("newer", "", ""), "--continue names the folder's latest conversation, so it goes back to that conversation's environment"
