"""An environment is made only by creating it, never by a hook, a command or a folder naming one."""
import os
import subprocess
from pathlib import Path

import pytest

from tests.test_features import booted

from journal.features.tasks.commands.task_command import TaskCommand
from journal.models.task import Task
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope
from journal.repositories.tasks import Tasks
from journal.support.actor import Actor
from journal.support.missing_row import MissingRow


@pytest.fixture(scope="module")
def boot():
    return booted


def test_an_unknown_environment_name_is_refused_and_makes_no_row(app):
    environments = app.container.get(Environments)
    before = environments.total()
    with pytest.raises(MissingRow):
        environments.existing("2951-Mrs.-Hamilton")
    assert environments.total() == before, "asking for an unknown name creates nothing"
    assert environments.ensure("made-on-purpose").name == "made-on-purpose" and environments.total() == before + 1, "creating is its own call"


def test_a_delegated_task_without_a_holder_can_be_transferred(app):
    environments, tasks = app.container.get(Environments), app.container.get(Tasks)
    main = environments.ensure("main")
    with app.container.get(Scope).environment(main.id):
        task = tasks.save(Task(environment_id=main.id, title="orphan", delegated=True), Actor.system())
    app.container.get(TaskCommand).refuse_transfer(task, [], True)


def worktree_environment(folder: Path, cwd: Path) -> str:
    rule = Path(__file__).parents[1] / "src" / "journal" / "hooks" / "environment.sh"
    return subprocess.run(["sh", "-c", f'. "{rule}"; journal_environment'], cwd=cwd, capture_output=True, text=True, timeout=30, env={"PATH": os.environ["PATH"]}).stdout


def test_a_worker_folder_under_the_journal_worktrees_names_no_environment(tmp_path: Path):
    git = lambda *args: subprocess.run(["git", "-C", str(tmp_path), *args], capture_output=True, text=True, timeout=30)
    git("init", "-q")
    git("-c", "user.email=a@b", "-c", "user.name=a", "commit", "-q", "--allow-empty", "-m", "start")
    worker, agent = tmp_path / ".journal" / "worktrees" / "3049-Katherine-Johnson", tmp_path / ".claude" / "worktrees" / "calm-river"
    git("worktree", "add", "-q", "-b", "worker-branch", str(worker))
    git("worktree", "add", "-q", "-b", "worktree-calm-river", str(agent))
    assert worktree_environment(worker, worker) == "main", "a worker's folder resolves to main"
    assert worktree_environment(agent, agent) == "calm-river", "an environment's own worktree still names it"
