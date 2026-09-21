from features import FEATURES
from providers.payload import Hook
from tests.conftest import fresh


def test_a_linked_worktree_without_a_journal_is_linked_to_the_projects_and_kept_out_of_git(tmp_path):
    record = fresh()
    main = tmp_path / "main"
    (main / ".git" / "worktrees" / "wt").mkdir(parents=True)
    worktree = tmp_path / "wt"
    (worktree / "src").mkdir(parents=True)
    (worktree / ".git").write_text(f"gitdir: {main / '.git' / 'worktrees' / 'wt'}\n")
    feature = FEATURES["worktrees"]
    for _ in range(2):
        feature.linked(None, record, Hook.read({"hook_event_name": "PreToolUse", "cwd": str(worktree / "src")}), "claude-1")
    link = worktree / ".journal"
    assert (link.is_symlink(), link.resolve() == record.root.resolve()) == (True, True), "the worktree writes the project's record"
    assert (main / ".git" / "info" / "exclude").read_text().splitlines().count("/.journal") == 1, "git never sees the link, and the line is written once"
    own = tmp_path / "other"
    (own / ".journal").mkdir(parents=True)
    (own / ".git").write_text(f"gitdir: {main / '.git' / 'worktrees' / 'other'}\n")
    feature.linked(None, record, Hook.read({"hook_event_name": "PreToolUse", "cwd": str(own)}), "claude-1")
    assert (own / ".journal").is_symlink() is False, "a worktree with a journal of its own is left alone"
