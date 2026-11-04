import json

from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DELIVERY, FIRST_PROOF, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.test_queue import recording_launch

MAIN_TAX = "TAX = 21\n"
WORKER_TAX = "TAX = 5\n"
MERGED_TAX = "TAX = 22\n"


def worker_on_a_moved_base(story, repository, line="worker dispatch --model sonnet 1"):
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("tax.py", "TAX = 1\n", "The first tax")
    worker = dispatched_worker(story, line)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=worker)
    repository.committed("rate.py", "RATE = 2\n", "The rate")
    return worker


def worktree_row(story, worker):
    rows = json.loads(story.run("worker-worktree list --json").output_text)["rows"]
    return next(row for row in rows if row["agent_id"] == worker.id)


def expect_on_the_tip(story, repository, worker):
    tip = repository.tip(ENVIRONMENT_BRANCH)
    folder = repository.worktree_folder(worker.id)
    story.expect_rows(worktree_row(story, worker)["base_commit"] == tip,
                      repository.git("merge-base", "--is-ancestor", tip, "HEAD", folder=folder).returncode == 0,
                      (folder / "rate.py").read_text() == "RATE = 2\n")


def test_a_hand_in_on_a_moved_base_rebases_the_work_and_base_commit_follows(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = worker_on_a_moved_base(story, repository)
    story.expect_success(DELIVERY, actor=worker)
    expect_on_the_tip(story, repository, worker)
    repository.expect_clean(worker.id)
    repository.expect_no_stash()


def test_uncommitted_changes_come_back_after_the_rebase_and_are_committed(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = worker_on_a_moved_base(story, repository)
    repository.changed(worker.id, "notes.py", "NOTE = 1\n")
    story.expect_success(DELIVERY, actor=worker)
    repository.expect_file(repository.worker_branch(worker.id), "cart.py", CART_CHANGE)
    repository.expect_file(repository.worker_branch(worker.id), "notes.py", "NOTE = 1\n")
    repository.expect_clean(worker.id)


def test_worker_next_rebases_before_the_next_task_starts(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    story.expect_success('task make "Second job" --environment main', actor=story.agent)
    worker = worker_on_a_moved_base(story, repository, "worker dispatch --model sonnet 1 2")
    story.expect_success("worker next", actor=worker)
    expect_on_the_tip(story, repository, worker)


def test_a_clash_stops_the_hand_in_and_leaves_the_markers_until_the_worker_settles_them(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = worker_on_a_moved_base(story, repository)
    repository.changed(worker.id, "tax.py", WORKER_TAX)
    repository.committed("tax.py", MAIN_TAX, "Another tax")
    story.expect_refusal(DELIVERY, f"your work clashes with {ENVIRONMENT_BRANCH} in tax.py", actor=worker)
    story.expect_success("task show 1", "state: started", actor=worker)
    tax = repository.worktree_folder(worker.id) / "tax.py"
    story.expect_rows("<<<<<<<" in tax.read_text())
    story.expect_refusal(DELIVERY, "conflict markers remain in tax.py", actor=worker)
    repository.changed(worker.id, "tax.py", MERGED_TAX)
    story.expect_success(DELIVERY, actor=worker)
    repository.expect_file(repository.worker_branch(worker.id), "tax.py", MERGED_TAX)
    expect_on_the_tip(story, repository, worker)


def test_a_proof_runs_on_the_rebased_code(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    launches = recording_launch(monkeypatch)
    repository = repository_environment(story)
    worker = worker_on_a_moved_base(story, repository)
    story.expect_success('proof make 1 "cart.py:1, the cart total story" --test "pytest tests/cart.py"', actor=worker)
    story.expect_success(DELIVERY, actor=worker)
    story.run_listeners()
    story.expect_rows(len(launches) == 1)
    expect_on_the_tip(story, repository, worker)
