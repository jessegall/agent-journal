import pytest

from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DELIVERY, DISPATCH, FIRST_PROOF, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


pytestmark = pytest.mark.real_git

SECOND_JOB = 'task make "Second job" --brief "Do the second job" --environment main'
SECOND_PROOF = 'proof make 1 --task 2 "second.py:1, the second story"'
FRESH_DISPATCH = 'worker dispatch --test-command python=pytest --model sonnet --fresh "a new session"'
ALREADY_BUILT = 'worker deliver --wait --differences "already built: cart.py"'


def built_and_released(story, repository, dispatch=DISPATCH):
    worker = dispatched_worker(story, dispatch)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=worker)
    story.expect_success(DELIVERY, actor=worker)
    story.expect_success(f'worker release {worker.id} "the worker left"', actor=story.agent)
    return worker


@pytest.fixture
def base_story(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    repository.checkout(ENVIRONMENT_BRANCH)
    return story, repository


@pytest.fixture
def released_work(base_story):
    story, repository = base_story
    return story, repository, built_and_released(story, repository)


def expect_cut_from_the_base(story, repository, worker):
    assert repository.tip(repository.worker_branch(worker.id)) == repository.tip(ENVIRONMENT_BRANCH)


@pytest.fixture
def second_worker(released_work):
    story, repository, first = released_work
    return story, repository, first, dispatched_worker(story, f"{FRESH_DISPATCH} 1")


@pytest.fixture
def proved_second(second_worker):
    story, repository, first, second = second_worker
    story.expect_success(FIRST_PROOF, actor=second)
    return story, repository, first, second


@pytest.fixture
def added_second(second_worker):
    story, repository, first, second = second_worker
    repository.changed(second.id, "notes.py", "NOTE = 1\n")
    story.expect_success(FIRST_PROOF, actor=second)
    story.expect_success(DELIVERY, actor=second)
    return story, repository, first, second


def proved_after_a_base_move(released_work, name, text, message):
    story, repository, first = released_work
    repository.committed(name, text, message)
    second = dispatched_worker(story, f"{FRESH_DISPATCH} 1")
    story.expect_success(FIRST_PROOF, actor=second)
    return story, repository, second


@pytest.fixture
def after_a_rate_move(released_work):
    return proved_after_a_base_move(released_work, "rate.py", "RATE = 2\n", "The rate")


@pytest.fixture
def after_a_cart_clash(released_work):
    return proved_after_a_base_move(released_work, "cart.py", "TOTAL = 9\n", "Another total")


def test_a_second_worker_on_a_built_task_has_the_earlier_files_in_its_worktree(second_worker):
    story, repository, first, second = second_worker
    assert (repository.worktree_folder(second.id) / "cart.py").read_text() == CART_CHANGE
    assert repository.git("merge-base", "--is-ancestor", repository.worker_branch(first.id), repository.worker_branch(second.id)).returncode == 0


def test_it_hands_in_with_differences_already_built_and_the_task_closes(proved_second):
    story, repository, first, second = proved_second
    story.expect_success(ALREADY_BUILT, actor=second)
    repository.expect_file(repository.worker_branch(second.id), "cart.py", CART_CHANGE)
    story.expect_text("task show 1", "state: testing", actor=story.agent)


def test_a_second_worker_that_changed_nothing_and_said_nothing_is_refused_and_told_the_earlier_commits(proved_second):
    story, repository, first, second = proved_second
    earlier = repository.tip(repository.worker_branch(first.id))[:10]
    story.expect_refusal(DELIVERY, "task 1 changed no file", actor=second)
    story.expect_refusal(DELIVERY, f"the task already has commits {earlier} from worker {first.id}", actor=second)
    story.expect_refusal(DELIVERY, "already built:", actor=second)


def test_a_second_worker_that_adds_to_the_earlier_work_needs_no_why(added_second):
    story, repository, first, second = added_second
    repository.expect_file(repository.worker_branch(second.id), "cart.py", CART_CHANGE)
    repository.expect_file(repository.worker_branch(second.id), "notes.py", "NOTE = 1\n")


def test_a_base_that_moved_after_the_earlier_work_comes_in_at_the_hand_in(after_a_rate_move):
    story, repository, second = after_a_rate_move
    story.expect_success(ALREADY_BUILT, actor=second)
    repository.expect_file(repository.worker_branch(second.id), "rate.py", "RATE = 2\n")
    repository.expect_file(repository.worker_branch(second.id), "cart.py", CART_CHANGE)


def test_a_clash_of_the_earlier_work_with_the_moved_base_is_named_at_the_hand_in(after_a_cart_clash):
    story, repository, second = after_a_cart_clash
    story.expect_refusal(ALREADY_BUILT, f"your work clashes with {ENVIRONMENT_BRANCH} in cart.py", actor=second)


def test_an_earlier_branch_that_is_gone_falls_back_to_the_base(released_work):
    story, repository, first = released_work
    repository.git("branch", "-D", repository.worker_branch(first.id))
    second = dispatched_worker(story, f"{FRESH_DISPATCH} 1")
    expect_cut_from_the_base(story, repository, second)
    assert (repository.worktree_folder(second.id) / "cart.py").read_text() == "TOTAL = 0\n"


def test_an_earlier_branch_already_in_the_base_is_not_inherited(released_work):
    story, repository, first = released_work
    repository.git("merge", "--no-edit", repository.worker_branch(first.id))
    second = dispatched_worker(story, f"{FRESH_DISPATCH} 1")
    expect_cut_from_the_base(story, repository, second)


def test_a_task_with_no_earlier_work_is_cut_from_the_base_as_before(base_story):
    story, repository = base_story
    worker = dispatched_worker(story)
    expect_cut_from_the_base(story, repository, worker)


def test_another_tasks_commit_on_the_earlier_branch_does_not_count(base_story):
    story, repository = base_story
    story.expect_success(SECOND_JOB, actor=story.agent)
    first = dispatched_worker(story, f"{DISPATCH} 2")
    repository.changed(first.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=first)
    story.expect_success("worker next --wait --differences none", actor=first)
    story.expect_success(f'worker release {first.id} "the worker left"', actor=story.agent)
    third = dispatched_worker(story, f"{FRESH_DISPATCH} 2")
    expect_cut_from_the_base(story, repository, third)


def test_earlier_work_on_a_later_task_of_the_dispatch_is_found(base_story):
    story, repository = base_story
    story.expect_success(SECOND_JOB, actor=story.agent)
    built_and_released(story, repository)
    third = dispatched_worker(story, f"{FRESH_DISPATCH} 2 1")
    assert (repository.worktree_folder(third.id) / "cart.py").read_text() == CART_CHANGE


def test_the_newest_earlier_work_is_the_one_inherited(added_second):
    story, repository, first, second = added_second
    story.expect_success(f'worker release {second.id} "this one left too"', actor=story.agent)
    third = dispatched_worker(story, f"{FRESH_DISPATCH} 1")
    assert (repository.worktree_folder(third.id) / "cart.py").read_text() == CART_CHANGE
    assert (repository.worktree_folder(third.id) / "notes.py").read_text() == "NOTE = 1\n"


def test_a_kept_worker_sent_a_built_task_finds_the_earlier_work_too(base_story):
    story, repository = base_story
    story.expect_success(SECOND_JOB, actor=story.agent)
    kept = dispatched_worker(story, "worker dispatch --test-command python=pytest --model sonnet 2")
    repository.changed(kept.id, "second.py", "SECOND = 1\n")
    story.expect_success(SECOND_PROOF, actor=kept)
    story.expect_success(DELIVERY, actor=kept)
    story.expect_success("proof check 1", actor=story.agent)
    story.expect_success(f"worker logs {kept.id}", actor=story.agent)
    story.expect_success(f"worker merge --wait {kept.id}", actor=story.agent)
    built_and_released(story, repository, f"{FRESH_DISPATCH} 1")
    story.expect_success(f"worker send --wait {kept.id} --task 1", actor=story.agent)
    assert (repository.worktree_folder(kept.id) / "cart.py").read_text() == CART_CHANGE
