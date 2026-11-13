from tests.stories.core.support.agent_labels import agent_number
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import delivered_worker, dispatched_worker, repository_environment
from suites.coding.modules.workers.support.worker_nudges import PROOF_CHECK
from engine.testing.expectations.said_nudge import said
from suites.coding.modules.workers.support.worker_settings import MOST_OPEN_TASKS

MAIN_SESSION = "s-1"


def test_a_main_agent_is_refused_its_stop_until_it_checks_a_proof_with_no_test(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_hook_refusal(MAIN_SESSION, HookSamples.stop(), said(PROOF_CHECK))
    story.expect_hook_refusal(MAIN_SESSION, HookSamples.stop(), said(PROOF_CHECK))
    story.expect_success("proof check 1", actor=story.agent)
    story.expect_hook_allowed(MAIN_SESSION, HookSamples.stop())


def test_a_worker_is_refused_a_second_started_task_when_the_most_it_may_hold_is_one(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f"setting set {MOST_OPEN_TASKS} 1 --environment main", actor=story.user)
    story.expect_success('task make "Fix the till" --environment main', "state: open")
    story.expect_refusal("task start 2", "you hold 1 task, the most allowed", actor=worker)


def test_a_proof_waits_for_the_task_to_be_handed_in(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", "TOTAL = 1\n")
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart total story"', actor=worker)
    story.expect_hook_allowed(MAIN_SESSION, HookSamples.stop())
    story.expect_success("worker commit --wait --differences none", actor=worker)
    story.expect_hook_refusal(MAIN_SESSION, HookSamples.stop(), said(PROOF_CHECK))


def test_the_refused_stop_names_the_task_of_each_proof_that_waits(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    second_id = story.new_row_id('task make "Second job" --brief "Finish the second job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, f"worker dispatch --test-command python=pytest --model sonnet 1 {second_id}")
    repository.changed(worker.id, "cart.py", "TOTAL = 1\n")
    story.expect_success('proof make 1 --task 1 "cart.py:1, the first story"', actor=worker)
    story.expect_success(f"task start {second_id}", actor=worker)
    story.expect_success(f'proof make 1 --task {second_id} "cart.py:1, the second story"', actor=worker)
    story.expect_success("worker commit --wait --differences none", actor=worker)
    number = agent_number(story, worker.id)
    story.expect_hook_refusal(MAIN_SESSION, HookSamples.stop(), said(PROOF_CHECK))
    story.expect_hook_refusal(MAIN_SESSION, HookSamples.stop(), said(PROOF_CHECK))
