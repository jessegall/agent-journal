import pytest

from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.command.bus import Bus
from engine.database.database import Database
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.hook_event import HookEvent
from suites.coding.modules.workers.rules.stopped_worker_run_rule import StoppedWorkerRunRule
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.support.part_spec import PartSpec
from engine.journal.journal_home import LAUNCHER_SOCKET
from core.testing.hook_samples import HookSamples
from core.testing.fake_launcher import FakeLauncher
from core.modules.agents.support.agent_launcher import AgentLauncher
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.report import MergerOffOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, dispatched_worker, repository_environment, worker_session
from tests.stories.support.story_checks import expect_absent_value, expect_count_output_2, expect_total_cost_less

RULE_LIMIT_POINTS = 20


def worker_with_background_run(new_story):
    story = new_story(fixture=MergerOffOrchestrator)
    repository_environment(story)
    story.run("setting set journal.suites.coding.workers.worker-run-most-tests 0 --environment main")
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1", actor=story.agent), ActorType.AGENT)
    bus = story.container.get(Bus)
    part = PartSpec("make test", "make", False, CommandCategory.TEST_RUN)
    run = bus.run(StartProcess(worker.id, None, "make test", "/work", "zsh", CommandCategory.TEST_RUN, 30, [part]), worker, environment_id=1)
    story.expect_success(f"process background {run.id}", actor=worker)
    return story, worker, run, bus


def test_a_worker_that_has_open_help_request_stays_stopped_when_its_run_ends(new_story):
    story, worker, run, bus = worker_with_background_run(new_story)
    story.expect_success('wait stuck "the build tool is missing"', actor=worker)
    story.run(f"agent end {worker.id}", actor=worker)
    bus.run(EndProcess(run.id, 0, 10, 1), worker, environment_id=1)
    story.expect_absent(f"agent-line list --agent {worker.id}", f"your run {run.id} ended")


@pytest.fixture
def second_job_worker(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    return story, dispatched_worker(story, f"{DISPATCH} 2")


@pytest.fixture
def worker_with_a_run(new_story):
    return worker_with_background_run(new_story)


def test_a_worker_past_its_restarts_on_old_tasks_is_restarted_for_a_queued_task(second_job_worker, monkeypatch):
    monkeypatch.setattr("suites.coding.modules.workers.support.worker_job.RESUME_LIMIT_COUNT", 1)
    story, worker = second_job_worker
    session = worker_session(story, worker)
    story.advance(timedelta(minutes=1))
    story.run(f"agent end {worker.id}", actor=worker)
    story.hook(session, HookSamples.session_start())
    story.advance(timedelta(minutes=1))
    story.expect_success('task close 1 --outcome "done"', actor=worker)
    story.advance(timedelta(minutes=1))
    story.run(f"agent end {worker.id}", actor=worker)
    expect_count_output_2(story, f"agent-line list --agent {worker.id}", "you ended with tasks left", 2)


def test_a_tick_reads_no_ended_worker_that_has_no_running_process(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    for number in range(30):
        worker_id = story.new_row_id(f"agent start ended-{number} claude worker --parent {story.agent.id} --environment main")
        story.run(f"agent end {worker_id}", actor=story.agent)
    story.advance(timedelta(minutes=31))
    event = HookEvent.parsed(HookSamples.tick().with_fields(session="s-1", firing="check", fired_at_ms=0).body)
    hook = AgentHook(event=event, agent_id=story.agent.id, environment_id=1, role=AgentRole.MAIN, driver="coding.main", timestamp=story.clock.timestamp())
    database = story.container.get(Database)
    start = database.repeated_work.points()
    story.container.get(StoppedWorkerRunRule).answer(hook)
    cost = database.repeated_work.points().minus(start)
    expect_total_cost_less(cost, RULE_LIMIT_POINTS)


def test_a_worker_stopped_past_the_limit_on_a_run_that_goes_on_is_named_to_the_main_agent(new_story):
    story, worker, run, _ = worker_with_background_run(new_story)
    story.run(f"agent end {worker.id}", actor=worker)
    story.tick("s-1")
    story.expect_absent(f"agent-line list --agent {story.agent.id}", f"waits on output {run.id}")
    story.advance(timedelta(minutes=31))
    story.tick("s-1")
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{worker.id} stopped and waits on output {run.id}")


def test_a_paused_worker_stays_stopped_when_its_run_ends(new_story, monkeypatch):
    story, worker, run, bus = worker_with_background_run(new_story)
    hands = []
    monkeypatch.setattr(AgentLauncher, "hand", lambda self, *arguments: hands.append(arguments))
    story.expect_success(f"agent pause {worker.id}", actor=story.agent)
    story.run(f"agent end {worker.id}", actor=worker)
    bus.run(EndProcess(run.id, 0, 10, 1), worker, environment_id=1)
    story.run_listeners()
    WorkerResumeRetry()(story.container)
    expect_absent_value(hands)
    story.expect_text(f"agent show {worker.id}", "paused_at:", actor=story.agent)


def test_a_worker_with_a_run_going_may_stop(new_story):
    story, worker, _, _ = worker_with_background_run(new_story)
    story.expect_hook_allowed(worker_session(story, worker), HookSamples.stop())


def test_a_worker_past_its_restarts_that_stops_with_a_run_going_leaves_the_main_agent_no_line_until_it_stops_with_none(worker_with_a_run, monkeypatch):
    monkeypatch.setattr("suites.coding.modules.workers.support.worker_job.RESUME_LIMIT_COUNT", 1)
    story, worker, run, bus = worker_with_a_run
    session = worker_session(story, worker)
    line = f"worker:{worker.id} ended with"
    for _ in range(3):
        story.run(f"agent end {worker.id}", actor=worker)
        story.run_listeners()
        story.hook(session, HookSamples.session_start())
    story.expect_absent(f"agent-line list --agent {story.agent.id}", line)
    bus.run(EndProcess(run.id, 0, 10, 1), worker, environment_id=1)
    story.run(f"agent end {worker.id}", actor=worker)
    story.run_listeners()
    story.expect_text(f"agent-line list --agent {story.agent.id}", line)


def stopped_twice(story, worker, session, tool_use_between: bool) -> None:
    story.advance(timedelta(minutes=1))
    story.run(f"agent end {worker.id}", actor=worker)
    story.hook(session, HookSamples.session_start())
    story.advance(timedelta(minutes=1))
    if tool_use_between:
        story.hook(session, HookSamples.edit("cart.py"))
        story.advance(timedelta(minutes=1))
    story.run(f"agent end {worker.id}", actor=worker)


def test_a_worker_that_used_a_tool_since_its_last_restart_is_started_again_past_the_restart_limit(new_story, monkeypatch):
    monkeypatch.setattr("suites.coding.modules.workers.support.worker_job.RESUME_LIMIT_COUNT", 1)
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    stopped_twice(story, worker, worker_session(story, worker), tool_use_between=True)
    expect_count_output_2(story, f"agent-line list --agent {worker.id}", "you ended with tasks left", 2)


def test_a_worker_that_did_nothing_since_its_last_restart_is_not_started_past_the_restart_limit(new_story, monkeypatch):
    monkeypatch.setattr("suites.coding.modules.workers.support.worker_job.RESUME_LIMIT_COUNT", 1)
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    stopped_twice(story, worker, worker_session(story, worker), tool_use_between=False)
    expect_count_output_2(story, f"agent-line list --agent {worker.id}", "you ended with tasks left", 1)


def test_a_worker_gets_its_restarts_anew_when_it_starts_a_task_again(new_story, monkeypatch):
    monkeypatch.setattr("suites.coding.modules.workers.support.worker_job.RESUME_LIMIT_COUNT", 1)
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    story.advance(timedelta(minutes=1))
    story.run(f"agent end {worker.id}", actor=worker)
    story.hook(session, HookSamples.session_start())
    story.run(f"agent end {worker.id}", actor=worker)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{worker.id} ended with task:1")
    story.hook(session, HookSamples.session_start())
    story.advance(timedelta(minutes=1))
    story.expect_success('task block 1 --reason "waits on a person"', actor=worker)
    story.expect_success("task unblock 1", actor=worker)
    story.expect_success("task start 1", actor=worker)
    story.advance(timedelta(minutes=1))
    story.run(f"agent end {worker.id}", actor=worker)
    expect_count_output_2(story, f"agent-line list --agent {worker.id}", "you ended with tasks left", 2)


def test_a_worker_whose_program_the_launcher_runs_is_stopped_through_the_launcher(new_story):
    story, worker, _, _ = worker_with_background_run(new_story)
    launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET), answer=b"stopped\n")
    story.expect_success(f"agent stop {worker.id}", f"stopped agent {worker.id}", actor=story.agent)
    expect_requests_launcher_2(launcher, 1, {"agent_id": worker.id, "stop": True})
    story.expect_text(f"agent show {worker.id}", "ended_at:", actor=story.agent)


def test_a_worker_no_launcher_runs_is_refused_a_stop_and_keeps_its_tasks(new_story):
    story, worker, _, _ = worker_with_background_run(new_story)
    story.expect_refusal(f"agent stop {worker.id}", "does not know the process", actor=story.agent)
    story.expect_text("task show 1", f"delegated_to: {worker.id}", actor=story.agent)


def expect_requests_launcher_2(launcher, number, expected) -> None:
    actual = launcher.requests[-number]
    assert actual == expected, actual
