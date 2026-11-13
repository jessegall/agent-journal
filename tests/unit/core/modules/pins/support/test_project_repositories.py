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
    remote_folder = tmp_path / "elsewhere"
    remote_folder.mkdir()
    monkeypatch.chdir(remote_folder)
    assert ProjectRepositories(JournalHome(worktree / ".journal")).names() == {"acme/cart"}


def remote_names(tmp_path: Path, url: str) -> set[str]:
    (tmp_path / ".git").mkdir()
    (tmp_path / ".git" / "config").write_text(f'[remote "origin"]\n\turl = {url}\n')
    return ProjectRepositories(JournalHome(tmp_path / ".journal")).names()


def test_an_ssh_alias_of_github_names_its_repository(tmp_path: Path):
    assert remote_names(tmp_path, "git@github.com-work:acme/cart.git") == {"acme/cart"}


def test_a_host_that_only_starts_with_github_or_holds_it_names_no_repository(tmp_path: Path):
    (tmp_path / ".git").mkdir()
    (tmp_path / ".git" / "config").write_text('[remote "one"]\n\turl = https://github.example.com/acme/cart.git\n[remote "two"]\n\turl = https://mygithub.com/acme/cart.git\n')
    assert ProjectRepositories(JournalHome(tmp_path / ".journal")).names() == set()
