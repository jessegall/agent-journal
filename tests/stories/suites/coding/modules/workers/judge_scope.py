import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DELIVERY, DISPATCH, FIRST_PROOF, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.judge_plugin import SINFUL_TEXT, judge_plugin_folder, judged_data, judged_files


pytestmark = pytest.mark.real_git

MERGED_TAX = "TAX = 22\n"


def judged_story(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"plugin install {judge_plugin_folder(story.home.folder.parent)} --yes", actor=story.user)
    repository = repository_environment(story)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("tax.py", "TAX = 1\n", "The first tax")
    return story, repository


@pytest.fixture
def judged_worker(new_story):
    story, repository = judged_story(new_story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=worker)
    return story, repository, worker


@pytest.fixture
def two_task_worker(new_story):
    story, repository = judged_story(new_story)
    story.expect_success('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, f"{DISPATCH} 2")
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=worker)
    return story, repository, worker


def base_brought_in(story, worker):
    story.expect_success(f'worker send --wait {worker.id} "go on"', actor=story.agent)


def nothing_more(repository, worker):
    pass


def base_moved(repository, worker):
    repository.committed("rate.py", "RATE = 2\n", "The rate")


def uncommitted_file(repository, worker):
    repository.changed(worker.id, "notes.py", "NOTE = 1\n")


def both_sides_changed(repository, worker):
    repository.changed(worker.id, "tax.py", "TAX = 1\n\nOWN = 2\n")
    repository.committed("tax.py", "BASE = 3\n\nTAX = 1\n", "The base changes the same file")


def clash_made(repository, worker):
    repository.changed(worker.id, "tax.py", "TAX = 5\n")
    repository.committed("tax.py", "TAX = 21\n", "Another tax")
    base_moved(repository, worker)


def clash_settled(repository, worker):
    repository.changed(worker.id, "tax.py", MERGED_TAX)


@pytest.fixture(params=[(base_moved, nothing_more, ["cart.py"]), (nothing_more, uncommitted_file, ["cart.py", "notes.py"]),
                        (both_sides_changed, nothing_more, ["cart.py", "tax.py"]), (clash_made, clash_settled, ["cart.py", "tax.py"])],
                ids=["base-moved", "uncommitted-file", "changed-on-both-sides", "clash-settled"])
def brought_in(request, judged_worker):
    story, repository, worker = judged_worker
    before, after, files = request.param
    before(repository, worker)
    base_brought_in(story, worker)
    after(repository, worker)
    return story, worker, files


@pytest.fixture
def brought_in_sin(judged_worker):
    story, repository, worker = judged_worker
    repository.committed("merged.py", SINFUL_TEXT, "A sin on the base")
    base_brought_in(story, worker)
    return story, worker


@pytest.fixture
def own_sin_after_a_move(judged_worker):
    story, repository, worker = judged_worker
    repository.changed(worker.id, "own.py", SINFUL_TEXT)
    base_moved(repository, worker)
    base_brought_in(story, worker)
    return story, worker


def test_the_list_after_the_base_came_in_holds_the_workers_files_and_their_changes(brought_in):
    story, worker, files = brought_in
    story.expect_success(DELIVERY, actor=worker)
    assert judged_files(story) == files
    assert sorted(change["relative"] for change in judged_data(story)["changes"]) == files


def test_a_sin_in_a_file_the_base_brought_in_does_not_refuse_the_hand_in(brought_in_sin):
    story, worker = brought_in_sin
    story.expect_success(DELIVERY, actor=worker)


def test_a_sin_in_an_own_file_refuses_after_the_base_moved_too(own_sin_after_a_move):
    story, worker = own_sin_after_a_move
    story.expect_refusal(DELIVERY, "[plugin judge] own.py has a sin", actor=worker)


def test_a_worker_whose_base_moved_sends_the_judge_only_its_own_files(judged_worker):
    story, repository, worker = judged_worker
    repository.committed("first.py", "FIRST = 1\n", "The first move of the base")
    base_brought_in(story, worker)
    repository.committed("second.py", "SECOND = 2\n", "The second move of the base")
    base_brought_in(story, worker)
    story.expect_success(DELIVERY, actor=worker)
    assert judged_files(story) == ["cart.py"]


def test_a_base_that_moved_and_was_never_brought_in_stays_out_of_the_list(judged_worker):
    story, repository, worker = judged_worker
    repository.committed("rate.py", "RATE = 2\n", "The rate")
    story.expect_success(DELIVERY, actor=worker)
    assert judged_files(story) == ["cart.py"]


def test_a_deleted_file_is_on_the_list_and_reads_as_deleted(judged_worker):
    story, repository, worker = judged_worker
    repository.git("rm", "tax.py", folder=repository.worktree_folder(worker.id))
    story.expect_success(DELIVERY, actor=worker)
    assert judged_files(story) == ["cart.py", "tax.py"]
    assert [change["status"] for change in judged_data(story)["changes"] if change["relative"] == "tax.py"] == ["deleted"]


def test_a_renamed_file_is_on_the_list_by_its_new_name(judged_worker):
    story, repository, worker = judged_worker
    repository.git("mv", "tax.py", "levy.py", folder=repository.worktree_folder(worker.id))
    story.expect_success(DELIVERY, actor=worker)
    assert "levy.py" in judged_files(story)


def test_the_judge_still_gets_each_field_it_reads(judged_worker):
    story, repository, worker = judged_worker
    story.expect_success(DELIVERY, actor=worker)
    assert {"worker", "task", "branch", "base", "worktree", "files", "changes"} <= set(judged_data(story))


def test_an_earlier_task_of_the_worker_stays_on_the_list_at_a_later_hand_in(two_task_worker):
    story, repository, worker = two_task_worker
    story.expect_success("worker next --wait --differences none", actor=worker)
    repository.changed(worker.id, "second.py", "SECOND = 1\n")
    story.expect_success('proof make 1 --task 2 "second.py:1, the second story"', actor=worker)
    story.expect_success(DELIVERY, actor=worker)
    assert judged_files(story) == ["cart.py", "second.py"]


def test_a_sin_in_an_own_file_still_refuses_and_names_that_file(judged_worker):
    story, repository, worker = judged_worker
    repository.changed(worker.id, "own.py", SINFUL_TEXT)
    story.expect_refusal(DELIVERY, "[plugin judge] own.py has a sin", actor=worker)
    story.expect_text("worker-worktree list", "cut", actor=story.agent)


def test_the_merge_sends_the_judge_only_the_files_of_the_worker(judged_worker):
    story, repository, worker = judged_worker
    story.expect_success(DELIVERY, actor=worker)
    story.expect_success("proof check 1", actor=story.agent)
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
    repository.committed("rate.py", "RATE = 2\n", "The rate")
    story.run(f"worker merge --wait {worker.id}", actor=story.agent)
    assert judged_files(story, "worker_merging") == ["cart.py"]
