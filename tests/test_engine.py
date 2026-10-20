"""Phase five: the machine. A write in Idle is refused with how to declare work; after task start a stop says carry on, once; done makes the agent idle again; stuck pauses and a tool use lifts it; the state survives a new server."""

import json
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

import pytest

from journal.app import App
from journal.config import Config
from journal.support.where import Where
from journal.engine.state_machine import StateMachine
from journal.features.tasks.states.stuck import Stuck
from journal.features.tasks.states.idle import Idle
from journal.features.tasks.states.working import Working
from journal.models.agent import Agent
from journal.models.setting import Setting
from journal.db.migrations.seed_the_stack import SeedTheStack
from journal.repositories.agents import Agents
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.models.task import Task
from journal.events.listener import Listener
from journal.events.bus import Bus
from journal.events.rows.plan_started import PlanStarted
from journal.events.rows.row_event import RowEvent
from journal.events.rows.row_settled import RowSettled
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.task_logged import TaskLogged
from journal.events.rows.task_started import TaskStarted
from journal.events.rows.question_answered import QuestionAnswered
from journal.events.rows.worker_back import WorkerBack
from journal.events.models.updated import Updated
from journal.engine.row_events_to_the_top import RowEventsToTheTop
from journal.models.question import Question
from journal.models.task_log import TaskLog
from journal.models.task_state import TaskState
from journal.models.worker import Worker
from datetime import datetime, timezone
from journal.repositories.entries import Entries
from journal.http.agents.agent_activity import AgentActivity
from journal.engine.support.trail import Trail
from journal.support.scope import Scope
from journal.support.actor import Actor
from journal.repositories.setting_rows import SettingRows
from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.engine.conduct import Conduct
from journal.engine.agent_state import AgentState
from journal.engine.states.paused import Paused
from journal.engine.support.held import Held
from journal.events.standing import Standing
from journal.support.refused import Refused
from journal.engine.nudge import Nudge
from journal.engine.states.compacting import Compacting as CompactingState
from journal.engine.states.ended import Ended
from journal.features.registry import Registry
from journal.engine.support.standing_readers import StandingReaders
from journal.features.tasks.feature import Tasks as TasksFeature
from journal.features.messages.feature import Messages as MessagesFeature
from journal.features.briefing.feature import Briefing as BriefingFeature
from journal.features.shell.feature import Shell as ShellFeature
from journal.features.workers.feature import Workers as WorkersFeature
from journal.engine.nudger import Nudger
from journal.engine.nudge_registry import NudgeRegistry
from journal.engine.engine import Engine
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.engine.states.wait import Wait
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.compacting import Compacting
from journal.events.agent.session_ended import SessionEnded
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.events.event import Event
from journal.support.option import Option
from journal.engine.support.settings import Settings as SettingsValue
from journal.engine.support.stack import Stack
from journal.support.states_catalogue import StatesCatalogue
from journal.engine.support.transition import Transition

AGENT = Where("main", "s1")
USER = Where("main")


@pytest.fixture
def app(journal_root: Path):
    app = App(Config(journal_root, port=0))
    app.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    yield app
    app.runtime().stop()


def hook(app, kind: str, **body):
    data = json.dumps({"hook_event_name": kind, "session_id": "s1", **body}).encode()
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=data, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"})
    try:
        with urlopen(request, timeout=5) as reply:
            return reply.status, json.loads(reply.read())
    except HTTPError as error:
        return error.code, json.loads(error.read())


def write(app):
    return hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})


def test_task_start_moves_the_agent_to_working_and_every_stop_says_carry_on(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "ship it", "--start"], AGENT)
    assert app.container.get(StateMachine).current("s1").task_id == 1
    assert write(app)[0] == 200
    status, body = hook(app, "Stop")
    assert body.get("decision") == "block" and "task 1 is in hand, last logged just now: carry on" in body["reason"], "a stop with work in hand is held, which is how Claude is told to go on"
    assert hook(app, "Stop")[1].get("decision") == "block", "every fresh stop with work in hand is held, until a stuck"
    assert hook(app, "PreCompact")[1] == {}, "a compaction hook carries nothing to the agent; the marks said it"


def test_done_makes_the_agent_idle_again(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["task", "done", "1"], AGENT)
    assert isinstance(app.container.get(StateMachine).current("s1"), Idle)
    assert hook(app, "Stop")[1] == {}


def test_stuck_pauses_and_the_next_tool_use_goes_back_to_where_it_was(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["stuck", "stuck on the login"], AGENT)
    machine = app.container.get(StateMachine)
    assert isinstance(machine.current("s1"), Stuck) and machine.current("s1").why == "stuck on the login"
    assert hook(app, "Stop")[1] == {}
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert machine.current("s1").task_id == 1


def test_a_feature_switched_off_takes_its_gate_with_it(app):
    app.container.get(SettingRows).save(Setting(environment_id=0, key="features.tasks", value=False), Actor.user(1))
    app.console().run(["task", "create", "t", "--start"], AGENT)
    assert hook(app, "Stop")[1] == {}


def test_the_session_end_ends_the_agent_and_a_new_start_of_the_same_session_revives_it(app):
    hook(app, "SessionStart")
    hook(app, "SessionEnd")
    assert app.container.get(StateMachine).current("s1").name == "ended"
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    assert app.container.get(StateMachine).current("s1").name == "idle"


def test_the_state_is_in_the_database_so_a_new_server_finds_it(tmp_path):
    first = App(Config(tmp_path, port=0))
    first.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    first.runtime().start()
    hook(first, "SessionStart")
    first.console().run(["environment", "here"], AGENT)
    first.console().run(["task", "create", "t", "--start"], AGENT)
    first.runtime().stop()
    second = App(Config(tmp_path, port=0))
    second.runtime().start()
    try:
        assert second.container.get(StateMachine).current("s1").task_id == 1
        assert write(second)[0] == 200
    finally:
        second.runtime().stop()


def test_a_tick_reaches_the_machine_without_a_hook(app):
    from journal.engine.clock import Clock
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.container.get(Clock).tick()
    assert isinstance(app.container.get(StateMachine).current("s1"), Idle)


def test_one_task_in_hand_park_resume_and_await(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    console = app.console()
    console.run(["task", "create", "first", "--start"], AGENT)
    console.run(["task", "create", "second"], AGENT)
    refused = console.run(["task", "start", "2"], AGENT)
    assert refused.code == 1 and "task 1 is in hand" in refused.err
    console.run(["task", "park", "1", "waiting for the designer"], AGENT)
    assert isinstance(app.container.get(StateMachine).current("s1"), Idle), "parked: nothing in hand"
    assert console.run(["task", "resume", "1"], AGENT).code == 0 and app.container.get(StateMachine).current("s1").task_id == 1
    assert console.run(["await", "the deploy to finish", "--until", "false"], AGENT).code == 0
    assert app.container.get(StateMachine).current("s1").name == "expecting" and hook(app, "Stop")[1] == {}, "waiting is quiet at a stop"
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert app.container.get(StateMachine).current("s1").task_id == 1, "working again lifts the wait"


def test_edits_with_nothing_logged_are_asked_named_and_held_as_the_settings_say(app):
    from journal.support.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.setting_rows import SettingRows
    for key, value in (("tasks.first_nudge_after", 5), ("tasks.name_every", 10), ("tasks.log_after", 20)):
        app.container.get(SettingRows).save(Setting(environment_id=0, key=key, value=value), Actor.system())
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    answers = [write(app) for _ in range(21)]
    assert all(status == 200 for status, _ in answers[:20])
    assert "5 edits since you logged task 1: say where it stands" in json.dumps(answers[5][1]) and "logged" not in json.dumps(answers[4][1]), "the first ask after five"
    assert "task 1 in hand, 10 edits" in json.dumps(answers[10][1]), "named back every ten"
    assert answers[20][0] == 409 and "20 edits since you logged task 1" in answers[20][1]["error"]
    assert all(status == 200 for status, _ in [hook(app, "PreToolUse", tool_name="Read", tool_input={}) for _ in range(3)]), "a read is never held for a log"
    app.console().run(["task", "log", "1", "halfway"], AGENT)
    assert write(app)[0] == 200


def test_every_stop_with_a_task_in_hand_says_carry_on_and_stuck_is_the_way_out(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    answers = [hook(app, "Stop", stop_hook_active=i > 0) for i in range(4)]
    assert all(a[1].get("decision") == "block" and "task 1 is in hand, last logged just now: carry on" in a[1]["reason"] for a in answers), "there is no repeated-stop escape"
    app.console().run(["stuck", "I cannot reach the service"], AGENT)
    assert hook(app, "Stop")[1] == {}, "stuck lets the agent stop"
def test_a_blocked_task_waits_on_something_outside_and_is_neither_offered_nor_nudged(app):
    from journal.models.task_state import TaskState
    from journal.repositories.tasks import Tasks
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "here"], AGENT)
    console.run(["task", "create", "the tree", "--start"], AGENT)
    assert "waiting on: a talk with the user" in console.run(["task", "block", "1", "a talk with the user"], AGENT).out
    assert app.container.get(Tasks).find(1).state == TaskState.BLOCKED and app.container.get(StateMachine).current("s1").name == "idle"
    assert hook(app, "Stop")[1].get("decision") != "block", "a blocked task is not offered, in auto mode or not"
    assert "blocked tasks: 1 the tree (waiting on: a talk with the user)" in console.run(["environment", "here"], AGENT).out
    assert "open again" in console.run(["task", "unblock", "1"], AGENT).out and app.container.get(Tasks).find(1).state == TaskState.OPEN


def test_a_write_needs_no_task(app):
    hook(app, "SessionStart")
    app.console().run(["environment", "here"], AGENT)
    assert write(app)[0] == 200, "a quick edit is the agent's own; a task is for work worth tracking"

def test_the_menu_watcher_confirms_what_the_journal_caused_closes_what_it_cannot_place_and_leaves_the_users_own(app, monkeypatch):
    import os
    import time
    from journal.engine.menu_watcher import MenuWatcher
    from journal.repositories.messages import Messages
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append({"verb": verb, **fields}))
    hook(app, "SessionStart")
    watcher, link = app.container.get(MenuWatcher), app.container.get(SupervisorLink)
    agent = app.container.get(StateMachine).agent("s1", 1)
    screens = app.config.home / "runtime" / "screens"
    screens.mkdir(parents=True, exist_ok=True)
    (app.config.home / "runtime" / "inboxes").mkdir(parents=True, exist_ok=True)
    (app.config.home / "runtime" / "inboxes" / "main").write_text(json.dumps({"socket": "/tmp/none.sock", "protocol": 1, "screen": str(screens / "main.out")}))
    def shown(text: str, still_for: float = 5.0) -> None:
        path = screens / "main.out"
        path.write_text(text)
        os.utime(path, (time.time() - still_for, time.time() - still_for))
    switch = "\x1b[1mSwitch model?\x1b[0m\r\nYour next response will be slower\r\n\r\n❯ 1. Yes, switch to Opus 5.5\r\n  2. No, go back\r\n"
    link.choose(1, "/model opus")
    shown(switch)
    assert watcher.look(agent) == "\r" and sent[-1] == {"verb": "keys", "name": "agent", "keys": "\r"}, "a confirmation the journal's pick caused is taken with Enter"
    assert watcher.look(agent) == "", "and answered once"
    from journal.engine.support.menu_answers import MenuAnswers
    picks = {"Turn it on": 2, "Pick one": 0}
    monkeypatch.setattr(MenuAnswers, "ask", lambda self, menu, provider: self._asked.__setitem__(self.key(menu), next((o for o in menu.options if o.number == picks.get(menu.options[0].label)), None)))
    asked = app.container.get(MenuAnswers)
    settled = lambda: [time.sleep(0.05) for _ in range(40) if asked._running - set(asked._asked)]
    shown("Something new?\r\n❯ 1. Turn it on\r\n  2. Leave it alone for now\r\n")
    said = watcher.look(agent)
    settled()
    assert (said or watcher.look(agent)) == "\x1b[B\r", "a menu the word rules cannot settle is answered by an independent agent asked off the watcher's thread"
    shown("Something else?\r\n❯ 1. Turn it on\r\n  2. Leave it alone for now\r\n")
    assert watcher.look(agent) == "\x1b[B\r", "and its pick is remembered for the same options"
    shown("Odd one?\r\n❯ 1. Pick one\r\n  2. Pick two\r\n")
    said = watcher.look(agent)
    settled()
    assert (said or watcher.look(agent)) == "\x1b", "a menu even the asked agent cannot place is closed with Escape"
    from journal.support.scope import Scope
    with app.container.get(Scope).of(1):
        assert any("closed it with Escape" in m.text for m in app.container.get(Messages).in_()), "and a card says so"
    permission = "Bash command\r\nrm -f build/*.log\r\n\r\nDo you want to proceed?\r\n❯ 1. Yes\r\n  2. Yes, and don't ask again for rm commands in build\r\n  3. No, and tell Claude what to do differently (esc)\r\n"
    launches = app.config.home / "runtime" / "launches"
    launches.mkdir(parents=True, exist_ok=True)
    (launches / "main.json").write_text(json.dumps({"front": {"command": ["claude", "--settings", "{}"]}}))
    shown(permission)
    assert watcher.look(agent) != "\r", "a permission question under a launch that keeps the prompts is the user's to answer"
    (launches / "main.json").write_text(json.dumps({"front": {"command": ["claude", "--dangerously-skip-permissions", "--settings", "{}"]}}))
    shown(permission.replace("build", "dist"))
    assert watcher.look(agent) == "\r", "a permission question the provider asks anyway under a launch that skips the prompts is answered with yes"
    (screens / "main.keyed").touch()
    shown("Pick a theme\r\n❯ 1. Dark\r\n  2. Light\r\n")
    assert watcher.look(agent) == "", "a picker that came up right after keys at the keyboard is the user's own"
    shown(switch.replace("Opus 5.5", "Sonnet 5.5") + "\r\n──────\r\n❯ \r\n──────\r\n  agent-journal · main\r\n")
    assert watcher.look(agent) == "\r", "a yes-or-no confirmation of what the user just asked at the keyboard is confirmed, seen by its cursor though the prompt box is drawn below it"
    shown("Pick a colour\r\n❯ 1. Red\r\n  2. Blue\r\n", still_for=0.0)
    assert watcher.look(agent) == "", "a menu just drawn is not answered yet"
    busy = lambda seconds: f"· Shimmying… ({seconds}s · ↓ 3.9k tokens)\r\n\r\n────────────────\r\n" + switch.replace("Opus 5.5", "Fable 5.1")
    shown(busy(49), still_for=0.0)
    assert watcher.look(agent) == ""
    watcher._seen_at[1] -= 2
    shown(busy(51), still_for=0.0)
    assert watcher.look(agent) == "\r", "the switch of model is confirmed while the agent works, its spinner counting above the rule: the menu stood the same, whatever the screen did, and only a model change asks it"


def test_a_typed_line_goes_out_on_one_line(app, monkeypatch):
    """One with breaks would arrive as pasted text that never matches it, and be typed again."""
    from journal.supervisor_link import SupervisorLink
    sent = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append(fields))
    app.container.get(SupervisorLink).type(1, "the command finished: cat <<EOF\nx\nEOF")
    assert sent[-1]["line"] == "[journal] the command finished: cat <<EOF x EOF"


LINE = Nudge("tests", "line", "a line")
OTHER = Nudge("tests", "other", "another line")
WHY = Nudge("tests", "why", "held here")


class Known:
    def states(self):
        return [Idle, Working]

    def silenced(self, nudge):
        return False


class Rows:
    def option(self, option):
        return {"tasks.log_after": 7}.get(option.key, option.default)


@dataclass(frozen=True)
class Listening(BaseState):
    name = "listening"

    def on_tool_starting(self, event: ToolStarting, settings: SettingsValue) -> Transition:
        return self.unchanged(LINE)

    def on_anything(self, event: AgentEvent, settings: SettingsValue) -> Transition:
        return self.unchanged(OTHER)

    def on_push(self, settings):
        return ()

    def named(self) -> str:
        return "not a listener"


def test_the_stack_keeps_its_floor_changes_only_its_top_and_comes_back_from_its_data():
    stack = Stack((Idle(), Working(task_id=3)))
    assert stack.top() == Working(task_id=3)
    assert stack.pushed(Ended()).to_data()[-1] == {"state": "ended", "data": {}}
    assert stack.popped().to_data() == [{"state": "idle", "data": {}}]
    assert stack.popped().popped() == stack.popped()
    assert stack.with_top(Working(task_id=4)).top().task_id == 4
    catalogue = StatesCatalogue(Known())
    assert catalogue.stack_of(Agent(stack=tuple(stack.to_data()))) == stack
    assert catalogue.stack_of(Agent(state="working", data={"task_id": 3})) == stack
    assert catalogue.stack_of(Agent(stack=({"state": "gone", "data": {}},))).top() == Idle()


def test_merged_answers_say_every_nudge_in_order_hold_on_the_first_and_move_once():
    idle = Idle()
    answers = [idle.unchanged(LINE), idle.push(Working(task_id=1), OTHER), idle.hold(WHY), idle.pop(), idle.hold(OTHER)]
    merged = Transition.merged(idle, answers)
    assert merged.nudges == (LINE, OTHER)
    assert merged.pushed == Working(task_id=1) and not merged.popped
    assert merged.held is WHY
    assert merged.dropped == ("pop",)
    assert merged.to is idle
    assert Transition.merged(idle, [idle.changed(Working(task_id=2))]).to == Working(task_id=2)
    assert Transition.merged(idle, []).to is idle


def test_every_listener_whose_event_matches_runs_the_most_specific_first_and_the_base_hears_compaction_and_the_end():
    settings, state = SettingsValue({}), Listening()
    assert state.on(ToolStarting(tool="Write", input={}), settings).nudges == (LINE, OTHER)
    assert state.on(SessionEnded(), settings).nudges == (OTHER,)
    assert state.on(Event(), settings) == state.unchanged()
    assert state.on(Compacting(), settings).pushed == CompactingState()
    assert state.on(SessionEnded(), settings).pushed == Ended()
    assert [method.__name__ for _, method in Listening.listeners()] == ["on_tool_starting", "on_anything", "on_compaction", "on_session_ended"]


def test_settings_is_a_frozen_value_of_the_options_read_by_option():
    option = Option("tasks.log_after", "Log after", "", 50)
    assert SettingsValue.taken(Rows(), [option]).of(option) == 7


def test_every_agent_event_carries_the_time_it_was_placed_and_a_tick_carries_its_own():
    placed = ToolStarting(tool="Write", input={}).placed("s1", 1, "claude", None, 12.5)
    assert placed.at == 12.5 and placed.session == "s1"
    assert Ticked(session="s1", environment_id=1, at=3.0, quiet_for=0.0).at == 3.0


def test_a_renamed_state_answers_as_before_through_its_on_listeners_and_a_plain_method_is_none():
    settings = SettingsValue({})
    assert Ended().on(ToolStarting(tool="Write", input={}), settings).popped
    assert Ended().on(SessionEnded(), settings) == Ended().unchanged()
    names = [method.__name__ for _, method in Ended.listeners()]
    assert set(names[:4]) == {"on_session_started", "on_prompt_submitted", "on_tool_starting", "on_session_ended"} and names[4:] == ["on_compaction"]


def test_the_stack_is_seeded_from_the_state_and_its_pause_chain_unwound_with_idle_at_the_floor(connection, bus, scope):
    agents = Agents(connection, bus, scope)
    stuck = agents.save(Agent(environment_id=1, session="s9", state="stuck", data={"resume": {"state": "working", "data": {"task_id": 3, "resume": {"state": "idle", "data": {}}}}}), Actor.system())
    gone = agents.save(Agent(environment_id=1, session="s8", state="gone", data={}), Actor.system())
    SeedTheStack().up(connection)
    assert agents.find(stuck.id).stack == ({"state": "idle", "data": {}}, {"state": "working", "data": {"task_id": 3}}, {"state": "stuck", "data": {}})
    assert agents.find(gone.id).stack == ({"state": "idle", "data": {}}, {"state": "gone", "data": {}})


def test_the_session_end_pushes_ended_on_the_stack_and_a_new_start_pops_it(app):
    hook(app, "SessionStart")
    hook(app, "SessionEnd")
    agents = app.container.get(Agents)
    assert [row["state"] for row in agents.for_session("s1").stack] == ["idle", "ended"]
    hook(app, "SessionStart")
    assert [row["state"] for row in agents.for_session("s1").stack] == ["idle"]


CALLS: list[str] = []


@dataclass(frozen=True)
class Noting(Paused):
    name = "noting"

    def on_push(self, settings):
        CALLS.append("push noting")
        return (LINE.create(),)

    def on_pop(self, settings):
        CALLS.append("pop noting")
        return ()


@dataclass(frozen=True)
class Refusing(Paused):
    name = "refusing"

    def on_push(self, settings):
        return Held(WHY.create())


@dataclass(frozen=True)
class Catching(AgentState):
    name = "catching"

    def on_suspend(self, settings):
        CALLS.append("suspend catching")
        return ()

    def on_resume(self, standing: Standing, settings):
        CALLS.append("resume catching")
        return self.pop()


def test_the_lifecycle_hooks_run_in_order_say_their_lines_refuse_a_push_and_catch_up_beneath_a_pop(app):
    CALLS.clear()
    hook(app, "SessionStart")
    machine, settings = app.container.get(StateMachine), SettingsValue({})
    standing = Stack((Idle(), Catching()))
    pushed = machine.through_hooks(standing, standing.pushed(Noting()), settings)
    assert pushed.stack == standing.pushed(Noting()) and pushed.nudges == (LINE.create(),) and pushed.held is None
    refused = machine.through_hooks(standing, standing.pushed(Refusing()), settings)
    assert refused.stack == standing and refused.held == Held(WHY.create())
    popped = machine.through_hooks(standing.pushed(Noting()), standing, settings)
    assert popped.stack == Stack((Idle(),)) and popped.nudges == ()
    assert CALLS == ["suspend catching", "push noting", "suspend catching", "pop noting", "resume catching"]
    with pytest.raises(Refused):
        machine.move("s1", 1, Refusing.leaving(Idle()))
    assert [row["state"] for row in app.container.get(Agents).for_session("s1").stack] == ["idle"]


def test_a_push_and_a_pop_write_the_trail_and_the_agents_page_shows_the_stack_top_first(app):
    hook(app, "SessionStart")
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["stuck", "lost"], AGENT)
    with app.container.get(Scope).of(1):
        row = next(a for a in app.container.get(AgentActivity).page(app.container.get(Agents).in_()) if a["session"] == "s1")
    assert [s["name"] for s in row["stack"]] == ["stuck", "working", "idle"] and row["stack"][0]["awaits"]
    assert [(t["before"], t["after"]) for t in row["trail"]] == [([], ["idle"]), (["idle"], ["idle", "working"]), (["idle", "working"], ["idle", "working", "stuck"])]
    write(app)
    with app.container.get(Scope).of(1):
        trail = [e.data for e in app.container.get(Entries).of_kind(Trail.KIND) if e.data["session"] == "s1"]
    popped = next(e for e in trail if [row["state"] for row in e["before"]] == ["idle", "working", "stuck"])
    assert popped["after"][-1]["state"] == "working" and popped["cause"]


def test_journal_panic_pushes_pops_and_empties_the_stack_by_hand_and_the_trail_names_the_agent(app):
    hook(app, "SessionStart")
    console, agents = app.console(), app.container.get(Agents)
    assert console.run(["panic", "working", "task_id=3"], AGENT).out.strip() == "the stack, bottom to top: idle, working(task_id=3, what=, logged_at=0.0)"
    assert console.run(["panic", "stuck", "why=lost"], AGENT).out.startswith("the stack, bottom to top: idle, working(task_id=3, what=, logged_at=0.0), stuck(")
    assert console.run(["panic", "pop"], AGENT).out.strip().endswith("idle, working(task_id=3, what=, logged_at=0.0)")
    assert console.run(["panic", "nowhere"], AGENT).code != 0
    assert console.run(["panic", "idle"], AGENT).out.strip() == "the stack, bottom to top: idle"
    assert [row["state"] for row in agents.for_session("s1").stack] == ["idle"]
    with app.container.get(Scope).of(1):
        newest = app.container.get(Entries).of_kind(Trail.KIND)[0]
    assert newest.data["cause"] == "journal panic idle" and newest.actor == AGENT.actor


class Hearing(Listener[PlanStarted]):
    def __init__(self) -> None:
        self.heard: list[PlanStarted] = []

    def handle(self, event: PlanStarted) -> None:
        self.heard.append(event)


def test_a_saved_started_plan_sends_plan_started_once_and_a_plain_edit_sends_none(app):
    hearing = Hearing()
    app.container.get(Bus).listen(PlanStarted, hearing)
    plans, tasks = app.container.get(Plans), app.container.get(Tasks)
    with app.container.get(Scope).of(1):
        task = tasks.save(Task(environment_id=1, title="first"), Actor.system())
        plan = plans.save(Plan(environment_id=1, title="p", state=PlanState.APPROVED), Actor.system())
        started = plans.save(plan.started(task, 5.0), Actor.system())
        assert started.events == () and hearing.heard == [PlanStarted(environment_id=1, at=5.0, row_id=plan.id, plan_id=plan.id, task_id=task.id)]
        plans.save(started.with_(title="renamed"), Actor.system())
        assert len(hearing.heard) == 1


def test_the_models_carry_the_events_their_changes_mean():
    now = datetime(2026, 10, 20, 23, 0, tzinfo=timezone.utc)
    task = Task(id=7, environment_id=1, title="t", state=TaskState.STARTED)
    assert [type(e) for e in task.finished(now, "x").events] == [TaskClosed, RowSettled] and task.finished(now, "x").events[1].ref == "tasks:7"
    assert task.parked("later", now).events[0] == TaskClosed(environment_id=1, at=now.timestamp(), task_id=7, how="parked")
    assert Task(id=8, environment_id=1, title="u").started(now).events == (TaskStarted(environment_id=1, at=now.timestamp(), task_id=8, title="u", plan_id=0),)
    assert TaskLog.of(task, "where it stands", 3.0).events == (TaskLogged(environment_id=1, at=3.0, task_id=7),)
    question = Question(id=4, environment_id=1, text="?")
    assert [type(e) for e in question.answered("yes", 2.0).events] == [QuestionAnswered, RowSettled] and question.asked(1.0).events[0].question_id == 4
    assert Worker(id=9, environment_id=1, name="w").reported(5.0, 4).events == (WorkerBack(environment_id=1, at=5.0, worker_id=9, name="w", report=4),)


def test_a_row_event_reaches_the_live_agents_top_in_its_environment_and_updated_reaches_no_state(app):
    hook(app, "SessionStart")
    hook(app, "SessionEnd")
    hook(app, "SessionStart", session_id="s2")
    agents, bus = app.container.get(Agents), app.container.get(Bus)
    assert [a.session for a in agents.live_in(1)] == ["s2"]
    assert any(isinstance(listener, RowEventsToTheTop) for listener in bus.listeners(RowEvent))
    assert not any(isinstance(listener, (RowEventsToTheTop, StateMachine)) for listener in bus.listeners(Updated))
    bus.dispatch(PlanStarted(environment_id=1, at=1.0, plan_id=1, task_id=0))
    assert [row["state"] for row in agents.for_session("s2").stack] == ["idle"]


def test_the_nudge_registry_hands_back_an_id_lists_every_nudge_and_the_nudger_refuses_one_it_does_not_hold(app):
    registry, own = app.container.get(NudgeRegistry), Nudge("engine", "test_line", "a line of the test")
    assert registry.register(LINE) == "tests.line" and registry.named("tests.line") is LINE and registry.register(own) == "engine.test_line"
    assert registry.named("engine.nothing_while_compacting") is Engine.NOTHING_WHILE_COMPACTING
    assert all(nudge.key in registry.nudges for feature in app.container.get(Registry).features for nudge in feature.nudges)
    listed = app.console().run(["nudge", "list"], AGENT).out
    assert "tests.line  [tests]  a line" in listed and "tasks.carry_on  [tasks]" in listed and listed.strip().endswith("nudges")
    hook(app, "SessionStart")
    agent = app.container.get(Agents).for_session("s1")
    with pytest.raises(Refused):
        app.container.get(Nudger).say(agent, OTHER.create())
    assert app.container.get(Nudger).say(agent, own.create()) == "a line of the test"


def test_the_engines_own_states_wait_compacting_and_ended_answer_hand_built_events():
    settings, own, subagents = SettingsValue({}), ToolStarting(tool="Write", input={}), ToolStarting(tool="Write", input={}, subagent="a1")
    assert Wait().on(PromptSubmitted(prompt="go on"), settings).popped
    assert not Wait().on(PromptSubmitted(prompt="[journal] a line"), settings).popped
    assert Wait().on(own, settings).popped and not Wait().on(subagents, settings).popped
    assert Wait().awaiting() == ("", "")
    assert CompactingState().on(own, settings).held == Engine.NOTHING_WHILE_COMPACTING.create()
    assert CompactingState().on(SessionStarted(), settings).popped
    assert all(Ended().on(event, settings).popped for event in (SessionStarted(), PromptSubmitted(prompt="hi"), own))


def test_a_nudge_is_one_class_whose_create_fills_its_blanks_and_rendered_says_the_line():
    nudge = Nudge("tests", "two_blanks", "{{n}} of {{what}}", "read {{what}}")
    assert nudge.create(n=3, what="them").rendered() == "3 of them. read them"
    assert nudge.create(n=3, what="them").key == "tests.two_blanks" and nudge.create().rendered() == "{{n}} of {{what}}. read {{what}}"
    assert nudge.in_words("its own words").rendered() == "its own words"


def test_the_standing_is_read_per_feature_and_travels_on_the_event_the_machine_asks(app):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["task", "create", "the standing", "--start"], AGENT)
    console.run(["message", "send", "a word from the user"], USER)
    agent = app.container.get(Agents).for_session("s1")
    with app.container.get(Scope).of(1):
        standing = app.container.get(StandingReaders).for_agent(agent)
    assert standing.of(TasksFeature).in_hand == 1 and standing.of(TasksFeature).parked == ()
    assert len(standing.of(MessagesFeature).unread) == 1 and standing.of(BriefingFeature).oriented is False
    assert standing.of(ShellFeature).background == () and standing.of(WorkersFeature).reports_waiting == ()
    event = ToolStarting(tool="Write", input={}).with_standing(standing)
    assert event.standing.of(TasksFeature).in_hand == 1 and ToolStarting(tool="Write", input={}).standing.readings == {}


class InboxConduct(Conduct):
    def on_tool_starting_inbox(self, event: ToolStarting, settings: SettingsValue) -> Transition:
        return self.unchanged(OTHER)


class LawsConduct(Conduct):
    def on_tool_starting_laws(self, event: ToolStarting, settings: SettingsValue) -> Transition:
        return self.hold(WHY)

    def on_anything_laws(self, event: AgentEvent, settings: SettingsValue) -> Transition:
        return self.pop()

    def named(self) -> str:
        return "not a listener"


def test_the_features_conduct_is_folded_into_the_base_state_and_every_matching_listener_runs_the_states_own_first():
    BaseState.fold((InboxConduct, LawsConduct))
    try:
        settings, event = SettingsValue({}), ToolStarting(tool="Write", input={})
        answered = Listening().on(event, settings)
        assert answered.nudges == (LINE, OTHER, OTHER) and answered.held is WHY and answered.popped and answered.dropped == ()
        pushing = Catching().on(event, settings)
        assert [method.__name__ for _, method in Catching.listeners()][-3:] == ["on_tool_starting_inbox", "on_tool_starting_laws", "on_anything_laws"]
        assert pushing.popped
        assert Ended().on(event, settings).popped and Ended().on(event, settings).dropped == ("pop",)
    finally:
        BaseState.fold(())
    assert all("laws" not in method.__name__ for _, method in Ended.listeners())


def test_the_states_and_the_conduct_of_tasks_and_plans_answer_the_row_events_from_the_standing():
    from journal.features.plans.support.plans_conduct import PlansConduct
    from journal.features.plans.support.plans_standing import PlansStanding
    from journal.features.tasks.support.tasks_standing import TasksStanding
    from journal.features.plans.states.following_plan import FollowingPlan
    from journal.events.rows.plan_approved import PlanApproved
    from journal.events.rows.task_started import TaskStarted
    settings = SettingsValue({})
    from journal.features.plans.support.started_plan import StartedPlan
    plans = PlansStanding(approved=(), started=StartedPlan(plan_id=5, next_task=0, started_task=7, started_task_briefing="it has no brief and nothing logged yet", tasks=(7, 8), tasks_left=2, at_checkpoint=False))
    tasks = TasksStanding(in_hand=7, parked=(), blocked=(), broken_waits=(), first_parked_why="", last_commands=())
    standing = Standing({"plans": plans, "tasks": tasks})
    assert Idle().on(SessionStarted().with_standing(standing), settings).pushed == FollowingPlan(plan_id=5, task_id=7)
    assert Idle().on(SessionStarted().with_standing(Standing({"plans": PlansStanding((), None), "tasks": tasks})), settings).pushed is None
    started = TaskStarted(environment_id=1, at=1.0, task_id=7, title="t", plan_id=0).with_standing(standing)
    assert Working(task_id=7, logged_at=2.0).on(started, settings).to == FollowingPlan(plan_id=5, task_id=7, logged_at=2.0)
    assert FollowingPlan(plan_id=5, task_id=7).on(started, settings).to == FollowingPlan(plan_id=5, task_id=7)
    BaseState.fold((PlansConduct,))
    try:
        approved = Idle().on(PlanApproved(environment_id=1, at=1.0, plan_id=5, by_user=True).with_standing(standing), settings)
        assert [nudge.key for nudge in approved.nudges] == ["plans.the_user_approved_the_plan"]
        by_agent = Idle().on(PlanApproved(environment_id=1, at=1.0, plan_id=5, by_user=False).with_standing(standing), settings)
        assert by_agent.nudges == ()
        next_task = Idle().on(TaskStarted(environment_id=1, at=1.0, task_id=8, title="the next", plan_id=5).with_standing(standing), settings)
        assert next_task.nudges[0].rendered() == "plan 5: task 8, the next is next. it has no brief and nothing logged yet"
    finally:
        BaseState.fold(())


def test_the_conduct_of_voices_etiquette_pins_and_migration_speak_from_the_standing():
    from journal.features.voices.feature import Voices
    from journal.features.voices.support.voices_conduct import VoicesConduct
    from journal.features.voices.support.voices_standing import VoicesStanding
    from journal.features.etiquette.feature import Etiquette
    from journal.features.etiquette.support.etiquette_conduct import EtiquetteConduct
    from journal.features.etiquette.support.etiquette_standing import EtiquetteStanding
    from journal.features.pins.support.pins_conduct import PinsConduct
    from journal.features.pins.support.pins_standing import PinsStanding
    from journal.features.migration.support.migration_conduct import MigrationConduct
    from journal.features.migration.support.migration_standing import MigrationStanding
    from journal.events.agent.tool_finished import ToolFinished
    from journal.events.agent.turn_written import TurnWritten
    from journal.events.rows.setting_changed import SettingChanged
    settings = SettingsValue({Etiquette.REMIND_EVERY.key: 50})
    from journal.features.plans.support.plans_standing import PlansStanding
    from journal.features.tasks.support.tasks_standing import TasksStanding
    standing = Standing({"plans": PlansStanding((), None), "tasks": TasksStanding(in_hand=0, parked=(), blocked=(), broken_waits=(), first_parked_why="", last_commands=()), "voices": VoicesStanding(instruction="as a butler"), "etiquette": EtiquetteStanding(lines_since_reminder=50), "pins": PinsStanding(pinned=("https://a.test/pinned",), suggested_lately=("https://a.test/said",)), "migration": MigrationStanding(version_3_waiting=True)})
    BaseState.fold((VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct))
    try:
        started = Idle().on(SessionStarted().with_standing(standing), settings)
        assert [nudge.key for nudge in started.nudges] == ["voices.how_to_talk_to_the_user", "migration.version_3_not_brought_across"]
        assert "as a butler" in started.nudges[0].rendered()
        assert [n.key for n in Idle().on(SessionStarted(source="resume").with_standing(standing), settings).typed] == ["voices.say_you_are_back"]
        changed = Idle().on(SettingChanged(environment_id=1, at=1.0, setting=Voices.SPOKEN[0].key).with_standing(standing), settings)
        assert [n.key for n in changed.nudges] == ["voices.the_voice_changed"]
        assert Idle().on(SettingChanged(environment_id=1, at=1.0, setting="shell.short_output").with_standing(standing), settings).nudges == ()
        turn = Idle().on(TurnWritten(text="the user should run journal task done 3, see https://a.test/new and https://a.test/said").with_standing(standing), settings)
        assert [n.key for n in turn.nudges] == ["etiquette.no_shop_talk", "etiquette.say_you_not_the_user", "pins.pin_the_link"]
        assert "https://a.test/new" in turn.nudges[2].rendered()
        assert Idle().on(TurnWritten(text="see https://a.test/pinned", final=False).with_standing(standing), settings).nudges == ()
        finished = Idle().on(ToolFinished(tool="Bash", input={}, output="opened https://a.test/pr/1").with_standing(standing), settings)
        assert [n.key for n in finished.nudges] == ["etiquette.a_line_is_an_instruction", "pins.pin_the_link"]
        quiet = Standing({**standing.readings, "etiquette": EtiquetteStanding(lines_since_reminder=3)})
        assert Idle().on(ToolFinished(tool="Bash", input={}, output="nothing", subagent="s1").with_standing(standing), settings).nudges == ()
        assert Idle().on(ToolFinished(tool="Bash", input={}, output="nothing").with_standing(quiet), settings).nudges == ()
    finally:
        BaseState.fold(())


def test_the_conduct_of_git_checks_triggers_and_plugins_speak_and_hold_from_the_event_and_the_standing():
    from pathlib import Path
    from journal.features.git.support.git_conduct import GitConduct
    from journal.features.checks.support.checks_conduct import ChecksConduct
    from journal.features.triggers.support.triggers_conduct import TriggersConduct
    from journal.features.triggers.support.triggers_standing import TriggersStanding
    from journal.features.plugins.support.plugins_conduct import PluginsConduct
    from journal.features.plugins.support.plugins_standing import PluginsStanding
    from journal.models.open_task import OpenTask
    from journal.features.plans.support.plans_standing import PlansStanding
    from journal.features.tasks.support.tasks_standing import TasksStanding
    from journal.events.agent.commit_made import CommitMade
    from journal.events.agent.prompt_submitted import PromptSubmitted
    from journal.events.rows.check_ran import CheckRan
    from journal.events.rows.message_arrived import MessageArrived
    from journal.models.trigger import Trigger
    from journal.models.trigger_action import TriggerAction
    settings = SettingsValue({})
    triggers = (Trigger(id=1, words=("deploy",), action=TriggerAction.DENY, text="no deploys tonight"), Trigger(id=2, words=("release",), action=TriggerAction.INSTRUCT, text="bump the version"), Trigger(id=3, words=("plan",), action=TriggerAction.SEQUENCE, text="Building a plan"))
    plugin_file = str(Path(".journal", "plugins", "x", "run.sh"))
    standing = Standing({"plans": PlansStanding((), None), "tasks": TasksStanding(in_hand=0, parked=(), blocked=(), broken_waits=(), first_parked_why="", last_commands=()), "triggers": TriggersStanding(triggers=triggers), "plugins": PluginsStanding(root=Path("/p"), plugins_folder=Path("/p", ".journal", "plugins"))})
    BaseState.fold((GitConduct, ChecksConduct, TriggersConduct, PluginsConduct))
    try:
        assert Idle().on(CommitMade(sha="abcdef0123").with_standing(standing), settings).nudges == ()
        closed = Idle().on(CommitMade(sha="abcdef0123", closed=(4, 5), next_open=OpenTask(6, "the next")).with_standing(standing), settings)
        assert [n.rendered() for n in closed.nudges] == ["commit abcdef01 closed task 4, task 5", "tasks are open, and auto mode is on: task 6 is next. sure you want to stop? carry on with it, or `journal stuck \"<why>\"` if you are truly stuck"]
        failed = Idle().on(CheckRan(environment_id=0, at=1.0, check_id=2, title="lint", passed=False, output="a\nb c", failed_before=False, waited_on=False).with_standing(standing), settings)
        assert [n.key for n in failed.nudges] == ["checks.check_failed"] and "b c" in failed.nudges[0].rendered()
        again = Idle().on(CheckRan(environment_id=0, at=1.0, check_id=2, title="lint", passed=False, output="", failed_before=True, waited_on=False).with_standing(standing), settings)
        assert [n.key for n in again.nudges] == ["checks.check_still_failing"]
        assert Idle().on(CheckRan(environment_id=0, at=1.0, check_id=2, title="lint", passed=False, output="", failed_before=True, waited_on=True).with_standing(standing), settings).nudges == ()
        prompt = Idle().on(PromptSubmitted(prompt="release it and plan the rest").with_standing(standing), settings)
        assert [n.rendered() for n in prompt.nudges] == ["do this now: bump the version"]
        arrived = Idle().on(MessageArrived(environment_id=1, at=1.0, text="deploy now").with_standing(standing), settings)
        assert [n.rendered() for n in arrived.nudges] == ["no deploys tonight"]
        denied = Idle().on(ToolStarting(tool="Bash", input={"command": "deploy prod"}).with_standing(standing), settings)
        assert denied.held is not None and denied.held.rendered() == "a trigger denies this: no deploys tonight"
        held = Idle().on(ToolStarting(tool="Edit", input={"file_path": plugin_file}, writes=True, written_paths=(plugin_file,)).with_standing(standing), settings)
        assert held.held is not None and held.held.key == "plugins.plugin_files_are_the_users"
        assert Idle().on(ToolStarting(tool="Edit", input={"file_path": "src/a.py"}, writes=True, written_paths=("src/a.py",)).with_standing(standing), settings).held is None
    finally:
        BaseState.fold(())


def test_the_conduct_of_messages_laws_shell_secrets_questions_profiles_and_workers_speak_and_hold_from_the_standing(tmp_path):
    from pathlib import Path
    from journal.features.messages.feature import Messages as MessagesFeature
    from journal.features.messages.support.messages_conduct import MessagesConduct
    from journal.features.messages.support.messages_standing import MessagesStanding
    from journal.features.laws.support.laws_conduct import LawsConduct
    from journal.features.shell.feature import Shell
    from journal.features.shell.support.shell_conduct import ShellConduct
    from journal.features.shell.support.shell_standing import ShellStanding
    from journal.features.shell.support.ended_output import EndedOutput
    from journal.features.shell.support.reader import Reader
    from journal.features.secrets.support.secrets_conduct import SecretsConduct
    from journal.features.secrets.support.secrets_standing import SecretsStanding
    from journal.features.questions.support.questions_conduct import QuestionsConduct
    from journal.features.profiles.support.profiles_conduct import ProfilesConduct
    from journal.features.profiles.support.profiles_standing import ProfilesStanding
    from journal.features.workers.feature import Workers as WorkersFeature
    from journal.features.workers.support.workers_conduct import WorkersConduct
    from journal.features.workers.support.workers_standing import WorkersStanding
    from journal.features.workers.support.worker_worktree import WorkerWorktree
    from journal.features.workers.support.dispatch import Dispatch
    from journal.features.plans.support.plans_standing import PlansStanding
    from journal.features.tasks.support.tasks_standing import TasksStanding
    from journal.events.agent.idle import Idle as IdleEvent
    from journal.events.agent.ticked import Ticked
    from journal.events.agent.tool_finished import ToolFinished
    from journal.events.rows.reaction_given import ReactionGiven
    from journal.events.rows.secret_allowed import SecretAllowed
    from journal.events.rows.worker_back import WorkerBack
    settings = SettingsValue({MessagesFeature.HOLD_AFTER.key: 10, MessagesFeature.NUDGE_AFTER.key: 3, MessagesFeature.REMIND_EVERY.key: 3, MessagesFeature.HOLD_AFTER_REMINDERS.key: 5, Shell.SHOWN.key: 100, WorkersFeature.MOST_SUBAGENTS.key: 2})
    private = tmp_path / "private"
    readings = {
        "plans": PlansStanding((), None), "tasks": TasksStanding(in_hand=0, parked=(), blocked=(), broken_waits=(), first_parked_why="", last_commands=()),
        "messages": MessagesStanding(unread=(7, 8), unanswered=(5,), unanswered_files=(f"{tmp_path}/files/message/5/",), uses_since_newest=3, times_named=1, uses_unanswered=4),
        "profiles": ProfilesStanding(names=("journal-researcher", "journal-medior"), subagents=("journal-researcher",), workers=("journal-medior",)),
        "shell": ShellStanding(background=(12,), background_since=100.0, ended_untold=(EndedOutput(3, 0), EndedOutput(4, 1)), output_reads=("journal output read <output> --grep x", "journal output read <output> --grep x"), readers=(Reader("tests", "the failures", "FAILED"),), tipped=()),
        "secrets": SecretsStanding(root=tmp_path, folders=(private.resolve(),), spellings=(str(private),)),
        "workers": WorkersStanding(out=(), reports_waiting=(2,), reports_waiting_named="worker 2 (Lady Lovelace)", subagents_running=2, dispatches=(Dispatch(id="d1", at=1.0, task="read the plan", brief="look at src/a.py", type="journal-researcher", model="sonnet", session="sub-1", running=False),), worktrees_root=tmp_path / "worktrees", worktrees=(WorkerWorktree("3-Lady-Lovelace", 3, "Lady Lovelace"),)),
    }
    standing = Standing(readings)
    BaseState.fold((MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    try:
        prompt = Idle().on(PromptSubmitted(prompt="go on").with_standing(standing), settings)
        assert [n.rendered() for n in prompt.nudges] == ["new messages 7, 8"]
        stop = Idle().on(IdleEvent().with_standing(standing), settings)
        assert [n.key for n in stop.nudges] == ["messages.new_messages_to_answer", "workers.act_on_the_reports"]
        piped = Idle().on(ToolStarting(tool="Bash", input={"command": "journal message read 7 | head -3"}).with_standing(standing), settings)
        assert piped.held is not None and piped.held.key == "messages.read_the_words_whole"
        read = Idle().on(ToolStarting(tool="Bash", input={"command": "ls"}).with_standing(standing), settings)
        assert read.held is None and [n.key for n in read.nudges] == ["messages.answer_before_anything_else", "messages.new_messages_to_answer"], "asked for the answer after three uses, and the inbox named every third use"
        their_file = Idle().on(ToolStarting(tool="Read", input={"file_path": f"{tmp_path}/files/message/5/a.png"}, read_paths=(f"{tmp_path}/files/message/5/a.png",)).with_standing(standing), settings)
        assert "messages.answer_before_anything_else" not in [n.key for n in their_file.nudges]
        held_unanswered = Standing({**readings, "messages": MessagesStanding(unread=(), unanswered=(5,), unanswered_files=(), uses_since_newest=0, times_named=0, uses_unanswered=10)})
        assert Idle().on(ToolStarting(tool="Bash", input={"command": "ls"}).with_standing(held_unanswered), settings).held.key == "messages.tools_held_until_answered"
        assert Idle().on(ToolStarting(tool="Bash", input={"command": "journal task list"}).with_standing(held_unanswered), settings).held is None
        held_unread = Standing({**readings, "messages": MessagesStanding(unread=(7,), unanswered=(), unanswered_files=(), uses_since_newest=1, times_named=5, uses_unanswered=0)})
        assert Idle().on(ToolStarting(tool="Edit", input={"file_path": "a.py"}, writes=True).with_standing(held_unread), settings).held.key == "messages.write_held_until_read"
        assert Idle().on(ToolStarting(tool="Read", input={"file_path": "a.py"}).with_standing(held_unread), settings).held is None
        sent = Idle().on(ToolFinished(tool="Bash", input={"command": "journal message send hi --reply-to 7"}, output="sent").with_standing(standing), settings)
        assert [n.key for n in sent.nudges] == ["messages.reply_by_tag"]
        face = Idle().on(ReactionGiven(environment_id=1, at=1.0, face="👍", message_id=7, by_user=True).with_standing(standing), settings)
        assert [n.rendered() for n in face.nudges][0].startswith("the user put 👍 on message 7")
        assert Idle().on(ReactionGiven(environment_id=1, at=1.0, face="👍", message_id=7, by_user=False).with_standing(standing), settings).nudges == ()
        dispatch = lambda **given: Idle().on(ToolStarting(tool="Agent", input=given).with_standing(standing), settings)
        assert dispatch(subagent_type="journal-researcher", description="d", prompt="p").held.key == "laws.name_the_model"
        assert dispatch(model="sonnet", subagent_type="general-purpose", description="d", prompt="p").held.key == "laws.name_a_profile"
        assert dispatch(model="sonnet", subagent_type="journal-researcher", description="d").held.key == "laws.bind_the_job"
        assert dispatch(model="sonnet", subagent_type="journal-medior", description="d", prompt="p").held.key == "profiles.worker_profile_is_not_a_subagent"
        assert dispatch(model="sonnet", subagent_type="journal-researcher", description="d", prompt="p").held.key == "workers.too_many_subagents"
        fewer = Standing({**readings, "workers": WorkersStanding(**{**readings["workers"].__dict__, "subagents_running": 1})})
        known = Idle().on(ToolStarting(tool="Agent", input={"model": "sonnet", "subagent_type": "journal-researcher", "description": "d", "prompt": "read src/a.py again"}).with_standing(fewer), settings)
        assert known.held.key == "workers.send_the_job_to_the_subagent" and "sub-1" in known.held.rendered()
        assert Idle().on(ToolStarting(tool="Agent", input={"model": "sonnet", "subagent_type": "journal-researcher", "description": "d", "prompt": "read src/b.py"}).with_standing(fewer), settings).held is None
        big = Idle().on(ToolFinished(tool="Bash", input={"command": "ls"}, output="\n" * 400).with_standing(standing), settings)
        assert [n.key for n in big.nudges] == ["laws.cap_the_output"]
        assert Idle().on(ToolStarting(tool="Read", input={"file_path": "a.py"}, file_lines=201).with_standing(standing), settings).held.key == "shell.read_the_file_in_parts"
        assert Idle().on(ToolStarting(tool="Bash", input={"command": "journal task list && ls"}).with_standing(standing), settings).held.key == "shell.journal_command_runs_alone"
        reader = Idle().on(ToolStarting(tool="Bash", input={"command": "journal output read 9 --grep FAILED"}).with_standing(standing), settings)
        shell_lines = lambda answered: [n.key for n in answered.nudges if n.key.startswith("shell.")]
        assert shell_lines(reader) == ["shell.use_the_reader"]
        again = Idle().on(ToolStarting(tool="Bash", input={"command": "journal output read 9 --grep x"}).with_standing(standing), settings)
        assert shell_lines(again) == ["shell.add_a_reader"]
        tipped = Standing({**readings, "shell": ShellStanding(**{**readings["shell"].__dict__, "tipped": (Shell.ADD_A_READER.create(command="journal output read <output> --grep x").rendered(),)})})
        assert shell_lines(Idle().on(ToolStarting(tool="Bash", input={"command": "journal output read 9 --grep x"}).with_standing(tipped), settings)) == []
        tick = Idle().on(Ticked(quiet_for=6.0, at=500.0).with_standing(standing), settings)
        by_key = {n.key: n.rendered() for n in tick.nudges}
        assert by_key["shell.outputs_ended"].startswith("output 3 finished; output 4 failed with code 1") and by_key["shell.check_the_background"].startswith("output 12 still running")
        assert sorted(by_key) == ["shell.check_the_background", "shell.outputs_ended", "workers.act_on_the_reports"]
        assert [n.key for n in Idle().on(Ticked(quiet_for=1.0, at=200.0).with_standing(standing), settings).nudges] == ["workers.act_on_the_reports"]
        assert Idle().on(ToolStarting(tool="Read", input={"file_path": str(private / "keys.json")}).with_standing(standing), settings).held.key == "secrets.secrets_out_of_reach"
        allowed = Idle().on(SecretAllowed(environment_id=0, at=1.0, secret_id=2, title="GitHub", programs=("gh",)).with_standing(standing), settings)
        assert [n.rendered() for n in allowed.nudges][0].startswith("the user let secret 2, GitHub, go to gh")
        assert Idle().on(ToolStarting(tool="AskUserQuestion", input={}).with_standing(standing), settings).held.key == "questions.ask_through_the_journal"
        worktree_file = str(tmp_path / "worktrees" / "3-Lady-Lovelace" / "a.py")
        assert Idle().on(ToolStarting(tool="Edit", input={"file_path": worktree_file}, writes=True, written_paths=(worktree_file,)).with_standing(standing), settings).held.key == "workers.file_is_the_workers"
        back = Idle().on(WorkerBack(environment_id=1, at=1.0, worker_id=2, name="Lady Lovelace", report=40).with_standing(standing), settings)
        assert [n.rendered() for n in back.nudges] == ["worker 2, Lady Lovelace, reported in 40"]
    finally:
        BaseState.fold(())


def test_a_state_that_defines_a_conduct_listeners_name_answers_in_its_place():
    class Quiet(Listening):
        def on_tool_starting_inbox(self, event: ToolStarting, settings: SettingsValue) -> Transition:
            return self.unchanged()

    BaseState.fold((InboxConduct,))
    try:
        assert Listening().on(ToolStarting(tool="Write", input={}), SettingsValue({})).nudges == (LINE, OTHER, OTHER)
        assert Quiet().on(ToolStarting(tool="Write", input={}), SettingsValue({})).nudges == (LINE, OTHER), "the state's own answer stands where the conduct's would have"
    finally:
        BaseState.fold(())


def test_the_conduct_of_skills_briefing_and_memory_say_the_debts_hold_on_them_and_whisper_from_the_standing():
    from journal.features.skills.support.skills_conduct import SkillsConduct
    from journal.features.skills.support.skills_standing import SkillsStanding
    from journal.features.skills.support.skill_card import SkillCard
    from journal.features.briefing.support.briefing_conduct import BriefingConduct
    from journal.features.briefing.support.briefing_standing import BriefingStanding
    from journal.features.memory.support.memory_conduct import MemoryConduct
    from journal.features.memory.support.memory_standing import MemoryStanding
    from journal.features.memory.support.memory_row import MemoryRow
    from journal.features.plans.support.plans_standing import PlansStanding
    from journal.features.tasks.support.tasks_standing import TasksStanding
    from journal.events.agent.idle import Idle as IdleEvent
    from journal.events.rows.rule_made import RuleMade
    from journal.support.chat_mark import ChatMark
    settings = SettingsValue({})
    cards = (SkillCard("journal", ".claude/skills/journal/SKILL.md", "h1", (), ()), SkillCard("plans", ".claude/skills/journal-plans/SKILL.md", "h2", ("plan", "roadmap"), ("following_plan",)))
    readings = {
        "plans": PlansStanding((), None), "tasks": TasksStanding(in_hand=0, parked=(), blocked=(), broken_waits=(), first_parked_why="", last_commands=()),
        "skills": SkillsStanding(owed=("journal",), loaded={"plans": "h2"}, skills=cards),
        "briefing": BriefingStanding(oriented=False, environment="main", others_lately_at="09:12", rules="1. Always test", rules_count=1, facts="", reminders="1. Log often", waiting="2 tasks"),
        "memory": MemoryStanding(mark_owed=50, context_mark=50, rows=(MemoryRow("fact", 3, "the port is 8420", ("port",), ChatMark.FACTS),)),
    }
    standing = Standing(readings)
    BaseState.fold((SkillsConduct, BriefingConduct, MemoryConduct))
    try:
        started = Idle().on(SessionStarted(source="startup").with_standing(standing), settings)
        keys = [n.key for n in started.nudges]
        assert keys[:4] == ["skills.read_the_skill_first", "briefing.journal_ready", "briefing.handle_the_journal_quietly", "briefing.the_laws_apply"]
        assert "briefing.you_took_over" in keys and "briefing.rules_in_force" in keys and "briefing.facts_here" not in keys and "briefing.reminders_here" in keys and "briefing.waiting_for_you" in keys and keys[-1] == "briefing.look_before_the_first_write"
        assert ".claude/skills/journal/SKILL.md" in started.nudges[0].rendered()
        compacted = Idle().on(SessionStarted(source="compact").with_standing(standing), settings)
        assert "briefing.you_took_over" not in [n.key for n in compacted.nudges]
        prompt = Idle().on(PromptSubmitted(prompt="draw me a roadmap").with_standing(standing), settings)
        assert [n.key for n in prompt.nudges] == [], "the plans skill is read already, by its hash"
        unread = Standing({**readings, "skills": SkillsStanding(owed=(), loaded={}, skills=cards)})
        assert [n.rendered() for n in Idle().on(PromptSubmitted(prompt="draw me a roadmap").with_standing(unread), settings).nudges][0].startswith("read the plans skill before anything else")
        held = Idle().on(ToolStarting(tool="Edit", input={"file_path": "a.py"}, writes=True).with_standing(standing), settings)
        assert held.held is not None and held.held.key == "skills.read_the_skill_first", "the first hold wins: the skill, then the look, then the mark"
        assert Idle().on(ToolStarting(tool="Read", input={"file_path": "a.py"}).with_standing(standing), settings).held is None
        stop = Idle().on(IdleEvent().with_standing(standing), settings)
        assert stop.held is not None and stop.held.key == "skills.stopped_owing"
        paid = Standing({**readings, "skills": SkillsStanding(owed=(), loaded={}, skills=cards)})
        assert Idle().on(ToolStarting(tool="Edit", input={"file_path": "a.py"}, writes=True).with_standing(paid), settings).held.key == "briefing.look_before_the_first_write"
        looked = Standing({**paid.readings, "briefing": BriefingStanding(**{**readings["briefing"].__dict__, "oriented": True})})
        assert Idle().on(ToolStarting(tool="Edit", input={"file_path": "a.py"}, writes=True).with_standing(looked), settings).held.key == "memory.write_held_until_decided"
        assert Idle().on(IdleEvent().with_standing(looked), settings).held.rendered().startswith("you stopped while the journal awaits a decision at the context mark, 50% full")
        decided = Standing({**looked.readings, "memory": MemoryStanding(mark_owed=0, context_mark=50, rows=readings["memory"].rows)})
        assert Idle().on(ToolStarting(tool="Edit", input={"file_path": "a.py"}, writes=True).with_standing(decided), settings).held is None
        crossed = Idle().on(ToolStarting(tool="Read", input={"file_path": "a.py"}, context=0.81, session="s1").with_standing(decided), settings)
        assert [n.rendered() for n in crossed.nudges] == ["context 80% full: decide what to keep from it. `journal fact create \"<what is true here>\"`, `journal rule create \"<the ruling>\"`, `journal reminder create \"<do this>\"`, or `journal nothing survives \"<why>\"`"] or crossed.nudges[0].key == "memory.decide_at_the_mark"
        assert Idle().on(ToolStarting(tool="Read", input={"file_path": "a.py"}, context=0.6, session="s1").with_standing(decided), settings).nudges == ()
        whispered = Idle().on(ToolStarting(tool="Bash", input={"command": "lsof -i :port"}).with_standing(decided), settings)
        assert [n.rendered() for n in whispered.typed] == ["fact 3: the port is 8420"]
        rule = Idle().on(RuleMade(environment_id=0, at=1.0, row_id=7, by_agent=True).with_standing(decided), settings)
        assert [n.key for n in rule.nudges] == ["memory.does_the_rule_apply_project_wide"] and "rule 7" in rule.nudges[0].rendered()
        assert Idle().on(RuleMade(environment_id=0, at=1.0, row_id=7, by_agent=False).with_standing(decided), settings).nudges == ()
    finally:
        BaseState.fold(())
