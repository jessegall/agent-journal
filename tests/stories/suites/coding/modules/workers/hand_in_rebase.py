import json
from concurrent.futures import ThreadPoolExecutor

import pytest

from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.models.worktree import Worktree
from core.base.query.queries import Queries

from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DELIVERY, FIRST_PROOF, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.test_queue import recording_launch


pytestmark = pytest.mark.real_git

MAIN_TAX = "TAX = 21\n"
WORKER_TAX = "TAX = 5\n"
MERGED_TAX = "TAX = 22\n"


class StoppedDelivery(BaseException):
    pass


def moved_base_worker(story, repository, line="worker dispatch --model sonnet 1"):
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("tax.py", "TAX = 1\n", "The first tax")
    worker = dispatched_worker(story, line)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=worker)
    repository.committed("rate.py", "RATE = 2\n", "The rate")
    return worker


def worktree_row(story, worker):
    rows = json.loads(story.run("worker-worktree list --json").output_text)["rows"]
    return next(row for row in rows if row["session_agent_id"] == worker.id)


def expect_tip(story, repository, worker):
    tip = repository.tip(ENVIRONMENT_BRANCH)
    folder = repository.worktree_folder(worker.id)
    story.expect_rows(worktree_row(story, worker)["base_commit"] == tip,
                      repository.git("merge-base", "--is-ancestor", tip, "HEAD", folder=folder).returncode == 0,
                      (folder / "rate.py").read_text() == "RATE = 2\n")


def test_a_hand_in_on_a_moved_base_rebases_the_work_and_base_commit_follows(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = moved_base_worker(story, repository)
    story.expect_success(DELIVERY, actor=worker)
    expect_tip(story, repository, worker)
    repository.expect_clean(worker.id)
    repository.expect_no_stash()


def test_uncommitted_changes_come_back_after_the_rebase_and_are_committed(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = moved_base_worker(story, repository)
    repository.changed(worker.id, "notes.py", "NOTE = 1\n")
    story.expect_success(DELIVERY, actor=worker)
    repository.expect_file(repository.worker_branch(worker.id), "cart.py", CART_CHANGE)
    repository.expect_file(repository.worker_branch(worker.id), "notes.py", "NOTE = 1\n")
    repository.expect_clean(worker.id)


def test_worker_next_rebases_before_the_next_task_starts(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    story.expect_success('task make "Second job" --environment main', actor=story.agent)
    worker = moved_base_worker(story, repository, "worker dispatch --model sonnet 1 2")
    story.expect_success("worker next --wait --differences none", actor=worker)
    expect_tip(story, repository, worker)


def test_a_clash_stops_the_hand_in_and_leaves_the_markers_until_the_worker_settles_them(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = moved_base_worker(story, repository)
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
    expect_tip(story, repository, worker)


def test_a_proof_runs_on_the_rebased_code(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    launches = recording_launch(monkeypatch)
    repository = repository_environment(story)
    worker = moved_base_worker(story, repository)
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart total story" --test "pytest tests/cart.py"', actor=worker)
    story.expect_success(DELIVERY, actor=worker)
    story.run_listeners()
    story.expect_rows(len(launches) == 1)
    expect_tip(story, repository, worker)


def test_the_next_hand_in_restores_files_left_in_a_stash_by_a_stopped_server(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = moved_base_worker(story, repository)
    repository.changed(worker.id, "notes.py", "NOTE = 1\n")

    def stop_restore(git, worktree, stash):
        raise StoppedDelivery

    with monkeypatch.context() as patch:
        patch.setattr(WorktreeGit, "unstash", stop_restore)
        with pytest.raises(StoppedDelivery):
            story.run(DELIVERY, actor=worker)
    story.expect_rows(not (repository.worktree_folder(worker.id) / "notes.py").exists())

    story.expect_success(DELIVERY, actor=worker)

    repository.expect_file(repository.worker_branch(worker.id), "cart.py", CART_CHANGE)
    repository.expect_file(repository.worker_branch(worker.id), "notes.py", "NOTE = 1\n")
    repository.expect_clean(worker.id)
    repository.expect_no_stash()


def test_an_interrupted_rebase_restores_the_uncommitted_files_before_returning(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = moved_base_worker(story, repository)
    repository.changed(worker.id, "notes.py", "NOTE = 1\n")
    original = WorktreeGit.git

    def stop_rebase(git, folder, limit, *arguments):
        if arguments == ("rebase", ENVIRONMENT_BRANCH):
            raise StoppedDelivery
        return original(git, folder, limit, *arguments)

    with monkeypatch.context() as patch:
        patch.setattr(WorktreeGit, "git", stop_rebase)
        with pytest.raises(StoppedDelivery):
            story.run(DELIVERY, actor=worker)

    story.expect_rows((repository.worktree_folder(worker.id) / "notes.py").read_text() == "NOTE = 1\n")
    repository.expect_no_stash()
    story.expect_success(DELIVERY, actor=worker)


def test_a_hand_in_leaves_another_workers_stash_untouched(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = moved_base_worker(story, repository)
    story.expect_success('task make "Another job" --environment main', actor=story.agent)
    sibling = dispatched_worker(story, "worker dispatch --model sonnet 2")
    repository.changed(sibling.id, "sibling.py", "OTHER = 1\n")
    worktree = story.container.get(Queries).query(Worktree).filter(session_agent_id=sibling.id).first()
    stash = story.container.get(WorktreeGit).stash(worktree)

    story.expect_success(DELIVERY, actor=worker)

    repository.expect_file(repository.worker_branch(worker.id), "cart.py", CART_CHANGE)
    story.expect_rows(not (repository.worktree_folder(sibling.id) / "sibling.py").exists())
    story.expect_rows(repository.git("stash", "list", "--format=%H").stdout.splitlines() == [stash])


def sibling_worker(story, repository):
    story.expect_success('task make "Another job" --environment main', actor=story.agent)
    sibling = dispatched_worker(story, "worker dispatch --model sonnet 2")
    repository.changed(sibling.id, "sibling.py", "OTHER = 1\n")
    return sibling


def test_a_stash_another_worker_pushes_in_the_middle_of_a_hand_in_is_never_taken(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = moved_base_worker(story, repository)
    sibling = sibling_worker(story, repository)
    repository.changed(worker.id, "notes.py", "NOTE = 1\n")
    sibling_branch = repository.worker_branch(sibling.id)
    pushed_stash = WorktreeGit.checked

    def checked_with_sibling_stash(git, folder, limit, *arguments):
        finished = pushed_stash(git, folder, limit, *arguments)
        if arguments[:2] == ("stash", "push") and folder == str(repository.worktree_folder(worker.id)):
            repository.git("stash", "push", "--include-untracked", "--message", f"journal merge of {sibling_branch}", folder=repository.worktree_folder(sibling.id))
        return finished

    monkeypatch.setattr(WorktreeGit, "checked", checked_with_sibling_stash)
    story.expect_success(DELIVERY, actor=worker)

    repository.expect_file(repository.worker_branch(worker.id), "notes.py", "NOTE = 1\n")
    story.expect_rows(not (repository.worktree_folder(worker.id) / "sibling.py").exists())
    story.expect_rows(len(repository.git("stash", "list", "--format=%H").stdout.splitlines()) == 1)
    story.expect_rows(f"journal merge of {sibling_branch}" in repository.git("stash", "list").stdout)


def test_two_worktrees_rebasing_at_once_each_keep_their_own_files(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = moved_base_worker(story, repository)
    sibling = sibling_worker(story, repository)
    repository.changed(worker.id, "notes.py", "NOTE = 1\n")
    worktrees = [story.container.get(Queries).query(Worktree).filter(session_agent_id=agent.id).first() for agent in (worker, sibling)]
    with ThreadPoolExecutor(2) as pool:
        list(pool.map(story.container.get(WorktreeGit).rebase, worktrees))

    worker_folder, sibling_folder = repository.worktree_folder(worker.id), repository.worktree_folder(sibling.id)
    story.expect_rows((worker_folder / "notes.py").exists(), not (worker_folder / "sibling.py").exists())
    story.expect_rows((sibling_folder / "sibling.py").exists(), not (sibling_folder / "notes.py").exists())
    repository.expect_no_stash()

