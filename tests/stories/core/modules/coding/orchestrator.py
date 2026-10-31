from core.testing.hook_samples import HookSamples
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask


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
    story.run('task cancel 1 --reason "not needed"')
    story.expect_hook_allowed("s-1", HookSamples.stop())
