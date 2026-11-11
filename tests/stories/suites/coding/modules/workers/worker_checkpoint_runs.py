from pathlib import Path

import pytest

from engine.errors.refusal import Refusal
from tests.stories.suites.coding.modules.workers.checkpoint_runs import BUILD_TEST, REACHES, PASSES, checkpoint_worker, commit_tasks, merge, rows, run_lines
from tests.stories.suites.coding.modules.workers.support.held_tasks import prove_task
from tests.stories.suites.coding.modules.workers.support.phase_steps import PLAN_DISPATCH, SECOND_TEST_LINE, TEST_LINE, StoryWorker, dispatched_story_worker, planned_story

"""Book C of doc 1252: the tests of a checkpoint run in the background on the worker's commit."""

WORKER_RUN_NOTE = "The tests of checkpoint phase 1 now run on this commit in the background."
PASSED_UNIT_WORDS = "checkpoint of phase 1 passed on your commit"
PASSED_LINE = "the tests of checkpoint phase Build passed"


def plan_worker(new_story, monkeypatch) -> StoryWorker:
    """A worker given the whole of plan 1, whose phase Build is a checkpoint with a test of its own."""
    return dispatched_story_worker(planned_story(new_story, build_test=BUILD_TEST), PLAN_DISPATCH, monkeypatch)


def worker_reaches(worker: StoryWorker) -> list[dict[str, object]]:
    return [row for row in rows(worker, REACHES) if row["source"] == "worker"]


@pytest.fixture
def running_worker_run(new_story, monkeypatch) -> StoryWorker:
    """The worker of the whole plan committed tasks 1, 2 and 3, the window of checkpoint phase 1, with a test
    each; the worker run of that window goes."""
    worker = plan_worker(new_story, monkeypatch)
    commit_tasks(worker, TEST_LINE, SECOND_TEST_LINE, TEST_LINE)
    return worker


def test_28_the_run_starts_when_the_tasks_up_to_a_checkpoint_are_committed(running_worker_run):
    reaches = worker_reaches(running_worker_run)
    running_worker_run.story.expect_rows(len(reaches) == 1, reaches[0]["state"] == "running", reaches[0]["task_ids"] == "1,2,3", detail=str(reaches))


def test_29_the_run_holds_what_a_checkpoint_holds(running_worker_run):
    lines = run_lines(running_worker_run)
    running_worker_run.story.expect_rows(lines.count(BUILD_TEST) == 1, TEST_LINE in lines, SECOND_TEST_LINE in lines, detail=str(lines))


def test_30_the_worker_goes_on_during_the_run(running_worker_run):
    running_worker_run.story.expect_success("task start 4", actor=running_worker_run.worker)


def test_31_a_pass_says_nothing_to_anyone(running_worker_run):
    worker = running_worker_run
    main_lines = worker.main_agent_lines()
    worker.end_all_tests()
    worker.story.expect_rows(worker.main_agent_lines() == main_lines, worker_reaches(worker)[0]["state"] == "passed", PASSED_UNIT_WORDS in worker.status(),
                             detail=f"{worker.main_agent_lines()} / {worker.status()}")


def test_32_a_failure_comes_back_as_work_to_fix(running_worker_run):
    worker = running_worker_run
    worker.end_tests(1, 0, 0, 0)
    worker.story.expect_text("task show 1", "state: started", actor=worker.story.agent)
    worker.story.expect_rows(worker.status().splitlines()[0].startswith("Fix"), detail=worker.status())


def test_33_only_what_failed_runs_again(running_worker_run):
    worker = running_worker_run
    worker.end_tests(1, 0, 0, 0)
    started_count = len(worker.started)
    prove_task(worker, 1, 1, TEST_LINE)
    worker.story.run("worker commit --differences none", actor=worker.worker)
    worker.story.run_listeners()
    again = [process.line for process in worker.started_processes()[started_count:]]
    worker.story.expect_rows(SECOND_TEST_LINE not in again, TEST_LINE in again, detail=str(again))


def test_34_a_failure_while_the_worker_is_in_a_later_phase(running_worker_run):
    worker = running_worker_run
    worker.story.run("task start 4", actor=worker.worker)
    worker.end_tests(1, 0, 0, 0)
    worker.story.expect_rows("Point: fix" in worker.status(), detail=worker.status())


def test_35_two_runs_in_a_row(running_worker_run):
    worker = running_worker_run
    worker.end_tests(1, 0, 0, 0)
    prove_task(worker, 1, 1, TEST_LINE)
    worker.story.run("worker commit --differences none", actor=worker.worker)
    worker.story.run_listeners()
    worker.story.expect_rows([row["state"] for row in worker_reaches(worker)] == ["failed", "running"], detail=str(worker_reaches(worker)))


def test_36_a_window_with_no_test_passes_at_once(new_story, monkeypatch):
    worker = dispatched_story_worker(planned_story(new_story), PLAN_DISPATCH, monkeypatch)
    worker.story.run('phase edit 1 --checkpoint', actor=worker.story.user)
    commit_tasks(worker, "", "", "")
    worker.story.expect_rows([row["state"] for row in worker_reaches(worker)] == ["passed"], detail=str(rows(worker, REACHES)))


@pytest.mark.real_git
def test_37_the_test_checkout_is_made_if_it_is_missing(running_worker_run):
    folders = {process.folder for process in running_worker_run.started_processes()}
    running_worker_run.story.expect_rows(len(folders) == 1, all(Path(folder, ".git").exists() for folder in folders), detail=str(folders))


def test_38_a_run_that_cannot_start_does_not_block_the_worker(new_story, monkeypatch):
    worker = plan_worker(new_story, monkeypatch)
    monkeypatch.setattr("suites.coding.modules.workers.support.worktree_git.WorktreeGit.commit_checkout", unstartable_checkout)
    commit_tasks(worker, TEST_LINE, SECOND_TEST_LINE, TEST_LINE)
    worker.story.expect_rows(worker_reaches(worker)[0]["state"] == "failed", any("could not start" in line for line in worker.worker_lines()),
                             "state: testing" in worker.story.run("task show 1", actor=worker.story.agent).output_text, detail=str(worker.worker_lines()))
    worker.story.expect_success("task start 4", actor=worker.worker)


def unstartable_checkout(git, worktree, commit):
    raise Refusal("git worktree failed", "no such commit")


def test_39_a_run_stopped_by_the_time_limit_is_a_failure_with_the_reason(running_worker_run):
    worker = running_worker_run
    worker.end_tests(124, 0, 0, 0)
    worker.story.expect_rows(worker_reaches(worker)[0]["state"] == "failed", detail=str(worker_reaches(worker)))


def test_40_the_checkpoint_gate_stays_for_everyone_else(running_worker_run):
    worker = running_worker_run
    other = worker.added_worker("worker dispatch --test-command python=pytest --model sonnet --fresh \"second\" 4")
    other.story.expect_refusal("task start 4", "comes after checkpoint phase 1", actor=other.worker)


def test_41_a_shared_window_keeps_the_branch_run(new_story, monkeypatch):
    story = planned_story(new_story, build_test=BUILD_TEST)
    worker = dispatched_story_worker(story, "worker dispatch --test-command python=pytest --model sonnet 1 2", monkeypatch)
    commit_tasks(worker, TEST_LINE, SECOND_TEST_LINE)
    worker.story.expect_rows(worker_reaches(worker) == [], detail=str(rows(worker, REACHES)))


def test_42_the_merge_records_the_passed_windows_without_a_new_run(running_worker_run):
    worker = running_worker_run
    worker.end_all_tests()
    started_count = len(worker.started)
    merge(worker)
    worker.story.expect_rows(len(worker.started) == started_count, [row["phase_id"] for row in rows(worker, PASSES)] == [1], PASSED_LINE not in " | ".join(worker.main_agent_lines()),
                             detail=f"{run_lines(worker)} / {rows(worker, PASSES)}")


def last_window_worker(new_story, monkeypatch) -> StoryWorker:
    """The worker of the whole plan committed all four tasks; both windows ran and passed on its commit."""
    worker = plan_worker(new_story, monkeypatch)
    commit_tasks(worker, TEST_LINE, SECOND_TEST_LINE, TEST_LINE, SECOND_TEST_LINE)
    worker.end_all_tests()
    return worker


def test_43_the_last_window_does_not_run_on_the_branch_when_the_branch_did_not_move(new_story, monkeypatch):
    worker = last_window_worker(new_story, monkeypatch)
    started_count = len(worker.started)
    merge(worker)
    worker.story.expect_rows(len(worker.started) == started_count, detail=str(run_lines(worker)))


@pytest.mark.real_git
def test_43_the_last_window_runs_on_the_branch_when_the_branch_moved(new_story, monkeypatch):
    worker = last_window_worker(new_story, monkeypatch)
    worker.repository.committed("readme.md", "moved\n", "The branch moves")
    started_count = len(worker.started)
    merge(worker)
    worker.story.expect_rows(len(worker.started) > started_count, detail=str(run_lines(worker)))


def test_44_the_early_run_stays(new_story, monkeypatch):
    worker = checkpoint_worker(new_story, monkeypatch, TEST_LINE, SECOND_TEST_LINE, TEST_LINE)
    worker.story.expect_success("plan check 1 --environment main", actor=worker.story.agent)
    sources = [row["source"] for row in rows(worker, REACHES)]
    worker.story.expect_rows("early" in sources, detail=str(sources))
