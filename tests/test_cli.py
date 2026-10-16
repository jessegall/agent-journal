"""Phase two: journal task create, start, log, done and list run against a real .journal/journal.db through the console, from the terminal and through the server."""

from pathlib import Path

import pytest

from journal.app import App
from journal.config import Config
from journal.console.where import Where
from journal.models.actor import Actor
from journal.models.task_state import TaskState
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks


MAIN = Where("main")


@pytest.fixture
def app(tmp_path: Path) -> App:
    return App(Config(tmp_path, port=0))


def test_a_task_lives_through_the_cli(app):
    console = app.console()
    assert console.run(["task", "create", "write the notes", "--brief", "what and where"], MAIN).code == 0
    assert console.run(["task", "start", "1"], MAIN).code == 0
    assert console.run(["task", "log", "1", "half done"], MAIN).code == 0
    assert "started  write the notes" in console.run(["task", "list"], MAIN).out
    assert console.run(["task", "done", "1", "--how", "published"], MAIN).code == 0
    tasks = app.container.get(Tasks)
    task = tasks.find(1)
    assert task.state == TaskState.DONE and task.outcome == "published" and task.started_at is not None
    assert task.created_by == Actor.user(1)
    assert [log.line for log in app.container.get(TaskLogs).of(task)] == ["half done"]
    assert (app.config.database).is_file()


def test_the_agent_is_the_actor_when_its_session_is_set(app):
    app.console().run(["task", "create", "t", "--start"], Where("main", "s-1"))
    assert app.container.get(Tasks).find(1).created_by == Actor.agent("s-1")


def test_the_environment_is_made_on_first_use(app):
    app.console().run(["task", "create", "t"], Where("other"))
    assert app.container.get(Tasks).find(1).environment_id == 1


def test_bad_arguments_answer_with_usage_not_an_exit(app):
    outcome = app.console().run(["task", "nope"], MAIN)
    assert outcome.code == 2 and "usage" in outcome.err


def test_the_server_runs_the_same_console_for_the_shim(app):
    import json
    from urllib.request import Request as HttpRequest, urlopen
    server = app.server()
    server.start()
    try:
        body = json.dumps({"argv": ["task", "create", "over http"], "env": "main", "session": "s-9"}).encode()
        with urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/cli", data=body, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5) as reply:
            outcome = json.loads(reply.read())
    finally:
        server.stop()
    assert outcome["code"] == 0 and "task 1 open: over http" in outcome["out"]
    assert app.container.get(Tasks).find(1).created_by == Actor.agent("s-9")


def test_deleting_an_environment_takes_everything_recorded_in_it(app):
    from journal.repositories.environments import Environments
    from journal.repositories.tasks import Tasks
    app.console().run(["task", "create", "t"], Where("spike"))
    app.console().run(["task", "create", "kept"], MAIN)
    outcome = app.console().run(["environment", "delete", "spike"], MAIN)
    assert "deleted environment" in outcome.out and outcome.code == 0
    assert [e.name for e in app.container.get(Environments).all()] == ["main"]
    assert [t.title for t in app.container.get(Tasks).all()] == ["kept"]
    assert app.console().run(["environment", "delete", "spike"], MAIN).code == 1


def test_a_command_from_the_agents_shell_is_the_live_agents_wherever_it_came_from(app):
    from journal.console.where import Where
    from journal.repositories.reactions import Reactions
    from journal.models.actor import Actor
    from journal.models.agent import Agent
    from journal.repositories.agents import Agents
    app.container.get(Agents).save(Agent(session="s1", environment_id=1, provider="claude"), Actor.system())
    app.console().run(["message", "send", "hi"], Where("main"))
    app.console().run(["message", "react", "1", "👍"], Where.from_environ({"CLAUDECODE": "1"}))
    assert app.container.get(Reactions).all()[-1].created_by.kind == "agent"


def test_a_command_from_an_agents_shell_with_no_agent_live_is_the_users_own(app):
    from journal.console.where import Where
    from journal.repositories.reactions import Reactions
    app.console().run(["message", "send", "hi"], Where("main"))
    assert app.console().run(["message", "react", "1", "👍"], Where.from_environ({"CLAUDECODE": "1"})).code == 0
    assert app.container.get(Reactions).all()[-1].created_by.kind == "user", "a shell outside the journal is the user's"


def test_the_boot_menu_is_offered_only_a_session_whose_conversation_still_exists(app, monkeypatch, tmp_path):
    from journal.console.where import Where
    from journal.models.actor import Actor
    from journal.models.agent import Agent
    from journal.providers.claude import Claude
    from journal.repositories.agents import Agents
    kept = tmp_path / "s1.jsonl"
    kept.write_text("{}\n")
    monkeypatch.setattr(Claude, "transcript", lambda self, project, session: kept if session == "s1" else None)
    agents = app.container.get(Agents)
    agents.save(Agent(session="s1", environment_id=1, provider="claude"), Actor.system())
    agents.save(Agent(session="lost", environment_id=1, provider="claude", state="ended"), Actor.system())
    import json as j
    rows = j.loads(app.console().run(["environment", "json"], Where("main")).out)
    assert rows[0]["last_session"] == "s1"
