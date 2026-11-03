from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.support.part_spec import PartSpec
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment


def worker_with_background_run(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
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
