from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import delivered_worker, dispatched_worker, repository_environment

MAIN_SESSION = "s-1"


def test_a_main_agent_is_refused_its_stop_until_it_checks_a_proof_with_no_test(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_hook_refusal(MAIN_SESSION, HookSamples.stop(), f"worker:{worker.id} delivered task:1: journal proof check 1")
    story.expect_hook_refusal(MAIN_SESSION, HookSamples.stop(), f"worker:{worker.id} delivered task:1: journal proof check 1")
    story.expect_success("proof check 1", actor=story.agent)
    story.expect_hook_allowed(MAIN_SESSION, HookSamples.stop())


def test_a_worker_is_refused_a_second_started_task(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success('task make "Fix the till" --environment main', "state: open")
    story.expect_refusal("task start 2", f"worker {worker.id} has task 1 started already", actor=worker)
