from datetime import timedelta

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.command.bus import Bus
from core.base.database.database import Database
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.hook_event import HookEvent
from core.base.query.queries import Queries
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.rules.stopped_worker_run_rule import StoppedWorkerRunRule
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.support.part_spec import PartSpec
from core.base.journal_home import LAUNCHER_SOCKET
from core.testing.hook_samples import HookSamples
from core.testing.fake_launcher import FakeLauncher
from core.modules.agents.support.agent_launcher import AgentLauncher
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.report import OrchestratorWithMergerOff
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, dispatched_worker, repository_environment, worker_session
from tests.stories.support.story_checks import expect_absent_value, expect_count_output_2, expect_total_cost_less

RULE_LIMIT_POINTS = 20


def worker_with_background_run(new_story):
    story = new_story(fixture=OrchestratorWithMergerOff)
    repository_environment(story)
    story.run("setting set journal.suites.coding.workers.worker-run-most-tests 0 --environment main")
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1", actor=story.agent), ActorType.AGENT)
    bus = story.container.get(Bus)
    part = PartSpec("make test", "make", False, CommandCategory.TEST_RUN)
    run = bus.run(StartProcess(worker.id, None, "make test", "/work", "zsh", CommandCategory.TEST_RUN, 30, [part]), worker, environment_id=1)
    story.expect_success(f"process background {run.id}", actor=worker)
    return story, worker, run, bus


def test_a_worker_is_not_held_until_it_watches_a_run_of_its_own(new_story):
    story, worker, run, _ = worker_with_background_run(new_story)
    story.expect_absent(f"agent-block list --agent {worker.id}", f"moved to the background", actor=story.agent)


def test_a_worker_that_stopped_is_told_when_its_run_ends_by_a_job_that_starts_it_again(new_story):
    story, worker, run, bus = worker_with_background_run(new_story)
    story.run(f"agent end {worker.id}", actor=worker)
    story.run_listeners()
    story.expect_text(f"process show {run.id}", "state: background", actor=story.agent)
    bus.run(EndProcess(run.id, 0, 10, 1), worker, environment_id=1)
    story.expect_text(f"agent-line list --agent {worker.id}", f"your run {run.id} ended", "workers.worker-job")


def test_a_worker_still_working_gets_no_job_when_its_run_ends(new_story):
    story, worker, run, bus = worker_with_background_run(new_story)
    bus.run(EndProcess(run.id, 0, 10, 1), worker, environment_id=1)
    story.expect_absent(f"agent-line list --agent {worker.id}", f"your run {run.id} ended")


def test_a_worker_a_person_stopped_stays_stopped_when_its_run_ends_and_the_main_agent_hears_at_the_stop(new_story):
    story, worker, run, bus = worker_with_background_run(new_story)
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"agent edit {worker.id} --pid 700 --process-started-at 2026-10-31T09:00:00+00:00", "pid: 700")
    story.expect_success(f"agent stop {worker.id}", actor=user)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{worker.id} ended with")
    bus.run(EndProcess(run.id, 0, 10, 1), worker, environment_id=1)
    story.expect_absent(f"agent-line list --agent {worker.id}", f"your run {run.id} ended")


def test_a_worker_that_has_open_help_request_stays_stopped_when_its_run_ends(new_story):
    story, worker, run, bus = worker_with_background_run(new_story)
    story.expect_success('wait stuck "the build tool is missing"', actor=worker)
    story.run(f"agent end {worker.id}", actor=worker)
    bus.run(EndProcess(run.id, 0, 10, 1), worker, environment_id=1)
    story.expect_absent(f"agent-line list --agent {worker.id}", f"your run {run.id} ended")


def test_a_worker_past_its_restarts_on_old_tasks_is_restarted_for_a_queued_task(new_story, monkeypatch):
    monkeypatch.setattr("suites.coding.modules.workers.listeners.ended_worker_listener.RESUME_LIMIT_COUNT", 1)
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, f"{DISPATCH} 2")
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
    story = new_story(fixture=OrchestratorWithOpenTask)
    for number in range(30):
        worker_id = story.new_row_id(f"agent start ended-{number} claude worker --parent {story.agent.id} --environment main")
        story.run(f"agent end {worker_id}", actor=story.agent)
    story.advance(timedelta(minutes=31))
    event = HookEvent.parsed(HookSamples.tick().with_fields(session="s-1", firing="check", fired_at_ms=0).body)
    hook = AgentHook(event=event, agent_id=story.agent.id, environment_id=1, role=AgentRole.MAIN, driver="coding.main", timestamp=story.clock.timestamp())
    database = story.container.get(Database)
    start = database.tally.points()
    story.container.get(StoppedWorkerRunRule).answer(hook)
    cost = database.tally.points().minus(start)
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


def test_a_worker_that_stopped_with_a_run_going_is_not_told_to_carry_on_and_shows_no_stop_mark(new_story):
    story, worker, _, _ = worker_with_background_run(new_story)
    story.run(f"agent end {worker.id}", actor=worker)
    story.run_listeners()
    story.expect_absent(f"agent-line list --agent {worker.id}", "you ended with tasks left")
    story.expect_absent("chat-mark list --environment 1", "stopped with")


def test_a_worker_gets_its_restarts_anew_when_it_starts_a_task_again(new_story, monkeypatch):
    monkeypatch.setattr("suites.coding.modules.workers.listeners.ended_worker_listener.RESUME_LIMIT_COUNT", 1)
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    story.advance(timedelta(minutes=1))
    story.run(f"agent end {worker.id}", actor=worker)
    story.hook(session, HookSamples.session_start())
    story.run(f"agent end {worker.id}", actor=worker)
    story.expect_rows(any(f"worker:{worker.id} ended with task:1" in line.text for line in story.container.get(Queries).query(MergerLine).all_rows()))
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
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET), answer=b"stopped\n")
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
