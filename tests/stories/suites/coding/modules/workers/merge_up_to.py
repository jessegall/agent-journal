from tests.stories.suites.coding.modules.workers.support.commit_command import request_merge
from tests.stories.core.support.agent_labels import agent_number
import pytest

from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, FIRST_PROOF, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

pytestmark = pytest.mark.real_git

RECEIPT = "RECEIPT = 1\n"
UNKNOWN_COMMIT = "0" * 40


@pytest.fixture
def second_task_worker(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    second_task = story.new_row_id('task make "Second job" --brief "Add the receipt"', actor=story.agent)
    story.expect_success(f"worker send {agent_number(story, worker.id)} --wait --task {second_task}", actor=story.agent)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=worker)
    story.expect_success(f"task start {second_task}", actor=worker)
    story.expect_success(COMMIT, actor=worker)
    repository.changed(worker.id, "receipt.py", RECEIPT)
    repository.checkout(ENVIRONMENT_BRANCH)
    return story, repository, worker, second_task


@pytest.fixture
def proven_worker(second_task_worker):
    story, *_ = second_task_worker
    story.expect_success("proof check 1", actor=story.agent)
    return second_task_worker


def first_task_commit(repository, worker):
    return repository.git("log", "-1", "--format=%H", folder=repository.worktree_folder(worker.id)).stdout.strip()


def expect_first_task_merged(story, repository, worker, second_task):
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", CART_CHANGE)
    story.expect_text("task show 1", "state: completed")
    story.expect_text(f"task show {second_task}", "state: started")
    story.expect_rows((repository.worktree_folder(worker.id) / "receipt.py").read_text() == RECEIPT)
    story.expect_text("worker-worktree show 1", "state: cut")


def test_a_merge_up_to_a_commit_takes_the_work_up_to_it(proven_worker):
    story, repository, worker, second_task = proven_worker
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)} --up-to {first_task_commit(repository, worker)}", actor=story.agent)
    expect_first_task_merged(story, repository, worker, second_task)


def test_a_commit_not_on_the_workers_branch_is_refused(proven_worker):
    story, _, worker, _ = proven_worker
    story.expect_refusal(f"worker merge --wait {agent_number(story, worker.id)} --up-to {UNKNOWN_COMMIT}", f"not on the branch of worker {agent_number(story, worker.id)}", actor=story.agent)


def test_an_unproven_task_is_refused(second_task_worker):
    story, _, worker, _ = second_task_worker
    story.expect_text("task show 1", "state: testing")
    story.expect_refusal(f"worker merge --wait {agent_number(story, worker.id)} --up-to 1", "is not checked", actor=story.agent)
    story.expect_text("task show 1", "state: testing")


def test_the_later_merge_brings_only_the_rest(proven_worker):
    story, repository, worker, second_task = proven_worker
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)} --up-to 1", actor=story.agent)
    story.expect_success(f'proof make 1 --task {second_task} "receipt.py:1, the receipt story"', actor=worker)
    story.expect_success(COMMIT, actor=worker)
    story.expect_success("proof check 2", actor=story.agent)
    request_merge(story, worker)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    request_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, "receipt.py", RECEIPT)
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", CART_CHANGE)
    story.expect_text(f"task show {second_task}", "state: completed")
