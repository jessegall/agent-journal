from tests.stories.core.support.agent_labels import agent_number
from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.enums.command_category import CommandCategory
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.support.part_spec import PartSpec
from tests.stories.suites.coding.modules.workers.report import MergerOffOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT

REQUEST = "worker ask 'the build tool is missing' --about tool"


def story_with_worker(new_story):
    story = new_story(fixture=MergerOffOrchestrator)
    repository_environment(story)
    story.run(f"setting set {WORKER_TEST_LIMIT} 0 --environment main")
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1", actor=story.agent), ActorType.AGENT)
    return story, worker


def start_background_run(story, worker):
    bus = story.container.get(Bus)
    part = PartSpec("make test", "make", False, CommandCategory.TEST_RUN)
    run = bus.run(StartProcess(worker.id, None, "make test", "/work", "zsh", CommandCategory.TEST_RUN, 30, [part]), worker, environment_id=1)
    story.expect_success(f"process background {run.id}", actor=worker)
    return run, bus


def expect_run_ended_line(story, worker, run) -> None:
    story.expect_text(f"agent-line list --agent {worker.id}", f"Your run {run.id} ended", "workers.worker-job")


def expect_run_ended_line_absent(story, worker, run) -> None:
    story.expect_absent(f"agent-line list --agent {worker.id}", f"Your run {run.id} ended")


def test_a_worker_that_asked_then_started_a_run_and_stopped_is_woken_when_the_run_ends(new_story):
    story, worker = story_with_worker(new_story)
    story.expect_success(REQUEST, actor=worker)
    story.advance(timedelta(minutes=1))
    run, bus = start_background_run(story, worker)
    story.run(f"agent end {worker.id}", actor=worker)
    bus.run(EndProcess(run.id, 1, 10, 1), worker, environment_id=1)
    expect_run_ended_line(story, worker, run)


def test_a_worker_a_person_stopped_stays_stopped_when_its_run_ends(new_story):
    story, worker = story_with_worker(new_story)
    run, bus = start_background_run(story, worker)
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"agent edit {agent_number(story, worker.id)} --pid 700 --process-started-at 2026-10-31T09:00:00+00:00", "pid: 700")
    story.expect_success(f"agent stop {agent_number(story, worker.id)}", actor=user)
    bus.run(EndProcess(run.id, 1, 10, 1), worker, environment_id=1)
    expect_run_ended_line_absent(story, worker, run)
