import pytest
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, delivered_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


def test_merge_waits_for_the_main_agent_to_read_the_workers_logs(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('task log 1 "Changed the cart"', actor=worker)
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart total story"', actor=worker)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_success("proof check 1", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_refusal(f"worker merge --wait {worker.id}", f"journal worker logs {worker.id}", actor=story.agent)
    story.expect_success(f"worker logs {worker.id}", "task 1: Fix the cart", "outcome: ", "1 notes: Changed the cart", actor=story.agent)
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)


def test_a_worker_with_no_logs_still_needs_a_read(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = unread_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_refusal(f"worker merge --wait {worker.id}", f"journal worker logs {worker.id}", actor=story.agent)
    story.expect_success(f"worker logs {worker.id}", "0 notes:", actor=story.agent)
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)


def test_a_worker_cannot_mark_its_own_logs_read(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = unread_worker(story, repository)
    story.expect_refusal(f"worker logs {worker.id}", "main agent", actor=worker)
    story.expect_refusal(f"worker merge --wait {worker.id}", f"journal worker logs {worker.id}", actor=story.agent)


@pytest.mark.real_git
def test_a_new_delivery_requires_the_logs_to_be_read_again(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = unread_worker(story, repository)
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("cart.py", "TOTAL = 2\n", "Another total")
    story.expect_text(f"worker merge --wait {worker.id}", "clashed on cart.py", actor=story.agent)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_refusal(f"worker merge --wait {worker.id}", f"journal worker logs {worker.id}", actor=story.agent)


def unread_worker(story, repository):
    worker = delivered_worker(story, repository)
    story.expect_success("proof check 1", "state: checked", actor=story.agent)
    return worker


def test_logs_include_each_task_in_a_worker_batch(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    story.expect_success('task make "Calculate tax" --brief "Add tax" --environment main', actor=story.agent)
    worker = dispatched_worker(story, "worker dispatch --model sonnet 1 2")
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('task log 1 "Cart finished"', actor=worker)
    story.expect_success('proof make 1 --task 1 "cart.py:1"', actor=worker)
    story.expect_success("worker next --wait --differences none", actor=worker)
    repository.changed(worker.id, "tax.py", "TAX = 1\n")
    story.expect_success('task log 2 "Tax finished"', actor=worker)
    story.expect_success('proof make 1 --task 2 "tax.py:1"', actor=worker)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_success(f"worker logs {worker.id}", "task 1: Fix the cart", "1 notes: Cart finished", "task 2: Calculate tax", "1 notes: Tax finished", actor=story.agent)
