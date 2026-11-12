from pathlib import Path

from engine.journal.journal_home import JournalHome
from core.modules.pins.support.project_repositories import ProjectRepositories

CONFIG = '[remote "origin"]\n\turl = https://github.com/acme/cart.git\n'


def test_a_checkout_names_the_repository_of_its_git_config(tmp_path: Path):
    (tmp_path / ".git").mkdir()
    (tmp_path / ".git" / "config").write_text(CONFIG)
    assert ProjectRepositories(JournalHome(tmp_path / ".journal")).names() == {"acme/cart"}


def test_a_worktree_with_a_relative_gitdir_reads_the_config_from_beside_its_git_file_wherever_the_process_runs(tmp_path: Path, monkeypatch):
    main = tmp_path / "main" / ".git"
    (main / "worktrees" / "one").mkdir(parents=True)
    (main / "config").write_text(CONFIG)
    (main / "worktrees" / "one" / "commondir").write_text("../..\n")
    worktree = tmp_path / "main" / "wt"
    worktree.mkdir()
    (worktree / ".git").write_text("gitdir: ../.git/worktrees/one\n")
    elsewhere = tmp_path / "elsewhere"
    elsewhere.mkdir()
    monkeypatch.chdir(elsewhere)
    assert ProjectRepositories(JournalHome(worktree / ".journal")).names() == {"acme/cart"}
