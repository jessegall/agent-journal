from core.testing.hook_samples import HookSamples
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment


def test_an_orchestrator_that_stops_with_open_tasks_is_told_they_wait_for_a_worker(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "open tasks wait for a worker: 1")
    story.expect_success(lines.TASK_DETAILS, "state: open")


def test_an_orchestrator_starts_no_task_of_its_own(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.expect_refusal(lines.TASK_START, "refused by coding.orchestrator-starts-no-task: task 1 goes to a worker", actor=story.agent)


def test_the_agent_starts_its_task_again_once_the_builder_drives_it(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.run("driver choose coding.builder --environment main")
    story.expect_success(lines.TASK_START, "state: started", f"holder_id: {story.agent.id}", actor=story.agent)


def test_an_orchestrator_with_nothing_open_stops(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.run(lines.TASK_CANCEL)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_an_orchestrator_at_the_worker_limit_may_stop(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.run("setting make journal.suites.coding.workers.worker-limit 0")
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_tasks_a_running_worker_has_queued_let_the_orchestrator_stop(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    story.run("worker dispatch 1 2 --model sonnet", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_an_open_task_no_worker_has_holds_the_orchestrator_at_stop(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    story.run('task make "Third job" --brief "Do the third job" --environment main', actor=story.agent)
    story.run("worker dispatch 1 2 --model sonnet", actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "open tasks wait for a worker: 3")


def test_a_task_queued_with_a_worker_that_ended_holds_the_orchestrator_at_stop(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, "worker dispatch 1 2 --model sonnet")
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "open tasks wait for a worker: 2")
