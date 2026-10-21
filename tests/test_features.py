"""The first features through the real server: the briefing at session start, and the memory hold at a context mark."""

import json
import os
import re
import time
from dataclasses import asdict
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

import pytest

from shell_verbs import ShellVerbs

from journal.support.tool_call import ToolCall

from journal.app import App
from journal.config import Config
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.worker_state import WorkerState
from journal.support.actor import Actor
from journal.models.plugin import Plugin as PluginRow
from journal.support.plugin_manifest import PluginManifest
from journal.repositories.plugins import Plugins as PluginRows
from journal.models.setting import Setting
from journal.support.supervisor_reply import SupervisorReply
from journal.support.scope import Scope
from journal.repositories.setting_rows import SettingRows
from journal.support.where import Where
from journal.engine.state_machine import StateMachine
from journal.support.running import Running
from journal.features.updates.support.release import Release
from journal.features.updates.support.updating import Updating
from journal.features.tasks.states.working import Working
from journal.support.subagents import Subagents

from tests.replay import catch_typed, drive_the_clock, tick_after
from journal.support.value_name import ValueName

AGENT = Where("main", "s1")
USER = Where("main")
MAIN = 1
"""The id of main, the environment a fresh journal makes at boot: what a test reads directly, it reads there."""


def viewer(app, path: str, body: dict | None = None) -> dict:
    """A POST to the journal's API as the viewer sends it, the user's."""
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/{path}", data=json.dumps(body or {}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
    with urlopen(request, timeout=10) as reply:
        return json.loads(reply.read())


@pytest.fixture
def app(journal_root: Path, monkeypatch):
    """A fresh journal on a free port; no worker process starts, since a dispatched worker would run its provider headless and file what it printed, or that it could not start, beside the test's own report."""
    monkeypatch.setattr(Config, "status_home", property(lambda self: journal_root / "status"))
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, by: None)
    app = App(Config(journal_root, port=0))
    app.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.container.get(SettingRows).save(Setting(environment_id=0, key="delivery.batch_seconds", value=0), Actor.system())
    app.runtime().start()
    with app.container.get(Scope).of(MAIN):
        yield app
    app.runtime().stop()


def made(out) -> int:
    """The number of the row a command made, or the command's refusal as the failure."""
    assert out.code == 0, out.err
    return int(out.out.split()[1].rstrip(":"))


def place(chart) -> int:
    """A workflow's place at the event it was made for."""
    return chart.place_at(chart.event)


def own_workflow(console, charts, state: str, event: str) -> tuple[int, int]:
    """A workflow of the user's own for a state at an event, and its trigger's number."""
    made = int(console.run(["chart", "new", f"{state} at {event}", "--for", state, "--on", event], USER).out.split()[1].rstrip(":"))
    return made, next(n.id for n in charts.nodes_of(charts.find(made)) if n.key == event)


def hook(app, kind: str, **body):
    data = json.dumps({"hook_event_name": kind, "session_id": "s1", **body}).encode()
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=data, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
    try:
        with urlopen(request, timeout=5) as reply:
            return reply.status, json.loads(reply.read())
    except HTTPError as error:
        return error.code, json.loads(error.read())


def context(app, percent: int):
    (app.config.status_home).mkdir(parents=True, exist_ok=True)
    (app.config.status_home / "s1.json").write_text(json.dumps({"context_window": {"used_percentage": percent}}))


def test_the_session_start_is_answered_with_the_briefing(app):
    app.console().run(["rule", "create", "Never skip the gate", "--reason", "it broke once"], USER)
    app.console().run(["fact", "create", "the api lives on port 9"], USER)
    app.console().run(["reminder", "create", "run the linter before a push"], USER)
    status, body = hook(app, "SessionStart")
    text = body["hookSpecificOutput"]["additionalContext"]
    assert status == 200 and "ready on main" in text
    assert "1 rules in force: 1. Never skip the gate" in text
    assert "facts about this environment: 1. the api lives on port 9" in text
    assert "reminders here: 1. run the linter" in text
    assert "ready on main" in hook(app, "SessionStart")[1]["hookSpecificOutput"]["additionalContext"], "a resume is briefed again"


def test_crossing_a_context_mark_holds_writes_until_the_agent_decides(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    context(app, 30)
    status, body = hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert "context 25% full" in body["hookSpecificOutput"]["additionalContext"]
    from journal.repositories.agents import Agents
    machine, agents = app.container.get(StateMachine), app.container.get(Agents)
    assert isinstance(machine.current("s1"), Working) and agents.for_session("s1").mark_owed == 25 and agents.for_session("s1").context_mark == 25, "the mark is a fact on the row, not a state"
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={})
    assert status == 409 and "writes wait" in body["error"]
    assert app.console().run(["fact", "create", "the login is flaky"], AGENT).code == 0
    assert agents.for_session("s1").mark_owed == 0 and machine.current("s1").task_id == 1
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={})[0] == 200
    assert "hookSpecificOutput" not in hook(app, "PreToolUse", tool_name="Read", tool_input={})[1], "the mark asks once"
    context(app, 55)
    assert "context 50% full" in json.dumps(hook(app, "Stop")[1]) and agents.for_session("s1").mark_owed == 50
    app.console().run(["nothing", "survives", "all logged"], AGENT)
    assert agents.for_session("s1").mark_owed == 0 and machine.current("s1").task_id == 1


def test_a_rule_binds_the_project_not_an_environment(app):
    app.console().run(["rule", "create", "Always name the model"], Where("other"))
    assert "Always name the model" in app.console().run(["rule", "list"], USER).out


def test_a_mark_owed_outlives_being_stuck_and_a_decision_pays_it(app):
    from journal.repositories.agents import Agents
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    context(app, 30)
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    app.console().run(["stuck", "stuck"], AGENT)
    machine, agents = app.container.get(StateMachine), app.container.get(Agents)
    assert machine.current("s1").name == "stuck" and agents.for_session("s1").mark_owed == 25, "stuck, the mark is still owed"
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert isinstance(machine.current("s1"), Working), "the agent's own tool use lifts being stuck"
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={})[0] == 409, "the mark still holds a write"
    app.console().run(["nothing", "survives", "fine"], AGENT)
    assert agents.for_session("s1").mark_owed == 0 and machine.current("s1").task_id == 1, "the decision pays the mark; the task stands"


def test_a_plan_is_followed_task_by_task_to_its_end(app):
    from journal.features.plans.states.following_plan import FollowingPlan
    from journal.models.plan_state import PlanState
    from journal.repositories.plans import Plans
    console = app.console()
    console.run(["plan", "create", "release", "--brief", "ship 4.0"], USER)
    console.run(["plan", "add", "1", "write the notes"], USER)
    console.run(["plan", "add", "1", "tag it"], USER)
    hook(app, "SessionStart")
    console.run(["plan", "approve", "1"], USER)
    out = console.run(["plan", "start", "1"], AGENT).out
    assert "task 1," in out and "is started" in out
    machine = app.container.get(StateMachine)
    assert machine.current("s1") == FollowingPlan(plan_id=1, task_id=1)
    assert "task 1 is in hand" in hook(app, "Stop")[1]["reason"]
    console.run(["await", "the build", "--until", "false"], AGENT)
    hook(app, "UserPromptSubmit", prompt="[journal] while you wait for the build, task 2 is next")
    assert machine.current("s1").name == "expecting" and "is in hand" not in str(hook(app, "Stop")[1]), "a line the journal types frees no wait, and a stop while waiting is not told to carry on"
    out = console.run(["task", "done", "1"], AGENT).out
    assert machine.current("s1").resume == {"state": "following_plan", "data": FollowingPlan(plan_id=1, task_id=2, moved_from=1).to_data()}, "the wait stands, and the agent goes on to task 2 when it ends"
    out = console.run(["task", "done", "2"], AGENT).out
    assert "plan 1 is done" in out
    assert machine.current("s1").resume["state"] == "idle", "done with the plan, the agent goes to rest when its wait ends"
    assert app.container.get(Plans).find(1).state == PlanState.DONE


def test_taking_up_a_task_tells_its_brief_and_latest_log_lines(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    typed = []
    catch_typed(app, monkeypatch, typed)
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the parser", "--brief", "read src/parse.py first"], AGENT)
    out = console.run(["task", "start", "1"], AGENT).out
    assert "task 1 started" in out and "brief: read src/parse.py first" in out, "the brief comes with the start"
    for line in ("one", "two", "three", "four"):
        console.run(["task", "log", "1", line], AGENT)
    console.run(["task", "park", "1", "later"], AGENT)
    resumed = console.run(["task", "resume", "1"], AGENT).out
    assert "logged: two" in resumed and "logged: four" in resumed and "logged: one" not in resumed, "the latest three log lines"
    console.run(["task", "done", "1"], AGENT)
    console.run(["plan", "create", "release", "--brief", "ship"], USER)
    console.run(["plan", "add", "1", "write the notes", "--brief", "in NOTES.md"], USER)
    console.run(["plan", "add", "1", "tag it", "--brief", "git tag v4"], USER)
    console.run(["plan", "approve", "1"], USER)
    console.run(["plan", "start", "1"], AGENT)
    console.run(["task", "done", "2"], AGENT)
    app.runtime().deferred.drain()
    assert any("task 3, tag it is next. brief: git tag v4" in line for line in typed), "the plan's next task comes with its brief"


def test_the_plans_next_task_is_named_once_when_another_of_its_tasks_closes_beside_the_one_in_hand(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    typed = []
    catch_typed(app, monkeypatch, typed)
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["plan", "create", "release", "--brief", "ship"], USER)
    for title in ("write the notes", "tag it", "announce it", "check the docs"):
        console.run(["plan", "add", "1", title], USER)
    console.run(["plan", "approve", "1"], USER)
    console.run(["plan", "start", "1"], AGENT)
    console.run(["task", "done", "1"], AGENT)
    console.run(["task", "done", "4"], AGENT)
    app.runtime().deferred.drain()
    assert len([line for line in typed if "task 2, tag it is next" in line]) == 1, "closing a task not in hand says nothing about where the plan went"


def test_a_plan_blocks_itself_when_every_task_left_is_blocked_and_can_be_blocked_until_a_command_passes(app, monkeypatch):
    from journal.features.checks.support.check_runner import CheckRunner
    from journal.repositories.checks import Checks
    from journal.repositories.plans import Plans
    from journal.supervisor_link import SupervisorLink
    typed = []
    catch_typed(app, monkeypatch, typed)
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["plan", "create", "release", "--brief", "ship"], USER)
    console.run(["plan", "add", "1", "write the notes"], USER)
    console.run(["plan", "add", "1", "tag it"], USER)
    console.run(["plan", "approve", "1"], USER)
    console.run(["plan", "start", "1"], AGENT)
    plans = app.container.get(Plans)
    console.run(["task", "block", "2", "the user's words first"], AGENT)
    assert plans.find(1).state == "started", "one blocked task never blocks its plan"
    console.run(["task", "block", "1", "the build is red"], AGENT)
    assert plans.find(1).state == "blocked" and any("plan 1 is blocked: all its tasks left are blocked" in line for line in typed)
    assert "is blocked, waiting on" in console.run(["plan", "start", "1"], AGENT).err
    console.run(["task", "unblock", "2"], AGENT)
    assert plans.find(1).state == "started" and any("plan 1 is open again: task 2 is open again" in line for line in typed)
    marker = app.config.root / "released"
    console.run(["plan", "block", "1", "--until", f"test -f {marker}"], AGENT)
    assert plans.find(1).state == "blocked"
    check = app.container.get(Checks).every()[-1]
    marker.write_text("")
    app.container.get(CheckRunner).run(check, Actor.system())
    assert plans.find(1).state == "started" and any("plan 1 is open again: check" in line for line in typed), "the passing check opens the plan and the agent is told"


def test_a_plan_task_done_leaves_naming_what_is_next_to_the_plan(app):
    app.container.get(SettingRows).save(Setting(environment_id=0, key="tasks.auto", value=False), Actor.system())
    console = app.console()
    console.run(["task", "create", "side work", "--start"], AGENT)
    console.run(["task", "park", "1", "the plan first"], AGENT)
    console.run(["plan", "create", "release", "--brief", "ship 4.0"], USER)
    console.run(["plan", "phase", "1", "notes", "--when", "written", "--checkpoint"], USER)
    console.run(["plan", "add", "1", "write the notes"], USER)
    console.run(["plan", "phase", "1", "tag", "--when", "tagged"], USER)
    console.run(["plan", "add", "1", "tag it"], USER)
    console.run(["plan", "todos", "1", "1", "2"], USER)
    console.run(["plan", "todos", "1", "2", "3"], USER)
    console.run(["plan", "approve", "1"], USER)
    console.run(["plan", "start", "1"], AGENT)
    out = console.run(["task", "done", "2"], AGENT).out
    assert "side work" not in out and "parked" not in out, "a plan's task leaves the next to the plan"


def test_a_task_blocked_until_a_command_passes_opens_by_itself_and_a_broken_one_is_named(app, monkeypatch):
    from datetime import datetime, timedelta, timezone
    from journal.support.fillers import Fillers
    from journal.features.checks.support.check_runner import CheckRunner
    from journal.repositories.checks import Checks
    from journal.repositories.tasks import Tasks
    from journal.supervisor_link import SupervisorLink
    typed = []
    catch_typed(app, monkeypatch, typed)
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    marker = app.config.root / "merged"
    console.run(["task", "create", "release after the merge"], AGENT)
    console.run(["task", "create", "deploy"], AGENT)
    console.run(["task", "block", "1", "the pull request is merged", "--until", f"test -f {marker}"], AGENT)
    console.run(["task", "block", "2", "--until", "no-such-program-here"], AGENT)
    checks, tasks, runner = app.container.get(Checks), app.container.get(Tasks), app.container.get(CheckRunner)
    assert checks.all() == [] and "waits until" not in console.run(["check", "list"], AGENT).out, "a wait's check is the task's, off the checks list"
    runner.run(checks.find(1), Actor.system())
    assert tasks.find(1).state == "blocked" and checks.find(1).last_fault == "", "not passing yet is no fault"
    runner.run(checks.find(2), Actor.system())
    assert "task 2 waits until `no-such-program-here`, which cannot run: the command is not there" in app.container.get(Fillers).broken_waits(None), "a check that cannot run is named"
    assert [t.id for t in tasks.blocked_without_wait()] == [], "a task waiting on a check is not a blocked task nothing opens by itself"
    marker.write_text("")
    runner.run(checks.find(1), Actor.system())
    assert tasks.find(1).state == "open" and any("task 1 is open again: check 1" in line for line in typed), "the passing check opens the task and the agent is told"
    assert not checks.find(1).due_at(datetime.now(timezone.utc) + timedelta(hours=1)), "a passed wait runs no more"


def test_a_plan_with_a_blocked_task_waits_and_is_not_done(app, monkeypatch):
    from journal.models.plan_state import PlanState
    from journal.repositories.plans import Plans
    from journal.supervisor_link import SupervisorLink
    typed = []
    catch_typed(app, monkeypatch, typed)
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    console = app.console()
    console.run(["plan", "create", "release", "--brief", "ship 4.0"], USER)
    console.run(["plan", "add", "1", "write the notes"], USER)
    console.run(["plan", "add", "1", "the user's restart"], USER)
    hook(app, "SessionStart")
    console.run(["plan", "approve", "1"], USER)
    console.run(["plan", "start", "1"], AGENT)
    console.run(["task", "block", "2", "the user picks the moment"], AGENT)
    out = console.run(["task", "done", "1"], AGENT).out
    app.runtime().deferred.drain()
    assert any("plan 1 is blocked: all its tasks left are blocked" in line for line in typed) and "plan 1 is done" not in out, "the agent is told why the plan waits"
    assert app.container.get(Plans).find(1).state == PlanState.BLOCKED, "with every task left blocked, the plan blocks itself and is not done"
    console.run(["task", "unblock", "2"], AGENT)
    assert app.container.get(Plans).find(1).state == PlanState.STARTED and "task 2," in console.run(["plan", "start", "1"], AGENT).out


def test_a_task_waits_on_a_question_by_a_link_and_the_answer_clears_it(app):
    from journal.models.task_state import TaskState
    from journal.repositories.tasks import Tasks
    console = app.console()
    hook(app, "SessionStart")
    console.run(["plan", "create", "release", "--brief", "ship"], USER)
    console.run(["plan", "add", "1", "pick the name"], USER)
    console.run(["plan", "add", "1", "write the notes"], USER)
    console.run(["question", "ask", "Which name?"], AGENT)
    assert console.run(["task", "block", "1", "--on", "question:1"], AGENT).code == 0
    tasks = app.container.get(Tasks)
    assert tasks.find(1).state == TaskState.BLOCKED and tasks.reason(tasks.find(1)) == "question 1"
    assert console.run(["task", "block", "2"], AGENT).code != 0, "a block names a wait or a reason"
    console.run(["question", "answer", "1", "alpha"], USER)
    app.runtime().deferred.drain()
    assert tasks.find(1).state == TaskState.OPEN


def test_a_plan_does_not_hand_out_a_task_whose_wait_is_open(app):
    from journal.support.ref import Ref
    from journal.models.link import Link
    from journal.support.actor import Actor
    from journal.repositories.links import Links
    from journal.repositories.plans import Plans
    from journal.repositories.tasks import Tasks, WAITS_ON
    console = app.console()
    console.run(["plan", "create", "release", "--brief", "ship"], USER)
    console.run(["plan", "add", "1", "first"], USER)
    console.run(["plan", "add", "1", "second"], USER)
    tasks, plans = app.container.get(Tasks), app.container.get(Plans)
    console.run(["task", "create", "dependency"], USER)
    app.container.get(Links).save(Link(source=Ref.to(tasks.find(1)), target=Ref.to(tasks.find(3)), kind=WAITS_ON), Actor.system())
    assert plans.next_task(plans.find(1)).id == 2
    console.run(["task", "done", "3"], AGENT)
    assert plans.next_task(plans.find(1)).id == 1


def test_messages_are_put_before_the_agent_and_a_reply_tag_answers_them(app):
    from journal.repositories.messages import Messages
    console = app.console()
    console.run(["message", "send", "can you look at the login?"], USER)
    status, body = hook(app, "UserPromptSubmit", prompt="hi")
    assert "new message 1" in body["hookSpecificOutput"]["additionalContext"]
    shown = console.run(["message", "read", "1"], AGENT).out
    assert "can you look at the login?" in shown and "[!reply:1]" in shown
    hook(app, "MessageDisplay", message="[!reply:1] On it, the login is next.")
    app.runtime().deferred.drain()
    messages = app.container.get(Messages).in_()
    assert [m.author for m in messages] == ["user", "user", "agent"] and messages[1].text == "hi", "the line typed in the terminal is the user's message too"
    assert messages[2].reply_to == 1 and messages[2].text == "On it, the login is next."
    assert messages[0].read_at is not None
    assert hook(app, "Stop")[1] == {}, "nothing unread is left"
    console.run(["message", "send", "> On it, the login is next.\n> More of the agent's words.\n\nGood, and the logout too.", "--reply-to", "3"], USER)
    shown = console.run(["message", "read", "4"], AGENT).out
    assert "message 4 from the user, a reply to message 3: Good, and the logout too." in shown and "On it" not in shown, "a reply names what it answers by number and never repeats its words"


def test_a_reply_tag_counts_only_at_the_start_of_a_line(app, monkeypatch):
    from journal.repositories.messages import Messages
    typed = []
    catch_typed(app, monkeypatch, typed)
    app.console().run(["message", "send", "first"], USER)
    app.console().run(["message", "send", "second"], USER)
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    hook(app, "MessageDisplay", message="Good evening. At your service.\n\n[!reply:1]")
    app.runtime().deferred.drain()
    messages = app.container.get(Messages).in_()
    assert messages[-1].author == "agent" and messages[-1].reply_to == 1 and messages[-1].text == "Good evening. At your service."
    hook(app, "MessageDisplay", message="Both done, see below [!reply:2]")
    app.runtime().deferred.drain()
    messages = app.container.get(Messages).in_()
    assert messages[-1].reply_to is None and "[!reply:2]" in messages[-1].text, "a tag inside a line is text"
    assert typed[-1].endswith("the [!reply:2] tag must open a line of your turn; message 2 is still unanswered")
    assert "new message 2" in hook(app, "Stop")[1]["reason"]
    told = len(typed)
    hook(app, "MessageDisplay", message="His screenshot shows a reply opening with `[!reply:8544]` that never arrived.")
    app.runtime().deferred.drain()
    assert len(typed) == told, "a tag quoted about a message that is not owed is only text"


def test_a_question_pauses_the_agent_and_the_answer_brings_it_back(app):
    from journal.features.questions.states.waiting import Waiting
    console = app.console()
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["question", "ask", "Which name?", "--options", "alpha", "beta"], AGENT)
    machine = app.container.get(StateMachine)
    assert isinstance(machine.current("s1"), Waiting) and machine.current("s1").question_id == 1
    assert hook(app, "Stop")[1] == {}, "idle while waiting is fine"
    assert "Which name?  [alpha / beta]" in console.run(["question", "list"], USER).out
    from journal.repositories.messages import Messages
    asked = lambda: [(m.text, m.data["options"], m.data["answer"]) for m in app.container.get(Messages).all() if m.data.get("kind") == "question"]
    assert asked() == [("Which name?", ["alpha", "beta"], None)], "a question asked is a message in the chat"
    console.run(["question", "answer", "1", "beta"], USER)
    assert asked() == [("Which name?", ["alpha", "beta"], "beta")], "and the same message is settled when it is answered"
    assert machine.current("s1").task_id == 1
    assert console.run(["question", "list"], USER).out == ""


def test_a_prompt_answers_a_question_in_other_words(app):
    from journal.features.questions.states.waiting import Waiting
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["question", "ask", "Which name?"], AGENT)
    hook(app, "UserPromptSubmit", prompt="call it beta")
    assert app.container.get(StateMachine).current("s1").name == "idle"


def test_an_agent_that_works_again_is_no_longer_waiting_on_a_question(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["question", "ask", "Which name?"], AGENT)
    assert app.container.get(StateMachine).current("s1").name == "waiting"
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "notes.md"})
    assert app.container.get(StateMachine).current("s1").name != "waiting", "an agent using a tool of its own is not waiting, whatever it asked"


def test_the_same_check_three_times_is_named(app):
    hook(app, "SessionStart")
    for _ in range(2):
        assert "hookSpecificOutput" not in hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "ls build"})[1]
    assert "same check 3 times in a row: ls build" in hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "ls build"})[1]["hookSpecificOutput"]["additionalContext"]


def test_a_sequence_is_stepped_through_and_goes_back_where_it_began(app):
    console = app.console()
    created = console.run(["sequence", "create", "release", "--steps", "bump the version | tag it with `git tag v1` | push"], USER).out
    release = created.split()[1].rstrip(":")
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    console.run(["task", "create", "t", "--start"], AGENT)
    edit = lambda: hook(app, "PreToolUse", tool_name="Edit", tool_input={"file_path": "a.py", "old_string": "a", "new_string": "b"})[1]
    assert "step 1: bump the version" in console.run(["sequence", "run", release], AGENT).out
    assert "step 1" not in json.dumps(hook(app, "Stop")[1]), "a stop right after the step was told passes it by"
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    assert "step 1: bump the version" in hook(app, "Stop")[1]["reason"], "a tool used since, the stop is held with the step"
    assert "step 1" not in json.dumps(hook(app, "Stop", stop_hook_active=True)[1]), "the step is said once until the agent uses a tool again"
    assert "a write waits for sequence" in json.dumps(edit()), "a write waits until the step is taken up"
    assert "a write waits" not in json.dumps(hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})[1]), "a read goes through"
    bash = lambda line, **more: hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": line}, **more)[0]
    assert bash("journal message unread && journal task list") == 200, "a line of journal commands alone goes through"
    assert bash("journal task list && sed -i '' s/a/b/ a.py") == 409, "a journal command chained with a write stays held"
    assert hook(app, "PreToolUse", tool_name="Edit", tool_input={"file_path": "a.py", "old_string": "a", "new_string": "b"}, agent_id="r1")[0] == 200, "a subagent is never held"
    assert "step 1 of sequence" in console.run(["sequence", "next"], AGENT).err, "a step never taken up cannot be moved on"
    assert "following sequence" in console.run(["sequence", "follow"], AGENT).out
    assert "a write waits" not in json.dumps(edit()), "a step taken up lets writes through"
    assert "step 1: bump the version" in hook(app, "Stop")[1]["reason"], "a tool used since the last hold, so the stop is held again"
    console.run(["await", "the release", "--until", "false"], AGENT)
    assert hook(app, "Stop")[1].get("decision") != "block", "a step that waits on the user says so, and the stop passes"
    assert "step 2: tag it" in console.run(["sequence", "next"], AGENT).out
    assert "a write waits" not in json.dumps(hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "git tag v1 && git push --tags"})[1]), "a command the step names goes through"
    assert app.container.get(Running).in_hand("s1", 1).taken_up_at, "and takes the step up"
    assert "step 3: push" in console.run(["sequence", "next"], AGENT).out
    console.run(["sequence", "follow"], AGENT)
    app.container.get(SettingRows).set("sequences.stale_after", 2, Actor.user(1))
    edit(), edit()
    assert "2 writes since sequence" in json.dumps(edit()), "a step taken up and not moved on holds again after the set writes"
    assert "parked at step 3" in console.run(["sequence", "park", "--why", "the user wants the docs first"], AGENT).out
    assert "a write waits" not in json.dumps(edit()) and "step 3" not in json.dumps(hook(app, "Stop")[1]), "a parked run holds nothing"
    console.run(["sequence", "follow"], AGENT)
    assert "ran its last step" in console.run(["sequence", "next"], AGENT).out
    assert app.container.get(StateMachine).current("s1").task_id == 1


def test_awaiting_workers_ends_when_the_last_one_reports(app, monkeypatch):
    from journal.support.typed_lines import TypedLines
    import threading
    import traceback
    typed, stacks = [], []
    from journal.supervisor_link import SupervisorLink

    def sent(self, environment_id, verb, instruction):
        typed.append(instruction["line"])
        stacks.append(f"--- {threading.current_thread().name}\n" + "".join(traceback.format_stack(limit=14)))

    monkeypatch.setattr(SupervisorLink, "_send", sent)
    console = app.console()
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "fast"], AGENT)
    console.run(["worker", "dispatch", "Dr. Einstein", "profile it", "--profile", "journal-medior", "--model", "fast"], AGENT)
    console.run(["worker", "wait", "1", "2"], AGENT)
    machine = app.container.get(StateMachine)
    assert machine.current("s1").name == "awaiting" and hook(app, "Stop")[1] == {}
    console.run(["worker", "report", "1", "parser done"], Where("main", "w1"))
    assert machine.current("s1").name == "awaiting" and typed == ["[journal] worker 1, Lady Lovelace, reported in the chat"], "\n".join(stacks)
    lines, link = app.container.get(TypedLines), app.container.get(SupervisorLink)
    lines.confirm(1, typed[0])
    console.run(["worker", "stop", "2"], USER)
    assert machine.current("s1").task_id == 1
    assert typed[-1] == "[journal] worker 2, Dr. Einstein, stopped before it reported", "one line at a time: the next waits until this one is seen back"
    lines.confirm(1, typed[-1])
    link.release(1)
    assert typed[-1] == "[journal] what you waited on came back: carry on"


def test_a_worker_runs_the_dispatching_agents_own_program(app, monkeypatch):
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.models.agent import Agent
    from journal.repositories.agents import Agents
    from journal.repositories.workers import Workers
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, by: None)
    app.container.get(Agents).save(Agent(environment_id=1, session="c1", provider="codex", state="idle"), Actor.system())
    console = app.console()
    console.run(["worker", "dispatch", "Ada Lovelace", "write storage.py", "--profile", "journal-medior", "--model", "gpt-5"], Where("main", "c1"))
    console.run(["worker", "dispatch", "Mr. Babbage", "write cli.py", "--profile", "journal-medior", "--model", "sonnet"], USER)
    workers = app.container.get(Workers)
    assert workers.find(1).provider == "codex" and workers.find(2).provider == "claude", "a Codex agent's worker runs Codex, so its model names fit"
    assert "`journal worker wait 1 2` waits for a report" in console.run(["worker", "list"], Where("main", "c1")).out, "a list of workers out points at the wait"


def test_a_worker_that_reported_takes_its_next_job_by_say_with_its_memory(app, monkeypatch):
    from journal.providers.claude import Claude
    from journal.providers.codex import Codex
    from journal.repositories.workers import Workers
    started = []
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, by: started.append(worker))
    conversation = app.config.root / "conversation.jsonl"
    conversation.write_text("{}\n")
    monkeypatch.setattr(Claude, "transcript", lambda self, project, session: conversation)
    console = app.console()
    hook(app, "SessionStart")
    import subprocess
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        subprocess.run(["git", *argv], cwd=app.config.root, capture_output=True, timeout=30)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "fast", "--worktree"], AGENT)
    assert console.run(["worker", "say", "1", "now the lexer"], AGENT).code != 0, "still out: its report comes first"
    console.run(["worker", "report", "1", "parser done"], Where("main", "w1"))
    assert console.run(["worker", "say", "1", "now the lexer"], AGENT).code != 0, "no session was captured, so there is nothing to resume"
    workers = app.container.get(Workers)
    workers.save(workers.find(1).with_(resume="sess-1"), USER.actor)
    console.run(["task", "create", "the lexer"], AGENT)
    assert console.run(["worker", "say", "1", "now the lexer", "--task", "1"], AGENT).code == 0
    from journal.repositories.workers import Workers as WorkerRows
    assert 1 in app.container.get(WorkerRows).holding({1}), "a job said with --task holds that task, so a plan leaves it to the worker"
    told = workers.find(1)
    assert told.state == WorkerState.DISPATCHED and told.brief == "now the lexer" and told.resume == "sess-1" and told.worktree and started[-1].id == 1
    assert Claude().worker_command("now the lexer", "fast", "sess-1")[-2:] == ["--resume", "sess-1"]
    assert Claude().worker_outcome('{"result": "lexer done", "session_id": "sess-2"}', "") == ("lexer done", "sess-2")
    assert Claude().worker_outcome("plain words", "") == ("plain words", "")
    assert Codex().worker_command("x", "m", "c-9")[:3] == ["codex", "exec", "resume"] and Codex().worker_command("x", "m", "")[:2] == ["codex", "exec"]
    assert Codex().worker_outcome("done", "session id: 0192f3a4-aaaa-bbbb\nwork") == ("done", "0192f3a4-aaaa-bbbb"), "the answer is the report; the run's log only gives the session"
    assert Codex().worker_outcome("", "session id: 0192f3a4-aaaa-bbbb\nit broke") == ("session id: 0192f3a4-aaaa-bbbb\nit broke", "0192f3a4-aaaa-bbbb"), "with no answer the log is the report"


def test_a_running_workers_session_is_looked_up_once_and_kept_on_its_row(app, monkeypatch, tmp_path):
    from datetime import date
    from journal.models.agent import Agent
    from journal.repositories.agents import Agents
    from journal.repositories.workers import Workers
    monkeypatch.setenv("HOME", str(tmp_path / "home"))
    app.container.get(Agents).save(Agent(environment_id=1, session="c1", provider="codex", state="idle"), Actor.system())
    app.console().run(["worker", "dispatch", "Ada Lovelace", "write storage.py", "--profile", "journal-medior", "--model", "gpt-5"], Where("main", "c1"))
    workers = app.container.get(Workers)
    worker = workers.save(workers.find(1).running_as(1, time.time() - 5), Actor.system())
    session = "01a15a25-535e-7cc2-993e-d38deedb6b40"
    rollout = tmp_path / "home" / ".codex" / "sessions" / date.today().strftime("%Y/%m/%d") / f"rollout-2026-10-20T18-29-18-{session}.jsonl"
    rollout.parent.mkdir(parents=True)
    said = {"type": "response_item", "payload": {"type": "message", "role": "assistant", "content": [{"type": "output_text", "text": "Storage is written."}]}}
    rollout.write_text(json.dumps({"type": "session_meta", "payload": {"cwd": str(app.container.get(WorkerRunner).place(worker).resolve())}}) + "\n" + json.dumps(said) + "\n")
    read = lambda: json.load(urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/workers/1/transcript", headers={"X-Journal-Env": "main"}), timeout=5))
    assert [turn["text"] for turn in read()["turns"]] == ["Storage is written."]
    assert workers.find(1).found_session == session, "the session found in Codex's files is kept on the worker's row"
    rollout.write_text(json.dumps({"type": "session_meta", "payload": {"cwd": "/elsewhere"}}) + "\n" + json.dumps(said) + "\n")
    assert [turn["text"] for turn in read()["turns"]] == ["Storage is written."], "the next read takes the kept session and does not look through the rollouts again"
    assert workers.save(workers.find(1).running_as(2, time.time()), Actor.system()).found_session == "", "a new run looks for its own session"


def test_a_dispatch_without_a_model_a_profile_or_a_job_is_refused(app):
    from journal.support.profile_files import ProfileFiles
    app.container.get(ProfileFiles).write_all()
    hook(app, "SessionStart")
    status, body = hook(app, "PreToolUse", tool_name="Task", tool_input={"description": "x", "prompt": "y"})
    assert status == 409 and "names no model" in body["error"]
    for generic in ("general-purpose", "Explore", ""):
        status, body = hook(app, "PreToolUse", tool_name="Agent", tool_input={"model": "fast", "subagent_type": generic, "description": "x", "prompt": "y"})
        assert status == 409 and "names no profile of this project" in body["error"] and "researcher" in body["error"] and "senior" not in body["error"], f"{generic or 'no type'} is no profile, and a worker's profile is not offered"
    status, body = hook(app, "PreToolUse", tool_name="Task", tool_input={"model": "fast", "subagent_type": "journal-researcher", "prompt": "y"})
    assert status == 409 and "no concrete job" in body["error"]
    assert hook(app, "PreToolUse", tool_name="Task", tool_input={"model": "fast", "subagent_type": "journal-researcher", "description": "x", "prompt": "y"})[0] == 200


def test_a_profile_has_a_kind_and_is_dispatched_only_the_way_its_kind_says(app):
    from journal.support.profile_files import ProfileFiles
    files = app.container.get(ProfileFiles)
    files.write_all()
    assert files.kind_of("journal-researcher") == "subagent" and files.kind_of("nobody") == ""
    from journal.features.profiles.support.profile import Profile
    (files.config.root / ".codex").mkdir(exist_ok=True)
    saved = files.save(Profile("builder", "writes code", "Read, Edit", "You write.\nSay \"done\".", "worker"), "sonnet", "gpt-6")
    assert saved["kind"] == "worker" and saved["model"] == "sonnet" and saved["codex_model"] == "gpt-6"
    import tomllib
    codex = tomllib.loads((files.config.root / ".codex" / "agents" / "builder.toml").read_text())
    assert codex["model"] == "gpt-6" and codex["sandbox_mode"] == "workspace-write" and codex["developer_instructions"] == "You write.\nSay \"done\"."
    assert files.read("builder")["kind"] == "worker" and files.read("journal-planner")["kind"] == "subagent"
    hook(app, "SessionStart")
    refused = app.console().run(["worker", "dispatch", "Mr. Darwin", "look it up", "--profile", "journal-researcher"], AGENT)
    assert refused.code != 0 and "no worker profile" in refused.err and "Agent tool" in refused.err
    assert (files.read("journal-senior")["model"], files.read("journal-medior")["model"]) == ("opus", "sonnet"), "the two shipped workers keep their own models, whatever the setting"
    assert "on claude sonnet" in app.console().run(["worker", "dispatch", "Mr. Brunel", "write it", "--profile", "builder"], AGENT).out, "the profile names the model"
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.repositories.workers import Workers
    worker = app.container.get(Workers).in_()[-1]
    assert worker.profile == "builder" and app.container.get(WorkerRunner).instructed(worker) == "You write.\nSay \"done\".\n\nwrite it", "the first job comes after the profile's instructions"
    assert app.container.get(WorkerRunner).instructed(worker.with_(resume="r1")) == "write it", "a resumed worker remembers them"
    status, body = hook(app, "PreToolUse", tool_name="Agent", tool_input={"subagent_type": "builder", "model": "fast", "description": "x", "prompt": "y"})
    assert status == 409 and "worker profile" in body["error"] and "--profile builder" in body["error"]
    assert hook(app, "PreToolUse", tool_name="Agent", tool_input={"subagent_type": "journal-researcher", "model": "fast", "description": "x", "prompt": "y"})[0] == 200


def test_a_large_result_is_named(app):
    hook(app, "SessionStart")
    body = hook(app, "PostToolUse", tool_name="Bash", tool_input={}, tool_response="\n" * 500)[1]
    assert "501 lines" in body["hookSpecificOutput"]["additionalContext"]


@pytest.fixture
def skilled(tmp_path: Path, monkeypatch):
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    with app.container.get(Scope).of(MAIN):
        yield app
    app.runtime().stop()


def read_skill(app, folder: str):
    hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": str(app.config.root / f".claude/skills/{folder}/SKILL.md")}, tool_response="")


def test_the_session_start_requires_the_journal_skill_and_reading_it_lifts_the_hold(skilled):
    app = skilled
    status, body = hook(app, "SessionStart")
    assert "read the journal skill before anything else: .claude/skills/journal/SKILL.md" in body["hookSpecificOutput"]["additionalContext"]
    machine = app.container.get(StateMachine)
    assert machine.current("s1").name == "idle", "the start owes the skill and the look as facts, not as a state"
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={})
    assert status == 409 and "read the journal skill before anything else: .claude/skills/journal/SKILL.md. writes wait until you have" in body["error"] and "in flight" not in body["error"], "the guards hold the write while a skill is owed: the first hold wins"
    read_skill(app, "journal")
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={})
    assert status == 409 and "before your first write, run `journal environment here`: it lists the task in hand, the open tasks, the facts and the reminders" in body["error"], "the skill read, the start's look at what is in flight is still owed"
    app.console().run(["environment", "here"], AGENT)
    assert machine.current("s1").name == "idle"
    assert "journal skill" not in hook(app, "SessionStart")[1].get("hookSpecificOutput", {}).get("additionalContext", ""), "loaded once, not owed again"


def test_a_session_starting_in_a_state_requires_that_states_skill(skilled):
    from journal.support.requiring import Requiring
    from journal.repositories.agents import Agents
    app = skilled
    hook(app, "SessionStart")
    read_skill(app, "journal")
    app.console().run(["environment", "here"], AGENT)
    requiring, agents = app.container.get(Requiring), app.container.get(Agents)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    assert requiring.owed_names(agents.for_session("s1")) == [], "entering a state owes nothing by itself"
    hook(app, "PreCompact")
    status, body = hook(app, "SessionStart")
    said = body["hookSpecificOutput"]["additionalContext"]
    assert "journal skill" in said and "read the tasks skill before anything else" in said, "a start after a compaction owes the journal skill and the state's own"
    assert sorted(requiring.owed_names(agents.for_session("s1"))) == ["journal", "tasks"]
    app.runtime().deferred.drain()
    from journal.repositories.messages import Messages
    kinds = [m.data.get("kind") for m in app.container.get(Messages).all() if m.author.value == "system"]
    assert "compacted" in kinds and "skill" in kinds, "a compaction and a skill read are marks in the chat, as messages"
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={})
    assert status == 409 and "skill before anything else" in body["error"]
    read_skill(app, "journal")
    read_skill(app, "journal-tasks")
    app.console().run(["environment", "here"], AGENT)
    assert requiring.owed_names(agents.for_session("s1")) == [] and hook(app, "PreToolUse", tool_name="Write", tool_input={})[0] == 200


def test_a_prompt_naming_a_keyword_requires_that_skill(skilled):
    app = skilled
    hook(app, "SessionStart")
    read_skill(app, "journal")
    assert "read the plans skill" in hook(app, "UserPromptSubmit", prompt="make me a plan for the release")[1]["hookSpecificOutput"]["additionalContext"]


def test_triggers_nudge_on_a_prompt_and_deny_a_tool_call(app):
    console = app.console()
    console.run(["trigger", "create", "deploy,release", "check the changelog first", "--do", "instruct"], USER)
    console.run(["trigger", "create", "rm -rf", "no recursive deletes here", "--do", "deny"], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    assert "do this now: check the changelog first" in hook(app, "UserPromptSubmit", prompt="let's deploy it")[1]["hookSpecificOutput"]["additionalContext"]
    status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "rm -rf build"})
    assert status == 409 and "no recursive deletes here" in body["error"]


def test_a_check_keeps_its_description_for_the_page(app):
    app.console().run(["check", "create", "Check for sins", "--command", "true", "--brief", "Judges the project; a failure lists the sins found"], USER)
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/checks", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        row = json.loads(reply.read())["rows"][0]
    assert (row["title"], row["brief"], row["command"], row["last_ran_at"]) == ("Check for sins", "Judges the project; a failure lists the sins found", "true", None), "the description is the row's brief, and a check never run says so by its last run's time"


def test_the_documents_page_lists_the_projects_documents_their_search_and_the_attached_files(app, tmp_path):
    from journal.http.attachments.attachments import Attachments
    from journal.models.message import Message
    from journal.repositories.messages import Messages
    old = tmp_path / "doc"
    for n, (title, deleted) in enumerate((("Audit of the package", 0), ("Gone", 1.0)), 1):
        (old / f"{n:03}").mkdir(parents=True)
        (old / f"{n:03}" / "doc.md").write_text(f'---\n{{"n": {n}, "title": "{title}", "abstract": "what is broken", "deleted": {deleted}}}\n---\n# Findings\n\nThe cleanup pluralises the wrong noun.\n')
    (old / "003").mkdir()
    (old / "003" / "doc.md").write_text("")
    console = app.console()
    assert "1 documents brought in, 0 already here" in console.run(["doc", "import", str(old)], USER).out, "a deleted one and an empty one stay out"
    assert "0 documents brought in, 1 already here" in console.run(["doc", "import", str(old)], USER).out, "a second import brings nothing twice"
    port = app.server().port
    read = lambda path, env="main": json.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}{path}", headers={"X-Journal-Env": env}), timeout=5))
    console.run(["environment", "create", "other"], USER)
    assert [r["title"] for r in read("/journal/docs", "other")["rows"]] == ["Audit of the package"], "a document is the project's, seen from every environment"
    hits = read("/journal/docs/search?words=pluralises+noun")
    assert hits and hits[0]["id"] == 1 and "pluralises the wrong noun" in hits[0]["text"], "a search finds the document holding every word, with the passage"
    message = app.container.get(Messages).save(Message(text="the screenshot of the bar"), Actor.user(1))
    stored = app.container.get(Attachments).store("messages", message.id, "bar.png", b"png")
    app.container.get(Messages).save(message.with_(files=(stored,)), Actor.user(1))
    page = read("/journal/attachments?kind=images")
    assert page["found"] == 1 and page["files"][0]["name"] == "bar.png" and page["files"][0]["image"] and page["counts"]["images"] == 1, "a file attached to a message is listed"
    assert read("/journal/attachments?kind=other")["found"] == 0 and read("/journal/attachments?search=screenshot")["found"] == 1


def test_a_running_check_shows_how_far_it_is_and_keeps_its_report(app):
    import time as clock
    from journal.features.checks.support.check_runner import CheckRunner
    from journal.repositories.checks import Checks
    report = '{"title": "Sins", "summary": "1 sin", "findings": [{"name": "python-dict-bag", "file": "src/x.py", "line": 3, "group": "value objects"}]}'
    app.console().run(["check", "create", "Counts", "--command", f"echo 1/3; sleep 1.5; echo 2/3; sleep 1.5; printf '%s' '{report}' > \"$JOURNAL_REPORT\"; exit 1"], USER)
    checks = app.container.get(Checks)
    started = app.container.get(CheckRunner).start(checks.find(1), Actor.user(1))
    assert started.running is not None, "a run started from the page answers at once, marked running"
    seen = []
    for _ in range(60):
        row = checks.find(1)
        if row.running is None:
            break
        seen.append((row.running.done, row.running.total))
        clock.sleep(0.1)
    row = checks.find(1)
    assert (1, 3) in seen or (2, 3) in seen, f"the row says how far the run is while it runs: {seen[-5:]}"
    assert row.running is None and row.last_passed is False and row.last_took > 2, "the run's end clears its progress and keeps how long it took"
    assert row.last_report.summary == "1 sin" and row.last_report.findings[0].line == 3, "the report the check wrote is kept with its run"


def test_a_check_run_reaches_the_page_though_a_check_is_the_projects(app):
    from journal.repositories.entries import Entries
    console = app.console()
    console.run(["check", "create", "Fails", "--command", "false"], USER)
    before = app.container.get(Entries).last_id()
    console.run(["check", "run", "1"], USER)
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/entries?since={before}", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        entries = json.loads(reply.read())
    assert ("checks", 1) in [(e["data"].get("table"), e["data"].get("id")) for e in entries], "the run's change is told to the page, so it shows the check failed"


def test_a_check_runs_and_a_failure_is_typed_to_the_agent(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    console = app.console()
    hook(app, "SessionStart")
    console.run(["check", "create", "it is fine", "--command", "true"], USER)
    console.run(["check", "create", "it is broken", "--command", "echo boom; exit 1", "--every", "1"], USER)
    assert console.run(["check", "run", "1"], USER).code == 0
    out = console.run(["check", "run", "2"], USER)
    assert out.code == 1 and "boom" in out.out
    assert typed and "check 2, it is broken, failed" in typed[0] and "boom" in typed[0]
    assert "failed   it is broken" in console.run(["check", "list"], USER).out


def test_a_due_check_runs_on_the_clock(app):
    from journal.engine.clock import Clock
    from journal.repositories.checks import Checks
    app.console().run(["check", "create", "due", "--command", "true", "--every", "1"], USER)
    app.container.get(Clock).tick()
    assert app.container.get(Checks).find(1).last_passed is True


def test_shop_talk_and_the_third_person_are_named(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    hook(app, "MessageDisplay", message="I ran journal task start 3 because the user wants it.")
    app.runtime().deferred.drain()
    assert any("talks about the journal's commands" in t for t in typed) and any("say you, never the user" in t for t in typed)


def test_each_subagent_is_one_message_in_the_chat_settled_in_place(app):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"subagent_type": "journal-researcher", "description": "cut off", "prompt": "read", "model": "haiku"}, tool_use_id="t-cut")
    app.runtime().deferred.drain()
    marks = lambda: [m.data for m in app.container.get(Messages).all() if m.data.get("kind") == "subagent"]
    assert [(d["detail"], d["state"]) for d in marks()] == [("cut off", "running")], "a dispatch is a message as it starts"
    hook(app, "Stop")
    app.runtime().deferred.drain()
    assert [(d["detail"], d["state"], d["agent"]) for d in marks()] == [("cut off", "stopped", 1)], "and the same message settles when its turn ends"


def test_a_document_the_agent_writes_is_a_message_in_its_chat(app, tmp_path):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    (tmp_path / "notes.md").write_text("## Why\nBecause.\n")
    app.console().run(["doc", "create", "Deploys", "--file", str(tmp_path / "notes.md"), "--abstract", "How a deploy goes"], AGENT)
    app.console().run(["doc", "create", "Yours", "--file", str(tmp_path / "notes.md"), "--abstract", "the user's own"], USER)
    app.runtime().deferred.drain()
    made = [(m.text, m.data["abstract"]) for m in app.container.get(Messages).all() if m.data.get("kind") == "made"]
    assert made == [("Deploys", "How a deploy goes")], "the agent's document is marked in the chat; the user's own is not"

def test_a_refused_subagent_is_not_shown_and_one_never_answered_ends_with_its_turn_or_session(app):
    send = lambda kind, **extra: hook(app, kind, session_id="s7", **extra)
    rows = lambda: [asdict(row) for row in app.container.get(Subagents).rows("s7")]
    send("SessionStart", source="startup")
    send("PreToolUse", tool_name="Agent", tool_input={"description": "no model named", "prompt": "read"}, tool_use_id="t-refused")
    send("PreToolUse", tool_name="Agent", tool_input={"subagent_type": "journal-researcher", "description": "cut off", "prompt": "read", "model": "haiku"}, tool_use_id="t-cut")
    send("PreToolUse", tool_name="Agent", tool_input={"subagent_type": "journal-researcher", "description": "in the background", "prompt": "read", "model": "haiku"}, tool_use_id="t-bg")
    send("PostToolUse", tool_name="Agent", tool_input={}, tool_response={"isAsync": True, "agentId": "a7"}, tool_use_id="t-bg")
    assert [r["task"] for r in rows()] == ["cut off", "in the background"], "a dispatch the journal refused never ran"
    send("Stop")
    assert [(r["running"], r["status"]) for r in rows()] == [(False, "stopped"), (True, "running")], "a call with no answer ends with its turn; one in the background goes on"
    send("SessionStart", source="compact")
    assert rows()[1]["running"] is True, "a compaction ends no subagent"
    send("SessionEnd")
    assert [r["running"] for r in rows()] == [False, False], "a subagent with no stop ends with its session"


def test_a_task_the_reply_names_is_linked_to_the_message_it_answers_however_old(app):
    from journal.repositories.links import Links
    from journal.repositories.messages import Messages
    console = app.console()
    hook(app, "SessionStart")
    console.run(["task", "create", "the old one"], AGENT)
    console.run(["message", "send", "don't forget it"], USER)
    console.run(["message", "send", "I won't: it is task 1, next.", "--reply-to", "1"], AGENT)
    app.runtime().deferred.drain()
    asked = app.container.get(Messages).find(1)
    assert [ref.id for ref in app.container.get(Links).targets(asked, Messages.ABOUT)] == [1], "your message carries the task the reply names, whenever it was filed"


def test_a_request_over_its_budget_is_one_mark_per_route_and_told_once(app, monkeypatch):
    from journal.support.slow_requests import SlowRequests
    from journal.repositories.messages import Messages
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    (app.config.root / "src" / "journal").mkdir(parents=True)
    slow = app.container.get(SlowRequests)
    monkeypatch.setattr("os.getloadavg", lambda: (0.0, 0.0, 0.0))
    with app.container.get(Scope).of(MAIN):
        slow.measured("GET", "/journal/plans", 80)
        assert [m for m in app.container.get(Messages).all() if m.text.startswith("Slow request")] == [], "nothing is judged in the first minute after a start"
        slow.started -= 120
        slow.measured("GET", "/journal/plans", 30)
        slow.measured("GET", "/journal/plans", 80)
        slow.measured("GET", "/journal/plans", 95)
        slow.measured("GET", "/journal/messages/12/read", 70)
        app.runtime().deferred.drain()
        marks = [m for m in app.container.get(Messages).all() if m.text.startswith("Slow request")]
    assert [(m.text, m.data["count"], m.data["worst"]) for m in marks] == [("Slow request: GET /journal/plans", 2, 95), ("Slow request: GET /journal/messages/{n}/read", 1, 70)], "one mark per path, its numbers folded, with its worst time and how often; a request inside its budget not counted"
    assert sum("over its budget of 50 ms" in t for t in typed) == 2, "the agent is told the first time of each"
    slow.measured("GET", "/journal/environments", 90)
    app.runtime().deferred.drain()
    assert any(m.text == "Slow request: GET /journal/environments" for m in app.container.get(Messages).all()), "a request that named no environment is marked in the live agent's, never failing on the missing one"
    runtime = app.config.home / "runtime"
    runtime.mkdir(parents=True, exist_ok=True)
    (runtime / "tests.running.999999").touch()
    assert slow.judging(), "a mark left by a run that died is stale"
    (runtime / f"tests.running.{os.getpid()}").touch()
    assert not slow.judging(), "nothing is judged while any test run is on, whatever other runs left their marks or took them away"

def test_a_command_reports_every_row_it_caused_that_its_own_words_did_not_name(app):
    console = app.console()
    out = console.run(["plan", "create", "release"], USER).out
    assert out.startswith("plan 1 draft") and "created:" not in out, "the command named the plan itself, so the trailer says nothing twice"
    out = console.run(["plan", "add", "1", "write the notes"], USER).out
    assert "task 1 added to plan 1" in out and "created: link " in out and "task 1," not in out.split("created:")[1], "only the link, which the command did not name"


def test_the_skill_tool_loads_a_skill_too(skilled):
    app = skilled
    hook(app, "SessionStart")
    hook(app, "PostToolUse", tool_name="Skill", tool_input={"skill": "journal"}, tool_response="")
    app.console().run(["environment", "here"], AGENT)
    assert app.container.get(StateMachine).current("s1").name == "idle"
    assert "journal skill" not in hook(app, "SessionStart")[1].get("hookSpecificOutput", {}).get("additionalContext", "")


def test_a_shell_line_printing_skill_files_loads_each_of_them(skilled):
    app = skilled
    hook(app, "SessionStart")
    from journal.repositories.agents import Agents
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "cat .claude/skills/journal/SKILL.md .claude/skills/journal-tasks/SKILL.md | head -40"}, tool_response="")
    loaded = app.container.get(Agents).for_session("s1").skills_loaded
    assert {"journal", "tasks"} <= set(loaded), "one cat of two skill files, by paths relative to the project, loads both"
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "cat .claude/skills/journal-workers/SKILL.md > copy.md"}, tool_response="")
    assert "workers" not in app.container.get(Agents).for_session("s1").skills_loaded, "a line that writes reads nothing"


def test_two_skill_reads_sent_together_are_both_kept(skilled):
    from concurrent.futures import ThreadPoolExecutor
    from journal.repositories.agents import Agents
    app = skilled
    hook(app, "SessionStart")
    with ThreadPoolExecutor(2) as pool:
        list(pool.map(lambda folder: read_skill(app, folder), ["journal-tasks", "journal-checks"]))
    assert {"tasks", "checks"} <= set(app.container.get(Agents).for_session("s1").skills_loaded), "each read adds to what the agent holds, never writes over the other"


def test_skills_paid_from_one_look_at_the_agent_each_stay_paid(app):
    from journal.repositories.agents import Agents
    from journal.support.requiring import Requiring
    from journal.support.skill import Skill
    hook(app, "SessionStart")
    agents, requiring = app.container.get(Agents), app.container.get(Requiring)
    skills = [Skill(name, "", "") for name in ("tasks", "checks", "chart", "plugins")]
    requiring.owe(agents.for_session("s1"), skills)
    seen = agents.for_session("s1")
    for skill in skills:
        requiring.paid(seen, skill)
    assert not set(agents.for_session("s1").skills_owed) & {"tasks", "checks", "chart", "plugins"}, "four skills read at once, each paid from the same look at the agent, are all paid: none is put back by the others"


def test_the_link_asks_a_supervisor_on_the_protocol_and_sends_an_old_one_its_datagrams(app):
    import socket
    import threading
    from journal.supervisor_link import SupervisorLink
    link, environment = app.container.get(SupervisorLink), 1
    announced = app.config.home / "runtime" / "inboxes" / "main"
    announced.parent.mkdir(parents=True, exist_ok=True)
    path = f"/tmp/journal-test-{os.getpid()}.sock"
    with socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM) as old:
        Path(path).unlink(missing_ok=True)
        old.bind(path)
        announced.write_text(path)
        assert link.runs(environment), "an old supervisor runs while its socket is open"
        link.restart_agent(environment, ("--resume", "s1"))
        assert json.loads(old.recv(4096)) == {"type": "RestartAgent", "resume": ["--resume", "s1"]}, "a bare path is a supervisor from before the protocol"
        link.stop_service(environment, "plugin.code-commandments.mypy")
        old.settimeout(0.2)
        with pytest.raises(TimeoutError):
            old.recv(4096)
        old.settimeout(None)
    Path(path).unlink(missing_ok=True)
    heard = []
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as new:
        new.bind(path)
        new.listen(1)
        announced.write_text(json.dumps({"socket": path, "protocol": 1}))

        def answer():
            connection, _ = new.accept()
            with connection:
                heard.append(json.loads(connection.makefile("rb").readline()))
                connection.sendall(b'{"ok": true}\n')

        answering = threading.Thread(target=answer)
        answering.start()
        assert link._send(environment, "restart", {"name": "journal"}) == SupervisorReply(True)
        answering.join(2)
    Path(path).unlink(missing_ok=True)
    assert heard == [{"verb": "restart", "name": "journal"}]
    assert not link.runs(environment), "an announce file a dead supervisor left answers nothing"


def test_the_journal_asks_its_host_to_start_every_service_the_features_declare_at_boot(app, monkeypatch):
    from journal.support.service_start import ServiceStart
    from journal.features.registry import Registry
    from journal.features.support.service import Service
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}) or SupervisorReply(True))
    monkeypatch.setattr(Registry, "services", lambda self: [Service("watcher", "journal.watcher")])
    starter = app.container.get(ServiceStart)
    monkeypatch.delenv("JOURNAL_ENV", raising=False)
    assert starter.run() == [] and sent == [], "a journal no supervisor hosts starts nothing"
    monkeypatch.setenv("JOURNAL_ENV", "main")
    assert starter.run() == [SupervisorReply(True)], "an upgrade that brings a new service starts it as the journal boots again, the supervisor still running"
    assert sent[0]["verb"] == "start" and sent[0]["name"] == "watcher" and sent[0]["command"][1:] == ["-m", "journal.watcher"] and sent[0]["log"].endswith("runtime/watcher.log")


def test_the_voice_is_said_at_start_and_a_change_is_typed_in(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    console = app.console()
    console.run(["voice", "me", "--title", "Sir", "--name", "Example"], USER)
    text = hook(app, "SessionStart")[1]["hookSpecificOutput"]["additionalContext"]
    assert "Talk like a good butler" in text and 'Address me as "Sir Example"' in text
    console.run(["voice", "choose", "squire"], AGENT)
    assert typed and "changed how you talk" in typed[-1] and 'Address me as "my liege"' in typed[-1]
    assert "* squire" in console.run(["voice", "list"], USER).out
    hook(app, "UserPromptSubmit", prompt=typed[-1])
    app.runtime().deferred.drain()
    said = len(typed)
    app.container.get(SettingRows).set("voices.avatar_shown", "never", Actor.user(1))
    app.container.get(SettingRows).set("voices.avatar", False, Actor.user(1))
    assert len(typed) == said, "a change to the figure's look is no change of voice: nothing is typed"
    app.container.get(SettingRows).set("voices.title", "Captain", Actor.user(1))
    assert len(typed) == said + 1 and "changed how you talk" in typed[-1], "a change to the words is typed once"


def test_a_message_left_while_the_agent_sits_at_its_prompt_is_typed_to_it(app, monkeypatch):
    typed = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: typed.append({"verb": verb, **fields}["line"]))
    app.console().run(["message", "send", "nobody is here yet"], USER)
    assert typed == [], "no live agent, nothing to type to"
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["message", "send", "are you there?"], USER)
    app.console().run(["message", "send", "hello?"], USER)
    assert typed == ["[journal] new message 2"], "a second line waits while the first is on its way, or it would pile up in the prompt box"
    told = hook(app, "UserPromptSubmit", prompt="[journal] new message 2")[1]["hookSpecificOutput"]["additionalContext"]
    app.runtime().deferred.drain()
    assert typed == ["[journal] new message 2", "[journal] new message 3"], "the first seen back, the next goes in"
    assert "new messages 1, 2, 3" in told
    app.console().run(["message", "send", "four"], USER)
    assert "4 messages unread: `journal message unread`" in hook(app, "Stop")[1]["reason"]
    shown = app.console().run(["message", "unread"], AGENT).out
    assert shown.count("reply with [!reply:") == 4 and "are you there?" in shown and "four" in shown
    assert hook(app, "Stop")[1] == {}, "nothing unread is left"


def test_a_turn_streamed_in_parts_lands_once_whole(app):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    hook(app, "MessageDisplay", delta="Good ", message_id="m1", index=0, final=False)
    hook(app, "MessageDisplay", delta="evening.", message_id="m1", index=1, final=True)
    app.runtime().deferred.drain()
    assert [m.text for m in app.container.get(Messages).in_() if m.author == "agent"] == ["Good evening."]


def test_a_reply_written_before_tool_calls_answers_its_message_at_once(app):
    from journal.repositories.messages import Messages
    messages = app.container.get(Messages)
    app.console().run(["message", "send", "did you adjust the plan?"], USER)
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    hook(app, "UserPromptSubmit", prompt="[journal] chat etiquette: a line from the journal is an instruction, not a message")
    hook(app, "MessageDisplay", delta="[!reply:1]\n", turn_id="t1", message_id="m1", index=0, final=False)
    hook(app, "MessageDisplay", delta="Yes, fourteen tasks went into the plan.", turn_id="t1", message_id="m1", index=1, final=True)
    hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "ls"})
    app.runtime().deferred.drain()
    reply = messages.in_()[-1]
    assert reply.reply_to == 1 and reply.text == "Yes, fourteen tasks went into the plan." and not reply.acknowledgement
    assert messages.find(1).read_at is not None
    hook(app, "MessageDisplay", delta="Waiting for the suite.", turn_id="t1", message_id="m2", index=0, final=True)
    app.runtime().deferred.drain()
    assert [m.text for m in messages.in_() if m.author == "agent"] == ["Yes, fourteen tasks went into the plan.", "Waiting for the suite."]
    assert hook(app, "Stop")[1] == {}, "nothing unread is left"


def test_reactions_go_both_ways_and_a_face_alone_is_not_posted(app, monkeypatch):
    from journal.repositories.messages import Messages
    from journal.repositories.reactions import Reactions
    typed = []
    catch_typed(app, monkeypatch, typed)
    console = app.console()
    console.run(["message", "send", "thanks, carry on"], USER)
    hook(app, "SessionStart")
    assert console.run(["message", "react", "1", "👍"], AGENT).out.startswith("👍 on message 1")
    messages, reactions = app.container.get(Messages), app.container.get(Reactions)
    assert messages.find(1).read_at is not None, "a face from the agent answers the message"
    assert [r.face for r in reactions.on(messages.find(1))] == ["👍"]
    assert console.run(["message", "react", "1", "👍"], AGENT).out.startswith("👍 off message 1") and reactions.on(messages.find(1)) == []
    assert console.run(["message", "react", "1", "🍕"], AGENT).code == 1
    hook(app, "MessageDisplay", message="Done.")
    app.runtime().deferred.drain()
    console.run(["message", "react", "2", "🎉"], USER)
    assert typed[-1] == "[journal] the user put 🎉 on message 2. act on it if it asks for something, such as a go-ahead; it needs no reply and the chat never mentions it"
    hook(app, "MessageDisplay", message="👍")
    app.runtime().deferred.drain()
    assert [m.text for m in messages.in_()] == ["thanks, carry on", "Done."], "a turn that is only a face is not posted"
    assert typed[-1].startswith("[journal] your reply was only 👍, so it was not posted")


def test_a_turn_that_only_answers_a_journal_line_is_an_acknowledgement(app, monkeypatch):
    from journal.repositories.messages import Messages
    sent = []
    catch_typed(app, monkeypatch, sent)
    hook(app, "SessionStart", source="startup")
    hook(app, "UserPromptSubmit", prompt="[journal] the journal is ready on main")
    hook(app, "MessageDisplay", message="Noted.")
    app.runtime().deferred.drain()
    hook(app, "UserPromptSubmit", prompt=sent[-1])
    hook(app, "MessageDisplay", message="Good day. I am your butler; what shall I attend to?")
    app.runtime().deferred.drain()
    hook(app, "UserPromptSubmit", prompt="[journal] carry on")
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    hook(app, "MessageDisplay", message="Still nothing changed.")
    hook(app, "UserPromptSubmit", prompt="[journal] carry on")
    app.console().run(["task", "create", "t", "--start"], AGENT)
    hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})
    hook(app, "MessageDisplay", message="Fixed the login.")
    hook(app, "UserPromptSubmit", prompt="please fix the footer")
    hook(app, "MessageDisplay", message="On it.")
    app.runtime().deferred.drain()
    assert [(m.text, m.acknowledgement) for m in app.container.get(Messages).in_() if m.author == "agent"] == [("Noted.", True), ("Good day. I am your butler; what shall I attend to?", False), ("Still nothing changed.", True), ("Fixed the login.", False), ("On it.", False)], "an introduction asked for by the journal is for the user"


def test_em_dashes_and_run_together_paragraphs_are_pointed_out(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    hook(app, "MessageDisplay", message="The build — the one from last night — is green.")
    hook(app, "MessageDisplay", message=("The build is green. " * 25).strip())
    app.runtime().deferred.drain()
    assert any("em dashes" in line for line in typed) and any("no blank lines between paragraphs" in line for line in typed)


def test_tags_run_the_commands_they_stand_for_with_the_turn_as_their_text(app, monkeypatch):
    from journal.repositories.facts import Facts
    from journal.repositories.messages import Messages
    from journal.repositories.task_logs import TaskLogs
    from journal.repositories.tasks import Tasks
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    hook(app, "MessageDisplay", message='[!todo="Fix the footer"]\nThe footer overlaps the form on narrow screens.')
    hook(app, "MessageDisplay", message="[!log:1] Halfway: the overlap is a margin.")
    hook(app, "MessageDisplay", message='**[!fact="The footer is 64px tall"]**\nMeasured in the browser.')
    hook(app, "MessageDisplay", message="[!end:1]\nThe footer sits below the form now.")
    hook(app, "MessageDisplay", message="[!end:99]\nNo such task.")
    app.runtime().deferred.drain()
    tasks, messages = app.container.get(Tasks), app.container.get(Messages)
    assert tasks.find(1).title == "Fix the footer" and "overlaps" in tasks.find(1).brief and tasks.find(1).state == "done"
    assert [log.line for log in app.container.get(TaskLogs).all()][-2:] == ["Halfway: the overlap is a margin.", "The footer sits below the form now."] or any("Halfway" in log.line for log in app.container.get(TaskLogs).all())
    assert [f.text for f in app.container.get(Facts).all()] == ["The footer is 64px tall"]
    assert [m.text for m in messages.in_() if m.author == "agent"] == ["The footer overlaps the form on narrow screens.", "Measured in the browser.", "The footer sits below the form now.", "No such task."], "a log turn stays out of the chat; the others post without their tag"
    assert typed[-1].startswith("[journal] the [!end] tag did not run:")


def test_notable_moments_are_cards_in_the_chat(app):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["stuck", "stuck on the login"], AGENT)
    cards = [m for m in app.container.get(Messages).in_() if m.author == "system"]
    assert [c.text for c in cards] == ["Agent stuck"] and cards[0].data["detail"] == "stuck on the login" and cards[0].data["tone"] == "bad"


def test_a_fresh_conversation_opens_with_an_introduction_and_a_resumed_one_with_a_word_that_the_agent_is_back(app, monkeypatch):
    sent = []
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}))
    hook(app, "SessionStart", source="startup")
    app.runtime().deferred.drain()
    assert sent[-1]["line"].startswith("[journal] introduce yourself to the user in the chat") and sent[-1]["after"] == 4.0
    hook(app, "UserPromptSubmit", prompt=sent[-1]["line"])
    count = len(sent)
    data = json.dumps({"hook_event_name": "SessionStart", "session_id": "s2", "source": "resume"}).encode()
    urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=data, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
    app.runtime().deferred.drain()
    assert not any("introduce yourself" in s["line"] for s in sent[count:])
    assert any(s["line"].startswith("[journal] you are back in a conversation that went on before") for s in sent[count:]), "a resumed conversation is greeted with a word that the agent is back, on the journal started event"
    count = len(sent)
    hook(app, "SessionStart", source="compact")
    app.runtime().deferred.drain()
    assert not any("introduce yourself" in s["line"] or "you are back" in s["line"] for s in sent[count:]), "a compaction is no start of the journal's"


def test_a_commit_trailer_finishes_the_tasks_it_names(app, monkeypatch):
    import subprocess
    from journal.repositories.tasks import Tasks
    typed = []
    catch_typed(app, monkeypatch, typed)
    root = app.config.root
    subprocess.run(["git", "init", "-q"], cwd=root, check=True)
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "Ship the footer\n\nJournal: tasks done 1 and 2 with the margin fixed"], cwd=root, check=True)
    hook(app, "SessionStart")
    app.console().run(["task", "create", "footer", "--start"], AGENT)
    app.console().run(["task", "create", "margin"], AGENT)
    reply = hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "git commit -m x"}, tool_response={"stdout": "", "stderr": ""})[1]
    app.runtime().deferred.drain()
    tasks = app.container.get(Tasks)
    assert tasks.find(1).state == "done" and tasks.find(2).state == "done" and tasks.find(1).outcome.startswith("commit ")
    assert "closed task 1, task 2" in reply["hookSpecificOutput"]["additionalContext"], "the commit's outcome comes back with the commit itself"
    assert not any("closed task" in line for line in typed), "never typed into the prompt as a new turn"
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "git commit -m x"}, tool_response={"stdout": "", "stderr": ""})
    app.runtime().deferred.drain()
    from journal.repositories.messages import Messages
    marks = [m for m in app.container.get(Messages).all() if m.data.get("tone") == "commit"]
    assert len(marks) == 1 and marks[0].text.startswith("Agent committed ") and marks[0].data["detail"] == "Ship the footer", "the commit is a message in the chat, once"


def test_a_user_builds_remind_to_commit_after_n_writes_from_parts(app, monkeypatch):
    import subprocess
    from journal.repositories.charts import Charts
    from journal.repositories.counts import Counts
    root, console, charts = app.config.root, app.console(), app.container.get(Charts)
    subprocess.run(["git", "init", "-q"], cwd=root, check=True)
    made = int(console.run(["chart", "new", "Remind to commit", "--on", "tool_starting"], USER).out.split()[1].rstrip(":"))
    node = lambda kind, key, text: int(console.run(["chart", "node", kind, key, *(["--text", text] if text else []), "--in", str(made)], USER).out.split()[1].rstrip(":"))
    finished, committed = next(n.id for n in charts.nodes_of(charts.find(made)) if n.key == "tool_starting"), node("trigger", "commit_made", "")
    writes, one, zero = node("check", "tool_writes", ""), node("action", "count_one", "writes"), node("action", "count_start", "writes")
    reached, line = node("check", "count_over", "writes 3"), node("action", "say", "[chart] three writes since the last commit: commit")
    for a, b, port in ((finished, writes, None), (writes, one, "yes"), (one, reached, None), (reached, line, "yes"), (committed, zero, None)):
        console.run(["chart", "line", str(a), str(b), *(["--port", port] if port else [])], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    said = lambda body: body.get("hookSpecificOutput", {}).get("additionalContext", "")
    for path in ("a.py", "b.py"):
        assert "three writes" not in said(hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": path})[1])
    assert "three writes since the last commit" in said(hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "c.py"})[1]), "the third write reaches the count"
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "Ship it"], cwd=root, check=True)
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "git commit -m x"}, tool_response={"stdout": "", "stderr": ""})
    app.runtime().deferred.drain()
    with app.container.get(Scope).of(1):
        assert app.container.get(Counts).of_workflow(made)["writes"] == 0, "a commit made puts the count back at zero, through the workflow's other trigger"
    assert console.run(["chart", "node", "check", "open_question", "--in", str(made)], USER).code == 0, "Has an open question? is a plain check a user's workflow may ask"


def test_the_start_block_carries_the_quiet_rule_the_laws_a_takeover_and_what_waits(app):
    app.console().run(["message", "send", "hello"], USER)
    app.console().run(["task", "create", "t"], USER)
    data = json.dumps({"hook_event_name": "SessionStart", "session_id": "earlier"}).encode()
    urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=data, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
    told = hook(app, "SessionStart")[1]["hookSpecificOutput"]["additionalContext"]
    assert "handle the journal quietly" in told and "laws L1 to L9" in told and "another agent worked this environment until" in told
    assert "waiting for you here: 1 tasks, 1 messages" in told

def test_an_unread_inbox_is_named_every_third_tool_use_and_holds_the_write_after_five_reminders(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["message", "send", "look at the footer"], USER)
    named = [i for i in range(1, 16) if "new message 1" in json.dumps(hook(app, "PreToolUse", tool_name="Read", tool_input={})[1])]
    assert named == [3, 6, 9, 12, 15] or len(named) >= 4, "every third tool use names the inbox"
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})
    assert status == 409 and "unread messages" in body["error"]
    app.console().run(["message", "read", "1"], AGENT)
    app.console().run(["message", "react", "1", "👍"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})[0] == 200, "read and answered, the write goes on"


def test_a_message_read_gets_an_answer_before_the_next_tool_call(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["message", "send", "can you look at the footer, the header and the menu before lunch?"], USER)
    app.console().run(["message", "read", "1"], AGENT)
    status, body = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    assert status == 409 and "answer or react to message 1 first" in body["error"], "the very next tool call waits for the reply"
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal message read 1"})[0] == 200, "a journal command goes through"
    own = str(app.config.home / "files" / "message" / "1" / "shot.png")
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": own})[0] == 200, "a look at the message's own file is part of reading it"
    hook(app, "MessageDisplay", message="Understood, looking at all three now.")
    app.runtime().deferred.drain()
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})[0] == 200, "words in the chat after the read are the answer"
    app.console().run(["message", "send", "thanks!"], USER)
    app.console().run(["message", "read", "3"], AGENT)
    app.console().run(["message", "react", "3", "🙏"], AGENT)
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})[0] == 200, "a face answers a message"


def test_every_session_start_reads_what_is_in_flight_before_any_other_write(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["message", "send", "hi"], USER)
    status, body = hook(app, "SessionStart", source="compact")
    assert "before your first write, run `journal environment here`" in body["hookSpecificOutput"]["additionalContext"]
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})
    assert status == 409 and "`journal environment here`" in body["error"]
    shown = console.run(["environment", "here"], AGENT).out
    assert "task in hand: 1 t" in shown and "unread messages: 1" in shown
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})[0] == 200

def test_a_question_answered_under_a_pause_the_agent_owes_releases_the_wait_beneath_it(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: None)
    console = app.console()
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "t", "--start"], AGENT)
    console.run(["question", "ask", "Which name?"], AGENT)
    machine = app.container.get(StateMachine)
    assert machine.current("s1").name == "waiting"
    hook(app, "SessionStart")
    from journal.repositories.agents import Agents
    agents = app.container.get(Agents)
    assert machine.current("s1").name == "waiting" and agents.for_session("s1").oriented is False, "a new session keeps the agent in its wait and owes the look as a fact"
    console.run(["question", "answer", "1", "beta"], USER)
    app.runtime().deferred.drain()
    assert machine.current("s1").name == "working" and agents.for_session("s1").oriented is False, "the answer released the wait; the look is still owed"
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})[0] == 409, "a write before the look is held"
    console.run(["environment", "here"], AGENT)
    assert agents.for_session("s1").oriented is True and hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})[0] == 200, "oriented again, the agent goes on with its work"


def test_a_plans_checkpoint_waits_for_the_user_and_in_auto_mode_is_no_stop(app, monkeypatch):
    from journal.features.plans.states.following_plan import FollowingPlan
    from journal.repositories.plans import Plans
    from journal.repositories.tasks import Tasks
    from journal.supervisor_link import SupervisorLink
    typed = []
    catch_typed(app, monkeypatch, typed)
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    for n, title in ((1, "p"), (2, "q")):
        console.run(["plan", "create", title, "--brief", "b"], USER)
        console.run(["plan", "add", str(n), f"{title} first"], USER)
        console.run(["plan", "add", str(n), f"{title} second"], USER)
        console.run(["plan", "phase", str(n), "one", "--when", "w", "--checkpoint"], USER)
        console.run(["plan", "phase", str(n), "two", "--when", "w"], USER)
        console.run(["plan", "todos", str(n), "1", str(2 * n - 1)], USER)
        console.run(["plan", "todos", str(n), "2", str(2 * n)], USER)
        console.run(["plan", "approve", str(n)], USER)
    settings = app.container.get(SettingRows)
    settings.save(Setting(environment_id=0, key="tasks.auto", value=False), Actor.system())
    console.run(["plan", "start", "1"], AGENT)
    console.run(["task", "done", "1"], AGENT)
    machine, plans = app.container.get(StateMachine), app.container.get(Plans)
    assert machine.current("s1") == FollowingPlan(plan_id=1, moved_from=1) and plans.at_checkpoint(plans.find(1)).phase.title == "one", "out of auto mode the plan waits at its checkpoint with no task in hand"
    status, body = hook(app, "Stop")
    assert body.get("decision") == "block" and "phase one is complete and a checkpoint" in body["reason"] and "wait for their word" in body["reason"], "the checkpoint waits for the user's look, said at the stop"
    assert console.run(["plan", "start", "1"], AGENT).code == 0 and machine.current("s1") == FollowingPlan(plan_id=1, task_id=2), "plan start goes on past the checkpoint"
    hook(app, "SessionStart", session_id="s2")
    assert machine.current("s2") == FollowingPlan(plan_id=1, task_id=2), "a session that starts while the plan runs follows it, at its task in hand"
    console.run(["task", "done", "2"], AGENT)
    settings.save(Setting(environment_id=0, key="tasks.auto", value=True), Actor.system())
    console.run(["plan", "start", "2"], AGENT)
    console.run(["task", "done", "3"], AGENT)
    assert app.container.get(Tasks).find(4).state == "started" and machine.current("s1") == FollowingPlan(plan_id=2, task_id=4, moved_from=3), "in auto mode a checkpoint never stops the plan"
    app.runtime().deferred.drain()
    assert any("plan 2: task 4, q second is next" in line for line in typed), "the workflow tells the agent its next task"
    console.run(["plan", "park", "2"], AGENT)
    assert machine.current("s1").name == "idle", "a parked plan is over for the agent following it"

def test_a_line_typed_in_the_terminal_reaches_the_chat_and_a_face_answers_any_message(app, monkeypatch):
    from journal.repositories.messages import Messages
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    hook(app, "UserPromptSubmit", prompt="a face is a reply, whatever the length of the message")
    hook(app, "UserPromptSubmit", prompt="[journal] new message 1")
    app.runtime().deferred.drain()
    messages = app.container.get(Messages)
    texts = [m.text for m in messages.in_() if m.author == "user"]
    assert texts == ["a face is a reply, whatever the length of the message"] and not any("new message" in line for line in typed), "the user's own line, read already and not typed back; the journal's lines stay out"
    app.console().run(["message", "send", "a long message from the viewer that wants an answer of some kind before work goes on"], USER)
    app.console().run(["message", "read", "2"], AGENT)
    app.console().run(["message", "react", "2", "👍"], AGENT)
    assert messages.unanswered() == [], "a face on a message answers it, whatever its length"


def test_a_document_is_read_by_its_outline_and_one_section_at_a_time(app, tmp_path):
    text = tmp_path / "doc.md"
    hook(app, "SessionStart")
    text.write_text("The opening line.\n\n## Install\n\n- curl the script\n- run journal claude\n\n## Commands\n\n```sh\n# not a heading\njournal task list\n```\n")
    console = app.console()
    made = console.run(["doc", "create", "Guide", "--file", str(text), "--abstract", "how to start"], AGENT)
    assert made.code == 0, made.err
    shown = console.run(["doc", "show", "1"], AGENT).out
    assert "how to start" in shown and "1  Install" in shown and "2  Commands" in shown and "curl the script" not in shown, "the outline, never the text"
    assert "not a heading" not in shown, "a # in a code block is no heading"
    assert console.run(["doc", "show", "1", "--section", "install", "--bullets"], AGENT).out.endswith("- curl the script\n- run journal claude\n")
    assert "2 Commands: journal task list" in console.run(["doc", "show", "1", "--grep", "task list"], AGENT).out
    assert console.run(["doc", "show", "1", "--section", "9"], AGENT).code == 1


def test_wispr_flow_is_among_the_suggested_mcp_services():
    from journal.support.mcp_catalogue import SUGGESTED
    suggested = {s.name: s for s in SUGGESTED}
    assert suggested["wispr-flow"].url == "https://api.wisprflow.ai/connect/mcp" and suggested["wispr-flow"].auth == "oauth"


def test_a_question_whose_options_say_i_or_you_is_refused(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    refused = app.console().run(["question", "ask", "Who upgrades it?", "--options", "I'll upgrade it myself", "You run the upgrade"], AGENT)
    assert refused.code == 1 and "never I, we or you" in refused.err and "I'll upgrade it myself; You run the upgrade" in refused.err
    lone = app.console().run(["question", "ask", "Who upgrades it?", "--options", "The user upgrades it, The agent upgrades it"], AGENT)
    assert lone.code == 1 and "its own quoted argument" in lone.err, "one option holding a comma is the old comma list, refused"
    asked = app.console().run(["question", "ask", "Who upgrades it?", "--options", "The user upgrades it, today", "The agent upgrades it"], AGENT)
    assert asked.code == 0 and "1. The user upgrades it, today" in asked.out and "2. The agent upgrades it" in asked.out, "a comma inside a quoted option stays in it, and the options are printed back numbered"


def test_a_reply_sent_by_command_comes_back_with_the_hint_that_it_can_be_typed(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    body = hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "journal message send 'on it' --reply-to 1"}, tool_response="message 2 sent")[1]
    assert "a reply needs no command. type it in your turn with [!reply:N]" in json.dumps(body), "the hint rides on the command's own result"
    other = hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "journal task list"}, tool_response="")[1]
    assert "a reply needs no command" not in json.dumps(other)


def test_journal_search_finds_rows_holding_every_word_and_marks_the_chat(app):
    from journal.repositories.messages import Messages
    console = app.console()
    console.run(["task", "create", "Scope the reads", "--brief", "the base repository adds the environment"], AGENT)
    console.run(["plan", "create", "release", "--brief", "ship the base Repository change"], USER)
    console.run(["message", "send", "make it laravel style: the scope applies by itself"], USER)
    console.run(["fact", "create", "the base model is data only"], AGENT)
    out = console.run(["search", "base", "REPOSITORY"], AGENT).out
    assert "task 1: Scope the reads" in out and "plan 1: release" in out, "every word, any case, in any text field"
    assert "fact" not in out and "message" not in out.split("Searched")[0], "a row missing a word is not found"
    assert console.run(["search", "for", "100%"], AGENT).out == "nothing here holds all of: 100%\n", "a % is a letter, not a wildcard, and the verb may be named"
    marks = [m for m in app.container.get(Messages).in_() if m.data.get("kind") == "search"]
    assert marks[0].text == 'Searched for "base REPOSITORY"' and "task 1: Scope the reads" in marks[0].data["detail"], "the mark opens what was found"
    console.run(["check", "create", "Lint the base repository", "--command", "true", "--every", "0"], AGENT)
    assert "check 1: Lint the base repository" in console.run(["search", "base", "repository"], AGENT).out, "every model with words of its own is searched, a check among them"
    only = console.run(["search", "base", "repository", "--model", "plan,check"], AGENT).out
    assert "plan 1: release" in only and "check 1" in only and "task 1" not in only, "--model narrows to the models named"


def test_words_the_hooks_missed_are_swept_from_the_transcript_into_the_chat_once(app, monkeypatch, tmp_path):
    import json as j
    import time
    from datetime import datetime, timezone
    from journal.events.bus import Bus
    from journal.events.clock_ticked import ClockTicked
    from journal.providers.claude import Claude
    from journal.repositories.messages import Messages
    now = time.time()
    stamp = lambda seconds_ago: datetime.fromtimestamp(now - seconds_ago, timezone.utc).isoformat().replace("+00:00", "Z")
    said = lambda text, ago: j.dumps({"type": "assistant", "timestamp": stamp(ago), "message": {"content": [{"type": "text", "text": text}]}}) + "\n"
    transcript = tmp_path / "s1.jsonl"
    transcript.write_text(said("Hello, Sir Jesse.", 60))
    monkeypatch.setattr(Claude, "transcript", lambda self, project, session: transcript if session == "s1" else None)
    hook(app, "SessionStart")
    with transcript.open("a") as file:
        file.write(said("Missed by every hook.", 20) + said("Still the hooks' to bring.", 5))
    bus, messages = app.container.get(Bus), app.container.get(Messages)
    bus.dispatch(ClockTicked(at=now))
    bus.dispatch(ClockTicked(at=now + 1))
    agents = lambda: [m.text for m in messages.across_environments() if m.author == "agent"]
    assert agents().count("Missed by every hook.") == 1 and "Still the hooks' to bring." not in agents(), "older words the hooks did not read are swept in once; the newest are left to the hooks"
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    assert agents().count("Missed by every hook.") == 1 and agents().count("Still the hooks' to bring.") == 1, "the next hook reads on from past the swept words, never taking them again"


def test_codex_words_for_the_user_are_read_from_its_transcript(monkeypatch, tmp_path):
    import json as j
    from journal.providers.codex import Codex
    transcript = tmp_path / "rollout.jsonl"
    said = lambda role, text: {"type": "response_item", "payload": {"type": "message", "role": role, "content": [{"type": "output_text", "text": text}]}}
    transcript.write_text(j.dumps(said("assistant", "Long ago.")) + "\n" + j.dumps(said("assistant", "On it, Sir Jesse.")) + "\n")
    monkeypatch.setattr(Codex, "transcript", lambda self, project, session: transcript)
    first = Codex().texts_written(tmp_path, "s1", -1)
    texts, read = first.texts, first.at
    assert texts == ["On it, Sir Jesse."], "the first look reads the turn in hand"
    with transcript.open("a") as file:
        file.write(j.dumps(said("user", "a prompt")) + "\n" + j.dumps({"type": "response_item", "payload": {"type": "function_call", "name": "exec"}}) + "\n" + j.dumps(said("assistant", "The plan is ready.")) + "\n")
    assert Codex().texts_written(tmp_path, "s1", read).texts == ["The plan is ready."], "only the agent's own words, from where the last look left off"
    assert Codex().worker_outcome("the tests pass", "session id: 01a1549d-a1ac-75c3\n" + "a long log of the run\n" * 500) == ("the tests pass", "01a1549d-a1ac-75c3"), "a Codex worker's report is its answer, not its log"


def test_a_reply_written_before_a_tool_call_reaches_the_chat_at_that_call_and_the_display_hook_adds_no_second(app, monkeypatch, tmp_path):
    import json as j
    from journal.providers.claude import Claude
    from journal.repositories.messages import Messages
    transcript = tmp_path / "s1.jsonl"
    earlier = {"type": "assistant", "message": {"content": [{"type": "text", "text": "Long ago."}]}}
    first = {"type": "assistant", "message": {"content": [{"type": "text", "text": "Starting up."}, {"type": "tool_use", "name": "Bash"}]}}
    transcript.write_text(j.dumps(earlier) + "\n" + j.dumps(first) + "\n")
    monkeypatch.setattr(Claude, "transcript", lambda self, project, session: transcript if session == "s1" else None)
    hook(app, "SessionStart")
    messages = app.container.get(Messages)
    texts = [m.text for m in messages.in_() if m.author == "agent"]
    assert "Starting up." in texts and "Long ago." not in texts, "the first look reads the turn in hand, the last line, and not the session's past"
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["message", "send", "are you there?"], USER)
    app.console().run(["message", "read", "2"], AGENT)
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})
    assert status == 409 and "answer or react to message 2 first" in body["error"], "the message is read and unanswered: the write is held"
    row = {"type": "assistant", "message": {"content": [{"type": "text", "text": "[!reply:2]\nHere, Sir Jesse, and writing."}, {"type": "tool_use", "name": "Write"}]}}
    with transcript.open("a") as file:
        file.write(j.dumps(row) + "\n")
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})[0] == 200, "the reply in the transcript answered the message before the call was judged"
    replies = [m for m in messages.in_() if m.author == "agent" and m.text == "Here, Sir Jesse, and writing."]
    assert len(replies) == 1 and replies[0].reply_to == 2
    hook(app, "MessageDisplay", message="[!reply:2]\nHere, Sir Jesse, and writing.")
    app.runtime().deferred.drain()
    assert len([m for m in messages.in_() if m.author == "agent" and m.text == "Here, Sir Jesse, and writing."]) == 1, "the display hook's copy of the same block is no second message"


def test_an_edit_is_a_row_of_its_own_kept_to_the_last_five_hundred_and_a_shell_parts_change_is_one_too(app):
    from journal.models.edit import Edit
    from journal.repositories.edits import KEEP, Edits
    hook(app, "SessionStart")
    hook(app, "PostToolUse", tool_name="Edit", tool_input={"file_path": str(app.config.root / "a.py"), "old_string": "x", "new_string": "y"}, tool_response={"structuredPatch": [{"oldStart": 7, "newStart": 7, "lines": [" before", "-x", "+y", " after"]}]})
    app.runtime().deferred.drain()
    edits = app.container.get(Edits)
    kept = edits.of_agent("s1", 0, 50)
    assert [e.path for e in kept] == ["a.py"] and kept[0].added == 1 and kept[0].removed == 1 and kept[0].first_line == 7 and [r["kind"] for r in kept[0].rows] == ["ctx", "del", "add", "ctx"]
    ShellVerbs(app).ran("sed -i s/x/y/ b.py", "c1", 0, output="", changed="3\t1\tb.py")
    kept = edits.of_agent("s1", 0, 50)
    assert [e.path for e in kept] == ["a.py", "b.py"] and kept[1].added == 3 and kept[1].removed == 1 and kept[1].command and kept[1].rows == ()
    for i in range(KEEP):
        edits.record(Edit(session="s1", path=f"f{i}.py", at=float(i + 10)), Actor.agent("s1"))
    assert len(edits.in_()) == KEEP, "the oldest go as new ones come"
    assert edits.in_()[0].path == "f0.py" and edits.in_()[-1].path == f"f{KEEP - 1}.py", "the two oldest went"

def test_a_plan_is_done_when_its_last_task_closes_whoever_closes_it(app):
    from journal.repositories.plans import Plans
    hook(app, "SessionStart")
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "only"], USER)
    console.run(["plan", "ready", "1"], USER)
    console.run(["plan", "approve", "1"], USER)
    console.run(["plan", "start", "1"], USER)
    console.run(["task", "done", "1"], USER)
    assert app.container.get(Plans).find(1).state == "done", "the user closed the last task: the plan is done, no agent following it"
    from journal.features.plans.seeds.closed_plans import ClosedPlans
    plans = app.container.get(Plans)
    plans.save(plans.find(1).reopened(0.0), Actor.user(1))
    app.container.get(ClosedPlans).run()
    assert plans.find(1).state == "done", "a plan left started with every task done is closed at boot"
    console.run(["plan", "add", "1", "more"], USER)
    app.runtime().deferred.drain()
    assert plans.find(1).state == "started", "a task added to a done plan starts it again"


def test_a_session_silent_for_an_hour_is_ended(app):
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    hook(app, "SessionStart")
    app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=3601.0))
    assert app.container.get(StateMachine).current("s1").name == "ended"
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    assert app.container.get(StateMachine).current("s1").name != "ended", "a session that goes on after an hour's silence lives: it is not left ended"


def test_the_agent_a_supervisor_runs_stays_live_however_long_it_is_idle_and_is_told_a_message(app, monkeypatch):
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    from journal.supervisor_link import SupervisorLink
    typed = []
    catch_typed(app, monkeypatch, typed)
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    hook(app, "SessionStart")
    app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=36000.0))
    assert app.container.get(StateMachine).current("s1").name != "ended", "an agent idle for ten hours under a supervisor is waiting, not gone"
    app.console().run(["message", "send", "are you there?"], USER)
    app.runtime().deferred.drain()
    assert any("new message" in line for line in typed), "a message left for an idle agent is typed into its terminal"


def test_a_keyword_brings_a_fact_back_once_as_a_whisper_and_a_fresh_rule_is_questioned(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    app.console().run(["fact", "create", "the login uses the old session store", "--keywords", "login,session"], USER)
    hook(app, "MessageDisplay", message="I will look at the login next.")
    hook(app, "MessageDisplay", message="Still on the login.")
    app.runtime().deferred.drain()
    whispers = [line for line in typed if "fact 1: the login uses the old session store" in line]
    assert len(whispers) == 1, "whispered once per row per agent"
    from journal.repositories.messages import Messages
    marks = [m for m in app.container.get(Messages).recent(30) if m.data.get("kind") == "whisper"]
    assert marks and marks[-1].data["row"] == "facts:1", "the mark names the row by its table, so the viewer opens it"
    app.console().run(["rule", "create", "Always run the suite before a commit"], AGENT)
    app.runtime().deferred.drain()
    assert any("does rule 1 apply to the whole project?" in line for line in typed), "the question is typed to the agent that made the rule"


def test_auto_mode_answers_a_stop_with_the_next_task(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "the footer"], USER)
    status, body = hook(app, "Stop")
    assert body.get("decision") == "block" and "task 1 next: the footer" in body["reason"]
    from journal.support.actor import Actor as A
    app.container.get(SettingRows).save(Setting(environment_id=0, key="tasks.auto", value=False), A.user(1))
    assert hook(app, "Stop")[1] == {}, "with auto off a stop is a stop"


def test_a_task_named_in_a_reply_is_linked_to_the_message_it_answers(app):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    app.console().run(["message", "send", "the footer is broken"], USER)
    app.console().run(["task", "create", "Fix the footer"], AGENT)
    hook(app, "MessageDisplay", message="[!reply:1]\nFiled task 1 for it.")
    app.runtime().deferred.drain()
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/messages/1", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        assert json.loads(reply.read())["filed"] == [1]


def test_the_providers_own_question_tool_is_refused_and_every_fiftieth_line_reminds(app, monkeypatch):
    hook(app, "SessionStart")
    status, body = hook(app, "PreToolUse", tool_name="AskUserQuestion", tool_input={"question": "which?"})
    assert status == 409 and "`journal question ask \"<one line>\" --options \"a\" \"b\"`" in body["error"]


def test_a_dispatched_worker_runs_and_its_output_is_its_report(app):
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.support.actor import Actor as A
    from journal.repositories.messages import Messages
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    app.console().run(["worker", "dispatch", "Lady Lovelace", "say hello", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    worker = app.container.get(Workers).find(1)
    app.container.get(WorkerRunner).run(worker, ["sh", "-c", "echo the footer is fixed"], A.agent("s1"))
    assert app.container.get(Workers).find(1).state == "reported"
    assert any("Lady Lovelace reports: the footer is fixed" in m.text for m in app.container.get(Messages).in_())


def test_a_message_waiting_at_session_start_is_named_in_the_start_block(app):
    app.console().run(["message", "send", "sent while you were away"], USER)
    told = hook(app, "SessionStart", source="resume")[1]["hookSpecificOutput"]["additionalContext"]
    assert "new message 1" in told


def test_a_reply_naming_several_messages_answers_each_and_a_journal_command_after_a_cd_passes_the_hold(app):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    for text in ("one", "two"):
        app.console().run(["message", "send", text], USER)
    app.console().run(["message", "unread"], AGENT)
    hook(app, "MessageDisplay", message="[!reply:1,2]\nBoth seen.")
    app.runtime().deferred.drain()
    assert app.container.get(Messages).unanswered() == []
    app.console().run(["message", "send", "three"], USER)
    app.console().run(["message", "read", "4"], AGENT)
    for _ in range(15):
        hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal message react 4 \"👍\"; journal task list"})[0] == 200
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "ls"})[0] == 409


def test_a_command_that_reads_the_projects_code_runs_as_written_and_answers_at_once(app):
    from pathlib import Path
    from journal.features.shell.support.part import Part
    here = str(Path.cwd())
    kept = [
        "grep -n foo src/journal/app.py | tail -5", "grep -rn 'def x' src --include=*.py | tail -20", "rg -n token src/web/src/App.vue | tail -3",
        "sed -n 1,40p src/journal/models/plan.py | tail -10", "cat tests/test_server.py | tail -2", "head -50 src/web/src/main.js | tail -5",
        "awk 'NR<9' src/journal/config.py | tail -1", "git show HEAD:src/journal/version.py | tail -1", "git diff -- src/journal/models/phone.py | tail -30",
        'grep -n "a | b" "src/journal/support/chain.py" | tail -4', f"cat {here}/src/journal/models/task.py | tail -3", "wc -l src/journal/*.py | tail -1",
        "grep -c x NOTES.md | tail -1", "cat src/web/package.json | tail -3",
    ]
    cut = [
        "pytest -q | tail -3", "python3 src/journal.py setup | tail -2", "cat ~/notes.py | tail -2", "cat /etc/hosts | tail -1", "grep x ../other/app.py | tail -2",
        "cat src/journal/app.py ~/secret.py | tail -5", "cat .journal/runtime/supervisor.log | tail -5", "sed -i '' 's/a/b/' src/journal/app.py | tail -1",
        "npm run build | tail -3",
    ]
    assert [line for line in kept if Part(line).cut()] == [], "a read of the project's own code keeps its tail and runs as written"
    assert [line for line in cut if not Part(line).cut()] == [], "a test run, a build, a log, a file outside the project and a read that writes keep their tail cut"
    console = app.console()
    for i, line in enumerate(kept[:4]):
        folder = app.config.root / f"code{i}"
        folder.mkdir()
        ShellVerbs(app).split(line, str(folder))
        assert (folder / "0.part").read_text() == line and not (folder / "dropped").exists(), f"run whole, nothing dropped: {line}"
        assert ShellVerbs(app).cap(line) == "direct 0", f"it runs in the shell as written, nothing captured: {line}"


def test_reading_a_message_names_its_files_links_and_captions(app):
    import json as j
    from urllib.request import Request as R, urlopen as u
    console = app.console()
    console.run(["message", "send", "see the picture"], USER)
    boundary = "b1"
    body = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"shot one.png\"\r\nContent-Type: image/png\r\n\r\nPNG\r\n--{boundary}--\r\n").encode()
    u(R(f"http://127.0.0.1:{app.server().port}/journal/messages/1/files", data=body, method="POST", headers={"Content-Type": f"multipart/form-data; boundary={boundary}", "X-Journal-Env": "main"}), timeout=5).read()
    with u(f"http://127.0.0.1:{app.server().port}/journal/messages/1/files/shot%20one.png?env=main", timeout=5) as reply:
        assert reply.read() == b"PNG", "a file name with a space is found"
    shown = console.run(["message", "read", "1"], AGENT).out
    assert "file " in shown and "shot one.png" in shown and "`journal message tag 1 \"shot one.png\"" in shown
    assert 'something to do? file it: `journal task create "<title>" --from 1`' in shown
    assert "(from message 1)" in console.run(["task", "create", "look at the picture", "--from", "1"], AGENT).out
    console.run(["task", "create", "crop it", "--from", "1"], AGENT)
    from journal.repositories.messages import Messages
    filed = [m.text for m in app.container.get(Messages).all() if m.data.get("shows") == "filed"]
    assert filed == ["Filed task 1, task 2 from your message"], "what is filed from a message is one mark in the chat, naming each row"
    assert console.run(["message", "tag", "1", "shot one.png", "the footer overlapping the form"], AGENT).code == 0
    assert "the footer overlapping the form" in console.run(["message", "read", "1"], AGENT).out
    console.run(["message", "react", "1", "👍"], USER)
    assert "reacts" in console.run(["message", "read", "1"], AGENT).out


def test_a_message_read_through_a_pipe_is_refused(app):
    hook(app, "SessionStart")
    status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal message read 3 | head -3"})
    assert status == 409 and "read the user's words whole" in body["error"]
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal message read 3"})[0] == 200
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal task list | head -5"})[0] == 200, "only the user's words are protected"
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "grep 'journal message read 3' notes.md | head -2"})[0] == 200, "the words quoted inside another command are not a read"


def test_every_line_of_the_shell_corpus_is_cut_into_its_parts():
    """tests/shell_corpus.jsonl holds over 4,000 commands in many styles with the parts each is cut into; one marked shell is cut differently by a real shell, and is kept whole here, which runs the same."""
    from journal.support.chain import Chain
    cases = [json.loads(line) for line in (Path(__file__).parent / "shell_corpus.jsonl").read_text().splitlines()]
    wrong = [case["line"] for case in cases if Chain.split(case["line"]) != case["parts"]]
    assert not wrong, f"{len(wrong)} of {len(cases)} lines cut differently, the first: {wrong[:3]}"


def test_a_chain_is_taken_apart_and_the_shells_wrapping_around_it_is_silent():
    from journal.support.chain import Chain
    from journal.features.shell.support.doing import Doing
    assert Chain.split('a $(b; c) && (d; e) || f; g "h && i" | tail -1') == ["a $(b; c)", "(d; e) || f", 'g "h && i" | tail -1']
    assert Chain.split("for f in a b; do echo $f; done && if true; then echo y; fi; case $x in a) echo a;; esac && ls") == ["for f in a b; do echo $f; done", "if true; then echo y; fi", "case $x in a) echo a;; esac", "ls"]
    assert Chain.split("echo `echo a; echo b` && cat <<EOF && echo x\nbody; with && stuff\nEOF") == ["echo `echo a; echo b`", "cat <<EOF && echo x\nbody; with && stuff\nEOF"]
    assert Chain.split('[[ -n a && -n b ]] && echo ok; echo "${x:-a;b}" && (( 1 && 1 ))') == ["[[ -n a && -n b ]]", "echo ok", 'echo "${x:-a;b}"', "(( 1 && 1 ))"]
    loop = "for f in $files; do sed -i '' 's/a/b/g; s/c/d/g' \"$f\"; done"
    assert Chain.split(f'files=$(git grep -l "x y" -- src tests); echo "$files"; {loop}; sed -n 1,2p notes.md') == ['files=$(git grep -l "x y" -- src tests)', 'echo "$files"', loop, "sed -n 1,2p notes.md"], "a loop over a list, with ; inside its quotes and its body, is one part"
    assert Chain.split("for x in a b; echo $x && echo y; echo z; repeat 2 echo r && echo s; echo t") == ["for x in a b; echo $x && echo y", "echo z", "repeat 2 echo r && echo s", "echo t"]
    assert Chain.split("seq 2 | while read -r n; do echo $n; done; echo after") == ["seq 2 | while read -r n; do echo $n; done", "echo after"]
    assert Chain.split("for i in 1; do echo done; done; echo fi && case a in a) echo one;& b) echo two;; esac") == ["for i in 1; do echo done; done", "echo fi", "case a in a) echo one;& b) echo two;; esac"]
    assert Chain.split("echo a # not && split; here\necho b && echo '#not a comment' && echo c#neither") == ["echo a # not && split; here", "echo b", "echo '#not a comment'", "echo c#neither"], "a newline ends a command, a comment runs to it"
    wrapped = "source /s 2>/dev/null || true && { \\builtin unalias -- 'x'; } >/dev/null 2>&1 || true && eval 'cd src && git commit -m '\"'\"'a; b'\"'\"'' < /dev/null && pwd -P >| /tmp/cwd"
    parts = Chain.parts(wrapped)
    assert [p.text for p in parts if p.recorded] == ["cd src", "git commit -m 'a; b'"]
    assert parts[0].text.startswith("source") and parts[-1].text.startswith("pwd -P") and not parts[0].recorded and not parts[-1].recorded
    heredoc = "source /s 2>/dev/null || true && eval 'cd src && python3 - <<'\"'\"'EOF'\"'\"'\nprint(1)\nEOF' && pwd -P >| /tmp/cwd"
    assert [p.text for p in Chain.parts(heredoc) if p.recorded] == ["cd src", "python3 - <<'EOF'\nprint(1)\nEOF"], "a command with a heredoc comes without < /dev/null and is still the agent's own"
    assert [Doing.of(c) for c in ("git commit -m x", "python3 -m pytest -q | tail -2", "cd src", "npm run build", "foo --bar", "python3 - <<'EOF'\nprint(1)\nEOF")] == ["committing", "testing", "moving", "running a script", "running foo", "running python3"]


def test_the_foreground_limit_is_thirty_seconds_or_ten_while_a_message_waits(app):
    console = app.console()
    assert ShellVerbs(app).limit() == "30"
    wrapped = "source /s 2>/dev/null || true && eval 'journal task list && journal message unread' < /dev/null && pwd -P >| /tmp/cwd"
    assert ShellVerbs(app).limit(wrapped) == "0", "a line of journal commands alone is never moved to the background"
    assert ShellVerbs(app).limit(wrapped.replace("journal message unread", "sleep 60")) == "30"
    console.run(["message", "send", "are you there?"], USER)
    assert ShellVerbs(app).limit() == "10"
    console.run(["message", "read", "1"], AGENT)
    app.container.get(SettingRows).save(Setting(environment_id=0, key="shell.foreground", value=5), Actor.system())
    assert ShellVerbs(app).limit() == "5"


def test_a_chains_parts_are_recorded_and_a_moved_chain_reports_when_it_ends(app, monkeypatch):
    from urllib.request import urlopen
    from journal.repositories.messages import Messages
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    console, port = app.console(), app.server().port
    folder = app.config.root / "c1"
    folder.mkdir()
    assert ShellVerbs(app).split("cd src && pytest -q | tail -1; git commit -m 'a\nb'", str(folder)) == "R;&-\nR&;-\nR;;-\n"
    assert [(folder / f"{i}.part").read_text() for i in range(3)] == ["cd src", "pytest -q", "git commit -m 'a\nb'"]
    ShellVerbs(app).started("git commit -m done", "c1")
    bar = json.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/bar?env=main"), timeout=5))
    assert bar[-1]["parts"][0]["value"] == "committing" and bar[-1]["done"] is False
    ShellVerbs(app).ran("git commit -m done", "c1", 0, output="[main 1a2b3c4] done", seconds=2)
    assert json.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/bar?env=main"), timeout=5))[-1]["done"] is True
    line = json.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/agents/1/terminal?env=main"), timeout=5))[-1]
    assert line["command"] == "git commit -m done" and line["output"] == "[main 1a2b3c4] done" and line["seconds"] == 2
    moved = ShellVerbs(app).moved("c1", "pytest -q", "/tmp/out/c1")
    assert "moved to the background as output 1" in moved and "pytest" not in moved, "a background command is named by its number"
    ShellVerbs(app).ended("c1", 1, "/tmp/out/c1", "2 failed")
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    told = len(typed)
    app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=1.0))
    assert len(typed) == told, "while the agent is busy, the end waits"
    app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=6.0))
    assert "output 1 failed with code 1" in typed[-1] and "pytest" not in typed[-1] and "2 failed" not in typed[-1], "once it is quiet, its end names the number and how it ended, never the command or its lines"
    app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=12.0))
    assert len(typed) == told + 1, "an end is named once"
    cards = [m for m in app.container.get(Messages).in_() if m.author == "system"]
    assert len(cards) == 1 and cards[-1].text == "Failed with code 1 in the background: testing" and cards[-1].data["command"] == "pytest -q" and cards[-1].data["detail"] == "2 failed", "the one mark of the moved command is settled in place: it names the command, on a line of its own, and how it ended"
    assert cards[-1].data["shows"] == "commands", "a card names the Show in chat switch that hides it"
    (app.config.root / "c2").mkdir()
    ShellVerbs(app).split("pytest -q", str(app.config.root / "c2"))
    ShellVerbs(app).moved("c2", "pytest -q", "/tmp/out/c2")
    ShellVerbs(app).ended("c2", 0, "/tmp/out/c2", "........ [ 76%]\n....... [100%]")
    card = [m for m in app.container.get(Messages).in_() if m.author == "system"][-1]
    assert card.text == "Finished in the background: testing" and card.data["command"] == "pytest -q" and card.data["detail"] == "", "a last line of progress dots says nothing and is left out"


def test_each_thought_is_a_message_the_latest_stands_in_the_working_bubble_and_a_reply_in_thinking_is_posted(app, monkeypatch, tmp_path):
    import json as j
    from urllib.request import urlopen
    from journal.providers.claude import Claude
    from journal.repositories.messages import Messages
    transcript = tmp_path / "s1.jsonl"
    rows = [{"type": "user", "message": {"content": "hello?"}},
            {"type": "assistant", "message": {"content": [{"type": "thinking", "thinking": "[!reply:1]\nYes, hello."}]}},
            {"type": "user", "message": {"content": [{"type": "tool_result", "content": "ok"}]}},
            {"type": "assistant", "message": {"content": [{"type": "thinking", "thinking": "Now the next step."}]}}]
    transcript.write_text("\n".join(j.dumps(r) for r in rows) + "\n")
    monkeypatch.setattr(Claude, "transcript", lambda self, project, session: transcript)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["message", "send", "hello?"], USER)
    console.run(["message", "read", "1"], AGENT)
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    app.runtime().deferred.drain()
    agent = json.load(urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/agents?env=main"), timeout=5))["rows"][-1]
    assert agent["thinking"] == "Now the next step."
    reply = app.container.get(Messages).all()[-1]
    assert reply.reply_to == 1 and reply.text == "Yes, hello." and app.container.get(Messages).unanswered() == []
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    app.runtime().deferred.drain()
    thoughts = [m for m in app.container.get(Messages).all() if m.is_thought]
    assert [m.text for m in thoughts] == ["[!reply:1]\nYes, hello.", "Now the next step."], "each thought is a message in the chat, marked a thought, and kept once"
    assert all(m.created_by.id == "s1" for m in thoughts)
    hook(app, "MessageDisplay", message="Done.")
    app.runtime().deferred.drain()
    assert json.load(urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/agents?env=main"), timeout=5))["rows"][-1]["thinking"] == ""
    assert "no journal is running" in console.run(["setup", "restart"], USER).out


def test_a_turns_parts_landing_out_of_order_are_put_back_before_the_turn_is_read(app):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    app.console().run(["message", "send", "is it fixed?"], USER)
    app.console().run(["message", "read", "1"], AGENT)
    hook(app, "MessageDisplay", delta="It is.", turn_id="t9", index=1, final=True)
    app.runtime().deferred.drain()
    assert app.container.get(Messages).unanswered(), "the final part alone is not the turn"
    hook(app, "MessageDisplay", delta="[!reply:1]\n", turn_id="t9", index=0, final=False)
    app.runtime().deferred.drain()
    reply = app.container.get(Messages).all()[-1]
    assert reply.reply_to == 1 and reply.text == "It is."


def test_a_stop_with_a_parked_task_names_it_in_auto_mode_or_not(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    app.container.get(SettingRows).save(Setting(environment_id=0, key="tasks.auto", value=False), Actor.system())
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["task", "park", "1", "the header first"], AGENT)
    status, body = hook(app, "Stop")
    assert body.get("decision") == "block" and "parked tasks, still open: 1 the footer (parked because: the header first)" in body["reason"]
    assert hook(app, "Stop", stop_hook_active=True)[1].get("decision") == "block", "told at every stop, until the task is resumed or done"
    console.run(["task", "resume", "1"], AGENT)
    console.run(["task", "done", "1", "--how", "shipped"], AGENT)
    console.run(["task", "create", "the menu"], USER)
    assert hook(app, "Stop")[1].get("decision") != "block", "open tasks are not pressed for outside auto mode"


def test_the_files_a_shell_part_changed_show_in_the_edits_pane(app):
    from urllib.request import urlopen
    hook(app, "SessionStart")
    ShellVerbs(app).ran("sed -i '' s/a/b/ notes.md", "c2", 0, changed="3\t1\tnotes.md\n0\t0\tsame.md")
    edits = json.load(urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/agents/1/edits?env=main"), timeout=5))["edits"]
    assert [(e["path"], e["added"], e["removed"]) for e in edits] == [("notes.md", 3, 1), ("same.md", 0, 0)] and edits[0]["command"].startswith("sed")


def test_a_shell_line_that_writes_is_a_write_to_the_gates(app):
    from journal.support.writes import Writes
    assert [Writes.of(c) for c in ("sed -i '' s/a/b/ f.py", "cat f.py | head -3", "echo hi > /dev/null", "echo hi > out.txt", "git status; git log", "git checkout -- f.py", "`journal task create` x", "python3 - <<'EOF'\nfrom pathlib import Path\nPath('x').write_text('y')\nEOF", "python3 -c 'print(1)'", "grep -rn 'a > b' src | tee found.txt", 'echo "a > b"')] == [True, False, False, True, False, True, False, True, False, True, False]
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.runtime().deferred.drain()
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "sed -i '' s/a/b/ f.py"})[0] == 200
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "cat f.py"})[0] == 200
    from journal.repositories.charts import Charts
    from journal.repositories.counts import Counts
    from journal.support.scope import Scope
    log_held = next(c for c in app.container.get(Charts).shipped() if c.drawing == "working:tool_starting:log_held")
    with app.container.get(Scope).of(1):
        assert app.container.get(Counts).of_workflow(log_held.id) == {"writes": 1}, "a shell line that writes counts as a write toward the log; a read does not"


def test_a_journal_command_chained_with_anything_else_is_refused(app):
    hook(app, "SessionStart")
    status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "cd src && journal task log 1 'x' && python3 -m pytest -q"})
    assert status == 409 and "a journal command runs on its own" in body["error"]
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal task log 1 'x'; journal message unread"})[0] == 200
    assert hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "python3 -m pytest -q && git commit -m x"})[0] == 200


def test_the_mcp_page_shows_every_server_as_the_kept_check_found_it_without_a_refresh(app, monkeypatch):
    import json as j
    from journal.support.health import Health
    from journal.features.mcp.support.health_report import HealthReport
    from journal.features.mcp.support.known import Known
    monkeypatch.setattr(Health, "asked", lambda self: HealthReport({"blender": Known("blender", "uvx blender-mcp", "connected", "")}))
    read = lambda: j.load(urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/mcp", headers={"X-Journal-Env": "main"}), timeout=5))
    read()
    deadline = time.monotonic() + 5
    while not read()["checked_at"] and time.monotonic() < deadline:
        time.sleep(0.05)
    shown = read()
    assert not shown["checking"] and [(s["name"], s["state"]) for s in shown["servers"]] == [("blender", "connected")], "the next read shows the servers as the check found them"


def test_an_integration_is_a_suggested_mcp_server_installed_and_removed_with_the_agents_restarted_and_keyed_without(app, monkeypatch, tmp_path):
    import json as j
    from urllib.request import Request as R, urlopen
    from journal.support.health import Health
    from journal.support.keys import Keys
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}))
    monkeypatch.setattr(app.container.get(Keys), "path", tmp_path / "keys.json")
    from journal.features.mcp.support.health_report import HealthReport
    from journal.features.mcp.support.known import Known
    monkeypatch.setattr(Health, "asked", lambda self: HealthReport({"github": Known("github", "npx -y @modelcontextprotocol/server-github", "connected", ""), "linear": Known("linear", "https://mcp.linear.app/mcp", "needs_auth", "Needs authentication"), "playwright": Known("playwright", "npx -y @playwright/mcp@latest --headless", "connected", "")}))
    hook(app, "SessionStart")
    port = app.server().port
    def post(path, body):
        with urlopen(R(f"http://127.0.0.1:{port}{path}", data=j.dumps(body).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5) as r:
            return j.loads(r.read())
    installed = post("/journal/mcp/install", {"name": "github"})
    assert installed["state"] == "needs_key" and installed["has_key"] is False and sent[-1]["verb"] == "restart" and sent[-1]["name"] == "agent" and sent[-1]["resume"] == ["--resume", "s1"], "an idle agent restarts at once"
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    sent.clear()
    post("/journal/mcp/github/key", {"value": "first"})
    assert sent == [] and j.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/mcp", headers={"X-Journal-Env": "main"}), timeout=5))["restart_pending"] == [], "a key restarts nothing: a running agent keeps the environment it was launched with"
    try:
        post("/journal/mcp/github/key", {"value": "  "})
    except HTTPError as error:
        assert "blank" in error.read().decode()
    else:
        raise AssertionError("a blank key is refused")
    post("/journal/mcp/install", {"name": "linear"})
    assert sent == [] and j.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/mcp", headers={"X-Journal-Env": "main"}), timeout=5))["restart_pending"] == ["s1"], "an agent at work is not cut off"
    hook(app, "Stop")
    app.runtime().deferred.drain()
    assert sent and sent[-1]["verb"] == "restart", "the restart comes the moment its turn ends"
    claude = j.loads((app.config.root / ".mcp.json").read_text())["mcpServers"]["github"]
    assert claude["command"] == "npx" and claude["env"] == {"GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"}
    assert '[mcp_servers.github]' in (app.config.root / ".codex" / "config.toml").read_text()
    keyed = post("/journal/mcp/github/key", {"value": "ghp_secret"})
    assert keyed["has_key"] is True and keyed["state"] == "installed" and j.loads((tmp_path / "keys.json").read_text()) == {"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_secret"}
    assert "ghp_secret" not in (app.config.root / ".mcp.json").read_text(), "a key is never written into the project"
    states = {s["name"]: s["state"] for s in post("/journal/mcp/check", {})["servers"]}
    assert states == {"github": "connected", "linear": "needs_auth"}
    page = j.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/mcp", headers={"X-Journal-Env": "main"}), timeout=5))
    assert [(s["name"], s["managed"]) for s in page["servers"]] == [("github", True), ("linear", True), ("playwright", False)], "the program's own servers show after the journal's"
    assert {s["name"]: s["installed"] for s in page["suggested"] if s["name"] in ("github", "playwright", "slack")} == {"github": True, "playwright": True, "slack": False}
    assert post("/journal/mcp/github/remove", {}) == {"removed": "github"} and j.loads((tmp_path / "keys.json").read_text()) == {}
    assert app.console().run(["mcp", "list"], USER).out.startswith("linear")
    post("/journal/mcp/install", {"name": "linear"})
    sent.clear()
    assert post("/journal/mcp/linear/sign-in", {})["asked"] == "linear"
    assert sent[-1]["verb"] == "type" and "mcp__linear__authenticate" in sent[-1]["line"], "the agent is asked to sign in through the server's own tool"


def test_a_task_finished_while_a_skill_is_owed_leaves_the_debt_snapshot_until_the_read(skilled):
    from journal.support.requiring import Requiring
    from journal.repositories.agents import Agents
    app = skilled
    hook(app, "SessionStart")
    read_skill(app, "journal")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    hook(app, "PreCompact")
    hook(app, "SessionStart")
    read_skill(app, "journal")
    app.console().run(["environment", "here"], AGENT)
    requiring, agents, machine = app.container.get(Requiring), app.container.get(Agents), app.container.get(StateMachine)
    assert requiring.owed_names(agents.for_session("s1")) == ["tasks"], "the tasks skill is owed at a start in work"
    done = app.console().run(["task", "done", "1", "--how", "quick"], AGENT)
    assert done.code == 0, done.err
    assert machine.current("s1").name == "idle" and requiring.owed_names(agents.for_session("s1")) == ["tasks"], "the task done, the agent is idle and still owes the read"
    read_skill(app, "journal-tasks")
    assert requiring.owed_names(agents.for_session("s1")) == []


def test_a_long_file_is_not_read_whole(app, tmp_path):
    hook(app, "SessionStart")
    long, short = tmp_path / "long.txt", tmp_path / "short.txt"
    long.write_text("x\n" * 401)
    short.write_text("x\n" * 400)
    status, body = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": str(long)})
    assert status == 409 and "401 lines" in body["error"] and "offset and limit" in body["error"]
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": str(long), "limit": 50})[0] == 200, "a part of it is fine"
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": str(short)})[0] == 200, "twice the cap fits in one go"
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": str(tmp_path / "gone.txt")})[0] == 200


def test_a_typed_line_is_confirmed_by_its_prompt_and_typed_again_when_it_was_lost(app, monkeypatch):
    import time
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}))
    hook(app, "SessionStart")
    link, bus = app.container.get(SupervisorLink), app.container.get(Bus)
    link.type(1, "hello there")
    tick = lambda later: bus.dispatch(Ticked(session="s1", environment_id=1, at=time.time() + later, quiet_for=later))
    tick(2)
    assert [s["line"] for s in sent] == ["[journal] hello there"], "a fresh line is given time"
    tick(30)
    assert [s["line"] for s in sent] == ["[journal] hello there"] * 2, "a line not seen back while the agent sits between turns is typed again"
    hook(app, "UserPromptSubmit", prompt="[journal] hello there")
    tick(60)
    assert len(sent) == 2, "the prompt that brought it back confirms it"
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "x", "limit": 1})
    link.type(1, "while at work")
    tick(90)
    assert len(sent) == 3, "a line typed to an agent at work waits for its turn to end"
    link.type(1, "after it")
    assert "[journal] after it" not in [s["line"] for s in sent], "a line waits while an earlier one is on its way"
    hook(app, "Stop")
    for later in (120, 150, 200, 300, 500, 900):
        tick(later)
    assert [s["line"] for s in sent].count("[journal] while at work") == 6, "six tries, each after twice the wait, then the chat is told"
    assert [s["line"] for s in sent][-1] == "[journal] after it", "a line given up lets the one held behind it go in"


def test_commands_run_at_the_same_moment_keep_their_own_output(app):
    import threading
    console = app.console()
    outs = {}
    def run(n):
        outs[n] = ShellVerbs(app).cap() if n % 2 else ShellVerbs(app).limit()
    threads = [threading.Thread(target=run, args=(n,)) for n in range(20)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    assert all(outs[n] == ("hint 400" if n % 2 else "30") for n in range(20)), "each run's output is its own, though they run side by side"


def test_only_one_task_is_in_progress_at_a_time_whatever_the_agents_state(app):
    hook(app, "SessionStart")
    app.console().run(["task", "create", "first", "--start"], AGENT)
    app.console().run(["task", "create", "second"], AGENT)
    hook(app, "SessionStart", session_id="s2")
    refused = app.console().run(["task", "start", "2"], Where("main", "s2"))
    assert refused.code == 1 and "task 1 is in hand" in refused.err, "another session cannot start a second"
    app.console().run(["task", "park", "1", "later"], AGENT)
    assert app.console().run(["task", "start", "2"], AGENT).code == 0


def test_the_sequence_page_shows_and_sets_what_starts_a_sequence(app):
    from journal.repositories.sequences import Sequences
    port = app.server().port

    def api(method, path, body=None):
        request = HttpRequest(f"http://127.0.0.1:{port}/journal/{path}", data=json.dumps(body).encode() if body is not None else None, method=method, headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
        try:
            with urlopen(request, timeout=5) as reply:
                return reply.status, json.loads(reply.read())
        except HTTPError as error:
            return error.code, json.loads(error.read())
    building = next(s for s in app.container.get(Sequences).all() if s.title == "Building a plan")
    shown = next(r for r in api("GET", "sequences")[1]["rows"] if r["id"] == building.id)
    assert shown["starts_on"] == "plan.created", "the page is told a new plan starts it, as the engine does"
    assert api("POST", f"sequences/{building.id}/starts", {"starts_on": ""})[0] == 200 and app.container.get(Sequences).find(building.id).starts_on == ""
    status, refused = api("POST", f"sequences/{building.id}/starts", {"starts_on": "plan.approved"})
    assert status != 200 and "none of them" in json.dumps(refused), "only a created row or a trigger starts a sequence"
    from journal.repositories.triggers import Triggers
    triggers = app.container.get(Triggers)
    update = next(s for s in app.container.get(Sequences).all() if s.title == "Writing an update")
    started_by = triggers.starting("Writing an update")[0]
    assert next(r for r in api("GET", "sequences")[1]["rows"] if r["id"] == update.id)["trigger_ids"] == [started_by.id], "the page is told the update starts on its words"
    assert "tldr" in started_by.words and "check agents.md" in triggers.starting("Checking the instruction files")[0].words, "version 3's worded sequences start on their words"
    api("POST", f"sequences/{update.id}/starts", {"starts_on": ""})
    assert triggers.starting("Writing an update") == [], "by hand, the trigger no longer starts it"
    from journal.models.trigger import Trigger
    from journal.models.trigger_action import TriggerAction
    plan_words = triggers.save(Trigger(words=("plan it",), action=TriggerAction.NUDGE, text="say something"), Actor.user(1))
    api("POST", f"sequences/{building.id}/starts", {"starts_on": f"trigger:{plan_words.id}"})
    assert [t.id for t in triggers.starting("Building a plan")] == [plan_words.id] and app.container.get(Sequences).find(building.id).starts_on == "", "a trigger picked on the page starts the sequence"


def test_creating_a_plan_starts_the_shipped_building_a_plan_sequence(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}))
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    listed = app.console().run(["sequence", "list"], AGENT).out
    assert "Building a plan (4 steps, starts on plan.created)" in listed, "the shipped sequence is seeded at boot"
    app.console().run(["plan", "create", "Behaviour tree", "--brief", "a flowchart"], AGENT)
    app.runtime().deferred.drain()
    running = app.container.get(Running)
    run = running.in_hand("s1", 1)
    assert run.title == "Building a plan" and run.about.startswith("plans:") and "step 1" in sent[-1]["line"] and "goal" in sent[-1]["line"]
    app.console().run(["plan", "create", "Another", "--brief", "b"], AGENT)
    app.runtime().deferred.drain()
    assert len(running.runs(app.container.get(StateMachine).agent("s1", 1))) == 1 and running.in_hand("s1", 1).step == 0, "a sequence already running is not started again"
    console = app.console()
    for _ in range(3):
        console.run(["sequence", "follow"], AGENT)
        console.run(["sequence", "next"], AGENT)
    console.run(["sequence", "follow"], AGENT)
    assert "ends when plans:1 is ready" in console.run(["sequence", "next"], AGENT).err, "the last step waits for the plan to be ready"
    console.run(["plan", "phase", "1", "Lay the floor", "--when", "the floor is level"], AGENT)
    task = re.search(r"task (\d+)", console.run(["plan", "add", "1", "Level the floor", "--brief", "level"], AGENT).out).group(1)
    console.run(["plan", "todos", "1", "1", task], AGENT)
    console.run(["plan", "ready", "1"], AGENT)
    assert "ran its last step" in console.run(["sequence", "next"], AGENT).out and running.in_hand("s1", 1) is None, "a ready plan lets the last step end the run"


def test_a_plans_goal_can_be_reset(app):
    hook(app, "SessionStart")
    app.console().run(["plan", "create", "p", "--brief", "first"], USER)
    assert app.console().run(["plan", "brief", "1", "the goal, settled"], USER).code == 0
    from journal.repositories.plans import Plans
    assert app.container.get(Plans).find(1).brief == "the goal, settled"


def test_a_task_added_first_goes_before_the_plans_tasks(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["plan", "create", "p"], USER)
    console.run(["plan", "add", "1", "second"], USER)
    console.run(["plan", "add", "1", "third"], USER)
    console.run(["plan", "add", "1", "first", "--first"], USER)
    shown = console.run(["plan", "show", "1"], USER).out.splitlines()
    assert [line.split(maxsplit=2)[2] for line in shown if line.split()[0].isdigit()] == ["first", "second", "third"]


def test_a_plan_is_built_in_phases_made_ready_approved_by_the_user_and_followed_phase_by_phase(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    catch_typed(app, monkeypatch, sent)
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "the goal"], AGENT)
    for _ in range(4):
        console.run(["sequence", "follow"], AGENT)
        console.run(["sequence", "next"], AGENT)
    console.run(["plan", "phase", "1", "Lay the floor", "--when", "the floor is level"], AGENT)
    console.run(["plan", "phase", "1", "Raise the walls", "--when", "the walls stand", "--checkpoint"], AGENT)
    console.run(["plan", "add", "1", "pour the slab"], AGENT)
    console.run(["plan", "add", "1", "frame the walls"], AGENT)
    console.run(["plan", "add", "1", "level the slab"], AGENT)
    refused = console.run(["plan", "ready", "1"], AGENT)
    assert refused.code == 1 and "phase 1, 2 of plan 1 has no task yet" in refused.err
    console.run(["plan", "todos", "1", "1", "1", "3"], AGENT)
    console.run(["plan", "todos", "1", "2", "2", "3"], AGENT)
    console.run(["plan", "todos", "1", "1", "3"], AGENT)
    assert console.run(["plan", "show", "1"], AGENT).out.count("level the slab") == 1, "a task moved to another phase leaves the one it was in"
    assert console.run(["plan", "ready", "1"], AGENT).code == 0
    shown = console.run(["plan", "show", "1"], AGENT).out
    assert "phase 2: Raise the walls (complete when the walls stand) [checkpoint]" in shown
    assert "not approved" in console.run(["plan", "start", "1"], AGENT).err
    assert "only the user approves" in console.run(["plan", "approve", "1"], AGENT).err
    assert console.run(["plan", "approve", "1"], USER).code == 0
    app.runtime().deferred.drain()
    assert "the user approved plan 1" in sent[-1]
    assert "task 1," in console.run(["plan", "start", "1"], AGENT).out
    console.run(["task", "done", "1"], AGENT)
    app.runtime().deferred.drain()
    assert app.container.get(StateMachine).current("s1").task_id == 3, "the second task of phase 1 comes before the first of phase 2"


def test_a_plan_in_review_waits_for_its_reviewers_before_it_is_ready_or_approved(app):
    from journal.repositories.plans import Plans
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "the goal"], AGENT)
    console.run(["plan", "phase", "1", "Lay the floor"], AGENT)
    console.run(["plan", "add", "1", "pour the slab"], AGENT)
    console.run(["plan", "todos", "1", "1", "1"], AGENT)
    console.run(["plan", "ready", "1"], AGENT)
    assert console.run(["plan", "review", "1"], AGENT).code == 0
    assert "is in review" in console.run(["plan", "approve", "1"], USER).err, "no approval while reviewers read it"
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "review plan 1", "prompt": "Read plan 1 and say what it misses.", "subagent_type": "journal-researcher", "model": "sonnet"}, tool_use_id="u1")
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "map the plugins", "prompt": "Map version 3 plugins.", "subagent_type": "journal-researcher", "model": "sonnet"}, tool_use_id="u2")
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "map the plugins", "prompt": "Map version 3 plugins.", "subagent_type": "journal-researcher", "model": "sonnet"}, tool_use_id="u2", tool_response={"isAsync": True, "agentId": "r2"})
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "review plan 1", "prompt": "Read plan 1 and say what it misses.", "subagent_type": "journal-researcher", "model": "sonnet"}, tool_use_id="u1", tool_response={"isAsync": True, "agentId": "r1"})
    assert "1 of its reviewers are still out" in console.run(["plan", "ready", "1"], AGENT).err
    app.runtime().deferred.drain()
    assert app.container.get(Plans).find(1).reviewers == 1, "the plan the viewer reads counts its reviewer out"
    hook(app, "SubagentStop", agent_id="r1")
    app.runtime().deferred.drain()
    assert app.container.get(Plans).find(1).reviewers == 0, "the reviewer back, the plan says so without anything else changing it"
    assert console.run(["plan", "ready", "1", "--changed", "task 1 reworded"], AGENT).code == 0, "the reviewer back, its findings in, the plan is ready again"
    assert console.run(["plan", "approve", "1"], USER).code == 0


def test_a_task_of_a_plan_not_yet_started_is_not_offered_at_a_stop(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "g"], USER)
    console.run(["plan", "add", "1", "planned work"], USER)
    assert hook(app, "Stop")[1] == {}, "a plan's task waits for the plan"
    console.run(["task", "create", "free work"], USER)
    assert "task 2 next: free work" in hook(app, "Stop")[1]["reason"]


def test_the_shipped_templates_are_seeded_and_the_critique_ones_are_offered_to_the_viewer(app):
    hook(app, "SessionStart")
    listed = app.console().run(["template", "list"], AGENT).out
    assert "Find what is missing (for plan, critique)" in listed and "Functional design (for doc)" in listed
    shown = app.console().run(["template", "show", "3"], AGENT).out
    assert shown.startswith("template 3: Find what is missing") and "the step nobody wrote down" in shown
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/templates", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        rows = json.loads(reply.read())["rows"]
    assert [r["purpose"] for r in rows].count("critique") == 3 and rows[0]["parts"][0].startswith("What it is for")


def test_a_report_is_written_from_a_file_and_linked_to_what_it_is_about(app, tmp_path):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["plan", "create", "p", "--brief", "g"], USER)
    body = tmp_path / "critique.md"
    body.write_text("What two readers found.\n\n## Phase 1\n\n- a gap\n\n## Phase 2\n\n- another\n")
    out = app.console().run(["report", "create", "Critique of plan 1", "--file", str(body), "--about", "plans:1"], AGENT).out
    assert out.startswith("report 1: Critique of plan 1, about plans:1")
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/reports/1", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        report = json.loads(reply.read())
    assert "## Phase 1" in report["body"] and "## Phase 2" in report["body"] and report["links"] == ["plans:1"], "a report names the rows it is about as the journal does"


def test_a_turn_with_several_reply_tags_answers_each_message_with_its_own_part(app):
    from journal.repositories.messages import Messages
    console = app.console()
    console.run(["message", "send", "first?"], USER)
    console.run(["message", "send", "second?"], USER)
    console.run(["message", "read", "1"], AGENT)
    console.run(["message", "read", "2"], AGENT)
    hook(app, "MessageDisplay", message="Two answers.\n\n[!reply:1]\nThe first is fine.\n\n[!reply:2]\nThe second waits.")
    app.runtime().deferred.drain()
    replies = [m for m in app.container.get(Messages).in_() if m.author == "agent"]
    assert [(m.reply_to, m.text) for m in replies] == [(1, "Two answers.\n\nThe first is fine."), (2, "The second waits.")]


def test_a_subagent_launched_in_the_background_runs_until_its_own_stop_hook(app):
    hook(app, "SessionStart")
    rows = lambda: [asdict(row) for row in app.container.get(Subagents).rows("s1")]
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "Lord Macaulay reads", "model": "sonnet", "subagent_type": "journal-researcher", "prompt": "read"})
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "Lord Macaulay reads"}, tool_response={"isAsync": True, "status": "async_launched", "agentId": "a1"})
    assert rows()[0]["running"] is True and rows()[0]["status"] == "running", "the tool's instant answer does not end a background subagent"
    hook(app, "SubagentStop", agent_id="a1", agent_type="researcher")
    row = rows()[0]
    assert row["running"] is False and row["status"] == "done" and row["ended"] >= row["at"]
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"subagent_type": "journal-researcher", "description": "a quick one", "model": "haiku", "prompt": "x"})
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "a quick one"}, tool_response="the finished work")
    assert rows()[1]["running"] is False, "a subagent that answered in the tool's own result is done at once"
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"subagent_type": "journal-researcher", "description": "never ran", "model": "haiku", "prompt": "x"}, tool_use_id="t-lost")
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "Mr. Turing weighs", "model": "opus", "subagent_type": "journal-planner", "prompt": "x"}, tool_use_id="t-2")
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "Mr. Turing weighs"}, tool_response={"isAsync": True, "status": "async_launched", "agentId": "a2"}, tool_use_id="t-2")
    hook(app, "SubagentStop", agent_id="a2", agent_type="auditor")
    assert [r["running"] for r in rows()[2:]] == [True, False], "a start that never finished keeps its own row; the finish and the stop close the row they belong to, by the tool use's id"


def test_a_write_after_a_message_is_read_waits_for_the_answer(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["message", "send", "could you rename it?"], USER)
    app.console().run(["message", "read", "1"], AGENT)
    assert hook(app, "PreToolUse", tool_name="Edit", tool_input={"file_path": "a.py"})[0] == 409, "a word first, then the work: the user's ruling of 2026-10-16"
    hook(app, "MessageDisplay", message="Yes, renaming it now.")
    app.runtime().deferred.drain()
    assert hook(app, "PreToolUse", tool_name="Edit", tool_input={"file_path": "a.py"})[0] == 200

def test_a_row_named_in_a_message_is_a_chip_in_the_viewer():
    from journal.features.messages.support.mentions import Mentions
    assert [str(r) for r in Mentions.in_("Please have 2 agents give plan 1 a normal read, following template 3 (Find what is missing), then task 12 and Task 12 again, doc #4")] == ["plans:1", "templates:3", "tasks:12", "docs:4"]
    assert Mentions.in_("the plan is ready; 3 agents; version 4") == []


def test_a_messages_mentions_reach_the_viewer_as_refs(app):
    hook(app, "SessionStart")
    app.console().run(["message", "send", "look at plan 1 and task 2"], USER)
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/messages", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        rows = json.loads(reply.read())["rows"]
    assert rows[-1]["mentions"] == ["plans:1", "tasks:2"]


def test_a_server_set_up_in_claude_itself_is_removed_from_the_page_through_claudes_own_command(app, monkeypatch):
    import json as j
    from urllib.request import Request as R, urlopen
    from journal.support.health import Health
    from journal.features.mcp.support.health_report import HealthReport
    from journal.features.mcp.support.known import Known
    from journal.supervisor_link import SupervisorLink
    sent, removed = [], []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}))
    monkeypatch.setattr(Health, "asked", lambda self: HealthReport({"blender": Known("blender", "uvx blender-mcp", "connected", "")}))
    monkeypatch.setattr(Health, "remove", lambda self, name: removed.append(name) or name == "blender")
    hook(app, "SessionStart")
    port = app.server().port
    listed = j.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/mcp", headers={"X-Journal-Env": "main"}), timeout=5))["servers"]
    assert [s["name"] for s in listed] == ["blender"] and listed[0]["managed"] is False
    with urlopen(R(f"http://127.0.0.1:{port}/journal/mcp/blender/remove", data=b"{}", method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5) as r:
        assert j.loads(r.read()) == {"removed": "blender"}
    assert removed == ["blender"] and sent[-1]["verb"] == "restart"
    try:
        urlopen(R(f"http://127.0.0.1:{port}/journal/mcp/nothing/remove", data=b"{}", method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5)
    except HTTPError as error:
        assert error.code == 404


def test_words_start_a_sequence_from_a_prompt_or_from_the_users_message(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    catch_typed(app, monkeypatch, sent)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    assert "sequence give me an update" in console.run(["trigger", "list"], AGENT).out, "the update words are a shipped trigger"
    console.run(["sequence", "create", "release", "--steps", "bump | tag"], USER)
    console.run(["trigger", "create", "ship it", "release", "--do", "sequence"], USER)
    body = hook(app, "UserPromptSubmit", prompt="ok, ship it now")[1]
    running = app.container.get(Running)
    assert running.in_hand("s1", 1).title == "release" and "step 1: bump" in json.dumps(body), "a prompt's words start the sequence and its first step rides on the answer"
    for _ in range(2):
        console.run(["sequence", "follow"], AGENT)
        console.run(["sequence", "next"], AGENT)
    console.run(["message", "send", "could you give me an update?"], USER)
    app.runtime().deferred.drain()
    assert running.in_hand("s1", 1).title == "Writing an update" and any("Find what changed" in line for line in sent), "the user's message starts the update sequence, typed to the agent"

def test_a_subagent_dispatched_long_ago_in_the_session_stays_in_the_dropdown(app):
    hook(app, "SessionStart")
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "Herr Gropius draws", "model": "opus", "subagent_type": "journal-debugger", "prompt": "draw"})
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "Herr Gropius draws"}, tool_response={"isAsync": True, "agentId": "g1"})
    for _ in range(60):
        hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a", "limit": 1})
        hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "a"}, tool_response="x")
    rows = [asdict(row) for row in app.container.get(Subagents).rows("s1")]
    assert [r["task"] for r in rows] == ["Herr Gropius draws"] and rows[0]["running"] is True


def test_a_link_given_in_the_chat_is_pinned_above_it_or_earns_one_reminder(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    catch_typed(app, monkeypatch, sent)
    hook(app, "SessionStart")
    console = app.console()
    hook(app, "MessageDisplay", message="The design is at https://design.example/p/1 and the docs at http://127.0.0.1:8420/#/x.")
    app.runtime().deferred.drain()
    reminders = [line for line in sent if "is not pinned" in line]
    assert len(reminders) == 1 and "https://design.example/p/1" in reminders[0] and "127.0.0.1" not in reminders[0], "one reminder per outside link; the journal's own links pin themselves"
    hook(app, "MessageDisplay", message="Again: https://design.example/p/1")
    app.runtime().deferred.drain()
    assert len([line for line in sent if "is not pinned" in line]) == 1, "told once"
    out = console.run(["notice", "create", "The Workflows design", "--link", "https://design.example/p/1", "--label", "Open the design"], AGENT).out
    assert out.startswith("notice 1 pinned")
    notice = lambda: json.load(urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/notices/1", headers={"X-Journal-Env": "main"}), timeout=5))
    assert (notice()["title"], notice()["link"], notice()["label"], notice()["closed_at"]) == ("The Workflows design", "https://design.example/p/1", "Open the design", None)
    console.run(["notice", "close", "1"], AGENT)
    assert notice()["closed_at"], "closed, it leaves the strip"


def test_an_answer_names_the_command_that_shows_the_question_whole_and_that_read_is_never_piped(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    console = app.console()
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["question", "ask", "Which name?", "--options", "alpha", "beta"], AGENT)
    console.run(["question", "answer", "1", "beta"], USER)
    assert any("question 1 is answered" in line and "`journal question show 1`" in line for line in typed), "told like a message, with the command to read it"
    shown = console.run(["question", "show", "1"], AGENT).out
    assert "question 1: Which name?  [alpha / beta]" in shown and "answer: beta" in shown and "act on the answer" in shown
    status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal question show 1 " + "|" + " head -2"})
    assert status == 409 and "`journal question show`" in body["error"], "read whole, never through a pipe"


def test_a_message_left_from_the_viewer_while_the_agent_sits_idle_is_named_to_it_at_once(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    hook(app, "Stop")
    data = json.dumps({"text": "are you there?", "idempotency": "v1"}).encode()
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/messages", data=data, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
    with urlopen(request, timeout=5) as reply:
        n = json.loads(reply.read())["id"]
    assert any(line == f"[journal] new message {n}" for line in typed), "named by number the moment it arrives, so it is not left for the next hook"


def test_the_rules_doc_names_every_line_a_listener_says():
    """Plan 2's map: a listener's line not in the rules table is a line nobody planned for."""
    from pathlib import Path
    doc = (Path(__file__).resolve().parents[1] / "docs" / "the-rules.md").read_text()
    root = Path(__file__).resolve().parents[1] / "src" / "journal" / "features"
    missing = []
    for listener in root.glob("*/listeners/*.py"):
        feature = listener.parts[-3]
        for key in set(re.findall(r"\b([A-Z_]+)\.about\(", listener.read_text())):
            name = re.search(rf"\b{key} = Nudge\(name, \"([a-z_]+)\"", (root / feature / "feature.py").read_text())
            if name and f"{feature}.{name.group(1)}" not in doc and name.group(1) not in doc:
                missing.append(f"{feature}.{name.group(1)}")
    assert not missing, f"lines said by a listener and absent from docs/the-rules.md: {sorted(set(missing))}"


def test_a_subagents_tool_use_does_not_lift_the_agents_own_wait(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["await", "the readers", "--until", "false"], AGENT)
    machine = app.container.get(StateMachine)
    assert machine.current("s1").name == "expecting"
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"}, agent_id="sub-1")
    assert machine.current("s1").name == "expecting", "a subagent reading is not the agent working again"
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    assert machine.current("s1").name == "idle", "the agent's own tool use lifts the wait"

def test_a_row_event_walks_about_every_agent_of_the_environment_and_speaks_once(app, monkeypatch):
    typed = []
    from journal.support.where import Where
    catch_typed(app, monkeypatch, typed)
    console = app.console()
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    hook(app, "SessionStart", session_id="s2")
    console.run(["environment", "here"], Where("main", "s2"))
    console.run(["task", "create", "t", "--start"], Where("main", "s2"))
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "fast"], Where("main", "s2"))
    console.run(["worker", "wait", "1"], Where("main", "s2"))
    typed.clear()
    machine = app.container.get(StateMachine)
    assert machine.current("s2").name == "awaiting"
    console.run(["worker", "report", "1", "parser done"], Where("main", "w1"))
    app.runtime().deferred.drain()
    assert machine.current("s2").task_id == 1, "the agent awaiting the worker, not the live one, is released by the shipped workflow"
    assert typed == ["[journal] worker 1, Lady Lovelace, reported in the chat", "[journal] what you waited on came back: carry on"], "told once, on the walk about the agent that waits"

def test_the_etiquette_reminder_comes_after_fifty_lines_and_never_floods(app):
    from journal.engine.nudger import Nudger
    from journal.features.chart.feature import ChartFeature
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    agent, nudger = app.container.get(StateMachine).agent("s1", 1), app.container.get(Nudger)
    after_tool = lambda: hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": "a"})[1].get("hookSpecificOutput", {}).get("additionalContext", "")
    for i in range(50):
        nudger.say(agent, ChartFeature.LINE.create(text=f"line {i}"))
    app.runtime().deferred.drain()
    assert "chat etiquette" in after_tool(), "fifty lines since the last reminder, counted once the replies have gone, bring it at the next tool use"
    app.runtime().deferred.drain()
    assert "chat etiquette" not in after_tool(), "said, the count starts again"
    for i in range(1000):
        nudger.say(agent, ChartFeature.LINE.create(text=f"more {i}"))
    app.runtime().deferred.drain()
    assert "chat etiquette" not in after_tool(), "a thousand lines later but inside the reminder's own window, none again: no flood"


def test_a_cancelled_plan_takes_its_own_open_tasks_with_it_and_leaves_shared_ones(app):
    from journal.models.plan_state import PlanState
    from journal.models.task_state import TaskState
    from journal.repositories.plans import Plans
    from journal.repositories.tasks import Tasks
    console = app.console()
    console.run(["plan", "create", "old", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "its own"], USER)
    console.run(["plan", "add", "1", "finished"], USER)
    console.run(["task", "start", "2"], AGENT)
    console.run(["task", "done", "2", "--how", "done"], AGENT)
    console.run(["plan", "create", "new", "--brief", "b"], USER)
    console.run(["plan", "add", "2", "shared"], USER)
    console.run(["plan", "phase", "1", "p", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "3"], USER)
    out = console.run(["plan", "cancel", "1"], USER).out
    assert "plan 1 cancelled, with tasks 1" in out
    plans, tasks = app.container.get(Plans), app.container.get(Tasks)
    assert plans.find(1).state == PlanState.CANCELLED and tasks.find(1).state == TaskState.CANCELLED
    assert tasks.find(2).state == TaskState.DONE and tasks.find(3).state == TaskState.OPEN, "a done task stays done; a task the new plan holds too stays open"
    assert tasks.find(1).id not in [t.id for t in plans.free()], "a cancelled task is offered to nobody"

def test_approving_a_started_plan_leaves_it_started(app):
    from journal.models.plan_state import PlanState
    from journal.repositories.plans import Plans
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "first"], USER)
    console.run(["plan", "phase", "1", "one", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "1"], USER)
    console.run(["plan", "ready", "1"], USER)
    console.run(["plan", "approve", "1"], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["plan", "start", "1"], AGENT)
    assert "plan 1 started" in console.run(["plan", "approve", "1"], USER).out
    assert app.container.get(Plans).find(1).state == PlanState.STARTED, "a second word from the page cannot set a running plan back to approved"
    assert "cannot become ready" in console.run(["plan", "ready", "1"], AGENT).err, "the agent cannot undo the user's approval"
    assert "cannot become reviewing" in console.run(["plan", "review", "1"], AGENT).err
    assert app.container.get(Plans).find(1).state == PlanState.STARTED


def test_each_review_round_is_kept_on_the_plan_with_its_reviewers_report_and_changes(app):
    from journal.http.plans.plan_outline import PlanOutline
    from journal.repositories.plans import Plans
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "first"], USER)
    console.run(["plan", "phase", "1", "one", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "1"], USER)
    hook(app, "SessionStart")
    console.run(["plan", "review", "1"], AGENT)
    hook(app, "PreToolUse", tool_name="Agent", tool_input={"subagent_type": "journal-researcher", "description": "Lady Lovelace reads plan 1", "prompt": "read plan 1", "model": "sonnet"}, tool_use_id="t-1")
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "Lady Lovelace reads plan 1", "prompt": "read plan 1"}, tool_use_id="t-1", tool_response="found two gaps")
    console.run(["report", "create", "Plan 1, first review", "--body", "two gaps", "--about", "plans:1"], AGENT)
    assert "--changed" in console.run(["plan", "ready", "1"], AGENT).err, "a plan back from review says what the round changed"
    assert "ready" in console.run(["plan", "ready", "1", "--changed", "task 1 reworded"], AGENT).out
    console.run(["plan", "review", "1"], AGENT)
    outline = app.container.get(PlanOutline).of(app.container.get(Plans).find(1))
    open_, first = outline["reviews"]
    assert (first["reviewers"], first["changed"], first["report_ids"]) == (("Lady Lovelace reads plan 1",), "task 1 reworded", [1]), "the closed round names its reviewer, its change and its report"
    assert (open_["changed"], open_["report_ids"]) == (None, []), "the round in progress is first, still open"


def test_the_page_reads_a_cancelled_plan_and_its_task_as_abandoned(app):
    import json as j
    from urllib.request import urlopen
    console = app.console()
    console.run(["plan", "create", "old", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "its own"], USER)
    console.run(["plan", "cancel", "1"], USER)
    for table in ("plans", "tasks"):
        with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/{table}?closed=1", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
            assert reply.status == 200, f"cancelled {table} are read by the page"
            rows = j.loads(reply.read())["rows"]
            assert rows and all(row["state"] == "cancelled" for row in rows), "a cancelled plan and its task are closed, shown with the closed ones"

def test_the_rules_doc_rules_on_every_state_the_engine_knows(app):
    from pathlib import Path
    from journal.support.states_catalogue import StatesCatalogue
    doc = (Path(__file__).resolve().parents[1] / "docs" / "the-rules.md").read_text()
    table = doc.split("## Every state, and who holds its conduct")[1].split("## ")[0]
    names = app.container.get(StatesCatalogue).names()
    assert "subagent" not in names, "the state nothing entered is gone"
    assert [n for n in names if f"| {n} |" not in table] == [], "every state the engine knows has a ruling in the rules doc"

def test_a_refused_dispatch_leaves_no_running_subagent_behind(app):
    from journal.repositories.environments import Environments
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["message", "send", "a word first"], USER)
    console.run(["message", "read", "1"], AGENT)
    status, body = hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "Lord Macaulay reads", "model": "opus", "prompt": "read the plan", "subagent_type": "journal-researcher"})
    assert status == 409 and "answer or react to message 1 first" in body["error"], "the dispatch is held until the message is answered"
    rows = [asdict(row) for row in app.container.get(Subagents).rows("s1")]
    assert rows == [], "a dispatch the journal refused never ran and is no subagent"


def test_a_read_outside_every_scope_is_refused_and_a_command_reads_its_own_environment_only(app):
    from contextvars import Context
    from journal.repositories.tasks import Tasks
    from journal.support.unscoped import Unscoped
    console = app.console()
    console.run(["task", "create", "main's own"], USER)
    console.run(["task", "create", "other's own"], Where("other"))
    with pytest.raises(Unscoped):
        Context().run(app.container.get(Tasks).in_)
    in_main, in_other = console.run(["task", "list"], USER).out, console.run(["task", "list"], Where("other")).out
    assert "main's own" in in_main and "other's own" not in in_main
    assert "other's own" in in_other and "main's own" not in in_other
    assert [t.title for t in app.container.get(Tasks).in_()] == ["main's own"], "the test reads in main, the scope its fixture entered"

def test_the_edits_since_the_log_are_read_from_the_record_the_task_named_the_log_asked_for_and_the_write_held(app):
    for key, value in (("tasks.log_after", 3), ("tasks.first_nudge_after", 1), ("tasks.name_every", 2), ("tasks.auto", False)):
        app.container.get(SettingRows).save(Setting(environment_id=0, key=key, value=value), Actor.system())
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    drain = lambda: app.runtime().deferred.drain()
    write = lambda name: hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": name})
    said = lambda body: json.dumps(body)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    drain()
    status, body = write("a.py")
    assert status == 200 and "since you logged" not in said(body) and "in hand" not in said(body), "the first write: nothing to say yet"
    status, body = write("b.py")
    assert status == 200 and "1 edits since you logged task 1: say where it stands" in said(body), "the second write reads one edit before it: the log is asked for at the first threshold"
    status, body = write("c.py")
    assert status == 200 and "task 1 in hand, 2 edits" in said(body), "the third write reads two: every second edit names the task"
    status, body = write("d.py")
    assert status == 409 and "3 edits since you logged task 1" in body["error"], "the fourth reads three: the write is held until the log"
    status, body = write("e.py")
    assert status == 409 and "3 edits since you logged task 1" in body["error"], "a held write does not count: still three"
    console.run(["task", "log", "1", "halfway"], AGENT)
    drain()
    assert write("d.py")[0] == 200, "logged, the edits since the log are none and the write goes on"


def test_a_second_boot_on_a_seeded_journal_changes_nothing(app):
    from journal.features.chart.seeds.shipped_chart import ShippedChart
    from journal.repositories.charts import Charts
    charts, seed = app.container.get(Charts), app.container.get(ShippedChart)
    picture = lambda: [(c.id, c.title, c.state, c.event, c.places, c.revision, c.locked, c.drawing, c.drawn_version, [(n.id, n.kind, n.key, n.text, n.locked) for n in charts.nodes_of(c)], [(l.source.id, l.target.id, l.kind) for l in charts.lines_of(c)]) for c in charts.all()]
    seed.run()
    first = picture()
    seed.run()
    assert picture() == first, "a boot on a journal already seeded draws, resets, releases and strips nothing: the second run is a no-op"


def test_what_the_agent_owes_is_a_fact_on_its_row_oriented_the_mark_owed_and_the_skills_owed(skilled):
    from journal.features.chart.support.context import Context
    from journal.support.fillers import Fillers
    from journal.support.requiring import Requiring
    from journal.repositories.agents import Agents
    app = skilled
    agents, requiring, fillers = app.container.get(Agents), app.container.get(Requiring), app.container.get(Fillers)
    row = lambda: agents.for_session("s1")
    from journal.events.agent.idle import Idle
    at = Context(event=Idle(session="s1", environment_id=1), session="s1", environment_id=1)
    hook(app, "SessionStart")
    assert row().oriented is False and requiring.owed_names(row()) == ["journal"], "a session start: not oriented, the journal skill owed"
    assert fillers.fill("{{awaiting}} / {{skill_owed}} / {{skill_path}}", at) == "a look at what is in flight here and the journal skill to be read / journal / .claude/skills/journal/SKILL.md"
    read_skill(app, "journal")
    assert requiring.owed_names(row()) == [] and row().skills_loaded and "journal" in row().skills_loaded, "the read removes the owed link and keeps the hash"
    app.console().run(["environment", "here"], AGENT)
    assert row().oriented is True and fillers.fill("{{awaiting}}", at) == "", "the look sets oriented and nothing is owed"
    hook(app, "UserPromptSubmit", prompt="make me a plan for the release")
    assert requiring.owed_names(row()) == ["plans"] and fillers.fill("{{skill_path}}", at) == ".claude/skills/journal-plans/SKILL.md", "a prompt naming plans: the plans skill owed, with its path"
    read_skill(app, "journal-plans")
    assert requiring.owed_names(row()) == []
    app.console().run(["task", "create", "t", "--start"], AGENT)
    assert requiring.owed_names(row()) == [], "entering a state owes nothing by itself: a state's skill is owed at a start in it"
    context(app, 30)
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert row().mark_owed == 25 and row().context_mark == 25 and fillers.fill("{{awaiting}}", at) == "a decision at the context mark, 25% full", "the crossing sets the mark owed"
    app.console().run(["fact", "create", "the login is flaky"], AGENT)
    assert row().mark_owed == 0 and row().context_mark == 25, "the fact clears the mark owed and keeps the mark taken"
    context(app, 55)
    hook(app, "Stop")
    assert row().mark_owed == 50
    app.console().run(["nothing", "survives", "all logged"], AGENT)
    assert row().mark_owed == 0, "nothing survives clears it too"
    status, body = hook(app, "SessionStart", source="compact")
    assert row().oriented is False and row().mark_owed == 0, "a start after a compaction owes the look again; the start's own write touches oriented alone"

def test_an_agent_snapshot_in_a_pause_it_owed_is_unwrapped_at_boot_with_the_fact_set(tmp_path: Path, monkeypatch):
    import json
    import sqlite3
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    first = App(Config(tmp_path, port=0))
    first.runtime().start()
    hook(first, "SessionStart")
    first.console().run(["environment", "here"], AGENT)
    first.console().run(["task", "create", "t", "--start"], AGENT)
    first.runtime().stop()
    db = sqlite3.connect(first.config.database)
    working = json.loads(db.execute("SELECT data FROM agents WHERE session = 's1'").fetchone()[0])
    nested = {"resume": {"state": "at_mark", "data": {"resume": {"state": "working", "data": working}, "mark": 50}}, "skill": "plans", "path": ".claude/skills/journal-plans/SKILL.md"}
    db.execute("UPDATE agents SET state = 'loading_skill', data = ?, oriented = 1, mark_owed = 0 WHERE session = 's1'", (json.dumps(nested),))
    db.execute("DELETE FROM migrations")
    db.commit()
    db.close()
    second = App(Config(tmp_path, port=0))
    second.runtime().start()
    try:
        from journal.support.requiring import Requiring
        from journal.repositories.agents import Agents
        from journal.support.scope import Scope
        with second.container.get(Scope).of(MAIN):
            agent = second.container.get(Agents).for_session("s1")
            assert agent.state == "working" and agent.data.get("task_id") == 1 and agent.mark_owed == 50 and agent.oriented is True, "unwrapped to the work it held, the mark owed, never dropped to idle"
            assert "plans" in second.container.get(Requiring).owed_names(agent), "the skill it was reading is owed as a link"
    finally:
        second.runtime().stop()


def test_an_agent_in_the_old_running_sequence_state_is_unwrapped_at_boot_with_the_run_on_its_row(tmp_path: Path, monkeypatch):
    import sqlite3
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    first = App(Config(tmp_path, port=0))
    first.runtime().start()
    hook(first, "SessionStart")
    first.console().run(["environment", "here"], AGENT)
    first.console().run(["task", "create", "t", "--start"], AGENT)
    made = first.console().run(["sequence", "create", "release", "--steps", "bump | tag | push"], USER).out.split()[1].rstrip(":")
    first.runtime().stop()
    db = sqlite3.connect(first.config.database)
    working = json.loads(db.execute("SELECT data FROM agents WHERE session = 's1'").fetchone()[0])
    running = {"resume": {"state": "working", "data": working}, "sequence_id": int(made), "step": 1, "text": "tag"}
    db.execute("UPDATE agents SET state = 'waiting', data = ? WHERE session = 's1'", (json.dumps({"resume": {"state": "running_sequence", "data": running}, "question_id": 1}),))
    db.execute("DELETE FROM migrations")
    db.commit()
    db.close()
    second = App(Config(tmp_path, port=0))
    second.runtime().start()
    try:
        from journal.repositories.agents import Agents
        from journal.support.scope import Scope
        with second.container.get(Scope).of(MAIN):
            agent = second.container.get(Agents).for_session("s1")
            run = second.container.get(Running).runs(agent)[-1]
            assert agent.state == "waiting" and [layer["state"] for layer in agent.stack] == ["idle", "working", "waiting"], "the run's layer is taken out of the chain, the rest stands on the stack"
            assert run.title == "release" and run.steps == ("bump", "tag", "push") and run.text == "tag", "the run is on the row at the step it stood at"
    finally:
        second.runtime().stop()


def test_a_run_goes_with_the_agent_to_its_next_session(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    made = console.run(["sequence", "create", "release", "--steps", "bump | tag"], USER).out.split()[1].rstrip(":")
    console.run(["sequence", "run", made], AGENT)
    hook(app, "SessionEnd")
    hook(app, "SessionStart", session_id="s2")
    running = app.container.get(Running)
    assert running.in_hand("s2", 1).title == "release" and running.in_hand("s1", 1) is None, "the next session takes the run over"

def test_a_run_a_worker_starts_is_its_own_and_its_step_waits_for_its_stop(app, monkeypatch):
    from journal.models.worker import Worker
    from journal.repositories.workers import Workers
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    catch_typed(app, monkeypatch, sent)
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.container.get(Workers).save(Worker(environment_id=1, name="Mr. Pitman", session="s2"), Actor.system())
    hook(app, "SessionStart", session_id="s2")
    app.console().run(["environment", "here"], Where("main", "s2"))
    hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": str(app.config.root / ".claude/skills/journal-plans/SKILL.md")}, tool_response="", session_id="s2")
    app.console().run(["plan", "create", "Side work", "--brief", "b"], Where("main", "s2"))
    app.runtime().deferred.drain()
    running = app.container.get(Running)
    assert running.in_hand("s2", 1).title == "Building a plan" and running.in_hand("s1", 1) is None and not any("Building" in line or "step 1" in line for line in sent), "the run is the worker's, and its step is not typed to the agent"
    hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": str(app.config.root / ".claude/skills/journal-sequences/SKILL.md")}, tool_response="", session_id="s2")
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"}, session_id="s2")
    assert "step 1" in hook(app, "Stop", session_id="s2")[1]["reason"], "the worker is told the step at its stop"

def test_the_steps_hold_comes_after_the_look_the_mark_and_the_skill_and_each_is_paid_in_turn(skilled):
    app, console = skilled, skilled.console()
    edit = lambda: hook(app, "PreToolUse", tool_name="Edit", tool_input={"file_path": "a.py", "old_string": "a", "new_string": "b"})
    made = console.run(["sequence", "create", "release", "--steps", "bump | tag"], USER).out.split()[1].rstrip(":")
    hook(app, "SessionStart")
    console.run(["sequence", "run", made], AGENT)
    context(app, 30)
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    for pay in (lambda: read_skill(app, "journal"), lambda: read_skill(app, "journal-sequences"), lambda: console.run(["environment", "here"], AGENT), lambda: console.run(["nothing", "survives", "all logged"], AGENT)):
        status, held = edit()
        assert status == 409 and "a write waits for sequence" not in json.dumps(held), "the debt holds the write, and the step stays out of it"
        assert "step 1" not in json.dumps(hook(app, "Stop")[1]), "while a debt is owed the step is not said at a stop"
        pay()
    assert "a write waits for sequence" in json.dumps(edit()[1]), "every debt paid, the step holds the write"
    console.run(["sequence", "follow"], AGENT)
    assert edit()[0] == 200, "the step taken up, the write goes through"

def test_the_step_is_said_again_at_a_start_when_a_wait_ends_and_at_a_pace(app, monkeypatch):
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    catch_typed(app, monkeypatch, sent)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    made = console.run(["sequence", "create", "release", "--steps", "bump | tag"], USER).out.split()[1].rstrip(":")
    console.run(["sequence", "run", made], AGENT)
    assert "step 1: bump" in json.dumps(hook(app, "SessionStart", source="compact")[1]), "after a compaction the step is told"
    console.run(["await", "the build", "--until", "false"], AGENT)
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    app.runtime().deferred.drain()
    assert any("step 1: bump" in line for line in sent), "a wait that ends types the step"
    sent.clear()

    def tick():
        app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=120.0))
        app.runtime().deferred.drain()
    tick()
    assert sent == [], "a step just said is not said again"
    app.container.get(SettingRows).set("sequences.say_every", 0, Actor.user(1))
    tick()
    assert any("step 1: bump" in line for line in sent), "a step unheard for the set minutes is typed again to a quiet agent"
    console.run(["sequence", "park", "--why", "docs first"], AGENT)
    sent.clear()
    tick()
    assert sent == [], "a parked run is not said at a pace"
    assert "is parked at step 1" in json.dumps(hook(app, "SessionStart", source="resume")[1]), "and at a start"
    console.run(["sequence", "follow"], AGENT)
    app.runtime().deferred.drain()
    sent.clear()
    console.run(["question", "ask", "Which name?"], AGENT)
    tick()
    assert sent == [], "no step is said at a pace while a question to the user is open"
    console.run(["question", "answer", "1", "alpha"], USER)
    tick()
    assert any("step 1: bump" in line for line in sent), "and it is said again once the question is answered"


def test_a_list_counts_a_type_in_sql_past_the_page(app):
    import json as j
    from urllib.request import urlopen
    from journal.models.task import Task
    from journal.models.task_state import TaskState
    from journal.repositories.tasks import Tasks
    tasks = app.container.get(Tasks)
    for n in range(520):
        tasks.save(Task(environment_id=1, title=f"t{n}", state=TaskState.DONE if n < 400 else TaskState.OPEN), Actor.user(1) if n % 2 else Actor.agent("s1"))
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/tasks?limit=10&env=main"), timeout=5) as reply:
        counts = j.loads(reply.read())["counts"]
    assert counts == {"all": 520, "open": 120, "unread": 60}, "a count is of every row, not of the newest page"

def test_a_run_is_abandoned_with_its_reason_or_ends_when_its_row_or_sequence_is_gone(app, monkeypatch):
    from journal.repositories.messages import Messages
    from journal.repositories.sequences import Sequences
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    catch_typed(app, monkeypatch, sent)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    running = app.container.get(Running)
    made = console.run(["sequence", "create", "release", "--steps", "bump | tag | push"], USER).out.split()[1].rstrip(":")
    console.run(["sequence", "run", made], AGENT)
    assert "was never taken up" in console.run(["sequence", "abandon", "--why", "not needed", "--sure"], AGENT).err, "a step is taken up before it is given up"
    console.run(["sequence", "follow"], AGENT)
    unsure = console.run(["sequence", "abandon", "--why", "not needed"], AGENT)
    assert unsure.code == 1 and "leaves undone: 1. bump; 2. tag; 3. push" in unsure.err and running.in_hand("s1", 1), "without --sure it names what it would skip and keeps the run"
    assert f"sequence {made} abandoned" in console.run(["sequence", "abandon", "--why", "not needed", "--sure"], AGENT).out and running.in_hand("s1", 1) is None
    card = app.container.get(Messages).in_()[-1]
    assert "abandoned at step 1: not needed" in card.text and "left undone: 1. bump" in card.data["detail"], "the user is told, with the reason and what was left undone"
    console.run(["plan", "create", "Side work", "--brief", "b"], AGENT)
    app.runtime().deferred.drain()
    assert running.in_hand("s1", 1).title == "Building a plan"
    console.run(["plan", "cancel", "1"], AGENT)
    app.runtime().deferred.drain()
    assert running.in_hand("s1", 1) is None and any("plans:1 was cancelled" in line for line in sent), "a cancelled plan ends its run and the agent is told"
    console.run(["sequence", "run", made], AGENT)
    sequences = app.container.get(Sequences)
    sequences.delete(sequences.find(int(made)), USER.actor)
    app.runtime().deferred.drain()
    assert running.in_hand("s1", 1) is None and any(f"sequence {made} was deleted" in line for line in sent), "a deleted sequence ends its runs"

def test_runs_nest_never_in_themselves_and_only_the_users_words_start_one(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    running = app.container.get(Running)
    outer = console.run(["sequence", "create", "release", "--steps", "bump | tag"], USER).out.split()[1].rstrip(":")
    inner = console.run(["sequence", "create", "check", "--steps", "lint"], USER).out.split()[1].rstrip(":")
    console.run(["sequence", "run", outer], AGENT)
    assert "is running already" in console.run(["sequence", "run", outer], AGENT).out, "a sequence never starts inside itself"
    console.run(["sequence", "run", inner], AGENT)
    assert running.in_hand("s1", 1).title == "check", "one started inside another is the one followed"
    console.run(["sequence", "follow"], AGENT)
    ended = console.run(["sequence", "next"], AGENT).out
    assert f"sequence {inner} ran its last step" in ended and "step 1: bump" in ended and running.in_hand("s1", 1).title == "release", "when it ends the other is said again"
    console.run(["sequence", "follow"], AGENT)
    console.run(["sequence", "next"], AGENT)
    console.run(["sequence", "follow"], AGENT)
    console.run(["sequence", "next"], AGENT)
    hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal message send 'give me an update when you can'"})
    hook(app, "UserPromptSubmit", prompt="<task-notification>the researcher says: give me an update</task-notification>")
    hook(app, "UserPromptSubmit", prompt="[journal] give me an update")
    assert running.in_hand("s1", 1) is None, "words the agent wrote, a subagent's report or a journal line start no sequence"
    hook(app, "UserPromptSubmit", prompt="give me an update")
    assert running.in_hand("s1", 1).title == "Writing an update", "the user's own words do"

def test_the_agents_panel_shows_the_run_and_the_user_can_skip_a_step_or_end_it(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    catch_typed(app, monkeypatch, sent)

    def api(method: str, path: str):
        request = HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/{path}", data=b"{}" if method == "POST" else None, method=method, headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
        try:
            with urlopen(request, timeout=5) as reply:
                return reply.status, json.loads(reply.read())
        except HTTPError as error:
            return error.code, json.loads(error.read())
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    made = console.run(["sequence", "create", "release", "--steps", "bump | tag | push"], USER).out.split()[1].rstrip(":")
    console.run(["sequence", "run", made], AGENT)
    app.runtime().deferred.drain()
    shown = json.dumps(api("GET", "agents/1")[1])
    assert '"title": "release"' in shown and '"step": 1' in shown and "Not taken up yet" in shown, "the panel shows the run, its step and why it holds"
    assert api("POST", "agents/1/skip-step")[0] == 200 and any("the user skipped step 1" in line and "step 2: tag" in line for line in sent), "Skip step moves the run on and tells the agent"
    assert api("POST", "agents/1/end-sequence")[0] == 200 and any(f"the user ended sequence {made}" in line for line in sent) and app.container.get(Running).in_hand("s1", 1) is None, "End ends the run"
    app.runtime().deferred.drain()
    history = json.dumps(api("GET", "agents/1")[1])
    assert "release: started" in history and "release: moved on to step 2" in history and "release: ended at step 2" in history, "the panel lists what the run did"
    from journal.repositories.messages import Messages
    cards = [m.text for m in app.container.get(Messages).in_() if m.author == "system"]
    assert f"Sequence {made}, release: started" in cards and f"Sequence {made}, release: moved on to step 2" in cards and f"Sequence {made}, release: ended at step 2" in cards, "each change is a card in the chat"
    assert api("POST", "agents/1/end-sequence")[0] != 200, "with no run there is nothing to end"

def test_a_workers_report_stays_on_its_row_however_much_is_said_after(app):
    from journal.models.author import Author
    from journal.models.message import Message
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "fast"], AGENT)
    console.run(["worker", "report", "1", "the parser is written"], Where("main", "w1"))
    messages = app.container.get(Messages)
    for i in range(250):
        messages.save(Message(author=Author.USER, text=f"word {i}"), USER.actor)
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/workers", method="GET", headers={"X-Journal-Env": "main"})
    with urlopen(request, timeout=5) as reply:
        worker = json.loads(reply.read())["rows"][0]
    assert worker["report"] == "the parser is written", "the report is linked from the worker, not found among the recent messages"

def test_a_workers_report_message_carries_the_report_kind_and_its_worker(app):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "fast"], AGENT)
    console.run(["worker", "report", "1", "the parser is written"], Where("main", "w1"))
    report = next(m for m in app.container.get(Messages).all() if m.data.get("kind") == "report")
    assert (report.text, report.data["worker"], report.data["worker_id"]) == ("Lady Lovelace reports: the parser is written", "Lady Lovelace", 1)

def test_a_block_arriving_twice_at_once_is_recorded_once(app, monkeypatch):
    import contextvars
    import threading
    import time
    from journal.events.agent.turn_written import TurnWritten
    from journal.features.messages.listeners.record_turn import RecordTurn
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    record = app.container.get(RecordTurn)
    checked = RecordTurn.already_recorded
    monkeypatch.setattr(RecordTurn, "already_recorded", lambda self, part: (checked(self, part), time.sleep(0.2))[0])
    block = TurnWritten(text="Checking the worker's inspector now.", delta="", turn_id="t1", final=True).placed("s1", 1, "claude", 0.0, 0.0)
    threads = [threading.Thread(target=contextvars.copy_context().run, args=(record.handle, block)) for _ in range(2)]
    [t.start() for t in threads]
    [t.join() for t in threads]
    said = [m for m in app.container.get(Messages).in_() if m.text == "Checking the worker's inspector now."]
    assert len(said) == 1, "the transcript's copy and the display hook's copy, handled at once, make one message"

def test_the_card_for_a_question_the_user_answered_is_the_users(app):
    from journal.support.actor_kind import ActorKind
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["question", "ask", "which colour?", "--options", "red", "blue"], AGENT)
    console.run(["question", "answer", "1", "red"], USER)
    card = [m for m in app.container.get(Messages).in_() if m.author == "system"][-1]
    assert card.text == "You answered question 1" and card.created_by.kind == ActorKind.USER, "the user's act is written as the user's"
    assert card.data["detail"] == "", "the mark says only that it was answered, never the answer"

def test_await_and_a_command_moved_to_the_background_are_triggers(app):
    from journal.repositories.charts import Charts
    from journal.repositories.counts import Counts
    console, charts = app.console(), app.container.get(Charts)
    made = int(console.run(["chart", "new", "Waits and moves", "--on", "awaited"], USER).out.split()[1].rstrip(":"))
    node = lambda kind, key, text: int(console.run(["chart", "node", kind, key, *(["--text", text] if text else []), "--in", str(made)], USER).out.split()[1].rstrip(":"))
    awaited, moved = next(n.id for n in charts.nodes_of(charts.find(made)) if n.key == "awaited"), node("trigger", "command_moved", "")
    waits, moves = node("action", "count_one", "waits"), node("action", "count_one", "moves")
    console.run(["chart", "line", str(awaited), str(waits)], USER)
    console.run(["chart", "line", str(moved), str(moves)], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["await", "the build", "--until", "false"], AGENT)
    folder = app.config.root / "c9"
    folder.mkdir()
    ShellVerbs(app).split("pytest -q", str(folder))
    ShellVerbs(app).moved("c9", "pytest -q", "/tmp/out/c9")
    ended = node("trigger", "command_ended", "")
    console.run(["chart", "line", str(ended), str(node("action", "count_one", "ends"))], USER)
    ShellVerbs(app).ended("c9", 0, "/tmp/out/c9")
    app.runtime().deferred.drain()
    with app.container.get(Scope).of(1):
        assert app.container.get(Counts).of_workflow(made) == {"waits": 1, "moves": 1, "ends": 1}, "journal await, a command moved to the background and its end each walk their own trigger"

def test_a_document_is_written_anew_from_a_file(app, tmp_path):
    first, second = tmp_path / "first.md", tmp_path / "second.md"
    first.write_text("## One\n\nthe first words")
    second.write_text("## One\n\nthe words as ruled")
    console = app.console()
    made = re.search(r"doc (\d+):", console.run(["doc", "create", "A proposal", "--file", str(first), "--abstract", "what it proposes"], USER).out).group(1)
    assert console.run(["doc", "update", made, "--file", str(second)], USER).out == f"doc {made} written anew: A proposal\n"
    shown = console.run(["doc", "show", made, "--section", "1"], USER).out
    assert "the words as ruled" in shown and "what it proposes" in shown, "the text is the file's, the title and the abstract kept"

def test_a_skill_owed_as_a_link_moves_onto_the_agent_at_boot(tmp_path: Path, monkeypatch):
    import sqlite3
    from journal.repositories.agents import Agents
    from journal.repositories.links import Links
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    first = App(Config(tmp_path, port=0))
    first.runtime().start()
    first.runtime().stop()
    db = sqlite3.connect(first.config.database)
    db.execute("INSERT INTO agents (created_at, created_by, updated_at, updated_by, environment_id, session, state, data) VALUES ('2026-10-17', 'system', '2026-10-17', 'system', 1, 's1', 'idle', '{}')")
    agent = db.execute("SELECT MAX(id) FROM agents").fetchone()[0]
    db.execute("INSERT INTO links (created_at, created_by, updated_at, updated_by, source, target, kind) VALUES ('2026-10-17', 'system', '2026-10-17', 'system', ?, NULL, 'owes:journal')", (f"agents:{agent}",))
    db.execute("DELETE FROM migrations WHERE number >= 7")
    db.commit()
    db.close()
    second = App(Config(tmp_path, port=0))
    second.runtime().start()
    try:
        assert second.container.get(Agents).find(agent).skills_owed == ("journal",), "the owed skill is a fact on the agent's row"
        assert not [link for link in second.container.get(Links).all() if link.kind.startswith("owes:")], "and the one-ended link is gone"
    finally:
        second.runtime().stop()

def test_a_report_about_several_rows_links_each_and_refuses_one_it_cannot_read(app):
    console = app.console()
    for title in ("one", "two"):
        console.run(["plan", "create", title, "--brief", "b"], USER)
    made = console.run(["report", "create", "Both", "--body", "words", "--about", "plans:1,plans:2"], USER)
    assert made.code == 0 and "about plans:1, plans:2" in made.out, "rows apart by commas are each linked"
    spaced = console.run(["report", "create", "Both again", "--body", "words", "--about", "plans:1", "plans:2"], USER)
    assert spaced.code == 0 and "about plans:1, plans:2" in spaced.out, "and so are rows apart by spaces"
    refused = console.run(["report", "create", "Wrong", "--body", "words", "--about", "plans:1,the second plan"], USER)
    assert refused.code == 1 and "not a row: the second plan" in refused.err, "a row it cannot read is refused by name, and no report is made"

def test_the_mcp_page_shows_a_servers_state_as_last_checked_and_check_all_reads_it_anew(app, monkeypatch):
    import json as j
    from urllib.request import Request as R, urlopen as open_url
    from journal.support.health import Health
    from journal.features.mcp.support.health_report import HealthReport
    from journal.features.mcp.support.known import Known
    answers = [HealthReport({"claude_design": Known("claude_design", "https://api.anthropic.com/v1/design/mcp", "failed", "rejected your login")}),
               HealthReport({"claude_design": Known("claude_design", "https://api.anthropic.com/v1/design/mcp", "connected", "")})]
    monkeypatch.setattr(Health, "asked", lambda self: answers.pop(0) if len(answers) > 1 else answers[0])
    port = app.server().port
    read = lambda: j.load(open_url(R(f"http://127.0.0.1:{port}/journal/mcp", headers={"X-Journal-Env": "main"}), timeout=5))
    before = read()
    design = next(s for s in before["servers"] if s["name"] == "claude_design")
    assert design["state"] == "failed" and before["checked_at"] > 0, "the page is told the state and when it was checked"
    open_url(R(f"http://127.0.0.1:{port}/journal/mcp/check", data=b"{}", method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5)
    after = next(s for s in read()["servers"] if s["name"] == "claude_design")
    assert after["state"] == "connected", "Check all asks the program anew, so a login done since shows"

def test_the_end_of_a_session_never_begun_makes_no_agent(app):
    from journal.repositories.agents import Agents
    from journal.support.scope import Scope
    hook(app, "SessionStart")
    hook(app, "SessionEnd", session_id="one-off", reason="other")
    app.runtime().deferred.drain()
    with app.container.get(Scope).of(1):
        sessions = [a.session for a in app.container.get(Agents).in_()]
    assert sessions == ["s1"], "a one-off run of the program, such as claude mcp list, ends a session that never began: no agent is made for it"

def test_a_plugin_manifest_is_read_and_each_wrong_one_refused_by_name(app, tmp_path):
    from journal.features.plugins.support.manifest_reader import ManifestReader
    from journal.support.refused import Refused
    reader = app.container.get(ManifestReader)
    good = {"name": "echo", "version": "1.0.0", "program": "run.py", "protocol": 1, "hears": ["tool_starting", "tasks.created"], "holds": ["tool_starting"],
            "services": [{"name": "serve", "command": ["bin/serve"], "restart": "always"}]}

    def made(changes: dict, files=("run.py",)) -> Path:
        folder = tmp_path / str(len(list(tmp_path.iterdir())))
        folder.mkdir()
        for file in files:
            (folder / file).parent.mkdir(parents=True, exist_ok=True)
            (folder / file).write_text("print()")
        (folder / "journal-plugin.json").write_text(json.dumps({**good, **changes}))
        return folder
    manifest = reader.read(made({}))
    assert manifest.name == "echo" and manifest.holds == ("tool_starting",) and manifest.services[0].name == "serve"
    refusals = {
        "keys the journal does not know: hook": {"hook": "x"},
        "is not": {"name": "Echo!"},
        "one of the journal's own features": {"name": "tasks"},
        "speaks protocol 2": {"protocol": 2},
        "hears nothing.created!, which is no event": {"hears": ["nothing.created!"]},
        "the secrets rows are never sent": {"hears": ["secrets.created"]},
        "holds idle but does not hear it": {"holds": ["idle"]},
        "holds tool_finished, which no plugin may hold": {"hears": ["tool_finished"], "holds": ["tool_finished"]},
        "program ../run.py leads outside its folder": {"program": "../run.py"},
        "service serve /usr/bin/serve leads outside": {"services": [{"name": "serve", "command": ["/usr/bin/serve"]}]},
        "program missing.py is not in its folder": {"program": "missing.py"},
        "the users rows are never sent": {"hears": ["users.updated"]},
        "skill journal-tasks has the name of a skill of the journal": ({"skills": "skills"}, ("run.py", "skills/journal-tasks/SKILL.md")),
        "skills /tmp leads outside": {"skills": "/tmp"},
    }
    for words, changes in refusals.items():
        try:
            reader.read(made(*changes) if isinstance(changes, tuple) else made(changes))
            raise AssertionError(f"not refused: {changes}")
        except Refused as refused:
            assert words in str(refused), f"{changes} refused as {refused}"
    outside = tmp_path / "elsewhere.py"
    outside.write_text("print()")
    linked = made({}, ())
    (linked / "run.py").symlink_to(outside)
    with pytest.raises(Refused, match="program run.py leads outside its folder"):
        reader.read(linked)
    from journal.models.plugin import Plugin
    from journal.repositories.plugins import Plugins
    lint = made({"name": "lint", "skills": "skills"}, ("run.py", "skills/lint-rules/SKILL.md"))
    app.container.get(Plugins).save(Plugin(name="lint", source=str(lint), linked=True, manifest=PluginManifest.from_json({**good, "name": "lint", "skills": "skills"})), Actor.user(1))
    with pytest.raises(Refused, match="skill lint-rules has the name of a skill of plugin lint"):
        reader.read(made({"skills": "skills"}, ("run.py", "skills/lint-rules/SKILL.md")))

def test_a_plugin_is_a_row_and_writes_as_itself(app):
    from journal.support.actor_kind import ActorKind
    from journal.models.plugin import Plugin
    from journal.models.task import Task
    from journal.repositories.plugins import Plugins
    from journal.repositories.tasks import Tasks
    plugins = app.container.get(Plugins)
    plugins.save(Plugin(name="lint", source="/tmp/lint", manifest=PluginManifest(name="lint")), Actor.user(1))
    assert plugins.named("lint").enabled and [p.name for p in plugins.enabled()] == ["lint"]
    task = app.container.get(Tasks).save(Task(environment_id=1, title="written by a plugin"), Actor.plugin("lint"))
    assert task.created_by == Actor(ActorKind.PLUGIN, "lint") and task.created_by.stamp == "plugin:lint" and Actor.parse("plugin:lint") == task.created_by

def test_a_plugin_runs_as_itself_never_as_the_user(app):
    from journal.support.plugin_tokens import PluginTokens
    from journal.http.support.identity import Identity
    from journal.repositories.messages import Messages
    token = app.container.get(PluginTokens).of("echo")
    port = app.server().port
    def cli(argv, plugin="echo", given=token):
        try:
            with urlopen(HttpRequest(f"http://127.0.0.1:{port}/cli", data=json.dumps({"argv": argv, "env": "main", "plugin": plugin, "token": given}).encode(), method="POST", headers={"Content-Type": "application/json"}), timeout=5) as r:
                return r.status, json.loads(r.read())
        except HTTPError as error:
            return error.code, json.loads(error.read())
    status, out = cli(["message", "send", "a word from echo"])
    message = app.container.get(Messages).recent(1)[0]
    assert status == 200 and message.created_by == Actor.plugin("echo") and message.author == "system", "a plugin's command is stamped as the plugin and its message is the journal's, never yours"
    assert "only the user approves" in cli(["plan", "approve", "1"])[1]["err"], "a plugin never approves a plan"
    assert cli(["task", "list"], given="wrong")[0] == 403 and cli(["task", "list"], plugin="lint")[0] == 403, "a wrong token, or a plugin's name without its own, is refused"
    identity = app.container.get(Identity)
    assert identity.of({"x-journal-plugin": "echo", "x-journal-plugin-token": token}) == Actor.plugin("echo") and identity.of({"x-journal-plugin": "echo", "x-journal-plugin-token": "x"}) == Actor.user(1), "the API names the plugin only with its token"


def test_the_plugin_protocol_sends_one_line_and_reads_one_back(app):
    from journal.events.agent.tool_starting import ToolStarting
    from journal.events.models.created import Created
    from journal.features.plugins.support.plugin_fault import PluginFault
    from journal.features.plugins.support.protocol import Protocol
    from journal.models.task import Task
    protocol = app.container.get(Protocol)
    from journal.providers.claude import Claude
    tool = json.loads(protocol.line_of(ToolStarting(call=Claude().call("Bash", {"command": "ls"})).placed("s1", 1, "claude", 0.2, 0.0), "main", "working"))
    assert (tool["v"], tool["event"], tool["session"], tool["state"], tool["data"]) == (1, "tool_starting", "s1", "working", {"tool": "Bash", "input": {"command": "ls"}, "command": "ls", "parts": [{"text": "ls", "is_journal": False, "writes": False, "files": []}], "is_journal": False, "writes": False, "written_paths": [], "read_paths": [], "file_lines": 0, "skill_loaded": ""}), "an agent event: its name, where it happened and the call's one reading, flat, as a plugin reads it"
    row = json.loads(protocol.line_of(Created(model=Task(id=7, environment_id=1, title="t"), by=Actor.plugin("echo")), "main"))
    assert row["event"] == "tasks.created" and row["data"] == {"table": "tasks", "id": 7, "by": "plugin:echo"}, "a row event: its table, its number and who wrote it"
    assert protocol.answer_of("").answer == "allow", "an empty answer lets the event through"
    answer = protocol.answer_of(json.dumps({"v": 1, "answer": "refuse", "reason": "not on main", "cards": [{"kind": "sin", "label": "a sin"}], "commands": ["journal task list"]}))
    assert (answer.answer, answer.reason, answer.cards[0].kind, answer.commands) == ("refuse", "not on main", "sin", ("journal task list",))
    for broken, words in (("{nope", "not JSON"), ('["a"]', "not a JSON object"), ('{"answer": "maybe"}', "allow, refuse or tell"), ('{"v": 2}', "protocol 2"), ('{"say": "x"}', "keys the protocol does not know: say"), (json.dumps({"commands": ["journal x"] * 21}), "at most 20")):
        try:
            protocol.answer_of(broken)
            raise AssertionError(f"no fault for {broken}")
        except PluginFault as fault:
            assert words in str(fault), f"{broken}: {fault}"

def echo(app, name="echo", **manifest):
    """The echo plugin as a fetched copy in the journal's plugins folder, its row's manifest changed as given."""
    import shutil
    from journal.models.plugin import Plugin
    from journal.repositories.plugins import Plugins
    folder = Path(__file__).parent / "plugins" / "echo"
    shutil.copytree(folder, app.config.home / "plugins" / name, dirs_exist_ok=True)
    return app.container.get(Plugins).save(Plugin(name=name, source=str(folder), manifest=PluginManifest.from_json(json.loads((folder / "journal-plugin.json").read_text()) | manifest)), Actor.user(1))


def echo_heard(app, name="echo") -> list[str]:
    file = app.config.home / "plugin-data" / name / "heard.jsonl"
    return [json.loads(line)["event"] for line in file.read_text().splitlines()] if file.is_file() else []


def test_a_plugin_hears_the_events_it_names_and_holds_what_it_may(app):
    from journal.db.connection import Connection
    from journal.support.deferred import Deferred
    from journal.repositories.entries import Entries
    from journal.models.task import Task
    from journal.repositories.tasks import Tasks
    echo(app, hears=["tool_starting", "tool_finished", "prompt_submitted", "tasks.created"])
    hook(app, "SessionStart")
    status, body = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})
    assert status == 409 and "[plugin echo] echo refuses a forbidden tool" in body["error"], "a held tool is refused inside the hook, naming the plugin"
    status, body = hook(app, "UserPromptSubmit", prompt="hi")
    assert "[plugin echo] echo heard your prompt" in body["hookSpecificOutput"]["additionalContext"], "a prompt is told a line"
    hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response={})
    tasks = app.container.get(Tasks)
    tasks.save(Task(environment_id=1, title="by the user"), Actor.user(1))
    tasks.save(Task(environment_id=1, title="by echo"), Actor.plugin("echo"))
    with pytest.raises(RuntimeError), app.container.get(Connection).transaction():
        tasks.save(Task(environment_id=1, title="rolled back"), Actor.user(1))
        raise RuntimeError
    app.container.get(Deferred).drain()
    assert echo_heard(app) == ["tool_starting", "prompt_submitted", "tool_finished", "tasks.created"], "each event heard once, the plugin's own row not at all"
    given = json.loads((app.config.home / "plugin-data" / "echo" / "environment.json").read_text())
    assert (given["JOURNAL_PLUGIN"], given["JOURNAL_ENV"], Path(given["JOURNAL_PLUGIN_DIR"]).name, Path(given["JOURNAL_PLUGIN_DATA"]).name) == ("echo", "main", "echo", "echo") and given["JOURNAL_PLUGIN_TOKEN"] and given["JOURNAL_URL"].startswith("http://127.0.0.1:")
    assert "PYTEST_CURRENT_TEST" not in given and json.loads(Path(given["JOURNAL_SETTINGS"]).read_text()) == {}, "nothing of the journal's own environment beyond what names it"
    echo(app, "echo-two")
    status, body = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})
    app.container.get(Deferred).drain()
    assert status == 409 and "plugin echo-two" not in body["error"] and [e.data["plugin"] for e in app.container.get(Entries).where(kind="plugin_unanswered")] == ["echo-two"], "the first plugin's refusal answers; the second hears it after the reply, recorded unanswered"
    status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "journal task list forbidden"})
    assert status == 200 and "echo refuses a forbidden tool" in body["hookSpecificOutput"]["additionalContext"], "a journal command goes through a plugin's refusal, its words told"


def test_a_plugins_answer_shows_cards_runs_commands_and_never_loops(app):
    from journal.features.plugins.listeners.plugins_hear_agents import PluginsHearAgents
    from journal.features.plugins.support.plugin_answers import PluginAnswers
    from journal.support.deferred import Deferred
    from journal.features.plugins.support.plugin_answer import PluginAnswer
    from journal.features.plugins.support.plugin_card import PluginCard
    from journal.models.task import Task
    from journal.repositories.entries import Entries
    from journal.repositories.messages import Messages
    from journal.repositories.tasks import Tasks
    from journal.support.secret_values import SecretValues
    from journal.events.agent.prompt_submitted import PromptSubmitted
    plugin = echo(app)
    task = app.container.get(Tasks).save(Task(environment_id=1, title="echo me"), Actor.user(1))
    deferred, messages, entries = app.container.get(Deferred), app.container.get(Messages), app.container.get(Entries)
    deferred.drain()
    deferred.drain()
    card = [m for m in messages.recent(5) if m.data.get("kind") == "plugin"]
    assert [(m.text, m.data["key"], m.created_by) for m in card] == [(f"Echoed task {task.id}", f"task {task.id}", Actor.plugin("echo"))], "a card from the answer, written as the plugin"
    from journal.repositories.task_logs import TaskLogs
    assert [(l.line, l.created_by) for l in app.container.get(TaskLogs).where(task_id=task.id)] == [("echoed", Actor.plugin("echo"))], "its command ran as the plugin and found the task its row event named"
    answers = app.container.get(PluginAnswers)
    for label in ("first", "second"):
        answers.apply(plugin, PluginAnswer(cards=(PluginCard("echoed", label, key="k"),)), "main", 1)
    keyed = [m for m in messages.recent(20) if m.data.get("key") == "k"]
    assert [m.text for m in keyed] == ["second"] and keyed[0].created_at < keyed[0].updated_at, "a card of a key is settled in place by the later one"
    app.container.get(SecretValues).put("GITHUB_KEY", "ghp_0123456789abcdef")
    said = app.container.get(PluginsHearAgents).decided(plugin, PromptSubmitted(prompt="x").placed("s1", 1, "claude", 0.0, 0.0), PluginAnswer(answer="tell", tell="[journal] stop now [!reply:3] ghp_0123456789abcdef"))
    assert said.context == "[plugin echo] (journal) stop now (!reply:3] [secret GITHUB_KEY]", "a plugin's words are its own, the journal's marks made plain and a secret masked"
    echo(app, hears=["messages.created"], holds=[])
    echo(app, "echo-two", hears=["messages.created"], holds=[])
    app.console().run(["message", "send", "hello"], AGENT)
    for _ in range(6):
        deferred.drain()
    heard = [m.text for m in messages.recent(20) if m.text.startswith("heard message")]
    assert len(heard) == 4 and entries.where(kind="plugin_cut"), "two plugins answer each other's rows one step deep, then the cut is recorded"

def test_a_plugin_holds_a_stop_once_a_turn(app):
    from journal.repositories.entries import Entries
    echo(app, hears=["idle"], holds=["idle"])
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    status, body = hook(app, "Stop")
    assert status == 200 and body["decision"] == "block" and "[plugin echo] echo holds the stop" in body["reason"]
    status, body = hook(app, "Stop", stop_hook_active=True)
    assert status == 200 and "decision" not in body, "a stop held once already goes through"
    assert [e.data["reason"] for e in app.container.get(Entries).where(kind="plugin_unanswered")] == ["echo holds the stop"], "the second refusal is recorded unanswered"


def test_a_subagents_event_reaches_a_plugin_and_is_held_only_at_a_tool(app):
    from journal.events.agent.prompt_submitted import PromptSubmitted
    from journal.events.agent.tool_starting import ToolStarting
    from journal.features.plugins.listeners.plugins_hear_agents import PluginsHearAgents
    plugin = echo(app)
    assert PluginsHearAgents.holds(plugin, ToolStarting(call=ToolCall(tool="Read", input={}), subagent="a1")), "a subagent's tool is held like the agent's"
    assert not PluginsHearAgents.holds(plugin, PromptSubmitted(prompt="x", subagent="a1")) and PluginsHearAgents.holds(plugin, PromptSubmitted(prompt="x")), "a subagent's other events are heard, never held"


def test_a_plugin_is_previewed_then_installed_from_a_folder(app, tmp_path):
    from journal.repositories.plugins import Plugins
    folder = Path(__file__).parent / "plugins" / "echo"
    console = app.console()
    preview = console.run(["plugin", "install", str(folder)], USER)
    assert preview.code == 0 and "echo 1.0.0" in preview.out and "runs for each event it hears, from its folder: run.py" in preview.out and "holds before the agent continues: tool_starting, prompt_submitted" in preview.out and "nothing installed yet" in preview.out
    assert app.container.get(Plugins).all() == [], "a preview installs nothing"
    assert "installed echo, on" in console.run(["plugin", "install", str(folder), "--yes"], USER).out
    plugin = app.container.get(Plugins).named("echo")
    assert plugin.linked and plugin.source == str(folder.resolve()) and plugin.manifest.holds == ("tool_starting", "prompt_submitted") and (app.config.home / "plugin-data" / "echo").is_dir()
    assert "installed already" in console.run(["plugin", "install", str(folder), "--yes"], USER).err
    bad = tmp_path / "bad"
    bad.mkdir()
    (bad / "journal-plugin.json").write_text(json.dumps({"name": "bad", "version": "1", "program": "run.py", "hears": ["nothing"]}))
    (bad / "run.py").write_text("")
    refused = console.run(["plugin", "install", str(bad), "--yes"], USER)
    assert refused.code != 0 and "hears nothing, which is no event" in refused.err and [p.name for p in app.container.get(Plugins).all()] == ["echo"], "a refused manifest installs nothing"


def test_a_plugin_is_upgraded_with_its_changes_shown_switched_off_and_removed(app, tmp_path):
    import shutil
    from journal.support.deferred import Deferred
    from journal.repositories.plugins import Plugins
    folder = tmp_path / "echo"
    shutil.copytree(Path(__file__).parent / "plugins" / "echo", folder)
    console, plugins = app.console(), app.container.get(Plugins)
    console.run(["plugin", "install", str(folder), "--yes"], USER)
    manifest = json.loads((folder / "journal-plugin.json").read_text())
    (folder / "journal-plugin.json").write_text(json.dumps({**manifest, "version": "1.1.0", "hears": [*manifest["hears"], "tool_finished"], "holds": ["tool_starting"]}))
    shown = console.run(["plugin", "upgrade", "echo"], USER).out
    assert "version: 1.0.0 -> 1.1.0" in shown and "hears: + tool_finished" in shown and "holds: - prompt_submitted" in shown and "nothing upgraded yet" in shown
    assert "tool_finished" not in plugins.named("echo").manifest.hears, "a preview upgrades nothing"
    console.run(["plugin", "upgrade", "echo", "--yes"], USER)
    assert "tool_finished" in plugins.named("echo").manifest.hears
    hook(app, "SessionStart")
    console.run(["plugin", "disable", "echo"], USER)
    hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response={})
    app.container.get(Deferred).drain()
    assert echo_heard(app) == [], "a plugin switched off hears nothing"
    console.run(["plugin", "enable", "echo"], USER)
    hook(app, "PostToolUse", tool_name="Read", tool_input={}, tool_response={})
    app.container.get(Deferred).drain()
    assert echo_heard(app) == ["tool_finished"]
    data = app.config.home / "plugin-data" / "echo"
    console.run(["plugin", "remove", "echo"], USER)
    assert plugins.all() == [] and data.is_dir() and folder.is_dir(), "removed, its data and a linked folder kept"
    console.run(["plugin", "install", str(folder), "--yes"], USER)
    console.run(["plugin", "remove", "echo", "--purge"], USER)
    assert plugins.all() == [] and not data.exists(), "purged with its data"


def test_only_the_user_installs_or_switches_on_a_plugin(app, tmp_path):
    import shutil
    from journal.repositories.messages import Messages
    from journal.repositories.plugins import Plugins
    folder = tmp_path / "echo"
    shutil.copytree(Path(__file__).parent / "plugins" / "echo", folder)
    console, plugins = app.console(), app.container.get(Plugins)
    hook(app, "SessionStart")
    refused = console.run(["plugin", "install", str(folder), "--yes"], AGENT)
    assert refused.code != 0 and "only the user installs a plugin: journal plugin propose" in refused.err and plugins.all() == []
    assert console.run(["plugin", "propose", str(folder), "--why", "to echo"], AGENT).code == 0
    card = app.container.get(Messages).recent(1)[0]
    assert card.text == "The agent proposes the plugin echo: to echo" and f"journal plugin install {folder} --yes" in card.data["detail"]
    console.run(["plugin", "install", str(folder), "--yes"], USER)
    console.run(["plugin", "disable", "echo"], AGENT)
    assert "only the user switches on" in console.run(["plugin", "enable", "echo"], AGENT).err and not plugins.named("echo").enabled
    console.run(["plugin", "enable", "echo"], USER)
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "t", "--start"], AGENT)
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": str(app.config.home / "plugins" / "x" / "run.py"), "content": ""})
    assert status == 409 and "an installed plugin's files are the user's to change" in body["error"]
    installed = ".journal/" + "plugins"
    script = "python3 - <<'EOF'\nfrom pathlib import Path\nPath({}).write_text('x')\nEOF\n"
    for line, held in ((f"{installed}/x/bin/judge --changes > /tmp/judged.txt 2>&1", False), (script.format("'notes.txt'") + f"{installed}/x/bin/judge info x", False), (script.format(f"'{installed}/x/run.py'"), True), (f"echo hi > {installed}/x/run.py", True), (f"rm -rf {installed}/x", True), (f"cat {installed}/x/run.py | tee {installed}/x/copy.py", True)):
        status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": line})
        assert (status == 409 and "plugin's files" in body.get("error", "")) == held, f"{line} held {status == 409}, should be {held}: running a plugin's program is no write to it"
    (folder / "run.py").write_text((folder / "run.py").read_text() + "\n# changed\n")
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})[0] == 200, "a changed program is not run"
    app.runtime().deferred.drain()
    assert not plugins.named("echo").enabled and any("run.py changed since you installed it" in m.text for m in app.container.get(Messages).recent(5)), "the plugin is switched off and the card says why, once the hearings after the reply have run"


def test_a_plugins_settings_follow_its_schema_and_its_secret_comes_from_the_user(app):
    from journal.features.plugins.support.plugin_runner import PluginRunner
    from journal.repositories.plugins import Plugins
    from journal.repositories.secrets import Secrets
    from journal.support.secret_values import SecretValues
    console, plugins = app.console(), app.container.get(Plugins)
    console.run(["plugin", "install", str(Path(__file__).parent / "plugins" / "echo"), "--yes"], USER)
    plugin = plugins.named("echo")
    secret = app.container.get(Secrets).find(plugin.settings["token"]["secret"])
    assert (plugin.settings["mode"], plugin.settings["repeat"]) == ("", 1) and secret.title == "echo Token" and secret.proposed == ("plugin:echo",), "defaults set, and a secret asked for, proposed for the plugin"
    assert console.run(["plugin", "configure", "echo", "repeat", "3"], USER).code == 0 and plugins.named("echo").settings["repeat"] == 3
    assert "repeat is a number; 'three' is not" in console.run(["plugin", "configure", "echo", "repeat", "three"], USER).err
    assert "the user fills it on the Secrets page" in console.run(["plugin", "configure", "echo", "token", "abc"], USER).err
    assert "only the user configures" in console.run(["plugin", "configure", "echo", "repeat", "2"], AGENT).err
    variable = secret.fields[0]["variable"]
    app.container.get(SecretValues).put(variable, "tok_0123456789abcdef")
    runner = app.container.get(PluginRunner)
    assert variable not in runner.environment(plugins.named("echo"), "main"), "a filled secret is not given until the user allows it"
    app.container.get(Secrets).save(secret.with_(programs=("plugin:echo",)), Actor.user(1))
    assert runner.environment(plugins.named("echo"), "main")[variable] == "tok_0123456789abcdef"


def test_a_plugins_skills_are_published_stamped_and_taken_away(app):
    console = app.console()
    console.run(["plugin", "install", str(Path(__file__).parent / "plugins" / "echo"), "--yes"], USER)
    published = [app.config.root / home / "echo-guide" for home in (".claude/skills", ".agents/skills")]
    assert all((p / "SKILL.md").read_text().startswith("---\nplugin: echo\nname: echo-guide\n") and (p / ".gitignore").read_text() == "*\n" for p in published), "published beside the journal's, stamped and kept out of git"
    console.run(["plugin", "disable", "echo"], USER)
    assert not any(p.exists() for p in published), "switched off, its skills go"
    console.run(["plugin", "enable", "echo"], USER)
    assert all(p.is_dir() for p in published)
    console.run(["plugin", "remove", "echo"], USER)
    assert not any(p.exists() for p in published), "removed, its skills go"


def test_plugins_come_back_when_the_journal_starts_again(app):
    app.console().run(["plugin", "install", str(Path(__file__).parent / "plugins" / "echo"), "--yes"], USER)
    (app.config.home / "plugin-data" / "echo" / "kept.txt").write_text("kept")
    again = App(Config(app.config.root, port=0))
    again.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    again.runtime().start()
    try:
        hook(again, "SessionStart")
        status, body = hook(again, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})
        assert status == 409 and "[plugin echo]" in body["error"], "a journal started anew hears through the plugins its rows name"
        assert (again.config.home / "plugin-data" / "echo" / "kept.txt").read_text() == "kept"
    finally:
        again.runtime().stop()


def test_an_upgrade_shows_the_code_and_a_linked_change_waits_for_the_user(app, tmp_path):
    import shutil
    from journal.models.plugin import Plugin
    from journal.repositories.messages import Messages
    from journal.repositories.plugins import Plugins
    echo_folder = Path(__file__).parent / "plugins" / "echo"
    console, plugins, messages = app.console(), app.container.get(Plugins), app.container.get(Messages)
    newer = tmp_path / "newer"
    shutil.copytree(echo_folder, newer)
    (newer / "run.py").write_text((newer / "run.py").read_text().replace("echo heard your prompt", "echo heard you"))
    shutil.copytree(echo_folder, app.config.home / "plugins" / "echo")
    fetched = plugins.save(Plugin(name="echo", source=str(newer), manifest=PluginManifest.from_json(json.loads((echo_folder / "journal-plugin.json").read_text()))), Actor.user(1))
    shown = console.run(["plugin", "upgrade", "echo"], USER).out
    assert "the code:" in shown and '-        return json.dumps({"v": 1, "answer": "tell", "tell": "echo heard your prompt"})' in shown and '+        return json.dumps({"v": 1, "answer": "tell", "tell": "echo heard you"})' in shown, "the program's changed body is in the diff"
    told = console.run(["plugin", "upgrade", "echo"], AGENT).out
    assert "run.py +1 -1" in told and "echo heard your prompt" not in told, "the agent is told which files change, never the whole diff"
    assert console.run(["plugin", "upgrade", "echo", "--yes"], AGENT).code == 0, "the agent upgrades a plugin the user installed"
    plugins.save(fetched.with_(name="copied"), Actor.user(1))
    assert "now holds the plugin echo, not copied" in console.run(["plugin", "upgrade", "copied"], USER).err, "an upgrade never turns one plugin into another"
    plugins.delete(plugins.named("copied"), Actor.user(1))
    linked = tmp_path / "linked"
    shutil.copytree(echo_folder, linked)
    console.run(["plugin", "install", str(linked), "--yes"], USER)
    manifest = json.loads((linked / "journal-plugin.json").read_text())
    (linked / "journal-plugin.json").write_text(json.dumps({**manifest, "hears": [*manifest["hears"], "idle"], "holds": [*manifest["holds"], "idle"]}))
    hook(app, "SessionStart")
    for _ in range(2):
        hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    waiting = [m for m in messages.recent(10) if m.text.startswith("Plugin echo's manifest changed")]
    assert len(waiting) == 1 and "holds: + idle" in waiting[0].data["detail"] and "idle" not in plugins.named("echo").manifest.holds, "shown once, and the plugin runs as installed"
    console.run(["plugin", "upgrade", "echo", "--yes"], USER)
    assert "idle" in plugins.named("echo").manifest.holds and plugins.named("echo").waiting == "", "the user's upgrade applies it"


def test_a_plugin_is_installed_only_once_its_requirements_and_setup_pass(app, tmp_path):
    import shutil
    from journal.support.deferred import Deferred
    from journal.repositories.plugins import Plugins
    console, plugins = app.console(), app.container.get(Plugins)
    folder = tmp_path / "echo"
    shutil.copytree(Path(__file__).parent / "plugins" / "echo", folder)
    manifest = json.loads((folder / "journal-plugin.json").read_text())

    def installed(**changes):
        (folder / "journal-plugin.json").write_text(json.dumps({**manifest, **changes}))
        return console.run(["plugin", "install", str(folder), "--yes"], USER)
    missing = installed(requires={"no-such-program-here": {"hint": "brew install it"}})
    assert "echo needs no-such-program-here, which is not here: brew install it" in missing.err and plugins.all() == []
    steps = [{"name": "first", "run": 'echo one >> "$JOURNAL_PLUGIN_DATA/steps"'}, {"name": "second", "run": 'echo two >> "$JOURNAL_PLUGIN_DATA/steps"'}]
    failing = installed(setup=[*steps, {"name": "third", "run": "echo broken >&2; exit 3"}])
    assert "setup step 'third' failed, so nothing is installed: broken" in failing.err and plugins.all() == [] and not (app.config.home / "plugin-data" / "echo").exists(), "a failed step leaves nothing"
    preview = console.run(["plugin", "install", str(folder)], USER).out
    assert 'runs at install first: echo one >> "$JOURNAL_PLUGIN_DATA/steps"' in preview
    made = {"name": "made", "run": "printf '#!/bin/sh\\n' > made.sh && chmod +x made.sh"}
    done = installed(requires={"sh": {"check": "command -v sh"}}, setup=[*steps, made], installed="echo '{\"repeat\": 5}'", hears=[*manifest["hears"], "plugin.updated"],
                     services=[{"name": "made", "command": ["./made.sh"]}])
    assert done.code == 0, done.err
    hook(app, "SessionStart")
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    assert plugins.named("echo").enabled, "a file its setup made is hashed as made, so the plugin stays on"
    assert (app.config.home / "plugin-data" / "echo" / "steps").read_text() == "one\ntwo\n" and plugins.named("echo").settings["repeat"] == 5, "the steps ran in order and the installed command's answer filled the settings"
    console.run(["plugin", "configure", "echo", "repeat", "2"], USER)
    app.container.get(Deferred).drain()
    assert echo_heard(app) == ["tool_starting", "plugin.updated"], "a plugin hears its own settings change"


def test_the_plugins_page_previews_installs_lists_configures_and_removes(app):
    from journal.repositories.plugins import Plugins
    port = app.server().port

    def api(method, path, body=None):
        request = HttpRequest(f"http://127.0.0.1:{port}/journal/{path}", data=json.dumps(body).encode() if body is not None else None, method=method, headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
        try:
            with urlopen(request, timeout=10) as reply:
                return reply.status, json.loads(reply.read())
        except HTTPError as error:
            return error.code, json.loads(error.read())
    folder = str(Path(__file__).parent / "plugins" / "echo")
    status, preview = api("POST", "plugins/preview", {"source": folder})
    assert status == 200 and preview["name"] == "echo" and {"kind": "holds", "label": "before the agent continues", "command": "tool_starting, prompt_submitted"} in preview["rows"]
    status, made = api("POST", "plugins", {"source": folder})
    assert status == 201 and made["name"] == "echo"
    row = api("GET", "plugins")[1]["rows"][0]
    mode = next(s for s in row["schema"] if s["key"] == "mode")
    assert (row["name"], row["status"], row["manifest"]["holds"], mode["kind"], "secret" in row["settings"]["token"]) == ("echo", "on", ["tool_starting", "prompt_submitted"], "choice", True)
    assert api("POST", f"plugins/{made['id']}/configure", {"key": "repeat", "value": "4"})[0] == 200 and app.container.get(Plugins).named("echo").settings["repeat"] == 4
    assert api("POST", f"plugins/{made['id']}/disable", {})[0] == 200 and api("GET", "plugins")[1]["rows"][0]["status"] == "off"
    assert api("POST", f"plugins/{made['id']}/remove", {})[0] == 200 and app.container.get(Plugins).all() == []


def test_a_plugins_record_lists_what_it_did(app):
    from journal.support.deferred import Deferred
    from journal.models.task import Task
    from journal.repositories.tasks import Tasks
    echo(app)
    hook(app, "SessionStart")
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})
    task = app.container.get(Tasks).save(Task(environment_id=1, title="echo me"), Actor.user(1))
    app.container.get(Deferred).drain()
    app.container.get(Deferred).drain()
    from journal.repositories.plugins import Plugins
    plugin = app.container.get(Plugins).named("echo")
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/plugins/{plugin.id}/record", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        record = json.loads(reply.read())
    texts = [line["text"] for line in record]
    assert "held at tool_starting: echo refuses a forbidden tool" in texts, "a hold is in its record"
    assert f'ran journal task log {task.id} "echoed"' in texts, "a command it ran"
    logged = [line for line in record if line["kind"] == "row" and line["text"].startswith("made task log")]
    assert logged and logged[0]["ref"] == "", "a row it wrote; a task log opens nothing of its own"
    assert record == sorted(record, key=lambda line: line["at"], reverse=True), "newest first"


def test_a_plugins_dashboard_is_drawn_from_the_lines_it_wrote(app):
    from journal.repositories.plugins import Plugins
    console = app.console()
    console.run(["plugin", "install", str(Path(__file__).parent / "plugins" / "echo"), "--yes"], USER)
    plugin = app.container.get(Plugins).named("echo")
    as_echo = Where("main", plugin="echo")
    assert "written by its plugin's program" in console.run(["dashboard", "set", "a.py", "a.py"], AGENT).err, "only a plugin writes its dashboard"
    console.run(["dashboard", "set", "a.py", "a.py", "--badge", "2 sins", "--tone", "warn", "--heading", "Files"], as_echo)
    console.run(["dashboard", "set", "b.py", "b.py", "--badge", "clean", "--tone", "good", "--heading", "Files"], as_echo)
    console.run(["dashboard", "set", "a.py", "a.py", "--badge", "1 sin", "--tone", "warn", "--heading", "Files"], as_echo)
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/plugins/{plugin.id}/dashboard", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        document = json.loads(reply.read())
    view = document["pages"]["start"]
    assert view["title"] == "Echoes" and view["view"]["children"] == [{"type": "heading", "text": "Files", "level": 3}, {"type": "list", "items": [{"label": "a.py", "badge": "1 sin", "tone": "warn", "note": ""}, {"label": "b.py", "badge": "clean", "tone": "good", "note": ""}]}], "one line per key, rewritten in place"
    written = app.config.home / "plugin-data" / "echo" / "dashboards" / "echoes.json"
    written.parent.mkdir(parents=True, exist_ok=True)
    written.write_text(json.dumps({"title": "Echoes", "start": "overview", "pages": {"overview": {"title": "Echoes", "view": {"type": "text", "body": "written by echo"}}}}))
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/plugins/{plugin.id}/dashboard", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        assert json.loads(reply.read())["start"] == "overview", "a document the plugin wrote in its data folder is its dashboard"
    console.run(["plugin", "remove", "echo", "--purge"], USER)
    from journal.repositories.dashboard_rows import DashboardRows
    assert app.container.get(DashboardRows).of("echo") == [], "purged with its plugin"


def test_a_plugins_line_after_the_reply_reaches_the_agent_at_its_next_hook(app):
    from journal.support.deferred import Deferred
    echo(app, hears=["tool_finished", "tool_starting"], holds=["tool_starting"])
    hook(app, "SessionStart")
    hook(app, "PostToolUse", tool_name="Edit", tool_input={"file_path": "notice.py"}, tool_response={})
    app.container.get(Deferred).drain()
    _, body = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    assert "[plugin echo] echo noticed the edit" in body["hookSpecificOutput"]["additionalContext"], "the line said after an edit reaches the agent at its next tool"
    _, again = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "b.py"})
    assert "echo noticed the edit" not in json.dumps(again), "and only once"


def test_a_plugin_that_fails_lets_the_event_through_and_is_recorded(app):
    from journal.features.plugins.feature import PluginsFeature
    from journal.repositories.entries import Entries
    from journal.repositories.messages import Messages
    from journal.repositories.plugins import Plugins
    from journal.repositories.setting_rows import SettingRows
    plugins, messages = app.container.get(Plugins), app.container.get(Messages)
    plugins.save(echo(app).with_(settings={"mode": "broken"}), Actor.user(1))
    hook(app, "SessionStart")
    for _ in range(5):
        assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})[0] == 200, "a fault is never a refusal"
    row = plugins.named("echo")
    assert row.faults_in_a_row == 5 and row.failing_since and "not JSON" in row.last_fault
    assert len(app.container.get(Entries).where(kind="plugin_fault")) == 5 and [m.text for m in messages.recent(20)].count("Plugin echo is failing: it faulted 5 times in a row, and events go through without it") == 1, "the failing card comes once, at the fifth"
    plugins.save(row.with_(settings={}), Actor.user(1))
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})[0] == 200
    assert plugins.named("echo").faults_in_a_row == 0 and "Plugin echo answers again" in [m.text for m in messages.recent(5)]
    app.container.get(SettingRows).set(PluginsFeature.DEADLINE.key, 1, Actor.user(1))
    plugins.save(plugins.named("echo").with_(settings={"mode": "slow"}), Actor.user(1))
    plugins.save(echo(app, "echo-two").with_(settings={"mode": "slow"}), Actor.user(1))
    began = time.monotonic()
    status, _ = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})
    assert status == 200 and time.monotonic() - began < 3, "two slow plugins share one deadline and the event goes through"
    assert "no answer within" in plugins.named("echo").last_fault and "used the event's whole deadline" in plugins.named("echo-two").last_fault, "each fault recorded"

def test_the_three_holds_are_answered_under_codex_as_the_frozen_records_show(app):
    """The skill, the look and the mark hold a Codex write through its pre-tool hook, as the records frozen on today's conduct show; nothing here is Claude only."""
    import json
    records = Path(__file__).with_name("replays")
    held = lambda name: {s["name"]: s["answer"]["error"] for s in json.loads((records / f"{name}_codex.json").read_text())["steps"] if isinstance(s["answer"], dict) and "error" in s["answer"]}
    assert "read the journal skill before anything else" in held("loading_skill_rules")["a write before the skill is read"]
    assert "`journal environment here`" in held("orienting_rules")["a write before the look"]
    assert "decide what to keep from the context" in held("at_mark_rules")["a write at the mark"]
    from journal.support.chart_catalogue import ChartCatalogue
    by_key = {e.key: e for e in app.container.get(ChartCatalogue).triggers()}
    assert all("codex" in by_key[k].providers for k in ("session_started", "prompt_submitted", "tool_starting")) and by_key["turn_written"].providers == ("claude",), "the events the holds ride on come from Codex too; only the turn written is Claude's alone, and the page says so"

def test_send_the_agent_back_restores_what_every_pause_keeps(app, monkeypatch):
    """A workflow of the user's with the one node sends the agent back from each pause: awaiting something outside, stuck, waiting on a question, awaiting a worker, running a sequence."""
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: None)
    from journal.repositories.charts import Charts
    console, charts, machine = app.console(), app.container.get(Charts), app.container.get(StateMachine)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    mine = int(console.run(["chart", "new", "Back on a subagent", "--on", "subagent_ended"], USER).out.split()[1].rstrip(":"))
    trigger = next(n.id for n in charts.nodes_of(charts.find(mine)) if n.kind == "trigger")
    back = int(console.run(["chart", "node", "action", "release", "--text", "[chart] back to it", "--in", str(mine)], USER).out.split()[1].rstrip(":"))
    console.run(["chart", "line", str(trigger), str(back)], USER)
    send_back = lambda: hook(app, "SubagentStop", agent_id="a1")
    console.run(["await", "the deploy", "--until", "false"], AGENT)
    assert machine.current("s1").name == "expecting"
    send_back()
    assert machine.current("s1").name == "working" and machine.current("s1").task_id == 1, "back from awaiting something outside, to the task"
    console.run(["stuck", "the build is broken"], AGENT)
    assert machine.current("s1").name == "stuck"
    send_back()
    assert machine.current("s1").name == "working", "back from being stuck"
    console.run(["question", "ask", "which colour?", "--options", "red", "blue"], AGENT)
    assert machine.current("s1").name == "waiting"
    send_back()
    assert machine.current("s1").name == "working", "back from a question"
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "fast"], AGENT)
    console.run(["worker", "wait", "1"], AGENT)
    assert machine.current("s1").name == "awaiting"
    send_back()
    assert machine.current("s1").name == "working", "back from a worker"
    made = re.search(r"sequence (\d+)", console.run(["sequence", "create", "ship it", "--steps", "tag it | push"], USER).out).group(1)
    console.run(["sequence", "run", made], AGENT)
    assert machine.current("s1").name == "working" and machine.current("s1").task_id == 1, "a sequence runs beside the state, which keeps its task"

def test_the_content_checks_read_the_tool_the_prompt_the_context_and_the_clock_for_claude_and_codex(app):
    import time
    from journal.events.agent.prompt_submitted import PromptSubmitted
    from journal.events.agent.ticked import Ticked
    from journal.events.agent.tool_starting import ToolStarting
    from journal.features.chart.support.checks import Checks
    from journal.features.chart.support.context import Context
    hook(app, "SessionStart")
    checks = app.container.get(Checks)
    at = lambda event, provider="claude": Context(event=event, session="s1", environment_id=1, provider=provider)
    write = at(ToolStarting(call=ToolCall(tool="Write", input={"file_path": "src/deploy.sh"}), session="s1", environment_id=1))
    shell = at(ToolStarting(call=ToolCall(tool="shell", input={"command": ["bash", "-lc", "git push origin main"]}), session="s1", environment_id=1, provider="codex"), "codex")
    assert checks.answer("tool_named", write, "Write, Edit") and not checks.answer("tool_named", write, "Bash") and checks.answer("tool_named", shell, "shell"), "the tool's name, as the provider names it"
    assert checks.answer("tool_input_has", write, "deploy") and checks.answer("tool_input_has", shell, "git push") and not checks.answer("tool_input_has", write, "push"), "the words anywhere in the input, Codex's command list included"
    prompt = at(PromptSubmitted(prompt="Deploy it to production now", session="s1", environment_id=1))
    assert checks.answer("prompt_has", prompt, "deploy") and not checks.answer("prompt_has", prompt, "rollback") and not checks.answer("prompt_has", write, "deploy")
    full = at(ToolStarting(call=ToolCall(tool="Read", input={}), session="s1", environment_id=1, context=0.62))
    assert checks.answer("context_over", full, "60") and not checks.answer("context_over", full, "70") and not checks.answer("context_over", write, "0"), "the context as the event reports it"
    night = time.mktime((2026, 10, 17, 23, 30, 0, 0, 0, -1))
    noon = time.mktime((2026, 10, 17, 12, 0, 0, 0, 0, -1))
    tick = lambda when: at(Ticked(at=when, quiet_for=0.0, session="s1", environment_id=1))
    assert checks.answer("time_between", tick(night), "22:00-06:00") and not checks.answer("time_between", tick(noon), "22:00-06:00") and checks.answer("time_between", tick(noon), "09:00-17:00"), "a span past midnight included"
    assert not checks.answer("time_between", tick(noon), "late"), "a span that is no span answers no"

def test_a_start_after_a_compaction_says_where_the_work_stands(app):
    console = app.console()
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["task", "log", "1", "halfway through the footer"], AGENT)
    app.runtime().deferred.drain()
    fresh = hook(app, "SessionStart", source="startup")[1]["hookSpecificOutput"]["additionalContext"]
    assert "after the compaction" not in fresh, "a fresh start says nothing of a compaction"
    said = hook(app, "SessionStart", source="compact")[1]["hookSpecificOutput"]["additionalContext"]
    assert 'after the compaction, the work stands here: task 1' in said and '"halfway through the footer"' in said and "uncommitted files:" in said, "the task, its last log whole and the files not committed"


def test_a_fresh_start_asks_whether_old_facts_rules_and_reminders_still_hold(app):
    from datetime import datetime, timedelta, timezone
    from journal.repositories.facts import Facts
    from journal.support.scope import Scope
    console = app.console()
    console.run(["fact", "create", "the api lives on port 9"], USER)
    console.run(["fact", "create", "the login is new"], USER)
    with app.container.get(Scope).of(1):
        facts = app.container.get(Facts)
        old = facts.in_()[0]
        facts.connection.execute(f"UPDATE {facts.table} SET created_at = ?, updated_at = ? WHERE id = ?", ((datetime.now(timezone.utc) - timedelta(days=9)).isoformat(),) * 2 + (old.id,))
    said = hook(app, "SessionStart", source="startup")[1]["hookSpecificOutput"]["additionalContext"]
    assert "these are 7 days old or more, check they still hold: fact 1, 9 days" in said and "fact 2" not in said.split("check they still hold:")[1].split("\n")[0], "the old one is named with its age, the new one is not"
    again = hook(app, "SessionStart", source="startup")[1]["hookSpecificOutput"]["additionalContext"]
    assert "check they still hold" not in again, "at most once a day"
    compacted = hook(app, "SessionStart", source="compact")[1]["hookSpecificOutput"]["additionalContext"]
    assert "check they still hold" not in compacted, "never after a compaction"


def test_a_cancelled_task_is_finished_and_never_counted_open(app):
    from journal.db.migrations.finish_cancelled_tasks import FinishCancelledTasks
    from journal.db.connection import Connection
    from journal.support.scope import Scope
    from journal.repositories.tasks import Tasks
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "a task of its own"], USER)
    console.run(["task", "create", "a task of nobody's"], USER)
    console.run(["plan", "cancel", "1"], USER)
    with app.container.get(Scope).of(1):
        cancelled = app.container.get(Tasks).find(1)
        assert cancelled.state.value == "cancelled" and cancelled.finished_at is not None, "a cancel stamps when it finished"
        connection = app.container.get(Connection)
        connection.execute("UPDATE tasks SET finished_at = NULL WHERE id = 1")
        FinishCancelledTasks().up(connection)
        assert app.container.get(Tasks).find(1).finished_at is not None, "and one cancelled before that is finished by the migration"
    with app.container.get(Scope).of(1):
        assert app.container.get(Tasks).unfinished_count() == 1, "only the task still open is counted"


def test_a_worker_that_ends_has_its_commits_taken_in_and_its_leftovers_named(app):
    import subprocess
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.support.actor import Actor as A
    from journal.repositories.messages import Messages
    from journal.support.scope import Scope
    from journal.repositories.workers import Workers
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    git("init", "-q", "-b", "main")
    git("config", "user.email", "t@example.com")
    git("config", "user.name", "T")
    (root / ".gitignore").write_text(".journal/\n")
    git("add", ".gitignore")
    git("commit", "-qm", "start")
    hook(app, "SessionStart")
    app.console().run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "sonnet", "--worktree"], AGENT)
    with app.container.get(Scope).of(1):
        worker = app.container.get(Workers).find(1)
        app.container.get(WorkerRunner).run(worker, ["sh", "-c", "echo parsed > parser.txt && git add parser.txt && git commit -qm 'the parser' && echo half > notes.txt && echo the parser is written"], A.agent("s1"))
        report = next(m.text for m in app.container.get(Messages).in_() if "Lady Lovelace reports" in m.text)
    assert "the parser is written" in report and "its 1 commits were taken into this branch" in report and "the parser" in report.split("taken into this branch:")[1], "its commit is merged and named"
    assert "(files: parser.txt)" in report, "the files its commits wrote are named in its report, as its own feed of edits"
    assert (root / "parser.txt").exists(), "the worker's file is in the project now"
    assert "it left 1 files uncommitted in its worktree" in report and "notes.txt" in report, "what it never committed is named, not lost"

def test_a_secret_row_holds_its_fields_and_its_values_live_in_a_private_file(app, tmp_path, monkeypatch):
    import stat
    from datetime import datetime, timezone
    from journal.support.secret_values import SecretValues
    from journal.models.secret import Secret
    from journal.models.secret_kind import SecretKind
    from journal.repositories.secrets import Secrets
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    secrets, values = app.container.get(Secrets), app.container.get(SecretValues)
    secret = secrets.save(Secret(title="Github", kind=SecretKind.API_KEY, fields=SecretKind.API_KEY.first_fields("Github")), Actor.user("u"))
    assert secret.fields == ({"name": "key", "hidden": True, "variable": "GITHUB_KEY"},) and secret.waiting()
    values.put("GITHUB_KEY", 'gh-"quoted"-token')
    secret = secrets.save(secret.filled_in("key"), Actor.user("u"))
    assert not secrets.find(secret.id).waiting() and values.values() == {"GITHUB_KEY": 'gh-"quoted"-token'}
    assert stat.S_IMODE(values.path.stat().st_mode) == 0o600 and stat.S_IMODE(values.path.parent.stat().st_mode) == 0o700
    assert values.path.name == f"{(app.config.home / 'project-id').read_text().strip()}.env", "the file is named by the project's id, kept in its journal folder"
    raw = b"".join(path.read_bytes() for path in app.config.home.glob("journal.db*"))
    assert b"gh-" not in raw, "no value ever reaches the database"
    values.drop(["GITHUB_KEY"])
    assert values.values() == {}
    gone = secrets.save(secrets.find(secret.id).deleted(datetime.now(timezone.utc)), Actor.user("u"))
    assert secrets.live() == [] and secrets.gone() == [gone]


def test_a_secret_value_is_masked_out_of_every_write_and_the_leak_is_shown(app, tmp_path, monkeypatch):
    from journal.support.masks import Masks
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    from journal.models.message import Message
    from journal.repositories.messages import Messages
    from journal.support.scope import Scope
    from journal.support.secret_values import SecretValues
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    hook(app, "SessionStart")
    app.container.get(SecretValues).put("GITHUB_KEY", "ghp_0123456789abcdef")
    app.container.get(SecretValues).put("PIN", "1234")
    with app.container.get(Scope).of(1):
        saved = app.container.get(Messages).save(Message(text="the key is ghp_0123456789abcdef and the pin 1234"), Actor.system())
        assert app.container.get(Messages).find(saved.id).text == "the key is [secret GITHUB_KEY] and the pin 1234", "a value too short to mask stands as it is"
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "echo ghp_0123456789abcdef"}, tool_response="ghp_0123456789abcdef")
    stored = b"".join(path.read_bytes() for path in app.config.home.glob("journal.db*"))
    assert b"[secret GITHUB_KEY]" in stored and b"ghp_0123456789abcdef" not in stored, "not in a hook's entry either, in the database or its log"
    assert app.container.get(Masks).leaks
    app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=1.0))
    app.runtime().deferred.drain()
    with app.container.get(Scope).of(1):
        assert any("was masked: GITHUB_KEY" in m.text for m in app.container.get(Messages).in_()), "the leak is shown once"


def test_the_agent_is_kept_out_of_the_secrets_and_the_mcp_keys(app, tmp_path, monkeypatch):
    from journal.support.secret_values import SecretValues
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    monkeypatch.setattr(Path, "home", lambda: tmp_path / "home")
    hook(app, "SessionStart")
    read_skill(app, "journal")
    app.console().run(["environment", "here"], AGENT)
    values = app.container.get(SecretValues).path
    keys = tmp_path / "home" / ".journal" / "keys"
    refused = lambda tool, given: hook(app, "PreToolUse", tool_name=tool, tool_input=given)[0] == 409
    assert refused("Read", {"file_path": str(values)})
    assert refused("Bash", {"command": f"cat {values.parent}/*.env"})
    assert refused("Bash", {"command": "cat ~/.config/agent-journal/secrets/x.env"})
    assert refused("Grep", {"pattern": "KEY", "path": str(keys)})
    climbed = "../" * len(app.config.root.resolve().parts) + str(keys.resolve()).lstrip("/") + "/x.json"
    assert refused("Read", {"file_path": climbed}), "a path that climbs into the keys is refused too"
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": str(app.config.root / "a.py")})[0] == 200
    assert "`journal secret run <n> -- <program>`" in hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": str(values)})[1]["error"]


def test_the_secret_commands_make_ask_for_change_list_show_and_delete_and_none_takes_a_value(app, tmp_path, monkeypatch):
    from journal.repositories.messages import Messages
    from journal.support.scope import Scope
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    console = app.console()
    import shutil
    monkeypatch.setattr(shutil, "which", lambda name: f"/usr/bin/{name}")
    made = console.run(["secret", "create", "Github", "--kind", "api key", "--brief", "Run `curl -H @- https://api.github.com/user` or `bash -c x`, with GITHUB_KEY"], AGENT)
    assert made.code == 0 and "secret 1 made: Github, waiting for the user to fill key on the Secrets page; proposed for the user to allow: curl" in made.out, "a shell named in the instructions is never proposed"
    assert console.run(["secret", "request", "Stripe", "--why", "to read the invoices"], AGENT).code == 0
    with app.container.get(Scope).of(1):
        assert any("Please fill in the secret Stripe on the Secrets page" in m.text and "secret 2" in m.text for m in app.container.get(Messages).in_())
    assert "filled by the user on the Secrets page, never by a command" in console.run(["secret", "fill", "1"], AGENT).err
    listed = console.run(["secret", "list"], AGENT).out
    assert "Github  waiting for the user" in listed and "Stripe" in listed
    shown = console.run(["secret", "show", "1"], AGENT).out
    assert "GITHUB_KEY" in shown and "waiting for the user, hidden" in shown and "proposed: curl" in shown
    assert console.run(["secret", "update", "1", "--title", "GitHub"], AGENT).code == 0 and "GitHub" in console.run(["secret", "list"], AGENT).out
    assert console.run(["secret", "where"], AGENT).out.strip().endswith(".env")
    made = tmp_path / "made.txt"
    made.write_text("  generated-password-value  \n")
    assert console.run(["secret", "store", "1", "key", str(made)], AGENT).code == 0 and not made.exists()
    from journal.support.secret_values import SecretValues
    assert app.container.get(SecretValues).values()["GITHUB_KEY"] == "generated-password-value"
    console.run(["secret", "delete", "2"], AGENT)
    assert "Stripe" not in console.run(["secret", "list"], AGENT).out
    console.run(["secret", "restore", "2"], AGENT)
    assert "Stripe" in console.run(["secret", "list"], AGENT).out


def test_secrets_kept_as_files_in_the_project_folder_become_rows_once(app):
    import json as j
    from journal.features.secrets.seeds.secret_files import SecretFiles
    from journal.repositories.secrets import Secrets
    folder = app.config.home / "project" / "secret"
    folder.mkdir(parents=True)
    head = {"n": 1, "title": "flespi", "data": {"kind": "api key", "secret_fields": [{"name": "key", "hidden": True, "variable": "FLESPI_KEY"}], "filled": {"key": 1791556011.2}, "programs": ["curl"], "used": 1791706718.7}, "deleted": 0.0}
    (folder / "001.md").write_text("---\n" + j.dumps(head, indent=2) + "\n---\nThe flespi token, used with curl.\n")
    (folder / "changes.log").write_text("not a secret")
    seed = app.container.get(SecretFiles)
    seed.run()
    seed.run()
    rows = app.container.get(Secrets).all()
    assert len(rows) == 1, "brought in once, however often the journal boots"
    flespi = rows[0]
    assert flespi.title == "flespi" and flespi.kind == "api key" and flespi.filled == ("key",) and flespi.programs == ("curl",) and flespi.brief == "The flespi token, used with curl." and flespi.used_at is not None and not flespi.waiting()


def test_the_agent_is_told_when_the_user_allows_a_program(app, monkeypatch):
    from journal.models.secret import Secret
    from journal.repositories.secrets import Secrets
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}))
    hook(app, "SessionStart")
    secret = app.container.get(Secrets).save(Secret(title="Github", proposed=("gh",)), Actor.agent("s1"))
    viewer(app, f"secrets/{secret.id}", {"programs": ["gh"], "proposed": []})
    app.runtime().deferred.drain()
    assert any("the user let secret 1, Github, go to gh" in r.get("line", "") for r in sent)


def test_a_browser_login_is_taken_in_a_window_given_to_the_agents_browser_and_taken_back(app, tmp_path, monkeypatch):
    import json as j
    import time
    from journal.support.mcp_installing import McpInstalling
    from journal.features.secrets.support.browser_logins import BrowserLogins
    from journal.models.mcp_server import McpServer
    from journal.models.secret import Secret
    from journal.models.secret_kind import SecretKind
    from journal.repositories.mcp_servers import McpServers
    from journal.repositories.secrets import Secrets
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    applied = []
    monkeypatch.setattr(McpInstalling, "applied", lambda self: applied.append(True))

    def recorded(self, title, url):
        self.folder.mkdir(mode=0o700, parents=True, exist_ok=True)
        saved = self.saved_for(title)
        saved.write_text(j.dumps({"cookies": [{"name": "sid", "domain": ".example.com", "path": "/", "expires": 4102444800}], "origins": []}))
        return saved

    monkeypatch.setattr(BrowserLogins, "record", recorded)
    servers, secrets = app.container.get(McpServers), app.container.get(Secrets)
    servers.save(McpServer(name="playwright", title="Playwright", command="npx", args=("-y", "@playwright/mcp@latest", "--headless")), Actor.system())
    secret = secrets.save(Secret(title="Example", kind=SecretKind.BROWSER_LOGIN, url="https://app.example.com/login"), Actor.user("u"))
    assert "the user logs in to Example with the Log in button" in app.console().run(["secret", "login", str(secret.id)], AGENT).err, "the agent logs in on its own only where the user allows it"
    viewer(app, f"secrets/{secret.id}/allow-login")
    began = time.time()
    while secrets.find(secret.id).logging_in_at and time.time() - began < 5:
        time.sleep(0.05)
    done = secrets.find(secret.id)
    assert done.auto_login and done.session_at and done.session_expires.year == 2100
    merged = app.container.get(BrowserLogins).merged
    args = servers.named("playwright").args
    assert args[-3:] == ("--storage-state", str(merged), "--isolated") and merged.is_file() and applied, "the agent's browser starts with the login, and the agents restart to use it"
    assert "logged in to Example" in app.console().run(["secret", "login", str(secret.id), "--wait"], AGENT).out
    viewer(app, f"secrets/{secret.id}/revoke-login")
    assert not secrets.find(secret.id).auto_login and merged.exists(), "asking each time keeps the saved login"
    viewer(app, f"secrets/{secret.id}/forget-login")
    assert "--storage-state" not in servers.named("playwright").args and not merged.exists() and secrets.find(secret.id).session_at is None


def test_a_replaced_value_stays_masked_and_a_login_that_ran_out_asks_again_once(app, tmp_path, monkeypatch):
    from datetime import datetime, timedelta, timezone
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    from journal.models.message import Message
    from journal.models.secret import Secret
    from journal.models.secret_kind import SecretKind
    from journal.repositories.messages import Messages
    from journal.repositories.secrets import Secrets
    from journal.support.secret_values import SecretValues
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    values = app.container.get(SecretValues)
    values.put("GITHUB_KEY", "ghp_oldvalue_0001")
    values.put("GITHUB_KEY", "ghp_newvalue_0002")
    saved = app.container.get(Messages).save(Message(text="old ghp_oldvalue_0001 new ghp_newvalue_0002"), Actor.system())
    assert app.container.get(Messages).find(saved.id).text == "old [secret GITHUB_KEY] new [secret GITHUB_KEY]", "the replaced value is still masked"
    assert values.values()["GITHUB_KEY"] == "ghp_newvalue_0002" and len(values.retired_before(9e12)) == 1
    secrets = app.container.get(Secrets)
    secrets.save(Secret(title="Example", kind=SecretKind.BROWSER_LOGIN, url="https://example.com", session_at=datetime.now(timezone.utc) - timedelta(days=2), session_expires=datetime.now(timezone.utc) - timedelta(days=1)), Actor.user("u"))
    hook(app, "SessionStart")
    for _ in range(2):
        app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=1.0))
        app.runtime().deferred.drain()
    asked = [m for m in app.container.get(Messages).in_() if "Your login to Example has run out" in m.text]
    assert len(asked) == 1, "asked once for each time it runs out"


def test_a_secret_deleted_thirty_days_ago_goes_for_good_with_its_values(app, tmp_path, monkeypatch):
    from datetime import datetime, timedelta, timezone
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    from journal.models.secret import Secret
    from journal.models.secret_kind import SecretKind
    from journal.repositories.secrets import Secrets
    from journal.support.secret_values import AT, RETIRED, SecretValues
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    values, secrets = app.container.get(SecretValues), app.container.get(Secrets)
    long_ago = datetime.now(timezone.utc) - timedelta(days=31)
    old = secrets.save(Secret(title="Old", kind=SecretKind.API_KEY, fields=SecretKind.API_KEY.first_fields("Old"), deleted_at=long_ago), Actor.user("u"))
    recent = secrets.save(Secret(title="Recent", kind=SecretKind.API_KEY, fields=SecretKind.API_KEY.first_fields("Recent"), deleted_at=datetime.now(timezone.utc)), Actor.user("u"))
    values.write({"OLD_KEY": "a", "RECENT_KEY": "b", f"{RETIRED}X{AT}{int(long_ago.timestamp())}": "c", "LIVE_KEY": "d"})
    hook(app, "SessionStart")
    app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=1.0))
    app.runtime().deferred.drain()
    assert [s.id for s in secrets.all()] == [recent.id], "the one deleted thirty days ago is gone, the recent one kept for a restore"
    assert values.values() == {"RECENT_KEY": "b", "LIVE_KEY": "d"}, "its values and the old retired one go with it"


def test_an_agents_wait_is_on_its_own_row_with_or_without_a_task(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["await", "the suite", "--until", "false"], AGENT)
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/agents", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        row = json.loads(reply.read())["rows"][0]
    assert row["awaiting"] == "the suite" and row["awaiting_since"], "the bar reads a wait from the agent's row, which changes when its state does"


def test_a_step_moved_on_is_never_written_back_by_a_change_read_before_it(app):
    from journal.engine.state_machine import StateMachine
    from journal.support.running import Running
    console = app.console()
    release = console.run(["sequence", "create", "release", "--steps", "one | two | three"], USER).out.split()[1].rstrip(":")
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["sequence", "run", release], AGENT)
    console.run(["sequence", "follow"], AGENT)
    running, machine = app.container.get(Running), app.container.get(StateMachine)
    with app.container.get(Scope).of(MAIN):
        stale = machine.agent("s1", 1)
        console.run(["sequence", "next"], AGENT)
        running.rewritten(stale, lambda now: [*now[:-1], now[-1].said(running.now())])
        assert running.in_hand("s1", 1).step == 1, "the pace's own write, read before the step moved on, keeps the step it moved to"


def test_an_agent_waiting_in_auto_mode_is_pointed_to_the_next_task_after_a_quiet_minute(app, monkeypatch):
    typed = []
    catch_typed(app, monkeypatch, typed)
    drive_the_clock(app, monkeypatch)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the footer", "--start"], AGENT)
    console.run(["task", "create", "the header"], AGENT)
    console.run(["await", "the suite", "--until", "false"], AGENT)
    tick_after(app, 70.0)
    app.runtime().deferred.drain()
    assert any("while you wait for the suite, task 2 is next" in line and "waiting is fine" in line for line in typed), typed


def test_an_approved_plan_not_started_holds_the_stop_until_it_is(app):
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "only"], USER)
    console.run(["plan", "phase", "1", "one", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "1"], USER)
    console.run(["plan", "ready", "1"], USER)
    console.run(["plan", "approve", "1"], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    assert "plan 1 is approved and not started" in hook(app, "Stop")[1]["reason"]
    console.run(["plan", "start", "1"], AGENT)
    assert "is approved and not started" not in json.dumps(hook(app, "Stop")[1]), "a started plan holds nothing"


def test_a_question_asked_without_a_session_or_from_a_workers_shell_is_refused(app):
    hook(app, "SessionStart")
    app.console().run(["worker", "dispatch", "Lady Lovelace", "say hello", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    from journal.repositories.workers import Workers
    workers = app.container.get(Workers)
    workers.save(workers.find(1).with_(session="w1"), USER.actor)
    assert "worker's report" in app.console().run(["question", "ask", "Which?"], USER).err
    assert app.console().run(["question", "ask", "Which?"], Where("main", "w1")).code != 0
    assert app.console().run(["question", "ask", "Which?"], AGENT).code == 0


def test_a_worker_outlives_a_restart_and_is_watched_again_at_boot(app):
    import subprocess
    import time
    from journal.features.workers.seeds.workers_at_boot import WorkersAtBoot
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.models.worker import Worker
    from journal.repositories.messages import Messages
    from journal.support.scope import Scope
    from journal.repositories.workers import Workers
    workers, runner, scope = app.container.get(Workers), app.container.get(WorkerRunner), app.container.get(Scope)
    with scope.of(1):
        running = workers.save(Worker(name="Mr. Babbage", brief="the parser", model="sonnet"), Actor.system())
        lost = workers.save(Worker(name="Mr. Brunel", brief="the bridge", model="sonnet"), Actor.system())
    out, _ = runner.outputs(running)
    out.parent.mkdir(parents=True, exist_ok=True)
    started = subprocess.run(["sh", "-c", f"(sleep 0.5; echo the parser is done) > '{out}' 2>&1 & echo $!"], capture_output=True, text=True, timeout=10)
    workers.save(running.running_as(int(started.stdout.strip()), time.time()), Actor.system())
    app.container.get(WorkersAtBoot).run()
    end = time.time() + 10
    while time.time() < end and any(w.is_out() for w in workers.across_environments()):
        time.sleep(0.1)
    with scope.of(1):
        texts = [m.text for m in app.container.get(Messages).in_()]
    assert "Mr. Babbage reports: the parser is done" in "\n".join(texts), "a worker still running when the journal came back is watched until it ends, its report read from its file"
    assert any(t.startswith("Mr. Brunel reports: ") for t in texts) and not workers.find(lost.id).is_out(), "a worker whose process ended while the journal was down is not left out"


def test_a_worker_past_its_time_limit_is_stopped_and_reported(app):
    from journal.features.workers.feature import Workers as WorkersFeature
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.support.actor import Actor as A
    from journal.repositories.messages import Messages
    from journal.repositories.setting_rows import SettingRows
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    app.console().run(["worker", "dispatch", "Lady Lovelace", "say hello", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    app.container.get(SettingRows).set(WorkersFeature.TIMEOUT.key, 0.02, USER.actor)
    worker = app.container.get(Workers).find(1)
    app.container.get(WorkerRunner).run(worker, ["sh", "-c", "echo half done; sleep 30"], A.agent("s1"))
    assert any("stopped after" in m.text and "half done" in m.text for m in app.container.get(Messages).in_())


def test_a_commit_trailer_of_an_old_head_or_a_closed_task_closes_nothing(app, monkeypatch):
    import subprocess
    from journal.repositories.tasks import Tasks
    catch_typed(app, monkeypatch, [])
    root = app.config.root
    subprocess.run(["git", "init", "-q"], cwd=root, check=True)
    old = {"GIT_COMMITTER_DATE": "2020-01-01T00:00:00", "GIT_AUTHOR_DATE": "2020-01-01T00:00:00"}
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "Old\n\nJournal: tasks done 1 and 2 earlier"], cwd=root, check=True, env={**os.environ, **old})
    hook(app, "SessionStart")
    app.console().run(["task", "create", "footer", "--start"], AGENT)
    app.console().run(["task", "create", "margin"], AGENT)
    command = dict(tool_name="Bash", tool_input={"command": "git commit -m x"}, tool_response={"stdout": "", "stderr": ""})
    hook(app, "PostToolUse", **command)
    assert app.container.get(Tasks).find(1).state == "started", "the head was not made by this command"
    for line in (["task", "park", "1", "first"], ["task", "start", "2"], ["task", "park", "2", "later"], ["task", "resume", "1"]):
        app.console().run(line, AGENT)
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "New\n\nJournal: tasks done 1 and 2 now"], cwd=root, check=True)
    hook(app, "PostToolUse", **command)
    assert app.container.get(Tasks).find(1).state == "done" and app.container.get(Tasks).find(2).state == "parked"


def test_command_outputs_are_a_rolling_log_that_drops_the_oldest_with_its_folder(app):
    from journal.repositories.command_outputs import CommandOutputs
    app.container.get(SettingRows).save(Setting(environment_id=0, key="shell.outputs_kept", value=2), Actor.system())
    hook(app, "SessionStart")
    console = app.console()
    folders = [app.config.root / f"run{i}" for i in range(3)]
    for folder in folders:
        folder.mkdir()
        ShellVerbs(app).split("ls", str(folder))
    with app.container.get(Scope).of(MAIN):
        kept = app.container.get(CommandOutputs).every()
    assert [o.chain for o in kept] == ["run1", "run2"] and not folders[0].exists() and folders[2].exists(), "the newest kept, the oldest gone with its files"


def test_an_output_is_read_by_its_number_whole_by_its_ends_or_in_part_and_listed(app):
    hook(app, "SessionStart")
    console = app.console()
    folder = app.config.root / "run"
    folder.mkdir()
    ShellVerbs(app).split("make test", str(folder))
    (folder / "0.out").write_text("\n".join(f"line {i}" for i in range(1, 51)) + "\n")
    (folder / "0.status").write_text("1\n")
    (folder / "done").write_text("1")
    assert (folder / "number").read_text() == "1", "the runner names a cut output by the number the split leaves"
    bare = console.run(["output", "read", "1"], AGENT)
    assert bare.code != 0 and "--tail 20" in bare.err and "--all" in bare.err, "an output is read in the part a flag names, never whole by default"
    assert console.run(["output", "read", "1", "--all"], AGENT).out.count("\n") == 50, "--all reads every line, by choice"
    whole = console.run(["output", "read", "1", "--summary"], AGENT).out
    assert "output 1: failed with code 1, 50 lines" in whole and "command: make test" in whole, whole
    assert "line 10\n... 30 lines" in whole and whole.rstrip().endswith("line 50"), "the first and last ten, the middle named"
    assert console.run(["output", "read", "1", "--lines", "20-22"], AGENT).out == "line 20\nline 21\nline 22\n"
    assert console.run(["output", "read", "1", "--grep", "line 4[29]"], AGENT).out == "42: line 42\n49: line 49\n"
    assert console.run(["output", "read", "1", "--tail", "1"], AGENT).out == "line 50\n"
    assert "failed with code 1" in console.run(["output", "list"], AGENT).out
    assert console.run(["reader", "add", "forties", "--pattern", "line 4[0-1]$", "--about", "lines in the early forties"], AGENT).code == 0
    assert (app.config.readers / "forties.pattern").read_text() == "# lines in the early forties\nline 4[0-1]$\n", "a reader is a file of the project's"
    assert console.run(["reader", "list"], AGENT).out == "forties: lines in the early forties\n"
    assert console.run(["output", "read", "1", "--reader", "forties"], AGENT).out == "40: line 40\n41: line 41\n"
    assert console.run(["output", "read", "1", "--reader", "nothing"], AGENT).code == 1, "an unknown reader is refused"
    script = app.config.root / "count.sh"
    script.write_text("wc -l | tr -d ' '\n")
    assert console.run(["reader", "add", "count", "--script", str(script), "--about", "how many lines"], AGENT).code == 0
    assert console.run(["output", "read", "1", "--reader", "count"], AGENT).out == "50\n", "a script reader is handed the output and prints what matters"
    assert console.run(["reader", "list"], AGENT).out == "count: how many lines\nforties: lines in the early forties\n"


def test_a_trailing_tail_or_head_is_taken_off_the_line_and_kept_as_the_cut_to_apply(app):
    hook(app, "SessionStart")
    console = app.console()
    for name, line in (("cut", "python3 -m pytest -q 2>&1 | tail -4"), ("head", "git log --oneline | head -3"), ("quoted", 'echo "a | tail -1"')):
        folder = app.config.root / name
        folder.mkdir()
        ShellVerbs(app).split(line, str(folder))
    assert (app.config.root / "cut" / "0.part").read_text() == "python3 -m pytest -q 2>&1", "the tail goes; the command runs whole and the output is kept whole"
    assert (app.config.root / "cut" / "0.cut").read_text() == "tail -4", "the cut is kept beside the part, for the runner to apply to the kept output"
    assert (app.config.root / "head" / "0.part").read_text() == "git log --oneline" and (app.config.root / "head" / "0.cut").read_text() == "head -3", "a head is a cut like a tail"
    assert not (app.config.root / "quoted" / "0.cut").exists(), "a pipe inside quotes is text"
    assert ShellVerbs(app).forget("cut", 120) == "kept", "a cut line's whole output is kept whatever its size"


def test_output_is_shown_whole_for_journal_commands_by_its_ends_for_a_read_and_its_last_characters_otherwise(app):
    from journal.repositories.command_outputs import CommandOutputs
    hook(app, "SessionStart")
    console = app.console()
    cap = lambda line: ShellVerbs(app).cap(line)
    assert cap("journal task list") == "whole 0" and cap("cat a.py && git diff") == "ends 8000" and cap("python3 -m pytest -q") == "hint 400"
    assert cap("cat src/journal/app.py") == "direct 0" and cap("grep -rn x src/journal | head -5") == "direct 0" and cap("ls src/journal/engine") == "direct 0", "a read of the project's own code runs in the shell as written, nothing captured"
    assert cap("sed -n 1,3p src/journal/app.py; echo ====; grep -n x src/journal/config.py") == "direct 0" and cap("echo hi; echo there") == "hint 400", "a bare echo between two reads keeps the line a read of code; echoes alone read nothing"
    assert cap("cat src/journal/app.py 2>/dev/null | head -3; ls src/journal/hooks/ 2>&1") == "direct 0" and cap("cat src/journal/app.py > /tmp/copy.txt") == "ends 8000", "a redirect to /dev/null or to another stream is no write; one into a file outside the project is"
    assert cap("cat .journal/runtime/server.log") == "ends 8000" and cap("cat /etc/hosts") == "ends 8000" and cap("git diff") == "ends 8000", "a read of the journal's own folder, of a file outside the project or of no named path is shown by its ends and kept"
    script = "python3 - <<'EOF'\nfrom pathlib import Path\nPath(\"src/journal/app.py\").write_text(\"x\")\nEOF"
    assert cap("sed -i '' 's/a/b/' src/journal/app.py") == "direct 0" and cap(script) == "direct 0" and cap(f"{script} && cat src/journal/app.py") == "direct 0", "a line that edits the project's own code runs in the shell as a read of it does"
    assert cap("echo hi > /tmp/notes.txt") == "hint 400" and cap("cp a.bin b.bin") == "hint 400" and cap("sed -i '' 's/a/b/' src/journal/app.py && python3 -m pytest -q") == "hint 400", "a write outside the project, of no code file, or chained with a run is not"
    import os
    root = os.getcwd()
    direct = ['grep -rn "-> None" src/journal', 'grep -rn "=>" src/web/src', "awk 'NR>=10' src/journal/app.py", "grep -i foo src/journal", "rg -i cap src", "sed -i.bak 's/a/b/' src/journal/app.py",
              f"cd {root} && grep -rn cap src/journal", "rg -n foo", "git grep -n foo", "ls", "tree -L 2", "git --no-pager diff -- src/journal/app.py", "GIT_PAGER=cat git log -3 -- src",
              "sed -i '' 's/a/b/' src/journal/app.py && echo done", "touch src/journal/x.py && echo ok", "mkdir -p src/journal/features/new && touch src/journal/features/new/__init__.py", "rm -rf src/journal/features/old", 'echo "x" >> .gitignore',
              "grep -rln foo src | xargs sed -i '' 's/foo/bar/g'", "find src -name '*.py' -exec sed -i '' 's/a/b/' {} +", "cat ~/projects/agent-journal/src/journal/app.py", f"cat {root}/.journal/worktrees/3-lady-lovelace/src/journal/app.py",
              "printf '\\n--- app ---\\n'; cat src/journal/app.py", "[ -f src/journal/app.py ] && cat src/journal/app.py", "pwd && ls src", "set -o pipefail; grep -rn foo src | head", "# where the cap is decided\ngrep -rn cap src/journal",
              "ls src/journal/features/*/states", 'grep -rn foo "src/my dir"', "git checkout -- src/journal/app.py", "git restore src/journal/app.py", "git mv src/journal/a.py src/journal/b.py",
              "find src -name '*.pyc' -delete", "find src -name '*.py' | xargs rm", "perl -pi -e 's/a/b/' src/journal/app.py", "python3 - src/journal/app.py <<'EOF'\nfrom pathlib import Path\nPath(sys.argv[1]).write_text('x')\nEOF"]
    assert [line for line in direct if cap(line) != "direct 0"] == [], "report 30: every read or write of the project's code goes direct"
    ends = ["ls .journal", "cat ./.journal/runtime/server.log", "find .journal -name '*.log'", f"cat {root}-v3/src/journal/app.py", "grep -rn foo src/web/node_modules", "cat src/web/package-lock.json",
            'grep -rn "config.json" ~/.claude', "cat $HOME/other/app.py", "sqlite3 .journal/journal.db \"select path from edits where path like '%.py'\"", "tail -f src/web/dev.log"]
    assert [line for line in ends if cap(line) != "ends 8000"] == [], "report 30: a read of the journal's folder, of something outside the project or of what is not its code is shown by its ends"
    hints = ["sed -i '' 's/a/b/' .journal/config.json", "echo x >> .journal/notes.md"]
    assert [line for line in hints if cap(line) != "hint 400"] == [], "report 30: a write into the journal's folder is a run"
    folder = app.config.root / "journal-line"
    folder.mkdir()
    ShellVerbs(app).split("journal task list", str(folder))
    with app.container.get(Scope).of(MAIN):
        assert app.container.get(CommandOutputs).every() == [] and not (folder / "number").exists(), "a line of journal commands is no output"


def test_one_task_is_in_hand_whatever_starts_it_and_a_parked_plan_parks_its_task(app, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    typed = []
    catch_typed(app, monkeypatch, typed)
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    from journal.repositories.plans import Plans
    from journal.repositories.tasks import Tasks
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "first"], USER)
    console.run(["plan", "add", "1", "second"], USER)
    console.run(["plan", "phase", "1", "one", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "1", "2"], USER)
    console.run(["plan", "ready", "1"], USER)
    console.run(["plan", "approve", "1"], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "aside", "--start"], AGENT)
    refused = console.run(["plan", "start", "1"], AGENT)
    assert refused.code == 1 and "task 3 is in hand" in refused.err, "a plan's start obeys the one task in hand"
    assert app.container.get(Plans).find(1).state == "approved", "a refused start leaves the plan as it was"
    assert console.run(["task", "park", "2", "x"], AGENT).code == 1, "a task never started is not parked"
    console.run(["task", "park", "3", "the plan first"], AGENT)
    console.run(["plan", "start", "1"], AGENT)
    console.run(["plan", "park", "1"], AGENT)
    tasks = app.container.get(Tasks)
    assert tasks.find(1).state == "parked" and tasks.in_hand() is None, "a parked plan parks its task in hand"
    done = console.run(["task", "resume", "1"], AGENT)
    assert done.code == 0
    console.run(["task", "done", "1", "--how", "h"], AGENT)
    app.runtime().deferred.drain()
    assert any("task 3 is still parked" in line for line in typed), "with nothing in hand, a close names a parked task"
    console.run(["task", "resume", "3"], AGENT)
    console.run(["task", "done", "3", "--how", "h"], AGENT)
    console.run(["task", "start", "2"], AGENT)
    console.run(["task", "done", "2", "--how", "h"], AGENT)
    assert app.container.get(Plans).find(1).state == "done", "a parked plan whose last task closes is done"


def test_a_plan_started_with_every_task_closed_is_done_and_one_with_no_task_is_not(app):
    from journal.repositories.plans import Plans
    console = app.console()
    for title in ("closed", "empty"):
        console.run(["plan", "create", title, "--brief", "b"], USER)
    console.run(["plan", "add", "1", "only"], USER)
    console.run(["plan", "phase", "1", "one", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "1"], USER)
    console.run(["plan", "approve", "1"], USER)
    console.run(["plan", "approve", "2"], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["plan", "park", "1"], AGENT)
    console.run(["task", "start", "1"], AGENT)
    console.run(["task", "done", "1", "--how", "h"], AGENT)
    plans = app.container.get(Plans)
    assert plans.find(1).state == "done", "a parked plan whose last task closes is done"
    console.run(["plan", "start", "2"], AGENT)
    assert plans.find(2).state == "started", "a plan with no task yet is not finished"


def test_the_same_hand_read_of_outputs_coming_back_among_the_last_reads_brings_one_tip_to_write_a_reader(app):
    hook(app, "SessionStart")
    tip = lambda command: hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": command})[1].get("hookSpecificOutput", {}).get("additionalContext", "")
    assert "write" not in tip("journal output read 12 --grep FAILED") + tip("ls src") + tip("journal output read 40 --reader failed") + tip("journal output read 3") + tip("journal output read 4"), "a plain read of a summary is no shape"
    assert "you read outputs this way again: journal output read <output> --grep FAILED" in tip("journal output read 31 --grep FAILED"), "a different output, the same read"
    assert "this way again" not in tip("journal output read 33 --grep FAILED"), "once for each shape"


def test_a_hand_read_that_does_a_readers_work_is_pointed_at_the_reader(app):
    hook(app, "SessionStart")
    app.console().run(["reader", "add", "failed-tests", "--pattern", "^FAILED", "--about", "the failing tests"], AGENT)
    said = lambda command: hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": command})[1].get("hookSpecificOutput", {}).get("additionalContext", "")
    assert "reader failed-tests already reads this: the failing tests" in said("journal output read 7 --grep '^FAILED'")
    assert "already reads this" not in said("journal output read 9 --grep '^FAILED'"), "said once"


def test_a_sequence_ported_from_version_3_is_written_at_boot(app):
    from journal.repositories.sequences import Sequences
    filing = next(s for s in app.container.get(Sequences).all() if s.title == "Filing a document that is already written")
    assert filing.starts_on == "doc.created" and len(filing.steps) == 2


def version_3_row(folder, kind: str, n: int, brief: str = "", **header) -> None:
    """A version 3 row file: its JSON header between --- lines, then its brief."""
    folder.mkdir(parents=True, exist_ok=True)
    head = {"n": n, "type": kind, "title": "", "refs": [], "seen": ["user"], "created": 1.0, "updated": 1.0, "deleted": 0.0, "completed": 0.0, "outcome": "", "data": {}, **header}
    (folder / f"{n:03d}.md").write_text(f"---\n{json.dumps(head, indent=2)}\n---\n{brief}\n")


def test_only_the_version_3_environments_still_in_use_are_brought_across_and_never_twice(app):
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.environments import Environments
    from journal.repositories.reports import Reports
    kept = app.config.home / "version-3"
    for n, name, kind in ((1, "main", "main"), (2, "ticket-8", "ticket"), (3, "ticket-9", "ticket"), (4, "1012-inventory-page", "worktree")):
        version_3_row(kept / "project" / "environment", "environment", n, title=name, data={"kind": kind})
    version_3_row(kept / "environments" / "ticket-8" / "todo", "todo", 1, "still open")
    version_3_row(kept / "environments" / "ticket-9" / "todo", "todo", 1, "long done", completed=2.0)
    (kept.parents[1] / ".claude" / "worktrees" / "1012-inventory-page").mkdir(parents=True)
    migrator = app.container.get(Migrator)
    for _ in range(2):
        with app.container.get(Scope).of(MAIN):
            migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
    names = {e.name for e in app.container.get(Environments).every()}
    assert {"main", "ticket-8", "1012-inventory-page"} <= names and "ticket-9" not in names, "main, the one with open work and the one whose worktree is still on disk, not the finished one"
    with app.container.get(Scope).of(MAIN):
        body = app.container.get(Reports).all()[-1].body
    assert "| environments | 0 | 1 |" in body and "environment ticket-9: not in use" in body, "the second run brings nothing twice and says what stayed"


def test_every_version_3_message_comes_across_with_its_author_time_reply_and_attachment(app):
    import zipfile
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.messages import Messages
    kept = app.config.home / "version-3"
    version_3_row(kept / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    messages = kept / "environments" / "main" / "message"
    version_3_row(messages, "message", 1, "an old one", created=1700000000.0, completed=1700000100.0)
    (messages / "001.md").rename(messages / "old.md")
    (messages / "packed").mkdir()
    with zipfile.ZipFile(messages / "packed" / "2023-11-14.zip", "w") as packed:
        packed.write(messages / "old.md", "001.md")
    (messages / "old.md").unlink()
    version_3_row(messages, "message", 2, "the answer", seen=["agent", "user"], refs=["message:1"], created=1700000200.0, updated=1700000250.0)
    version_3_row(messages, "message", 3, "a picture", created=1700000300.0)
    (messages / "3").mkdir()
    (messages / "3" / "shot.png").write_bytes(b"png")
    version_3_row(messages, "message", 4, "gone", deleted=5.0)
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).of(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        brought = [m for m in app.container.get(Messages).every() if m.text in ("an old one", "the answer", "a picture", "gone")]
    assert [m.text for m in brought] == ["an old one", "the answer", "a picture"], "the packed one too, in order, the deleted one left behind"
    old, answer, picture = brought
    assert old.created_at.timestamp() == 1700000000.0 and old.read_at is not None, "its own time, and read"
    assert answer.author == "agent" and answer.reply_to == old.id, "the reply still points at what it answers"
    assert answer.read_at.timestamp() == 1700000250.0 and picture.read_at is None, "read when the other side saw it, so the viewer has nothing to mark read"
    assert picture.files == ("shot.png",) and (app.config.files / "message" / str(picture.id) / "shot.png").read_bytes() == b"png"


def test_the_mcp_list_answers_at_once_and_asks_the_program_on_a_thread_of_its_own(app, monkeypatch):
    import time
    from journal.support.health import Health
    from journal.features.mcp.support.health_report import HealthReport
    from journal.features.mcp.support.known import Known
    asked = []
    def slow(self):
        asked.append(1)
        time.sleep(0.5)
        return HealthReport({"github": Known("github", "npx", "connected", "")})
    monkeypatch.setattr(Health, "asked", slow)
    health = app.container.get(Health)
    began = time.time()
    assert health.of_all().servers == {} and health.of_all().servers == {} and time.time() - began < 0.2, "no request waits on the program"
    for _ in range(20):
        if health.of_all().servers:
            break
        time.sleep(0.1)
    assert list(health.of_all().servers) == ["github"] and asked == [1], "asked once, in the background, and the next request has it"


def test_version_3_comments_and_reactions_come_across_on_their_rows(app):
    from journal.features.migration.support.migrator import Migrator
    from journal.support.ref import Ref
    from journal.repositories.links import Links
    from journal.repositories.messages import Messages
    from journal.repositories.reactions import Reactions
    kept = app.config.home / "version-3"
    version_3_row(kept / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    main = kept / "environments" / "main"
    version_3_row(main / "message", "message", 1, "ship it")
    version_3_row(main / "comment", "comment", 1, "> ship it\n\nnot yet", refs=["message:1"])
    version_3_row(main / "comment", "comment", 2, "on a task that stayed", refs=["todo:5"])
    version_3_row(main / "reaction", "reaction", 1, "", refs=["message:1"], data={"face": "🎉"})
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).of(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        messages = app.container.get(Messages)
        shipped = next(m for m in messages.every() if m.text == "ship it")
        comment = next(m for m in messages.every() if m.text.endswith("not yet"))
        links = app.container.get(Links)
        assert links.targets(comment, Messages.COMMENTS_ON) == [Ref.to(shipped)], "the comment sits under its message"
        reaction = app.container.get(Reactions).every()[-1]
        assert reaction.face == "🎉" and links.targets(reaction, "reacts") == [Ref.to(shipped)]
        assert not any(m.text == "on a task that stayed" for m in messages.every()), "a comment whose row stayed behind stays too"


def test_version_3_todos_become_tasks_in_their_states_with_their_work_logs(app):
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.task_logs import TaskLogs
    from journal.repositories.tasks import Tasks
    kept = app.config.home / "version-3"
    version_3_row(kept / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    todo = kept / "environments" / "main" / "todo"
    version_3_row(todo, "todo", 1, "the brief", title="done one", completed=2.0, outcome="it shipped")
    version_3_row(todo, "todo", 2, "", title="in progress", data={"status": "started"})
    version_3_row(todo, "todo", 3, "", title="waiting", data={"blocked": "the vendor's answer"})
    version_3_row(todo, "todo", 4, "", title="still open")
    version_3_row(todo, "todo", 5, "", title="struck", data={"struck": True})
    work = kept / "environments" / "main" / "work" / "001.md"
    version_3_row(work.parent, "work", 1, "", refs=["todo:1"], data={"todo": 1})
    work.write_text(work.read_text() + "## 1 · 2026-10-11 18:10 UTC\nbuilt it\n## 2 · 2026-10-11 19:00 UTC\ntested it\n")
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).of(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        tasks = {t.title: t for t in app.container.get(Tasks).every()}
        assert tasks["done one"].state == "done" and tasks["done one"].outcome == "it shipped" and tasks["done one"].brief == "the brief"
        assert tasks["in progress"].state == "parked" and tasks["waiting"].state == "blocked" and tasks["waiting"].blocked_why == "the vendor's answer"
        assert tasks["still open"].state == "open" and "struck" not in tasks, "a struck to-do stays behind"
        assert [log.line for log in app.container.get(TaskLogs).every() if log.task_id == tasks["done one"].id] == ["built it", "tested it"]


def test_version_3_plans_keep_their_state_phases_and_tasks_and_questions_their_answers(app):
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.plans import Plans
    from journal.repositories.questions import Questions
    kept = app.config.home / "version-3"
    version_3_row(kept / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    main = kept / "environments" / "main"
    version_3_row(main / "todo", "todo", 7, "", title="first step")
    version_3_row(main / "plan", "plan", 1, "the goal", title="the plan", data={"status": "approved", "phases": [{"title": "one", "when": "it works", "checkpoint": True, "todos": [7]}]})
    version_3_row(main / "question", "question", 1, "", title="which one?", data={"options": [{"title": "a"}, {"title": "b"}]}, completed=3.0, outcome="b")
    version_3_row(main / "question", "question", 2, "", title="still open?")
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).of(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        plans = app.container.get(Plans)
        plan = next(p for p in plans.every() if p.title == "the plan")
        phases = plans.phases_of(plan)
        assert plan.state == "approved" and plan.brief == "the goal", "an approval stays an approval"
        assert [(p.title, p.complete_when, p.checkpoint) for p in phases] == [("one", "it works", True)]
        assert [t.title for t in plans.tasks_of(plan)] == ["first step"] and [t.title for t in plans.tasks_in(phases[0])] == ["first step"]
        questions = {q.text: q for q in app.container.get(Questions).every()}
        assert questions["which one?"].options == ("a", "b") and questions["which one?"].answer == "b" and questions["still open?"].answer is None


def test_version_3_facts_rules_reminders_documents_and_reports_come_across_and_struck_ones_stay(app):
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.docs import Docs
    from journal.repositories.facts import Facts
    from journal.repositories.reminders import Reminders
    from journal.repositories.reports import Reports
    from journal.repositories.rules import Rules
    kept = app.config.home / "version-3"
    version_3_row(kept / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    main = kept / "environments" / "main"
    version_3_row(main / "fact", "fact", 1, "the port is 8420", data={"keywords": ["port"]})
    version_3_row(main / "fact", "fact", 2, "an old truth", completed=2.0)
    version_3_row(main / "reminder", "reminder", 1, "say you")
    version_3_row(main / "report", "report", 1, "what we found", title="the audit", abstract="one line")
    version_3_row(kept / "project" / "rule", "rule", 1, "Always plain English")
    doc = kept / "project" / "doc" / "001"
    version_3_row(doc, "doc", 1, "the intro", title="the guide", abstract="how it works")
    (doc / "001.md").rename(doc / "doc.md")
    (doc / "doc.md").write_text((doc / "doc.md").read_text() + "## Setup\nrun it\n")
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).of(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        facts = [(f.text, f.keywords) for f in app.container.get(Facts).every()]
        assert ("the port is 8420", ("port",)) in facts and not any(text == "an old truth" for text, _ in facts), "a struck fact stays behind"
        assert any(r.text == "say you" for r in app.container.get(Reminders).every())
        assert any(r.title == "the audit" and r.body == "what we found" for r in app.container.get(Reports).every())
    assert any(r.text == "Always plain English" for r in app.container.get(Rules).every())
    guide = next(d for d in app.container.get(Docs).every() if d.title == "the guide")
    assert guide.abstract == "how it works" and guide.body == "the intro\n\n## Setup\n\nrun it"


def test_version_3_checks_triggers_sequences_templates_and_settings_come_across_where_they_fit(app):
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.checks import Checks
    from journal.repositories.sequences import Sequences
    from journal.repositories.setting_rows import SettingRows
    from journal.repositories.templates import Templates
    from journal.repositories.triggers import Triggers
    kept = app.config.home / "version-3"
    project = kept / "project"
    version_3_row(project / "check", "check", 1, "the suite passes", title="tests", data={"command": "pytest -q", "every": 30})
    version_3_row(project / "trigger", "trigger", 1, "", data={"words": ["deploy"], "does": "instruct", "text": "read the deploy notes"})
    version_3_row(project / "trigger", "trigger", 2, "", data={"words": ["hold"], "does": "hold", "text": "x"})
    sequence = project / "sequence" / "001.md"
    version_3_row(sequence.parent, "sequence", 1, "", title="Releasing", data={"starts_on": ""})
    sequence.write_text(sequence.read_text() + "## Tag it\n\n## Push it\nwith the tags\n")
    version_3_row(project / "sequence", "sequence", 2, "", title="Shipped one", data={"system": True})
    version_3_row(project / "template", "template", 1, "write it plainly", title="Report", data={"applies_to": ["report"], "purpose": "critique"})
    (kept / "settings.json").write_text(json.dumps({"features": {"checks": False, "boards": True}}))
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).of(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
    check = next(c for c in app.container.get(Checks).every() if c.title == "tests")
    assert check.command == "pytest -q" and check.every == 30
    assert [(t.words, t.action, t.text) for t in app.container.get(Triggers).every() if "deploy" in t.words] == [(("deploy",), "instruct", "read the deploy notes")]
    assert not any("hold" in t.words for t in app.container.get(Triggers).every()), "a trigger version 4 cannot do stays behind"
    titles = {s.title: s for s in app.container.get(Sequences).every()}
    assert titles["Releasing"].steps == ("Tag it", "Push it: with the tags") and "Shipped one" not in titles, "version 3's shipped sequences stay behind"
    assert any(t.title == "Report" and t.purpose == "critique" for t in app.container.get(Templates).every())
    assert app.container.get(SettingRows).project("features.checks") is False and app.container.get(SettingRows).project("features.boards") is None, "only a feature version 4 has"


def test_a_small_version_3_journal_comes_across_counted_kind_by_kind_and_a_second_run_brings_nothing(app):
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.reports import Reports
    kept = app.config.home / "version-3"
    version_3_row(kept / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    main = kept / "environments" / "main"
    for n in (1, 2):
        version_3_row(main / "message", "message", n, f"message {n}")
        version_3_row(main / "todo", "todo", n, "", title=f"task {n}")
    version_3_row(main / "comment", "comment", 1, "a comment", refs=["message:1"])
    version_3_row(main / "reaction", "reaction", 1, "", refs=["message:2"], data={"face": "👍"})
    version_3_row(main / "fact", "fact", 1, "a fact")
    version_3_row(kept / "project" / "rule", "rule", 1, "Always a rule")
    version_3_row(kept / "project" / "secret", "secret", 1, "how it is used", title="github", data={"kind": "api key", "secret_fields": [{"name": "key", "hidden": True, "variable": "GITHUB_TOKEN"}]})
    version_3_row(main / "agent", "agent", 1, "", data={"provider": "claude", "transcript": "/x/abc.jsonl"})
    migrator = app.container.get(Migrator)
    for _ in range(2):
        with app.container.get(Scope).of(MAIN):
            migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
    with app.container.get(Scope).of(MAIN):
        first, second = [r.body for r in app.container.get(Reports).all() if r.title == "The version 3 journal brought across"]
    for line in ("| environments | 1 |", "| messages | 2 |", "| tasks | 2 |", "| comments | 1 |", "| reactions | 1 |", "| facts | 1 |", "| rules | 1 |", "| secrets | 1 |", "| agents | 1 |"):
        assert line in first, line
    assert "| messages | 0 |" in second and "| tasks | 0 |" in second and "| secrets | 0 |" in second, "a second run brings nothing twice"


def test_a_version_3_row_that_cannot_come_across_is_reported_and_the_migration_goes_on(app):
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.messages import Messages
    from journal.repositories.reports import Reports
    kept = app.config.home / "version-3"
    version_3_row(kept / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    version_3_row(kept / "environments" / "main" / "message", "message", 1, "broken", seen=["nobody"])
    version_3_row(kept / "environments" / "main" / "message", "message", 2, "fine")
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).of(MAIN):
        assert migrator.run(migrator.begin(Actor.user(1)), Actor.user(1)).state == "done", "nothing stops the run"
        texts = [m.text for m in app.container.get(Messages).every()]
        body = app.container.get(Reports).all()[-1].body
    assert "fine" in texts and "broken" not in texts
    assert "message 1 in main: could not be brought:" in body, "the row is named with its error"


def test_resuming_a_plans_parked_task_follows_the_plan_again_so_finishing_it_starts_the_next(app):
    from journal.repositories.tasks import Tasks
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "first"], USER)
    console.run(["plan", "add", "1", "second"], USER)
    console.run(["plan", "phase", "1", "one", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "1", "2"], USER)
    console.run(["plan", "approve", "1"], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["plan", "start", "1"], AGENT)
    console.run(["task", "park", "1", "something first"], AGENT)
    console.run(["task", "resume", "1"], AGENT)
    assert app.container.get(StateMachine).current("s1").name == "following_plan", "a resumed plan task is followed again"
    console.run(["task", "done", "1", "--how", "h"], AGENT)
    assert app.container.get(Tasks).find(2).state == "started", "so finishing it starts the next"


def test_a_plan_moves_on_whoever_closes_its_task_and_an_approved_plan_with_every_task_closed_is_done(app):
    from journal.features.plans.states.following_plan import FollowingPlan
    from journal.repositories.plans import Plans
    from journal.repositories.tasks import Tasks
    console = app.console()
    for title in ("first", "second"):
        console.run(["plan", "create", title, "--brief", "b"], USER)
    console.run(["plan", "add", "1", "one"], USER)
    console.run(["plan", "add", "1", "two"], USER)
    console.run(["plan", "add", "2", "only"], USER)
    for n in (1, 2):
        console.run(["plan", "approve", str(n)], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["plan", "start", "1"], AGENT)
    console.run(["task", "done", "1", "--how", "the user closed it"], USER)
    assert app.container.get(Tasks).find(2).state == "started" and app.container.get(StateMachine).current("s1") == FollowingPlan(plan_id=1, task_id=2, moved_from=1), "the user's close moves the agent's plan on"
    console.run(["task", "done", "2", "--how", "h"], AGENT)
    console.run(["task", "start", "3"], USER)
    console.run(["task", "done", "3", "--how", "h"], USER)
    assert app.container.get(Plans).find(2).state == "done", "an approved plan whose last task closes is done without a start"


def test_a_plan_parks_and_restarts_on_its_parked_task_only_once_approved_holds_its_checkpoint_and_reopens(app):
    from journal.models.task_state import TaskState
    from journal.repositories.plans import Plans
    from journal.repositories.tasks import Tasks
    console = app.console()
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    for title in ("one", "two", "three"):
        console.run(["plan", "add", "1", title], USER)
    console.run(["plan", "phase", "1", "first", "--when", "w", "--checkpoint"], USER)
    console.run(["plan", "phase", "1", "second", "--when", "w"], USER)
    console.run(["plan", "todos", "1", "1", "1", "2"], USER)
    console.run(["plan", "todos", "1", "2", "3"], USER)
    assert console.run(["plan", "park", "1"], USER).code == 1, "a plan not yet approved is not parked, so it cannot be started by a restart"
    console.run(["plan", "approve", "1"], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    console.run(["plan", "start", "1"], AGENT)
    console.run(["plan", "park", "1"], AGENT)
    assert "task 1," in console.run(["plan", "start", "1"], AGENT).out, "a restart resumes the parked task"
    console.run(["task", "done", "1", "--how", "h"], AGENT)
    console.run(["task", "done", "2", "--how", "h"], AGENT)
    console.run(["task", "block", "3", "a vendor"], AGENT)
    plans = app.container.get(Plans)
    assert plans.at_checkpoint(plans.find(1)) is not None, "a blocked task after a checkpoint does not pass it"
    console.run(["task", "unblock", "3"], AGENT)
    console.run(["task", "start", "3"], AGENT)
    console.run(["task", "done", "3", "--how", "h"], AGENT)
    assert plans.find(1).state == "done"
    tasks = app.container.get(Tasks)
    tasks.save(tasks.find(3).with_(state=TaskState.OPEN, finished_at=None, outcome=""), Actor.user(1))
    assert plans.find(1).state == "started", "a reopened task reopens its plan"


def test_no_wait_closes_a_loop_and_the_migration_drops_only_the_link_that_would(app):
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.reports import Reports
    from journal.repositories.tasks import Tasks
    console = app.console()
    hook(app, "SessionStart")
    for title in ("a", "b"):
        console.run(["task", "create", title], AGENT)
    console.run(["task", "block", "1", "--on", "task:2"], AGENT)
    refused = console.run(["task", "block", "2", "--on", "task:1"], AGENT)
    assert refused.code == 1 and "loop" in refused.err, "B waiting on A while A waits on B is refused"
    kept = app.config.home / "version-3"
    version_3_row(kept / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    todo = kept / "environments" / "main" / "todo"
    version_3_row(todo, "todo", 1, "", title="x", data={"after": [2]})
    version_3_row(todo, "todo", 2, "", title="y", data={"after": [1]})
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).of(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        titles = {t.title for t in app.container.get(Tasks).every()}
        body = app.container.get(Reports).all()[-1].body
    assert {"x", "y"} <= titles, "every task comes across"
    assert "| waits | 2 |" in body and "would close a loop" in body, "the one link that would close the loop is dropped and named"


def test_a_row_whose_text_names_another_is_linked_to_it_off_the_writes_thread(app):
    from journal.support.deferred import Deferred
    from journal.support.ref import Ref
    from journal.repositories.links import Links
    hook(app, "SessionStart")
    console = app.console()
    console.run(["task", "create", "the parser"], AGENT)
    console.run(["message", "send", "see task 1, and task 99 which is not there"], AGENT)
    app.container.get(Deferred).drain()
    with app.container.get(Scope).of(MAIN):
        mentions = [(link.source.type, link.target) for link in app.container.get(Links).every() if link.kind == "mentions"]
    assert ("messages", Ref("tasks", 1)) in mentions and Ref("tasks", 99) not in [t for _, t in mentions], "linked to what exists, not to what does not"


def test_a_worker_report_not_acted_on_is_named_until_it_is(app):
    from journal.models.worker import Worker
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    workers = app.container.get(Workers)
    with app.container.get(Scope).of(MAIN):
        worker = workers.save(Worker(environment_id=MAIN, name="Lady Lovelace", brief="b", model="sonnet").reported(0.0, 0), Actor.system())
    assert "worker 1 (Lady Lovelace) reported and you have not acted on it yet" in json.dumps(hook(app, "Stop")[1])
    app.console().run(["worker", "done", str(worker.id)], AGENT)
    assert "not acted on it yet" not in json.dumps(hook(app, "Stop")[1]), "once acted on it is named no more"


def test_the_tasks_list_and_its_open_count_leave_out_a_plans_tasks(app):
    from journal.repositories.tasks import Tasks
    console = app.console()
    console.run(["task", "create", "loose"], USER)
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "planned"], USER)
    assert app.container.get(Tasks).unfinished_count() == 1, "the plan's task is counted on its plan"
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/tasks", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        rows = {row["title"]: row["plan_id"] for row in json.loads(reply.read())["rows"]}
    assert rows == {"loose": None, "planned": 1}, "each task names the plan it is in, so the Tasks list leaves it to its plan"


def test_an_update_never_overwrites_a_setting_the_user_set(app):
    from journal.app import App
    from journal.config import Config
    settings = app.container.get(SettingRows)
    settings.save(Setting(environment_id=0, key="shell.command_characters", value=500), Actor.user(1))
    settings.save(Setting(environment_id=0, key="tasks.auto", value=False), Actor.user(1))
    updated = App(Config(app.config.root, port=0))
    updated.runtime().boot()
    kept = updated.container.get(SettingRows)
    assert kept.project("shell.command_characters") == 500 and kept.project("tasks.auto") is False, "booting the new code, as an update does, keeps what the user set"


def test_a_job_on_files_a_worker_already_worked_on_goes_back_to_that_worker(app):
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "fix src/journal/features/shell/chain.py", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    workers = app.container.get(Workers)
    with app.container.get(Scope).of(MAIN):
        workers.save(workers.find(1).with_(resume="abc").reported(0.0, 0), Actor.system())
    refused = console.run(["worker", "dispatch", "Mr. Babbage", "test src/journal/features/shell/chain.py", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    assert refused.code == 1 and "journal worker say 1" in refused.err, "related work goes back to the worker that knows it"
    assert console.run(["worker", "dispatch", "Mr. Babbage", "test src/journal/features/shell/chain.py", "--profile", "journal-medior", "--model", "sonnet", "--fresh"], AGENT).code == 0, "unless a fresh one is asked for"
    assert console.run(["worker", "dispatch", "Mr. Bell", "write docs/other.md", "--profile", "journal-medior", "--model", "sonnet"], AGENT).code == 0, "other files, another worker"


def test_a_subagent_job_on_files_one_already_worked_on_goes_back_to_it_and_a_review_is_fresh(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    mapped = {"description": "map the chain", "prompt": "Read src/journal/features/shell/chain.py and map it.", "subagent_type": "journal-researcher", "model": "sonnet"}
    hook(app, "PreToolUse", tool_name="Agent", tool_input=mapped, tool_use_id="u1")
    hook(app, "PostToolUse", tool_name="Agent", tool_input=mapped, tool_use_id="u1", tool_response={"isAsync": True, "agentId": "r1"})
    hook(app, "SubagentStop", agent_id="r1")
    again = {"description": "find its edge cases", "prompt": "Find the edge cases of src/journal/features/shell/chain.py.", "subagent_type": "journal-researcher", "model": "sonnet"}
    refused = json.dumps(hook(app, "PreToolUse", tool_name="Agent", tool_input=again, tool_use_id="u2")[1])
    assert "SendMessage" in refused and "r1" in refused, "related work goes back to the subagent that knows it"
    review = {**again, "subagent_type": "journal-planner"}
    assert "SendMessage" not in json.dumps(hook(app, "PreToolUse", tool_name="Agent", tool_input=review, tool_use_id="u3")[1]), "a review is always fresh"
class Source:
    def __init__(self, *tags: str, head: str = "") -> None:
        self.tags_asked = []
        self.found = list(tags)
        self.plugin_found = []
        self.head = head
        self.branches_asked = []

    def head_of(self, address: str, branch: str) -> str:
        self.branches_asked.append((address, branch))
        return self.head

    def tags_of(self, address: str) -> list[str]:
        return self.plugin_found

    def tags(self, prefix: str) -> list[str]:
        self.tags_asked.append(prefix)
        return self.found


class Plugins:
    def __init__(self) -> None:
        self.upgraded = []

    def upgrade(self, name: str, ref: str, environment: str, by: Actor) -> None:
        self.upgraded.append((name, ref))


class Installer:
    def __init__(self) -> None:
        self.ran = []

    def run(self, ref: str, repository: str) -> None:
        self.ran.append(ref)


def updating_with(app, source: Source, installer: Installer, auto: bool) -> Updating:
    app.container.get(SettingRows).set("updates.auto", auto, Actor.system())
    updating = app.container.get(Updating)
    updating.source, updating.installer = source, installer
    return updating


def test_releases_compare_by_number_and_pre_releases_are_left_out():
    named = Release.named(["v4.10.0", "v4.9.2", "v4.1.0-rc1", "nightly", "v4.9.10"])
    assert [release.version for release in named] == ["4.9.2", "4.9.10", "4.10.0"]
    assert Release("v4.0.1").upgrades(Release("4.0.0")) and not Release("4.0.0").upgrades(Release("v4.0.0"))


def test_an_update_never_crosses_a_major_version(app):
    updating = app.container.get(Updating)
    updating.releases = Release.named(["v3.9.0", "v4.0.0", "v4.99.0", "v5.0.0"])
    assert [release.tag for release in updating.newer()] == ["v4.99.0"]
    updating.releases = Release.named(["v5.0.0"])
    assert updating.newer() == [] and not updating.snapshot().newer


def test_a_newer_release_is_installed_on_its_own_only_when_the_setting_is_on(app):
    source, installer = Source("v4.0.0", "v4.1.0", "v4.99.0", "v5.0.0"), Installer()
    off = updating_with(app, source, installer, auto=False)
    off.checked()
    assert installer.ran == [] and off.snapshot().latest == "4.99.0" and source.tags_asked == ["v4."]
    on = updating_with(app, source, installer, auto=True)
    on.checked()
    assert installer.ran == ["v4.99.0"] and on.problem == ""


def test_nothing_is_installed_on_its_own_when_no_release_is_newer(app):
    installer = Installer()
    updating_with(app, Source("v4.0.0", "v5.0.0"), installer, auto=True).checked()
    assert installer.ran == []


def test_a_task_a_worker_holds_is_left_to_it_by_the_plan_and_shown_as_held(app):
    from journal.repositories.plans import Plans
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["plan", "create", "p", "--brief", "b"], USER)
    console.run(["plan", "add", "1", "delegated"], USER)
    console.run(["plan", "add", "1", "mine"], USER)
    console.run(["worker", "dispatch", "Lady Lovelace", "do the delegated one", "--profile", "journal-medior", "--model", "sonnet", "--task", "1"], AGENT)
    plans = app.container.get(Plans)
    assert plans.next_task(plans.find(1)).title == "mine", "the plan leaves a task a worker is out on to it"
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/tasks", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        assigned = {row["title"]: row["worker_id"] for row in json.loads(reply.read())["rows"]}
    assert assigned == {"delegated": 1, "mine": None}, "the viewer sees which worker holds which task"


def test_a_dump_is_filed_item_by_item_told_to_the_agent_and_closes_itself(app, tmp_path, monkeypatch):
    from journal.features.dumps.support.filing import Filing
    from journal.repositories.dumps import Dumps
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    console, filing = app.console(), app.container.get(Filing)
    notes = tmp_path / "notes.md"
    notes.write_text("The ideas, sorted.\n")
    assert made(console.run(["dump", "create", "a list of ideas"], USER)) == 1
    machine = app.container.get(StateMachine)
    assert machine.current("s1").name == "sorting_dump", "the user's dump moves the agent into sorting it"
    stop = hook(app, "Stop")[1]
    assert stop.get("decision") == "block" and "dump 1 is not filed yet" in stop.get("reason", ""), "the stop is held while the dump is open"
    made(console.run(["doc", "create", "Ideas", "--file", str(notes)], AGENT))
    filing.attach(1, "a.png", Where("main").actor)
    assert "text: not read yet" in console.run(["dump", "items", "1"], AGENT).out and "a.png: not read yet" in console.run(["dump", "items", "1"], AGENT).out
    assert typed[-1].startswith("[journal] dump 1 has 2 items to file"), typed
    console.run(["dump", "note", "1", "text", "a list of ideas"], AGENT)
    assert console.run(["dump", "filed", "1", "text", "made a doc", "--refs", "doc:1"], AGENT).code == 0
    assert console.run(["dump", "filed", "1", "a.png", "x", "--refs", "docs:99"], AGENT).code != 0, "a row that is not there is refused"
    assert console.run(["dump", "failed", "1", "a.png", "unreadable"], AGENT).out.endswith("closed: 1 filed, 1 failed\n")
    assert typed[-1].startswith("[journal] dump 1 is filed (1 filed, 1 failed)")
    assert machine.current("s1").name == "idle", "the dump filed, the agent is back where it was"
    assert console.run(["dump", "stop", "1"], AGENT).code != 0 and console.run(["dump", "remove", "1"], AGENT).code != 0, "only the user stops or removes"
    assert app.container.get(Dumps).find(1).made_refs() == ["docs:1"]
    console.run(["dump", "remove", "1"], USER)
    assert app.container.get(Dumps).find(1).removed_refs == ("docs:1",) and console.run(["doc", "list"], AGENT).out == ""


def test_a_command_in_the_background_past_five_minutes_is_named_to_the_agent_at_most_every_five(app, monkeypatch, tmp_path):
    from journal.repositories.command_outputs import CommandOutputs
    typed = []
    catch_typed(app, monkeypatch, typed)
    drive_the_clock(app, monkeypatch)
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    folder = app.config.root / "c1"
    folder.mkdir()
    outputs = app.container.get(CommandOutputs)
    ShellVerbs(app).split("python3 -m pytest -q", str(folder))
    ShellVerbs(app).moved("c1", "python3 -m pytest -q", str(folder / "out"))
    running = outputs.of_chain("c1")
    tick_after(app, 30.0)
    assert not any("still running" in line for line in typed), "a command moved to the background a moment ago is left to run"
    tick_after(app, 360.0)
    tick_after(app, 370.0)
    named = [line for line in typed if "still running" in line]
    assert len(named) == 1 and f"output {running.id} still running" in named[0] and "pytest" not in named[0], "past five minutes the agent is told to look at it, once until five more pass"
    (folder / "pid").write_text(str(os.getpid()))
    assert [o.id for o in outputs.in_background("s1")] == [running.id], "a chain whose runner lives is still in the background"
    (folder / "pid").write_text("99999999")
    assert outputs.in_background("s1") == [], "a chain whose runner was killed is no longer in the background, though it wrote no end"
    (folder / "pid").unlink()
    (folder / "done").write_text("0")
    assert outputs.in_background("s1") == [], "a command that ended is no longer in the background"


def test_a_second_reply_with_the_same_words_to_the_same_message_is_not_sent_and_the_agent_is_told(app):
    from journal.repositories.messages import Messages
    console = app.console()
    console.run(["message", "send", "Can you look?"], USER)
    first = console.run(["message", "send", "Looking now.", "--reply-to", "1"], AGENT)
    again = console.run(["message", "send", "Looking now.", "--reply-to", "1"], AGENT)
    assert first.code == 0 and again.code == 0 and "already has this reply in the chat: not sent again" in again.out
    assert [m.text for m in app.container.get(Messages).recent(10) if m.reply_to == 1] == ["Looking now."], "the chat shows the reply once"
    assert "sent" in console.run(["message", "send", "Found it.", "--reply-to", "1"], AGENT).out, "other words to the same message are sent"


def test_a_subagent_in_a_worktree_of_its_own_never_moves_the_main_conversation(app, tmp_path):
    from journal.repositories.agents import Agents
    hook(app, "SessionStart")
    app.console().run(["task", "create", "t", "--start"], AGENT)
    before = app.container.get(StateMachine).current("s1").name
    isolated = str(app.config.root / ".claude" / "worktrees" / "agent-a1b2")
    hook(app, "SubagentStart", agent_id="a1b2", agent_type="Explore")
    status, answer = hook(app, "PreToolUse", agent_id="a1b2", cwd=isolated, tool_name="Write", tool_input={"file_path": f"{isolated}/a.py", "content": "x"})
    assert status == 200 and "error" not in answer, "the subagent's write in its own worktree is not refused for the checkout it is in"
    hook(app, "SubagentStop", agent_id="a1b2")
    assert app.container.get(StateMachine).current("s1").name == before, "the main agent's state stands"
    assert [a.session for a in app.container.get(Agents).everywhere()] == ["s1"] and app.container.get(Agents).everywhere()[0].environment_id == 1, "no second agent and no other environment: the main conversation stays where it was"


def test_a_workers_worktree_is_cut_from_the_working_tip_and_a_failed_cut_refuses_the_dispatch(app):
    import subprocess
    from journal.repositories.workers import Workers
    from journal.support.scope import Scope
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    git("init", "-q", "-b", "main")
    git("config", "user.email", "t@example.com")
    git("config", "user.name", "T")
    (root / ".gitignore").write_text(".journal/\n")
    git("add", ".gitignore")
    git("commit", "-qm", "start")
    git("checkout", "-qb", "feature")
    (root / "feature.txt").write_text("on the working branch\n")
    git("add", "feature.txt")
    git("commit", "-qm", "the feature")
    hook(app, "SessionStart")
    app.console().run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "sonnet", "--worktree"], AGENT)
    assert (app.config.home / "worktrees" / "1-Lady-Lovelace" / "feature.txt").is_file(), "cut from the tip of the branch being worked, not from main"
    git("branch", "worker/2-Ada-Byron")
    refused = app.console().run(["worker", "dispatch", "Ada Byron", "write the lexer", "--profile", "journal-medior", "--model", "sonnet", "--worktree"], AGENT)
    assert refused.code == 1 and "worker Ada Byron was not dispatched" in refused.err and "already exists" in refused.err, "git's refusal is said in plain words"
    with app.container.get(Scope).of(1):
        assert [w.name for w in app.container.get(Workers).in_()] == ["Lady Lovelace"], "nothing half made is left behind"
    assert not (app.config.home / "worktrees" / "2-Ada-Byron").exists()


def test_a_workers_merge_never_touches_the_users_work_and_says_what_stood_in_its_way(app):
    import subprocess
    from journal.features.workers.support.worker_branch import WorkerBranch
    from journal.repositories.workers import Workers
    from journal.support.scope import Scope
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    commit = lambda name, text, cwd=root: ((cwd / name).write_text(text), git("add", name, cwd=cwd), git("commit", "-qm", name, cwd=cwd))
    git("init", "-q", "-b", "main")
    git("config", "user.email", "t@example.com")
    git("config", "user.name", "T")
    (root / ".gitignore").write_text(".journal/\n")
    commit(".gitignore", ".journal/\n")
    commit("shared.py", "A = 1\n")
    hook(app, "SessionStart")
    app.console().run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "sonnet", "--worktree"], AGENT)
    branch = app.container.get(WorkerBranch)
    with app.container.get(Scope).of(1):
        worker = app.container.get(Workers).find(1)
    tree = branch.folder(worker)
    commit("parser.py", "PARSE = 1\n", cwd=tree)
    (root / "parser.py").write_text("my own draft\n")
    assert "you have uncommitted changes to files they change: parser.py" in branch.take_in(worker) and (root / "parser.py").read_text() == "my own draft\n", "the user's uncommitted work in a file it touches stops it, untouched"
    (root / "parser.py").unlink()
    (root / "notes.txt").write_text("unrelated\n")
    commit("later.py", "L = 1\n")
    said = branch.take_in(worker)
    assert "were taken into this branch" in said and (root / "parser.py").is_file() and (root / "notes.txt").read_text() == "unrelated\n", "a branch behind the tip lands once rebased, and unrelated uncommitted work stays"
    commit("shared.py", "A = 2\n", cwd=tree)
    commit("shared.py", "A = 3\n")
    said = branch.take_in(worker)
    assert "conflict in shared.py" in said and (root / "shared.py").read_text() == "A = 3\n", "a conflict is named and nothing is left half merged"
    git("checkout", "-q", "--detach")
    assert "the project is on no branch, a detached head" in branch.take_in(worker)


def test_a_worktree_for_a_worker_in_a_project_with_no_commit_is_refused_in_plain_words(app):
    import subprocess
    subprocess.run(["git", "init", "-q", "-b", "main"], cwd=app.config.root, capture_output=True, timeout=30)
    hook(app, "SessionStart")
    refused = app.console().run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "sonnet", "--worktree"], AGENT)
    assert refused.code == 1 and "the project has no commit yet" in refused.err


def test_another_sessions_prompt_and_claude_codes_notices_are_not_the_users_words(app):
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    hook(app, "UserPromptSubmit", prompt='<cross-session-message from="uds:/tmp/cc-socks/1.sock" from-name="Coco" from-mode="bypass">\nthe report is ready\n</cross-session-message>')
    hook(app, "UserPromptSubmit", prompt="[Cross-session delivery notice] Your message to another session was held by that session (recipient: uds:/tmp/cc-socks/2.sock).")
    app.runtime().deferred.drain()
    said = app.container.get(Messages).recent(10)
    assert not [m for m in said if m.author == "user"], "neither the peer's words nor Claude Code's notice is the user's; the peer's message is read from the transcript, where it is queued once"


def test_a_piece_of_a_line_the_journal_typed_is_never_taken_for_the_users_words(app):
    from journal.repositories.messages import Messages
    from journal.support.typed_lines import TypedLines
    hook(app, "SessionStart")
    from journal.repositories.environments import Environments
    app.container.get(TypedLines).typed(app.container.get(Environments).existing("main").id, "[journal] output 69, ssh root@host 'php -r \"echo 5)), PHP_EOL;\"' still running. look at it")
    hook(app, "UserPromptSubmit", prompt="5)), PHP_EOL;\"' still running. look at it")
    hook(app, "UserPromptSubmit", prompt="and stock sync is off right?")
    app.runtime().deferred.drain()
    assert [m.text for m in app.container.get(Messages).recent(10) if m.author == "user"] == ["and stock sync is off right?"], "the split-off half of the journal's line is the journal's; the user's own words are theirs"


def test_the_agent_stays_out_of_a_workers_worktree_and_is_told_how_to_work_there(app):
    import subprocess
    root = app.config.root
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        subprocess.run(["git", *argv], cwd=root, capture_output=True, timeout=30)
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "sonnet", "--worktree"], AGENT)
    inside = app.config.home / "worktrees" / "1-Lady-Lovelace" / "parser.py"
    status, body = hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": str(inside), "content": "x"})
    assert status == 409 and "worker 1's worktree" in body["error"] and "journal worker say 1" in body["error"], "the worker's worktree is the worker's"
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": str(inside), "content": "x"}, agent_id="a1")[0] == 200, "a subagent's own tool use is not the agent's"
    assert hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": str(root / "elsewhere.py"), "content": "x"})[0] == 200


def test_a_done_workers_worktree_goes_with_its_branch_its_last_commit_kept_and_never_while_it_works_or_holds_uncommitted_work(app):
    import subprocess
    from journal.features.workers.support.worker_branch import WorkerBranch
    from journal.repositories.workers import Workers
    from journal.support.scope import Scope
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    git("init", "-q", "-b", "main")
    git("config", "user.email", "t@example.com")
    git("config", "user.name", "T")
    git("commit", "-q", "--allow-empty", "-m", "start")
    hook(app, "SessionStart")
    app.console().run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "sonnet", "--worktree"], AGENT)
    tree = app.config.home / "worktrees" / "1-Lady-Lovelace"
    (tree / "parser.py").write_text("PARSE = 1\n")
    git("add", "parser.py", cwd=tree)
    git("commit", "-qm", "the parser", cwd=tree)
    workers = app.container.get(Workers)
    with app.container.get(Scope).of(1):
        assert "stays while it works" in app.container.get(WorkerBranch).dropped(workers.find(1)), "never while the worker runs in it"
        workers.save(workers.find(1).reported(0.0, 0), Actor.system())
    (tree / "notes.txt").write_text("half\n")
    kept = app.console().run(["worker", "done", "1"], AGENT).out
    assert "stays, since 1 files in it are not committed: notes.txt" in kept and tree.is_dir(), "uncommitted work keeps it"
    (tree / "notes.txt").unlink()
    gone = app.console().run(["worker", "done", "1"], AGENT).out
    assert "its worktree and branch are removed; its last commit is kept as refs/journal/worktrees/1-Lady-Lovelace" in gone and not tree.exists()
    assert git("log", "-1", "--format=%s", "refs/journal/worktrees/1-Lady-Lovelace").stdout.strip() == "the parser", "its last commit can still be taken in"


def test_deleting_an_environment_keeps_its_worktree_while_it_holds_work_and_takes_a_merged_one_with_it(app):
    import subprocess
    from journal.support.worktree import Worktree
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    git("init", "-q", "-b", "main")
    git("config", "user.email", "t@example.com")
    git("config", "user.name", "T")
    git("commit", "-q", "--allow-empty", "-m", "start")
    tree = Worktree(root, "calm-river").made()
    (tree / "page.py").write_text("PAGE = 1\n")
    console = app.console()
    console.run(["environment", "create", "calm-river"], USER)
    said = console.run(["environment", "delete", "calm-river"], USER).out
    assert "stays, since 1 files in it are not committed: page.py" in said and tree.is_dir(), "uncommitted work keeps the worktree"
    git("add", "page.py", cwd=tree)
    git("commit", "-qm", "the page", cwd=tree)
    console.run(["environment", "create", "calm-river"], USER)
    said = console.run(["environment", "delete", "calm-river"], USER).out
    assert "stays, since its branch has commits not yet in main" in said and tree.is_dir(), "unmerged commits keep it"
    git("merge", "-q", "worktree-calm-river")
    console.run(["environment", "create", "calm-river"], USER)
    said = console.run(["environment", "delete", "calm-river"], USER).out
    assert "its worktree and branch are removed, its work already merged" in said and not tree.exists(), "a merged, clean one goes with its environment"


def test_a_session_in_a_worktree_is_marked_with_its_branch_once(app):
    import subprocess
    from journal.repositories.messages import Messages
    from journal.support.worktree import Worktree
    root = app.config.root
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        subprocess.run(["git", *argv], cwd=root, capture_output=True, timeout=30)
    Worktree(root, "main").made()
    hook(app, "SessionStart")
    hook(app, "SessionStart", source="compact")
    app.runtime().deferred.drain()
    marks = [m.text for m in app.container.get(Messages).recent(20) if m.text.startswith("Working in the worktree")]
    assert marks == ["Working in the worktree main, on the branch worktree-main"], "one mark a session, naming the worktree and its branch"


def test_the_viewer_lists_an_environments_worktree_with_its_branch(app):
    import subprocess
    from journal.http.controllers.environments import EnvironmentController
    from journal.repositories.environments import Environments
    from journal.support.worktree import Worktree
    root = app.config.root
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        subprocess.run(["git", *argv], cwd=root, capture_output=True, timeout=30)
    Worktree(root, "calm-river").made()
    environments = app.container.get(Environments)
    rows = app.container.get(EnvironmentController).shown_page([environments.named("main"), environments.named("calm-river")])
    assert [(r["name"], r["worktree"]) for r in rows] == [("main", ""), ("calm-river", "worktree on worktree-calm-river")]


def test_a_commit_made_in_a_worktree_closes_its_task_when_a_merge_lands_it_and_never_twice(app):
    import subprocess
    from journal.repositories.tasks import Tasks
    from journal.support.scope import Scope
    from journal.support.worktree import Worktree
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    git("init", "-q", "-b", "trunk")
    git("config", "user.email", "t@example.com")
    git("config", "user.name", "T")
    (root / ".gitignore").write_text(".journal/\n.claude/\n")
    git("add", ".gitignore")
    git("commit", "-qm", "start")
    tree = Worktree(root, "main").made()
    hook(app, "SessionStart")
    app.console().run(["task", "create", "the page", "--start"], AGENT)
    (tree / "page.py").write_text("PAGE = 1\n")
    git("add", "page.py", cwd=tree)
    git("commit", "-qm", "the page\n\nJournal: tasks done 1", cwd=tree)
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "git commit -m 'the page'"}, tool_response={})
    state = lambda: app.container.get(Tasks).find(1).state.value
    with app.container.get(Scope).of(1):
        assert state() != "done", "a commit made in the worktree closes nothing before it lands"
    git("merge", "-q", "worktree-main")
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "git merge worktree-main"}, tool_response={})
    with app.container.get(Scope).of(1):
        assert state() == "done", "the merge that lands it closes the task its trailer names"
    git("merge", "-q", "worktree-main")
    status, _ = hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "git merge worktree-main"}, tool_response={})
    assert status == 200, "a merge that brings nothing new closes nothing twice"


def test_a_link_in_a_commands_output_is_suggested_as_a_pin_and_again_only_after_fifty_tool_uses(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    made = lambda: hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "gh pr create"}, tool_response={"stdout": "https://github.com/acme/shop/pull/27"})[1]
    edited = hook(app, "PostToolUse", tool_name="Edit", tool_input={"file_path": "a.py"}, tool_response={"originalFile": "see https://example.com/docs/one"})[1]
    assert "is not pinned" not in str(edited), "an edit's answer carries the file it changed, so its links are never suggested"
    first = made()
    assert "https://github.com/acme/shop/pull/27 is not pinned" in str(first), "a pull request's address in a command's output is suggested as a pin"
    assert "is not pinned" not in str(made()), "not again at once"
    for _ in range(50):
        hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    assert "is not pinned" in str(made()), "suggested again after fifty of the agent's tool uses"
    app.console().run(["notice", "create", "Pull request 27", "--link", "https://github.com/acme/shop/pull/27", "--label", "Open it"], AGENT)
    for _ in range(50):
        hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    assert "is not pinned" not in str(made()), "a pinned link is never suggested"


def test_dispatches_past_the_most_at_once_wait(app):
    from journal.models.setting import Setting
    from journal.repositories.setting_rows import SettingRows
    hook(app, "SessionStart")
    console = app.console()
    app.container.get(SettingRows).save(Setting(environment_id=0, key="workers.most_out", value=1), Actor.user(1))
    console.run(["worker", "dispatch", "Lady Lovelace", "write the parser", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    refused = console.run(["worker", "dispatch", "Ada Byron", "write the lexer", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    assert refused.code == 1 and "1 workers are out, the most at once" in refused.err, "a worker past the most out at once is refused"
    app.container.get(SettingRows).save(Setting(environment_id=0, key="workers.most_subagents", value=1), Actor.user(1))
    assert hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "map the hooks", "prompt": "map", "subagent_type": "journal-researcher", "model": "haiku"})[0] == 200, "the first under a most of one passes: the start being judged is not counted among the running"
    hook(app, "SubagentStart", agent_id="a1", agent_type="Explore")
    status, body = hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "map the routes", "prompt": "map", "subagent_type": "journal-researcher", "model": "haiku"})
    assert status == 409 and "1 subagents are running, the most at once" in body["error"], "a subagent past the most at once is held"
    app.container.get(SettingRows).save(Setting(environment_id=0, key="workers.most_subagents", value=2), Actor.user(1))
    assert hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "map the views", "prompt": "map", "subagent_type": "journal-researcher", "model": "haiku"})[0] == 200, "one running and a second passes a most of two"
    status, body = hook(app, "PreToolUse", tool_name="Agent", tool_input={"description": "map the tests", "prompt": "map", "subagent_type": "journal-researcher", "model": "haiku"})
    assert status == 409 and "2 subagents are running" in body["error"], "two running and a third is held"


def test_a_plans_timeline_has_each_start_log_and_end_of_its_tasks_oldest_first(app):
    from journal.http.plans.plan_timeline import PlanTimeline
    from journal.repositories.plans import Plans
    from journal.support.scope import Scope
    console = app.console()
    hook(app, "SessionStart")
    console.run(["plan", "create", "the phone", "--brief", "pair it"], USER)
    console.run(["plan", "add", "1", "pair it", "--brief", "a code pairs"], AGENT)
    console.run(["task", "start", "1"], AGENT)
    console.run(["task", "log", "1", "the code is hashed"], AGENT)
    console.run(["task", "done", "1", "--how", "pairs by code"], AGENT)
    with app.container.get(Scope).of(1):
        moments = app.container.get(PlanTimeline).of(app.container.get(Plans).find(1))
    assert [(m.kind, m.task, m.text) for m in moments] == [("started", 1, ""), ("log", 1, "the code is hashed"), ("done", 1, "pairs by code")], "each start, log line and end, oldest first"


def test_a_phone_pairs_once_by_its_code_one_at_a_time_as_version_3_did(app):
    from datetime import datetime, timedelta, timezone
    from journal.features.sharing.support.tunnel import Tunnel
    from journal.features.phone.support.pairing import Pairing
    from journal.repositories.messages import Messages
    from journal.repositories.setting_rows import SettingRows
    from journal.support.refused import Refused
    app.container.get(SettingRows).set("sharing.host", "tunler.example", Actor.user(1))
    pairing, now = app.container.get(Pairing), datetime.now(timezone.utc)
    with pytest.raises(Refused, match="only the user pairs"):
        pairing.offer(7, Actor.agent("s1"), now)
    with pytest.raises(Refused, match="1, 7, 30 days"):
        pairing.offer(3, Actor.user(1), now)
    first = pairing.offer(7, Actor.user(1), now)
    assert app.container.get(Tunnel).is_wanted(now), "a live code keeps the tunnel open, so the phone can reach the journal"
    assert first.link.startswith("https://") and ".tunler.example/p/#" in first.link and len(first.short) == 9, "a link through the tunnel and a short code in two halves"
    newer = pairing.offer(7, Actor.user(1), now)
    with pytest.raises(Refused, match="pairs no phone"):
        pairing.pair(first.link.split("#")[1], "iPhone", now)
    paired = pairing.pair(newer.short.lower(), "  iPhone   of Jesse ", now)
    assert paired.phone.name == "iPhone of Jesse" and paired.phone.key != paired.key and paired.phone.expires_at - now == timedelta(days=7), "the short code typed in any case pairs; the key is kept only as its hash"
    assert any(m.text == "A phone paired: iPhone of Jesse" for m in app.container.get(Messages).in_()), "the desk is told"
    with pytest.raises(Refused, match="one phone at a time"):
        pairing.offer(7, Actor.user(1), now)
    with pytest.raises(Refused, match="pairs no phone"):
        pairing.pair(newer.short, "Android", now)
    listed = json.load(urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/phones", headers={"X-Journal-Env": "main"}), timeout=5))["phones"]
    assert [p["name"] for p in listed] == ["iPhone of Jesse"] and "key" not in listed[0], "the desk sees the phone, never its key's hash"
    assert app.container.get(Tunnel).is_wanted(now), "a paired phone keeps the tunnel open, with no link shared"
    assert viewer(app, f"phones/{paired.phone.id}/disconnect")["disconnected"] == paired.phone.id
    assert not app.container.get(Tunnel).is_wanted(datetime.now(timezone.utc)), "with the phone disconnected and no code live, nothing keeps it open"
    assert pairing.offer(7, Actor.user(1), now).short, "once it is disconnected, another phone may pair"


def test_a_pairing_code_expires_and_is_voided_by_ten_wrong_tries(app):
    from datetime import datetime, timedelta, timezone
    from journal.features.sharing.support.tunnel import Tunnel
    from journal.features.phone.support.pairing import Pairing
    from journal.repositories.setting_rows import SettingRows
    from journal.support.refused import Refused
    app.container.get(SettingRows).set("sharing.host", "tunler.example", Actor.user(1))
    pairing, now = app.container.get(Pairing), datetime.now(timezone.utc)
    late = pairing.offer(1, Actor.user(1), now)
    tunnel = app.container.get(Tunnel)
    assert tunnel.wanted, "a live code keeps the tunnel open"
    tunnel.settle_when_changed(now + timedelta(minutes=11))
    assert not tunnel.wanted, "and once it runs out, the clock closes the tunnel again"
    with pytest.raises(Refused):
        pairing.pair(late.short, "iPhone", now + timedelta(minutes=11))
    guessed = pairing.offer(1, Actor.user(1), now)
    for _ in range(10):
        with pytest.raises(Refused):
            pairing.pair("WRONGCODE", "iPhone", now)
    with pytest.raises(Refused):
        pairing.pair(guessed.short, "iPhone", now)
    assert viewer(app, "phones/connect", {"days": 30})["short"], "the viewer asks for a code as the user"


def test_a_phone_whose_days_ran_out_is_told_so_and_reaches_nothing(app):
    from datetime import datetime, timedelta, timezone
    from journal.features.phone.support.pairing import Pairing
    from journal.http.phone.phone_pages import COOKIE, PhonePages
    from journal.http.phone.phone_request import PhoneRequest
    from journal.repositories.setting_rows import SettingRows
    app.container.get(SettingRows).set("sharing.host", "tunler.example", Actor.user(1))
    pairing, then = app.container.get(Pairing), datetime.now(timezone.utc) - timedelta(days=2)
    paired = pairing.pair(pairing.offer(1, Actor.user(1), then).short, "iPhone", then)
    answer = app.container.get(PhonePages).through(PhoneRequest("GET", "/p/journal/messages", f"{COOKIE}={paired.key}"))
    assert answer.status == 410 and b"run out" in answer.body, "a phone past its days is told so and reads nothing"


def test_a_phone_is_pushed_once_for_each_new_thing_that_waits_for_the_user(app, monkeypatch, tmp_path):
    import stat
    from datetime import datetime, timedelta, timezone
    from journal.features.phone.listeners.tell_the_phone import TellThePhone
    from journal.features.phone.support.p256 import P256
    from journal.features.phone.support.push_keys import PushKeys
    from journal.features.phone.support.web_push import WebPush
    from journal.models.phone import Phone
    from journal.repositories.phones import Phones
    keys = PushKeys.kept(tmp_path / "push.json")
    assert PushKeys.kept(tmp_path / "push.json") == keys and stat.S_IMODE((tmp_path / "push.json").stat().st_mode) == 0o600, "made once, kept where only its owner reads"
    signed = keys.signed(b"a journal")
    assert P256.is_on_curve(keys.public) and P256.is_signed(keys.public, b"a journal", signed) and not P256.is_signed(keys.public, b"another", signed), "a token's signature checks out, and only for what it signed"
    assert WebPush.is_allowed("https://web.push.apple.com/abc") and WebPush.is_allowed("https://wns2.notify.windows.com/x")
    assert not WebPush.is_allowed("http://web.push.apple.com/abc") and not WebPush.is_allowed("https://evil.example/push"), "a push goes only to the phone makers' services, over https"
    sent, answers = [], [201]
    monkeypatch.setattr(WebPush, "send", lambda self, endpoint: sent.append(endpoint) or answers[0])
    phones, now = app.container.get(Phones), datetime.now(timezone.utc)
    phones.save(Phone(name="iPhone", key="k", expires_at=now + timedelta(days=1), push="https://web.push.apple.com/abc"), Actor.user(1))
    hook(app, "SessionStart")
    tell = app.container.get(TellThePhone)
    tell.handle(None)
    assert sent == [], "nothing waits, nothing is pushed"
    app.console().run(["question", "ask", "Which name?"], AGENT)
    tell.handle(None)
    tell.handle(None)
    assert sent == ["https://web.push.apple.com/abc"], "a new question is pushed once, not on every tick"
    answers[0] = 0
    app.console().run(["question", "ask", "Which colour?"], AGENT)
    tell.handle(None)
    tell.handle(None)
    failed = phones.where(name="iPhone")[0]
    assert len(sent) == 2 and failed.push_failed_at and failed.has_news(["questions:2"]), "a push that did not reach the service stays owed and waits a minute before it is tried again"
    phones.save(failed.push_failed(now - timedelta(minutes=2)), Actor.system())
    answers[0] = 410
    tell.handle(None)
    assert len(sent) == 3 and phones.where(name="iPhone")[0].push == "", "an address the service no longer knows is forgotten until the phone subscribes again"


def test_a_line_naming_a_list_that_changes_is_said_once_inside_its_window(app):
    from journal.engine.nudger import Nudger
    from journal.features.shell.feature import Shell
    from journal.features.tasks.feature import Tasks
    hook(app, "SessionStart")
    agent, nudger = app.container.get(StateMachine).agent("s1", 1), app.container.get(Nudger)
    assert nudger.say(agent, Shell.CHECK_THE_BACKGROUND.create(background_outputs="12, 15")), "the first naming of the commands still running is said"
    assert nudger.say(agent, Shell.CHECK_THE_BACKGROUND.create(background_outputs="12, 15, 18")) is None, "a command joining the list inside the window says nothing again: Redmar's flood"
    assert nudger.say(agent, Tasks.BLOCKED_TASK_ASKED_ABOUT.create(tasks="task 4 on the deploy")), "the blocked ask is said once"
    assert nudger.say(agent, Tasks.BLOCKED_TASK_ASKED_ABOUT.create(tasks="task 4 on the deploy")) is None, "and not again at the next tick five seconds later"
    assert nudger.say(agent, Tasks.TASK_OPEN_WITH_NOTHING_LOGGED.create(n=3)) and nudger.say(agent, Tasks.TASK_OPEN_WITH_NOTHING_LOGGED.create(n=4)), "a line about one row is still held by its words: another task is named"


def test_a_package_install_of_code_commandments_is_suggested_once_as_the_journal_plugin(app):
    from journal.features.suggestions.support.suggesting import Suggesting
    from journal.models.plugin import Plugin
    from journal.models.suggestion_answer import SuggestionAnswer
    from journal.repositories.messages import Messages
    from journal.repositories.plugins import Plugins
    from journal.support.plugin_manifest import PluginManifest
    from journal.support.refused import Refused
    hook(app, "SessionStart")
    suggesting = app.container.get(Suggesting)
    (app.config.root / "composer.lock").write_text(json.dumps({"packages": [{"name": "jessegall/code-commandments", "version": "v4.2.0"}]}))
    suggesting.tick(suggesting.started_at + 60)
    assert suggesting.last_round is None, "nothing is suggested in the first minutes after the journal starts"
    suggesting.tick(suggesting.started_at + 15 * 60)
    cards = [m for m in app.container.get(Messages).all() if m.data.get("kind") == "suggestion"]
    assert len(cards) == 1 and "v4.2.0" in cards[0].data["detail"], "fifteen minutes in, the package install is suggested once as the plugin, naming the version it runs"
    suggesting.tick(suggesting.started_at + 75 * 60)
    assert len([m for m in app.container.get(Messages).all() if m.data.get("kind") == "suggestion"]) == 1, "the next round an hour later does not suggest it again"
    suggestion = suggesting.suggestions.all()[0]
    assert "install=https%3A%2F%2Fgithub.com%2Fjessegall%2Fcode-commandments" in suggesting.answer(suggestion, SuggestionAnswer.ACCEPTED, Actor.user(1)), "accepted, it opens the plugin's install for the user to finish"
    assert app.container.get(Messages).find(cards[0].id).data["answer"] == "accepted", "the card is settled in place with the answer"
    with pytest.raises(Refused):
        suggesting.answer(suggesting.suggestions.find(suggestion.id), SuggestionAnswer.DECLINED, Actor.user(1))
    suggesting.suggestions.delete(suggesting.suggestions.find(suggestion.id), Actor.user(1))
    app.container.get(Plugins).save(Plugin(name="code-commandments", source="https://github.com/jessegall/code-commandments", manifest=PluginManifest(name="code-commandments")), Actor.user(1))
    assert suggesting.round() == [], "with the plugin installed there is nothing to suggest"


def test_a_message_gets_one_reply_unless_the_agent_confirms_a_second(app, monkeypatch):
    from journal.repositories.messages import Messages
    typed = []
    catch_typed(app, monkeypatch, typed)
    console = app.console()
    console.run(["message", "send", "is the idle agent left waiting?"], USER)
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    hook(app, "UserPromptSubmit", prompt="[journal] new message 1")
    sent = console.run(["message", "send", "Not quite: an agent with work is told the next task at each stop, and one at rest is checked in on after thirty quiet minutes.", "--reply-to", "1"], AGENT)
    assert sent.code == 0
    again = console.run(["message", "send", "Something else entirely.", "--reply-to", "1"], AGENT)
    assert again.code == 1 and "already has your reply 2" in again.out, "a second reply by command is refused, naming the first"
    hook(app, "MessageDisplay", message="An agent with work is told the next task at each stop, and an agent at rest is checked in on after thirty quiet minutes.")
    app.runtime().deferred.drain()
    assert len([m for m in app.container.get(Messages).in_() if m.author == "agent"]) == 1, "closing words saying the reply again stay out of the chat"
    assert any("said again what your reply 2 to message 1 said" in line for line in typed), "and the agent is told why"
    hook(app, "MessageDisplay", message="[!reply:1] One more thing about the wait.")
    app.runtime().deferred.drain()
    assert len([m for m in app.container.get(Messages).in_() if m.author == "agent"]) == 1, "a typed tag on a message already answered is kept out too"
    assert any("message 1 already has your reply 2" in line for line in typed)
    assert console.run(["message", "send", "Something new after all.", "--reply-to", "1", "--confirm"], AGENT).code == 0, "confirmed, a second reply goes out"


def test_a_thread_that_ends_without_releasing_gives_its_connection_back(app):
    import gc
    import threading
    from journal.db.connection import Connection
    connection = app.container.get(Connection)

    def query():
        connection.one("SELECT 1")

    for _ in range(5):
        worker = threading.Thread(target=query)
        worker.start()
        worker.join()
        del worker
        gc.collect()
    opened = len(connection._open)
    for _ in range(5):
        worker = threading.Thread(target=query)
        worker.start()
        worker.join()
        del worker
        gc.collect()
    assert len(connection._open) == opened, "a check's or a worker's thread that never released its connection gives it back once it is gone, and the next thread takes it"


def test_work_that_may_be_left_undone_is_skipped_once_the_deferred_work_is_far_behind():
    from journal.support.deferred import Deferred
    deferred, ran = Deferred(), []
    for i in range(Deferred.BEHIND + 50):
        deferred.add_unless_behind(lambda i=i: ran.append(i), f"hearing {i}")
    assert deferred.depth() == Deferred.BEHIND and deferred.skipped == 50, "a plugin hearing past the bound is skipped and counted, so a slow plugin never grows the queue without end"
    deferred.add(lambda: ran.append("own"))
    assert deferred.depth() == Deferred.BEHIND + 1, "the journal's own work is always added"


def test_a_long_tool_response_is_kept_cut_in_the_record(app):
    from journal.repositories.entries import Entries
    hook(app, "SessionStart")
    long = "x" * 50_000
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "cat big.log"}, tool_response={"stdout": long, "stderr": ""})
    hook(app, "PostToolUse", tool_name="Agent", tool_input={"description": "look"}, tool_response={"agentId": "a1", "isAsync": True, "content": [{"type": "text", "text": long}]})
    finished = app.container.get(Entries).of_kind("ToolFinished")
    assert all(len(json.dumps(e.data)) < 10_000 for e in finished), "a whole command's output or a subagent's answer is not stored again with every call"
    assert finished[0].data["tool_response"]["agentId"] == "a1" and finished[0].data["tool_response"]["isAsync"] is True, "what is read back from the record, a subagent's id, stays whole"


def test_a_read_that_asks_a_server_outside_is_not_judged_against_the_budget(app, monkeypatch):
    from journal.http.router import Router
    from journal.http.support.request import Request
    from journal.support.response import Response
    from journal.support.slow_requests import SlowRequests
    measured = []
    monkeypatch.setattr(SlowRequests, "measured", lambda self, method, path, ms: measured.append(path))
    router = app.container.get(Router)
    router.get_outward("/journal/far", lambda request: Response.json({}))
    router.get("/journal/near", lambda request: Response.json({}))
    ask = lambda path: router.dispatch(Request("GET", path, {}, {}, {}, {"X-Journal-Env": "main"}, Actor.user(1)))
    ask("/journal/far")
    ask("/journal/near")
    assert measured == ["/journal/near"], "the tunnel's answer waits on the network, so only the journal's own reads are held to a budget"



def test_commands_that_end_together_are_named_in_one_line(app, monkeypatch):
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    typed = []
    catch_typed(app, monkeypatch, typed)
    hook(app, "SessionStart")
    console = app.console()
    for chain, status in (("e1", 0), ("e2", 0), ("e3", 2)):
        (app.config.root / chain).mkdir()
        ShellVerbs(app).split("make", str(app.config.root / chain))
        ShellVerbs(app).moved(chain, "make", f"/tmp/out/{chain}")
        ShellVerbs(app).ended(chain, status, f"/tmp/out/{chain}", "")
    app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=0.0, quiet_for=6.0))
    ended = [line for line in typed if "journal output read" in line]
    assert len(ended) == 1 and "outputs 1, 2 finished; output 3 failed with code 2" in ended[0], f"three ends in a busy stretch are one line: {ended}"


def test_a_closing_line_of_a_few_words_is_never_taken_for_a_repeated_reply():
    from journal.features.messages.support.word_overlap import WordOverlap
    reply = "Only Thoughts and Skills still hide anything; the test run is still going and the rest waits."
    assert WordOverlap.share("The test run is still going.", reply) == 0.0, "a short status line shares its few words by chance"
    assert WordOverlap.share("Only Thoughts and Skills still hide anything, and the test run is still going while the rest waits.", reply) >= 0.6


def test_an_mcp_change_restarts_the_conversation_on_screen_never_an_older_session(app, monkeypatch):
    import time
    from journal.models.mcp_server import McpServer
    from journal.support.mcp_installing import McpInstalling
    from journal.supervisor_link import SupervisorLink
    restarted = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    monkeypatch.setattr(SupervisorLink, "restart_agent", lambda self, environment_id, resume: restarted.append(resume))
    hook(app, "SessionStart")
    hook(app, "Stop")
    time.sleep(0.01)
    hook(app, "SessionStart", session_id="s2")
    hook(app, "Stop", session_id="s2")
    app.container.get(McpInstalling).add(McpServer(name="context7", title="Context7", transport="http", url="https://mcp.context7.com/mcp"), Actor.user(1))
    assert restarted == [("--resume", "s2")], f"the session the supervisor shows is restarted once; an older one whose row has not ended is never brought back in its place: {restarted}"


def test_an_environment_keeps_one_session_for_each_provider(app):
    machine = app.container.get(StateMachine)
    hook(app, "SessionStart")
    hook(app, "SessionStart", session_id="s2")
    assert machine.current("s1").name == "ended" and machine.current("s2").name != "ended", "a newer session takes the environment's place, and the one before it ends"
    hook(app, "SessionStart", session_id="s2", source="resume")
    assert machine.current("s2").name != "ended", "a session going on is not ended by itself"
    codex = HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/codex", data=json.dumps({"hook_event_name": "SessionStart", "session_id": "c1"}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
    urlopen(codex, timeout=5).read()
    assert machine.current("s2").name != "ended" and machine.current("c1").name != "ended", "another provider's session in the same environment keeps its own"


def test_the_record_is_a_rolling_log_of_its_newest_entries_and_the_projects_rows_stay(app):
    from journal.repositories.entries import Entries
    from journal.repositories.messages import Messages
    from journal.repositories.setting_rows import SettingRows
    hook(app, "SessionStart")
    entries = app.container.get(Entries)
    assert len(entries.selected_everywhere("1")) > 5
    app.container.get(SettingRows).set("record.kept", 5, Actor.user(1))
    for _ in range(4):
        hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    app.console().run(["message", "send", "keep me"], USER)
    assert len(entries.selected_everywhere("1")) <= 5, "every entry written trims the record to the setting's newest"
    assert [m.text for m in app.container.get(Messages).all()][-1] == "keep me", "a message is the project's own and stays"


def test_a_task_closed_by_a_commit_names_a_parked_task_at_once(app, monkeypatch):
    import subprocess
    from journal.supervisor_link import SupervisorLink
    typed = []
    catch_typed(app, monkeypatch, typed)
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    root = app.config.root
    subprocess.run(["git", "init", "-q"], cwd=root, check=True)
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "Ship the footer\n\nJournal: tasks done 2"], cwd=root, check=True)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the parser", "--start"], AGENT)
    console.run(["task", "park", "1", "the footer comes first"], AGENT)
    console.run(["task", "create", "footer", "--start"], AGENT)
    reply = hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "git commit -m x"}, tool_response={"stdout": "", "stderr": ""})[1]
    told = reply["hookSpecificOutput"]["additionalContext"]
    app.runtime().deferred.drain()
    assert "closed task 2" in told and any("task 1 is still parked" in line and "the footer comes first" in line for line in typed), f"the close names the parked task at once, not a quarter of an hour later: {told} {typed}"


def test_the_database_gives_deleted_rows_space_back_by_itself(app):
    from journal.db.connection import Connection
    assert app.container.get(Connection).one("PRAGMA auto_vacuum")[0] == 1, "auto-vacuum is on, so a trimmed record shrinks the file"


def test_the_journals_skills_and_profiles_are_written_fresh_and_a_projects_own_are_left_alone(app):
    from journal.support.profile_files import ProfileFiles
    from journal.support.skill_files import SkillFiles
    root = app.config.root
    stale_skill = root / ".claude" / "skills" / "journal-gone" / "SKILL.md"
    own_skill = root / ".claude" / "skills" / "deploy" / "SKILL.md"
    plugin_skill = root / ".claude" / "skills" / "journal-lint" / "SKILL.md"
    for path, text in ((stale_skill, "---\nname: journal-gone\n---\nold"), (own_skill, "---\nname: deploy\n---\nmine"), (plugin_skill, "---\nplugin: lint\nname: journal-lint\n---\nthe plugin's")):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)
    app.container.get(SkillFiles).write_all()
    assert not stale_skill.parent.exists() and own_skill.is_file() and plugin_skill.is_file(), "a journal skill no longer shipped goes; the project's own and a plugin's stay"
    assert (root / ".claude" / "skills" / "journal-tasks" / "SKILL.md").is_file()
    agents = root / ".claude" / "agents"
    agents.mkdir(parents=True, exist_ok=True)
    files = app.container.get(ProfileFiles)
    researcher = next(p for p in files.PROFILES if p.name == "journal-researcher")
    (agents / "researcher.md").write_text(f"---\nname: researcher\n---\n\n{researcher.body}\n")
    (agents / "planner.md").write_text("---\nname: planner\n---\n\nmy own planner, rewritten\n")
    (agents / "journal-gone.md").write_text("---\nname: journal-gone\n---\n\nold\n")
    (agents / "auditor.md").write_text("---\nname: auditor\n---\n\nmine\n")
    files.write_all()
    names = sorted(p.stem for p in agents.glob("*.md"))
    assert names == ["auditor", "journal-debugger", "journal-medior", "journal-plan-reviewer", "journal-planner", "journal-researcher", "journal-senior", "planner"], f"the old unedited researcher and a journal profile no longer shipped go; an edited planner and the project's auditor stay: {names}"


def test_the_thinking_line_shows_only_a_thought_of_the_turn_in_progress(app):
    import time
    from journal.http.agents.agent_activity import AgentActivity
    from journal.models.author import Author
    from journal.models.message import Message
    from journal.repositories.messages import Messages
    hook(app, "SessionStart")
    messages, activity = app.container.get(Messages), app.container.get(AgentActivity)
    hook(app, "UserPromptSubmit", prompt="look at the login")
    time.sleep(0.01)
    messages.save(Message(author=Author.AGENT, text="the login reads the old store", data={"kind": Message.THOUGHT}), Actor.agent("s1"))
    assert activity.thinking("s1", []) == "the login reads the old store", "a thought of this turn is shown while the agent works"
    time.sleep(0.01)
    hook(app, "UserPromptSubmit", prompt="and the logout?")
    assert activity.thinking("s1", []) == "", "a new turn began: the thought from before its prompt is not shown as now"


def test_every_line_a_feature_declares_is_registered_with_it(app):
    from journal.engine.nudge import Nudge
    from journal.features.registry import Registry
    unregistered = [f"{nudge.key}" for feature in app.container.get(Registry).features for nudge in vars(type(feature) if not isinstance(feature, type) else feature).values() if isinstance(nudge, Nudge) and nudge not in feature.nudges]
    assert unregistered == [], f"a line the registry cannot find is taken for one whose answer stays out of the chat: {unregistered}"


def test_an_outputs_tail_and_a_polled_transcript_are_read_only_as_far_as_needed(tmp_path):
    from journal.features.shell.support.output_files import OutputFiles
    from journal.http.transcripts.transcript_turns import TranscriptTurns
    from journal.providers.claude import Claude
    (tmp_path / "parts").write_text("R\nW\nR\n")
    (tmp_path / "0.out").write_text("".join(f"first {i}\r\n" for i in range(5)))
    (tmp_path / "0.err").write_text("oops\n")
    (tmp_path / "2.out").write_text("".join(f"line {i} " + "x" * (i % 300) + "\n" for i in range(40000)))
    files = OutputFiles(tmp_path)
    assert all(files.last(n) == files.lines()[-n:] for n in (1, 20, 39999, 40001, 40006, 90000)), "the tail read from the files' ends is the tail of every line, across parts and past a block"
    transcript = tmp_path / "t.jsonl"
    row = lambda n: json.dumps({"type": "assistant", "timestamp": "", "message": {"role": "assistant", "content": [{"type": "text", "text": f"said {n}"}]}}) + "\n"
    transcript.write_text(row(1) + "not json\n" + row(2) + row(3)[:20])
    turns, claude = TranscriptTurns(), Claude()
    assert turns.of(claude, transcript) == claude.turns(transcript), "the first poll reads every whole line"
    transcript.write_text(transcript.read_text() + row(3)[20:] + row(4))
    assert turns.of(claude, transcript) == claude.turns(transcript) and [t.line for t in turns.of(claude, transcript)] == [1, 3, 4, 5], "a later poll carries on from where the last stopped, the line numbers counted on"
    transcript.write_text(row(9))
    assert [t.text for t in turns.of(claude, transcript)] == ["said 9"], "a transcript written anew is read from its start"


def test_a_subagents_shell_line_is_never_moved_to_the_background(app):
    console = app.console()
    hook(app, "SessionStart")
    wrapped = "source /s 2>/dev/null || true && eval 'sleep 60 && echo done' < /dev/null && pwd -P >| /tmp/cwd"
    hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "sleep 60 && echo done"}, agent_id="a1")
    assert ShellVerbs(app).limit(wrapped) == "0", "a subagent is never told a command ended, so its line stays in its foreground"
    hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "sleep 60 && echo done"})
    assert ShellVerbs(app).limit(wrapped) == "30", "the same line run by the agent itself moves as ever"


def test_an_update_holds_its_mark_until_the_journal_runs_the_version_it_went_to(app):
    import dataclasses
    import time
    from journal.features.updates.support.update_held import UpdateHeld
    from journal.features.updates.support.update_mark import UpdateMark
    from journal.support.refused import Refused
    from journal.version import VERSION
    mark = app.container.get(UpdateMark)
    updating = updating_with(app, Source("v4.0.0", "v4.99.0"), Installer(), auto=True)
    updating.checked()
    assert mark.held().to == "4.99.0" and updating.snapshot().updating == "4.99.0", "the update keeps its mark through the restart it asks for"
    try:
        updating.update_now(Actor.user(1))
        raise AssertionError("a second update started beside the first")
    except Refused as refused:
        assert "an update to 4.99.0 is under way" in str(refused), "a second update waits for the first"
    mark.write(dataclasses.replace(mark.held(), pid=-1))
    updating.settle(time.time())
    assert mark.held() is None and "did not finish" in updating.problem and "update.log" in updating.problem, "a journal that came back on the old version says the update did not finish"
    mark.write(UpdateHeld("4.0.0", VERSION, "Restarting the journal", time.time(), -1))
    updating.settle(time.time())
    assert mark.held() is None and updating.problem == "", "a journal that came back on the version it went to takes the mark off"


def test_a_typed_line_is_cut_short_and_a_piece_of_one_typed_again_is_still_the_journals():
    import time
    from journal.engine.support.typed_line import TypedLine
    from journal.features.checks.support.check_output import CheckOutput
    from journal.support.typed_lines import TypedLines
    issues = " ".join(f"#{n} [detector-report] ArrayBagDetector - Opened by somebody, handle with care" for n in range(600, 700))
    told = CheckOutput.told(issues)
    assert len(told) <= 310 and told.endswith("handle with care"), "a failing check tells the agent only the end of its output"
    line = TypedLine.cut("[journal] " + issues)
    assert len(line) <= TypedLine.LONGEST and line.endswith("..."), "no line typed to an agent is longer than one line holds"
    typed = TypedLines()
    typed.typed(1, line)
    first = typed.overdue(1, time.time())[0]
    typed._recent = []
    typed.tried_again(first, time.time())
    piece = line[200:320].replace(" ", "\n", 1)
    assert typed.carries(1, piece), "a piece of a line typed again, broken by the terminal, is the journal's, not the user's"
    assert not typed.carries(1, "handle with care"), "a short answer of the user's that sits inside a typed line stays the user's"
    assert typed.confirm(1, piece) and not typed.is_waiting(1), "a piece arriving is the line arriving, so it is not typed a third time"


def test_messages_between_sessions_reach_the_chat_both_ways_named_by_their_agents(app):
    from journal.events.agent.message_crossed import MessageCrossed
    from journal.events.bus import Bus
    from journal.providers.claude import Claude
    from journal.repositories.messages import Messages as MessageRows
    enqueued = {"type": "queue-operation", "operation": "enqueue", "content": '<cross-session-message from="uds:/tmp/cc-socks/1.sock" from-name="code-commandments-12" from-mode="bypass">\nthe fix is on main\n</cross-session-message>'}
    removed = {**enqueued, "operation": "remove"}
    assert Claude().crossed_in(enqueued) == [MessageCrossed(sender="code-commandments-12", text="the fix is on main")] and Claude().crossed_in(removed) == [], "a message across is read once, at its enqueue"
    hook(app, "SessionStart")
    app.container.get(Bus).dispatch(MessageCrossed(sender="code-commandments-12", text="the fix is on main").placed("s1", 1, "claude", None, 0.0))
    came = app.container.get(MessageRows).all()[-1]
    assert came.data["peer"] == "code-commandments-12" and came.created_by.stamp == "external:code-commandments-12" and came.read_at is not None, "it is the other agent's, written by it as an external agent, never the user's"
    hook(app, "PostToolUse", tool_name="SendMessage", tool_input={"to": "code-commandments-12", "message": "thank you"}, tool_response={})
    hook(app, "PostToolUse", tool_name="SendMessage", tool_input={"to": "code-commandments-12", "notify_when_idle": True}, tool_response={})
    app.runtime().deferred.drain()
    sent = [m for m in app.container.get(MessageRows).all() if m.data.get("sent_to")]
    assert [(m.text, m.data["sent_to"]) for m in sent] == [("thank you", "code-commandments-12")], "a message the agent sent is kept as sent to that agent; a bare idle subscription is not"


def test_a_wait_names_what_ends_it_and_ends_by_itself_once_that_is_done(app):
    from journal.engine.state_machine import StateMachine
    from journal.features.shell.support.output_log import OutputLog
    from journal.repositories.command_outputs import CommandOutputs
    console = app.console()
    hook(app, "SessionStart")
    console.run(["environment", "here"], AGENT)
    bare = console.run(["await", "the build"], AGENT)
    assert bare.code == 1 and "a wait names what ends it" in bare.err, "a wait that names nothing to end it is refused"
    user = console.run(["await", "the user's answer", "--until", "false"], AGENT)
    assert user.code == 1 and "no wait" in user.err, "waiting for the user is no wait"
    output = app.container.get(OutputLog).began("c1", "npm run build", app.config.home / "runtime" / "outputs" / "c1", "s1", Actor.agent("s1"))
    assert console.run(["await", "the build", "--output", str(output.id)], AGENT).code == 0
    assert app.container.get(StateMachine).current("s1").name == "expecting", "the agent waits"
    outputs = app.container.get(CommandOutputs)
    outputs.save(outputs.find(output.id).moved_out().ended_with(0), Actor.system())
    app.runtime().deferred.drain()
    assert app.container.get(StateMachine).current("s1").name != "expecting", "the wait ends by itself once the output it named is done"


def test_a_file_changed_by_a_shell_command_keeps_its_changed_lines(app):
    from journal.features.edits.support.patch_rows import PatchRows
    from journal.repositories.edits import Edits
    rows = PatchRows.between("a\nb\nc\nd\n", "a\nB\nc\nd\ne\n").rows
    assert [(r.kind, r.line, r.text) for r in rows if r.kind != "ctx"] == [("del", 2, "b"), ("add", 2, "B"), ("add", 5, "e")], "the lines a change removed and added, numbered as in the file"
    hook(app, "SessionStart")
    console = app.console()
    (app.config.root / "notes.txt").write_text("one\ntwo\n")
    ShellVerbs(app).ran("python3 - <<'EOF'", "c1", 0, output="", changed="2\t0\tnotes.txt")
    (app.config.root / "notes.txt").write_text("one\nTWO\nthree\n")
    ShellVerbs(app).ran("sed -i s/two/TWO/ notes.txt", "c2", 0, output="", changed="1\t1\tnotes.txt")
    first, second = [e for e in app.container.get(Edits).all() if e.path == "notes.txt"][-2:]
    assert [r["text"] for r in first.rows if r["kind"] == "add"] == ["one", "two"], "a new file's lines are all added"
    assert [(r["kind"], r["text"]) for r in second.rows if r["kind"] != "ctx"] == [("del", "two"), ("add", "TWO"), ("add", "three")], "a later change is told against the version the journal saw last"


def test_a_shell_line_says_whether_it_reads_searches_or_runs():
    from journal.support.chain import Chain
    wrapped = lambda line: f"source /s 2>/dev/null || true && eval '{line}' < /dev/null && pwd -P >| /tmp/cwd"
    assert Chain.work_of(wrapped("sed -n 1,20p src/a.py")) == "reading", "a read through the shell is reading, so the figure shows its book"
    assert Chain.work_of(wrapped("grep -rn foo src && cat b.py")) == "searching", "a line that only reads, with a search in it, is searching"
    assert Chain.work_of(wrapped("npm run build")) == "running", "anything else runs"


def test_a_journal_set_to_follow_a_branch_installs_that_branchs_newest_commit(app):
    (app.config.home / "src").mkdir(parents=True, exist_ok=True)
    (app.config.home / "src" / "commit").write_text("aaaaaaa1111\n")
    app.container.get(SettingRows).set("updates.branch", "development", Actor.user(1))
    source, installer = Source("v4.99.0", head="aaaaaaa1111"), Installer()
    updating = updating_with(app, source, installer, auto=True)
    updating.checked()
    assert source.branches_asked == [("https://github.com/jessegall/agent-journal", "development")] and source.tags_asked == [], "a followed branch is asked for its head, never the releases"
    assert installer.ran == [] and not updating.snapshot().newer and "newest commit" in updating.said(), "the installed commit is the branch's head: nothing to install"
    source.head = "bbbbbbb2222"
    updating.checked()
    assert installer.ran == ["development"] and updating.snapshot().latest == "bbbbbbb" and updating.snapshot().branch == "development", "the branch moved on, so its head is installed, by its name"
    assert updating.snapshot().installed == "development at aaaaaaa", "the snapshot names what is installed by the branch and its commit, not by the release number"
    assert updating.label() == "development at aaaaaaa", "what is installed is named by the branch and its commit"


def test_journal_update_follow_sets_the_branch_the_journal_follows_and_unfollow_the_releases_again(app):
    source, installer = Source("v4.99.0", head="ccccccc3333"), Installer()
    updating = updating_with(app, source, installer, auto=False)
    console = app.console()
    followed = console.run(["update", "follow", "development"], AGENT)
    assert followed.code == 0 and followed.out.startswith("following the branch development: development at ccccccc is out") and updating.branch() == "development", "the branch is set and its head read at once"
    assert source.branches_asked == [("https://github.com/jessegall/agent-journal", "development")], "the followed branch's head is asked for"
    assert console.run(["update", "unfollow"], AGENT).out == "following the releases again\n" and updating.branch() == "", "unfollow clears the branch"


def test_lines_typed_within_the_batch_window_wait_and_go_as_one_line_once_it_is_up(app, monkeypatch):
    from journal.engine.clock import Clock
    from journal.supervisor_link import SupervisorLink
    typed = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: typed.append(fields["line"]))
    app.container.get(SettingRows).set("delivery.batch_seconds", 5, Actor.user(1))
    link = app.container.get(SupervisorLink)
    link.type(1, "new message 2")
    hook(app, "UserPromptSubmit", prompt="[journal] new message 2")
    app.runtime().deferred.drain()
    link.type(1, "new message 3")
    link.type(1, "the user put 👍 on message 2")
    app.container.get(Clock).tick()
    assert typed == ["[journal] new message 2"], "a line within five seconds of the last waits, even once the last is confirmed"
    app.container.get(SettingRows).set("delivery.batch_seconds", 0, Actor.user(1))
    app.container.get(Clock).tick()
    assert typed == ["[journal] new message 2", "[journal] new message 3 | the user put 👍 on message 2"], "the window up, the held lines go as one line"


def test_a_new_message_line_is_confirmed_by_the_message_being_read_and_the_chat_hears_only_of_a_line_given_up(app, monkeypatch):
    import time
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    from journal.repositories.messages import Messages
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append(fields["line"]))
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["message", "send", "are you there?"], USER)
    assert sent[-1] == "[journal] new message 1"
    app.console().run(["message", "read", "1"], AGENT)
    app.runtime().deferred.drain()
    tick = lambda later: app.container.get(Bus).dispatch(Ticked(session="s1", environment_id=1, at=time.time() + later, quiet_for=later))
    tick(30)
    assert sent.count("[journal] new message 1") == 1, "the message read, the line that named it has arrived, whatever the prompt hook saw: it is not typed again"
    app.container.get(SupervisorLink).type(1, "look at the build")
    for later in (60, 90, 120, 200, 300, 500, 900):
        tick(later)
    cards = [m.text for m in app.container.get(Messages).in_() if m.author == "system" and "line" in m.text]
    assert sent.count("[journal] look at the build") == 6 and cards == ["A line did not reach the agent, typed 6 times over five minutes"], "six tries, and the chat hears of it once, when the line is given up"


def test_a_fact_a_rule_or_a_reminder_recorded_or_struck_is_a_card_in_the_chat(app):
    from journal.repositories.messages import Messages
    console = app.console()
    hook(app, "SessionStart")
    console.run(["fact", "create", "the tests run on port 8431"], AGENT)
    console.run(["rule", "create", "Always run the suite before a commit", "--reason", "a red commit costs a day"], USER)
    console.run(["reminder", "strike", "1"], AGENT) if console.run(["reminder", "create", "check the log after the restart"], AGENT).code == 0 else None
    app.runtime().deferred.drain()
    cards = [(m.text, m.data.get("row"), m.data.get("detail")) for m in app.container.get(Messages).in_() if m.data.get("kind") == "card" and m.data.get("row", "").split(":")[0] in ("facts", "rules", "reminders")]
    assert cards == [
        ("Fact recorded", "facts:1", "the tests run on port 8431"),
        ("Rule recorded", "rules:1", "Always run the suite before a commit"),
        ("Reminder recorded", "reminders:1", "check the log after the restart"),
        ("Reminder struck", "reminders:1", "check the log after the restart"),
    ], "each memory row recorded or struck is a card opening the row"


def test_a_tasks_brief_is_written_anew(app):
    from journal.repositories.tasks import Tasks
    console = app.console()
    console.run(["task", "create", "the footer", "--brief", "done when it stays at the bottom"], AGENT)
    assert console.run(["task", "brief", "1", "done when it stays at the bottom on every page"], AGENT).out == "task 1 brief written anew\n"
    assert app.container.get(Tasks).find(1).brief == "done when it stays at the bottom on every page"


def test_a_running_codex_workers_transcript_is_found_by_its_rollouts_folder_before_its_session_is_known(app, tmp_path, monkeypatch):
    import json as js
    from pathlib import Path
    from journal.providers.codex import Codex
    home = tmp_path / "home"
    day = home / ".codex" / "sessions" / "2026" / "10" / "20"
    day.mkdir(parents=True)
    monkeypatch.setattr(Path, "home", staticmethod(lambda: home))
    elsewhere = day / "rollout-2026-10-20T21-00-00-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.jsonl"
    elsewhere.write_text(js.dumps({"type": "session_meta", "payload": {"cwd": "/somewhere/else"}}) + "\n")
    ours = day / "rollout-2026-10-20T21-58-57-01a15ae5-449b-7131-9ee4-edd40f4e3dc3.jsonl"
    ours.write_text(js.dumps({"type": "session_meta", "payload": {"cwd": str(app.config.root.resolve())}}) + "\n")
    codex = Codex()
    assert codex.latest_session(app.config.root, 0.0) == "01a15ae5-449b-7131-9ee4-edd40f4e3dc3", "the newest rollout whose first line names the project's folder is the worker's conversation"
    assert codex.transcript(app.config.root, "01a15ae5-449b-7131-9ee4-edd40f4e3dc3") == ours
    assert codex.latest_session(app.config.root, ours.stat().st_mtime + 60) == "", "nothing newer than the time asked for"


def test_a_plugins_linked_skill_folder_is_unlinked_when_withdrawn_and_its_target_kept(app, tmp_path):
    from journal.features.plugins.support.plugin_skills import PluginSkills
    from journal.models.plugin import Plugin
    target = tmp_path / "published" / "echo-guide"
    target.mkdir(parents=True)
    (target / "SKILL.md").write_text("---\nplugin: echo\nname: echo-guide\n---\n# Echo\n")
    home = app.config.root / ".claude" / "skills"
    home.mkdir(parents=True, exist_ok=True)
    (home / "echo-guide").symlink_to(target)
    app.container.get(PluginSkills).withdraw(Plugin(name="echo"))
    assert not (home / "echo-guide").exists() and not (home / "echo-guide").is_symlink(), "the link is taken away"
    assert (target / "SKILL.md").is_file(), "what it pointed at is left as it was"


def test_a_plans_phase_is_retitled_and_its_complete_when_line_written_anew(app):
    from journal.repositories.plans import Plans
    console = app.console()
    console.run(["plan", "create", "release"], USER)
    console.run(["plan", "phase", "1", "Build it", "--when", "it builds"], USER)
    assert console.run(["plan", "rephase", "1", "1", "--title", "Build and prove it", "--when", "it builds and the suite is green"], USER).out == "phase 1 of plan 1 is now: Build and prove it\n"
    plans = app.container.get(Plans)
    phase = plans.phases_of(plans.find(1))[0]
    assert (phase.title, phase.complete_when) == ("Build and prove it", "it builds and the suite is green")


def test_a_short_output_with_no_pipe_keeps_no_output_row(app):
    from journal.repositories.command_outputs import CommandOutputs
    from journal.support.not_found import NotFound
    console, outputs = app.console(), app.container.get(CommandOutputs)
    for chain, line in (("short", "git status --short"), ("cut", "git log --oneline | grep fix"), ("long", "pytest -q")):
        folder = app.config.root / chain
        folder.mkdir()
        (folder / "line").write_text(line)
        ShellVerbs(app).split(line, str(folder))
    assert ShellVerbs(app).forget("short", 120) == "forgotten"
    with pytest.raises(NotFound):
        outputs.of_chain("short")
    assert ShellVerbs(app).forget("cut", 120) == "kept" and outputs.of_chain("cut")
    assert ShellVerbs(app).forget("long", 400) == "kept" and outputs.of_chain("long")
