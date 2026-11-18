"""Phase five: the machine. A write in Idle is refused with how to declare work; after task start a stop says carry on, once; done makes the agent idle again; stuck pauses and a tool use lifts it; the state survives a new server."""

from worker_dispatch import started_run
from journal.repositories.workers import Workers
import re
import json
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen
from tests.suite_app import SuiteApp
from journal.support.timeout import Timeout
from journal.repositories.reports import Reports
from journal.events.rows.worker_mention import WorkerMention

import pytest

from journal.providers.claude import Claude
from journal.support.tool_call import ToolCall

shell = lambda line: Claude().call("Bash", {"command": line}, frozenset(), CLASSIFIER)

from journal.app import App
from journal.engine.support.session_agents import SessionAgents
from journal.config import Config
from journal.support.moment import Moment
from journal.support.caller import Caller
from journal.engine.hook_answer import HookAnswer
from journal.engine.state_machine import StateMachine
from journal.features.tasks.states.impasse import Impasse
from journal.features.tasks.states.ready import Ready
from journal.features.tasks.states.working import Working
from journal.features.tasks.support.tasks_data import TasksData
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
from journal.repositories.origin import Origin
from journal.events.models.created import Created
from journal.support.agent_role import AgentRole
from journal.support.listener_queue import ListenerQueue
from journal.support.message_thread import MessageThread
from journal.console.console import Console
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
from journal.features.messages.feature import Messages as MessagesFeature
from journal.features.briefing.feature import Briefing as BriefingFeature
from journal.features.workers.feature import Workers as WorkersFeature
from journal.engine.nudger import Nudger
from tests.shared_journal import SharedJournal
from journal.support.classification_table import ClassificationTable
from journal.support.command_classifier import CommandClassifier
from journal.support.table_schema import TableSchema
from journal.support.command_shape import CommandShape
from journal.engine.nudge_registry import NudgeRegistry
from journal.support.time_source import TimeSource
from journal.events.agent.session_started import SessionStarted
from tests.in_process import posted
from tests.old_columns import kind_columns
from tests.user_settings import user_set
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.stop import Stop
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
from journal.engine.support.typist import Typist
from journal.engine.states_catalogue import StatesCatalogue
from journal.engine.support.transition import Transition
from journal.features.shell.shell_nudges import ShellNudges
from journal.features.shell.shell_options import ShellOptions
from journal.features.tasks.tasks_options import TasksOptions
from journal.features.shell.shell_part import ShellPart
from journal.features.tasks.tasks_part import TasksPart
from journal.features.etiquette.etiquette_options import EtiquetteOptions
from journal.features.messages.messages_options import MessagesOptions
from journal.features.workers.workers_options import WorkersOptions
from journal.features.workers.workers_nudges import WorkersNudges
from journal.features.tasks.tasks_nudges import TasksNudges
from journal.features.triggers.triggers_nudges import TriggersNudges
from tests.nudge_lines import has_nudge, nudge_reached
from journal.features.messages.messages_nudges import MessagesNudges
from journal.features.secrets.secrets_nudges import SecretsNudges
from journal.features.skills.skills_nudges import SkillsNudges
from journal.features.memory.memory_nudges import MemoryNudges
from journal.features.plans.plans_nudges import PlansNudges
from journal.features.briefing.briefing_nudges import BriefingNudges
from journal.engine.engine_nudges import EngineNudges
from journal.models.worker import ENDED_UNFINISHED
from journal.features.questions.questions_nudges import QuestionsNudges

AGENT = Caller.agent("main", "s1", "claude")
USER = Caller.user("main")
# a line's own words past this many characters are a document, whatever longest it declares
RARE_CEILING_CHARACTERS = 400
# the shipped command table, read once for the tests that decode a tool call by hand
TABLE = ClassificationTable(Config.rooted(Path(__file__).parent), TableSchema())
SHAPES = CommandShape(TABLE)
CLASSIFIER = CommandClassifier(TABLE, SHAPES)

EVENT_AGENT = Agent(environment_id=1, session="s1", provider="claude")


@pytest.fixture(scope="module")
def boot():
    def booted(root: Path, patch: pytest.MonkeyPatch) -> App:
        app = SuiteApp(Config(root, port=0))
        app.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
        app.runtime().start()
        return app
    return booted


def hook(app, type_name: str, **body):
    return posted(app, "/hooks/claude", {"hook_event_name": type_name, "session_id": "s1", **body}, {"X-Journal-Env": "main"})


def batch_waited(app) -> None:
    """The batch time of a stopped agent's lines passes and the clock's next tick types what was held."""
    from journal.supervisor_link import SupervisorLink
    clock = app.container.get(TimeSource)
    clock.pin(clock.seconds() + 6)
    app.container.get(SupervisorLink).silence(1, 6)
    clock.unpin()


def write(app):
    return hook(app, "PreToolUse", tool_name="Write", tool_input={"file_path": "a.py"})








def test_the_state_is_in_the_database_so_a_new_server_finds_it(tmp_path):
    first = App(Config(tmp_path, port=0))
    first.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    first.runtime().start()
    hook(first, "SessionStart")
    with first.container.get(Scope).environment(1):
        first.container.get(SessionAgents).agent("s1", 1, "claude")
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
    from journal.support.fault_log import FaultLog
    runner = JobRunner(app.container.get(Clock), Bus(), app.container.get(FaultLog))
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











def test_a_typed_line_goes_out_on_one_line(app: App, monkeypatch):
    """One with breaks would arrive as pasted text that never matches it, and be typed again."""
    from journal.supervisor_link import SupervisorLink
    transmitted = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: transmitted.append(fields))
    app.container.get(SupervisorLink).type(1, "the command finished: cat <<EOF\nx\nEOF")
    batch_waited(app)
    assert transmitted[-1]["line"] == "[journal] the command finished: cat <<EOF x EOF"


LINE = Nudge("tests", "line", "a line")
OTHER = Nudge("tests", "other", "another line")
WHY = Nudge("tests", "why", "held here")


class ServerCatalogue:
    def states(self):
        return [Ready, Working]

    def modes(self):
        return []

    def floors(self):
        return {}

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
    assert stack.popped().serialized() == [{"state": "idle", "data": {"silenced_at": 0.0, "stop_round": 0}}]
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


def test_every_listener_whose_event_matches_runs_the_most_specific_first_and_the_engine_conduct_hears_compaction_and_the_end():
    from journal.engine.safety_conduct import SafetyConduct
    settings, state, safety = SettingsValue({}), Listening(), (SafetyConduct,)
    assert state.respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {}))), settings).nudges == (LINE, OTHER)
    assert state.respond(SessionEnded(agent=EVENT_AGENT), settings).nudges == (OTHER,)
    assert state.respond(Event(), settings) == state.none()
    assert state.respond(Compacting(agent=EVENT_AGENT), settings, safety).pushed == CompactingState()
    assert state.respond(SessionEnded(agent=EVENT_AGENT), settings, safety).pushed == Ended()
    assert Ended().respond(SessionEnded(agent=EVENT_AGENT), settings, safety).pushed is None, "a session already over is not ended again"
    assert [method.__name__ for _, method in Listening.listeners()] == ["on_tool_starting", "on_agent_event"]
    assert [method.__name__ for _, method in Listening.listeners(safety)][-5:] == ["on_compacting", "on_journal_returned", "on_session_ended", "on_session_retired", "on_stop"]


def test_settings_is_a_frozen_value_of_the_options_read_by_option():
    option = Option("tasks.log_after", "Log after", "", 50)
    assert SettingsValue.applied(Rows(), [option]).value(option) == 7


def test_every_shipped_option_is_declared_with_the_kind_of_its_default(app: App):
    kinds = {"number": (int, float), "switch": (bool,), "text": (str,), "choice": (str,), "lines": (list, tuple)}
    wrong = [option.key for option in app.container.get(Registry).options() if option.option_type in kinds and (not isinstance(option.default, kinds[option.option_type]) or option.option_type == "number" and isinstance(option.default, bool))]
    assert not wrong, f"declared with a kind their default is not, so journal settings set refuses a right value: {wrong}"


def test_every_agent_event_carries_the_time_it_was_placed_and_a_tick_carries_its_own():
    placed = ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {}))).placed(Agent(environment_id=1, session="s1", provider="claude"), None, 12.5)
    assert placed.time == 12.5 and placed.session == "s1"
    assert Ticked(agent=EVENT_AGENT, session="s1", environment_id=1, time=3.0, silence_seconds=0.0).time == 3.0


def test_a_renamed_state_answers_as_before_through_its_on_listeners_and_a_plain_method_is_none():
    settings = SettingsValue({})
    assert Ended().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {}))), settings).popped
    assert Ended().respond(SessionEnded(agent=EVENT_AGENT), settings) == Ended().none()
    names = [method.__name__ for _, method in Ended.listeners()]
    assert set(names) == {"on_session_started", "on_prompt_submitted", "on_tool_starting"}


def test_the_stack_is_seeded_from_the_state_and_its_pause_chain_unwound_with_idle_at_the_bottom(connection, bus, scope):
    agents = Agents(connection, bus, scope, TimeSource())
    stuck = agents.save(Agent(environment_id=1, session="s9", state="stuck", data={"resume": {"state": "working", "data": {"task_id": 3, "resume": {"state": "idle", "data": {}}}}}), Actor.system())
    missing = agents.save(Agent(environment_id=1, session="s8", state="gone", data={}), Actor.system())
    StackSeed().apply(connection)
    assert agents.find(stuck.id).stack == ({"state": "idle", "data": {}}, {"state": "working", "data": {"task_id": 3}}, {"state": "stuck", "data": {}})
    assert agents.find(missing.id).stack == ({"state": "idle", "data": {}}, {"state": "gone", "data": {}})




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

    def on_pause(self, settings):
        CALLS.append("pause catching")
        return ()

    def on_resume(self, data: FeatureData, settings):
        CALLS.append("resume catching")
        return self.pop()


def test_the_lifecycle_hooks_run_in_order_say_their_lines_refuse_a_push_and_catch_up_beneath_a_pop(app: App):
    CALLS.clear()
    hook(app, "SessionStart")
    machine, settings = app.container.get(StateMachine), SettingsValue({WorkersOptions.MODE.key: "builder"})
    data = Stack((Ready(), Catching()))
    pushed = machine.hook_machine(data, data.pushed(Noting()), settings, FeatureData({}))
    assert pushed.stack == data.pushed(Noting()) and pushed.nudges == (LINE.create(),) and pushed.refusal is None
    refused = machine.hook_machine(data, data.pushed(Refusing()), settings, FeatureData({}))
    assert refused.stack == data and refused.refusal == Block(WHY.create())
    popped = machine.hook_machine(data.pushed(Noting()), data, settings, FeatureData({}))
    assert popped.stack == Stack((Ready(),)) and popped.nudges == ()
    assert CALLS == ["pause catching", "push noting", "pause catching", "pop noting", "resume catching"]
    with pytest.raises(Rejection):
        machine.push("s1", 1, Refusing(), Actor.system(), "a refused push")
    assert [row["state"] for row in app.container.get(Agents).session_agent("s1").stack] == ["idle"]






def test_a_worker_sent_back_ended_or_stopped_is_told_to_its_dispatcher_in_one_short_line():
    from journal.features.workers.workers_conduct import WorkersConduct
    from pathlib import Path
    from journal.events.feature_data import FeatureData
    from journal.features.workers.support.workers_data import WorkersData
    from journal.events.rows.proof_short import ProofShort
    from journal.events.rows.worker_mention import WorkerMention
    from journal.events.rows.worker_stopped import WorkerStopped
    from journal.events.rows.worker_unfinished import WorkerUnfinished
    settings = SettingsValue({WorkersOptions.MODE.key: "builder"})
    workers = lambda *resumable: FeatureData({"workers": WorkersData(dispatched_workers=(), idle_workers=(), active_subagents=0, subagents=(), worktrees_root=Path("."), worktrees=(), resumable=resumable)})
    said = lambda event, *resumable: [n.rendered() for n in Ready().respond(event.with_data(workers(*resumable)), settings, (WorkersConduct,)).nudges]
    short = ProofShort(environment_id=1, time=1.0, task_id=5, worker_id=3, point=2, shortfall="the tests", dispatcher="s1")
    assert said(short.reaching("s1")) == ["worker 3 back on point 2"], "a worker sent back is told as one line with ids"
    assert said(short.reaching("s2")) == [], "to the agent that dispatched it alone"
    second = replace(short, prior_shortfalls=("the alias names are missing",))
    assert said(second.reaching("s1")) == ["worker 3 back on point 2 again; earlier: the alias names are missing"], "the second send-back of a task says so, with the first reason"
    third = replace(short, prior_shortfalls=("the alias names are missing", "the tests do not run"), model="sonnet")
    assert said(third.reaching("s1")) == [WorkersNudges.PROOF_REJECTED_OFTEN.create(n=3, point=2, times=3, model="sonnet", earlier="the alias names are missing; the tests do not run").rendered()], "the third names the model and tells the orchestrator to change the target, the worker or the model"
    fourth = replace(short, prior_shortfalls=("the alias names are missing", "the tests do not run", "the lexer"), model="sonnet")
    assert said(fourth.reaching("s1")) == ["worker 3 back on point 2 again; earlier: the alias names are missing; the tests do not run; the lexer"], "the change is told once: a fourth is told as a send-back again"
    worker = WorkerMention(3, "Lady Lovelace", "s1")
    ended = lambda times, limit=False: WorkerUnfinished(environment_id=1, time=1.0, worker=worker, ref="workers:3", outcome="worker 3, ended", times=times, is_run_limit=limit).reaching("s1")
    assert said(ended(1), 3) == [], "a run that ends without clocking out is not told the first time: the journal asks the worker itself"
    assert said(ended(2), 3) == [WorkersNudges.RUN_UNFINISHED.create(n=3, cause="").rendered()], "but the second time"
    assert said(ended(1)) == [WorkersNudges.RUN_UNFINISHED.create(n=3, cause="").rendered()], "or at once when there is no session or conversation to ask in"
    assert said(ended(2, True), 3) == [WorkersNudges.RUN_UNFINISHED.create(n=3, cause=": run limit").rendered()], "and it says when the run limit was the cause"
    stopped = lambda limit: WorkerStopped(environment_id=1, time=1.0, worker=worker, ref="workers:3", outcome="worker 3, stopped", is_run_limit=limit).reaching("s1")
    assert said(stopped(False)) == [WorkersNudges.WORKER_STOPPED_UNREPORTED.create(n=3, cause="").rendered()] and said(stopped(True)) == [WorkersNudges.WORKER_STOPPED_UNREPORTED.create(n=3, cause=": run limit").rendered()]


def test_a_run_that_ended_without_clocking_out_is_asked_by_the_journal_itself_to_clock_out_once():
    from journal.events.rows.worker_mention import WorkerMention
    from journal.events.rows.worker_unfinished import WorkerUnfinished
    from journal.features.workers.listeners.unfinished_clock_out import CLOCK_OUT_REQUEST, UnfinishedClockOut

    class Actions:
        def __init__(self) -> None:
            self.sent = []

        def send(self, n, brief, dispatcher, actor):
            self.sent.append((n, brief, actor))

    class Workers:
        def find(self, n):
            return n

    class Resumes:
        def is_resumable(self, worker):
            return worker == 3

    actions = Actions()
    ask = UnfinishedClockOut(actions, Workers(), Resumes())
    ended = lambda times, n=3: WorkerUnfinished(environment_id=1, time=1.0, worker=WorkerMention(n, "Lady Lovelace", "s1"), ref=f"workers:{n}", outcome="o", times=times)
    ask.handle(ended(1))
    ask.handle(ended(2))
    ask.handle(ended(1, 4))
    assert actions.sent == [(3, CLOCK_OUT_REQUEST, Actor.system())] and "journal clock-out" in CLOCK_OUT_REQUEST, "the journal asks the worker to clock out, in its own words, the first time only, and only a worker that can go on in its session"




def test_a_workers_stop_is_held_while_its_own_output_runs_and_told_its_end(app: App):
    from journal.engine.command_events import CommandEvents
    from journal.models.command_output import CommandOutput
    from journal.models.worker import Worker
    from journal.repositories.command_outputs import CommandOutputs
    from journal.repositories.workers import Workers
    from journal.support.agent_token import AgentToken
    hook(app, "SessionStart")
    from journal.models.support.ref import Ref
    from journal.models.task import Task
    from journal.repositories.tasks import Tasks
    scope = app.container.get(Scope)
    with scope.environment(1):
        worker = app.container.get(Workers).save(Worker(environment_id=1, name="Mr. Babbage", brief="b", session="w1", token_hash=AgentToken.hashed("tok")), Actor.system())
        tasks = app.container.get(Tasks)
        tasks.handover(tasks.save(Task(environment_id=1, title="the parser", brief="the parser reads"), Actor.system()), Ref.build(worker), Actor.system())
        app.container.get(Workers).save(app.container.get(Workers).find(worker.id).ready(1.0), Actor.worker(worker.id))
    def worker_stop() -> dict:
        data = json.dumps({"hook_event_name": "Stop", "session_id": "w1"}).encode()
        request = HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=data, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main", "X-Journal-Actor": f"worker:{worker.id}", "X-Journal-Actor-Token": "tok"})
        with urlopen(request, timeout=5) as reply:
            return json.loads(reply.read())
    first = worker_stop()
    assert first["decision"] == "block" and "you have not clocked out of task" in first["reason"], "a worker at work with nothing running is held until it clocks out"
    with scope.environment(1):
        outputs = app.container.get(CommandOutputs)
        output = outputs.save(CommandOutput(environment_id=1, command="pytest -q", session="w1", moved=True), Actor.worker(worker.id))
    held = worker_stop()
    assert held["decision"] == "block" and f"output {output.id} still runs" in held["reason"], "its stop is held while its own background output runs"
    with scope.environment(1):
        ended = outputs.save(output.with_(ended=True, status=0), Actor.system())
        app.container.get(CommandEvents).ended(ended, app.container.get(Agents).session_agent("w1"))
    told = worker_stop()
    assert told["decision"] == "block" and f"output {output.id} ended with code 0" in told["reason"], "the output's end comes back in the answer to its next stop"
    assert "you have not clocked out of task" in worker_stop()["reason"], "the output's end is told once; after it the stop waits for the clock-out"


def test_the_users_edits_and_closes_of_a_workers_task_reach_the_worker(app: App):
    from datetime import datetime, timezone
    from journal.http.controllers.tasks import TaskController
    from journal.models.agent import Agent
    from journal.support.agent_role import AgentRole
    from journal.models.proof import Proof
    from journal.models.support.ref import Ref
    from journal.models.task import Task
    from journal.models.worker import Worker
    from journal.models.worker_state import WorkerState
    from journal.repositories.proofs import Proofs
    from journal.repositories.tasks import Tasks
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    scope, workers, tasks, agents, proofs = app.container.get(Scope), app.container.get(Workers), app.container.get(Tasks), app.container.get(Agents), app.container.get(Proofs)
    def worker_on(title: str, session: str) -> tuple:
        with scope.environment(1):
            worker = workers.save(Worker(environment_id=1, name=f"worker on {title}", brief="b", session=session), Actor.system())
            task = tasks.save(Task(environment_id=1, title=title, brief="- reads the grammar\n- names each rule"), Actor.system())
            tasks.handover(task, Ref.build(worker), Actor.system())
            agents.save(Agent(environment_id=1, session=session, provider="claude", state="void", role=AgentRole.WORKER), Actor.system())
        app.console().run(["clock-in"], Caller.worker("main", worker.id, session, "claude"))
        return worker, task
    worker, task = worker_on("the parser", "w1")
    with scope.environment(1):
        for point in (1, 2):
            proofs.added(Proof(environment_id=1, point=point, text="shown"), task, Actor.worker(worker.id))
    assert app.console().run(["task", "brief", str(task.id), "- reads the grammar\n- names each rule and its alias"], USER).code == 0
    app.runtime().deferred.drain()
    with scope.environment(1):
        assert [(p.point, p.state) for p in proofs.task_proofs(tasks.find(task.id))] == [(1, "shown"), (2, "stale")], "a rewritten point's proof goes stale"
        assert nudge_reached(app, " ".join(agents.session_agent("w1").queued_lines), TasksNudges.TASK_POINTS_CHANGED, n=task.id, points=2), "and the worker is told which points changed"
    controller = app.container.get(TaskController)
    with scope.environment(1):
        tasks.save(tasks.find(task.id).cancelled(datetime.now(timezone.utc), "no longer wanted"), Actor.user(1))
    app.runtime().deferred.drain()
    assert app.container.get(SessionAgents).top("w1").name != "working" and nudge_reached(app, " ".join(agents.session_agent("w1").queued_lines), WorkersNudges.USER_CLOSURE, task=task.id), "the user's cancel ends the worker's work, and it is told"
    with scope.environment(1):
        assert workers.find(worker.id).state == WorkerState.RELEASED and tasks.holder(tasks.find(task.id)) is None, "and releases it"
    second, held = worker_on("the lexer", "w2")
    request = type("Posted", (), {"number": lambda self, key: held.id, "environment": "main", "actor": Actor.user(1), "body": {}})()
    with scope.environment(1):
        controller.start(request)
        assert tasks.holder(tasks.find(held.id)) == Ref.build(second), "the viewer's start of a held task leaves its holder"
        controller.finish(type("Posted", (), {"number": lambda self, key: held.id, "environment": "main", "actor": Actor.user(1), "body": {"how": "written by hand"}})())
    app.runtime().deferred.drain()
    with scope.environment(1):
        assert workers.find(second.id).state == WorkerState.RELEASED, "the user's finish releases the worker"


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
        app.container.get(ListenerQueue).drain()
        assert started.events == () and hearing.heard == [PlanStarted(environment_id=1, time=5.0, row_id=plan.id, actor="system", plan_id=plan.id, task_id=task.id)]
        plans.save(started.with_(title="renamed"), Actor.system())
        app.container.get(ListenerQueue).drain()
        assert len(hearing.heard) == 1


def test_a_plans_phase_in_hand_checkpoint_and_next_task_come_from_counts_and_one_link_a_phase_never_its_tasks_rows(app: App):
    from journal.db.connection import Connection
    from journal.models.link import Link
    from journal.models.phase import Phase
    from journal.models.support.ref import Ref
    from journal.repositories.links import Links
    from journal.repositories.load_tally import LoadTally
    from journal.repositories.phases import Phases
    from journal.repositories.plans import PHASE_LINK, PHASE_TASK_LINK
    from journal.repositories.tasks import PLAN_LINK
    plans, tasks, links, phases, actor = app.container.get(Plans), app.container.get(Tasks), app.container.get(Links), app.container.get(Phases), Actor.system()
    with app.container.get(Scope).environment(1):
        plan = plans.save(Plan(environment_id=1, title="p", state=PlanState.APPROVED), actor)
        first, second = [phases.save(Phase(environment_id=1, title=title, checkpoint=title == "one"), actor) for title in ("one", "two")]
        for phase in (first, second):
            links.save(Link(source=Ref.build(phase), target=Ref.build(plan), link_type=PHASE_TASK_LINK), actor)
        rows = [tasks.save(Task(environment_id=1, title=title), actor) for title in ("a", "b", "c", "loose")]
        for task in rows:
            links.save(Link(source=Ref.build(task), target=Ref.build(plan), link_type=PLAN_LINK), actor)
        for task, phase in ((rows[1], first), (rows[0], first), (rows[2], second)):
            links.save(Link(source=Ref.build(task), target=Ref.build(phase), link_type=PHASE_LINK), actor)
        app.container.get(ListenerQueue).drain()
        assert [phase.id for phase in plans.plan_phases(plan)] == [first.id, second.id], "in the order they were added"
        LoadTally.begin()
        states = plans.phase_states(plan)
        assert "tasks" not in {count.model for count in LoadTally.ended().counts}, "no task row is read"
        assert plans.phase_task_ids([first, second]) == {first.id: [rows[1].id, rows[0].id], second.id: [rows[2].id]}, "each phase's tasks in the order they joined it"
        assert plan.current_phase(states) == 1 and plan.checkpoint_phase(states) is None
        app.container.get(Connection).cache.cleared()
        LoadTally.begin()
        assert plans.next_task(plan).id == rows[1].id, "the first open task of the first phase, in the order it joined the phase"
        assert [count.rows for count in LoadTally.ended().counts if count.model == "tasks"] == [1], "only the task found is read"
        for task in rows[:2]:
            tasks.save(task.completed(datetime.now(timezone.utc), "done"), actor)
        states = plans.phase_states(plan)
        assert plan.current_phase(states) == 2 and plan.checkpoint_phase(states).number == 1, "phase one done and phase two not begun: the checkpoint"
        assert plans.next_task(plan).id == rows[2].id and plans.remaining_count(plan) == 2 and not plans.is_stalled(plan)
        tasks.save(tasks.find(rows[2].id).started(datetime.now(timezone.utc)).reopened(datetime.now(timezone.utc)), actor)
        assert plans.following_task(plan).id == rows[2].id and plans.next_task(plan).id == rows[2].id, "a task set aside is open again and first in its phase"
        tasks.save(tasks.find(rows[2].id).started(datetime.now(timezone.utc)), actor)
        assert plans.checkpoint_plans(plan) is None and plans.started_task(plan).id == rows[2].id, "phase two begun"




def test_the_models_carry_the_events_their_changes_mean():
    time = datetime(2026, 10, 20, 23, 0, tzinfo=timezone.utc)
    task = Task(id=7, environment_id=1, title="t", state=TaskState.STARTED)
    assert [type(e) for e in task.completed(time, "x").events] == [TaskClosed, RowResolved] and task.completed(time, "x").events[1].ref == "tasks:7"
    assert task.blocked("later", time).events[0] == TaskClosed(environment_id=1, time=time.timestamp(), task_id=7, outcome="blocked")
    assert Task(id=8, environment_id=1, title="u").started(time).events == (TaskStarted(environment_id=1, time=time.timestamp(), task_id=8, title="u", plan_id=0, prior_state=TaskState.OPEN),)
    assert TaskLog.build(task, "where it stands", 3.0).events == (TaskLogged(environment_id=1, time=3.0, task_id=7),)
    question = Question(id=4, environment_id=1, text="?")
    assert [type(e) for e in question.answered("yes", 2.0).events] == [QuestionAnswered, RowResolved] and question.posed(1.0).events[0].question_id == 4
    assert Worker(id=9, environment_id=1, name="w").reported(5.0, 4).events == (WorkerReported(environment_id=1, time=5.0, worker=WorkerMention(9, "w", None), report=4, ref="workers:9", outcome="worker 9, w, reported"),)




def test_a_line_that_declares_a_longest_above_the_normal_says_why_and_stays_near_its_length(app: App):
    from journal.engine.nudge import NORMAL_LONGEST_CHARACTERS, PLACEHOLDER
    numbers = {"n", "count", "task", "percent", "seconds", "ms", "times", "plan", "phase", "run", "worker", "point", "place", "open", "total", "megabytes", "budget", "grace", "dollars", "step", "minutes", "edits", "stale_after", "clashes", "lines", "cap"}
    typical = lambda found: "x" * int(found.group(2)) if found.group(2) else "9999" if found.group(1) in numbers else "x" * 16
    written = lambda found: "" if found.group(2) else typical(found)
    loose = []
    for nudge in app.container.get(NudgeRegistry).nudges.values():
        length = len(PLACEHOLDER.sub(typical, nudge.rendered()))
        if nudge.longest_characters > NORMAL_LONGEST_CHARACTERS and (not nudge.longest_reason or nudge.longest_characters > length + 20 or len(PLACEHOLDER.sub(written, nudge.rendered())) > RARE_CEILING_CHARACTERS):
            loose.append(f"{nudge.key}: declares {nudge.longest_characters} for a line of {length}, reason: {nudge.longest_reason or 'none'}")
    assert not loose, f"lines declaring a longest with no reason, far above their length, or with more than {RARE_CEILING_CHARACTERS} characters of their own words:\n" + "\n".join(sorted(loose))


def test_no_hook_or_agent_event_is_named_by_a_raw_string_outside_the_references():
    import ast
    from journal.events.agent.agent_event_type import AgentEventType
    from journal.support.hook_type import HookType
    names = {event.value for event in AgentEventType} | {hook.value for hook in HookType}
    source = Path(__file__).resolve().parents[1] / "src" / "journal"
    allowed = lambda path: path.name in ("references.py", "hook_type.py", "agent_event_type.py") or "events/agent/" in str(path) or "db/migrations/" in str(path)
    annotations = lambda tree: {id(part) for node in ast.walk(tree) for marked in (getattr(node, "returns", None), getattr(node, "annotation", None)) if marked is not None for part in ast.walk(marked)}
    raw = [f"{path.relative_to(source)}:{node.lineno} {node.value}" for path in source.rglob("*.py") if not allowed(path) for tree in [ast.parse(path.read_text())] for skipped in [annotations(tree)] for node in ast.walk(tree) if isinstance(node, ast.Constant) and node.value in names and id(node) not in skipped]
    assert not raw, "hooks and events named by a raw string; use hooks.<NAME> or events.<NAME> from journal.references:\n" + "\n".join(raw)


def test_no_refusal_written_inline_is_longer_than_a_normal_line():
    import ast
    source = Path(__file__).resolve().parents[1] / "src" / "journal"
    measured = lambda text: len(text.value) if isinstance(text, ast.Constant) else sum(len(part.value) if isinstance(part, ast.Constant) else 16 for part in text.values)
    refusals = [(path, node) for path in source.rglob("*.py") for node in ast.walk(ast.parse(path.read_text())) if isinstance(node, ast.Call) and getattr(node.func, "id", "") == "Rejection" and node.args and isinstance(node.args[0], (ast.Constant, ast.JoinedStr))]
    long = [f"{path.relative_to(source)}:{node.lineno} ({measured(node.args[0])})" for path, node in refusals if measured(node.args[0]) > 120]
    assert not long, "refusals written inline that pass 120 characters, each value counted as 16; shorten them or register them as lines:\n" + "\n".join(long)


def test_the_nudge_registry_hands_back_an_id_lists_every_nudge_and_the_nudger_refuses_one_it_does_not_hold(app: App):
    registry, owned = app.container.get(NudgeRegistry), Nudge("engine", "test_line", "a line of the test")
    assert registry.register(LINE) == "tests.line" and registry.lookup("tests.line") is LINE and registry.register(owned) == "engine.test_line"
    assert all(nudge.key in registry.nudges for feature in app.container.get(Registry).features for nudge in feature.nudges)
    listed = app.console().run(["nudge", "list"], AGENT).text
    assert "tests.line  [tests]  a line" in listed and "tasks.carry_on  [tasks]" in listed and listed.strip().endswith("nudges")
    hook(app, "SessionStart")
    agent = app.container.get(Agents).session_agent("s1")
    with pytest.raises(Rejection):
        app.container.get(Nudger).deliver(agent, OTHER.create())
    assert app.container.get(Nudger).deliver(agent, owned.create()) == "a line of the test"


def test_a_line_longer_than_its_longest_is_cut_when_sent_and_the_cut_recorded(journal: SharedJournal):
    app = journal.app
    registry, wide = app.container.get(NudgeRegistry), Nudge("engine", "test_wide_line", "the files: {{files}}")
    registry.register(wide)
    hook(app, "SessionStart")
    agent = app.container.get(Agents).session_agent("s1")
    sent = app.container.get(Nudger).answer(agent, wide.create(files="a.py " * 40))
    assert len(sent) == 120 and "…" in sent and sent.endswith(("a.py " * 40)[-60:]), "cut in its middle to the 120 characters a line may have, its end kept"
    with app.container.get(Scope).environment(1):
        assert [(entry.data["key"], entry.data["cut_from"]) for entry in app.container.get(Entries).cut_lines()] == [("engine.test_wide_line", 211)], "the cut is recorded with the length it was cut from, which fails the test that sent it"
    repeated = Nudge("engine", "test_repeated_wide_line", "the files: {{files}}")
    registry.register(repeated)
    nudger = app.container.get(Nudger)
    assert nudger.deliver(agent, repeated.create(files="b.py " * 40)) and nudger.deliver(agent, repeated.create(files="b.py " * 40)) is None, "a cut line sent again within its repeat span is dropped like any other"
    capped = Nudge("engine", "test_capped_line", "the files: {{files|cap=20}}")
    registry.register(capped)
    assert app.container.get(Nudger).answer(agent, capped.create(files="a.py " * 40)) == "the files: " + ("a.py " * 4)[:19] + "…", "a value written with a cap is cut to it, so the line stays whole"
    lines, tool_use = ["one", "two", "three", "four"], ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Read", input={}, operation=Claude().operation("Read", {})))
    assert StateMachine.answer_lines(lines, tool_use) == ["one", "two", "three"] and StateMachine.overflow_lines(lines, tool_use) == ["four"], "a tool use's answer takes three lines and queues the rest for the next hook"
    journal.reset()


@pytest.mark.parametrize(("template", "values", "longest", "expected"), [
    ("the files: {{files}}", {"files": "a" * 109}, 120, "the files: " + "a" * 109),
    ("the files: {{files}}", {"files": "a" * 110}, 120, "the files: " + "a" * 48 + "…" + "a" * 60),
    ("{{command}} share a title: give each a label", {"command": "ssh " + "x" * 300}, 120, ("ssh " + "x" * 300)[:59] + "…" + ("x" * 300 + " share a title: give each a label")[-60:]),
    ("run `{{command|cap=20}}` again", {"command": "y" * 50}, 120, "run `" + "y" * 19 + "…` again"),
    ("run `{{command|cap=20}}` again", {"command": "short"}, 120, "run `short` again"),
    ("the voice: {{voice}}", {"voice": "v" * 300}, 400, "the voice: " + "v" * 300),
    ("the voice: {{voice}}", {"voice": "v" * 500}, 400, "the voice: " + "v" * 328 + "…" + "v" * 60),
    ("a line with no values at all", {}, 120, "a line with no values at all"),
    ("the name: {{name}}", {"name": "é" * 130}, 120, "the name: " + "é" * 49 + "…" + "é" * 60),
    ("the name: {{name}}", {"name": ""}, 120, "the name: "),
    ("{{first}} and {{second}}: keep this end", {"first": "f" * 80, "second": "s" * 80}, 120, ("f" * 80 + " and " + "s" * 80 + ": keep this end")[:59] + "…" + ("s" * 80 + ": keep this end")[-60:]),
])
def test_a_long_line_is_cut_in_its_middle_so_its_end_stays_and_a_capped_value_never_crowds_it(journal: SharedJournal, template, values, longest, expected):
    app = journal.app
    nudge = Nudge("engine", "test_edge_line", template, longest_characters=longest, longest_reason="a test of the cut" if longest > 120 else "")
    app.container.get(NudgeRegistry).register(nudge)
    hook(app, "SessionStart")
    sent = app.container.get(Nudger).answer(app.container.get(Agents).session_agent("s1"), nudge.create(**values))
    assert sent == expected and len(sent) <= longest, (len(sent), sent)
    with app.container.get(Scope).environment(1):
        cut = [entry.data["cut_from"] for entry in app.container.get(Entries).cut_lines()]
    assert cut == ([len(nudge.create(**values).rendered())] if len(nudge.create(**values).rendered()) > longest else []), "a cut is recorded with the length it was cut from, and only a cut"
    journal.reset()


def test_a_cut_line_repeats_on_its_own_schedule_never_at_every_tool_use(journal: SharedJournal):
    app = journal.app
    nudge = Nudge("engine", "test_repeated_edge_line", "{{command}} share a title: give each a label", repeat=Timeout.seconds(60))
    app.container.get(NudgeRegistry).register(nudge)
    with app.container.get(Scope).environment(1):
        agent = app.container.get(Agents).save(Agent(environment_id=1, session="s1", provider="claude"), Actor.system())
    nudger, clock = app.container.get(Nudger), app.container.get(TimeSource)
    line = nudge.create(command="gh run watch " + "z" * 300)
    start = clock.seconds()
    clock.pin(start)
    first, again = nudger.deliver(agent, line), nudger.deliver(agent, line)
    clock.pin(start + 61)
    later = nudger.deliver(agent, line)
    clock.unpin()
    assert first and first.endswith("share a title: give each a label") and again is None and later == first, "sent, dropped within its minute, sent again after it, the instruction kept each time"
    journal.reset()


def test_the_engines_own_states_wait_compacting_and_ended_answer_hand_built_events():
    settings, owned = SettingsValue({}), ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {})))
    assert Wait().respond(PromptSubmitted(agent=EVENT_AGENT, prompt="go on"), settings).popped
    assert not Wait().respond(PromptSubmitted(agent=EVENT_AGENT, prompt="[journal] a line"), settings).popped
    assert Wait().respond(owned, settings).popped
    assert Wait().wait_description() == ("", "")
    assert all(CompactingState().respond(event, settings).handed_down for event in (owned, PromptSubmitted(agent=EVENT_AGENT, prompt="go on"), Stop(agent=EVENT_AGENT), SessionStarted(agent=EVENT_AGENT))), "any sign of the agent ends a compaction, so a cancelled one never holds it"
    assert all(Ended().respond(event, settings).popped for event in (SessionStarted(agent=EVENT_AGENT), PromptSubmitted(agent=EVENT_AGENT, prompt="hi"), owned))


def test_a_nudge_is_one_class_whose_create_fills_its_blanks_and_rendered_says_the_line():
    nudge = Nudge("tests", "two_blanks", "{{n}} of {{what}}", "read {{what}}")
    assert nudge.create(n=3, what="them").rendered() == "3 of them. read them"
    assert nudge.create(n=3, what="them").key == "tests.two_blanks" and nudge.create().rendered() == "{{n}} of {{what}}. read {{what}}"




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
    settings, event = SettingsValue({}), ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {})))
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
    from journal.features.plans.plans_options import PlansOptions
    settings = SettingsValue({WorkersOptions.MODE.key: "builder", PlansOptions.TEST_COMMANDS.key: "pytest"})
    from journal.features.plans.support.started_plan import StartedPlan
    plans = PlansData(approved=(), started=StartedPlan(plan_id=5, next_task=0, started_task=7, started_task_briefing="it has no brief and nothing logged yet", recent_tasks=(7, 8), remaining_tasks=2, checkpoint_pause=False, checkpoint_phase=0, testing=""))
    tasks = TasksData(current_task=7, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=(), agent_tasks=(7, 8))
    data = FeatureData({"plans": plans, "tasks": tasks})
    assert PlansReady().respond(SessionStarted(agent=EVENT_AGENT, time=4.0).with_data(data), settings).pushed == FollowingPlan(plan_id=5, task_id=7, approved=True, logged_at=4.0)
    assert PlansReady().respond(SessionStarted(agent=EVENT_AGENT).with_data(FeatureData({"plans": PlansData((), None), "tasks": tasks})), settings).pushed is None
    started = TaskStarted(environment_id=1, time=1.0, task_id=7, title="t", plan_id=0).with_data(data)
    assert PlansWorking(task_id=7, logged_at=2.0).respond(started, settings).target == FollowingPlan(plan_id=5, task_id=7, approved=True, logged_at=2.0)
    assert FollowingPlan(plan_id=5, task_id=7).respond(started, settings).target == FollowingPlan(plan_id=5, task_id=7, logged_at=1.0)
    from journal.events.rows.task_closed import TaskClosed
    from journal.features.tasks.states.working import Working
    taken = TasksData(current_task=8, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=(), agent_tasks=(7, 8))
    closed = TaskClosed(environment_id=1, time=3.0, task_id=7, outcome="completed").with_data(FeatureData({"plans": plans, "tasks": taken}))
    assert FollowingPlan(plan_id=5, task_id=7, approved=True).respond(closed, settings).target.task_id == 8, "a next task started before the close reached the state stays the task in hand"
    assert "not logged since it was taken up" in Working(task_id=8).logged_words(100.0), "a state that never saw a log time never says the epoch"
    approved = PlansReady().respond(PlanApproved(environment_id=1, time=1.0, plan_id=5, user_origin=True).with_data(data), settings, (PlansConduct,))
    assert [nudge.key for nudge in approved.nudges] == ["plans.the_user_approved_the_plan"]
    agent_index = PlansReady().respond(PlanApproved(environment_id=1, time=1.0, plan_id=5, user_origin=False).with_data(data), settings, (PlansConduct,))
    assert agent_index.nudges == ()
    in_hand = FeatureData({"plans": replace(plans, started=replace(plans.started, started_task=8)), "tasks": tasks})
    next_task = PlansReady().respond(TaskStarted(environment_id=1, time=1.0, task_id=8, title="the next", plan_id=5).with_data(in_hand), settings, (PlansConduct,))
    assert next_task.nudges[0].rendered() == "plan 5: task 8 is next. it has no brief and nothing logged yet"


def test_the_conduct_of_voices_etiquette_pins_and_migration_speak_from_the_data():
    from journal.features.voices.voices_options import VoicesOptions
    from journal.features.voices.voices_conduct import VoicesConduct
    from journal.features.voices.support.voices_data import VoicesData
    from journal.features.etiquette.etiquette_conduct import EtiquetteConduct
    from journal.features.etiquette.support.etiquette_data import EtiquetteData
    from journal.features.pins.pins_conduct import PinsConduct
    from journal.features.pins.support.pins_data import PinsData
    from journal.features.migration.migration_conduct import MigrationConduct
    from journal.features.migration.support.migration_data import MigrationData
    from journal.events.agent.tool_finished import ToolFinished
    from journal.events.agent.turn_displayed import TurnDisplayed
    from journal.events.rows.setting_changed import SettingChanged
    settings = SettingsValue({WorkersOptions.MODE.key: "builder", EtiquetteOptions.REMINDER_INTERVAL.key: 50})
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.tasks.support.tasks_data import TasksData
    data = FeatureData({"plans": PlansData((), None), "tasks": TasksData(current_task=0, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=()), "voices": VoicesData(instruction="as a butler"), "etiquette": EtiquetteData(reminder_gap=50, code_edits=0), "pins": PinsData(pinned=("https://a.test/pinned",), recent_suggestions=("https://a.test/said",), newest_pin_at=0.0), "migration": MigrationData(version_3_waiting=True)})
    started = Ready().respond(SessionStarted(agent=EVENT_AGENT).with_data(data), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct))
    assert [nudge.key for nudge in started.nudges] == ["voices.how_to_talk_to_the_user", "migration.version_3_not_brought_across"]
    assert "as a butler" in started.nudges[0].rendered()
    assert [n.key for n in Ready().respond(SessionStarted(agent=EVENT_AGENT, source="resume").with_data(data), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct)).terminal_lines] == ["voices.say_you_are_back"]
    changed = Ready().respond(SettingChanged(environment_id=1, time=1.0, setting=VoicesOptions.VOICE_OPTIONS[0].key).with_data(data), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct))
    assert [n.key for n in changed.nudges] == ["voices.the_voice_changed"]
    assert Ready().respond(SettingChanged(environment_id=1, time=1.0, setting="shell.short_output").with_data(data), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct)).nudges == ()
    turn = Ready().respond(TurnDisplayed(agent=EVENT_AGENT, text="the user should run journal task complete 3, see https://a.test/new and https://a.test/said").with_data(data), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct))
    assert [n.key for n in turn.nudges] == ["etiquette.no_shop_talk", "etiquette.say_you_not_the_user", "pins.pin_the_link"]
    assert "https://a.test/new" in turn.nudges[2].rendered()
    assert Ready().respond(TurnDisplayed(agent=EVENT_AGENT, text="see https://a.test/pinned", final=False).with_data(data), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct)).nudges == ()
    finished = Ready().respond(ToolFinished(agent=EVENT_AGENT, call=ToolCall(tool="Bash", input={}, operation=Claude().operation("Bash", {})), output="opened https://a.test/pr/1").with_data(data), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct))
    assert [n.key for n in finished.nudges] == ["etiquette.a_line_is_an_instruction", "pins.pin_the_link"]
    silent = FeatureData({**data.parts, "etiquette": EtiquetteData(reminder_gap=3, code_edits=0)})
    assert Ready().respond(ToolFinished(agent=EVENT_AGENT, call=ToolCall(tool="Bash", input={}, operation=Claude().operation("Bash", {})), output="nothing").with_data(silent), settings, (VoicesConduct, EtiquetteConduct, PinsConduct, MigrationConduct)).nudges == ()


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
    settings = SettingsValue({"checks.repeat_minutes": 60})
    triggers = (Trigger(id=1, phrases=("deploy",), action=TriggerAction.DENY, text="no deploys tonight"), Trigger(id=2, phrases=("release",), action=TriggerAction.INSTRUCT, text="bump the version"))
    plugin_file = str(Path(".journal", "plugins", "x", "run.sh"))
    data = FeatureData({"plans": PlansData((), None), "tasks": TasksData(current_task=0, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=()), "triggers": TriggersData(triggers=triggers), "plugins": PluginsData(root=Path("/p"), plugins_folder=Path("/p", ".journal", "plugins"))})
    assert Ready().respond(CommitDetected(agent=EVENT_AGENT, sha="abcdef0123").with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct)).nudges == ()
    closed = Ready().respond(CommitDetected(agent=EVENT_AGENT, sha="abcdef0123", closed=(4, 5), next_task=OpenTask(6, "the next", "", 0)).with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct))
    assert [n.rendered() for n in closed.nudges] == ["commit abcdef01 closed task 4, task 5", TasksNudges.NEXT_TASK_STARTED.create(n=6).rendered()]
    failed = Ready().respond(CheckCompleted(environment_id=0, time=1.0, check_id=2, title="lint", passed=False, fault="", output="a\nb c", prior_failure=False, prior_fault=False, wait_target=False, failure_reported_at=0.0).with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct))
    assert [n.key for n in failed.nudges] == ["checks.check_failed"] and "b c" in failed.nudges[0].rendered()
    assert Ready().respond(CheckCompleted(environment_id=0, time=1.0, check_id=2, title="lint", passed=False, fault="", output="", prior_failure=True, prior_fault=False, wait_target=False, failure_reported_at=0.0).with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct)).nudges == ()
    repeat = Ready().respond(CheckCompleted(environment_id=0, time=3601.0, check_id=2, title="lint", passed=False, fault="", output="", prior_failure=True, prior_fault=False, wait_target=False, failure_reported_at=1.0).with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct))
    assert [n.key for n in repeat.nudges] == ["checks.check_still_failing"]
    assert Ready().respond(CheckCompleted(environment_id=0, time=1.0, check_id=2, title="lint", passed=False, fault="", output="", prior_failure=True, prior_fault=False, wait_target=True, failure_reported_at=0.0).with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct)).nudges == ()
    prompt = Ready().respond(PromptSubmitted(agent=EVENT_AGENT, prompt="release it and plan the rest").with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct))
    assert [n.rendered() for n in prompt.nudges] == ["do this now: bump the version"]
    arrived = Ready().respond(MessageArrived(environment_id=1, time=1.0, text="deploy now").with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct))
    assert [n.rendered() for n in arrived.nudges] == ["no deploys tonight"]
    denied = Ready().respond(ToolStarting(agent=EVENT_AGENT, call=shell("deploy prod")).with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct))
    assert denied.refusal is not None and denied.refusal.rendered() == TriggersNudges.DENIED.create(title="no deploys tonight").rendered()
    withheld = Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Edit", input={"file_path": plugin_file}, operation=Claude().operation("Edit", {"file_path": plugin_file}), writes=True, edited_paths=(plugin_file,))).with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct))
    assert withheld.refusal is not None and withheld.refusal.key == "plugins.plugin_files_are_the_users"
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Edit", input={"file_path": "src/a.py"}, operation=Claude().operation("Edit", {"file_path": "src/a.py"}), writes=True, edited_paths=("src/a.py",))).with_data(data), settings, (GitConduct, ChecksConduct, TriggersConduct, PluginsConduct)).refusal is None


def test_the_conduct_of_messages_laws_shell_secrets_questions_profiles_and_workers_speak_and_hold_from_the_data(tmp_path):
    from pathlib import Path
    from journal.features.messages.feature import Messages as MessagesFeature
    from journal.features.messages.messages_conduct import MessagesConduct
    from journal.features.messages.support.messages_data import MessagesData
    from journal.features.laws.laws_conduct import LawsConduct
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
    from journal.events.agent.session_started import SessionStarted
    from journal.events.rows.secret_allowed import SecretAllowed
    from journal.events.rows.worker_reported import WorkerReported
    settings = SettingsValue({MessagesOptions.TOOL_BLOCK_LIMIT.key: 10, MessagesOptions.ANSWER_REQUEST_LIMIT.key: 3, MessagesOptions.EDIT_BLOCK_LIMIT.key: 5, ShellOptions.SHOWN.key: 100, WorkersOptions.SUBAGENT_LIMIT.key: 2, WorkersOptions.MODE.key: "builder", WorkersOptions.BUILDER_SUBAGENTS_ALLOWED.key: True, WorkersOptions.BUILDER_DISPATCH_ALLOWED.key: True, WorkersOptions.BUILDER_QUEUE_ALLOWED.key: True, "workers.fitness_warnings": True, "tasks.auto": False, "reviewing.reviewer": False, ShellOptions.READER_SUGGESTIONS.key: 3, ShellOptions.READER_SUGGESTION_RUNS.key: 50})
    private = tmp_path / "private"
    parts = {
        "plans": PlansData((), None), "tasks": TasksData(current_task=0, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=()),
        "messages": MessagesData(unread=(7, 8), unanswered=(5,), unanswered_files=(f"{tmp_path}/files/message/5/",), peer_questions=()),
        "profiles": ProfilesData(names=("journal-researcher", "journal-medior"), subagents=("journal-researcher",), workers=("journal-medior",)),
        "shell": ShellData(background=(12,), backgrounded_at=100.0, unannounced=(EndedOutput(3, "finished"), EndedOutput(4, "failed with code 1")), output_reads=("journal output read <output> --grep x", "journal output read <output> --grep x"), readers=(Reader("tests", "the failures", "FAILED"),), tipped=(), watch=OutputView.empty(), aliases=(), unread=(), tool_uses=0, last_ending_line=Moment(), home="/project"),
        "secrets": SecretsData(root=tmp_path, folders=(private.resolve(),), spellings=(str(private),)),
        "workers": WorkersData(dispatched_workers=(), idle_workers=(Worker(id=2, name="Lady Lovelace", state=WorkerState.REPORTED),), active_subagents=2, subagents=(Subagent(id=1, dispatch="sub:1", started_at=1.0, task="read the plan", brief="look at src/a.py", agent_type="journal-researcher", model="sonnet", session="sub-1", state=SubagentState.FINISHED),), worktrees_root=tmp_path / "worktrees", worktrees=(WorkerWorktree("3-Lady-Lovelace", 3, "Lady Lovelace"),)),
    }
    data = FeatureData(parts)
    prompt = Ready().respond(PromptSubmitted(agent=EVENT_AGENT, prompt="go on").with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert [n.rendered() for n in prompt.nudges] == ["new messages 7, 8"]
    stop = Ready().respond(Stop(agent=EVENT_AGENT).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert [n.key for n in stop.nudges] == ["messages.new_messages_to_answer", "workers.act_on_the_reports"]
    piped = Ready().respond(ToolStarting(agent=EVENT_AGENT, call=shell("journal message read 7 | head -3")).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert piped.refusal is not None and piped.refusal.key == "messages.read_the_words_whole"
    from journal.engine.demand_conduct import DemandConduct
    from journal.engine.demand_progress import DemandProgress
    from journal.features.messages.messages_demands import MessagesDemands
    owing = lambda used_reply, used_read, messages: FeatureData({**parts, "messages": messages, "demands": (
        DemandProgress(MessagesDemands.REPLY, MessagesDemands.REPLY.requirement(FeatureData({"messages": messages})), Moment(tool_uses=0), Moment(tool_uses=used_reply)),
        DemandProgress(MessagesDemands.READ, MessagesDemands.READ.requirement(FeatureData({"messages": messages})), Moment(tool_uses=0), Moment(tool_uses=used_read)))})
    conducts = (DemandConduct, MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)
    read = Ready().respond(ToolStarting(agent=EVENT_AGENT, call=shell("ls"), tool_use=3).with_data(owing(4, 3, parts["messages"])), settings, conducts)
    assert read.refusal is None and [n.key for n in read.nudges] == ["messages.tools_held_soon_until_answered", "messages.writes_held_soon_until_read"], "asked for the answer after three uses, and both count down to their holds once named"
    their_file = Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Read", input={"file_path": f"{tmp_path}/files/message/5/a.png"}, operation=Claude().operation("Read", {"file_path": f"{tmp_path}/files/message/5/a.png"}), read_paths=(f"{tmp_path}/files/message/5/a.png",))).with_data(owing(4, 3, parts["messages"])), settings, conducts)
    assert "messages.tools_held_soon_until_answered" not in [n.key for n in their_file.nudges], "a read of the message's own files passes in silence"
    held_unanswered = owing(11, 0, MessagesData(unread=(), unanswered=(5,), unanswered_files=(), peer_questions=()))
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=shell("ls")).with_data(held_unanswered), settings, conducts).refusal.key == "messages.tools_held_until_answered"
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=shell("journal task list")).with_data(held_unanswered), settings, conducts).refusal is None
    held_unread = owing(0, 6, MessagesData(unread=(7,), unanswered=(), unanswered_files=(), peer_questions=()))
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Edit", input={"file_path": "a.py"}, operation=Claude().operation("Edit", {"file_path": "a.py"}), writes=True)).with_data(held_unread), settings, conducts).refusal.key == "messages.write_held_until_read"
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Read", input={"file_path": "a.py"}, operation=Claude().operation("Read", {"file_path": "a.py"}))).with_data(held_unread), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal is None
    face = Ready().respond(ReactionAdded(environment_id=1, time=1.0, emoji="👍", message_id=7, user_origin=True).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert [n.rendered() for n in face.nudges][0].startswith("the user put 👍 on message 7")
    assert Ready().respond(ReactionAdded(environment_id=1, time=1.0, emoji="👍", message_id=7, user_origin=False).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).nudges == ()
    dispatch = lambda **value: Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Agent", input=value, operation=Claude().operation("Agent", value))).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert dispatch(subagent_type="journal-researcher", description="d", prompt="p").refusal.key == "laws.name_the_model"
    assert dispatch(model="sonnet", subagent_type="general-purpose", description="d", prompt="p").refusal.key == "laws.name_a_profile"
    assert dispatch(model="sonnet", subagent_type="journal-researcher", description="d").refusal.key == "laws.bind_the_job"
    assert dispatch(model="sonnet", subagent_type="journal-medior", description="d", prompt="p").refusal.key == "profiles.worker_profile_is_not_a_subagent"
    assert dispatch(model="sonnet", subagent_type="journal-researcher", description="d", prompt="p").refusal.key == "workers.too_many_subagents"
    fewer = FeatureData({**parts, "workers": WorkersData(**{**parts["workers"].__dict__, "active_subagents": 1})})
    existing = Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Agent", input={"model": "sonnet", "subagent_type": "journal-researcher", "description": "d", "prompt": "read src/a.py again"}, operation=Claude().operation("Agent", {"model": "sonnet", "subagent_type": "journal-researcher", "description": "d", "prompt": "read src/a.py again"}))).with_data(fewer), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert existing.refusal.key == "workers.send_the_job_to_the_subagent" and "sub-1" in existing.refusal.rendered()
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Agent", input={"model": "sonnet", "subagent_type": "journal-researcher", "description": "d", "prompt": "read src/b.py"}, operation=Claude().operation("Agent", {"model": "sonnet", "subagent_type": "journal-researcher", "description": "d", "prompt": "read src/b.py"}))).with_data(fewer), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal is None
    big = Ready().respond(ToolFinished(agent=EVENT_AGENT, call=shell("ls"), output="\n" * 400).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert [n.key for n in big.nudges] == ["laws.cap_the_output"]
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Read", input={"file_path": "a.py"}, operation=Claude().operation("Read", {"file_path": "a.py"}), file_lines=201)).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal.key == "shell.read_the_file_in_parts"
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=shell("journal task list && ls")).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal.key == "shell.journal_command_runs_alone"
    chained = Ready().respond(ToolStarting(agent=EVENT_AGENT, call=shell("cd /project && journal output read 9 --summary; journal output status 9")).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert chained.refusal is None or chained.refusal.key != "shell.journal_command_runs_alone", "journal commands chain with each other, a folder change before them counting as no command"
    reader = Ready().respond(ToolStarting(agent=EVENT_AGENT, call=shell("journal output read 9 --grep FAILED")).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    shell_lines = lambda answered: [n.key for n in answered.nudges if n.key.startswith("shell.")]
    assert shell_lines(reader) == ["shell.use_the_reader"]
    repeat = Ready().respond(ToolStarting(agent=EVENT_AGENT, call=shell("journal output read 9 --grep x")).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert "shell.draft_a_reader" not in shell_lines(repeat), "a reader is offered at a run's end, never on a read by hand"
    from journal.events.agent.command_ended import CommandEnded
    tick = Ready().respond(Ticked(agent=EVENT_AGENT, silence_seconds=6.0, time=500.0).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    by_key = {n.key: n.rendered() for n in tick.nudges}
    assert by_key["shell.check_the_background"].startswith("output 12 still running") and sorted(by_key) == ["shell.check_the_background", "workers.act_on_the_reports"], "a tick no longer works out which runs ended"
    ended_line = lambda output, shell_data: {n.key: n.rendered() for n in Ready().respond(CommandEnded(agent=EVENT_AGENT, output=output, status=1).with_data(shell_data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).nudges}
    assert ended_line(4, data)["shell.outputs_ended"] == "output 4: failed", "a run's end is named from its own event, once, as it ends"
    assert ended_line(77, data) == {}, "an end already reported, such as one a wait took, is named by nothing"
    from journal.features.shell.support.reader_draft import ReaderDraft
    offered = FeatureData({**parts, "shell": ShellData(**{**parts["shell"].__dict__, "reader_drafts": (ReaderDraft(4, "make all", "journal reader add make-all-output --commands \"make all\""), ReaderDraft(99, "pytest", "journal reader add x"))})})
    ended = ended_line(4, offered)
    assert "no reader reads make all yet" in ended["shell.draft_a_reader"] and "pytest" not in ended["shell.draft_a_reader"], "at the run's end, beside the line naming it, one reader is offered for it"
    drafted = lambda drafts, count, values: "shell.draft_a_reader" in [n.key for n in Ready().respond(CommandEnded(agent=EVENT_AGENT, output=4, status=1).with_data(FeatureData({**parts, "shell": ShellData(**{**parts["shell"].__dict__, "reader_drafts": drafts, "draft_count": count})})), SettingsValue({ShellOptions.READER_SUGGESTIONS.key: 3, ShellOptions.READER_SUGGESTION_RUNS.key: 50, **values}), (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).nudges]
    fresh, repeated = (ReaderDraft(4, "make all", "x"),), lambda runs: (ReaderDraft(4, "make all", "x", suggested=True, later_runs=runs),)
    assert drafted(fresh, 2, {ShellOptions.READER_SUGGESTIONS.key: 3}) and not drafted(fresh, 3, {ShellOptions.READER_SUGGESTIONS.key: 3}), "a session gets as many suggestions as the setting allows"
    assert not drafted(fresh, 0, {ShellOptions.READER_SUGGESTIONS.key: 0}), "0 turns the suggestions off"
    assert not drafted(repeated(49), 0, {ShellOptions.READER_SUGGESTION_RUNS.key: 50}) and drafted(repeated(50), 0, {ShellOptions.READER_SUGGESTION_RUNS.key: 50}), "a part told before is told again once its runs since reach the setting"
    assert not drafted(repeated(500), 0, {ShellOptions.READER_SUGGESTION_RUNS.key: 0}), "0 tells a part only once"
    assert [n.key for n in Ready().respond(Ticked(agent=EVENT_AGENT, silence_seconds=1.0, time=200.0).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).nudges] == ["workers.act_on_the_reports"]
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Read", input={"file_path": str(private / "keys.json")}, operation=Claude().operation("Read", {"file_path": str(private / "keys.json")}))).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal.key == "secrets.secrets_out_of_reach"
    allowed = Ready().respond(SecretAllowed(environment_id=0, time=1.0, secret_id=2, title="GitHub", programs=("gh",)).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert has_nudge([n.rendered() for n in allowed.nudges][0], SecretsNudges.SECRET_PROGRAM_GRANT, n=2, programs="gh")
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="AskUserQuestion", input={}, operation=Claude().operation("AskUserQuestion", {}))).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal.key == "questions.ask_through_the_journal"
    worktree_file = str(tmp_path / "worktrees" / "3-Lady-Lovelace" / "a.py")
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Edit", input={"file_path": worktree_file}, operation=Claude().operation("Edit", {"file_path": worktree_file}), writes=True, edited_paths=(worktree_file,))).with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct)).refusal.key == "workers.file_is_the_workers"
    back = Ready().respond(WorkerReported(environment_id=1, time=1.0, worker=WorkerMention(2, "Lady Lovelace", None), report=40, ref="workers:2", outcome="worker 2, Lady Lovelace, reported").with_data(data), settings, (MessagesConduct, LawsConduct, ShellConduct, SecretsConduct, QuestionsConduct, ProfilesConduct, WorkersConduct))
    assert [n.rendered() for n in back.nudges] == ["worker 2 reported"]


def test_a_state_whose_own_listener_stops_the_walk_answers_in_the_conducts_place():
    class Quiet(Listening):
        def on_tool_starting(self, event: ToolStarting, settings: SettingsValue) -> Transition:
            event.stop_propagation()
            return self.none()

    assert Listening().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {}))), SettingsValue({}), (InboxConduct,)).nudges == (LINE, OTHER, OTHER)
    assert Quiet().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Write", input={}, operation=Claude().operation("Write", {}))), SettingsValue({}), (InboxConduct,)).nudges == (), "a state that stops the walk answers alone; the conduct's listener is never heard"


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
    from journal.support.card_type import CardType
    settings = SettingsValue({WorkersOptions.MODE.key: "builder", "tasks.auto": False, "skills.session_start": ["journal"], "skills.after_compaction": ["journal"]})
    cards = (SkillCard("journal", ".claude/skills/journal/SKILL.md", "h1", (), ()), SkillCard("plans", ".claude/skills/journal-plans/SKILL.md", "h2", ("plan", "roadmap"), ("following_plan",)))
    parts = {
        "plans": PlansData((), None), "tasks": TasksData(current_task=0, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=()),
        "skills": SkillsData(skills_due=("journal",), loaded={"plans": "h2"}, skills=cards),
        "briefing": BriefingData(is_overview_read=False, environment="main", peer_session_active_at="09:12", rules="1. Always test", rules_count=1, memories="", reminders="1. Log often", waiting="2 tasks"),
        "memory": MemoryData(threshold_due=50, context_threshold=50, rows=(MemoryRow("reminder", 3, "the port is 8420", ("port",), CardType.REMINDERS),), stale=()),
    }
    data = FeatureData(parts)
    started = Ready().respond(SessionStarted(agent=EVENT_AGENT, source="startup").with_data(data), settings, (SkillsConduct, BriefingConduct, MemoryConduct))
    keys = [n.key for n in started.nudges]
    assert keys[:4] == ["skills.read_the_skill_first", "briefing.journal_ready", "briefing.handle_the_journal_quietly", "briefing.the_laws_apply"]
    assert "briefing.you_took_over" in keys and "briefing.rules_in_force" in keys and "briefing.memories_here" not in keys and "briefing.reminders_here" in keys and "briefing.waiting_for_you" in keys and "briefing.look_before_the_first_write" in keys
    assert ".claude/skills/journal/SKILL.md" in started.nudges[0].rendered()
    compacted = Ready().respond(SessionStarted(agent=EVENT_AGENT, source="compact").with_data(data), settings, (SkillsConduct, BriefingConduct, MemoryConduct))
    assert "briefing.you_took_over" not in [n.key for n in compacted.nudges]
    prompt = Ready().respond(PromptSubmitted(agent=EVENT_AGENT, prompt="draw me a roadmap").with_data(data), settings, (SkillsConduct, BriefingConduct, MemoryConduct))
    assert [n.key for n in prompt.nudges if n.feature == "skills"] == [], "the plans skill is read already, by its hash"
    unread = FeatureData({**parts, "skills": SkillsData(skills_due=(), loaded={}, skills=cards)})
    asked = [n.rendered() for n in Ready().respond(PromptSubmitted(agent=EVENT_AGENT, prompt="draw me a roadmap").with_data(unread), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).nudges][0]
    assert has_nudge(asked, SkillsNudges.SKILL_READ_REQUEST) and "the plans skill" in asked
    withheld = Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Edit", input={"file_path": "a.py"}, operation=Claude().operation("Edit", {"file_path": "a.py"}), writes=True)).with_data(data), settings, (SkillsConduct, BriefingConduct, MemoryConduct))
    assert withheld.refusal is not None and withheld.refusal.key == "skills.read_the_skill_first", "the first hold wins: the skill, then the look, then the mark"
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Read", input={"file_path": "a.py"}, operation=Claude().operation("Read", {"file_path": "a.py"}), read_paths=("a.py",))).with_data(data), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).refusal is not None, "every tool waits while a skill is owed"
    skill_read = ToolCall(tool="Read", input={"file_path": "/p/.claude/skills/journal/SKILL.md"}, operation=Claude().operation("Read", {"file_path": "/p/.claude/skills/journal/SKILL.md"}), read_paths=("/p/.claude/skills/journal/SKILL.md",))
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=skill_read).with_data(data), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).refusal is None, "but the read of the owed skill goes through"
    stop = Ready().respond(Stop(agent=EVENT_AGENT).with_data(data), settings, (SkillsConduct, BriefingConduct, MemoryConduct))
    assert stop.refusal is not None and stop.refusal.key == "skills.stopped_owing"
    paid = FeatureData({**parts, "skills": SkillsData(skills_due=(), loaded={}, skills=cards)})
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Edit", input={"file_path": "a.py"}, operation=Claude().operation("Edit", {"file_path": "a.py"}), writes=True)).with_data(paid), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).refusal.key == "briefing.look_before_the_first_write"
    looked = FeatureData({**paid.parts, "briefing": BriefingData(**{**parts["briefing"].__dict__, "is_overview_read": True})})
    from journal.features.memory.states.weighing_memories import WeighingMemories
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Edit", input={"file_path": "a.py"}, operation=Claude().operation("Edit", {"file_path": "a.py"}), writes=True)).with_data(looked), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).pushed == WeighingMemories(percent=50), "the mark owed pushes WeighingMemories over the work"
    assert WeighingMemories(percent=50).respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Edit", input={"file_path": "a.py"}, operation=Claude().operation("Edit", {"file_path": "a.py"}), writes=True)).with_data(looked), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).refusal.key == "memory.write_held_until_decided"
    assert has_nudge(WeighingMemories(percent=50).respond(Stop(agent=EVENT_AGENT).with_data(looked), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).refusal.rendered(), MemoryNudges.UNDECIDED_STOP, percent=50)
    decided = FeatureData({**looked.parts, "memory": MemoryData(threshold_due=0, context_threshold=50, rows=parts["memory"].rows, stale=())})
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Edit", input={"file_path": "a.py"}, operation=Claude().operation("Edit", {"file_path": "a.py"}), writes=True)).with_data(decided), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).refusal is None
    arrived = Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Read", input={"file_path": "a.py"}, operation=Claude().operation("Read", {"file_path": "a.py"})), context=0.81, session="s1").with_data(decided), settings, (SkillsConduct, BriefingConduct, MemoryConduct))
    assert arrived.nudges[0].key == "memory.decide_at_the_mark" and arrived.pushed == WeighingMemories(percent=80)
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Read", input={"file_path": "a.py"}, operation=Claude().operation("Read", {"file_path": "a.py"})), context=0.6, session="s1").with_data(decided), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).nudges == ()
    whispered = Ready().respond(ToolStarting(agent=EVENT_AGENT, call=shell("lsof -i :port")).with_data(decided), settings, (SkillsConduct, BriefingConduct, MemoryConduct))
    assert [n.rendered() for n in whispered.terminal_lines] == [MemoryNudges.MEMORY_READ_REQUEST.create(noun="reminder", n=3).rendered()], "a whisper tells the agent to read the row, never its words"
    prior_items = FeatureData({**decided.parts, "memory": MemoryData(threshold_due=0, context_threshold=50, rows=tuple(replace(row, presence=True) for row in parts["memory"].rows), stale=())})
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=shell("lsof -i :port")).with_data(prior_items), settings, (SkillsConduct, BriefingConduct, MemoryConduct)).terminal_lines == (), "a row in the context window is not whispered"
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
    last = first.target.respond(WorkerStopped(environment_id=1, time=2.0, worker=WorkerMention(4, "Herr Turing", ""), ref="workers:4", outcome="worker 4, Herr Turing, stopped"), settings)
    assert last.popped and [n.key for n in last.nudges] == ["tasks.wait_over"] and has_nudge(last.nudges[-1].rendered(), TasksNudges.WAIT_END, outcome="worker 3, Lady Lovelace, reported; worker 4, Herr Turing, stopped")
    from journal.events.rows.worker_dispatched import WorkerDispatched
    from journal.features.workers.workers_conduct import WorkersConduct
    data = FeatureData({"tasks": TasksData(current_task=0, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=())})
    owned = Ready().respond(WorkerDispatched(environment_id=1, time=3.0, worker=WorkerMention(5, "Lady Lovelace", "s1"), awaiter="s1", ref="workers:5", label="worker 5").reaching("s1").with_data(data), settings, (WorkersConduct,))
    assert owned.pushed == ExternalWait.opened("worker 5", "workers:5", 3.0), "a worker this agent dispatches while idle pushes the wait on its work"
    assert Working(task_id=7).respond(WorkerDispatched(environment_id=1, time=3.0, worker=WorkerMention(5, "Lady Lovelace", "s2"), awaiter="s2", ref="workers:5", label="worker 5").reaching("s1"), settings, (WorkersConduct,)).pushed is None, "another session's worker is not waited on here"
    widened = ExternalWait.opened("worker 5", "workers:5", 3.0).respond(WorkerDispatched(environment_id=1, time=4.0, worker=WorkerMention(6, "Dr. Einstein", "s1"), awaiter="s1", ref="workers:6", label="worker 6").reaching("s1"), settings, (WorkersConduct,))
    assert widened.target == ExternalWait.opened("worker 5, worker 6", "workers:5,workers:6", 3.0) and widened.pushed is None, "a second dispatch widens the wait instead of stacking another"
    assert ExternalWait.opened("worker 5", "workers:5", 3.0).respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Edit", input={}, operation=Claude().operation("Edit", {}), writes=True)), settings).target == ExternalWait.opened("worker 5", "workers:5", 3.0), "the agent works on while its workers run"


def test_idle_holds_the_stop_by_what_is_open_and_asks_on_the_ticks_from_the_data():
    from journal.features.plans.states.plans_ready import PlansReady
    from dataclasses import replace
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.features.plans.support.plans_data import PlansData
    from journal.models.open_task import OpenTask
    from journal.events.agent.stop import Stop
    from journal.events.agent.ticked import Ticked
    auto, manual = SettingsValue({TasksOptions.AUTO.key: True, WorkersOptions.MODE.key: "builder"}), SettingsValue({TasksOptions.AUTO.key: False, WorkersOptions.MODE.key: "builder"})
    nothing = TasksData(current_task=0, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=())
    open_next = replace(nothing, next_open=OpenTask(4, "the footer", "", 0))
    broken = replace(open_next, broken_waits=(3,), broken_waits_summary="task 3 waits on check 1, lint, which cannot run")
    of = lambda tasks, approved=(): FeatureData({"tasks": tasks, "plans": PlansData(approved, None)})
    stop = lambda data, settings=auto, prior_refusal=False: PlansReady(silenced_at=100.0).respond(Stop(agent=EVENT_AGENT, prior_refusal=prior_refusal).with_data(data), settings)
    assert stop(of(broken)).refusal.rendered().startswith("task 3 waits on check 1, lint, which cannot run")
    assert stop(of(open_next)).refusal is None and stop(of(open_next, approved=(9,))).refusal is None, "an open task or an approved plan is the assigner's to start before the stack answers; the idle state holds no stop for it"
    assert stop(of(nothing), manual).refusal is None and stop(of(nothing)).refusal is None
    left = of(replace(broken, blocked=(5,), open_ids=(4,)))
    answers = [stop(left)]
    answers.append(answers[-1].target.respond(Stop(agent=EVENT_AGENT, prior_refusal=True).with_data(left), auto))
    assert answers[0].refusal.rendered().startswith("task 3 waits on check 1") and answers[1].refusal is None, "a round names the broken wait once; a blocked task is never a reason to go on, and after the round the stop goes through"
    worked = answers[1].target.respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Read", input={}, operation=Claude().operation("Read", {})), time=200.0).with_data(left), auto)
    assert worked.target.stop_round == 0 and stop(left).refusal.rendered().startswith("task 3 waits"), "work starts the round over"
    idle = PlansReady(silenced_at=0.0)
    active = idle.respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Read", input={}, operation=Claude().operation("Read", {})), time=50.0).with_data(of(nothing)), auto)
    assert active.target == PlansReady(silenced_at=50.0)
    assert idle.respond(PromptSubmitted(agent=EVENT_AGENT, prompt="hi", time=70.0).with_data(of(nothing)), auto).target.silenced_at == 70.0
    tick = lambda data, time, state=idle, settings=auto: state.respond(Ticked(agent=EVENT_AGENT, silence_seconds=0.0, time=time).with_data(data), settings)
    open_work = replace(nothing, open_work=OpenTask(4, "the footer", "", 0))
    assert [n.key for n in tick(of(open_work), 30 * 60.0).nudges] == ["tasks.check_in_after_quiet"] and tick(of(open_work), 20 * 60.0).nudges == ()
    assert tick(of(nothing), 30 * 60.0).nudges == (), "with nothing to go on with, half an hour of quiet sends no line"
    assert idle.respond(SessionStarted(agent=EVENT_AGENT, time=5.0).with_data(of(nothing)), auto).target == PlansReady(silenced_at=5.0)


def test_working_counts_its_edits_holds_and_says_its_lines_and_pops_when_its_task_closes():
    from journal.features.plans.states.plans_ready import PlansReady
    from journal.features.plans.states.plans_working import PlansWorking
    from dataclasses import replace
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.git.support.git_data import GitData
    from journal.events.agent.stop import Stop
    from journal.events.agent.ticked import Ticked
    from journal.events.rows.task_closed import TaskClosed
    from journal.events.rows.task_logged import TaskLogged
    settings = SettingsValue({TasksOptions.AUTO.key: True, TasksOptions.LOG_LIMIT.key: 4, TasksOptions.FIRST_DELAY.key: 2, TasksOptions.TASK_REMINDER_INTERVAL.key: 3, TasksOptions.LOG_AGE_LIMIT.key: 10})
    tasks = TasksData(current_task=7, last_log_line='"the parser reads"', blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=())
    of = lambda current_task=7, approved=(): FeatureData({"tasks": replace(tasks, current_task=current_task), "plans": PlansData(approved, None), "git": GitData(uncommitted="a.py, b.py")})
    working = PlansWorking(task_id=7, logged_at=1000.0)
    write = lambda state, time=1001.0: state.respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Edit", input={}, operation=Claude().operation("Edit", {}), writes=True), time=time).with_data(of()), settings)
    first = write(working)
    assert first.target == PlansWorking(task_id=7, logged_at=1000.0, edits=1, active_at=1001.0, untested_edits=True) and first.nudges == ()
    second = write(first.target)
    assert second.target.edits == 2 and second.nudges == ()
    third = write(second.target)
    assert third.target.edits == 3 and [n.key for n in third.nudges] == ["tasks.log_where_it_stands"] and has_nudge(third.nudges[0].rendered(), TasksNudges.LOG_REQUEST, edits=2, name="task 7")
    fourth = write(third.target)
    assert fourth.target.edits == 4 and [n.key for n in fourth.nudges] == ["tasks.task_in_hand_repeated"]
    withheld = write(fourth.target)
    assert withheld.refusal is not None and has_nudge(withheld.refusal.rendered(), TasksNudges.LOG_EDIT_BLOCK, edits=4, name="task 7")
    read = fourth.target.respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Read", input={}, operation=Claude().operation("Read", {})), time=1002.0).with_data(of()), settings)
    assert read.target.edits == 4 and read.refusal is None and read.target.active_at == 1002.0
    logged = fourth.target.respond(TaskLogged(environment_id=1, time=1500.0, task_id=7).with_data(of()), settings)
    assert logged.target == PlansWorking(task_id=7, logged_at=1500.0, edits=0, active_at=1001.0, untested_edits=True)
    assert fourth.target.respond(TaskLogged(environment_id=1, time=1500.0, task_id=8).with_data(of()), settings).target == fourth.target
    stop = lambda state, time, approved=(), prior_refusal=False: state.respond(Stop(agent=EVENT_AGENT, prior_refusal=prior_refusal, time=time).with_data(of(approved=approved)), settings)
    assert stop(working, 1100.0).refusal.rendered().startswith("task 7 is in hand: carry on")
    assert has_nudge(stop(working, 1700.0).refusal.rendered(), TasksNudges.STOP_LOG_REQUEST, name="task 7", logged="last logged 11 min ago")
    assert stop(working, 1100.0, approved=(9,)).refusal.rendered().startswith("task 7 is in hand"), "an approved plan waits for the assigner; the task in hand is what a stop names"
    assert stop(working, 1100.0, prior_refusal=True).refusal is not None, "with a task in hand there is no escape by stopping twice"
    started = working.respond(SessionStarted(agent=EVENT_AGENT, source="compact", time=1100.0).with_data(of()), settings)
    assert [n.key for n in started.nudges] == ["tasks.carry_on", "briefing.brief_and_log_after_compaction"] and 'last log "the parser reads", uncommitted: a.py, b.py' in started.nudges[1].rendered()
    assert [n.key for n in working.respond(SessionStarted(agent=EVENT_AGENT, source="startup", time=1100.0).with_data(of()), settings).nudges] == ["tasks.carry_on"]
    assert [n.key for n in PlansWorking(task_id=7, active_at=0.0).respond(Ticked(agent=EVENT_AGENT, silence_seconds=900.0, time=900.0).with_data(of()), settings).nudges] == ["tasks.task_still_open"], "a quarter of an hour of quiet, counted from the agent's last activity, names the open task"
    assert PlansWorking(task_id=7, active_at=0.0).respond(Ticked(agent=EVENT_AGENT, silence_seconds=60.0, time=900.0).with_data(of()), settings).nudges == (), "an agent active a minute ago is not nagged, however old its task"
    assert PlansWorking(task_id=7, active_at=100.0).respond(Ticked(agent=EVENT_AGENT, silence_seconds=0.0, time=900.0).with_data(of()), settings).nudges == ()
    assert working.respond(TaskClosed(environment_id=1, time=2.0, task_id=7, outcome="completed").with_data(of()), settings).popped
    assert not working.respond(TaskClosed(environment_id=1, time=2.0, task_id=8, outcome="completed").with_data(of()), settings).popped
    assert working.on_resume(of(current_task=0), settings).popped, "its task closed while it waited"
    assert working.on_resume(of(), settings) == (), "its task still in hand, the work goes on in silence: the wait that popped said what came"


def test_following_plan_keeps_the_next_task_stands_at_the_checkpoint_and_pops_when_the_plan_is_done():
    from journal.features.plans.states.plans_ready import PlansReady
    from journal.features.plans.states.plans_working import PlansWorking
    from dataclasses import replace
    from journal.features.plans.states.following_plan import FollowingPlan
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.plans.support.started_plan import StartedPlan
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.engine.support.block import Block
    from journal.events.agent.stop import Stop
    from journal.events.rows.plan_finished import PlanFinished
    from journal.events.rows.plan_started import PlanStarted
    from journal.events.rows.task_closed import TaskClosed
    from journal.events.rows.task_started import TaskStarted
    auto, manual = SettingsValue({TasksOptions.AUTO.key: True, TasksOptions.LOG_LIMIT.key: 50, TasksOptions.FIRST_DELAY.key: 25, TasksOptions.TASK_REMINDER_INTERVAL.key: 25}), SettingsValue({TasksOptions.AUTO.key: False})
    tasks = TasksData(current_task=0, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=(), agent_tasks=(3, 7, 8))
    plan = StartedPlan(plan_id=5, next_task=8, started_task=0, started_task_briefing="", recent_tasks=(7, 8), remaining_tasks=1, checkpoint_pause=False, checkpoint_phase=0, testing="")
    of = lambda started: FeatureData({"tasks": tasks, "plans": PlansData((), started)})
    following = FollowingPlan(plan_id=5, task_id=7, approved=True, logged_at=10.0)
    assert following.on_push(auto) == () and isinstance(FollowingPlan(plan_id=5).on_push(auto), Block), "an unapproved plan is refused"
    closed = following.respond(TaskClosed(environment_id=1, time=20.0, task_id=7, outcome="completed").with_data(of(plan)), auto)
    assert closed.target == replace(following, task_id=0, origin_state=7, logged_at=20.0) and not closed.popped
    assert following.respond(TaskClosed(environment_id=1, time=20.0, task_id=9, outcome="completed").with_data(of(plan)), auto).target == following
    started = closed.target.respond(TaskStarted(environment_id=1, time=30.0, task_id=8, title="next", plan_id=5).with_data(of(replace(plan, started_task=8))), auto)
    assert started.target == replace(following, task_id=8, origin_state=7, logged_at=30.0)
    checkpoint_pause = following.respond(TaskClosed(environment_id=1, time=20.0, task_id=7, outcome="completed").with_data(of(replace(plan, checkpoint_pause=True, checkpoint_phase=2))), auto)
    assert checkpoint_pause.target == replace(following, task_id=0, origin_state=7, checkpoint_pause=True, phase=2)
    stopped = checkpoint_pause.target.respond(Stop(agent=EVENT_AGENT).with_data(of(replace(plan, passes_checkpoints=True))), auto)
    assert stopped.refusal.rendered().startswith("plan 5: phase 2 done")
    waits = checkpoint_pause.target.respond(Stop(agent=EVENT_AGENT).with_data(of(plan)), manual)
    assert waits.refusal is None and has_nudge(waits.nudges[0].rendered(), PlansNudges.CHECKPOINT_PHASE_END, n=5, phase=2)
    assert checkpoint_pause.target.respond(SessionStarted(agent=EVENT_AGENT, time=40.0).with_data(of(plan)), auto).nudges[0].key == "plans.phase_complete_at_a_checkpoint"
    assert checkpoint_pause.target.respond(ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Edit", input={}, operation=Claude().operation("Edit", {}), writes=True), time=41.0).with_data(of(plan)), auto).target == checkpoint_pause.target, "counts nothing at a checkpoint"
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
    from journal.features.tasks.states.working import Working
    from journal.features.plans.states.following_plan import FollowingPlan
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.plans.support.started_plan import StartedPlan
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.events.rows.plan_abandoned import PlanAbandoned
    from journal.events.rows.plan_postponed import PlanPostponed
    settings = SettingsValue({})
    tasks = TasksData(current_task=7, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=())
    plan = StartedPlan(plan_id=5, next_task=8, started_task=7, started_task_briefing="", recent_tasks=(7, 8), remaining_tasks=2, checkpoint_pause=False, checkpoint_phase=0, testing="")
    of = lambda started: FeatureData({"tasks": tasks, "plans": PlansData((), started)})
    paused = FeatureData({"tasks": replace(tasks, current_task=0), "plans": PlansData((), None)})
    following = FollowingPlan(plan_id=5, task_id=7, approved=True, logged_at=10.0)
    user_origin = following.respond(PlanPostponed(environment_id=1, time=20.0, plan_id=5, user_origin=True).with_data(paused), settings)
    assert user_origin.popped and [n.rendered() for n in user_origin.nudges] == [PlansNudges.PLAN_POSTPONED.create(n=5).rendered()]
    agent_index = following.respond(PlanPostponed(environment_id=1, time=20.0, plan_id=5, user_origin=False).with_data(paused), settings)
    assert agent_index.popped and agent_index.nudges == (), "the agent's own command needs no line"
    assert not following.respond(PlanPostponed(environment_id=1, time=20.0, plan_id=6, user_origin=True).with_data(of(plan)), settings).popped
    abandoned = following.respond(PlanAbandoned(environment_id=1, time=20.0, plan_id=5, user_origin=True).with_data(paused), settings)
    assert abandoned.popped and [n.rendered() for n in abandoned.nudges] == [PlansNudges.PLAN_ABANDONED.create(n=5).rendered()]
    assert following.on_resume(of(None), settings).popped, "beneath a wait, a plan postponed meanwhile is over on resume"
    assert following.on_resume(of(replace(plan, plan_id=6)), settings).popped, "another plan started meanwhile: this one is over"
    assert following.on_resume(of(plan), settings) == (), "still the plan started here: the work goes on in silence"
    outside = FeatureData({"tasks": replace(tasks, current_task=9), "plans": PlansData((), None)})
    kept = replace(following, task_id=9).respond(PlanPostponed(environment_id=1, time=20.0, plan_id=5, user_origin=True).with_data(outside), settings)
    assert not kept.popped and type(kept.target) is Working and kept.target.task_id == 9, "a task started outside the plan stays in hand when the plan is postponed"
    assert replace(following, task_id=9).respond(PlanAbandoned(environment_id=1, time=20.0, plan_id=5, user_origin=False).with_data(outside), settings).target.task_id == 9


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
    assert waiting.respond(SessionStarted(agent=EVENT_AGENT, time=4.0).with_data(of(4)), settings, (QuestionsConduct,)).popped is False and waiting.respond(Stop(agent=EVENT_AGENT).with_data(of(4)), settings, (QuestionsConduct,)).refusal is None, "a stop while waiting is fine"
    assert waiting.on_resume(of(4), settings) == (), "beneath a compaction the wait stands while the question is open"
    assert waiting.on_resume(of(), settings).popped, "answered meanwhile, it pops on resume with the line"
    assert not Compacting().respond(QuestionAnswered(environment_id=1, time=3.0, question_id=4).with_data(of()), settings, (QuestionsConduct,)).popped, "the answer under a compaction waits for the resume"


def test_a_question_the_user_closes_pops_its_wait_and_tells_the_agent_in_one_line():
    from journal.features.questions.states.waiting import Waiting
    from journal.features.questions.questions_conduct import QuestionsConduct
    from journal.features.questions.support.questions_data import QuestionsData
    from journal.events.rows.question_closed import QuestionClosed
    settings = SettingsValue({})
    of = lambda *open: FeatureData({"questions": QuestionsData(open=open)})
    closed = Waiting(question_id=4).respond(QuestionClosed(environment_id=1, time=3.0, question_id=4).with_data(of()), settings, (QuestionsConduct,))
    assert closed.popped and has_nudge([n.rendered() for n in closed.nudges][0], QuestionsNudges.QUESTION_CLOSED, n=4)
    assert not Waiting(question_id=4).respond(QuestionClosed(environment_id=1, time=3.0, question_id=5).with_data(of(4)), settings, (QuestionsConduct,)).popped, "another question closed is not this one"




def test_a_journal_command_is_no_tool_use_to_a_wait():
    from journal.features.questions.states.waiting import Waiting
    settings = SettingsValue({})
    waiting = Waiting(question_id=4)
    assert waiting.respond(ToolStarting(agent=EVENT_AGENT, call=shell("journal task list")), settings).popped is False, "a journal command lifts no wait"
    assert waiting.respond(ToolStarting(agent=EVENT_AGENT, call=shell("ls src")), settings).popped, "the agent's own tool use does"


def test_a_part_knows_whether_it_reads_an_output_and_the_shape_of_that_read():
    parts = shell("journal output read 12 --grep FAILED && ls src").parts
    assert (parts[0].reads_output, parts[0].read_shape) == (True, "journal output read <output> --grep FAILED"), "the number taken out, the read keeps its shape"
    assert not parts[1].reads_output and parts[1].read_shape == "ls src", "a part that reads no output has its own text as its shape"
    assert not shell("journal output read 3").parts[0].reads_output, "a plain read of a summary is no read by hand"


def test_the_engine_indexes_its_listeners_once_at_boot_and_the_container_builds_one_instance_per_class(app: App):
    from journal.events.agent.stop import Stop
    from journal.features.messages.messages_conduct import MessagesConduct
    from journal.repositories.agents import Agents
    from journal.support.agent_role import AgentRole
    machine = app.container.get(StateMachine)
    index, conducts = machine.listener_index, machine.features.conducts(AgentRole.MAIN)
    state = next(iter(machine.states.classes()))
    assert index.state_listeners(state, conducts, ToolStarting) == state.event_listeners(ToolStarting, conducts), "the boot's index holds what a registered state's listeners for an event are, worked out once"
    assert index.state_listeners(state, conducts, Stop) is index.state_listeners(state, conducts, Stop), "and hands the same answer every time"
    assert Working.event_listeners(ToolStarting, (MessagesConduct,)) != Working.event_listeners(ToolStarting), "the conducts a state hears are part of what its listeners are"
    assert app.container.get(StateMachine) is app.container.get(StateMachine) and app.container.get(Agents) is app.container.get(Agents), "the container builds a class once"




def test_a_task_started_outside_the_plan_is_worked_on_top_of_the_plan_state_and_its_nudges_name_it():
    from journal.features.plans.states.following_plan import FollowingPlan
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.tasks.states.working import Working
    from journal.features.tasks.support.tasks_data import TasksData
    settings = SettingsValue({})
    following = FollowingPlan(plan_id=19, approved=True)
    assert following.label() == "plan 19, with no task in hand"
    held = TasksData(current_task=1141, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=(), agent_tasks=(1141,))
    started = following.respond(TaskStarted(environment_id=1, time=5.0, task_id=1141, title="the developer tab", plan_id=0).with_data(FeatureData({"tasks": held, "plans": PlansData((), None)})), settings)
    assert started.pushed == Working(task_id=1141, logged_at=5.0) and started.pushed.label() == "task 1141", "a task outside the plan is worked on top of the plan state, which is back once it ends"


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
    settings = lambda mode: SettingsValue({WorkersOptions.MODE.key: mode, TasksOptions.AUTO.key: True, TasksOptions.LOG_AGE_LIMIT.key: 10, TasksOptions.FIRST_DELAY.key: 25})
    tasks = TasksData(current_task=0, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=OpenTask(3, "the footer", "", 0), last_commands=(), agent_tasks=(7,), open_ids=(3, 4), open_count=2, open_next="task 3 (the footer), task 4 (the margin)")
    started = StartedPlan(plan_id=2, next_task=3, started_task=0, started_task_briefing="", recent_tasks=(3, 4), remaining_tasks=2, checkpoint_pause=False, checkpoint_phase=0, testing="")
    from journal.features.workers.support.workers_data import WorkersData
    workers = lambda *delegable: WorkersData(dispatched_workers=(), idle_workers=(), active_subagents=0, subagents=(), worktrees_root=Path("."), worktrees=(), delegable=delegable)
    of = lambda plan: FeatureData({"plans": PlansData((), plan), "tasks": tasks, "workers": workers(3, 4)})
    from journal.engine.states_catalogue import StatesCatalogue
    from journal.engine.support.stack import Stack
    from journal.features.plans.states.plans_ready import PlansReady
    from journal.features.plans.states.plans_working import PlansWorking

    class ModeRegistry:
        def states(self):
            return [Ready, PlansReady, Orchestrating, Soloing]

        def modes(self):
            return [Workers.modes]

        def floors(self):
            return {}

    catalogue = StatesCatalogue(ModeRegistry())
    assert isinstance(catalogue.floor(Stack((PlansReady(),)), settings("orchestrator")).states[0], Orchestrating), "the work mode's state is the bottom of every stack"
    from journal.engine.states.void import Void
    from journal.support.agent_role import AgentRole
    from journal.features.workers.states.working_task import WorkingTask
    worker_stacks = [catalogue.floor(Stack(layers), settings("orchestrator")).states for layers in ((Void(), WorkingTask(task_id=4)), (Void(),))]
    assert [[type(layer) for layer in layers] for layers in worker_stacks] == [[Void, WorkingTask], [Void]], "a helper's stack rests on Void, never on the main agent's mode, and keeps its work above it"
    planned = Orchestrating().respond(SessionStarted(agent=EVENT_AGENT, time=1.0).with_data(of(started)), settings("orchestrator"))
    assert isinstance(planned.pushed, OrchestratingPlan) and planned.pushed.plan_id == 2, "a started plan is pushed over the mode state as the orchestrator's plan state"
    assert type(catalogue.floor(Stack((Orchestrating(),)), settings("builder")).states[0]) is PlansReady, "the builder's mode state is Idle with plans"
    stop = Orchestrating().respond(Stop(agent=EVENT_AGENT).with_data(of(None)), settings("orchestrator"))
    assert stop.refusal is not None and "next: 3, 4" in stop.refusal.rendered() and "dispatch a worker on each you can" in stop.refusal.rendered(), "the orchestrator's stop is held with the tasks to dispatch, in its assigner's turn"
    from dataclasses import replace as replaced
    all_blocked = FeatureData({"plans": PlansData((), None), "tasks": replaced(tasks, open_ids=(), open_next="", blocked=(5, 8)), "workers": workers()})
    held = Orchestrating().respond(Stop(agent=EVENT_AGENT).with_data(all_blocked), settings("orchestrator"))
    told = held.refusal.rendered()
    assert "tasks 5, 8" in told and "journal task unblock" in told and "journal stuck" in told, "an orchestrator whose every task is blocked may not stop: it checks them, decides what it can, waits on its workers or says it is stuck"
    some_blocked = FeatureData({"plans": PlansData((), None), "tasks": replaced(tasks, blocked=(5,)), "workers": workers(3, 4)})
    busy = Orchestrating().respond(Stop(agent=EVENT_AGENT).with_data(some_blocked), settings("orchestrator"))
    assert busy.refusal.rendered().startswith("tasks 5 are blocked"), "a stop round asks about the blocked tasks before the open ones"
    again = busy.target.respond(Stop(agent=EVENT_AGENT).with_data(some_blocked), settings("orchestrator"))
    assert "dispatch a worker on each you can" in again.refusal.rendered(), "and then holds the stop with the tasks to dispatch"
    assert WorkersNudges.BLOCKED_CHECK.repeat == Timeout.seconds(300), "and the check comes again every five minutes while it holds"
    assert "dispatch" not in str(PlansReady().respond(Stop(agent=EVENT_AGENT).with_data(of(None)), settings("builder")).refusal), "the builder's next task is started by its assigner before the stop, and the builder is never told to dispatch"
    assert isinstance(Orchestrating().respond(TaskStarted(environment_id=1, time=2.0, task_id=7, title="x", plan_id=0).with_data(of(None)), settings("orchestrator")).pushed, Delegating), "a task started in the orchestrator's mode is delegating, not working"
    delegating = Delegating(task_id=7, logged_at=1.0).respond(Stop(agent=EVENT_AGENT, time=2.0).with_data(of(None)), settings("orchestrator"))
    assert delegating.refusal is not None and "give it to a worker" in delegating.refusal.rendered(), "the delegating task says hand it over where working says carry on"
    assert isinstance(catalogue.floor(Stack((PlansReady(), PlansWorking(task_id=1))), settings("solo")).states[0], Soloing), "a mode changed while work is in hand changes the bottom beneath it"
    assert Soloing().respond(ToolStarting(agent=EVENT_AGENT, call=shell("journal worker dispatch 'Mr. Smith' 'the job' --profile journal-medior")).with_data(of(None)), settings("solo")).refusal == WorkersNudges.SOLO_DISPATCH.create(), "solo keeps workers out"
    assert Soloing().respond(ToolStarting(agent=EVENT_AGENT, call=shell("ls")).with_data(of(None)), settings("solo")).refusal is None


def test_an_orchestrator_driven_through_a_plan_of_twenty_tasks_with_workers_never_stalls(app: App, monkeypatch):
    import subprocess
    import time as timing
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.supervisor_link import SupervisorLink
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: None)
    working = []

    def started(runner, worker, actor):
        working.append(subprocess.Popen(["sleep", "60"], start_new_session=True))
        runner.workers.save(worker.running_as(working[-1].pid, timing.time()), actor)

    monkeypatch.setattr(WorkerRunner, "start", started)
    try:
        orchestrated(app)
    finally:
        for process in working:
            process.kill()
            process.wait()


def orchestrated(app: App) -> None:
    """Twenty tasks through the orchestrator, each dispatched worker standing in as a process that runs until the test lets it go."""
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.repositories.workers import Workers as WorkerRows
    user_set(app, "workers.mode", "orchestrator")
    hook(app, "SessionStart")
    console, agents, tasks = app.console(), app.container.get(Agents), app.container.get(Tasks)
    console.run(["environment", "overview"], AGENT)
    console.run(["plan", "create", "go live", "--brief", "twenty tasks"], USER)
    console.run(["plan", "phase", "1", "release", "--when", "all twenty done"], USER)
    for n in range(1, 21):
        console.run(["plan", "add", "1", f"piece {n}", "--brief", f"piece {n} is done"], USER)
    console.run(["plan", "todos", "1", "1", *[str(n) for n in range(1, 21)]], USER)
    assert console.run(["plan", "ready", "1"], AGENT).code == 0 and console.run(["plan", "approve", "1"], USER).code == 0 and console.run(["plan", "start", "1"], AGENT).code == 0
    stack = lambda: [s["state"] for s in agents.session_agent("s1").stack]
    assert stack() == ["orchestrating", "orchestrating_plan"] and tasks.find(1).state == "open", "the orchestrator's mode state and its plan state, every piece left open for workers"
    stop = lambda active=False: hook(app, "Stop", stop_hook_active=active)[1]
    first = stop()
    assert first.get("decision") == "block" and "20 tasks open" in first["reason"] and "dispatch a worker on each you can" in first["reason"] and "is in hand" not in first["reason"], "a stop is refused with the open pieces to dispatch"
    for n, name in ((1, "Ada"), (2, "Florence"), (3, "Babbage")):
        assert console.run(["worker", "dispatch", name, f"do piece {n}", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet", "--task", str(n)], AGENT).code == 0, "a worker is put on an open piece of the plan"
    waiting = stop()
    assert stack()[-1] == "awaiting" and "journal worker wait" not in waiting.get("reason", ""), "waiting on the workers it dispatched, a stop goes through"
    workers = app.container.get(WorkerRows)
    for n in (1, 2, 3):
        started_run(app.container.get(WorkerRunner), app.container.get(Workers), workers.find(n), ["sh", "-c", "echo the piece is done"], Actor.agent("s1"))
    assert stack() == ["orchestrating", "orchestrating_plan"], "the last report pops the wait and the orchestrator is back on its plan"
    for n in (1, 2, 3):
        assert console.run(["worker", "complete", str(n)], AGENT).code == 0
        assert console.run(["task", "complete", str(n), "--how", "reviewed and merged"], AGENT).code == 0
    app.runtime().deferred.drain()
    assert tasks.find(4).state == "open" and stack()[-1] == "orchestrating_plan", "the plan leaves its next open piece for a worker"
    for n in range(4, 21):
        assert stop().get("decision") == "block", f"a stop with piece {n} and the rest open is refused, never allowed"
        assert console.run(["task", "start", str(n)], AGENT).code == 0
        hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": f"journal task complete {n} --how done"})
        assert console.run(["task", "complete", str(n), "--how", "done"], AGENT).code == 0
        app.runtime().deferred.drain()
    assert app.container.get(Plans).find(1).state == "done" and stack() == ["orchestrating"], "the plan is done and the orchestrator is back in its mode state"
    assert stop().get("decision") != "block", "with nothing open the stop passes"


def test_a_stop_with_the_tasks_log_older_than_the_set_minutes_asks_for_the_log_line_first():
    from journal.events.agent.stop import Stop
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.tasks.support.tasks_data import TasksData
    data = FeatureData({"plans": PlansData((), None), "tasks": TasksData(current_task=7, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=())})
    settings = lambda minutes: SettingsValue({TasksOptions.AUTO.key: True, TasksOptions.LOG_AGE_LIMIT.key: minutes, TasksOptions.FIRST_DELAY.key: 25, WorkersOptions.MODE.key: "builder"})
    working = Working(task_id=7, logged_at=0.0)
    assert working.respond(Stop(agent=EVENT_AGENT, time=5 * 60.0).with_data(data), settings(10)).refusal.key == "tasks.carry_on", "within the minutes a stop is told to carry on"
    assert working.respond(Stop(agent=EVENT_AGENT, time=11 * 60.0).with_data(data), settings(10)).refusal.key == "tasks.log_first_at_stop", "past them the log line comes first"
    assert working.respond(Stop(agent=EVENT_AGENT, time=2 * 60.0).with_data(data), settings(1)).refusal.key == "tasks.log_first_at_stop", "the minutes are the user's to set"


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


def test_the_log_reminder_comes_once_after_so_many_edits_or_minutes_since_the_last_log_whichever_is_first():
    from dataclasses import replace

    from journal.features.tasks.states.working import Working

    settings = SettingsValue({"tasks.first_nudge_after": 3, "tasks.log_old_after_minutes": 10, "tasks.log_after": 50, "tasks.name_every": 25})
    written = {"file_path": "a.py", "content": "x"}
    write = ToolStarting(agent=EVENT_AGENT, call=ToolCall.decoded("Write", written, Claude().operation("Write", written), ()))
    read = ToolStarting(agent=EVENT_AGENT, call=ToolCall.decoded("Read", {"file_path": "a.py"}, Claude().operation("Read", {"file_path": "a.py"}), ()))

    def at(event, time):
        return replace(event, time=time)

    def said(answer):
        return [n.name for n in answer.nudges]

    working, told = Working(task_id=1, logged_at=0.0), []
    for second in (1.0, 2.0, 3.0, 4.0):
        answer = working.respond(at(write, second), settings)
        working, told = answer.target or working, told + said(answer)
    assert told.count("log_where_it_stands") == 1, "after three edits with no log the log is asked for, and once"
    quiet = Working(task_id=1, logged_at=0.0, edits=1)
    assert said(quiet.respond(at(read, 300.0), settings)) == [], "five minutes and one edit: not yet"
    late = quiet.respond(at(read, 601.0), settings)
    assert said(late) == ["log_where_it_stands"], "ten minutes with few edits ask for it too, on any tool use"
    fresh = late.target.logged(602.0)
    assert said(fresh.respond(at(write, 603.0), settings)) == [] and not fresh.log_requested, "right after a log nothing is asked"
    assert fresh.respond(at(Stop(agent=EVENT_AGENT), 700.0), settings).refusal.name == "carry_on", "a stop inside the span carries on"
    assert late.target.respond(at(Stop(agent=EVENT_AGENT), 700.0), settings).refusal.name == "log_first_at_stop", "a stop past the span asks for the log first"


def test_claude_codes_switch_model_menu_is_recognised_in_a_narrow_terminal_and_a_model_picker_is_not():
    import textwrap
    from journal.providers.support.menu import Menu
    warning = "This conversation is cached for the current model. Switching to \x1b[1mOpus 5.5\x1b[22m means the full history gets re-read on your next message."
    wrapped = "\r\n".join(textwrap.wrap(warning, 40))
    frame = ("\x1b[38;5;209mBefuddling… (46s · ↓ 1.9k tokens · thinking with high effort)\x1b[0m\r\n\r\n" + "─" * 40 + "\r\n"
             "\x1b[1;33mSwitch model?\x1b[0m\r\nYour next response will be slower and\r\nuse more tokens\r\n\r\n" + wrapped + "\r\n\r\n"
             "\x1b[38;5;147m❯ 1. Yes, switch to Opus 5.5\x1b[0m\r\n  2. No, go back\r\n\r\n" + "─" * 40 + "\r\n\r\n" + "─" * 40 + "\r\n"
             "▸▸ bypass permissions on (shift+tab to cycle) · ← for agents\r\n")
    menu = Menu.parsed(frame)
    assert "Switch model?" not in menu.question, "the wrapped warning pushes the menu's title out of the lines read as its question"
    assert menu.switching_model() and menu.accepting().label == "Yes, switch to Opus 5.5", "the switch is still recognised, by its yes option, and that option is the one taken"
    picker = Menu.parsed("Select model\r\n❯ 1. Opus 5.5\r\n  2. Sonnet 5.5\r\n  3. Haiku 5.5\r\nEnter to confirm · Esc to exit\r\n")
    assert not picker.switching_model(), "a picker that names models but asks to switch nothing is not taken for the switch"






def test_a_compaction_that_left_no_start_never_keeps_the_agents_lines_off_under_another_state():
    from journal.engine.states.compacting import Compacting
    from journal.events.agent.tool_finished import ToolFinished
    from journal.events.agent.turn_displayed import TurnDisplayed
    from journal.events.feature_data import FeatureData
    settings = SettingsValue({})
    read = ToolCall.decoded("Read", {"file_path": "a.py"}, Claude().operation("Read", {"file_path": "a.py"}), ())
    assert Compacting().respond(ToolFinished(agent=EVENT_AGENT, call=read, output=""), settings).popped, "a tool finishing shows the compaction is over"
    assert Compacting().respond(TurnDisplayed(agent=EVENT_AGENT, text="Done."), settings).popped, "and so do the agent's words shown"
    resumed = Compacting().on_resume(FeatureData({}), settings)
    assert resumed.popped, "a state pushed over it popping leaves it no longer compacting, so typing comes back"




def test_a_demand_never_counts_or_blocks_a_journal_command_whatever_its_feature_declares():
    from journal.engine.demand import Demand
    from journal.engine.demand_conduct import DemandConduct
    from journal.engine.demand_progress import DemandProgress
    from journal.engine.nudge import Nudge
    from journal.support.timeout import Timeout
    line = Nudge("test", "owed_line", "owed: {{left}}")
    strict = Demand(key="test.strict", requirement=lambda data: "owed", line=lambda requirement, balance: line.create(left=balance), refusal=lambda requirement: line.create(left=0), exemption=lambda event, requirement: False, span=lambda settings: Timeout.tool_uses(0), block_scope=lambda event: True)
    expired = DemandProgress(strict, "owed", Moment(tool_uses=0), Moment(tool_uses=5))
    data = FeatureData({"demands": (expired,)})
    settings = SettingsValue({})
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=shell("journal task list")).with_data(data), settings, (DemandConduct,)).refusal is None, "a journal command passes a demand that exempts nothing"
    assert Ready().respond(ToolStarting(agent=EVENT_AGENT, call=shell("ls")).with_data(data), settings, (DemandConduct,)).refusal is not None






def test_a_worker_not_running_hears_its_tasks_edit_once_with_its_next_job(app: App):
    from journal.features.workers.support.worker_actions import EDITED_NOTE
    from journal.models.worker import Worker
    from journal.models.worker_state import WorkerState
    from journal.repositories.workers import Workers
    from journal.models.support.ref import Ref
    tasks, workers, scope = app.container.get(Tasks), app.container.get(Workers), app.container.get(Scope)
    with scope.environment(1):
        worker = workers.save(Worker(environment_id=1, name="Mr. Babbage", brief="b", state=WorkerState.DELIVERED), Actor.system())
        task = tasks.save(Task(environment_id=1, title="the engine", brief="- turns"), Actor.system())
        tasks.handover(task, Ref.build(worker), Actor.system())
    for brief in ("- turns twice", "- turns three times"):
        assert app.console().run(["task", "edit", str(task.id), "--brief", brief], USER).code == 0
    app.runtime().deferred.drain()
    with scope.environment(1):
        assert workers.find(worker.id).edited_task == task.id, "the edit waits on the worker's row, once however many edits came"
    assert EDITED_NOTE.format(task=task.id).startswith(f"Task {task.id} was changed while you were away")


def test_a_session_in_another_folder_than_its_launch_or_whose_folder_is_gone_is_warned_with_the_commands_that_fix_it():
    from journal.features.briefing.briefing_conduct import BriefingConduct
    from journal.features.briefing.support.briefing_data import BriefingData
    from journal.features.tasks.support.tasks_data import TasksData
    tasks = TasksData(current_task=0, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=())
    briefing = lambda **fields: FeatureData({"tasks": tasks, "briefing": BriefingData(is_overview_read=True, environment="development", peer_session_active_at="", rules="", rules_count=0, memories="", reminders="", waiting="", launch_folder="/projects/app", **fields)})
    lines = lambda answer: " ".join(nudge.rendered() for nudge in answer.nudges)
    elsewhere = Ready().respond(SessionStarted(agent=EVENT_AGENT, source="startup", folder="/projects/app/.claude/worktrees/development").with_data(briefing()), SettingsValue({}), (BriefingConduct,))
    assert has_nudge(lines(elsewhere), BriefingNudges.FOLDER_MISMATCH, folder="/projects/app/.claude/worktrees/development", env="development", launch_folder="/projects/app"), "a session in another folder is told, with the commands"
    at_home = Ready().respond(SessionStarted(agent=EVENT_AGENT, source="startup", folder="/projects/app/").with_data(briefing()), SettingsValue({}), (BriefingConduct,))
    assert not has_nudge(lines(at_home), BriefingNudges.FOLDER_MISMATCH), "the launch's own folder is no warning"
    gone = Ready().respond(Ticked(agent=EVENT_AGENT, silence_seconds=5.0, time=100.0).with_data(briefing(is_launch_folder_missing=True)), SettingsValue({"tasks.auto": False}), (BriefingConduct,))
    assert has_nudge(lines(gone), BriefingNudges.FOLDER_MISSING, launch_folder="/projects/app", env="development"), "a folder gone is told on the tick, since the session's hooks no longer run"
    assert not Ready().respond(Ticked(agent=EVENT_AGENT, silence_seconds=5.0, time=100.0).with_data(briefing()), SettingsValue({"tasks.auto": False}), (BriefingConduct,)).nudges, "a folder still there is no warning"






def test_the_orchestrator_hears_a_workers_failed_run_in_one_short_line_and_once_when_it_keeps_failing():
    from journal.features.workers.support.test_run_result import TestRunResult
    from journal.features.workers.workers_conduct import WorkersConduct
    from journal.features.workers.workers_options import WorkersOptions
    budget = SettingsValue({WorkersOptions.FAILING_RUNS.key: 3, WorkersOptions.TEST_RUN_LINES.key: True})
    worker = Worker(id=3, environment_id=1, name="Lady Lovelace, keeper of the parser", dispatcher="s1")

    # a run as the turn hands it back, ended with the runner's exit line, kept on the worker; what the orchestrator, session s1, hears of it
    def ran(text: str, status: int, settings=budget, session: str = "s1") -> list[str]:
        nonlocal worker
        result = TestRunResult.printed(f"{text}\n__journal_exit {status}", None)
        before = len(worker.events)
        worker = worker.passed_run() if result.is_passed() else worker.failed_run(result.failed, 1.0)
        told = []
        for event in worker.events[before:]:
            told += [n.rendered() for n in Ready().respond(event.reaching(session).with_data(FeatureData({})), settings, (WorkersConduct,)).nudges]
        return told

    assert ran("12 passed in 3.1s", 0) == [], "a passed run is never told"
    failed = ran("tests/test_parser.py F..\n2 failed, 10 passed in 3.4s", 1)
    assert failed == [WorkersNudges.TEST_RUN_FAILED.create(n=3, failed=2).rendered()], failed
    assert len(failed[0]) <= 120, "one short line"
    assert worker.failing_runs == 1, "the count is kept on the worker"
    assert ran("1 failed, 11 passed in 3s", 1) == [WorkersNudges.TEST_RUN_FAILED.create(n=3, failed=1).rendered()]
    third = ran("1 error in 2s", 1)
    assert third[0] == WorkersNudges.TEST_RUN_FAILED.create(n=3, failed=1).rendered()
    assert has_nudge(third[1], WorkersNudges.WORKER_KEEPS_FAILING, n=3, runs=3), "told once on the third failure in a row"
    assert ran("Traceback (most recent call last)", 1) == [WorkersNudges.TEST_RUN_FAILED.create(n=3, failed=1).rendered()], "not again on the fourth, and a run that names no count failed one"
    assert ran("12 passed in 3s", 0) == [] and worker.failing_runs == 0, "a passed run starts the count again"
    for _ in range(2):
        ran("1 failed", 1)
    assert has_nudge(ran("1 failed", 1)[1], WorkersNudges.WORKER_KEEPS_FAILING, n=3, runs=3), "and the notice comes again after the reset"
    quiet = SettingsValue({WorkersOptions.FAILING_RUNS.key: 3, WorkersOptions.TEST_RUN_LINES.key: False})
    assert ran("12 passed", 0, quiet) == [] and ran("1 failed", 1, quiet) == [], "with the line off a failed run is not told"
    assert ran("1 failed", 1, quiet) == []
    notice = ran("1 failed", 1, quiet)
    assert len(notice) == 1 and has_nudge(notice[0], WorkersNudges.WORKER_KEEPS_FAILING, n=3, runs=3), "the notice still comes"
    assert ran("1 failed", 1, session="w9") == [], "only the agent that sent the worker hears of it"


def test_the_orchestrators_load_is_measured_as_one_server_from_its_arrivals_and_clearings():
    from journal.features.workers.support.load_item import LoadItem
    from journal.features.workers.support.load_series import LoadSeries
    series, now = LoadSeries(window_minutes=30, half_life_minutes=10, busy_at=0.8, low_at=0.5), 100000.0
    # an item every 3 minutes, each cleared a minute and a half after it came: busy half the time
    steady = [LoadItem(f"workers:{n}", now - 3 * 3600 + n * 180, 1.0, now - 3 * 3600 + n * 180 + 90) for n in range(60)]
    load = series.measured(steady, [], now)
    assert abs(load.arrivals - 20) < 0.5 and abs(load.clearings - 40) < 0.5, "λ 20 an hour arrive, μ 40 an hour of busy time are cleared"
    assert abs(load.rho - 0.5) < 0.02 and abs(load.wait_minutes - 1.5) < 0.01, "ρ = λ/μ, the share of time busy, and W from arrival to clearing"
    assert abs(load.little - 0.5) < 0.02 and load.waiting == 0, "Little's law: λW is the 0.5 that waits on average, and nothing waits now"
    assert load.oldest_first == load.clearings_counted == 10, "each cleared the oldest that waited"
    # an item every minute, each waiting five: the orchestrator never idle, five waiting at a time
    flooded = [LoadItem(f"workers:{n}", now - 2 * 3600 + n * 60, 1.0, now - 2 * 3600 + n * 60 + 300) for n in range(118)]
    busy = series.measured(flooded, [], now)
    assert busy.rho > 0.95 and abs(busy.wait_minutes - 5) < 0.01 and abs(busy.little - 5) < 0.2, "saturated: ρ near 1 and λW near the five that wait"
    assert busy.busy_minutes >= 60 and busy.waiting_refs == ("workers:116", "workers:117") and busy.waiting_items == 2, "over 0.8 the whole stretch, and what waits now oldest first"
    # a user's message waits unanswered, weighted 3: dispatches made while the queue grows under a high load count against, one while calm counts for
    oldest = series.measured([*flooded, LoadItem("messages:553", now - 600, 3.0)], [], now)
    assert oldest.waiting_refs[0] == "messages:553" and oldest.waiting == 5.0, "the message is the oldest that waits, weighted 3"
    growing = series.measured([*flooded, LoadItem("messages:553", now - 200, 3.0)], [now - 120, now - 60], now)
    assert growing.busy_dispatches == 2 and growing.calm_dispatches == 0, "both dispatches made while the queue grew over 0.8"
    quiet = [LoadItem(f"workers:{n}", now - 3 * 3600 + n * 180, 1.0, now - 3 * 3600 + n * 180 + 30) for n in range(60)]
    calm = series.measured(quiet, [now - 300], now)
    assert calm.rho < 0.5 and calm.calm_dispatches == 1 and calm.busy_dispatches == 0, "a dispatch while the load is low counts for"


def test_a_workers_moves_are_the_items_its_queue_counts_and_an_idle_place_is_none():
    from types import SimpleNamespace
    from journal.features.workers.support.load_items import LoadItems
    from journal.models.support.worker_moves import WorkerMoves
    reader = LoadItems(None, None, None, SimpleNamespace(holder_task_ids=lambda ref: []), SimpleNamespace(decimal=lambda option: option.default), None)
    moves = WorkerMoves((("clocked in", 10.0), ("clocked out", 100.0), ("sent back", 160.0), ("clocked in", 170.0), ("clocked out", 400.0), ("merged", 460.0), ("sent a job", 470.0), (ENDED_UNFINISHED, 900.0), ("sent a job", 905.0), (ENDED_UNFINISHED, 950.0)))
    items = reader.worker_items(Worker(id=7, environment_id=1, name="w", moves=moves))
    assert [(item.arrived_at, item.weight, item.cleared_at, item.ended_at, item.is_repeat) for item in items] == [(100.0, 1.0, 0.0, 160.0, False), (400.0, 1.5, 460.0, 0.0, True), (950.0, 1.0, 0.0, 0.0, False)], "a clock-out ended without a clearing by its send-back, the repeat weighted 1.5 cleared by its merge, and the end without a clock-out still waiting"
    assert reader.worker_items(Worker(id=8, environment_id=1, name="w", moves=WorkerMoves((("reported", 50.0), ("sent a job", 80.0))))) == [], "an idle place is no item of the queue; its minutes are read apart"
    resent = WorkerMoves((("dispatched", 1.0), ("clocked in", 5.0), (ENDED_UNFINISHED, 60.0), ("sent a job", 61.0)))
    assert reader.worker_items(Worker(id=9, environment_id=1, name="w", moves=resent)) == [], "a worker's run ending without a clock-out, which the journal answers itself by asking it to clock out, leaves the main agent's load as it was; only a second such end, which the agent is told of, is its work"


def test_tasks_added_to_a_plan_leave_the_load_where_it_was(app: App):
    from journal.models.link import Link
    from journal.models.support.ref import Ref
    from journal.repositories.links import Links
    from journal.repositories.tasks import PLAN_LINK
    plans, tasks, links, actor = app.container.get(Plans), app.container.get(Tasks), app.container.get(Links), Actor.system()
    with app.container.get(Scope).environment(1):
        plan = plans.save(Plan(environment_id=1, title="p", state=PlanState.APPROVED), actor)
        before = tasks.unplanned_open_count()
        for number in range(10):
            task = tasks.save(Task(environment_id=1, title=f"t{number}"), actor)
            links.save(Link(source=Ref.build(task), target=Ref.build(plan), link_type=PLAN_LINK), actor)
        assert tasks.unplanned_open_count() == before, "ten tasks in a plan are no arrival"
        tasks.save(Task(environment_id=1, title="loose"), actor)
        assert tasks.unplanned_open_count() == before + 1


def test_each_work_mode_keeps_its_own_load_so_a_switch_neither_resets_nor_mixes_them():
    from journal.models.agent import Agent
    from journal.models.support.agent_load import AgentLoad
    agent = Agent(environment_id=1, session="s1", mode="builder", work_queue=AgentLoad(rho=0.4, measured_at=1.0))
    orchestrating = agent.mode_changed("orchestrator")
    assert orchestrating.work_queue == AgentLoad(), "a mode not yet measured starts with no figure"
    measured = orchestrating.with_(work_queue=AgentLoad(rho=0.9, measured_at=2.0))
    assert measured.mode_changed("builder").work_queue.rho == 0.4, "back in the builder's mode its own figure is there"
    assert measured.mode_changed("builder").mode_changed("orchestrator").work_queue.rho == 0.9 and measured.mode_changed("solo").work_queue == AgentLoad()


def test_a_place_opens_once_the_load_held_over_its_level_and_closes_once_it_held_under_with_each_dwell_honoured_and_each_change_named():
    from journal.features.workers.fitness_options import FitnessOptions
    from dataclasses import replace
    from journal.features.workers.support.place_scaling import PlaceScaling
    from journal.features.workers.workers_conduct import WorkersConduct
    from journal.models.support.agent_load import AgentLoad
    scaling, now = PlaceScaling(up_dwell_minutes=10, down_dwell_minutes=20, floor=2, ceiling=5), 10000.0
    high = AgentLoad(rho=0.92, busy_minutes=12, measured_at=now)
    assert scaling.opens(high, 3, now), "over 0.8 for 12 minutes: a place opens"
    assert not scaling.opens(replace(high, busy_minutes=6), 3, now), "not before the 10 minute dwell"
    assert not scaling.opens(high, 5, now), "never past the ceiling"
    opened = replace(high, scaled_at=now)
    assert not scaling.opens(replace(opened, busy_minutes=17), 4, now + 7 * 60), "a second opening waits the dwell again"
    assert scaling.opens(replace(opened, busy_minutes=22), 4, now + 10 * 60)
    low = AgentLoad(rho=0.3, low_minutes=25, measured_at=now)
    assert scaling.closes(low, 3, False, now), "under 0.5 for 25 minutes: a place closes"
    assert not scaling.closes(replace(low, low_minutes=15), 3, False, now), "not before the 20 minute dwell"
    assert not scaling.closes(low, 3, True, now), "never while a worker holds a task"
    assert not scaling.closes(replace(low, waiting=1.0), 3, False, now), "nor while anything waits"
    assert not scaling.closes(low, 2, False, now), "never under the floor"
    agent = Agent(id=1, environment_id=1, session="s1", work_queue=high).place_opened(4, now)
    event = agent.events[-1]
    assert agent.work_queue.scaled_at == now and (event.places, event.opened) == (4, True)
    heard = lambda session: [n.rendered() for n in Ready().respond(event.reaching(session).with_data(FeatureData({})), SettingsValue({FitnessOptions.WARNINGS.key: True}), (WorkersConduct,)).nudges]
    assert heard("s1") == [WorkersNudges.PLACE_OPENED.create(rho=0.92, minutes=12, places=4).rendered()], heard("s1")
    assert heard("w2") == [], "only the orchestrator hears its places change"
    closed = Agent(id=1, environment_id=1, session="s1", work_queue=low).place_closed(2, now).events[-1]
    assert [n.rendered() for n in Ready().respond(closed.reaching("s1").with_data(FeatureData({})), SettingsValue({FitnessOptions.WARNINGS.key: True}), (WorkersConduct,)).nudges] == [WorkersNudges.PLACE_CLOSED.create(rho=0.3, minutes=25, places=2).rendered()]


def test_the_orchestrator_is_asked_for_its_priorities_at_a_phase_start_and_after_the_interval_and_an_unblocking_task_queued_behind_others_is_named_at_once():
    from pathlib import Path
    from journal.events.rows.task_delegated import TaskDelegated
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.plans.support.started_plan import StartedPlan
    from journal.features.workers.support.workers_data import WorkersData
    from journal.features.workers.orchestrator_conduct import OrchestratorConduct, priorities_lines
    from journal.features.workers.states.orchestrating import Orchestrating
    settings = SettingsValue({WorkersOptions.MODE.key: "orchestrator", WorkersOptions.PRIORITIES_MINUTES.key: 45})
    planned = lambda **facts: FeatureData({"plans": PlansData((), StartedPlan(plan_id=5, next_task=8, started_task=7, started_task_briefing="", recent_tasks=(7,), remaining_tasks=3, checkpoint_pause=False, checkpoint_phase=0, testing="", **facts))})
    asked = lambda data, time, settings=settings: [n.rendered() for n in priorities_lines(Ticked(agent=EVENT_AGENT, silence_seconds=0.0, time=time).with_data(data), settings)]
    line = lambda phase: WorkersNudges.PRIORITIES.create(plan=5, phase=phase).rendered()
    assert asked(planned(current_phase=1), 100.0) == [line(1)], "a started plan with no priorities yet asks at once, at the start of its first phase"
    answered = planned(current_phase=1, priorities_phase=1, priorities_at=1000.0)
    assert asked(answered, 1000.0 + 44 * 60) == [], "once answered the line is quiet until the interval has passed"
    assert asked(answered, 1000.0 + 45 * 60) == [line(1)], "after the interval it asks again"
    assert asked(planned(current_phase=2, priorities_phase=1, priorities_at=1000.0), 1100.0) == [line(2)], "a new phase asks at once, without waiting for the interval"
    assert asked(answered, 1000.0 + 90 * 60, SettingsValue({WorkersOptions.MODE.key: "orchestrator", WorkersOptions.PRIORITIES_MINUTES.key: 0})) == [], "with no interval it asks only at a phase start"
    assert [state for state, conduct in WorkersFeature.mode_conduct if conduct is OrchestratorConduct] == [Orchestrating], "only the orchestrator is asked: its mode state alone brings the conduct that asks"
    assert asked(FeatureData({"plans": PlansData((), None)}), 100.0) == [], "and only with a plan started"
    queued = lambda queues: FeatureData({"workers": WorkersData(dispatched_workers=(), idle_workers=(), active_subagents=0, subagents=(), worktrees_root=Path("."), worktrees=(), queues=queues)})
    said = lambda event, data: [n.rendered() for n in Ready().respond(event.reaching("s1").with_data(data), settings, (OrchestratorConduct,)).nudges]
    unblocking = TaskDelegated(environment_id=1, time=1.0, task_id=9, title="Grant the journal the gh permission", brief="")
    assert said(unblocking, queued({3: (4, 5, 9)})) == [WorkersNudges.UNBLOCKER_QUEUED.create(task=9, place=3, n=3).rendered()], "a task that unblocks the orchestrator queued last is named at once"
    assert said(unblocking, queued({3: (9, 4)})) == [], "first in its queue it is not"
    assert said(replace(unblocking, title="The parser", brief="the parser needs read access to the grammar repository"), queued({3: (4, 9)})) != [], "the brief may say it"
    assert said(replace(unblocking, title="The parser"), queued({3: (4, 9)})) == [], "a task that says nothing of unblocking is not named"


def test_a_wait_written_in_words_is_told_to_be_a_block_and_blocked_work_that_stands_still_or_a_plan_with_no_dependencies_is_named():
    from journal.events.agent.tool_starting import ToolStarting
    from journal.features.plans.support.plan_status import PlanStatus
    from journal.features.plans.support.plans_data import PlansData
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.features.workers.orchestrator_conduct import unmoved_task_lines, unordered_lines, text_wait_check, text_wait_lines
    settings = SettingsValue({WorkersOptions.MODE.key: "orchestrator", WorkersOptions.STALLED_BLOCK_MINUTES.key: 60, WorkersOptions.BLOCKED_SHARE.key: 0.4, WorkersOptions.UNORDERED_PLAN_TASKS.key: 10})
    worded = lambda line, settings=settings: [n.rendered() for n in text_wait_check(Ready(), ToolStarting(agent=EVENT_AGENT, call=shell(line)), settings).nudges]
    block_line = WorkersNudges.WAIT_TEXT.rendered()
    assert worded("journal task log 5 'waiting for the API key from the user'") == [block_line], "a log line that says it waits is told to be a block"
    assert worded("journal message send 'task 7 waits on task 4 to merge'") == [block_line], "and a message"
    assert worded("journal task block 7 'waits on the lexer' --on task:4") == [], "a block with --on is the wait itself"
    assert worded("journal task log 5 'the parser reads every rule'") == [], "a log line with no wait in it is not"
    from journal.features.workers.feature import Workers
    from journal.features.workers.orchestrator_conduct import OrchestratorConduct
    from journal.features.workers.states.orchestrating import Orchestrating
    assert (Orchestrating, OrchestratorConduct) in Workers.mode_conduct, "only the orchestrator is told: the check is the Orchestrating state's conduct"
    assert [n.key for n in text_wait_lines("I am blocked on the deploy until it lands", settings)] == ["workers.make_the_wait_a_block"], "a reply that says it waits is told the same"
    tasks = lambda held, open_count=10: FeatureData({"tasks": TasksData(current_task=0, last_log_line="", blocked=tuple(held), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=(), open_count=open_count, last_moves=held)})
    held = lambda data, time: [n.rendered() for n in unmoved_task_lines(Ticked(agent=EVENT_AGENT, silence_seconds=0.0, time=time).with_data(data), settings)]
    still = lambda tasks: WorkersNudges.UNMOVED_TASKS.create(tasks=tasks).rendered()
    assert held(tasks({3: 1000.0, 5: 1200.0}), 1000.0 + 59 * 60) == [], "blocked work that moved within the hour is not named"
    assert held(tasks({3: 1000.0, 5: 1200.0}), 1200.0 + 60 * 60) == [still("3, 5")], "once both stood still for the set time they are named with their ids"
    assert held(tasks({3: 1000.0, 5: 1200.0}), 1000.0 + 60 * 60) == [still("3")], "only those that stood still"
    assert held(tasks({3: 1000.0, 5: 1200.0}, open_count=2), 1300.0) == [still("3, 5")], "past the set share of the tasks not done they are named at once"
    assert held(tasks({}), 1300.0) == [], "with nothing blocked nothing is said"
    planned = lambda total, done, blocked: FeatureData({"plans": PlansData((), None, started_plans=(PlanStatus(5, "release", 1, 2, done, total, total - done, 0.0, blocked),))})
    unordered = lambda data: [n.rendered() for n in unordered_lines(Ticked(agent=EVENT_AGENT, silence_seconds=0.0, time=1.0).with_data(data), settings)]
    assert unordered(planned(12, 2, 0)) == [WorkersNudges.UNLINKED_TASKS.create(plan=5, open=10).rendered()], "ten open tasks with none blocked asks which depend on which"
    assert unordered(planned(12, 2, 1)) == [], "one blocked on another shows the order was thought of"
    assert unordered(planned(12, 3, 0)) == [], "under ten open tasks nothing is asked"


def test_merged_work_is_scored_for_complexity_and_set_against_the_tier_of_the_model_it_ran_on():
    from journal.features.workers.support.work_complexity import WorkComplexity
    from journal.models.model_tier import ModelTier
    from journal.providers.claude import Claude
    small, large = WorkComplexity(20, 1, 0, 15, 10, 1, True), WorkComplexity(600, 12, 2, 200, 120, 5, True)
    assert small.points() < 4 <= 16 <= large.points() and (small.fitting_tier(), large.fitting_tier()) == (ModelTier.FAST, ModelTier.STRONGEST)
    assert [small.fit(tier).measured for tier in (ModelTier.FAST, ModelTier.GENERAL, ModelTier.STRONGEST)] == ["right", "too strong", "too strong"], "small work on a stronger model than it needs is too strong"
    assert [large.fit(tier).measured for tier in (ModelTier.FAST, ModelTier.GENERAL, ModelTier.STRONGEST)] == ["too weak", "too weak", "right"], "large work sent back again and again on a weaker model is too weak"
    assert WorkComplexity(600, 12, 0, 200, 120, 5, True).fit(ModelTier.GENERAL).measured == "right", "on a weaker model with no send-backs it did the work"
    assert WorkComplexity(0, 0, 0, 5, 1, 0, True).fit(ModelTier.STRONGEST).measured == "", "work with no edit recorded is not judged, so no line is drawn from it"
    assert WorkComplexity(20, 1, 0, 15, 10, 1, False).points() == small.points() + 1, "a brief that names no files makes the work harder"
    assert small.fit(ModelTier.UNKNOWN).measured == "" and [Claude().tier(model) for model in ("claude-haiku-5-5", "sonnet", "claude-opus-5-5", "fable")] == [ModelTier.FAST, ModelTier.GENERAL, ModelTier.STRONGEST, ModelTier.UNKNOWN]


def test_a_watched_progress_that_stands_still_past_twenty_seconds_is_noted_and_one_that_moves_is_not():
    from journal.features.shell.support.progress_stalls import ProgressStalls
    stalls = ProgressStalls()
    for second, fraction in ((0, 0.1), (5, 0.1), (10, 0.2), (15, 0.3)):
        stalls.seen(7, fraction, float(second))
    assert stalls.longest_seconds(7) == 5.0, "a progress that keeps moving stands still only between its steps"
    for second in range(15, 50, 5):
        stalls.seen(7, 0.3, float(second))
    assert stalls.longest_seconds(7) == 30.0, "one that sits at a figure while the run goes on is noted for how long it sat"
    stalls.seen(8, 0.0, 0.0)
    stalls.seen(8, 0.0, 60.0)
    assert stalls.longest_seconds(8) == 0.0, "a run that shows no figure at all is the missing-progress finding's, not this one's"


def test_every_git_or_github_command_and_every_search_is_given_no_reader_and_a_test_run_is():
    from journal.features.shell.support.activity_label import ActivityLabel
    from journal.features.shell.support.command_mark_policy import CommandMarkPolicy
    from journal.features.shell.support.git_commands import GitCommands
    policy = CommandMarkPolicy(None, ActivityLabel(CLASSIFIER, SHAPES), SHAPES, GitCommands(SHAPES))
    assert all(GitCommands.is_git(command) for command in ("git commit", "git push", "git rebase", "gh run watch", "gh")), "every git and GitHub command"
    assert not any(GitCommands.is_git(command) for command in ("github-sync", "pytest", "ghostscript")), "and nothing else"
    assert GitCommands(SHAPES).is_git_line("git add -A && git commit -m x && git push") and not GitCommands(SHAPES).is_git_line("pytest -q && git push"), "a line is git when every part is"
    assert all(policy.takes_no_reader(command) for command in ("grep", "rg", "find", "git push", "gh pr view")), "a search and a git or GitHub command get no reader"
    assert not any(policy.takes_no_reader(command) for command in ("pytest", "npm run build", "python3 scripts/suite.py")), "a test run and a build do"


def test_the_builder_may_dispatch_queue_and_send_subagents_only_as_its_menu_allows_and_its_line_budget_is_gone_on_purpose():
    from pathlib import Path
    from journal.features.workers.support.workers_data import WorkersData
    from journal.features.workers.builder_conduct import BuilderConduct
    from journal.features.workers.workers_options import WorkersOptions
    def event(line, lines=0):
        from journal.support.command_part import CommandPart
        call = ToolCall.decoded("Bash", {"command": line}, Claude().operation("Bash", {"command": line}), (CommandPart(line, True, False, (), False, ""),))
        return ToolStarting(agent=EVENT_AGENT, call=call).with_data(FeatureData({"workers": WorkersData((), (), 0, (), Path("/w"), ())}))
    allowed = {WorkersOptions.BUILDER_DISPATCH_ALLOWED.key: True, WorkersOptions.BUILDER_QUEUE_ALLOWED.key: True, WorkersOptions.BUILDER_SUBAGENTS_ALLOWED.key: True, WorkersOptions.SOLO_SUBAGENTS_ALLOWED.key: True}
    builder = SettingsValue({**allowed, WorkersOptions.MODE.key: "builder"})
    capability_check = lambda state, tool, settings: BuilderConduct.on_tool_starting(state, tool, settings)
    assert capability_check(Ready(), event("journal worker dispatch 1"), builder).refusal is None
    off = SettingsValue({**allowed, WorkersOptions.MODE.key: "builder", WorkersOptions.BUILDER_DISPATCH_ALLOWED.key: False, WorkersOptions.BUILDER_QUEUE_ALLOWED.key: False})
    assert "may not dispatch a worker" in capability_check(Ready(), event("journal worker dispatch 1"), off).refusal.rendered()
    assert "may not queue a worker's next task" in capability_check(Ready(), event("journal worker queue 1 2"), off).refusal.rendered()


def test_the_review_queue_gets_its_first_reviewer_itself_and_the_orchestrator_adds_the_others_up_to_the_most():
    from types import SimpleNamespace
    from journal.features.reviewing.commands.reviewer_command import ReviewerCommand
    from journal.features.reviewing.support.review_queue import ReviewQueue
    from journal.support.rejection import Rejection
    added = []
    dispatch = SimpleNamespace(added=lambda environment_id: added.append(environment_id) or SimpleNamespace(id=len(added)))
    queue = lambda waiting, idle, out: ReviewQueue(SimpleNamespace(queued_reviews=lambda: list(range(waiting))), SimpleNamespace(idle=lambda: list(idle), active=lambda: list(out)), None, None, None, dispatch, None, TimeSource())
    assert len(queue(3, [], []).free_reviewers(1)) == 1, "a queue with no reviewer gets its first"
    assert queue(3, [], ["a"]).free_reviewers(1) == [], "and never a second by itself"
    command = lambda out: ReviewerCommand(SimpleNamespace(active=lambda: list(out)), SimpleNamespace(queued_reviews=lambda: []), dispatch, SimpleNamespace(assigned=lambda environment_id: None), SimpleNamespace(is_enabled=lambda: True), SimpleNamespace(id=1), SimpleNamespace(integer=lambda option: 2))
    assert command(["a"]).add(None, None) == 0, "the orchestrator adds a second"
    try:
        command(["a", "b"]).add(None, None)
    except Rejection as refusal:
        assert "workers.reviewers_most" in str(refusal)
    else:
        raise AssertionError("a third past the most is refused")


def test_a_verdict_wanted_past_the_most_verifiers_waits_for_one_to_come_free():
    from types import SimpleNamespace
    from journal.features.verification.support.verifier_dispatch import VerifierDispatch
    from journal.models.verifier import Verifier
    sent = []
    verifiers = SimpleNamespace(idle=lambda: [v for v in rows if v.state == "judged"], working=lambda: rows)
    rows: list = []
    runner = SimpleNamespace(start=lambda verifier, resume: sent.append((verifier.brief, resume)) or verifier)
    dispatch = VerifierDispatch(verifiers, None, runner, SimpleNamespace(default=lambda: SimpleNamespace(name="claude")), None, SimpleNamespace(integer=lambda option: 1))
    dispatch.judging = lambda verifier, target, resume: (rows.append(verifier), runner.start(verifier, resume))[1]
    target = SimpleNamespace(environment_id=1)
    first = dispatch.dispatched_with(target, "one", "sonnet", lambda: True)
    assert first is not None and dispatch.dispatched_with(target, "two", "sonnet", lambda: True) is None and len(dispatch.waiting) == 1, "past the most the verdict waits"
    rows[0] = rows[0].judged()
    dispatch.released()
    assert dispatch.waiting == [] and [brief for brief, _ in sent] == ["one", "two"], "once one is free the waiting verdict goes to it"


def test_the_merger_runs_one_turn_at_a_time_in_the_order_they_were_asked_for():
    import threading
    import time as timing
    from journal.support.merger import Merger
    from journal.support.classification_table import ClassificationTable
    from journal.support.command_classifier import CommandClassifier
    classify = CLASSIFIER.classify
    merger, spans, lock = Merger(), [], threading.Lock()
    def merge(name: str) -> None:
        with merger.turn():
            began = timing.monotonic()
            timing.sleep(0.05)
            with lock:
                spans.append((name, began, timing.monotonic()))
    threads = []
    for name in ("first", "second", "third"):
        threads.append(threading.Thread(target=merge, args=(name,)))
        threads[-1].start()
        timing.sleep(0.01)
    for thread in threads:
        thread.join(5)
    assert [name for name, _, _ in spans] == ["first", "second", "third"], "turns are served in the order asked for"
    assert all(spans[i][2] <= spans[i + 1][1] for i in range(len(spans) - 1)), "no two turns overlap"
    assert merger.queued() == 0
    assert all(classify(command).changes_version_control for command in ("git merge feature", "git -C x pull", "git commit -qm x")), "a command that writes the branch goes through the merger"
    assert not any(classify(command).changes_version_control for command in ("git status", "git log -3", "ls")), "a read of git does not wait"



def test_a_model_outside_the_allowed_ones_of_its_role_is_moved_to_the_nearest_allowed_and_the_line_says_so():
    from types import SimpleNamespace
    from journal.features.workers.support.allowed_models import AllowedModels
    from journal.providers.providers import Providers
    from journal.providers.provider import Provider
    lines = ["claude journal-medior: sonnet, opus", "claude reviewer: sonnet", "claude verifier: haiku, opus", "codex journal-medior: gpt-5.6-sol, gpt-6-astra"]
    allowed = AllowedModels(SimpleNamespace(texts=lambda option: tuple(lines)), Providers())
    assert allowed.clamped("claude", "journal-medior", "sonnet") == ("sonnet", ""), "an allowed model is left alone"
    moved, said = allowed.clamped("claude", "journal-medior", "haiku")
    assert moved == "sonnet" and "haiku is not allowed for journal-medior on claude" in said and "moved to sonnet" in said, "under the minimum it goes up to it"
    assert allowed.clamped("claude", "reviewer", "opus")[0] == "sonnet", "over the maximum it comes down to it"
    assert allowed.clamped("claude", "verifier", "sonnet")[0] == "opus", "between two as near, the stronger"
    assert allowed.clamped("claude", "journal-medior", "claude-haiku-5-5")[0] == "claude-sonnet-5-5", "a full model name keeps all but its tier"
    assert allowed.clamped("claude", "some-worker-profile", "haiku")[0] == "sonnet", "a role with no line takes journal-medior's"
    assert allowed.clamped("codex", "journal-medior", "gpt-6-luna")[0] == "gpt-5.6-sol" and allowed.clamped("codex", "journal-medior", "gpt-6.1-sol")[0] == "gpt-6-astra", "Codex is held to the same from its own list"
    assert allowed.clamped("claude", "journal-medior", "some-unranked-model") == ("some-unranked-model", ""), "a model not on the provider's list is not judged"
    assert allowed.strongest("claude", "verifier") == "opus" and allowed.strongest("claude", "reviewer") == "sonnet"




def test_the_nudge_words_the_rule_judges_tests_by_are_the_registrys_own(app: App):
    """The list nudge-words-in-test reads from .commandments/custom/lists.json is written from the registry: a nudge added or reworded is written in with PYTHONPATH=src python3 -m scripts.nudge_words."""
    from journal.engine.nudge_registry import NudgeRegistry
    from scripts.nudge_words import LISTS, words
    assert json.loads(LISTS.read_text())["nudge_words"] == words(app.container.get(NudgeRegistry).all()), "the list holds the fixed words of every registered nudge, and no others"

HELPER_CONDUCTS = {
    "worker": ["DemandConduct", "SafetyConduct", "TaskEditConduct", "WorkerMemoryConduct"],
    "reviewer": ["DemandConduct", "SafetyConduct"],
    "verifier": ["DemandConduct", "SafetyConduct"],
    "subagent": ["DemandConduct", "SafetyConduct"],
}
HELPER_FLOORS = {"worker": "Void", "reviewer": "Reviewing", "verifier": "Verifying", "subagent": "Researching"}
HELPER_VERBS = {
    "worker": ["await begin", "await clear", "build queued", "clock-in record", "clock-out record", "doc create", "doc show", "doc update", "memory add", "memory list", "memory remove", "memory skip", "memory weigh", "output list", "output read", "output status", "output watch", "proof record", "reader list", "report create", "report show", "rule list", "rule read", "search find", "stuck declare", "task log", "task show", "tests turn", "todo add", "todo check", "todo list", "worker notify", "worker peers", "worker report", "worker send"],
    "reviewer": ["doc show", "memory list", "output read", "report show", "review record", "rule list", "rule read", "search find", "task show"],
    "verifier": ["verdict give", "verdict model"],
    "subagent": ["doc create", "doc ready", "doc show", "doc update", "message list", "message recent", "output read", "plan add", "plan brief", "plan create", "plan phase", "plan ready", "plan show", "plan todos", "report create", "report ready", "report show", "report update", "rule list", "rule read", "search find", "task list", "task show"],
}
HELPER_LISTENERS = {
    "worker": ["CompactionMarkClear", "ContextThresholdCheck", "HookAnswer", "MemoryFading", "PluginAgentRelay", "RecordEdit", "ResearcherEnd", "ResearcherStart", "ResearchersClosed", "SubagentMessageRecord", "SubagentTurnRecord", "WorkerTurnRecord"],
    "reviewer": ["HookAnswer", "PluginAgentRelay", "ResearcherEnd", "ResearcherStart", "ResearchersClosed", "ReviewerTestFailed", "ReviewerTestPassed"],
    "verifier": ["HookAnswer", "PluginAgentRelay", "ResearcherEnd", "ResearcherStart", "ResearchersClosed"],
    "subagent": ["HookAnswer", "PluginAgentRelay", "ResearcherEnd", "ResearcherStart", "ResearchersClosed", "SubagentTurnRecord"],
}


def test_each_helpers_file_alone_says_what_reaches_it_and_a_wrong_file_stops_the_boot(app: App):
    """What each helper role gets, conducts, floor, the verbs it runs and the listeners its hooks reach, is exactly what its file allows; a change to a set is made here on purpose."""
    from journal.events.agent.agent_event import AgentEvent
    from journal.events.bus import Bus
    from journal.features.helper_files_invalid import HelperFilesInvalid
    from journal.features.registry import Registry
    from journal.features.workers.listeners.fitness_record import FitnessRecord
    from journal.helpers.helpers import Helpers
    from journal.helpers.worker_helper import WorkerHelper
    from journal.support.agent_role import AgentRole
    from journal.repositories.setting_rows import SettingRows
    registry, roles = app.container.get(Registry), AgentRole.helpers()
    assert {role.value: sorted(conduct.__name__ for conduct in registry.conducts(role)) for role in roles} == HELPER_CONDUCTS
    assert {role.value: state.__name__ for role, state in registry.floors().items()} == HELPER_FLOORS
    listeners = {listener.registered_class() for type_name in StateMachine.event_kinds(AgentEvent) for listener in app.container.get(Bus).listeners(type_name)}
    reached = {role.value: sorted({listener.__name__ for listener in listeners if registry.reaches_helper(listener, role)}) for role in roles}
    assert reached == HELPER_LISTENERS, reached
    console = app.container.get(Console)
    verbs = {role.value: sorted(f"{noun} {verb}" for noun, command in console.table(role).items() for verb in console.verbs(command) if registry.runs_verb(type(command), verb, role)) for role in roles}
    assert verbs == HELPER_VERBS, verbs
    assert not registry.reaches_helper(FitnessRecord, AgentRole.WORKER), "a listener no helper's file names, such as the main agent's fitness record, reaches no helper"
    settings = app.container.get(SettingRows)
    with pytest.raises(HelperFilesInvalid, match="the helper role worker has 0 files"):
        Registry(registry.features, settings, (), tuple(helper for helper in Helpers.ALL if helper is not WorkerHelper))
    with pytest.raises(HelperFilesInvalid, match="the helper role worker has 2 files"):
        Registry(registry.features, settings, (), (*Helpers.ALL, type("SecondWorker", (WorkerHelper,), {})))
    from journal.features.edits.listeners.record_edit import RecordEdit
    redundant = type("RedundantWorker", (WorkerHelper,), {"listeners": (*WorkerHelper.listeners, RecordEdit)})
    with pytest.raises(HelperFilesInvalid, match="RedundantWorker names RecordEdit alone, but a feature in its features already gives it to the worker"):
        Registry(registry.features, settings, (), (*(helper for helper in Helpers.ALL if helper is not WorkerHelper), redundant))


def test_every_piece_is_known_by_the_one_feature_that_registers_it_or_by_the_engine(app: App):
    import pytest
    from journal.engine.hook_answer import HookAnswer
    from journal.engine.safety_conduct import SafetyConduct
    from journal.features.double_registration import DoubleRegistration
    from journal.features.feature import Feature
    from journal.features.registry import ENGINE, Registry
    from journal.repositories.setting_rows import SettingRows
    registry = app.container.get(Registry)
    assert all(registry.owning_feature(registered) == feature.name for feature in registry.features for registered in Registry.registered_classes(feature)), "each registered listener, conduct, command, state and job is known by its feature"
    assert {registry.owning_feature(registered) for registered in (HookAnswer, SafetyConduct, *registry.standard_commands)} == {ENGINE}, "the engine's own pieces belong to no feature"
    shared = type("SharedListener", (), {})
    first = type("First", (Feature,), {"name": "first", "listeners": (shared,)})
    second = type("Second", (Feature,), {"name": "second", "listeners": (shared,)})
    with pytest.raises(DoubleRegistration, match="SharedListener is registered by the features first and second"):
        Registry((first, second), app.container.get(SettingRows))




def test_an_agents_line_series_are_kept_by_time_and_read_by_window():
    hour = 3600.0
    agent = Agent(session="s1")
    for minutes, lines in ((0, 10), (50, 20), (100, 30), (170, 40)):
        agent = agent.lines_edited(lines, minutes * 60, minutes * 60 - 3 * hour)
    assert agent.edited_total(170 * 60, hour) == 40 and agent.edited_total(170 * 60, 2 * hour) == 70, "a 60-minute window holds the last pair, a 120-minute one the last two"
    later = agent.lines_edited(5, 200 * 60, 200 * 60 - 3 * hour)
    assert [time for time, _ in later.edited_lines] == [50 * 60, 100 * 60, 170 * 60, 200 * 60], "a pair older than three hours is dropped at the next write"
    committed = agent.lines_committed("abc", 12, 60.0, 0.0).lines_committed("def", 8, 120.0, 0.0)
    assert committed.committed_total(120.0, hour) == 20 and committed.is_sha_counted("abc") and not committed.is_sha_counted("xyz")
    assert agent.first_reported(7, 60.0, 0.0).first_reported(8, 4000.0, 0.0).first_report_count(4000.0, hour) == 1


def test_old_line_pairs_keyed_by_tool_use_are_cleared(connection):
    from journal.db.migrations.timed_line_series import TimedLineSeries
    connection.execute("INSERT INTO agents (environment_id, session, role, state, data, stack, edited_lines, merged_lines, created_at, creator) VALUES (1, 'old', 'main', 'idle', '{}', '[]', ?, ?, '2026-10-26', 'system')", (json.dumps([[12, 40], [30, 5]]), json.dumps([[20, 80]])))
    TimedLineSeries().apply(connection)
    row = connection.all("SELECT edited_lines, merged_lines FROM agents WHERE session = 'old'")[0]
    assert (json.loads(row["edited_lines"]), json.loads(row["merged_lines"])) == ([], []), "pairs keyed by a tool use's number mean nothing as times"




def test_each_modes_band_moves_with_hysteresis_holds_five_minutes_and_leaves_high_on_an_empty_queue():
    from journal.features.workers.support.band_rule import BandRule
    from journal.models.support.pressure_band import PressureBand
    orchestrator, builder = BandRule(0.8, 0.65, 0.5, 0.6, 300, 300), BandRule(0.5, 0.4, 0.3, 0.35, 300, 300)
    high, normal, low = PressureBand.HIGH, PressureBand.NORMAL, PressureBand.LOW
    assert [orchestrator.moved(normal, rho, 600, 0) for rho in (0.79, 0.8, 0.49)] == [normal, high, low], "the orchestrator enters high at 0.8 and low under 0.5"
    assert [orchestrator.moved(high, rho, 600, 0) for rho in (0.66, 0.64)] == [high, normal] and [orchestrator.moved(low, rho, 600, 0) for rho in (0.59, 0.6)] == [low, normal], "and leaves high under 0.65 and low at 0.6"
    assert [builder.moved(normal, rho, 600, 0) for rho in (0.5, 0.29)] == [high, low] and [builder.moved(high, 0.39, 600, 0), builder.moved(low, 0.35, 600, 0)] == [normal, normal], "the builder's band sits on its ceiling of 0.5"
    assert orchestrator.moved(normal, 0.95, 120, 0) == normal, "a band is held five minutes before it changes"
    assert orchestrator.moved(high, 0.95, 60, 300) == normal and orchestrator.moved(high, 0.95, 60, 200) == high, "high is left once the worker queue has stood empty five minutes, held or not"
    assert orchestrator.moved(normal, 0.95, 600, 400) == normal, "high is never entered on a queue empty past the five minutes, however high the smoothed load"


def test_load_held_high_ends_the_minute_nothing_waits_though_the_smoothed_load_is_still_high():
    from journal.features.workers.support.load_item import LoadItem
    from journal.features.workers.support.load_series import LoadSeries
    series = LoadSeries(window_minutes=30, half_life_minutes=10, busy_at=0.8, low_at=0.5)
    items = [LoadItem(ref=f"workers:{n}", arrived_at=n * 60.0, weight=1.0) for n in range(20)]
    waiting = series.measured(items, [], 1800.0)
    cleared = series.measured([item.cleared(1800.0) for item in items], [], 1860.0)
    assert waiting.rho >= 0.8 and waiting.busy_minutes > 0, waiting
    assert cleared.rho >= 0.8 and cleared.busy_minutes == 0.0, "an empty queue ends load held high within one tick, while the smoothed load is still over the line"


def test_a_measure_turns_failing_and_passing_once_each_at_its_levels_a_stretch_is_not_smoothed_and_nothing_to_measure_stays_unmeasured():
    from journal.features.workers.support.closeness import Closeness
    from journal.features.workers.support.measure_range import MeasureRange
    from journal.features.workers.support.measure_source import MeasureSource
    from journal.features.workers.support.measure_spec import MeasureSpec
    from journal.features.workers.support.mode_measures import HIGH_QUEUE, ModeMeasures
    from journal.models.support.measure_state import MeasureState
    share = MeasureSpec("own_code_share", MeasureRange(0.5, 0.6), MeasureSource.code_share, Closeness.share, 4)
    state, changes = MeasureState("own_code_share"), []
    for minute, value in enumerate((0.7, 0.55, 0.49, 0.45, 0.55, 0.59, 0.6, 0.65, 0.52)):
        moved = ModeMeasures.stepped(share, state, value, minute * 60.0)
        if moved.is_failing != state.is_failing:
            changes.append((value, moved.is_failing, moved.changed_at))
        state = moved
    assert changes == [(0.49, True, 120.0), (0.6, False, 360.0)], "failing under 0.5, passing again only at 0.6, once each"
    held = ModeMeasures.stepped(HIGH_QUEUE, ModeMeasures.stepped(HIGH_QUEUE, MeasureState("high_queue_minutes"), 30.0, 0.0), 0.0, 60.0)
    assert held.value == 0.0 and not held.is_failing, "a stretch is taken as it is, never smoothed"
    smoothed = MeasureSpec("idle_places", MeasureRange(5.0, 4.0), MeasureSource.idle_place_minutes, Closeness.minutes, 3, smoothing_minutes=15.0)
    assert 0 < ModeMeasures.stepped(smoothed, ModeMeasures.stepped(smoothed, MeasureState("idle_places"), 10.0, 0.0), 0.0, 60.0).value < 10.0, "idle minutes are smoothed"
    empty = ModeMeasures.stepped(share, state, None, 600.0)
    assert not empty.is_measured and not empty.is_failing, "nothing to measure is unmeasured, never perfect"


def test_the_score_weighs_the_measured_states_and_waits_for_the_warmup():
    from journal.features.workers.support.mode_measures import HIGH_QUEUE, ORCHESTRATOR_SPECS, SCORE_VERSION, ModeMeasures
    from journal.models.support.measure_state import MeasureState
    from journal.models.support.measure_states import MeasureStates
    states = (MeasureState("high_queue_minutes", 35.0, is_measured=True, is_failing=True, measured_at=1800.0), MeasureState("clearing_wait", 2.0, is_measured=True, measured_at=1800.0), MeasureState("delegation", measured_at=1800.0))
    specs = (replace(HIGH_QUEUE, weight=6), *ORCHESTRATOR_SPECS)
    scored = ModeMeasures.scored(MeasureStates("orchestrator", 0.0, states), specs, 1800.0)
    assert scored.is_measured and scored.score == 67 and scored.version == SCORE_VERSION, "held high 35 minutes counts half at weight 6, a short wait whole at weight 3, and the unmeasured delegation is left out"
    assert dict(scored.parts) == {"high_queue_minutes": 50, "clearing_wait": 100}
    assert not ModeMeasures.scored(MeasureStates("orchestrator", 600.0, states), specs, 1800.0).is_measured, "no score until the mode has been measured for the warm-up"






def test_a_failing_measure_says_its_line_and_says_it_again_only_after_its_nudge_repeat(app: App):
    from journal.engine.nudger import Nudger
    from journal.features.workers.fitness_options import FitnessOptions
    from journal.features.workers.support.workers_data import WorkersData
    from journal.features.workers.workers_conduct import measure_check
    from journal.models.support.agent_load import AgentLoad
    from journal.models.support.measure_state import MeasureState
    from journal.models.support.measure_states import MeasureStates
    from journal.models.support.pressure_band import PressureBand
    from journal.support.time_source import TimeSource
    failing = MeasureStates("orchestrator", 0.0, (MeasureState("high_queue_minutes", 14.0, is_measured=True, is_failing=True, changed_at=400.0, measured_at=1000.0),))
    workers = WorkersData((), (), 0, (), Path("/w"), (), workload=AgentLoad(rho=0.9, waiting_refs=("workers:12",), waiting_items=1, measured_at=1000.0), measures=failing, band=PressureBand.HIGH)
    event = ToolStarting(agent=EVENT_AGENT, call=ToolCall(tool="Read", input={}, operation=Claude().operation("Read", {}))).with_data(FeatureData({"workers": workers}))
    lines = measure_check(Ready(), event, SettingsValue({FitnessOptions.EDIT_WAIT_MINUTES.key: 15, FitnessOptions.WARNINGS.key: True})).nudges
    assert [line.rendered() for line in lines] == [WorkersNudges.ORCHESTRATOR_QUEUE_LINE.create(minutes=14, n=12).rendered()], [line.rendered() for line in lines]
    assert measure_check(Ready(), event, SettingsValue({FitnessOptions.WARNINGS.key: False})).nudges == (), "with the warnings off no measure line is said"
    with app.container.get(Scope).environment(1):
        agent = app.container.get(Agents).save(Agent(environment_id=1, session="s1", provider="claude"), Actor.system())
    nudger, clock = app.container.get(Nudger), app.container.get(TimeSource)
    sent = []
    for second in (1000.0, 1060.0, 1301.0):
        clock.pin(second)
        sent.append(nudger.deliver(agent, lines[0]) is not None)
    clock.unpin()
    assert sent == [True, False, True], "said, held back within its five-minute repeat, and said again after it"


def test_no_band_of_a_mode_holds_two_measure_lines_that_push_opposite_ways():
    from journal.features.workers.support.handout_direction import HandoutDirection
    from journal.features.workers.support.line_bands import LineBands
    from journal.models.support.pressure_band import PressureBand
    for mode in ("builder", "orchestrator", "solo"):
        for band in PressureBand:
            directions = {row.direction for row in LineBands.ROWS if row.mode == mode and band in row.bands}
            assert not {HandoutDirection.INCREASE, HandoutDirection.DECREASE} <= directions, (mode, band)
    assert LineBands.is_allowed("orchestrator", "workers.orchestrator_clear_oldest", PressureBand.HIGH) and not LineBands.is_allowed("orchestrator", "workers.orchestrator_clear_oldest", PressureBand.NORMAL)
    assert ("workers.orchestrator_hand_out", "workers.orchestrator_clear_oldest") in LineBands.opposed_pairs()


def test_a_held_high_worker_queue_opens_a_place_at_the_dwell_and_says_its_line_five_minutes_later(app: App):
    from journal.features.workers.support.load_item import LoadItem
    from journal.features.workers.support.load_series import LoadSeries
    from journal.features.workers.support.mode_measures import ModeMeasures
    from journal.features.workers.support.place_scaling import PlaceScaling
    from journal.models.support.measure_state import MeasureState
    def minutes() -> tuple[int, int, int]:
        spec = app.container.get(ModeMeasures).specs("orchestrator")[0]
        dwell = app.container.get(SettingRows).decimal(WorkersOptions.PLACE_OPENING_MINUTES)
        series, scaling = LoadSeries(30, 10, 0.8, 0.5), PlaceScaling(dwell, 30, 1, 8)
        items = [LoadItem(ref=f"workers:{n}", arrived_at=n * 60.0, weight=1.0) for n in range(40)]
        state, held, opened, failing = MeasureState(spec.key), None, None, None
        for minute in range(40):
            queue = series.measured(items, [], minute * 60.0)
            held = held if held is not None or not queue.busy_minutes else minute - queue.busy_minutes
            state = ModeMeasures.stepped(spec, state, queue.busy_minutes, minute * 60.0)
            opened = opened if opened is not None or not scaling.opens(queue, 1, minute * 60.0) else minute
            failing = failing if failing is not None or not state.is_failing else minute
        return held, opened - held, failing - held
    assert minutes()[1:] == (10, 16), "the place opens ten minutes into the worker queue held high with an item waiting, and the clear line only once fifteen have passed"
    app.container.get(SettingRows).set(WorkersOptions.PLACE_OPENING_MINUTES.key, 20, Actor.user(1))
    assert minutes()[1:] == (20, 26), "a longer dwell moves both"


def test_each_builder_measure_reads_its_series_and_the_builder_that_writes_scores_above_the_one_that_hands_out(app: App):
    from journal.features.workers.support.active_worker_measure import ActiveWorkerMeasure
    from journal.features.workers.support.free_place_measure import FreePlaceMeasure
    from journal.features.workers.support.measure_source import MeasureSource
    from journal.features.workers.support.mode_measures import ModeMeasures
    from journal.models.agent import Agent
    from journal.models.support.measure_state import MeasureState
    from journal.models.support.measure_states import MeasureStates
    from journal.features.workers.support.active_worker_measure import RETURN_MOVES
    from journal.models.support.worker_moves import WorkerMoves
    from journal.models.worker import JOB_STARTS, Worker
    from journal.repositories.tasks import Tasks
    source = lambda agent: MeasureSource(agent, 10000.0, app.container.get(FreePlaceMeasure), app.container.get(ActiveWorkerMeasure), app.container.get(Tasks))
    writer = Agent(environment_id=1, session="s1", committed_lines=((9000.0, 30),), edited_lines=((9500.0, 30),), merged_lines=((8000.0, 20),))
    assert source(writer).code_share() == 0.75, "committed and provisional lines of its own over its own and merged, the last hour"
    assert source(Agent(environment_id=1, session="s1", committed_lines=((9000.0, 20),), merged_lines=((9000.0, 10),))).code_share() is None, "under forty lines there is nothing to measure"
    assert source(Agent(environment_id=1, session="s1", committed_lines=((5000.0, 300),), merged_lines=((9000.0, 40),))).code_share() == 0.0, "lines older than the hour leave the share"
    moves = WorkerMoves((("dispatched", 100.0), ("clocked out", 400.0), ("sent back", 500.0), ("clocked out", 700.0), ("merged", 900.0), ("sent a job", 1000.0)))
    assert moves.spans(JOB_STARTS, RETURN_MOVES, 1200.0) == [(100.0, 900.0), (1000.0, 1200.0)], "a worker is active from its dispatch through its send-back until its merge, and again from its next job"
    with app.container.get(Scope).environment(1):
        specs = app.container.get(ModeMeasures).specs("builder")
    state = lambda key, value: MeasureState(key, value, is_measured=True, measured_at=3600.0)
    writing = MeasureStates("builder", 0.0, (state("own_code_share", 0.8), state("high_queue_minutes", 0.0), state("active_workers", 0.5), state("completion_rate", 2.0)))
    handing = MeasureStates("builder", 0.0, (state("own_code_share", 0.2), state("high_queue_minutes", 0.0), state("active_workers", 3.0), state("completion_rate", 2.0)))
    assert ModeMeasures.scored(writing, specs, 1800.0).score > ModeMeasures.scored(handing, specs, 1800.0).score, "a builder that writes scores above one with three workers out at once"
    assert "completion_rate" not in dict(ModeMeasures.scored(writing, specs, 1800.0).parts), "the tasks completed an hour are shown, never scored"


def test_each_builder_measure_line_speaks_where_its_measure_fails_in_its_bands_and_nowhere_else():
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.features.workers.fitness_options import FitnessOptions
    from journal.features.workers.support.workers_data import WorkersData
    from journal.features.workers.workers_conduct import measure_check
    from journal.models.support.agent_load import AgentLoad
    from journal.models.support.measure_state import MeasureState
    from journal.models.support.measure_states import MeasureStates
    from journal.models.support.pressure_band import PressureBand
    from journal.models.worker import Worker
    settings = SettingsValue({FitnessOptions.EDIT_WAIT_MINUTES.key: 15, FitnessOptions.WARNINGS.key: True})
    def said(failing: str, value: float, band: PressureBand, current_task: int = 7, refs=("messages:4", "workers:12"), delivered=(Worker(environment_id=1, id=5),), command: str = "ls") -> list[str]:
        measures = MeasureStates("builder", 0.0, (MeasureState(failing, value, is_measured=True, is_failing=True, measured_at=1000.0),))
        workers = WorkersData((), (), 0, (), Path("/w"), (), workload=AgentLoad(rho=0.9, waiting_refs=refs, waiting_items=len(refs), measured_at=1000.0), measures=measures, band=band, delivered_workers=delivered)
        tasks = TasksData(current_task=current_task, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=())
        event = ToolStarting(agent=EVENT_AGENT, call=shell(command)).with_data(FeatureData({"workers": workers, "tasks": tasks}))
        return [line.rendered() for line in measure_check(Ready(), event, settings).nudges]
    assert said("own_code_share", 0.3, PressureBand.NORMAL) == [WorkersNudges.BUILDER_CODE_SHARE_LINE.create(share=0.3, n=7).rendered()]
    assert said("own_code_share", 0.3, PressureBand.LOW) != [] and said("own_code_share", 0.3, PressureBand.HIGH) == [], "it speaks in low and normal, never in high"
    assert said("own_code_share", 0.3, PressureBand.NORMAL, current_task=0) == [], "with no task to write it is silent"
    assert said("high_queue_minutes", 14.0, PressureBand.HIGH) == [WorkersNudges.BUILDER_QUEUE_LINE.create(minutes=14, n=12).rendered()], "the oldest worker item, never a message"
    assert said("high_queue_minutes", 14.0, PressureBand.NORMAL) == [] and said("high_queue_minutes", 14.0, PressureBand.HIGH, refs=("messages:4",)) == [], "only in high, and silent with no worker item waiting"
    dispatch = "journal worker dispatch 'Ada' --task 3"
    assert said("active_workers", 3.2, PressureBand.NORMAL, command=dispatch) == [WorkersNudges.BUILDER_WORKER_LINE.create(count=3.2, n=5).rendered()]
    assert said("active_workers", 3.2, PressureBand.HIGH, command="journal worker queue 2 9") != [], "on a queue too, in every band"
    assert said("active_workers", 3.2, PressureBand.NORMAL) == [] and said("active_workers", 3.2, PressureBand.NORMAL, delivered=(), command=dispatch) == [], "only on a dispatch or a queue, and silent with no worker waiting to be checked"


def test_each_orchestrator_measure_reads_its_series_and_the_delegating_orchestrator_scores_above_the_one_that_writes(app: App):
    from journal.features.workers.support.active_worker_measure import ActiveWorkerMeasure
    from journal.features.workers.support.free_place_measure import FreePlaceMeasure
    from journal.features.workers.support.load_item import LoadItem
    from journal.features.workers.support.load_series import LoadSeries
    from journal.features.workers.support.measure_source import MeasureSource
    from journal.features.workers.support.mode_measures import ModeMeasures
    from journal.models.agent import Agent
    from journal.models.support.measure_state import MeasureState
    from journal.models.support.measure_states import MeasureStates
    from journal.repositories.tasks import Tasks
    source = lambda agent: MeasureSource(agent, 10000.0, app.container.get(FreePlaceMeasure), app.container.get(ActiveWorkerMeasure), app.container.get(Tasks))
    series = LoadSeries(30, 10, 0.8, 0.5)
    items = [LoadItem(ref="workers:3", arrived_at=9400.0, weight=1.0), LoadItem(ref="workers:4", arrived_at=9700.0, weight=1.0)]
    waiting = Agent(environment_id=1, session="s1", work_queue=series.measured(items, [], 10000.0))
    assert source(waiting).clearing_wait() == 10.0, "the age of the oldest worker item waiting"
    cleared = Agent(environment_id=1, session="s1", work_queue=series.measured([items[0].cleared(10000.0), items[1]], [], 10060.0))
    assert source(cleared).clearing_wait() == 6.0, "clearing the oldest brings the next one's age at the next measure"
    delegating = Agent(environment_id=1, session="s1", committed_lines=((9000.0, 10),), merged_lines=((9200.0, 60), (9500.0, 30)), first_reports=((9000.0, 1),))
    assert source(delegating).delegation() == 0.1 and source(delegating).report_share() == 0.5, "its own lines among all landed, and first reports per merged task"
    assert source(Agent(environment_id=1, session="s1", committed_lines=((9000.0, 10),), merged_lines=((9500.0, 90),))).delegation() is None, "under two merges in the hour delegation is not measured"
    assert source(Agent(environment_id=1, session="s1")).report_share() is None, "with no merge there are no reports per task to measure"
    with app.container.get(Scope).environment(1):
        specs = app.container.get(ModeMeasures).specs("orchestrator")
    state = lambda key, value: MeasureState(key, value, is_measured=True, measured_at=3600.0)
    common = (state("high_queue_minutes", 0.0), state("clearing_wait", 2.0), state("idle_places", 1.0), state("report_share", 0.3))
    handing = MeasureStates("orchestrator", 0.0, (*common, state("delegation", 0.1)))
    writing = MeasureStates("orchestrator", 0.0, (*common, state("delegation", 0.9)))
    assert ModeMeasures.scored(handing, specs, 1800.0).score > ModeMeasures.scored(writing, specs, 1800.0).score, "an orchestrator that delegates scores above one that writes the work itself"


def test_each_orchestrator_measure_line_speaks_where_its_measure_fails_in_its_bands_and_nowhere_else():
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.features.workers.fitness_options import FitnessOptions
    from journal.features.workers.support.workers_data import WorkersData
    from journal.features.workers.workers_conduct import measure_check
    from journal.models.open_task import OpenTask
    from journal.models.support.agent_load import AgentLoad
    from journal.models.support.measure_state import MeasureState
    from journal.models.support.measure_states import MeasureStates
    from journal.models.support.pressure_band import PressureBand
    from journal.models.worker import Worker
    settings = SettingsValue({FitnessOptions.EDIT_WAIT_MINUTES.key: 15, FitnessOptions.WARNINGS.key: True, WorkersOptions.WORKER_LIMIT.key: 3})
    task = OpenTask(id=9, title="Fix the cart", brief="", plan_id=0)
    def said(failing: tuple[str, ...], value: float, band: PressureBand, refs=("messages:4", "workers:12"), idle=(), out=(Worker(environment_id=1, id=6),), next_open=task, open_count: int = 3, command: str = "ls") -> list[str]:
        measures = MeasureStates("orchestrator", 0.0, tuple(MeasureState(key, value, is_measured=True, is_failing=True, measured_at=1000.0) for key in failing))
        workers = WorkersData(tuple(out), tuple(idle), 0, (), Path("/w"), (), workload=AgentLoad(rho=0.9, waiting_refs=refs, waiting_items=len(refs), measured_at=1000.0), measures=measures, band=band)
        tasks = TasksData(current_task=0, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=next_open, last_commands=(), open_count=open_count, open_work=next_open)
        return [line.rendered() for line in measure_check(Ready(), ToolStarting(agent=EVENT_AGENT, call=shell(command)).with_data(FeatureData({"workers": workers, "tasks": tasks})), settings).nudges]
    assert said(("high_queue_minutes",), 16.0, PressureBand.HIGH) == [WorkersNudges.ORCHESTRATOR_QUEUE_LINE.create(minutes=16, n=12).rendered()]
    assert said(("high_queue_minutes",), 16.0, PressureBand.NORMAL) == [] and said(("high_queue_minutes",), 16.0, PressureBand.HIGH, refs=("messages:4",)) == [], "high only, and silent with no worker item waiting"
    assert said(("clearing_wait",), 9.0, PressureBand.NORMAL) == [WorkersNudges.ORCHESTRATOR_WAIT_LINE.create(n=12, minutes=9).rendered()]
    assert said(("clearing_wait",), 9.0, PressureBand.LOW) == [] and said(("clearing_wait",), 9.0, PressureBand.HIGH, refs=()) == [], "normal and high only, silent with no worker waiting"
    assert said(("delegation", "idle_places"), 0.6, PressureBand.LOW, idle=(Worker(environment_id=1, id=3),)) == [WorkersNudges.ORCHESTRATOR_HANDOUT_LINE.create(handout="queue task 9 to worker 3").rendered()], "one line for both measures, to an idle worker first"
    assert said(("delegation",), 0.6, PressureBand.NORMAL) == [WorkersNudges.ORCHESTRATOR_HANDOUT_LINE.create(handout="dispatch a worker on task 9").rendered()], "else to a new worker while a place is free"
    assert said(("delegation",), 0.6, PressureBand.HIGH) == [] and said(("delegation",), 0.6, PressureBand.NORMAL, next_open=None) == [], "never in high, and silent with no task to hand out"
    full = tuple(Worker(environment_id=1, id=n) for n in (6, 7, 8))
    assert said(("idle_places",), 7.0, PressureBand.NORMAL, out=full) == [], "silent with no free place and no idle worker"
    assert said(("report_share",), 0.5, PressureBand.HIGH) == [WorkersNudges.ORCHESTRATOR_REPORT_LINE.create(tasks=2.0, n=6).rendered()], "in every band"
    assert said(("report_share",), 0.5, PressureBand.NORMAL, out=()) == [] and said(("report_share",), 0.5, PressureBand.NORMAL, open_count=1) == [], "silent with no worker out or under two open tasks"
    dispatch = "journal worker dispatch 'Ada' --task 9"
    assert said((), 0.0, PressureBand.HIGH, command=dispatch) == [WorkersNudges.ORCHESTRATOR_DISPATCH_LINE.create(n=12).rendered()], "a line on a dispatch in high, never a refusal"
    assert said((), 0.0, PressureBand.NORMAL, command=dispatch) == [] and said((), 0.0, PressureBand.HIGH, command="journal worker queue 6 9") == [], "only on a dispatch, only in high"


def test_the_orchestrator_share_columns_are_dropped_from_a_database_that_holds_them(connection):
    from journal.db.migrations.orchestrator_share_columns_drop import DROPPED_COLUMNS, OrchestratorShareColumnsDrop
    for column in DROPPED_COLUMNS:
        connection.execute(f"ALTER TABLE agents ADD COLUMN {column} TEXT")
    connection.execute("INSERT INTO agents (environment_id, session, role, state, data, stack, created_at, creator, reuse_uses) VALUES (1, 's1', 'main', 'idle', '{}', '[]', '2026-10-26', 'system', '[3, 4]')")
    OrchestratorShareColumnsDrop().apply(connection)
    OrchestratorShareColumnsDrop().apply(connection)
    columns = {row["name"] for row in connection.all("PRAGMA table_info(agents)")}
    assert not columns & set(DROPPED_COLUMNS) and connection.all("SELECT session FROM agents")[0]["session"] == "s1", "the columns go, the row stays, and a second run finds nothing to drop"


def test_every_mode_is_scored_on_how_long_its_oldest_message_waits_and_solo_on_that_alone():
    from journal.features.workers.support.load_item import LoadItem
    from journal.features.workers.support.load_series import LoadSeries
    from journal.features.workers.support.measure_source import MeasureSource
    from journal.features.workers.support.mode_measures import COMPLETION_RATE, MESSAGE_WAIT, ModeMeasures
    from journal.models.agent import Agent
    from journal.models.support.measure_state import MeasureState
    from journal.models.support.measure_states import MeasureStates
    queue = LoadSeries(30, 10, 0.8, 0.5).measured([LoadItem(ref="messages:553", arrived_at=9280.0, weight=3.0)], [], 10000.0)
    assert MeasureSource(Agent(environment_id=1, session="s1", message_queue=queue), 10000.0, None, None, None).message_wait_minutes() == 12.0, "a message unanswered for twelve minutes"
    state = ModeMeasures.stepped(MESSAGE_WAIT, MeasureState("message_wait"), 12.0, 10000.0)
    scored = ModeMeasures.scored(MeasureStates("solo", 0.0, (state, MeasureState("completion_rate", 4.0, is_measured=True, measured_at=10000.0))), (MESSAGE_WAIT, COMPLETION_RATE), 1800.0)
    assert state.is_failing and scored.score == 72 and dict(scored.parts) == {"message_wait": 72}, "twelve minutes is off its five, scored on the minutes kind, and the tasks closed are shown only"


def test_the_tool_use_columns_are_dropped_from_a_database_that_holds_them(connection):
    from journal.db.migrations.tool_use_columns_drop import DROPPED_COLUMNS, ToolUseColumnsDrop
    for column in DROPPED_COLUMNS:
        connection.execute(f"ALTER TABLE agents ADD COLUMN {column} TEXT")
    kind_columns(connection)
    connection.execute("INSERT INTO agents (environment_id, session, role, state, data, stack, created_at, creator, handover_uses) VALUES (1, 's1', 'main', 'idle', '{}', '[]', '2026-10-26', 'system', '[3]')")
    connection.execute("INSERT INTO entries (environment_id, kind, actor, data, created_at, creator) VALUES (1, 'workload_level', 'system', '{}', '2026-10-26', 'system')")
    ToolUseColumnsDrop().apply(connection)
    ToolUseColumnsDrop().apply(connection)
    columns = {row["name"] for row in connection.all("PRAGMA table_info(agents)")}
    assert not columns & set(DROPPED_COLUMNS) and connection.all("SELECT session FROM agents")[0]["session"] == "s1", "the columns go and the row stays"
    assert not connection.all("SELECT id FROM entries WHERE kind = 'workload_level'"), "and the load level entries go"


def test_the_settings_rows_of_removed_options_are_deleted_and_the_settings_read_cleanly_before_and_after(app: App):
    from journal.db.connection import Connection
    from journal.db.migrations.removed_settings_drop import REMOVED_KEYS, RemovedSettingsDrop
    connection = app.container.get(Connection)
    for key in REMOVED_KEYS[:3]:
        connection.execute("INSERT INTO settings (environment_id, key, value, created_at, creator) VALUES (0, ?, '5', '2026-10-26', 'system')", (key,))
    settings = app.container.get(SettingRows)
    settings.clear_cache()
    assert settings.tree() is not None, "the settings read with stale rows in place"
    RemovedSettingsDrop().apply(connection)
    assert not connection.all("SELECT key FROM settings WHERE key = ?", (REMOVED_KEYS[0],)), "the stale rows are gone"
    settings.clear_cache()
    assert settings.tree() is not None, "and the settings read cleanly after"


def test_a_stored_developer_features_value_moves_to_the_slow_requests_switch_and_is_read_there(app: App):
    from journal.db.connection import Connection
    from journal.db.migrations.developer_switch_rename import DeveloperSwitchRename
    connection = app.container.get(Connection)
    connection.execute("INSERT INTO settings (environment_id, key, value, created_at, creator) VALUES (0, 'faults.developer', 'true', '2026-10-26', 'system')")
    DeveloperSwitchRename().apply(connection)
    assert not connection.all("SELECT key FROM settings WHERE key = 'faults.developer'"), "the old key is gone"
    assert [(row["environment_id"], row["value"]) for row in connection.all("SELECT environment_id, value FROM settings WHERE key = 'features.faults'")] == [(0, "true")], "and its value is held by the feature's switch"


def test_a_change_of_mode_starts_the_measures_fresh_so_no_line_of_the_old_mode_is_said_and_old_merges_are_not_counted(app: App):
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.features.workers.fitness_options import FitnessOptions
    from journal.features.workers.support.mode_measures import ModeMeasures
    from journal.features.workers.support.workers_data import WorkersData
    from journal.features.workers.workers_conduct import measure_check
    from journal.models.agent import Agent
    from journal.models.support.measure_state import MeasureState
    from journal.models.support.measure_states import MeasureStates
    from journal.models.support.pressure_band import PressureBand
    failing = MeasureStates("builder", 0.0, (MeasureState("own_code_share", 0.2, is_measured=True, is_failing=True, measured_at=9000.0),))
    agent = Agent(environment_id=1, session="s1", committed_lines=((9000.0, 10),), merged_lines=((9100.0, 60), (9200.0, 60)), measures=failing, band=PressureBand.HIGH)
    with app.container.get(Scope).environment(1):
        fresh = app.container.get(ModeMeasures).worked(agent, "orchestrator", 10000.0)
        later = app.container.get(ModeMeasures).worked(agent.measures_worked(fresh), "orchestrator", 10600.0)
    assert fresh.mode == "orchestrator" and fresh.started_at == 10000.0 and not fresh.failing_keys(), "the new mode's measures start fresh, none failing"
    assert not later.state("delegation").is_measured, "the merges taken in before the switch are not counted for the new mode"
    workers = WorkersData((), (), 0, (), Path("/w"), (), measures=fresh, band=PressureBand.NORMAL)
    tasks = TasksData(current_task=7, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=())
    event = ToolStarting(agent=EVENT_AGENT, call=shell("ls")).with_data(FeatureData({"workers": workers, "tasks": tasks}))
    assert measure_check(Ready(), event, SettingsValue({FitnessOptions.WARNINGS.key: True})).nudges == (), "no line of the old mode is said after the switch"


def test_a_worker_queue_failing_past_its_block_minutes_blocks_writes_until_the_oldest_is_cleared_and_never_its_own_remedy():
    from journal.features.workers.fitness_options import FitnessOptions
    from journal.features.workers.support.workers_data import WorkersData
    from journal.features.workers.workers_conduct import measure_check
    from journal.models.support.agent_load import AgentLoad
    from journal.models.support.measure_state import MeasureState
    from journal.models.support.measure_states import MeasureStates
    from journal.models.support.pressure_band import PressureBand
    on = SettingsValue({FitnessOptions.WARNINGS.key: True, FitnessOptions.EDIT_WAIT_MINUTES.key: 15})
    edit = Claude().call("Edit", {"file_path": "/w/a.py", "old_string": "x", "new_string": "y"}, frozenset(), CLASSIFIER)
    def answer(call, failing: bool = True, time: float = 1000.0, settings=on):
        state = MeasureState("high_queue_minutes", 20.0, is_measured=True, is_failing=failing, changed_at=0.0, measured_at=time)
        workers = WorkersData((), (), 0, (), Path("/w"), (), workload=AgentLoad(rho=0.9, waiting_refs=("workers:12",), waiting_items=1, measured_at=time), measures=MeasureStates("orchestrator", 0.0, (state,)), band=PressureBand.HIGH)
        return measure_check(Ready(), ToolStarting(agent=EVENT_AGENT, call=call, time=time).with_data(FeatureData({"workers": workers})), settings)
    assert answer(edit).refusal.rendered() == WorkersNudges.ORCHESTRATOR_QUEUE_LINE.create(minutes=20, n=12).rendered(), "past fifteen minutes failing, a write waits with the line as its remedy"
    assert answer(edit, time=600.0).refusal is None, "within the block minutes the line is said, the write goes through"
    assert answer(shell("journal worker merge 12")).refusal is None and answer(shell("cat src/a.py")).refusal is None, "the merge it names and every read go through"
    assert answer(edit, failing=False).refusal is None, "once the queue is clear the next write goes through"
    assert answer(edit, settings=SettingsValue({FitnessOptions.WARNINGS.key: False})).refusal is None, "with the fitness warnings off nothing is blocked"




def test_stored_helper_stacks_move_onto_void(connection):
    from journal.db.migrations.void_helper_floors import VoidHelperFloors
    rows = [
        ("worker", "working", '{"task_id": 7}', json.dumps([{"state": "duty", "data": {}}, {"state": "working", "data": {"task_id": 7, "logged_at": 1.0}}])),
        ("worker", "duty", "{}", "[]"),
        ("reviewer", "reviewing", "{}", json.dumps([{"state": "reviewing", "data": {}}])),
        ("main", "duty", "{}", json.dumps([{"state": "duty", "data": {}}])),
    ]
    for role, state, data, stack in rows:
        connection.execute("INSERT INTO agents (environment_id, session, role, state, data, stack, created_at, creator) VALUES (1, ?, ?, ?, ?, ?, '2026-10-26', 'system')", (f"s-{role}-{state}", role, state, data, stack))
    VoidHelperFloors().apply(connection)
    stacks = [[layer["state"] for layer in json.loads(row["stack"])] for row in connection.all("SELECT stack FROM agents ORDER BY id")]
    assert stacks == [["void", "working_task"], ["void"], ["void", "reviewing"], ["idle"]], stacks
    assert json.loads(connection.all("SELECT stack FROM agents ORDER BY id")[0]["stack"])[1]["data"] == {"task_id": 7}, "the worker keeps the task it worked on"


def test_a_helper_is_put_to_work_on_each_path_and_the_engine_imports_no_feature_to_do_it(app: App):
    from pathlib import Path
    from journal.support.agent_role import AgentRole
    from journal.models.support.ref import Ref
    from journal.models.task import Task
    from journal.models.worker import Worker
    from journal.models.worker_state import WorkerState
    from journal.repositories.tasks import Tasks
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    scope, workers, tasks, agents = app.container.get(Scope), app.container.get(Workers), app.container.get(Tasks), app.container.get(Agents)
    top = lambda session: agents.session_agent(session).stack[-1]["state"]
    with scope.environment(1):
        early = workers.save(Worker(environment_id=1, name="Mr. Early", brief="e", session="we"), Actor.system())
        tasks.handover(tasks.save(Task(environment_id=1, title="the parser", brief="b"), Actor.system()), Ref.build(early), Actor.system())
        workers.save(workers.find(early.id).ready(1.0), Actor.worker(early.id))
        app.container.get(SessionAgents).worker_agent("we", 1, "claude")
    assert top("we") == "working_task", "a worker that clocked in before its session had a row is put to work when the row is made"
    with scope.environment(1):
        workers.save(workers.find(early.id).delivered(2.0), Actor.worker(early.id))
    assert top("we") == "void", "its delivery returns it to Void"
    with scope.environment(1):
        workers.save(workers.find(early.id).with_(state=WorkerState.DISPATCHED), Actor.system())
        workers.save(workers.find(early.id).ready(3.0), Actor.worker(early.id))
    assert top("we") == "working_task", "a worker sent back and clocked in again is put to work again"
    engine = Path(__file__).resolve().parents[1] / "src" / "journal" / "engine"
    assert not [path.name for path in engine.rglob("*.py") if "journal.features" in path.read_text()], "the engine imports no feature to put a helper to work"


@dataclass(frozen=True)
class Beneath(BaseState):
    name = "beneath_probe"
    count: int = 0

    def on_pause(self, settings: SettingsValue) -> tuple[Nudge, ...]:
        return (Nudge("engine", "paused", "paused"),)

    def on_resume(self, data: FeatureData, settings: SettingsValue) -> tuple[Nudge, ...]:
        return (Nudge("engine", "resumed", "resumed"),)


@dataclass(frozen=True)
class Above(BaseState):
    name = "above_probe"
    count: int = 0

    def on_enter(self, typist: Typist) -> None:
        typist.pause()

    def on_exit(self, typist: Typist) -> None:
        typist.resume()

    def on_push(self, settings: SettingsValue) -> tuple[Nudge, ...]:
        return (Nudge("engine", "pushed", "pushed"),)

    def on_pop(self, settings: SettingsValue) -> tuple[Nudge, ...]:
        return (Nudge("engine", "popped", "popped"),)


def test_every_lifecycle_handler_runs_when_the_same_event_also_updates_the_state_it_moves_from(app: App):
    from journal.support.agent_role import AgentRole
    machine, settings, data = app.container.get(StateMachine), SettingsValue({}), FeatureData(())
    keys = lambda answer: [nudge.key for nudge in answer.nudges]
    plain_push = machine.answer_moves(Stack((Beneath(),)), Beneath().push(Above()), AgentRole.MAIN, settings, data)
    assert keys(plain_push) == ["engine.paused", "engine.pushed"]
    updated_push = machine.answer_moves(Stack((Beneath(),)), Beneath(count=1).push(Above()), AgentRole.MAIN, settings, data)
    assert keys(updated_push) == ["engine.paused", "engine.pushed"], "a push in the event that also updates the state beneath still pauses it and pushes"
    assert updated_push.stack.states == (Beneath(count=1), Above()), "and keeps the update"
    plain_pop = machine.answer_moves(Stack((Beneath(), Above())), Above().pop(), AgentRole.MAIN, settings, data)
    assert keys(plain_pop) == ["engine.popped", "engine.resumed"]
    updated_pop = machine.answer_moves(Stack((Beneath(), Above())), Above(count=1).pop(), AgentRole.MAIN, settings, data)
    assert keys(updated_pop) == ["engine.popped", "engine.resumed"], "a pop in the event that also updates the state it leaves still pops it and resumes the one beneath"
    entering, leaving = Typist(), Typist()
    updated_push.stack.replace(Stack((Beneath(),)), entering)
    updated_pop.stack.replace(Stack((Beneath(), Above())), leaving)
    assert (entering.moves, leaving.moves) == (["pause"], ["resume"]), "on_enter and on_exit run on the stack a combined move leaves"






def test_every_row_event_names_the_feature_it_belongs_to(app: App):
    from journal.events.rows.row_event import RowEvent
    from journal.events.rows.task_closed import TaskClosed
    from journal.events.rows.worker_delivered import WorkerDelivered
    from journal.features.registry import ENGINE, Registry
    registry = app.container.get(Registry)
    unknown = [type_name.__name__ for type_name in StateMachine.event_kinds(RowEvent) if type_name is not RowEvent and type_name.feature_name != ENGINE and not registry.has_feature(type_name.feature_name)]
    assert not unknown, f"row events naming no feature the registry knows: {unknown}"
    assert (TaskClosed.feature_name, WorkerDelivered.feature_name) == ("tasks", "workers"), "a row event names its own feature, a worker's delivery the workers feature though it resolves a wait"




HELPER_SWEEP_EVENTS = ("a write", "a stop with a task open", "a message of the user's", "a plan started", "a task edited")


def test_a_helper_reset_or_swapped_keeps_void_and_its_job(app: App):
    from journal.engine.states.void import Void
    from journal.features.workers.states.working_task import WorkingTask
    machine = app.container.get(StateMachine)
    assert [state.name for state in Void().reset_states((Void(), WorkingTask(task_id=1), Void()))] == ["void", "working_task"], "a reset helper keeps Void and its job, and loses what was over it"
    swapped = machine.placed(Stack((Void(), WorkingTask(task_id=1))), Void())
    assert [type(state) for state in swapped.states] == [Void], "a swap on a helper keeps Void at the bottom, never idle"
    assert [state.name for state in machine.placed(Stack((Void(),)), WorkingTask(task_id=1)).states] == ["void", "working_task"]


def test_a_time_span_is_never_read_as_a_total_and_one_slow_stretch_in_a_run_that_counts_regularly_is_no_finding():
    from types import SimpleNamespace
    from journal.features.shell.support.count_forms import CountForms
    from journal.features.shell.support.progress_stalls import ProgressStalls
    from journal.features.shell.support.reader_judge import ReaderJudge
    watched = ["Refreshing run status every 20 seconds. Press Ctrl+C to quit.", "✓ main CI · 18822", "JOBS", "✓ test in 2m3s", "✓ build in 1m10s"]
    assert CountForms.form(watched) is None, "gh run watch names its refresh interval, never a total"
    assert CountForms.form(["collected 40 items", "tests/a.py .", "tests/b.py ."]) is not None, "a total of items is still read"
    stalls = ProgressStalls()
    for step, fraction in enumerate((63 / 252, 126 / 252, 189 / 252, 200 / 252, 220 / 252, 240 / 252)):
        stalls.seen(4, fraction, step * 5.0)
    stalls.seen(4, 240 / 252, 25.0 + 39.0)
    judge = ReaderJudge(None, None, stalls, None, None, None, None, None, None, None, None, SHAPES)
    assert judge.stalled_progress(SimpleNamespace(row_id=4)) == [], "a phpunit run that printed its count every 63 tests and sat 39 seconds over slow tests once is no finding"
    lonely = ProgressStalls()
    lonely.seen(5, 0.1, 0.0)
    lonely.seen(5, 0.1, 40.0)
    assert ReaderJudge(None, None, lonely, None, None, None, None, None, None, None, None, SHAPES).stalled_progress(SimpleNamespace(row_id=5)), "a run whose count stood still from its first figure is still a finding"




def test_a_stop_with_a_started_plan_and_no_task_in_hand_names_no_log_after_ten_edits():
    from journal.features.plans.states.following_plan import FollowingPlan
    from journal.features.tasks.tasks_options import TasksOptions
    settings = SettingsValue({TasksOptions.LOG_LIMIT.key: 50, TasksOptions.FIRST_DELAY.key: 5, TasksOptions.LOG_AGE_LIMIT.key: 10, TasksOptions.TASK_REMINDER_INTERVAL.key: 99})
    state = FollowingPlan(plan_id=1045, approved=True)
    for n in range(10):
        write = ToolCall(tool="Write", input={"file_path": f"notes{n}.md", "content": "x"}, operation=Claude().operation("Write", {"file_path": f"notes{n}.md", "content": "x"}))
        state = state.respond(ToolStarting(agent=EVENT_AGENT, call=write, time=100.0 + n), settings).target
    assert state.edits == 0, "an edit with no task in hand is not counted toward a log"
    stopped = state.respond(Stop(agent=EVENT_AGENT, time=1000.0), settings)
    assert stopped.refusal is None and not any("log" in nudge.rendered() for nudge in stopped.nudges), "a stop with no task in hand names no log"
    held = FollowingPlan(plan_id=1045, approved=True, task_id=7, edits=10).respond(Stop(agent=EVENT_AGENT, time=1000.0), settings)
    assert held.refusal is not None and "log it first" in held.refusal.rendered(), "with a task in hand the stop still asks for a log"



def test_the_time_source_reads_its_seconds_and_its_moment_as_the_same_time():
    from journal.support.time_source import TimeSource
    source = TimeSource()
    source.pin(1800000000.0000007)
    assert source.seconds() == source.moment().timestamp(), "a moment past half a microsecond reads the same as seconds and as a moment, so an age worked from both is never a hair short"
    source.unpin()
    now = source.seconds()
    assert now == datetime.fromtimestamp(now, timezone.utc).timestamp(), "the wall clock is read to the microsecond too"


def test_an_agent_left_stopped_has_its_stop_check_run_again_after_the_set_minutes():
    from journal.features.plans.states.plans_working import PlansWorking
    from journal.features.tasks.support.tasks_data import TasksData
    from journal.features.tasks.tasks_conduct import TasksConduct
    from journal.features.plans.support.plans_data import PlansData
    from journal.events.agent.stop import Stop
    from journal.events.agent.ticked import Ticked
    settings = SettingsValue({TasksOptions.AUTO.key: True, TasksOptions.WAKE_MINUTES.key: 10, TasksOptions.WAKE_COUNT.key: 3})
    tasks = TasksData(current_task=7, last_log_line="", blocked=(), blocked_without_wait=(), blocked_without_wait_summary="", broken_waits=(), broken_waits_summary="", next_open=None, last_commands=())
    tick = lambda silence, **facts: PlansWorking(task_id=7, logged_at=0.0, active_at=0.0).respond(Ticked(agent=EVENT_AGENT, session="s1", environment_id=1, silence_seconds=silence, time=silence).with_data(FeatureData({"tasks": replace(tasks, **facts), "plans": PlansData((), None)})), settings, (TasksConduct,))
    woken = tick(600.0, turn_finished=True)
    assert isinstance(woken.next_event, Stop) and "tasks.woken_with_work_in_hand" in [n.key for n in woken.nudges], "ten quiet minutes after a turn ended run the stop check again, its listeners deciding what is said"
    assert tick(300.0, turn_finished=True).next_event is None, "not before the set minutes"
    assert tick(600.0, turn_finished=False).next_event is None, "an agent still in its turn, as in a long tool call, is never woken"
    assert tick(600.0, turn_finished=True, wake_count=3).next_event is None, "and it is woken at most the set number of times in a row"


def test_a_listener_named_in_both_lists_of_a_feature_stops_the_boot(app: App):
    from journal.events.blocking import Blocking
    from journal.features.double_registration import DoubleRegistration
    from journal.features.registry import Registry
    from journal.features.skills.feature import Skills
    from journal.features.skills.listeners.skill_obligation import SkillObligation
    from journal.repositories.setting_rows import SettingRows
    twice = type("TwiceListed", (Skills,), {"name": "twice", "answer_listeners": ((SkillObligation, Blocking.NEXT_DECISION),), "listeners": (SkillObligation,)})
    with pytest.raises(DoubleRegistration):
        Registry((twice,), app.container.get(SettingRows))


def test_no_listener_that_runs_before_the_answer_writes_a_card_for_the_viewer(app: App):
    import inspect
    import re
    from journal.features.registry import Registry
    card_write = re.compile(r"\.(cards|processes|moments)\.(show|show_fields|show_recent|show_role_card)\(")
    writing = [listener.__name__ for feature in app.container.get(Registry).features for listener, _ in feature.answer_listeners if any(card_write.search(inspect.getsource(cls)) for cls in listener.__mro__ if cls.__module__.startswith("journal."))]
    assert writing == [], f"these listeners run before the answer and write a card, which only the viewer shows: {writing}"


def test_work_queued_inside_an_origin_reads_that_origins_actor_and_role_after_the_queue_drains(app: App):
    scope, queue, read = app.container.get(Scope), app.container.get(ListenerQueue), []
    worker = Origin(environment=lambda: 1, actor=Actor.worker(7), role=AgentRole.WORKER, session="w-7")
    with scope.entered(worker):
        queue.add(lambda: read.append((scope.id, scope.actor, scope.role)))
    queue.drain()
    assert read == [(1, Actor.worker(7), AgentRole.WORKER)], "deferred work runs in the origin of the hook that queued it, not the worker thread's own"


class OriginReading(Listener[Created]):
    def __init__(self, scope: Scope, read: list) -> None:
        self.scope, self.read = scope, read

    def handle(self, event: Created) -> None:
        self.read.append((self.scope.actor, self.scope.role))


def test_a_command_runs_in_the_origin_of_its_caller(app: App):
    scope, read = app.container.get(Scope), []
    app.container.get(Bus).listen(Created, OriginReading(scope, read))
    app.console().run(["task", "create", "lay the floors"], USER)
    assert read and set(read) == {(USER.actor, USER.role)}, "every write a command makes runs in its caller's origin"


def test_a_stack_is_floored_and_reset_by_its_bottom_state():
    from journal.engine.states.void import Void
    from journal.features.tasks.states.ready import Ready
    from journal.features.workers.states.orchestrating import Orchestrating
    from journal.features.workers.states.working_task import WorkingTask
    void, working = Void(), WorkingTask(task_id=1)
    assert void.floored(Orchestrating) is void, "a helper's floor is never turned into a mode state"
    assert type(Ready().floored(Orchestrating)) is Orchestrating, "a main floor takes the work mode's state"
    assert void.reset_states((void, working, Ready())) == (void, working), "a helper keeps its floor and its work on a reset"
    assert type(Ready().reset_states((Ready(), working))[0]) is Ready and len(Ready().reset_states((Ready(), working))) == 1, "a main agent keeps one fresh floor"


def test_a_helper_command_class_serves_its_noun_for_that_role_alone(app: App):
    from journal.console.command import Command
    from journal.features.tasks.commands.task_command import TaskCommand
    from journal.support.agent_role import AgentRole
    worker_task = type("WorkerTaskCommand", (Command,), {"noun": TaskCommand.noun, "arguments": lambda self, verbs: None})
    console = app.container.get(Console)
    console.add_helper(AgentRole.WORKER, worker_task)
    assert type(console.table(AgentRole.WORKER)[TaskCommand.noun]) is worker_task, "the worker's own class serves the noun for the worker"
    assert type(console.table(AgentRole.MAIN)[TaskCommand.noun]) is TaskCommand, "and the main agent keeps the first"


def test_a_wake_line_given_up_on_leaves_the_idle_agent_resting_so_the_next_line_is_typed(app: App, monkeypatch):
    """The wake marked the agent working; with no turn started, the next message would otherwise wait for a turn end that never comes."""
    from types import SimpleNamespace
    from journal.supervisor_link import SupervisorLink
    from journal.support.typed_lines import TypedLines
    from journal.features.delivery.listeners.line_retyping import LineRetyping, TRY_COUNT, WAIT_LIMIT_SECONDS
    transmitted = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: transmitted.append(fields))
    link, typed = app.container.get(SupervisorLink), app.container.get(TypedLines)
    link.type(1, "the first message")
    batch_waited(app)
    lost = typed.overdue(1, float("inf"))[0]
    for _ in range(TRY_COUNT - 1):
        lost = typed.retry(lost, lost.time)
    finished_turn = SimpleNamespace(is_finished=lambda agent: True)
    retyping = LineRetyping(typed, finished_turn, link, SimpleNamespace(show=lambda *arguments, **options: None))
    retyping.handle(SimpleNamespace(silence_seconds=WAIT_LIMIT_SECONDS, agent=None, environment_id=1, session="s-1", time=lost.time + WAIT_LIMIT_SECONDS * 2 ** TRY_COUNT))
    link.type(1, "the second message")
    batch_waited(app)
    assert transmitted[-1].get("line") == "[journal] the second message", transmitted
