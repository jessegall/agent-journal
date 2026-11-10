from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import delivered_worker, dispatched_worker, repository_environment

MAIN_SESSION = "s-1"


def test_a_main_agent_is_refused_its_stop_until_it_checks_a_proof_with_no_test(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_hook_refusal(MAIN_SESSION, HookSamples.stop(), f"worker:{worker.id} delivered task:1, proofs 1")
    story.expect_hook_refusal(MAIN_SESSION, HookSamples.stop(), f"worker:{worker.id} delivered task:1, proofs 1")
    story.expect_success("proof check 1", actor=story.agent)
    story.expect_hook_allowed(MAIN_SESSION, HookSamples.stop())


def test_a_worker_is_refused_a_second_started_task(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success('task make "Fix the till" --environment main', "state: open")
    story.expect_refusal("task start 2", f"worker {worker.id} has task 1 started already", actor=worker)


def test_a_proof_waits_for_the_task_to_be_handed_in(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", "TOTAL = 1\n")
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart total story"', actor=worker)
    story.expect_hook_allowed(MAIN_SESSION, HookSamples.stop())
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_hook_refusal(MAIN_SESSION, HookSamples.stop(), f"worker:{worker.id} delivered task:1, proofs 1")
