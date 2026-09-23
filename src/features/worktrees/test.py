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


def test_a_session_started_in_a_worktree_works_the_environment_named_after_it(tmp_path):
    from engine.hooks import answer
    from engine.sessions import Sessions
    from providers import PROVIDERS
    record = fresh()
    main = tmp_path / "main"
    (main / ".git" / "worktrees" / "feature-x").mkdir(parents=True)
    worktree = tmp_path / "feature-x"
    worktree.mkdir()
    (worktree / ".git").write_text(f"gitdir: {main / '.git' / 'worktrees' / 'feature-x'}\n")
    Sessions(record.root).bind("claude-4242", record.env, pid=4242, provider="claude")
    answer(PROVIDERS["claude"](), record.root, {"hook_event_name": "SessionStart", "session_id": "in-the-worktree", "cwd": str(worktree)}, 4242)
    sessions = Sessions(record.root)
    assert (sessions.environment("in-the-worktree"), sessions.environment("claude-4242")) == ("feature-x", "feature-x"), \
        "the session and the terminal it runs in both work the worktree's environment"


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
