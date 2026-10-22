"""Phase two: journal task create, start, log, done and list run against a real .journal/journal.db through the console, from the terminal and through the server."""

from pathlib import Path

import pytest

from journal.app import App
from journal.repositories.scope import Scope
from journal.config import Config
from journal.support.caller import Caller
from journal.providers.providers import Providers
from journal.support.actor import Actor
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks


MAIN = Caller.user("main")


@pytest.fixture
def app(journal_root: Path) -> App:
    return App(Config(journal_root, port=0))


def test_a_task_lives_through_the_cli(app: App):
    console = app.console()
    assert console.run(["task", "create", "write the notes", "--brief", "what and where"], MAIN).code == 0
    assert console.run(["task", "start", "1"], MAIN).code == 0
    assert console.run(["task", "log", "1", "half done"], MAIN).code == 0
    assert "started  write the notes" in console.run(["task", "list"], MAIN).text
    assert console.run(["task", "complete", "1", "--how", "published"], MAIN).code == 0
    tasks = app.container.get(Tasks)
    task = tasks.find(1)
    assert task.state == TaskState.FINISHED and task.outcome == "published" and task.started_at is not None
    assert task.creator == Actor.user(1)
    assert [log.line for log in app.container.get(TaskLogs).logs(task)] == ["half done"]
    assert (app.config.database).is_file()


def test_the_agent_is_the_actor_when_its_session_is_set(app: App):
    app.console().run(["task", "create", "t", "--start"], Caller.agent("main", "s-1", "claude"))
    assert app.container.get(Tasks).find(1).creator == Actor.agent("s-1")


def test_the_environment_is_made_on_first_use(app: App):
    from journal.repositories.environments import Environments
    app.console().run(["task", "create", "t"], Caller.user("other"))
    assert app.container.get(Tasks).find(1).environment_id == app.container.get(Environments).lookup("other").id


def test_bad_arguments_answer_with_usage_not_an_exit(app: App):
    outcome = app.console().run(["task", "nope"], MAIN)
    assert outcome.code == 2 and "usage: journal task" in outcome.error and "usage: journal [-h]" not in outcome.error, "the noun's own usage, once"
    helped = app.console().run(["plan", "--help"], MAIN)
    assert helped.code == 0 and "approve" in helped.text and "usage: journal [-h]" not in helped.text + helped.error, "a noun's help is its verbs, and no failure"


def test_the_server_runs_the_same_console_for_the_shim(app: App):
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
    assert outcome["code"] == 0 and "task 1 open" in outcome["text"]
    assert app.container.get(Tasks).find(1).creator == Actor.agent("s-9")


def test_deleting_an_environment_takes_everything_recorded_in_it(app: App):
    from journal.repositories.environments import Environments
    from journal.repositories.tasks import Tasks
    app.console().run(["task", "create", "t"], Caller.user("spike"))
    app.console().run(["task", "create", "kept"], MAIN)
    outcome = app.console().run(["environment", "delete", "spike"], MAIN)
    assert "deleted environment" in outcome.text and outcome.code == 0
    assert [e.name for e in app.container.get(Environments).all()] == ["main"]
    with app.container.get(Scope).environment(1):
        assert [t.title for t in app.container.get(Tasks).all()] == ["kept"]
    assert app.console().run(["environment", "delete", "spike"], MAIN).code == 1


def test_a_command_from_the_agents_shell_is_the_live_agents_wherever_it_came_from(app: App):
    from journal.support.caller import Caller
    from journal.repositories.reactions import Reactions
    from journal.support.actor import Actor
    from journal.models.agent import Agent
    from journal.repositories.agents import Agents
    app.container.get(Agents).save(Agent(session="s1", environment_id=1, provider="claude"), Actor.system())
    app.console().run(["message", "send", "hi"], Caller.user("main"))
    app.console().run(["message", "react", "1", "👍"], Providers().caller({"CLAUDECODE": "1"}))
    assert Providers().caller({"JOURNAL_AGENT_SHELL": "1"}).is_unnamed_agent(), "a worker's shell is an agent's whatever its program marks"
    named = Providers().caller({"CLAUDECODE": "1", "CLAUDE_CODE_SESSION_ID": "abc"})
    assert named.session == "abc" and named.provider == "claude", "a Claude Code shell names its own session, so its lines and outputs are its agent's"
    with app.container.get(Scope).environment(1):
        assert app.container.get(Reactions).all()[-1].creator.kind == "agent"


def test_a_shells_variables_name_its_caller_by_kind_with_the_provider_that_marks_it():
    from journal.support.caller_variables import CallerVariables
    providers = Providers()
    assert providers.caller({"JOURNAL_PLUGIN": ""}) == Caller.user("main") and Caller.user("main").actor == Actor.user(1), "a shell nothing marks is the user's, and a variable set empty is no plugin"
    assert providers.caller({"CODEX_THREAD_ID": "t1", "CODEX_CI": "1"}) == Caller.agent("main", "t1", "codex"), "an agent knows its own provider from the markers its shell carries"
    assert providers.caller({"CLAUDECODE": "1"}) == Caller.shell("main", "claude"), "a Claude shell names no session, only its provider"
    assert providers.caller({"JOURNAL_PLUGIN": "echo", "JOURNAL_PLUGIN_TOKEN": "x"}) == Caller.plugin("main", "echo")
    assert providers.caller({"JOURNAL_WORKER": "3", "JOURNAL_AGENT_SHELL": "1", "CLAUDECODE": "1"}) == Caller.worker("main", 3, None, "claude")
    variables = providers.caller_variables({"JOURNAL_ENV": "development", "CODEX_THREAD_ID": "t1", "JOURNAL_LAUNCH": "l1"})
    assert CallerVariables.parsed(variables.body(), "claude") == variables, "what the shim posts reads back as the variables it posted"


def test_a_codex_agent_with_no_row_yet_dispatches_a_codex_worker_and_raises_its_events(app: App, monkeypatch):
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.repositories.workers import Workers
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: None)
    codex = Caller.agent("main", "t9", "codex")
    assert app.console().run(["worker", "dispatch", "Ada Lovelace", "write storage.py", "--profile", "journal-medior", "--model", "gpt-5"], codex).code == 0
    assert app.container.get(Workers).find(1).provider == "codex", "the provider comes with the caller, not from the agent's row"
    assert app.console().run(["stuck", "the build is red"], MAIN).code == 1, "only an agent says it is stuck"


def test_a_command_from_an_agents_shell_with_no_agent_live_is_the_users_own(app: App):
    from journal.support.caller import Caller
    from journal.repositories.reactions import Reactions
    app.console().run(["message", "send", "hi"], Caller.user("main"))
    assert app.console().run(["message", "react", "1", "👍"], Providers().caller({"CLAUDECODE": "1"})).code == 0
    with app.container.get(Scope).environment(1):
        assert app.container.get(Reactions).all()[-1].creator.kind == "user", "a shell outside the journal is the user's"


def test_a_codex_command_orients_its_own_session_in_the_chosen_environment(app: App):
    from journal.models.agent import Agent
    from journal.repositories.agents import Agents
    from journal.repositories.environments import Environments
    environments, agents = app.container.get(Environments), app.container.get(Agents)
    development = environments.lookup("development")
    with app.container.get(Scope).environment(development.id):
        agents.save(Agent(session="codex-session", environment_id=development.id, provider="codex", has_overview=False), Actor.system())
        agents.save(Agent(session="claude-session", environment_id=development.id, provider="claude", has_overview=False), Actor.system())
    caller = Providers().caller({"JOURNAL_ENV": "development", "CODEX_THREAD_ID": "codex-session", "CODEX_CI": "1"})
    assert app.console().run(["environment", "overview"], caller).code == 0
    with app.container.get(Scope).environment(development.id):
        assert agents.session_agent("codex-session").has_overview
        assert not agents.session_agent("claude-session").has_overview
    assert app.console().run(["task", "create", "Codex task"], caller).code == 0
    with app.container.get(Scope).environment(development.id):
        assert app.container.get(Tasks).all()[-1].creator == Actor.agent("codex-session")
    assert Providers().caller({"JOURNAL_SESSION": "worker-session", "CODEX_THREAD_ID": "parent-session"}).session == "worker-session"


def test_a_workers_shim_never_runs_the_package_when_no_server_answers(app: App):
    import os
    import subprocess
    environ = {key: value for key, value in os.environ.items() if key != "JOURNAL_SESSION"}
    environ.update(JOURNAL_ROOT=str(app.config.root), JOURNAL_ENV="main", JOURNAL_ACTOR="worker-agent", JOURNAL_WORKER="1", JOURNAL_WORKER_TOKEN="tok")
    (app.config.home / "port").unlink(missing_ok=True)
    outcome = subprocess.run(["sh", str(Path(__file__).resolve().parents[1] / "src" / "journal.sh"), "task", "list"], env=environ, capture_output=True, text=True, timeout=10)
    assert outcome.returncode == 1 and "restarting" in outcome.stderr, "a worker's command waits for the server that can check its token"


@pytest.mark.parametrize("online", [False, True])
def test_the_shim_attributes_a_codex_command_with_and_without_a_server(app: App, online):
    import os
    import subprocess
    from journal.models.agent import Agent
    from journal.providers.claude import Claude
    from journal.repositories.agents import Agents
    from journal.repositories.environments import Environments
    agents = app.container.get(Agents)
    development = app.container.get(Environments).lookup("development")
    with app.container.get(Scope).environment(development.id):
        agents.save(Agent(session="codex-session", environment_id=development.id, provider="codex", has_overview=False), Actor.system())
    environ = {key: value for key, value in os.environ.items() if key not in ("JOURNAL_SESSION", "CODEX_SANDBOX", *Claude.inherited_markers)}
    environ.update(JOURNAL_ROOT=str(app.config.root), JOURNAL_ENV="development", JOURNAL_PORT="0", CODEX_THREAD_ID="codex-session", CODEX_CI="1")
    server = app.server()
    if online:
        server.start()
    try:
        outcome = subprocess.run(["sh", str(Path(__file__).resolve().parents[1] / "src" / "journal.sh"), "environment", "overview"], env=environ, capture_output=True, text=True, timeout=10)
        assert outcome.returncode == 0, outcome.stderr
        with app.container.get(Scope).environment(development.id):
            assert agents.session_agent("codex-session").has_overview
    finally:
        server.stop()


def test_the_boot_menu_is_offered_only_a_session_whose_conversation_still_exists(app: App, monkeypatch, tmp_path):
    from journal.support.caller import Caller
    from journal.support.actor import Actor
    from journal.models.agent import Agent
    from journal.providers.claude import Claude
    from journal.repositories.agents import Agents
    stored = tmp_path / "s1.jsonl"
    stored.write_text("{}\n")
    monkeypatch.setattr(Claude, "transcript", lambda self, project, session: stored if session == "s1" else None)
    agents = app.container.get(Agents)
    agents.save(Agent(session="s1", environment_id=1, provider="claude"), Actor.system())
    agents.save(Agent(session="lost", environment_id=1, provider="claude", state="ended"), Actor.system())
    import json as j
    rows = j.loads(app.console().run(["environment", "json"], Caller.user("main")).text)
    assert rows[0]["last_sessions"] == {"claude": "s1"}, "a codex launch finds no Claude session to carry on"


def test_an_environment_is_renamed_with_everything_in_it_and_never_while_an_agent_works_there(app: App):
    from journal.models.agent import Agent
    from journal.repositories.agents import Agents
    from journal.repositories.environments import Environments
    from journal.repositories.tasks import Tasks
    console, environments = app.console(), app.container.get(Environments)
    assert console.run(["environment", "create", "spike"], MAIN).code == 0
    spike = environments.lookup("spike")
    with app.container.get(Scope).environment(spike.id):
        app.container.get(Tasks).save(Task(title="in spike"), Actor.user(1))
    claimed = console.run(["environment", "rename", "spike", "main"], MAIN)
    assert claimed.code == 1 and "exists already" in claimed.error
    with app.container.get(Scope).environment(spike.id):
        app.container.get(Agents).save(Agent(session="s-spike", environment_id=spike.id, provider="claude", state="idle"), Actor.system())
    busy = console.run(["environment", "rename", "spike", "probe"], MAIN)
    assert busy.code == 1 and "an agent works in spike" in busy.error
    with app.container.get(Scope).environment(spike.id):
        app.container.get(Agents).save(app.container.get(Agents).session_agent("s-spike").with_(state="ended"), Actor.system())
    assert console.run(["environment", "rename", "spike", "probe"], MAIN).code == 0
    with app.container.get(Scope).environment(environments.lookup("probe").id):
        assert [t.title for t in app.container.get(Tasks).all()] == ["in spike"], "its rows go with it"
    assert not environments.matching(name="spike")


def test_any_row_docks_above_the_chat_by_noun_and_number_in_either_order(app: App):
    from journal.repositories.messages import Messages
    console = app.console()
    console.run(["task", "create", "write the notes", "--brief", "what and where\nand how"], MAIN)
    docked = console.run(["task", "12", "dock"], MAIN)
    assert docked.code == 1 and "12" in docked.error, "the number in the verb's place turns the line around, and the row it names is looked for"
    assert console.run(["task", "1", "dock"], MAIN).text.startswith("Task 1: write the notes docked above the chat")
    with app.container.get(Scope).environment(1):
        messages = app.container.get(Messages)
        [card] = [m for m in messages.all() if m.data.get("docked")]
        assert card.author.value == "system" and card.text == "Task 1: write the notes"
        assert card.data["kind"] == "docked" and card.data["row"] == "tasks:1" and card.data["key"] == "made:task:1"
        assert card.data["heading"] == "Task 1: write the notes" and card.data["summary"] == "what and where"
        assert card.data["dock"] == {"buttons": [{"label": "Open", "act": "open"}, {"label": "Close", "act": "close"}], "folds": True}
        assert console.run(["task", "dock", "1"], MAIN).code == 0 and len([m for m in messages.all() if m.data.get("docked")]) == 1, "docking it again keeps the one card"
        assert console.run(["task", "undock", "1"], MAIN).text.startswith("Task 1: write the notes undocked")
        assert messages.find(card.id).data["docked"] is False
        assert "is not docked" in console.run(["task", "1", "undock"], MAIN).error
    assert "dock" in console.run(["report", "--help"], MAIN).text and "dock" not in console.run(["search", "--help"], MAIN).text, "every row noun has the verbs, a noun that is no row has not"


def test_a_workers_environment_carries_no_providers_markers_no_session_and_no_launch(app: App, monkeypatch):
    from journal.features.workers.support.worker_runner import WorkerRunner
    parents = {*Providers().inherited_markers(), *Providers().session_variables(), "JOURNAL_LAUNCH", "JOURNAL_SESSION"}
    for name in parents:
        monkeypatch.setenv(name, "parent")
    handed = app.container.get(WorkerRunner).environment_variables("main")
    assert not parents & set(handed), "a worker carries none of the parent's thread, and never its session, which its report would take as its own"
    assert handed["JOURNAL_ACTOR"] == "worker-agent" and handed["JOURNAL_ENV"] == "main"


def test_a_hook_whose_launch_id_names_another_environments_launch_is_reported_and_registers_no_agent(app: App):
    import json
    from urllib.request import Request as HttpRequest, urlopen
    from journal.repositories.agents import Agents
    from journal.repositories.entries import Entries
    from journal.repositories.messages import Messages
    launches = app.config.home / "runtime" / "launches"
    launches.mkdir(parents=True, exist_ok=True)
    (launches / "main.json").write_text(json.dumps({"launch": "launch-main"}))
    (launches / "spike.json").write_text(json.dumps({"launch": "launch-spike"}))
    app.runtime().start()
    try:
        def started(session: str, launch: str) -> int:
            body = json.dumps({"hook_event_name": "SessionStart", "session_id": session, "source": "startup"}).encode()
            request = HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=body, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main", "X-Journal-Launch": launch})
            with urlopen(request, timeout=5) as reply:
                return reply.status

        assert started("stray", "launch-spike") == 200 and started("bare", "") == 200, "a session without the launch id is let through, never refused"
        agents = app.container.get(Agents)
        assert not [agent for agent in agents.all_agents() if agent.session in ("stray", "bare")], "and never taken as the environment's agent"
        with app.container.get(Scope).environment(1):
            assert {entry.data["session_id"] for entry in app.container.get(Entries).kind_entries("unbound_session")} == {"stray", "bare"}, "its hooks are recorded"
            assert any("stray" in message.text and "launch id" in message.text for message in app.container.get(Messages).all()), "and it is reported in the chat"
        assert started("bound", "launch-main") == 200 and agents.session_agent("bound").environment_id == 1
        from journal.models.agent_role import AgentRole
        from journal.models.worker import Worker
        from journal.repositories.workers import Workers
        from journal.support.actor import Actor
        from journal.support.worker_token import WorkerToken
        with app.container.get(Scope).environment(1):
            worker = app.container.get(Workers).save(Worker(environment_id=1, name="Mr. Babbage", brief="b", token_hash=WorkerToken.hashed("tok")), Actor.system())

        def worker_started(session: str, token: str) -> int:
            body = json.dumps({"hook_event_name": "SessionStart", "session_id": session, "source": "startup"}).encode()
            request = HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=body, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main", "X-Journal-Worker": str(worker.id), "X-Journal-Worker-Token": token})
            with urlopen(request, timeout=5) as reply:
                return reply.status

        assert worker_started("w-forged", "nope") == 200 and not [a for a in agents.all_agents() if a.session == "w-forged"], "a wrong token is no worker's: its hooks are unbound"
        assert worker_started("w-real", "tok") == 200 and agents.session_agent("w-real").role == AgentRole.WORKER, "a worker's token stands in for the launch id, and its agent row is a worker's"
        with app.container.get(Scope).environment(1):
            assert app.container.get(Workers).find(worker.id).session == "w-real", "and its first hook binds the session its row did not name"
    finally:
        app.runtime().stop()


def test_a_worker_or_a_subagent_runs_only_the_verbs_its_kind_is_declared(app: App):
    from journal.features.memory.commands.fact_command import FactCommand
    from journal.features.memory.commands.rule_command import RuleCommand
    from journal.support.caller_kind import CallerKind
    console, worker, agent = app.console(), Caller.worker("main", 1, "w1", "claude"), Caller.agent("main", "s1", "claude")
    refused = console.run(["panic", "pop"], worker)
    assert refused.code == 1 and refused.error.startswith("a worker may not run journal panic apply; a worker may run ") and "journal fact list" in refused.error and "journal rule read" in refused.error, "a verb its kind does not declare is refused, naming the verbs it may run"
    assert agent.subagent_caller().kind == CallerKind.SUBAGENT and console.run(["panic", "pop"], agent.subagent_caller()).error.startswith("a subagent may not run journal panic apply")
    assert console.run(["fact", "list"], worker).code == 0 and console.run(["fact", "create", "x"], worker).code == 1, "a declared verb runs, and its neighbour stays refused"
    assert console.run(["fact", "create", "the port is 9"], agent).code == 0 and console.run(["task", "list"], MAIN).code == 0 and console.run(["task", "create", "x"], worker).code == 1, "the main agent and the user run every verb"
    assert FactCommand.callers is not RuleCommand.callers and set(FactCommand.callers) == set(RuleCommand.callers) == {"list", "read"}, "fact and rule each declare their own"


def test_the_help_of_a_noun_with_a_default_verb_lists_every_verb(app: App):
    shown = app.console().run(["setup", "--help"], MAIN)
    assert "restart" in shown.text + shown.error and "project" in shown.text + shown.error, "setup --help names every verb, its default among them"
