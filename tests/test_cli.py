"""Phase two: journal task create, start, log, done and list run against a real .journal/journal.db through the console, from the terminal and through the server."""

from pathlib import Path

import pytest

from journal.app import App
from journal.support.scope import Scope
from journal.config import Config
from journal.support.caller import Caller
from journal.support.actor import Actor
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks


MAIN = Caller("main")


@pytest.fixture
def app(journal_root: Path) -> App:
    return App(Config(journal_root, port=0))


def test_a_task_lives_through_the_cli(app):
    console = app.console()
    assert console.run(["task", "create", "write the notes", "--brief", "what and where"], MAIN).code == 0
    assert console.run(["task", "start", "1"], MAIN).code == 0
    assert console.run(["task", "log", "1", "half done"], MAIN).code == 0
    assert "started  write the notes" in console.run(["task", "list"], MAIN).out
    assert console.run(["task", "done", "1", "--how", "published"], MAIN).code == 0
    tasks = app.container.get(Tasks)
    task = tasks.find(1)
    assert task.state == TaskState.FINISHED and task.outcome == "published" and task.started_at is not None
    assert task.created_by == Actor.user(1)
    assert [log.line for log in app.container.get(TaskLogs).of(task)] == ["half done"]
    assert (app.config.database).is_file()


def test_the_agent_is_the_actor_when_its_session_is_set(app):
    app.console().run(["task", "create", "t", "--start"], Caller("main", "s-1"))
    assert app.container.get(Tasks).find(1).created_by == Actor.agent("s-1")


def test_the_environment_is_made_on_first_use(app):
    from journal.repositories.environments import Environments
    app.console().run(["task", "create", "t"], Caller("other"))
    assert app.container.get(Tasks).find(1).environment_id == app.container.get(Environments).named("other").id


def test_bad_arguments_answer_with_usage_not_an_exit(app):
    outcome = app.console().run(["task", "nope"], MAIN)
    assert outcome.code == 2 and "usage: journal task" in outcome.err and "usage: journal [-h]" not in outcome.err, "the noun's own usage, once"
    helped = app.console().run(["plan", "--help"], MAIN)
    assert helped.code == 0 and "approve" in helped.out and "usage: journal [-h]" not in helped.out + helped.err, "a noun's help is its verbs, and no failure"


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
    assert outcome["code"] == 0 and "task 1 open" in outcome["out"]
    assert app.container.get(Tasks).find(1).created_by == Actor.agent("s-9")


def test_deleting_an_environment_takes_everything_recorded_in_it(app):
    from journal.repositories.environments import Environments
    from journal.repositories.tasks import Tasks
    app.console().run(["task", "create", "t"], Caller("spike"))
    app.console().run(["task", "create", "kept"], MAIN)
    outcome = app.console().run(["environment", "delete", "spike"], MAIN)
    assert "deleted environment" in outcome.out and outcome.code == 0
    assert [e.name for e in app.container.get(Environments).all()] == ["main"]
    with app.container.get(Scope).of(1):
        assert [t.title for t in app.container.get(Tasks).all()] == ["kept"]
    assert app.console().run(["environment", "delete", "spike"], MAIN).code == 1


def test_a_command_from_the_agents_shell_is_the_live_agents_wherever_it_came_from(app):
    from journal.support.caller import Caller
    from journal.repositories.reactions import Reactions
    from journal.support.actor import Actor
    from journal.models.agent import Agent
    from journal.repositories.agents import Agents
    app.container.get(Agents).save(Agent(session="s1", environment_id=1, provider="claude"), Actor.system())
    app.console().run(["message", "send", "hi"], Caller("main"))
    app.console().run(["message", "react", "1", "👍"], Caller.from_environ({"CLAUDECODE": "1"}))
    assert Caller.from_environ({"JOURNAL_AGENT_SHELL": "1"}).from_agent_shell, "a worker's shell is an agent's whatever its program marks"
    with app.container.get(Scope).of(1):
        assert app.container.get(Reactions).all()[-1].created_by.kind == "agent"


def test_a_command_from_an_agents_shell_with_no_agent_live_is_the_users_own(app):
    from journal.support.caller import Caller
    from journal.repositories.reactions import Reactions
    app.console().run(["message", "send", "hi"], Caller("main"))
    assert app.console().run(["message", "react", "1", "👍"], Caller.from_environ({"CLAUDECODE": "1"})).code == 0
    with app.container.get(Scope).of(1):
        assert app.container.get(Reactions).all()[-1].created_by.kind == "user", "a shell outside the journal is the user's"


def test_a_codex_command_orients_its_own_session_in_the_chosen_environment(app):
    from journal.models.agent import Agent
    from journal.repositories.agents import Agents
    from journal.repositories.environments import Environments
    environments, agents = app.container.get(Environments), app.container.get(Agents)
    development = environments.named("development")
    with app.container.get(Scope).of(development.id):
        agents.save(Agent(session="codex-session", environment_id=development.id, provider="codex", oriented=False), Actor.system())
        agents.save(Agent(session="claude-session", environment_id=development.id, provider="claude", oriented=False), Actor.system())
    caller = Caller.from_environ({"JOURNAL_ENV": "development", "CODEX_THREAD_ID": "codex-session", "CODEX_CI": "1"})
    assert app.console().run(["environment", "here"], caller).code == 0
    with app.container.get(Scope).of(development.id):
        assert agents.for_session("codex-session").oriented
        assert not agents.for_session("claude-session").oriented
    assert app.console().run(["task", "create", "Codex task"], caller).code == 0
    with app.container.get(Scope).of(development.id):
        assert app.container.get(Tasks).all()[-1].created_by == Actor.agent("codex-session")
    assert Caller.from_environ({"JOURNAL_SESSION": "worker-session", "CODEX_THREAD_ID": "parent-session"}).session == "worker-session"


@pytest.mark.parametrize("online", [False, True])
def test_the_shim_attributes_a_codex_command_with_and_without_a_server(app, online):
    import os
    import subprocess
    from journal.models.agent import Agent
    from journal.repositories.agents import Agents
    from journal.repositories.environments import Environments
    agents = app.container.get(Agents)
    development = app.container.get(Environments).named("development")
    with app.container.get(Scope).of(development.id):
        agents.save(Agent(session="codex-session", environment_id=development.id, provider="codex", oriented=False), Actor.system())
    environ = {key: value for key, value in os.environ.items() if key not in ("JOURNAL_SESSION", "CLAUDECODE", "CODEX_SANDBOX")}
    environ.update(JOURNAL_ROOT=str(app.config.root), JOURNAL_ENV="development", JOURNAL_PORT="0", CODEX_THREAD_ID="codex-session", CODEX_CI="1")
    server = app.server()
    if online:
        server.start()
    try:
        result = subprocess.run(["sh", str(Path(__file__).resolve().parents[1] / "src" / "journal.sh"), "environment", "here"], env=environ, capture_output=True, text=True, timeout=10)
        assert result.returncode == 0, result.stderr
        with app.container.get(Scope).of(development.id):
            assert agents.for_session("codex-session").oriented
    finally:
        server.stop()


def test_the_boot_menu_is_offered_only_a_session_whose_conversation_still_exists(app, monkeypatch, tmp_path):
    from journal.support.caller import Caller
    from journal.support.actor import Actor
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
    rows = j.loads(app.console().run(["environment", "json"], Caller("main")).out)
    assert rows[0]["last_sessions"] == {"claude": "s1"}, "a codex launch finds no Claude session to carry on"


def test_an_environment_is_renamed_with_everything_in_it_and_never_while_an_agent_works_there(app):
    from journal.models.agent import Agent
    from journal.repositories.agents import Agents
    from journal.repositories.environments import Environments
    from journal.repositories.tasks import Tasks
    console, environments = app.console(), app.container.get(Environments)
    assert console.run(["environment", "create", "spike"], MAIN).code == 0
    spike = environments.named("spike")
    with app.container.get(Scope).of(spike.id):
        app.container.get(Tasks).save(Task(title="in spike"), Actor.user(1))
    taken = console.run(["environment", "rename", "spike", "main"], MAIN)
    assert taken.code == 1 and "exists already" in taken.err
    with app.container.get(Scope).of(spike.id):
        app.container.get(Agents).save(Agent(session="s-spike", environment_id=spike.id, provider="claude", state="idle"), Actor.system())
    busy = console.run(["environment", "rename", "spike", "probe"], MAIN)
    assert busy.code == 1 and "an agent works in spike" in busy.err
    with app.container.get(Scope).of(spike.id):
        app.container.get(Agents).save(app.container.get(Agents).for_session("s-spike").with_(state="ended"), Actor.system())
    assert console.run(["environment", "rename", "spike", "probe"], MAIN).code == 0
    with app.container.get(Scope).of(environments.named("probe").id):
        assert [t.title for t in app.container.get(Tasks).all()] == ["in spike"], "its rows go with it"
    assert not environments.matching(name="spike")


def test_any_row_docks_above_the_chat_by_noun_and_number_in_either_order(app):
    from journal.repositories.messages import Messages
    console = app.console()
    console.run(["task", "create", "write the notes", "--brief", "what and where\nand how"], MAIN)
    docked = console.run(["task", "12", "dock"], MAIN)
    assert docked.code == 1 and "12" in docked.err, "the number in the verb's place turns the line around, and the row it names is looked for"
    assert console.run(["task", "1", "dock"], MAIN).out.startswith("Task 1: write the notes docked above the chat")
    with app.container.get(Scope).of(1):
        messages = app.container.get(Messages)
        [card] = [m for m in messages.all() if m.data.get("docked")]
        assert card.author.value == "system" and card.text == "Task 1: write the notes"
        assert card.data["kind"] == "docked" and card.data["row"] == "tasks:1" and card.data["key"] == "made:task:1"
        assert card.data["heading"] == "Task 1: write the notes" and card.data["summary"] == "what and where"
        assert card.data["dock"] == {"buttons": [{"label": "Open", "act": "open"}, {"label": "Close", "act": "close"}], "folds": True}
        assert console.run(["task", "dock", "1"], MAIN).code == 0 and len([m for m in messages.all() if m.data.get("docked")]) == 1, "docking it again keeps the one card"
        assert console.run(["task", "undock", "1"], MAIN).out.startswith("Task 1: write the notes undocked")
        assert messages.find(card.id).data["docked"] is False
        assert "is not docked" in console.run(["task", "1", "undock"], MAIN).err
    assert "dock" in console.run(["report", "--help"], MAIN).out and "dock" not in console.run(["search", "--help"], MAIN).out, "every row noun has the verbs, a noun that is no row has not"
