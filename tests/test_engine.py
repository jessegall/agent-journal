"""Phase five: the machine. A write in Idle is refused with how to declare work; after task start a stop says carry on, once; done makes the agent idle again; stuck pauses and a tool use lifts it; the state survives a new server."""

import json
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen
from journal.events.rows.worker_mention import WorkerMention

import pytest

from journal.providers.claude import Claude
from journal.support.tool_call import ToolCall

shell = lambda line: Claude().call("Bash", {"command": line})

from journal.app import App
from journal.engine.support.session_agents import SessionAgents
from journal.config import Config
from journal.support.caller import Caller
from journal.engine.state_machine import StateMachine
from journal.features.tasks.states.impasse import Impasse
from journal.features.tasks.states.ready import Ready
from journal.features.tasks.states.working import Working
from journal.models.agent import Agent
from journal.models.setting import Setting
from journal.db.migrations.stack_seed import StackSeed
from journal.repositories.agents import Agents
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.models.task import Task
from journal.events.listener import Listener
from journal.engine.job import Job
from journal.events.bus import Bus
from journal.events.rows.plan_started import PlanStarted
from journal.events.rows.row_event import RowEvent
from journal.events.rows.row_resolved import RowResolved
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.task_logged import TaskLogged
from journal.events.rows.task_started import TaskStarted
from journal.events.rows.question_answered import QuestionAnswered
from journal.events.rows.worker_reported import WorkerReported
from journal.events.models.updated import Updated
from journal.engine.row_event_delivery import RowEventDelivery
from journal.models.question import Question
from journal.models.task_log import TaskLog
from journal.models.task_state import TaskState
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from datetime import datetime, timezone
from journal.repositories.entries import Entries
from journal.http.agents.agent_activity import AgentActivity
from journal.engine.support.stack_history import StackHistory
from journal.repositories.scope import Scope
from journal.support.actor import Actor
from journal.repositories.setting_rows import SettingRows
from dataclasses import dataclass, replace

from journal.engine.base_state import BaseState
from journal.engine.conduct import Conduct
from journal.engine.states.wait import Wait
from journal.engine.support.block import Block
from journal.events.feature_data import FeatureData
from journal.support.rejection import Rejection
from journal.engine.nudge import Nudge
from journal.engine.states.compacting import Compacting as CompactingState
from journal.engine.states.ended import Ended
from journal.features.registry import Registry
from journal.engine.support.data_readers import DataReaders
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
from journal.engine.states_catalogue import StatesCatalogue
from journal.engine.support.transition import Transition

AGENT = Caller.agent("main", "s1", "claude")
USER = Caller.user("main")


@pytest.fixture(scope="module")
def boot():
    def booted(root: Path, patch: pytest.MonkeyPatch) -> App:
        app = App(Config(root, port=0))
        app.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
        app.runtime().start()
        return app
    return booted


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


def test_task_start_moves_the_agent_to_working_and_every_stop_says_carry_on(app: App):
    hook(app, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    app.console().run(["task", "create", "ship it", "--start"], AGENT)
    assert app.container.get(SessionAgents).top("s1").task_id == 1
    assert write(app)[0] == 200
    status, body = hook(app, "Stop")
    assert body.get("decision") == "block" and "task 1 is in hand, last logged just now: carry on" in body["reason"], "a stop with work in hand is held, which is how Claude is told to go on"
    assert hook(app, "Stop")[1].get("decision") == "block", "every fresh stop with work in hand is held, until a stuck"
    assert hook(app, "PreCompact")[1] == {}, "a compaction hook carries nothing to the agent; the marks said it"


def test_done_makes_the_agent_idle_again(app: App):
    hook(app, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["task", "complete", "1"], AGENT)
    assert isinstance(app.container.get(SessionAgents).top("s1"), Ready)
    assert hook(app, "Stop")[1] == {}


def test_stuck_pauses_and_the_next_tool_use_goes_back_to_where_it_was(app: App):
    hook(app, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["stuck", "stuck on the login"], AGENT)
    machine = app.container.get(StateMachine)
    assert isinstance(app.container.get(SessionAgents).top("s1"), Impasse) and app.container.get(SessionAgents).top("s1").reason == "stuck on the login"
    assert hook(app, "Stop")[1] == {}
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert app.container.get(SessionAgents).top("s1").task_id == 1


def test_a_feature_switched_off_takes_its_gate_with_it(app: App):
    app.container.get(SettingRows).save(Setting(environment_id=0, key="features.tasks", value=False), Actor.user(1))
    app.console().run(["task", "create", "t", "--start"], AGENT)
    assert hook(app, "Stop")[1] == {}


def test_the_session_end_ends_the_agent_and_a_new_start_of_the_same_session_revives_it(app: App):
    hook(app, "SessionStart")
    hook(app, "SessionEnd")
    assert app.container.get(SessionAgents).top("s1").name == "ended"
    hook(app, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    assert app.container.get(SessionAgents).top("s1").name == "idle"


def test_the_state_is_in_the_database_so_a_new_server_finds_it(tmp_path):
    first = App(Config(tmp_path, port=0))
    first.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    first.runtime().start()
    hook(first, "SessionStart")
    first.console().run(["environment", "overview"], AGENT)
    first.console().run(["task", "create", "t", "--start"], AGENT)
    first.runtime().stop()
    second = App(Config(tmp_path, port=0))
    second.runtime().start()
    try:
        assert second.container.get(SessionAgents).top("s1").task_id == 1
        assert write(second)[0] == 200
    finally:
        second.runtime().stop()


def test_a_tick_reaches_the_machine_without_a_hook(app: App):
    from journal.engine.clock import Clock
    hook(app, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    app.container.get(Clock).tick(app.container.get(Clock).time())
    assert isinstance(app.container.get(SessionAgents).top("s1"), Ready)


class Counting(Job):
    """A job that notes the time of each of its ticks."""

    def __init__(self, interval_seconds: float) -> None:
        self.interval_seconds, self.ticks = interval_seconds, []

    def tick(self, time: float) -> None:
        self.ticks.append(time)


class Failing(Counting):
    def tick(self, time: float) -> None:
        super().tick(time)
        raise RuntimeError("a tick that fails")


def test_the_job_runner_ticks_each_job_at_its_own_interval_on_a_driven_clock(app: App):
    from journal.engine.clock import Clock
    from journal.engine.job_runner import JobRunner
    runner = JobRunner(app.container.get(Clock), Bus())
    every_second, every_three_seconds, failing = Counting(1.0), Counting(3.0), Failing(2.0)
    for job in (every_second, every_three_seconds, failing):
        runner.register(job)
    waits = [runner.run_due(float(second)) for second in range(10)]
    assert every_second.ticks == [float(second) for second in range(1, 10)], "a job is first due one interval after the runner sees it"
    assert every_three_seconds.ticks == [3.0, 6.0, 9.0], "each job at its own interval"
    assert failing.ticks == [2.0, 4.0, 6.0, 8.0], "a job that raises is logged and ticked again at its next turn"
    assert waits == [1.0] * 10, "the runner sleeps until the next job is due"


def test_a_timeout_is_started_at_a_moment_asked_at_a_later_one_and_kept_by_a_state_through_its_row():
    from journal.features.tasks.states.external_wait import ExternalWait
    from journal.support.timeout import Timeout
    reminder = Timeout.minutes(15).started(100.0)
    assert not reminder.is_elapsed(999.0) and reminder.is_elapsed(1000.0), "fifteen minutes after the time it was started at"
    assert not reminder.started(1000.0).is_elapsed(1899.0), "reset by a later moment, it counts from there"
    assert Timeout.seconds(30).started(5.0).is_elapsed(35.0) and not Timeout.seconds(30).started(5.0).is_elapsed(34.0)
    assert Timeout.tool_uses(25).started(10).is_elapsed(35) and not Timeout.tool_uses(25).started(10).is_elapsed(34), "a count of tool uses"
    assert Timeout.marks(1).started(2).is_elapsed(3) and not Timeout.marks(1).started(2).is_elapsed(2), "a count of context marks"
    waiting = ExternalWait.opened("the build", "checks:2", 100.0)
    assert ExternalWait.restored(json.loads(json.dumps(waiting.serialized()))) == waiting, "a state keeps its timeouts through the json on its row"


def test_one_task_in_hand_park_resume_and_await(app: App):
    hook(app, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    console = app.console()
    console.run(["task", "create", "first", "--start"], AGENT)
    console.run(["task", "create", "second"], AGENT)
    refused = console.run(["task", "start", "2"], AGENT)
    assert refused.code == 1 and "task 1 is in hand" in refused.error
    console.run(["task", "suspend", "1", "waiting for the designer"], AGENT)
    assert isinstance(app.container.get(SessionAgents).top("s1"), Ready), "parked: nothing in hand"
    assert console.run(["task", "resume", "1"], AGENT).code == 0 and app.container.get(SessionAgents).top("s1").task_id == 1
    assert console.run(["await", "the deploy to finish", "--until", "false"], AGENT).code == 0
    assert app.container.get(SessionAgents).top("s1").name == "awaiting" and hook(app, "Stop")[1] == {}, "waiting is quiet at a stop"
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    assert app.container.get(SessionAgents).top("s1").task_id == 1, "working again lifts the wait"


def test_edits_with_nothing_logged_are_asked_named_and_held_as_the_settings_say(app: App):
    from journal.support.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.setting_rows import SettingRows
    for key, value in (("tasks.first_nudge_after", 5), ("tasks.name_every", 10), ("tasks.log_after", 20)):
        app.container.get(SettingRows).save(Setting(environment_id=0, key=key, value=value), Actor.system())
    hook(app, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    answers = [write(app) for _ in range(21)]
    assert all(status == 200 for status, _ in answers[:20])
    assert "5 edits since you logged task 1: say where it stands" in json.dumps(answers[5][1]) and "logged" not in json.dumps(answers[4][1]), "the first ask after five"
    assert "task 1 in hand, 10 edits" in json.dumps(answers[10][1]), "named back every ten"
    assert answers[20][0] == 409 and "20 edits since you logged task 1" in answers[20][1]["error"]
    assert all(status == 200 for status, _ in [hook(app, "PreToolUse", tool_name="Read", tool_input={}) for _ in range(3)]), "a read is never held for a log"
    app.console().run(["task", "log", "1", "halfway"], AGENT)
    assert write(app)[0] == 200


def test_every_stop_with_a_task_in_hand_says_carry_on_and_stuck_is_the_way_out(app: App):
    hook(app, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    app.console().run(["task", "create", "t", "--start"], AGENT)
    answers = [hook(app, "Stop", stop_hook_active=i > 0) for i in range(4)]
    assert all(item[1].get("decision") == "block" and "task 1 is in hand, last logged just now: carry on" in item[1]["reason"] for item in answers), "there is no repeated-stop escape"
    app.console().run(["stuck", "I cannot reach the service"], AGENT)
    assert hook(app, "Stop")[1] == {}, "stuck lets the agent stop"
def test_a_blocked_task_waits_on_something_outside_and_is_neither_offered_nor_nudged(app: App):
    from journal.models.task_state import TaskState
    from journal.repositories.tasks import Tasks
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    console.run(["task", "create", "the tree", "--start"], AGENT)
    assert "waiting on: a talk with the user" in console.run(["task", "block", "1", "a talk with the user"], AGENT).text
    assert app.container.get(Tasks).find(1).state == TaskState.BLOCKED and app.container.get(SessionAgents).top("s1").name == "idle"
    assert hook(app, "Stop")[1].get("decision") != "block", "a blocked task is not offered, in auto mode or not"
    assert "blocked tasks: 1 the tree (waiting on: a talk with the user)" in console.run(["environment", "overview"], AGENT).text
    assert "open again" in console.run(["task", "unblock", "1"], AGENT).text and app.container.get(Tasks).find(1).state == TaskState.OPEN


def test_a_write_needs_no_task(app: App):
    hook(app, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    assert write(app)[0] == 200, "a quick edit is the agent's own; a task is for work worth tracking"

def test_the_menu_watcher_confirms_what_the_journal_caused_closes_what_it_cannot_place_and_leaves_the_users_own(app: App, monkeypatch):
    import os
    import time as timing
    from journal.engine.menu_watcher import MenuWatcher
    from journal.repositories.messages import Messages
    from journal.supervisor_link import SupervisorLink
    transmitted = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: transmitted.append({"verb": verb, **fields}))
    hook(app, "SessionStart")
    watcher, link = app.container.get(MenuWatcher), app.container.get(SupervisorLink)
    agent = app.container.get(SessionAgents).agent("s1", 1)
    screens = app.config.home / "runtime" / "screens"
    screens.mkdir(parents=True, exist_ok=True)
    (app.config.home / "runtime" / "inboxes").mkdir(parents=True, exist_ok=True)
    (app.config.home / "runtime" / "inboxes" / "main").write_text(json.dumps({"socket": "/tmp/none.sock", "protocol": 1, "screen": str(screens / "main.out")}))
    def shown(text: str, still_for: float = 5.0) -> None:
        path = screens / "main.out"
        path.write_text(text)
        os.utime(path, (timing.time() - still_for, timing.time() - still_for))
    switch = "\x1b[1mSwitch model?\x1b[0m\r\nYour next response will be slower\r\n\r\n❯ 1. Yes, switch to Opus 5.5\r\n  2. No, go back\r\n"
    link.choose(1, "/model opus")
    shown(switch)
    assert watcher.check(agent) == "\r" and transmitted[-1] == {"verb": "keys", "name": "agent", "keys": "\r"}, "a confirmation the journal's pick caused is taken with Enter"
    assert watcher.check(agent) == "", "and answered once"
    from journal.engine.support.menu_answers import MenuAnswers
    picks = {"Turn it on": 2, "Pick one": 0}
    monkeypatch.setattr(MenuAnswers, "ask", lambda self, menu, provider: self._asked.__setitem__(self.key(menu), next((o for o in menu.options if o.number == picks.get(menu.options[0].label)), None)))
    requested = app.container.get(MenuAnswers)
    resolved = lambda: [timing.sleep(0.05) for _ in range(40) if requested._running - set(requested._asked)]
    shown("Something new?\r\n❯ 1. Turn it on\r\n  2. Leave it alone for now\r\n")
    line_text = watcher.check(agent)
    resolved()
    assert (line_text or watcher.check(agent)) == "\x1b[B\r", "a menu the word rules cannot settle is answered by an independent agent asked off the watcher's thread"
    shown("Something else?\r\n❯ 1. Turn it on\r\n  2. Leave it alone for now\r\n")
    assert watcher.check(agent) == "\x1b[B\r", "and its pick is remembered for the same options"
    shown("Odd one?\r\n❯ 1. Pick one\r\n  2. Pick two\r\n")
    line_text = watcher.check(agent)
    resolved()
    assert (line_text or watcher.check(agent)) == "\x1b", "a menu even the asked agent cannot place is closed with Escape"
    from journal.repositories.scope import Scope
    with app.container.get(Scope).environment(1):
        assert any("closed it with Escape" in m.text for m in app.container.get(Messages).scoped()), "and a card says so"
    permission = "Bash command\r\nrm -f build/*.log\r\n\r\nDo you want to proceed?\r\n❯ 1. Yes\r\n  2. Yes, and don't ask again for rm commands in build\r\n  3. No, and tell Claude what to do differently (esc)\r\n"
    launches = app.config.home / "runtime" / "launches"
    launches.mkdir(parents=True, exist_ok=True)
    (launches / "main.json").write_text(json.dumps({"front": {"command": ["claude", "--settings", "{}"]}}))
    shown(permission)
    assert watcher.check(agent) != "\r", "a permission question under a launch that keeps the prompts is the user's to answer"
    (launches / "main.json").write_text(json.dumps({"front": {"command": ["claude", "--dangerously-skip-permissions", "--settings", "{}"]}}))
    shown(permission.replace("build", "dist"))
    assert watcher.check(agent) == "\r", "a permission question the provider asks anyway under a launch that skips the prompts is answered with yes"
    (screens / "main.keyed").touch()
    shown("Pick a theme\r\n❯ 1. Dark\r\n  2. Light\r\n")
    assert watcher.check(agent) == "", "a picker that came up right after keys at the keyboard is the user's own"
    shown(switch.replace("Opus 5.5", "Sonnet 5.5") + "\r\n──────\r\n❯ \r\n──────\r\n  agent-journal · main\r\n")
    assert watcher.check(agent) == "\r", "a yes-or-no confirmation of what the user just asked at the keyboard is confirmed, seen by its cursor though the prompt box is drawn below it"
    shown("Pick a colour\r\n❯ 1. Red\r\n  2. Blue\r\n", still_for=0.0)
    assert watcher.check(agent) == "", "a menu just drawn is not answered yet"
    busy = lambda seconds: f"· Shimmying… ({seconds}s · ↓ 3.9k tokens)\r\n\r\n────────────────\r\n" + switch.replace("Opus 5.5", "Fable 5.1")
    shown(busy(49), still_for=0.0)
    assert watcher.check(agent) == "", "a menu first seen under a moving spinner waits one look"
    shown(busy(51), still_for=0.0)
    assert watcher.check(agent) == "\r", "the switch of model is confirmed at the next look while the agent works, its spinner counting above the rule: the menu stood the same, whatever the screen did, and only a model change asks it"


def test_a_typed_line_goes_out_on_one_line(app: App, monkeypatch):
    """One with breaks would arrive as pasted text that never matches it, and be typed again."""
    from journal.supervisor_link import SupervisorLink
    transmitted = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: transmitted.append(fields))
    app.container.get(SupervisorLink).type(1, "the command finished: cat <<EOF\nx\nEOF")
    assert transmitted[-1]["line"] == "[journal] the command finished: cat <<EOF x EOF"


LINE = Nudge("tests", "line", "a line")
OTHER = Nudge("tests", "other", "another line")
WHY = Nudge("tests", "why", "held here")


class ServerCatalogue:
    def states(self):
        return [Ready, Working]

    def modes(self):
        return []

    def silenced(self, nudge):
        return False


class Rows:
    def option(self, option):
        return {"tasks.log_after": 7}.get(option.key, option.default)


@dataclass(frozen=True)
class Listening(BaseState):
    name = "listening"

    def on_tool_starting(self, event: ToolStarting, settings: SettingsValue) -> Transition:
        return self.none(LINE)

    def on_agent_event(self, event: AgentEvent, settings: SettingsValue) -> Transition:
        return self.none(OTHER)

    def on_push(self, settings):
        return ()

    def label(self) -> str:
        return "not a listener"


def test_the_stack_keeps_its_bottom_changes_only_its_top_and_comes_back_from_its_data():
    stack = Stack((Ready(), Working(task_id=3)))
    assert stack.top() == Working(task_id=3)
    assert stack.pushed(Ended()).serialized()[-1] == {"state": "ended", "data": {}}
    assert stack.popped().serialized() == [{"state": "idle", "data": {"silenced_at": 0.0, "suspension_reported": False}}]
    assert stack.popped().popped() == stack.popped()
    assert stack.with_top(Working(task_id=4)).top().task_id == 4
    catalogue = StatesCatalogue(ServerCatalogue())
    assert catalogue.stack(Agent(stack=tuple(stack.serialized()))) == stack
    assert catalogue.stack(Agent(state="working", data={"task_id": 3})) == stack
    assert catalogue.stack(Agent(stack=({"state": "gone", "data": {}},))).top() == Ready()


def test_merged_answers_say_every_nudge_in_order_hold_on_the_first_and_move_once():
    idle = Ready()
    answers = [idle.none(LINE), idle.push(Working(task_id=1), OTHER), idle.refuse(WHY), idle.pop(), idle.refuse(OTHER)]
    merged = Transition.merged(idle, answers)
    assert merged.nudges == (LINE, OTHER)
    assert merged.pushed == Working(task_id=1) and not merged.popped
    assert merged.refusal is WHY
    assert merged.dropped == ("pop",)
    assert merged.target is idle
    assert Transition.merged(idle, [idle.swap(Working(task_id=2))]).target == Working(task_id=2)
    assert Transition.merged(idle, []).target is idle


def test_every_listener_whose_event_matches_runs_the_most_specific_first_and_the_base_hears_compaction_and_the_end():
    settings, state = SettingsValue({}), Listening()
    assert state.respond(ToolStarting(call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {}))), settings).nudges == (LINE, OTHER)
    assert state.respond(SessionEnded(), settings).nudges == (OTHER,)
    assert state.respond(Event(), settings) == state.none()
    assert state.respond(Compacting(), settings).pushed == CompactingState()
    assert state.respond(SessionEnded(), settings).pushed == Ended()
    assert [method.__name__ for _, method in Listening.listeners()] == ["on_tool_starting", "on_agent_event", "on_compacting", "on_session_ended", "on_session_retired"]


def test_settings_is_a_frozen_value_of_the_options_read_by_option():
    option = Option("tasks.log_after", "Log after", "", 50)
    assert SettingsValue.applied(Rows(), [option]).value(option) == 7


def test_every_agent_event_carries_the_time_it_was_placed_and_a_tick_carries_its_own():
    placed = ToolStarting(call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {}))).placed("s1", 1, "claude", None, 12.5)
    assert placed.time == 12.5 and placed.session == "s1"
    assert Ticked(session="s1", environment_id=1, time=3.0, silence_seconds=0.0).time == 3.0


def test_a_renamed_state_answers_as_before_through_its_on_listeners_and_a_plain_method_is_none():
    settings = SettingsValue({})
    assert Ended().respond(ToolStarting(call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {}))), settings).popped
    assert Ended().respond(SessionEnded(), settings) == Ended().none()
    names = [method.__name__ for _, method in Ended.listeners()]
    assert set(names[:4]) == {"on_session_started", "on_prompt_submitted", "on_tool_starting", "on_session_ended"} and names[4:] == ["on_compacting", "on_session_retired"]


def test_the_stack_is_seeded_from_the_state_and_its_pause_chain_unwound_with_idle_at_the_bottom(connection, bus, scope):
    agents = Agents(connection, bus, scope)
    stuck = agents.save(Agent(environment_id=1, session="s9", state="stuck", data={"resume": {"state": "working", "data": {"task_id": 3, "resume": {"state": "idle", "data": {}}}}}), Actor.system())
    missing = agents.save(Agent(environment_id=1, session="s8", state="gone", data={}), Actor.system())
    StackSeed().apply(connection)
    assert agents.find(stuck.id).stack == ({"state": "idle", "data": {}}, {"state": "working", "data": {"task_id": 3}}, {"state": "stuck", "data": {}})
    assert agents.find(missing.id).stack == ({"state": "idle", "data": {}}, {"state": "gone", "data": {}})


def test_the_session_end_pushes_ended_on_the_stack_and_a_new_start_pops_it(app: App):
    hook(app, "SessionStart")
    hook(app, "SessionEnd")
    agents = app.container.get(Agents)
    assert [row["state"] for row in agents.session_agent("s1").stack] == ["idle", "ended"]
    hook(app, "SessionStart")
    assert [row["state"] for row in agents.session_agent("s1").stack] == ["idle"]


CALLS: list[str] = []


@dataclass(frozen=True)
class Noting(Wait):
    name = "noting"

    def on_push(self, settings):
        CALLS.append("push noting")
        return (LINE.create(),)

    def on_pop(self, settings):
        CALLS.append("pop noting")
        return ()


@dataclass(frozen=True)
class Refusing(Wait):
    name = "refusing"

    def on_push(self, settings):
        return Block(WHY.create())


@dataclass(frozen=True)
class Catching(BaseState):
    name = "catching"

    def on_suspend(self, settings):
        CALLS.append("suspend catching")
        return ()

    def on_resume(self, data: FeatureData, settings):
        CALLS.append("resume catching")
        return self.pop()


def test_the_lifecycle_hooks_run_in_order_say_their_lines_refuse_a_push_and_catch_up_beneath_a_pop(app: App):
    CALLS.clear()
    hook(app, "SessionStart")
    machine, settings = app.container.get(StateMachine), SettingsValue({WorkersFeature.MODE.key: "builder"})
    data = Stack((Ready(), Catching()))
    pushed = machine.hook_machine(data, data.pushed(Noting()), settings, FeatureData({}))
    assert pushed.stack == data.pushed(Noting()) and pushed.nudges == (LINE.create(),) and pushed.refusal is None
    refused = machine.hook_machine(data, data.pushed(Refusing()), settings, FeatureData({}))
    assert refused.stack == data and refused.refusal == Block(WHY.create())
    popped = machine.hook_machine(data.pushed(Noting()), data, settings, FeatureData({}))
    assert popped.stack == Stack((Ready(),)) and popped.nudges == ()
    assert CALLS == ["suspend catching", "push noting", "suspend catching", "pop noting", "resume catching"]
    with pytest.raises(Rejection):
        machine.push("s1", 1, Refusing(), Actor.system(), "a refused push")
    assert [row["state"] for row in app.container.get(Agents).session_agent("s1").stack] == ["idle"]


def test_a_push_and_a_pop_write_the_trail_and_the_agents_page_shows_the_stack_top_first(app: App):
    hook(app, "SessionStart")
    app.console().run(["task", "create", "t", "--start"], AGENT)
    app.console().run(["stuck", "lost"], AGENT)
    with app.container.get(Scope).environment(1):
        row = next(item for item in app.container.get(AgentActivity).page(app.container.get(Agents).scoped()) if item["session"] == "s1")
    assert [s["name"] for s in row["stack"]] == ["stuck", "working", "idle"] and row["stack"][0]["awaits"]
    assert [(t["before"], t["after"]) for t in row["trail"]] == [([], ["idle"]), (["idle"], ["idle", "working"]), (["idle", "working"], ["idle", "working", "stuck"])]
    write(app)
    with app.container.get(Scope).environment(1):
        trail = [e.data for e in app.container.get(Entries).kind_entries(StackHistory.KIND) if e.data["session"] == "s1"]
    popped = next(e for e in trail if [row["state"] for row in e["before"]] == ["idle", "working", "stuck"])
    assert popped["after"][-1]["state"] == "working" and popped["cause"]


def test_journal_panic_pushes_pops_and_empties_the_stack_by_hand_and_the_trail_names_the_agent(app: App):
    hook(app, "SessionStart")
    console, agents = app.console(), app.container.get(Agents)
    assert console.run(["panic", "working", "focus=parsing"], AGENT).text.strip() == "the stack, bottom to top: idle, working(focus=parsing)"
    assert console.run(["panic", "stuck", "reason=lost"], AGENT).text.startswith("the stack, bottom to top: idle, working(focus=parsing), stuck(")
    assert console.run(["panic", "pop"], AGENT).text.strip().endswith("idle, working(focus=parsing)")
    assert console.run(["panic", "nowhere"], AGENT).code != 0
    assert console.run(["panic", "idle"], AGENT).text.strip() == "the stack, bottom to top: idle"
    assert [row["state"] for row in agents.session_agent("s1").stack] == ["idle"]
    with app.container.get(Scope).environment(1):
        newest = app.container.get(Entries).kind_entries(StackHistory.KIND)[0]
    assert newest.data["cause"] == "journal panic idle" and newest.actor == AGENT.actor


class Hearing(Listener[PlanStarted]):
    def __init__(self) -> None:
        self.heard: list[PlanStarted] = []

    def handle(self, event: PlanStarted) -> None:
        self.heard.append(event)


def test_a_saved_started_plan_sends_plan_started_once_and_a_plain_edit_sends_none(app: App):
    hearing = Hearing()
    app.container.get(Bus).listen(PlanStarted, hearing)
    plans, tasks = app.container.get(Plans), app.container.get(Tasks)
    with app.container.get(Scope).environment(1):
        task = tasks.save(Task(environment_id=1, title="first"), Actor.system())
        plan = plans.save(Plan(environment_id=1, title="p", state=PlanState.APPROVED), Actor.system())
        started = plans.save(plan.started(task, 5.0), Actor.system())
        assert started.events == () and hearing.heard == [PlanStarted(environment_id=1, time=5.0, row_id=plan.id, actor="system", plan_id=plan.id, task_id=task.id)]
        plans.save(started.with_(title="renamed"), Actor.system())
        assert len(hearing.heard) == 1


def test_the_models_carry_the_events_their_changes_mean():
    time = datetime(2026, 10, 20, 23, 0, tzinfo=timezone.utc)
    task = Task(id=7, environment_id=1, title="t", state=TaskState.STARTED)
    assert [type(e) for e in task.finished(time, "x").events] == [TaskClosed, RowResolved] and task.finished(time, "x").events[1].ref == "tasks:7"
    assert task.suspended("later", time).events[0] == TaskClosed(environment_id=1, time=time.timestamp(), task_id=7, outcome="parked")
    assert Task(id=8, environment_id=1, title="u").started(time).events == (TaskStarted(environment_id=1, time=time.timestamp(), task_id=8, title="u", plan_id=0),)
    assert TaskLog.build(task, "where it stands", 3.0).events == (TaskLogged(environment_id=1, time=3.0, task_id=7),)
    question = Question(id=4, environment_id=1, text="?")
    assert [type(e) for e in question.answered("yes", 2.0).events] == [QuestionAnswered, RowResolved] and question.posed(1.0).events[0].question_id == 4
    assert Worker(id=9, environment_id=1, name="w").reported(5.0, 4).events == (WorkerReported(environment_id=1, time=5.0, worker=WorkerMention(9, "w", None), report=4, ref="workers:9", outcome="worker 9, w, reported"),)


def test_a_row_event_reaches_the_live_agents_top_in_its_environment_and_updated_reaches_no_state(app: App):
    hook(app, "SessionStart")
    hook(app, "SessionEnd")
    hook(app, "SessionStart", session_id="s2")
    agents, bus = app.container.get(Agents), app.container.get(Bus)
    assert [item.session for item in agents.current_scoped(1)] == ["s2"]
    assert any(isinstance(listener, RowEventDelivery) for listener in bus.listeners(RowEvent))
    assert not any(isinstance(listener, (RowEventDelivery, StateMachine)) for listener in bus.listeners(Updated))
    bus.dispatch(PlanStarted(environment_id=1, time=1.0, plan_id=1, task_id=0))
    assert [row["state"] for row in agents.session_agent("s2").stack] == ["idle", "following_plan"], "the live agent of the environment follows the plan"


def test_the_nudge_registry_hands_back_an_id_lists_every_nudge_and_the_nudger_refuses_one_it_does_not_hold(app: App):
    registry, owned = app.container.get(NudgeRegistry), Nudge("engine", "test_line", "a line of the test")
    assert registry.register(LINE) == "tests.line" and registry.lookup("tests.line") is LINE and registry.register(owned) == "engine.test_line"
    assert registry.lookup("engine.nothing_while_compacting") is Engine.COMPACTION_PAUSE
    assert all(nudge.key in registry.nudges for feature in app.container.get(Registry).features for nudge in feature.nudges)
    listed = app.console().run(["nudge", "list"], AGENT).text
    assert "tests.line  [tests]  a line" in listed and "tasks.carry_on  [tasks]" in listed and listed.strip().endswith("nudges")
    hook(app, "SessionStart")
    agent = app.container.get(Agents).session_agent("s1")
    with pytest.raises(Rejection):
        app.container.get(Nudger).deliver(agent, OTHER.create())
    assert app.container.get(Nudger).deliver(agent, owned.create()) == "a line of the test"


def test_the_engines_own_states_wait_compacting_and_ended_answer_hand_built_events():
    settings, owned, subagents = SettingsValue({}), ToolStarting(call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {}))), ToolStarting(call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {})), subagent="a1")
    assert Wait().respond(PromptSubmitted(prompt="go on"), settings).popped
    assert not Wait().respond(PromptSubmitted(prompt="[journal] a line"), settings).popped
    assert Wait().respond(owned, settings).popped and not Wait().respond(subagents, settings).popped
    assert Wait().wait_description() == ("", "")
    assert CompactingState().respond(owned, settings).refusal == Engine.COMPACTION_PAUSE.create()
    assert CompactingState().respond(SessionStarted(), settings).popped
    assert all(Ended().respond(event, settings).popped for event in (SessionStarted(), PromptSubmitted(prompt="hi"), owned))


def test_a_nudge_is_one_class_whose_create_fills_its_blanks_and_rendered_says_the_line():
    nudge = Nudge("tests", "two_blanks", "{{n}} of {{what}}", "read {{what}}")
    assert nudge.create(n=3, what="them").rendered() == "3 of them. read them"
    assert nudge.create(n=3, what="them").key == "tests.two_blanks" and nudge.create().rendered() == "{{n}} of {{what}}. read {{what}}"
    assert nudge.text("its own words").rendered() == "its own words"


def test_the_data_is_read_per_feature_and_travels_on_the_event_the_machine_asks(app: App):
    hook(app, "SessionStart")
    console = app.console()
    console.run(["task", "create", "the feature data", "--start"], AGENT)
    console.run(["message", "send", "a word from the user"], USER)
    agent = app.container.get(Agents).session_agent("s1")
    with app.container.get(Scope).environment(1):
        data = app.container.get(DataReaders).agent_data(agent)
    assert data.part(TasksFeature).current_task == 1 and data.part(TasksFeature).suspended == ()
    assert len(data.part(MessagesFeature).unread) == 1 and data.part(BriefingFeature).has_overview is False
    assert data.part(ShellFeature).background == () and data.part(WorkersFeature).idle_workers == ()
    event = ToolStarting(call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {}))).with_data(data)
    assert event.data.part(TasksFeature).current_task == 1 and ToolStarting(call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {}))).data.parts == {}


class InboxConduct(Conduct):
    def on_tool_starting(self, event: ToolStarting, settings: SettingsValue) -> Transition:
        return self.none(OTHER)


class LawsConduct(Conduct):
    def on_tool_starting(self, event: ToolStarting, settings: SettingsValue) -> Transition:
        return self.refuse(WHY)

    def on_agent_event(self, event: AgentEvent, settings: SettingsValue) -> Transition:
        return self.pop()

    def label(self) -> str:
        return "not a listener"


def test_the_features_conduct_is_folded_into_the_base_state_and_every_matching_listener_runs_the_states_own_first():
    settings, event = SettingsValue({}), ToolStarting(call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {})))
    answered = Listening().respond(event, settings, (InboxConduct, LawsConduct))
    assert answered.nudges == (LINE, OTHER, OTHER) and answered.refusal is WHY and answered.popped and answered.dropped == ()
    pushing = Catching().respond(event, settings, (InboxConduct, LawsConduct))
    assert [method.__name__ for _, method in Catching.listeners((InboxConduct, LawsConduct))][-3:] == ["on_tool_starting", "on_tool_starting", "on_agent_event"]
    assert pushing.popped
    assert Ended().respond(event, settings, (InboxConduct, LawsConduct)).popped and Ended().respond(event, settings, (InboxConduct, LawsConduct)).dropped == ("pop",)
    assert all("laws" not in method.__name__ for _, method in Ended.listeners())


def test_the_states_and_the_conduct_of_tasks_and_plans_answer_the_row_events_from_the_data():
    from journal.features.plans.plans_conduct import PlansConduct
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.features.plans.states.following_plan import FollowingPlan
    from journal.features.plans.states.plans_ready import PlansReady
    from journal.features.plans.states.plans_working import PlansWorking
    from journal.events.rows.plan_approved import PlanApproved
    from journal.events.rows.task_started import TaskStarted
    settings = SettingsValue({WorkersFeature.MODE.key: "builder"})
    from journal.features.plans.support.started_plan import StartedPlan
    plans = PlansData(approved=(), started=StartedPlan(plan_id=5, next_task=0, started_task=7, started_task_briefing="it has no brief and nothing logged yet", tasks=(7, 8), remaining_tasks=2, checkpoint_pause=False, checkpoint_phase=0))
    tasks = TasksData(current_task=7, last_log_line="", suspended=(), suspension_summary="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", first_suspension_reason="", next_open=None, last_commands=())
    data = FeatureData({"plans": plans, "tasks": tasks})
    assert PlansReady().respond(SessionStarted(time=4.0).with_data(data), settings).pushed == FollowingPlan(plan_id=5, task_id=7, approved=True, logged_at=4.0)
    assert PlansReady().respond(SessionStarted().with_data(FeatureData({"plans": PlansData((), None), "tasks": tasks})), settings).pushed is None
    started = TaskStarted(environment_id=1, time=1.0, task_id=7, title="t", plan_id=0).with_data(data)
    assert PlansWorking(task_id=7, logged_at=2.0).respond(started, settings).target == FollowingPlan(plan_id=5, task_id=7, approved=True, logged_at=2.0)
    assert FollowingPlan(plan_id=5, task_id=7).respond(started, settings).target == FollowingPlan(plan_id=5, task_id=7, logged_at=1.0)
    approved = PlansReady().respond(PlanApproved(environment_id=1, time=1.0, plan_id=5, user_origin=True).with_data(data), settings, (PlansConduct,))
    assert [nudge.key for nudge in approved.nudges] == ["plans.the_user_approved_the_plan"]
    agent_index = PlansReady().respond(PlanApproved(environment_id=1, time=1.0, plan_id=5, user_origin=False).with_data(data), settings, (PlansConduct,))
    assert agent_index.nudges == ()
    next_task = PlansReady().respond(TaskStarted(environment_id=1, time=1.0, task_id=8, title="the next", plan_id=5).with_data(data), settings, (PlansConduct,))
    assert next_task.nudges[0].rendered() == "plan 5: task 8, the next is next. it has no brief and nothing logged yet"


def test_the_conduct_of_voices_etiquette_pins_and_migration_speak_from_the_data():
    from journal.features.voices.feature import Voices
    from journal.features.voices.voices_conduct import VoicesConduct
    from journal.features.voices.support.voices_data import VoicesData
    from journal.features.etiquette.feature import Etiquette
    from journal.features.etiquette.etiquette_conduct import EtiquetteConduct
    from journal.features.etiquette.support.etiquette_data import EtiquetteData
    from journal.features.pins.pins_conduct import PinsConduct
    from journal.features.pins.support.pins_data import PinsData
    from journal.features.migration.migration_conduct import MigrationConduct
    from journal.features.migration.support.migration_data import MigrationData
    from journal.events.agent.tool_finished import ToolFinished
    from journal.events.agent.turn_displayed import TurnDisplayed
    from journal.events.rows.setting_changed import SettingChanged
    settings = SettingsValue({WorkersFeature.MODE.key: "builder", Etiquette.REMINDER_INTERVAL.key: 50})
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.tasks.support.tasks_data import TasksData
    data = FeatureData({"plans": PlansData((), None), "tasks": TasksData(current_task=0, last_log_line="", suspended=(), suspension_summary="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", first_suspension_reason="", next_open=None, last_commands=()), "voices": VoicesData(instruction="as a butler"), "etiquette": EtiquetteData(reminder_gap=50), "pins": PinsData(pinned=("https://a.test/pinned",), recent_suggestions=("https://a.test/said",)), "migration": MigrationData(version_3_waiting=True)})
    started = Ready().respond(SessionStarted().with_data(data), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct))
    assert [nudge.key for nudge in started.nudges] == ["voices.how_to_talk_to_the_user", "migration.version_3_not_brought_across"]
    assert "as a butler" in started.nudges[0].rendered()
    assert [n.key for n in Ready().respond(SessionStarted(source="resume").with_data(data), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct)).terminal_lines] == ["voices.say_you_are_back"]
    changed = Ready().respond(SettingChanged(environment_id=1, time=1.0, setting=Voices.VOICE_OPTIONS[0].key).with_data(data), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct))
    assert [n.key for n in changed.nudges] == ["voices.the_voice_changed"]
    assert Ready().respond(SettingChanged(environment_id=1, time=1.0, setting="shell.short_output").with_data(data), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct)).nudges == ()
    turn = Ready().respond(TurnDisplayed(text="the user should run journal task complete 3, see https://a.test/new and https://a.test/said").with_data(data), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct))
    assert [n.key for n in turn.nudges] == ["etiquette.no_shop_talk", "etiquette.say_you_not_the_user", "pins.pin_the_link"]
    assert "https://a.test/new" in turn.nudges[2].rendered()
    assert Ready().respond(TurnDisplayed(text="see https://a.test/pinned", final=False).with_data(data), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct)).nudges == ()
    finished = Ready().respond(ToolFinished(call=ToolCall(tool="Bash", input={}, operation=Claude().operation("Bash", {})), output="opened https://a.test/pr/1").with_data(data), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct))
    assert [n.key for n in finished.nudges] == ["etiquette.a_line_is_an_instruction", "pins.pin_the_link"]
    silent = FeatureData({**data.parts, "etiquette": EtiquetteData(reminder_gap=3)})
    assert Ready().respond(ToolFinished(call=ToolCall(tool="Bash", input={}, operation=Claude().operation("Bash", {})), output="nothing", subagent="s1").with_data(data), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct)).nudges == ()
    assert Ready().respond(ToolFinished(call=ToolCall(tool="Bash", input={}, operation=Claude().operation("Bash", {})), output="nothing").with_data(silent), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct)).nudges == ()


def test_the_conduct_of_git_checks_triggers_and_plugins_speak_and_hold_from_the_event_and_the_data():
    from pathlib import Path
    from journal.features.git.git_conduct import GitConduct
    from journal.features.checks.checks_conduct import ChecksConduct
    from journal.features.triggers.triggers_conduct import TriggersConduct
    from journal.features.triggers.support.triggers_data import TriggersData
    from journal.features.plugins.plugins_conduct import PluginsConduct
    from journal.features.plugins.support.plugins_data import PluginsData
    from journal.models.open_task import OpenTask
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.events.agent.commit_detected import CommitDetected
    from journal.events.agent.prompt_submitted import PromptSubmitted
    from journal.events.rows.check_completed import CheckCompleted
    from journal.events.rows.message_arrived import MessageArrived
    from journal.models.trigger import Trigger
    from journal.models.trigger_action import TriggerAction
    settings = SettingsValue({})
    triggers = (Trigger(id=1, phrases=("deploy",), action=TriggerAction.DENY, text="no deploys tonight"), Trigger(id=2, phrases=("release",), action=TriggerAction.INSTRUCT, text="bump the version"), Trigger(id=3, phrases=("plan",), action=TriggerAction.SEQUENCE, text="Building a plan"))
    plugin_file = str(Path(".journal", "plugins", "x", "run.sh"))
    data = FeatureData({"plans": PlansData((), None), "tasks": TasksData(current_task=0, last_log_line="", suspended=(), suspension_summary="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", first_suspension_reason="", next_open=None, last_commands=()), "triggers": TriggersData(triggers=triggers), "plugins": PluginsData(root=Path("/p"), plugins_folder=Path("/p", ".journal", "plugins"))})
    assert Ready().respond(CommitDetected(sha="abcdef0123").with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct)).nudges == ()
    closed = Ready().respond(CommitDetected(sha="abcdef0123", closed=(4, 5), next_open=OpenTask(6, "the next", "", 0)).with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct))
    assert [n.rendered() for n in closed.nudges] == ["commit abcdef01 closed task 4, task 5", "tasks are open, and auto mode is on: task 6 next: the next. sure you want to stop? carry on with it, or `journal stuck \"<why>\"` if you are truly stuck"]
    failed = Ready().respond(CheckCompleted(environment_id=0, time=1.0, check_id=2, title="lint", passed=False, output="a\nb c", prior_failure=False, wait_target=False).with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct))
    assert [n.key for n in failed.nudges] == ["checks.check_failed"] and "b c" in failed.nudges[0].rendered()
    repeat = Ready().respond(CheckCompleted(environment_id=0, time=1.0, check_id=2, title="lint", passed=False, output="", prior_failure=True, wait_target=False).with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct))
    assert [n.key for n in repeat.nudges] == ["checks.check_still_failing"]
    assert Ready().respond(CheckCompleted(environment_id=0, time=1.0, check_id=2, title="lint", passed=False, output="", prior_failure=True, wait_target=True).with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct)).nudges == ()
    prompt = Ready().respond(PromptSubmitted(prompt="release it and plan the rest").with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct))
    assert [n.rendered() for n in prompt.nudges] == ["do this now: bump the version"]
    arrived = Ready().respond(MessageArrived(environment_id=1, time=1.0, text="deploy now").with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct))
    assert [n.rendered() for n in arrived.nudges] == ["no deploys tonight"]
    denied = Ready().respond(ToolStarting(call=shell("deploy prod")).with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct))
    assert denied.refusal is not None and denied.refusal.rendered() == "a trigger denies this: no deploys tonight"
    withheld = Ready().respond(ToolStarting(call=ToolCall(tool="Edit", input={"file_path": plugin_file}, operation=Claude().operation("Edit", {"file_path": plugin_file}), writes=True, edited_paths=(plugin_file,))).with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct))
    assert withheld.refusal is not None and withheld.refusal.key == "plugins.plugin_files_are_the_users"
    assert Ready().respond(ToolStarting(call=ToolCall(tool="Edit", input={"file_path": "src/a.py"}, operation=Claude().operation("Edit", {"file_path": "src/a.py"}), writes=True, edited_paths=("src/a.py",))).with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct)).refusal is None


def test_the_conduct_of_messages_laws_shell_secrets_questions_profiles_and_workers_speak_and_hold_from_the_data(tmp_path):
    from pathlib import Path
    from journal.features.messages.feature import Messages as MessagesFeature
    from journal.features.messages.messages_conduct import MessagesConduct
    from journal.features.messages.support.messages_data import MessagesData
    from journal.features.laws.laws_conduct import LawsConduct
    from journal.features.shell.feature import Shell
    from journal.features.shell.shell_conduct import ShellConduct
    from journal.features.shell.support.shell_data import ShellData
    from journal.features.shell.support.ended_output import EndedOutput
    from journal.features.shell.support.reader import Reader
    from journal.features.secrets.secrets_conduct import SecretsConduct
    from journal.features.secrets.support.secrets_data import SecretsData
    from journal.features.questions.questions_conduct import QuestionsConduct
    from journal.features.profiles.profiles_conduct import ProfilesConduct
    from journal.features.profiles.support.profiles_data import ProfilesData
    from journal.features.workers.feature import Workers as WorkersFeature
    from journal.features.workers.workers_conduct import WorkersConduct
    from journal.features.workers.support.workers_data import WorkersData
    from journal.features.workers.support.worker_worktree import WorkerWorktree
    from journal.features.shell.support.output_view import OutputView
    from journal.models.subagent import Subagent
    from journal.models.subagent_state import SubagentState
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.events.agent.stop import Stop
    from journal.events.agent.ticked import Ticked
    from journal.events.agent.tool_finished import ToolFinished
    from journal.events.rows.reaction_added import ReactionAdded
    from journal.events.rows.secret_allowed import SecretAllowed
    from journal.events.rows.worker_reported import WorkerReported
    settings = SettingsValue({MessagesFeature.TOOL_BLOCK_LIMIT.key: 10, MessagesFeature.ANSWER_REQUEST_LIMIT.key: 3, MessagesFeature.REMINDER_INTERVAL.key: 3, MessagesFeature.EDIT_BLOCK_LIMIT.key: 5, Shell.SHOWN.key: 100, WorkersFeature.SUBAGENT_LIMIT.key: 2, "tasks.auto": False})
    private = tmp_path / "private"
    parts = {
        "plans": PlansData((), None), "tasks": TasksData(current_task=0, last_log_line="", suspended=(), suspension_summary="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", first_suspension_reason="", next_open=None, last_commands=()),
        "messages": MessagesData(unread=(7, 8), unanswered=(5,), unanswered_files=(f"{tmp_path}/files/message/5/",), inbox_tool_uses=3, mention_count=1, uses_unanswered=4, peer_questions=()),
        "profiles": ProfilesData(names=("journal-researcher", "journal-medior"), subagents=("journal-researcher",), workers=("journal-medior",)),
        "shell": ShellData(background=(12,), backgrounded_at=100.0, unannounced=(EndedOutput(3, 0), EndedOutput(4, 1)), output_reads=("journal output read <output> --grep x", "journal output read <output> --grep x"), readers=(Reader("tests", "the failures", "FAILED"),), tipped=(), watch=OutputView.empty()),
        "secrets": SecretsData(root=tmp_path, folders=(private.resolve(),), spellings=(str(private),)),
        "workers": WorkersData(dispatched_workers=(), idle_workers=(Worker(id=2, name="Lady Lovelace", state=WorkerState.REPORTED),), active_subagents=2, subagents=(Subagent(id=1, dispatch="sub:1", started_at=1.0, task="read the plan", brief="look at src/a.py", agent_type="journal-researcher", model="sonnet", session="sub-1", state=SubagentState.FINISHED),), worktrees_root=tmp_path / "worktrees", worktrees=(WorkerWorktree("3-Lady-Lovelace", 3, "Lady Lovelace"),)),
    }
    data = FeatureData(parts)
    prompt = Ready().respond(PromptSubmitted(prompt="go on").with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert [n.rendered() for n in prompt.nudges] == ["new messages 7, 8"]
    stop = Ready().respond(Stop().with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert [n.key for n in stop.nudges] == ["messages.new_messages_to_answer", "workers.act_on_the_reports"]
    piped = Ready().respond(ToolStarting(call=shell("journal message read 7 | head -3")).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert piped.refusal is not None and piped.refusal.key == "messages.read_the_words_whole"
    read = Ready().respond(ToolStarting(call=shell("ls"), tool_use=3).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert read.refusal is None and [n.key for n in read.nudges] == ["messages.answer_before_anything_else", "messages.new_messages_to_answer"], "asked for the answer after three uses, and the inbox named every third use"
    their_file = Ready().respond(ToolStarting(call=ToolCall(tool="Read", input={"file_path": f"{tmp_path}/files/message/5/a.png"}, operation=Claude().operation("Read", {"file_path": f"{tmp_path}/files/message/5/a.png"}), read_paths=(f"{tmp_path}/files/message/5/a.png",))).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert "messages.answer_before_anything_else" not in [n.key for n in their_file.nudges]
    held_unanswered = FeatureData({**parts, "messages": MessagesData(unread=(), unanswered=(5,), unanswered_files=(), inbox_tool_uses=0, mention_count=0, uses_unanswered=10, peer_questions=())})
    assert Ready().respond(ToolStarting(call=shell("ls")).with_data(held_unanswered), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal.key == "messages.tools_held_until_answered"
    assert Ready().respond(ToolStarting(call=shell("journal task list")).with_data(held_unanswered), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal is None
    held_unread = FeatureData({**parts, "messages": MessagesData(unread=(7,), unanswered=(), unanswered_files=(), inbox_tool_uses=0, mention_count=5, uses_unanswered=0, peer_questions=())})
    assert Ready().respond(ToolStarting(call=ToolCall(tool="Edit", input={"file_path": "a.py"}, operation=Claude().operation("Edit", {"file_path": "a.py"}), writes=True)).with_data(held_unread), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal.key == "messages.write_held_until_read"
    assert Ready().respond(ToolStarting(call=ToolCall(tool="Read", input={"file_path": "a.py"}, operation=Claude().operation("Read", {"file_path": "a.py"}))).with_data(held_unread), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal is None
    transmitted = Ready().respond(ToolFinished(call=shell("journal message send hi --reply-to 7"), output="sent").with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert [n.key for n in transmitted.nudges] == ["messages.reply_by_tag"]
    face = Ready().respond(ReactionAdded(environment_id=1, time=1.0, face="👍", message_id=7, user_origin=True).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert [n.rendered() for n in face.nudges][0].startswith("the user put 👍 on message 7")
    assert Ready().respond(ReactionAdded(environment_id=1, time=1.0, face="👍", message_id=7, user_origin=False).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).nudges == ()
    dispatch = lambda **value: Ready().respond(ToolStarting(call=ToolCall(tool="Agent", input=value, operation=Claude().operation("Agent", value))).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert dispatch(subagent_type="journal-researcher", description="d", prompt="p").refusal.key == "laws.name_the_model"
    assert dispatch(model="sonnet", subagent_type="general-purpose", description="d", prompt="p").refusal.key == "laws.name_a_profile"
    assert dispatch(model="sonnet", subagent_type="journal-researcher", description="d").refusal.key == "laws.bind_the_job"
    assert dispatch(model="sonnet", subagent_type="journal-medior", description="d", prompt="p").refusal.key == "profiles.worker_profile_is_not_a_subagent"
    assert dispatch(model="sonnet", subagent_type="journal-researcher", description="d", prompt="p").refusal.key == "workers.too_many_subagents"
    fewer = FeatureData({**parts, "workers": WorkersData(**{**parts["workers"].__dict__, "active_subagents": 1})})
    existing = Ready().respond(ToolStarting(call=ToolCall(tool="Agent", input={"model": "sonnet", "subagent_type": "journal-researcher", "description": "d", "prompt": "read src/a.py again"}, operation=Claude().operation("Agent", {"model": "sonnet", "subagent_type": "journal-researcher", "description": "d", "prompt": "read src/a.py again"}))).with_data(fewer), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert existing.refusal.key == "workers.send_the_job_to_the_subagent" and "sub-1" in existing.refusal.rendered()
    assert Ready().respond(ToolStarting(call=ToolCall(tool="Agent", input={"model": "sonnet", "subagent_type": "journal-researcher", "description": "d", "prompt": "read src/b.py"}, operation=Claude().operation("Agent", {"model": "sonnet", "subagent_type": "journal-researcher", "description": "d", "prompt": "read src/b.py"}))).with_data(fewer), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal is None
    big = Ready().respond(ToolFinished(call=shell("ls"), output="\n" * 400).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert [n.key for n in big.nudges] == ["laws.cap_the_output"]
    assert Ready().respond(ToolStarting(call=ToolCall(tool="Read", input={"file_path": "a.py"}, operation=Claude().operation("Read", {"file_path": "a.py"}), file_lines=201)).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal.key == "shell.read_the_file_in_parts"
    assert Ready().respond(ToolStarting(call=shell("journal task list && ls")).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal.key == "shell.journal_command_runs_alone"
    reader = Ready().respond(ToolStarting(call=shell("journal output read 9 --grep FAILED")).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    shell_lines = lambda answered: [n.key for n in answered.nudges if n.key.startswith("shell.")]
    assert shell_lines(reader) == ["shell.use_the_reader"]
    repeat = Ready().respond(ToolStarting(call=shell("journal output read 9 --grep x")).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert shell_lines(repeat) == ["shell.add_a_reader"]
    tipped = FeatureData({**parts, "shell": ShellData(**{**parts["shell"].__dict__, "tipped": (Shell.READER_SUGGESTION.create(command="journal output read <output> --grep x").rendered(),)})})
    assert shell_lines(Ready().respond(ToolStarting(call=shell("journal output read 9 --grep x")).with_data(tipped), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))) == []
    tick = Ready().respond(Ticked(silence_seconds=6.0, time=500.0).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    by_key = {n.key: n.rendered() for n in tick.nudges}
    assert by_key["shell.outputs_ended"].startswith("output 3 finished; output 4 failed with code 1") and by_key["shell.check_the_background"].startswith("output 12 still running")
    assert sorted(by_key) == ["shell.check_the_background", "shell.outputs_ended", "workers.act_on_the_reports"]
    assert [n.key for n in Ready().respond(Ticked(silence_seconds=1.0, time=200.0).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).nudges] == ["workers.act_on_the_reports"]
    assert Ready().respond(ToolStarting(call=ToolCall(tool="Read", input={"file_path": str(private / "keys.json")}, operation=Claude().operation("Read", {"file_path": str(private / "keys.json")}))).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal.key == "secrets.secrets_out_of_reach"
    allowed = Ready().respond(SecretAllowed(environment_id=0, time=1.0, secret_id=2, title="GitHub", programs=("gh",)).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert [n.rendered() for n in allowed.nudges][0].startswith("the user let secret 2, GitHub, go to gh")
    assert Ready().respond(ToolStarting(call=ToolCall(tool="AskUserQuestion", input={}, operation=Claude().operation("AskUserQuestion", {}))).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal.key == "questions.ask_through_the_journal"
    worktree_file = str(tmp_path / "worktrees" / "3-Lady-Lovelace" / "a.py")
    assert Ready().respond(ToolStarting(call=ToolCall(tool="Edit", input={"file_path": worktree_file}, operation=Claude().operation("Edit", {"file_path": worktree_file}), writes=True, edited_paths=(worktree_file,))).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal.key == "workers.file_is_the_workers"
    back = Ready().respond(WorkerReported(environment_id=1, time=1.0, worker=WorkerMention(2, "Lady Lovelace", None), report=40, ref="workers:2", outcome="worker 2, Lady Lovelace, reported").with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert [n.rendered() for n in back.nudges] == ["worker 2, Lady Lovelace, reported in the chat"]


def test_a_state_whose_own_listener_stops_the_walk_answers_in_the_conducts_place():
    class Quiet(Listening):
        def on_tool_starting(self, event: ToolStarting, settings: SettingsValue) -> Transition:
            event.stop_propagation()
            return self.none()

    assert Listening().respond(ToolStarting(call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {}))), SettingsValue({}), (InboxConduct,)).nudges == (LINE, OTHER, OTHER)
    assert Quiet().respond(ToolStarting(call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {}))), SettingsValue({}), (InboxConduct,)).nudges == (), "a state that stops the walk answers alone; the conduct's listener is never heard"


def test_the_conduct_of_skills_briefing_and_memory_say_the_debts_hold_on_them_and_whisper_from_the_data():
    from journal.features.skills.skills_conduct import SkillsConduct
    from journal.features.skills.support.skills_data import SkillsData
    from journal.features.skills.support.skill_card import SkillCard
    from journal.features.briefing.briefing_conduct import BriefingConduct
    from journal.features.briefing.support.briefing_data import BriefingData
    from journal.features.memory.memory_conduct import MemoryConduct
    from journal.features.memory.support.memory_data import MemoryData
    from journal.features.memory.support.memory_row import MemoryRow
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.events.agent.stop import Stop
    from journal.events.rows.rule_created import RuleCreated
    from journal.support.card_kind import CardKind
    settings = SettingsValue({WorkersFeature.MODE.key: "builder", "tasks.auto": False})
    cards = (SkillCard("journal", ".claude/skills/journal/SKILL.md", "h1", (), ()), SkillCard("plans", ".claude/skills/journal-plans/SKILL.md", "h2", ("plan", "roadmap"), ("following_plan",)))
    parts = {
        "plans": PlansData((), None), "tasks": TasksData(current_task=0, last_log_line="", suspended=(), suspension_summary="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", first_suspension_reason="", next_open=None, last_commands=()),
        "skills": SkillsData(skills_due=("journal",), loaded={"plans": "h2"}, skills=cards),
        "briefing": BriefingData(has_overview=False, environment="main", peer_session_active_at="09:12", rules="1. Always test", rules_count=1, facts="", reminders="1. Log often", waiting="2 tasks"),
        "memory": MemoryData(threshold_due=50, context_threshold=50, rows=(MemoryRow("fact", 3, "the port is 8420", ("port",), CardKind.FACTS),), stale=()),
    }
    data = FeatureData(parts)
    started = Ready().respond(SessionStarted(source="startup").with_data(data), settings, (SkillsConduct, BriefingConduct, MemoryConduct))
    keys = [n.key for n in started.nudges]
    assert keys[:4] == ["skills.read_the_skill_first", "briefing.journal_ready", "briefing.handle_the_journal_quietly", "briefing.the_laws_apply"]
    assert "briefing.you_took_over" in keys and "briefing.rules_in_force" in keys and "briefing.facts_here" not in keys and "briefing.reminders_here" in keys and "briefing.waiting_for_you" in keys and keys[-1] == "briefing.look_before_the_first_write"
    assert ".claude/skills/journal/SKILL.md" in started.nudges[0].rendered()
    compacted = Ready().respond(SessionStarted(source="compact").with_data(data), settings, (SkillsConduct, BriefingConduct, MemoryConduct))
    assert "briefing.you_took_over" not in [n.key for n in compacted.nudges]
    prompt = Ready().respond(PromptSubmitted(prompt="draw me a roadmap").with_data(data), settings, (SkillsConduct, BriefingConduct, MemoryConduct))
    assert [n.key for n in prompt.nudges] == [], "the plans skill is read already, by its hash"
    unread = FeatureData({**parts, "skills": SkillsData(skills_due=(), loaded={}, skills=cards)})
    assert [n.rendered() for n in Ready().respond(PromptSubmitted(prompt="draw me a roadmap").with_data(unread), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).nudges][0].startswith("read the plans skill before anything else")
    withheld = Ready().respond(ToolStarting(call=ToolCall(tool="Edit", input={"file_path": "a.py"}, operation=Claude().operation("Edit", {"file_path": "a.py"}), writes=True)).with_data(data), settings, (SkillsConduct, BriefingConduct, MemoryConduct))
    assert withheld.refusal is not None and withheld.refusal.key == "skills.read_the_skill_first", "the first hold wins: the skill, then the look, then the mark"
    assert Ready().respond(ToolStarting(call=ToolCall(tool="Read", input={"file_path": "a.py"}, operation=Claude().operation("Read", {"file_path": "a.py"}))).with_data(data), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).refusal is None
    stop = Ready().respond(Stop().with_data(data), settings, (SkillsConduct, BriefingConduct, MemoryConduct))
    assert stop.refusal is not None and stop.refusal.key == "skills.stopped_owing"
    paid = FeatureData({**parts, "skills": SkillsData(skills_due=(), loaded={}, skills=cards)})
    assert Ready().respond(ToolStarting(call=ToolCall(tool="Edit", input={"file_path": "a.py"}, operation=Claude().operation("Edit", {"file_path": "a.py"}), writes=True)).with_data(paid), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).refusal.key == "briefing.look_before_the_first_write"
    looked = FeatureData({**paid.parts, "briefing": BriefingData(**{**parts["briefing"].__dict__, "has_overview": True})})
    assert Ready().respond(ToolStarting(call=ToolCall(tool="Edit", input={"file_path": "a.py"}, operation=Claude().operation("Edit", {"file_path": "a.py"}), writes=True)).with_data(looked), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).refusal.key == "memory.write_held_until_decided"
    assert Ready().respond(Stop().with_data(looked), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).refusal.rendered().startswith("you stopped while the journal awaits a decision at the context mark, 50% full")
    decided = FeatureData({**looked.parts, "memory": MemoryData(threshold_due=0, context_threshold=50, rows=parts["memory"].rows, stale=())})
    assert Ready().respond(ToolStarting(call=ToolCall(tool="Edit", input={"file_path": "a.py"}, operation=Claude().operation("Edit", {"file_path": "a.py"}), writes=True)).with_data(decided), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).refusal is None
    arrived = Ready().respond(ToolStarting(call=ToolCall(tool="Read", input={"file_path": "a.py"}, operation=Claude().operation("Read", {"file_path": "a.py"})), context=0.81, session="s1").with_data(decided), settings, (SkillsConduct, BriefingConduct, MemoryConduct))
    assert [n.rendered() for n in arrived.nudges] == ["context 80% full: decide what to keep from it. `journal fact create \"<what is true here>\"`, `journal rule create \"<the ruling>\"`, `journal reminder create \"<do this>\"`, or `journal memory skip \"<why>\"`"] or arrived.nudges[0].key == "memory.decide_at_the_mark"
    assert Ready().respond(ToolStarting(call=ToolCall(tool="Read", input={"file_path": "a.py"}, operation=Claude().operation("Read", {"file_path": "a.py"})), context=0.6, session="s1").with_data(decided), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).nudges == ()
    whispered = Ready().respond(ToolStarting(call=shell("lsof -i :port")).with_data(decided), settings, (SkillsConduct, BriefingConduct, MemoryConduct))
    assert [n.rendered() for n in whispered.terminal_lines] == ["fact 3 is about this and not in your context: journal fact read 3"], "a whisper tells the agent to read the row, never its words"
    prior_items = FeatureData({**decided.parts, "memory": MemoryData(threshold_due=0, context_threshold=50, rows=tuple(replace(row, presence=True) for row in parts["memory"].rows), stale=())})
    assert Ready().respond(ToolStarting(call=shell("lsof -i :port")).with_data(prior_items), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).terminal_lines == (), "a row in the context window is not whispered"
    rule = Ready().respond(RuleCreated(environment_id=0, time=1.0, row_id=7, agent_origin=True).with_data(decided), settings, (SkillsConduct, BriefingConduct, MemoryConduct))
    assert [n.key for n in rule.nudges] == ["memory.does_the_rule_apply_project_wide"] and "rule 7" in rule.nudges[0].rendered()
    assert Ready().respond(RuleCreated(environment_id=0, time=1.0, row_id=7, agent_origin=False).with_data(decided), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).nudges == ()


def test_awaiting_tells_each_workers_return_and_pops_on_the_last():
    from journal.features.tasks.states.external_wait import ExternalWait
    from journal.events.rows.worker_reported import WorkerReported
    from journal.events.rows.worker_stopped import WorkerStopped
    settings = SettingsValue({})
    waiting = ExternalWait.opened("worker 3, worker 4", "workers:3,workers:4", 0.0)
    first = waiting.respond(WorkerReported(environment_id=1, time=1.0, worker=WorkerMention(3, "Lady Lovelace", "s1"), report=9, ref="workers:3", outcome="worker 3, Lady Lovelace, reported"), settings)
    assert first.target.targets() == ["workers:4"] and not first.popped and first.nudges == (), "the wait settles the worker; the workers' conduct says its report"
    counterpart = waiting.respond(WorkerReported(environment_id=1, time=1.0, worker=WorkerMention(8, "x", "s1"), report=9, ref="workers:8", outcome="worker 8, x, reported"), settings)
    assert counterpart.target is waiting and counterpart.nudges == (), "a worker it does not wait on is not its business"
    last = first.target.respond(WorkerStopped(environment_id=1, time=2.0, worker=WorkerMention(4, "Herr Turing", ""), ref="workers:4", outcome="worker 4, Herr Turing, stopped before it reported"), settings)
    assert last.popped and [n.key for n in last.nudges] == ["tasks.wait_over"] and last.nudges[-1].rendered().startswith("the wait for worker 3, worker 4 is over: worker 3, Lady Lovelace, reported; worker 4, Herr Turing, stopped before it reported")
    from journal.events.rows.worker_dispatched import WorkerDispatched
    from journal.features.workers.workers_conduct import WorkersConduct
    owned = Working(task_id=7).respond(WorkerDispatched(environment_id=1, time=3.0, worker=WorkerMention(5, "Lady Lovelace", "s1"), awaiter="s1", ref="workers:5", label="worker 5").reaching("s1"), settings, (WorkersConduct,))
    assert owned.pushed == ExternalWait.opened("worker 5", "workers:5", 3.0), "a worker this agent dispatches pushes the wait on its work"
    assert Working(task_id=7).respond(WorkerDispatched(environment_id=1, time=3.0, worker=WorkerMention(5, "Lady Lovelace", "s2"), awaiter="s2", ref="workers:5", label="worker 5").reaching("s1"), settings, (WorkersConduct,)).pushed is None, "another session's worker is not waited on here"
    widened = ExternalWait.opened("worker 5", "workers:5", 3.0).respond(WorkerDispatched(environment_id=1, time=4.0, worker=WorkerMention(6, "Dr. Einstein", "s1"), awaiter="s1", ref="workers:6", label="worker 6").reaching("s1"), settings, (WorkersConduct,))
    assert widened.target == ExternalWait.opened("worker 5, worker 6", "workers:5,workers:6", 3.0) and widened.pushed is None, "a second dispatch widens the wait instead of stacking another"
    assert ExternalWait.opened("worker 5", "workers:5", 3.0).respond(ToolStarting(call=ToolCall(tool="Edit", input={}, operation=Claude().operation("Edit", {}), writes=True)), settings).target == ExternalWait.opened("worker 5", "workers:5", 3.0), "the agent works on while its workers run"


def test_idle_holds_the_stop_by_what_is_open_and_asks_on_the_ticks_from_the_data():
    from journal.features.plans.states.plans_ready import PlansReady
    from journal.features.plans.states.plans_working import PlansWorking
    from dataclasses import replace
    from journal.features.tasks.feature import Tasks as TasksFeature
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.features.plans.support.plans_data import PlansData
    from journal.models.open_task import OpenTask
    from journal.events.agent.stop import Stop
    from journal.events.agent.ticked import Ticked
    auto, manual = SettingsValue({TasksFeature.AUTO.key: True, WorkersFeature.MODE.key: "builder"}), SettingsValue({TasksFeature.AUTO.key: False, WorkersFeature.MODE.key: "builder"})
    nothing = TasksData(current_task=0, last_log_line="", suspended=(), suspension_summary="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", first_suspension_reason="", next_open=None, last_commands=())
    open_next = replace(nothing, next_open=OpenTask(4, "the footer", "", 0))
    parked = replace(open_next, suspended=(2,), suspension_summary="task 2 (the parser)", first_suspension_reason="a review first")
    broken = replace(open_next, broken_waits=(3,), broken_waits_summary="task 3 waits on check 1, lint, which cannot run")
    blocked = replace(nothing, blocked_without_wait=(5,), blocked_without_wait_summary="task 5 (the key)")
    of = lambda tasks, approved=(): FeatureData({"tasks": tasks, "plans": PlansData(approved, None)})
    stop = lambda data, settings=auto, prior_refusal=False: PlansReady(silenced_at=100.0).respond(Stop(prior_refusal=prior_refusal).with_data(data), settings)
    assert stop(of(parked)).refusal.rendered().startswith("parked tasks, still open: task 2 (the parser)")
    assert stop(of(broken)).refusal.rendered().startswith("task 3 waits on check 1, lint, which cannot run")
    assert stop(of(open_next, approved=(9,))).refusal.rendered().startswith("plan 9 is approved and not started")
    assert stop(of(open_next)).refusal.rendered().startswith("tasks are open, and auto mode is on: task 4 next: the footer")
    assert stop(of(open_next), manual).refusal is None, "off auto mode an open task is no reason to go on"
    assert stop(of(open_next), auto, prior_refusal=True).refusal is None, "a stop held once this turn passes"
    assert stop(of(parked), auto, prior_refusal=True).refusal is not None, "a parked task is named at every stop: parked is still open"
    assert stop(of(nothing)).refusal is None
    idle = PlansReady(silenced_at=0.0)
    active = idle.respond(ToolStarting(call=ToolCall(tool="Read", input={}, operation=Claude().operation("Read", {})), time=50.0).with_data(of(nothing)), auto)
    assert active.target == PlansReady(silenced_at=50.0, suspension_reported=False)
    assert idle.respond(PromptSubmitted(prompt="hi", time=70.0).with_data(of(nothing)), auto).target.silenced_at == 70.0
    tick = lambda data, time, state=idle, settings=auto: state.respond(Ticked(silence_seconds=0.0, time=time).with_data(data), settings)
    requested = tick(of(parked), 61.0)
    assert requested.target == PlansReady(silenced_at=0.0, suspension_reported=True) and requested.nudges[0].rendered().startswith("task 2 is still parked: can you continue it now?")
    assert tick(of(parked), 59.0).nudges == () and tick(of(parked), 61.0, PlansReady(silenced_at=0.0, suspension_reported=True)).nudges == (), "asked once per quiet"
    assert [n.key for n in tick(of(blocked), 45 * 60.0).nudges] == ["tasks.blocked_task_asked_about"] and tick(of(blocked), 20 * 60.0).nudges == ()
    assert [n.key for n in tick(of(nothing), 30 * 60.0).nudges] == ["tasks.check_in_after_quiet"] and tick(of(nothing), 30 * 60.0, idle, manual).nudges == ()
    assert tick(of(nothing), 61.0).nudges == ()
    assert idle.respond(SessionStarted(time=5.0).with_data(of(nothing)), auto).target == PlansReady(silenced_at=5.0)


def test_working_counts_its_edits_holds_and_says_its_lines_and_pops_when_its_task_closes():
    from journal.features.plans.states.plans_ready import PlansReady
    from journal.features.plans.states.plans_working import PlansWorking
    from dataclasses import replace
    from journal.features.tasks.feature import Tasks as TasksFeature
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.git.support.git_data import GitData
    from journal.events.agent.stop import Stop
    from journal.events.agent.ticked import Ticked
    from journal.events.rows.task_closed import TaskClosed
    from journal.events.rows.task_logged import TaskLogged
    settings = SettingsValue({TasksFeature.AUTO.key: True, TasksFeature.LOG_LIMIT.key: 4, TasksFeature.FIRST_DELAY.key: 2, TasksFeature.TASK_REMINDER_INTERVAL.key: 3, TasksFeature.LOG_AGE_LIMIT.key: 10})
    tasks = TasksData(current_task=7, last_log_line='"the parser reads"', suspended=(), suspension_summary="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", first_suspension_reason="", next_open=None, last_commands=())
    of = lambda current_task=7, approved=(): FeatureData({"tasks": replace(tasks, current_task=current_task), "plans": PlansData(approved, None), "git": GitData(uncommitted="a.py, b.py")})
    working = PlansWorking(task_id=7, logged_at=1000.0)
    write = lambda state, time=1001.0: state.respond(ToolStarting(call=ToolCall(tool="Edit", input={}, operation=Claude().operation("Edit", {}), writes=True), time=time).with_data(of()), settings)
    first = write(working)
    assert first.target == PlansWorking(task_id=7, logged_at=1000.0, edits=1, active_at=1001.0) and first.nudges == ()
    second = write(first.target)
    assert second.target.edits == 2 and second.nudges == ()
    third = write(second.target)
    assert third.target.edits == 3 and [n.key for n in third.nudges] == ["tasks.log_where_it_stands"] and "2 edits since you logged task 7" in third.nudges[0].rendered()
    fourth = write(third.target)
    assert fourth.target.edits == 4 and [n.key for n in fourth.nudges] == ["tasks.task_in_hand_repeated"]
    withheld = write(fourth.target)
    assert withheld.refusal is not None and withheld.refusal.rendered().startswith("4 edits since you logged task 7")
    read = fourth.target.respond(ToolStarting(call=ToolCall(tool="Read", input={}, operation=Claude().operation("Read", {})), time=1002.0).with_data(of()), settings)
    assert read.target.edits == 4 and read.refusal is None and read.target.active_at == 1002.0
    logged = fourth.target.respond(TaskLogged(environment_id=1, time=1500.0, task_id=7).with_data(of()), settings)
    assert logged.target == PlansWorking(task_id=7, logged_at=1500.0, edits=0, active_at=1001.0)
    assert fourth.target.respond(TaskLogged(environment_id=1, time=1500.0, task_id=8).with_data(of()), settings).target == fourth.target
    stop = lambda state, time, approved=(), prior_refusal=False: state.respond(Stop(prior_refusal=prior_refusal, time=time).with_data(of(approved=approved)), settings)
    assert stop(working, 1100.0).refusal.rendered().startswith("task 7 is in hand, last logged 1 min ago: carry on")
    assert stop(working, 1700.0).refusal.rendered().startswith("task 7, last logged 11 min ago: log where it stands first")
    assert stop(working, 1100.0, approved=(9,)).refusal.rendered().startswith("plan 9 is approved and not started")
    assert stop(working, 1100.0, prior_refusal=True).refusal is not None, "with a task in hand there is no escape by stopping twice"
    started = working.respond(SessionStarted(source="compact", time=1100.0).with_data(of()), settings)
    assert [n.key for n in started.nudges] == ["tasks.carry_on", "briefing.brief_and_log_after_compaction"] and 'last log "the parser reads"; uncommitted files: a.py, b.py' in started.nudges[1].rendered()
    assert [n.key for n in working.respond(SessionStarted(source="startup", time=1100.0).with_data(of()), settings).nudges] == ["tasks.carry_on"]
    assert [n.key for n in PlansWorking(task_id=7, active_at=0.0).respond(Ticked(silence_seconds=900.0, time=900.0).with_data(of()), settings).nudges] == ["tasks.task_still_open"], "a quarter of an hour of quiet, counted from the agent's last activity, names the open task"
    assert PlansWorking(task_id=7, active_at=0.0).respond(Ticked(silence_seconds=60.0, time=900.0).with_data(of()), settings).nudges == (), "an agent active a minute ago is not nagged, however old its task"
    assert PlansWorking(task_id=7, active_at=100.0).respond(Ticked(silence_seconds=0.0, time=900.0).with_data(of()), settings).nudges == ()
    assert working.respond(TaskClosed(environment_id=1, time=2.0, task_id=7, outcome="done").with_data(of()), settings).popped
    assert not working.respond(TaskClosed(environment_id=1, time=2.0, task_id=8, outcome="done").with_data(of()), settings).popped
    assert working.on_resume(of(current_task=0), settings).popped, "its task closed while it waited"
    assert working.on_resume(of(), settings) == (), "its task still in hand, the work goes on in silence: the wait that popped said what came"


def test_following_plan_keeps_the_next_task_stands_at_the_checkpoint_and_pops_when_the_plan_is_done():
    from journal.features.plans.states.plans_ready import PlansReady
    from journal.features.plans.states.plans_working import PlansWorking
    from dataclasses import replace
    from journal.features.plans.feature import Plans as PlansFeature
    from journal.features.plans.states.following_plan import FollowingPlan
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.plans.support.started_plan import StartedPlan
    from journal.features.tasks.feature import Tasks as TasksFeature
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.engine.support.block import Block
    from journal.events.agent.stop import Stop
    from journal.events.rows.plan_finished import PlanFinished
    from journal.events.rows.plan_started import PlanStarted
    from journal.events.rows.task_closed import TaskClosed
    from journal.events.rows.task_started import TaskStarted
    auto, manual = SettingsValue({TasksFeature.AUTO.key: True, TasksFeature.LOG_LIMIT.key: 50, TasksFeature.FIRST_DELAY.key: 25, TasksFeature.TASK_REMINDER_INTERVAL.key: 25}), SettingsValue({TasksFeature.AUTO.key: False})
    tasks = TasksData(current_task=0, last_log_line="", suspended=(), suspension_summary="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", first_suspension_reason="", next_open=None, last_commands=())
    plan = StartedPlan(plan_id=5, next_task=8, started_task=0, started_task_briefing="", tasks=(7, 8), remaining_tasks=1, checkpoint_pause=False, checkpoint_phase=0)
    of = lambda started: FeatureData({"tasks": tasks, "plans": PlansData((), started)})
    following = FollowingPlan(plan_id=5, task_id=7, approved=True, logged_at=10.0)
    assert following.on_push(auto) == () and isinstance(FollowingPlan(plan_id=5).on_push(auto), Block), "an unapproved plan is refused"
    closed = following.respond(TaskClosed(environment_id=1, time=20.0, task_id=7, outcome="done").with_data(of(plan)), auto)
    assert closed.target == replace(following, task_id=0, origin_state=7) and not closed.popped
    assert following.respond(TaskClosed(environment_id=1, time=20.0, task_id=9, outcome="done").with_data(of(plan)), auto).target == following
    started = closed.target.respond(TaskStarted(environment_id=1, time=30.0, task_id=8, title="next", plan_id=5).with_data(of(replace(plan, started_task=8))), auto)
    assert started.target == replace(following, task_id=8, origin_state=7, logged_at=30.0)
    checkpoint_pause = following.respond(TaskClosed(environment_id=1, time=20.0, task_id=7, outcome="done").with_data(of(replace(plan, checkpoint_pause=True, checkpoint_phase=2))), auto)
    assert checkpoint_pause.target == replace(following, task_id=0, origin_state=7, checkpoint_pause=True, phase=2)
    stopped = checkpoint_pause.target.respond(Stop().with_data(of(plan)), auto)
    assert stopped.refusal.rendered().startswith("plan 5: phase 2 is complete, and in auto mode it does not stop you")
    waits = checkpoint_pause.target.respond(Stop().with_data(of(plan)), manual)
    assert waits.refusal is None and waits.nudges[0].rendered().startswith("plan 5: phase 2 is complete and a checkpoint")
    assert checkpoint_pause.target.respond(SessionStarted(time=40.0).with_data(of(plan)), auto).nudges[0].key == "plans.phase_complete_at_a_checkpoint"
    assert checkpoint_pause.target.respond(ToolStarting(call=ToolCall(tool="Edit", input={}, operation=Claude().operation("Edit", {}), writes=True), time=41.0).with_data(of(plan)), auto).target == checkpoint_pause.target, "counts nothing at a checkpoint"
    finished = following.respond(PlanFinished(environment_id=1, time=50.0, plan_id=5).with_data(of(None)), auto)
    assert finished.popped and [n.key for n in finished.nudges] == ["plans.plan_done"]
    assert not following.respond(PlanFinished(environment_id=1, time=50.0, plan_id=6).with_data(of(plan)), auto).popped
    pushed = PlansReady().respond(PlanStarted(environment_id=1, time=1.0, plan_id=5, task_id=7).with_data(of(plan)), auto)
    assert pushed.pushed == FollowingPlan(plan_id=5, task_id=7, approved=True, logged_at=1.0)
    owned = PlansReady().respond(TaskStarted(environment_id=1, time=2.0, task_id=3, title="t", plan_id=0).with_data(of(None)), auto)
    assert owned.pushed == PlansWorking(task_id=3, logged_at=2.0)
    planned = PlansReady().respond(TaskStarted(environment_id=1, time=2.0, task_id=7, title="t", plan_id=0).with_data(of(plan)), auto)
    assert planned.pushed == FollowingPlan(plan_id=5, task_id=7, approved=True, logged_at=2.0)
    became = PlansWorking(task_id=7, logged_at=1.0, edits=2).respond(PlanStarted(environment_id=1, time=3.0, plan_id=5, task_id=7).with_data(of(plan)), auto)
    assert became.target == FollowingPlan(plan_id=5, task_id=7, approved=True, logged_at=1.0, edits=2)


def test_following_plan_pops_when_the_plan_is_postponed_or_abandoned_and_on_resume_when_it_is_no_longer_started():
    from dataclasses import replace
    from journal.features.plans.states.following_plan import FollowingPlan
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.plans.support.started_plan import StartedPlan
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.events.rows.plan_abandoned import PlanAbandoned
    from journal.events.rows.plan_postponed import PlanPostponed
    settings = SettingsValue({})
    tasks = TasksData(current_task=7, last_log_line="", suspended=(), suspension_summary="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", first_suspension_reason="", next_open=None, last_commands=())
    plan = StartedPlan(plan_id=5, next_task=8, started_task=7, started_task_briefing="", tasks=(7, 8), remaining_tasks=2, checkpoint_pause=False, checkpoint_phase=0)
    of = lambda started: FeatureData({"tasks": tasks, "plans": PlansData((), started)})
    following = FollowingPlan(plan_id=5, task_id=7, approved=True, logged_at=10.0)
    user_origin = following.respond(PlanPostponed(environment_id=1, time=20.0, plan_id=5, user_origin=True).with_data(of(None)), settings)
    assert user_origin.popped and [n.rendered() for n in user_origin.nudges] == ["the user postponed plan 5"]
    agent_index = following.respond(PlanPostponed(environment_id=1, time=20.0, plan_id=5, user_origin=False).with_data(of(None)), settings)
    assert agent_index.popped and agent_index.nudges == (), "the agent's own command needs no line"
    assert not following.respond(PlanPostponed(environment_id=1, time=20.0, plan_id=6, user_origin=True).with_data(of(plan)), settings).popped
    abandoned = following.respond(PlanAbandoned(environment_id=1, time=20.0, plan_id=5, user_origin=True).with_data(of(None)), settings)
    assert abandoned.popped and [n.rendered() for n in abandoned.nudges] == ["the user abandoned plan 5"]
    assert following.on_resume(of(None), settings).popped, "beneath a wait, a plan postponed meanwhile is over on resume"
    assert following.on_resume(of(replace(plan, plan_id=6)), settings).popped, "another plan started meanwhile: this one is over"
    assert following.on_resume(of(plan), settings) == (), "still the plan started here: the work goes on in silence"


def test_a_question_asked_pushes_waiting_and_its_answer_pops_it_on_top_or_on_resume():
    from journal.engine.states.compacting import Compacting
    from journal.features.questions.states.waiting import Waiting
    from journal.features.questions.questions_conduct import QuestionsConduct
    from journal.features.questions.support.questions_data import QuestionsData
    from journal.events.rows.question_answered import QuestionAnswered
    from journal.events.rows.question_posed import QuestionPosed
    from journal.events.agent.stop import Stop
    settings = SettingsValue({})
    of = lambda *open: FeatureData({"questions": QuestionsData(open=open)})
    requested = Working(task_id=7, logged_at=1.0).respond(QuestionPosed(environment_id=1, time=2.0, question_id=4).with_data(of(4)), settings, (QuestionsConduct,))
    assert requested.pushed == Waiting(question_id=4), "a question asked pushes the wait on the work in hand"
    waiting = Waiting(question_id=4)
    answered = waiting.respond(QuestionAnswered(environment_id=1, time=3.0, question_id=4).with_data(of()), settings, (QuestionsConduct,))
    assert answered.popped and [n.rendered() for n in answered.nudges][0].startswith("question 4 is answered")
    assert not waiting.respond(QuestionAnswered(environment_id=1, time=3.0, question_id=5).with_data(of(4)), settings, (QuestionsConduct,)).popped, "another question's answer is not this one's"
    assert waiting.respond(SessionStarted(time=4.0).with_data(of(4)), settings, (QuestionsConduct,)).popped is False and waiting.respond(Stop().with_data(of(4)), settings, (QuestionsConduct,)).refusal is None, "a stop while waiting is fine"
    assert waiting.on_resume(of(4), settings) == (), "beneath a compaction the wait stands while the question is open"
    assert waiting.on_resume(of(), settings).popped, "answered meanwhile, it pops on resume with the line"
    assert not Compacting().respond(QuestionAnswered(environment_id=1, time=3.0, question_id=4).with_data(of()), settings, (QuestionsConduct,)).popped, "the answer under a compaction waits for the resume"


def test_a_declared_wait_pushes_expecting_which_asks_on_the_ticks_and_pops_when_the_last_row_settles_and_stuck_is_quiet():
    from dataclasses import replace
    from journal.features.tasks.feature import Tasks as TasksFeature
    from journal.features.tasks.states.external_wait import ExternalWait
    from journal.features.tasks.states.impasse import Impasse
    from journal.models.open_task import OpenTask
    from journal.features.tasks.tasks_conduct import TasksConduct
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.events.agent.wait_request import WaitRequest
    from journal.events.agent.stop import Stop
    from journal.events.agent.impasse_report import ImpasseReport
    from journal.events.agent.ticked import Ticked
    from journal.events.rows.row_resolved import RowResolved
    auto, manual = SettingsValue({TasksFeature.AUTO.key: True}), SettingsValue({TasksFeature.AUTO.key: False})
    tasks = TasksData(current_task=7, last_log_line="", suspended=(), suspension_summary="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", first_suspension_reason="", next_open=OpenTask(9, "the next one", "", 0), last_commands=())
    of = lambda: FeatureData({"tasks": tasks})
    pushed = Working(task_id=7).respond(WaitRequest(focus="the build", end_refs="command_outputs:4,checks:2", time=100.0), auto, (TasksConduct,))
    assert pushed.pushed == ExternalWait.opened("the build", "command_outputs:4,checks:2", 100.0), "journal await pushes the wait on the work"
    assert Working(task_id=7).respond(ImpasseReport(reason="the login", time=1.0), auto, (TasksConduct,)).pushed == Impasse(reason="the login"), "journal stuck pushes Stuck"
    waiting = pushed.pushed
    assert waiting.respond(Stop(time=130.0).with_data(of()), auto).refusal is None and waiting.respond(Ticked(silence_seconds=10.0, time=130.0).with_data(of()), auto).nudges == (), "quiet at a stop and on an early tick"
    meanwhile = waiting.respond(Ticked(silence_seconds=70.0, time=170.0).with_data(of()), auto)
    assert meanwhile.target == replace(waiting, next_task_reported=True) and meanwhile.nudges[0].rendered().startswith("while you wait for the build, task 9, the next one is next"), "in auto mode the next task is named once after a minute"
    assert waiting.respond(Ticked(silence_seconds=70.0, time=170.0).with_data(of()), manual).nudges == (), "out of auto mode it is not"
    looked = meanwhile.target.respond(Ticked(silence_seconds=310.0, time=410.0).with_data(of()), auto)
    assert looked.target == replace(meanwhile.target, check_reminder=meanwhile.target.check_reminder.started(410.0)) and looked.nudges[0].rendered().startswith("check the build now: you have waited 5 min"), "every five quiet minutes the agent is asked to look"
    assert looked.target.respond(Ticked(silence_seconds=400.0, time=500.0).with_data(of()), auto).nudges == (), "and not again before five more"
    first = waiting.respond(RowResolved(environment_id=1, time=200.0, ref="command_outputs:4", outcome="output 4 finished"), auto)
    assert first.target == replace(waiting, end_refs="checks:2", outcomes="output 4 finished") and not first.popped, "one row settled, one still to come"
    assert waiting.respond(RowResolved(environment_id=1, time=200.0, ref="tasks:3"), auto).target == waiting, "a row it does not wait on is not its business"
    last = first.target.respond(RowResolved(environment_id=1, time=300.0, ref="checks:2", outcome="check 2 passed"), auto)
    assert last.popped and last.nudges[0].rendered().startswith("the wait for the build is over: output 4 finished; check 2 passed"), "the last row settled pops the wait with what each came to"
    assert Impasse(reason="the login").respond(Stop(time=1.0).with_data(of()), auto).refusal is None and Impasse(reason="the login").respond(Ticked(silence_seconds=900.0, time=901.0).with_data(of()), auto).nudges == (), "stuck is quiet"
    assert Impasse(reason="the login").respond(ToolStarting(call=ToolCall(tool="Read", input={}, operation=Claude().operation("Read", {}))), auto).popped, "its own tool use pops it"


def test_a_journal_command_is_no_tool_use_to_a_wait():
    from journal.features.questions.states.waiting import Waiting
    settings = SettingsValue({})
    waiting = Waiting(question_id=4)
    assert waiting.respond(ToolStarting(call=shell("journal task list")), settings).popped is False, "a journal command lifts no wait"
    assert waiting.respond(ToolStarting(call=shell("ls src")), settings).popped, "the agent's own tool use does"


def test_a_part_knows_whether_it_reads_an_output_and_the_shape_of_that_read():
    parts = shell("journal output read 12 --grep FAILED && ls src").parts
    assert (parts[0].reads_output, parts[0].read_shape) == (True, "journal output read <output> --grep FAILED"), "the number taken out, the read keeps its shape"
    assert not parts[1].reads_output and parts[1].read_shape == "ls src", "a part that reads no output has its own text as its shape"
    assert not shell("journal output read 3").parts[0].reads_output, "a plain read of a summary is no read by hand"


def test_the_engine_builds_its_listener_tables_once_and_the_container_one_instance_per_class(app: App):
    from journal.events.agent.stop import Stop
    from journal.features.messages.messages_conduct import MessagesConduct
    from journal.repositories.agents import Agents
    assert Working.listeners() is Working.listeners(), "a state's listener table is built once per class"
    assert Working.event_listeners(ToolStarting) is Working.event_listeners(ToolStarting) and Working.event_listeners(Stop) is Working.event_listeners(Stop), "the pick per event type is cached"
    previous = Working.event_listeners(ToolStarting)
    assert Working.event_listeners(ToolStarting, (MessagesConduct,)) is not previous, "the conducts a state hears are part of what its listeners are kept by"
    assert app.container.get(StateMachine) is app.container.get(StateMachine) and app.container.get(Agents) is app.container.get(Agents), "the container builds a class once"


def test_a_listener_may_stop_an_events_propagation_and_the_compacting_state_switches_the_typist_off_until_it_pops_and_starts_the_tool_count_again(app: App, monkeypatch):
    from journal.events.agent.ticked import Ticked
    from journal.events.rows.message_arrived import MessageArrived
    from journal.supervisor_link import SupervisorLink

    class Talkative(Conduct):
        def on_ticked(self, event: Ticked, settings: SettingsValue) -> Transition:
            return self.none(LINE)

        def on_message_arrived(self, event: MessageArrived, settings: SettingsValue) -> Transition:
            return self.none(OTHER)

    @dataclass(frozen=True)
    class Plain(BaseState):
        name = "plain"

    @dataclass(frozen=True)
    class Stopping(BaseState):
        name = "stopping"

        def on_ticked(self, event: Ticked, settings: SettingsValue) -> Transition:
            event.stop_propagation()
            return self.none()

    settings = SettingsValue({})
    tick = Ticked(silence_seconds=1.0).with_data(FeatureData({}))
    arrived = MessageArrived(environment_id=1, time=2.0, text="hi").with_data(FeatureData({}))
    assert Plain().respond(tick, settings, (Talkative,)).nudges == (LINE,) and Plain().respond(arrived, settings, (Talkative,)).nudges == (OTHER,), "in any other state the conduct speaks"
    assert Stopping().respond(tick, settings, (Talkative,)).nudges == (), "a listener that stops the event's propagation is the last to hear it, so the conduct is silent"
    assert Plain().respond(tick, settings, (Talkative,)).nudges == (LINE,), "the next walk of the same event starts again"
    assert CompactingState().respond(arrived, settings, (Talkative,)).nudges == (OTHER,), "compacting stops nothing itself: what the conduct says queues at the typist"
    assert CompactingState().respond(ToolStarting(call=shell("ls")).with_data(FeatureData({})), settings, (Talkative,)).refusal == Engine.COMPACTION_PAUSE.create(), "the hold on every tool stands"
    assert CompactingState().respond(SessionStarted(source="compact").with_data(FeatureData({})), settings, (Talkative,)).popped, "and the session's start still pops it"
    transmitted = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: transmitted.append(fields["line"]))
    hook(app, "SessionStart")
    write(app)
    write(app)
    agents, link = app.container.get(Agents), app.container.get(SupervisorLink)
    assert agents.session_agent("s1").tool_uses == 2
    link.type(1, "first")
    link.type(1, "held behind the first")
    assert transmitted == ["[journal] first"] and len(link.typed._held) == 1, "a line within the batch window queues"
    assert hook(app, "PreCompact")[0] == 200
    assert agents.session_agent("s1").stack[-1]["state"] == "compacting" and agents.session_agent("s1").tool_uses == 0, "the compaction pushes its state and sets the count back to zero"
    link.type(1, "a dump arrived")
    link.type(1, "the wait ended")
    link.release(1)
    assert transmitted == ["[journal] first"] and link.typed.batched(1) is None, "the typist is disabled while compacting: its queue is emptied and a line is dropped, not queued, since the look after the compaction tells the agent what it missed"
    hook(app, "SessionStart", source="compact")
    assert agents.session_agent("s1").stack[-1]["state"] != "compacting" and transmitted == ["[journal] first"]
    link.typed.typed(1, "")
    link.typed._sent_at[1] = 0.0
    link.typed._waiting.clear()
    link.type(1, "a wait ended")
    assert transmitted == ["[journal] first", "[journal] a wait ended"], "and enabled again once the state left"


def test_a_task_started_outside_the_plan_is_the_task_in_hand_of_the_plan_state_and_its_nudges_name_it():
    from journal.features.plans.states.following_plan import FollowingPlan
    settings = SettingsValue({})
    following = FollowingPlan(plan_id=19, approved=True)
    assert following.label() == "plan 19, with no task in hand"
    started = following.respond(TaskStarted(environment_id=1, time=5.0, task_id=1141, title="the developer tab", plan_id=0).with_data(FeatureData({})), settings)
    assert started.target.task_id == 1141 and started.target.label() == "task 1141" and started.target.logged_at == 5.0, "one task is in hand at a time, so the task started is the plan state's task whether the plan holds it or not"


def test_the_work_mode_is_the_bottom_state_the_orchestrator_dispatches_the_builder_carries_on_and_the_solo_mode_keeps_workers_out():
    from journal.events.agent.stop import Stop
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.plans.support.started_plan import StartedPlan
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.features.workers.feature import Workers
    from journal.features.workers.states.delegating import Delegating
    from journal.features.workers.states.orchestrating import Orchestrating
    from journal.features.workers.states.orchestrating_plan import OrchestratingPlan
    from journal.features.workers.states.soloing import Soloing
    from journal.models.open_task import OpenTask
    settings = lambda mode: SettingsValue({Workers.MODE.key: mode, TasksFeature.AUTO.key: True, TasksFeature.LOG_AGE_LIMIT.key: 10})
    tasks = TasksData(current_task=0, last_log_line="", suspended=(), suspension_summary="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", first_suspension_reason="", next_open=OpenTask(3, "the footer", "", 0), last_commands=(), open_ids=(3, 4), open_summary="task 3 (the footer), task 4 (the margin)")
    started = StartedPlan(plan_id=2, next_task=3, started_task=0, started_task_briefing="", tasks=(3, 4), remaining_tasks=2, checkpoint_pause=False, checkpoint_phase=0)
    of = lambda plan: FeatureData({"plans": PlansData((), plan), "tasks": tasks})
    from journal.engine.states_catalogue import StatesCatalogue
    from journal.engine.support.stack import Stack
    from journal.features.plans.states.plans_ready import PlansReady
    from journal.features.plans.states.plans_working import PlansWorking

    class ModeRegistry:
        def states(self):
            return [Ready, PlansReady, Orchestrating, Soloing]

        def modes(self):
            return [Workers.modes]

    catalogue = StatesCatalogue(ModeRegistry())
    assert isinstance(catalogue.apply_mode(Stack((PlansReady(),)), settings("orchestrator")).states[0], Orchestrating), "the work mode's state is the bottom of every stack"
    planned = Orchestrating().respond(SessionStarted(time=1.0).with_data(of(started)), settings("orchestrator"))
    assert isinstance(planned.pushed, OrchestratingPlan) and planned.pushed.plan_id == 2, "a started plan is pushed over the mode state as the orchestrator's plan state"
    assert type(catalogue.apply_mode(Stack((Orchestrating(),)), settings("builder")).states[0]) is PlansReady, "the builder's mode state is Idle with plans"
    stop = Orchestrating().respond(Stop().with_data(of(None)), settings("orchestrator"))
    assert stop.refusal is not None and "task 3 (the footer), task 4 (the margin)" in stop.refusal.rendered() and "dispatch a worker" in stop.refusal.rendered(), "the orchestrator's stop is held with the tasks to dispatch"
    assert "task 3" in PlansReady().respond(Stop().with_data(of(None)), settings("builder")).refusal.rendered() and "dispatch" not in PlansReady().respond(Stop().with_data(of(None)), settings("builder")).refusal.rendered(), "the builder's stop names the next task to do"
    assert isinstance(Orchestrating().respond(TaskStarted(environment_id=1, time=2.0, task_id=7, title="x", plan_id=0).with_data(of(None)), settings("orchestrator")).pushed, Delegating), "a task started in the orchestrator's mode is delegating, not working"
    delegating = Delegating(task_id=7, logged_at=1.0).respond(Stop(time=2.0).with_data(of(None)), settings("orchestrator"))
    assert delegating.refusal is not None and "hand it to a worker" in delegating.refusal.rendered(), "the delegating task says hand it over where working says carry on"
    assert isinstance(catalogue.apply_mode(Stack((PlansReady(), PlansWorking(task_id=1))), settings("solo")).states[0], Soloing), "a mode changed while work is in hand changes the bottom beneath it"
    assert Soloing().respond(ToolStarting(call=shell("journal worker dispatch 'Mr. Smith' 'the job' --profile journal-medior")).with_data(of(None)), settings("solo")).refusal == Workers.SOLO_DISPATCH.create(), "solo keeps workers out"
    assert Soloing().respond(ToolStarting(call=shell("ls")).with_data(of(None)), settings("solo")).refusal is None


def test_an_orchestrator_driven_through_a_plan_of_twenty_tasks_with_workers_never_stalls(app: App, monkeypatch):
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.repositories.setting_rows import SettingRows
    from journal.repositories.workers import Workers as WorkerRows
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: None)
    app.container.get(SettingRows).set("workers.mode", "orchestrator", Actor.user(1))
    hook(app, "SessionStart")
    console, agents, tasks = app.console(), app.container.get(Agents), app.container.get(Tasks)
    console.run(["environment", "overview"], AGENT)
    console.run(["plan", "create", "go live", "--brief", "twenty tasks"], USER)
    console.run(["plan", "phase", "1", "release", "--when", "all twenty done"], USER)
    for n in range(1, 21):
        console.run(["plan", "add", "1", f"piece {n}"], USER)
    console.run(["plan", "todos", "1", "1", *[str(n) for n in range(1, 21)]], USER)
    assert console.run(["plan", "ready", "1"], AGENT).code == 0 and console.run(["plan", "approve", "1"], USER).code == 0 and console.run(["plan", "start", "1"], AGENT).code == 0
    stack = lambda: [s["state"] for s in agents.session_agent("s1").stack]
    assert stack() == ["orchestrating", "orchestrating_plan"], "the orchestrator's mode state and its plan state, with task 1 in hand"
    stop = lambda: hook(app, "Stop")[1]
    first = stop()
    assert first.get("decision") == "block" and "hand it to a worker" in first["reason"] and "19 tasks are open" in first["reason"] and "dispatch a worker" in first["reason"], "a stop is refused with the task to hand over and the others to dispatch"
    for n, name in ((2, "Ada"), (3, "Florence"), (4, "Babbage")):
        assert console.run(["worker", "dispatch", name, f"do piece {n}", "--profile", "journal-medior", "--model", "sonnet", "--task", str(n)], AGENT).code == 0, "a worker is put on a task the plan holds while another is in hand"
    assert stack()[-1] == "awaiting" and stop().get("decision") != "block", "waiting on the workers, a stop is fine"
    workers = app.container.get(WorkerRows)
    for n in (1, 2, 3):
        app.container.get(WorkerRunner).run(workers.find(n), ["sh", "-c", "echo the piece is done"], Actor.agent("s1"))
    assert stack() == ["orchestrating", "orchestrating_plan"], "the last report pops the wait and the orchestrator is back on its plan"
    for n in (1, 2, 3):
        assert console.run(["worker", "complete", str(n)], AGENT).code == 0
    for n in (2, 3, 4):
        assert console.run(["task", "complete", str(n), "--how", "reviewed and merged"], AGENT).code == 0
    assert console.run(["task", "complete", "1", "--how", "done"], AGENT).code == 0
    app.runtime().deferred.drain()
    assert tasks.find(5).state == "started" and stack()[-1] == "orchestrating_plan", "the plan goes on to the next open piece"
    for n in range(5, 21):
        assert stop().get("decision") == "block", f"a stop with piece {n} in hand and pieces open is refused, never allowed"
        assert console.run(["task", "complete", str(n), "--how", "done"], AGENT).code == 0
        app.runtime().deferred.drain()
    assert app.container.get(Plans).find(1).state == "done" and stack() == ["orchestrating"], "the plan is done and the orchestrator is back in its mode state"
    assert stop().get("decision") != "block", "with nothing open the stop passes"


def test_a_stop_with_the_tasks_log_older_than_the_set_minutes_asks_for_the_log_line_first():
    from journal.events.agent.stop import Stop
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.tasks.support.tasks_data import TasksData
    data = FeatureData({"plans": PlansData((), None), "tasks": TasksData(current_task=7, last_log_line="", suspended=(), suspension_summary="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", first_suspension_reason="", next_open=None, last_commands=())})
    settings = lambda minutes: SettingsValue({TasksFeature.AUTO.key: True, TasksFeature.LOG_AGE_LIMIT.key: minutes, WorkersFeature.MODE.key: "builder"})
    working = Working(task_id=7, logged_at=0.0)
    assert working.respond(Stop(time=5 * 60.0).with_data(data), settings(10)).refusal.key == "tasks.carry_on", "within the minutes a stop is told to carry on"
    assert working.respond(Stop(time=11 * 60.0).with_data(data), settings(10)).refusal.key == "tasks.log_first_at_stop", "past them the log line comes first"
    assert working.respond(Stop(time=2 * 60.0).with_data(data), settings(1)).refusal.key == "tasks.log_first_at_stop", "the minutes are the user's to set"


def test_a_long_journal_line_reaches_the_agent_whole_in_several_marked_pieces(app: App, monkeypatch):
    from journal.supervisor_link import SupervisorLink
    transmitted = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: transmitted.append(fields["line"]))
    terms = " ".join(f"word{n}" for n in range(1, 260))
    app.container.get(SupervisorLink).type(1, terms)
    assert len(transmitted) >= 3 and all(len(segment) <= 600 and segment.startswith("[journal] ") for segment in transmitted), "typed in whole pieces a terminal takes, each the journal's"
    assert " ".join(segment.removeprefix("[journal] ") for segment in transmitted) == terms and "..." not in " ".join(transmitted), "nothing cut short"


def test_every_listener_of_a_state_or_a_conduct_is_named_on_and_its_event():
    import importlib
    import pkgutil
    import re
    import journal
    from typing import get_type_hints
    for module in pkgutil.walk_packages(journal.__path__, "journal."):
        importlib.import_module(module.name)
    snake = lambda name: re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()

    def lineage(cls: type) -> set[type]:
        return {cls, *(member for child in cls.__subclasses__() for member in lineage(child))}

    owners = lineage(Conduct) | lineage(BaseState)
    misnamed = [f"{owner.__name__}.{name}" for owner in owners for name, method in vars(owner).items()
                if name.startswith("on_") and callable(method) and "event" in get_type_hints(method) and name != f"on_{snake(get_type_hints(method)['event'].__name__)}"]
    assert misnamed == [], "a listener is on_ and its event's name in snake case"
