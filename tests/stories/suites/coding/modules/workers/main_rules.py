from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import delivered_worker, dispatched_worker, repository_environment

MAIN_SESSION = "s-1"


def test_a_main_agent_that_stops_while_delivered_work_waits_for_its_checks_is_refused_once(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_hook_refusal(MAIN_SESSION, HookSamples.stop(), f"worker {worker.id} delivered task 1: check proof 1 with journal proof check <proof>")
    story.expect_hook_allowed(MAIN_SESSION, HookSamples.stop())


def test_a_worker_is_refused_a_second_started_task(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success('task make "Fix the till" --environment main', "state: open")
    story.expect_refusal("task start 2", f"worker {worker.id} has task 1 started already", actor=worker)
