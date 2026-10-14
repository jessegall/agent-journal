"""Phase two: journal task create, start, log, done and list run against a real .journal/journal.db through the console."""

from pathlib import Path

import pytest

from journal.app import App
from journal.config import Config
from journal.models.actor import Actor
from journal.models.task_state import TaskState
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks


@pytest.fixture
def app(tmp_path: Path, monkeypatch) -> App:
    monkeypatch.delenv("JOURNAL_SESSION", raising=False)
    monkeypatch.setenv("JOURNAL_ENV", "main")
    return App(Config.at(tmp_path))


def test_a_task_lives_through_the_cli(app, capsys):
    console = app.console()
    assert console.run(["task", "create", "write the notes", "--brief", "what and where"]) == 0
    assert console.run(["task", "start", "1"]) == 0
    assert console.run(["task", "log", "1", "half done"]) == 0
    assert console.run(["task", "list"]) == 0
    assert "started  write the notes" in capsys.readouterr().out
    assert console.run(["task", "done", "1", "--how", "published"]) == 0
    tasks = app.container.get(Tasks)
    task = tasks.find(1)
    assert task.state == TaskState.DONE and task.outcome == "published" and task.started_at is not None
    assert task.created_by == Actor.user(1)
    assert [log.line for log in app.container.get(TaskLogs).of(task)] == ["half done"]
    assert (app.config.database).is_file()


def test_the_agent_is_the_actor_when_its_session_is_set(app, monkeypatch):
    monkeypatch.setenv("JOURNAL_SESSION", "s-1")
    app.console().run(["task", "create", "t", "--start"])
    assert app.container.get(Tasks).find(1).created_by == Actor.agent("s-1")


def test_the_environment_is_made_on_first_use(app):
    app.console().run(["task", "create", "t"])
    assert app.container.get(Tasks).find(1).environment_id == 1
