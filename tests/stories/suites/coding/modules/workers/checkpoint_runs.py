import json
from pathlib import Path

import pytest

from core.modules.processes.models.enums.process_state import ProcessState
from suites.coding.modules.workers.listeners.worker_test_listener import WorkerTestListener
from suites.coding.modules.workers.ticks.stalled_worker_test_runs import StalledWorkerTestRuns
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, PLAN_DISPATCH, SECOND_TEST_LINE, TEST_LINE, StoryWorker, dispatched_story_worker, planned_story

REACHES = "checkpoint-reach list --json --oldest --environment main"
PASSES = "checkpoint-pass list --json --oldest --environment main"
BUILD_TEST = "python tests/build.py"
SHIP_TEST = "python tests/ship.py"
CHECKPOINT_FLAG = " --checkpoint"
PICKER = "python3 pick.py"
CART_COMMAND = "pytest tests/cart.py"
TOTALS_COMMAND = "pytest tests/totals.py"
OUTLINE = "plan outline 1 --environment main"
WAITING_PHASE_WORDS = "waits for the tests of phase 1"
PASSED_LOG = "tests passed at checkpoint phase 1"
PASSED_LINE = "the tests of checkpoint phase Build passed"
PLAN_FINISHED_LINE = "plan 1 done"
UNTESTED_LINE = "waits on your check, proofs 2"
WINDOW_TASKS = (1, 2, 3)


def rows(worker: StoryWorker, line: str) -> list[dict[str, object]]:
    return json.loads(worker.story.run(line, actor=worker.story.agent).output_text)["rows"]


def proofs_by_task(worker: StoryWorker) -> dict[int, dict[str, object]]:
    return {row["task_id"]: row for row in rows(worker, "proof list --json --oldest --limit 20")}


def run_lines(worker: StoryWorker) -> list[str]:
    return [process.line for process in worker.started_processes()]


def commit_tasks(worker: StoryWorker, *test_lines: str) -> None:
    """The worker proves one task for each test line, the empty line being a proof with no test, and commits
    them all; the main agent checks each proof that has no test."""
    for test_line in test_lines[:-1]:
        worker.prove_advance(test_line)
    worker.prove(test_lines[-1])
    worker.story.run(COMMIT, actor=worker.worker)
    worker.story.run_listeners()
    for proof_id, test_line in enumerate(test_lines, 1):
        if not test_line:
            worker.story.run(f"proof check {proof_id}", actor=worker.story.agent)


def merge(worker: StoryWorker) -> None:
    number = agent_number(worker.story, worker.worker.id)
    worker.repository.checkout(ENVIRONMENT_BRANCH)
    worker.story.run(f"worker logs {number}", actor=worker.story.agent)
    worker.story.expect_success(f"worker merge --wait {number}", actor=worker.story.agent)
    worker.story.run_listeners()


def checkpoint_worker(new_story, monkeypatch, *test_lines: str) -> StoryWorker:
    """A worker of a started plan whose phase Build is a checkpoint with a test of its own; it committed tasks
    1, 2 and 3 of that phase with the given test lines."""
    worker = dispatched_story_worker(planned_story(new_story, build_test=BUILD_TEST, build_flags=CHECKPOINT_FLAG), PHASE_DISPATCH, monkeypatch)
    commit_tasks(worker, *test_lines)
    return worker


@pytest.fixture
def committed_window(new_story, monkeypatch) -> StoryWorker:
    """Tasks 1 and 3 of the checkpoint phase are committed with a test each and task 2 with a checked proof of
    no test; the worktree is not merged."""
    return checkpoint_worker(new_story, monkeypatch, TEST_LINE, "", SECOND_TEST_LINE)


@pytest.fixture
def running_checkpoint(committed_window) -> StoryWorker:
    """The window of committed_window is merged, so the checkpoint of phase 1 is reached and its run goes."""
    merge(committed_window)
    return committed_window


@pytest.fixture
def ended_plan(new_story, monkeypatch) -> StoryWorker:
    """A started plan with no flagged checkpoint whose four tasks are committed with a test each and merged:
    the end of the plan is reached. Phase Build has a test of its own, the last phase Ship has none."""
    worker = dispatched_story_worker(planned_story(new_story, build_test=BUILD_TEST), PLAN_DISPATCH, monkeypatch)
    commit_tasks(worker, TEST_LINE, SECOND_TEST_LINE, TEST_LINE, SECOND_TEST_LINE)
    merge(worker)
    return worker


@pytest.mark.real_git
def test_172_the_journal_starts_the_run_itself_on_the_head_of_the_base_branch_and_moves_no_checkout(running_checkpoint):
    worker, repository = running_checkpoint, running_checkpoint.repository
    listed = worker.story.run("process list --json --limit 10", actor=worker.story.agent).output_text
    folders = {row["folder"] for row in json.loads(listed)["rows"] if row["id"] in worker.started}
    commits = {repository.git("rev-parse", "HEAD", folder=Path(folder)).stdout.strip() for folder in folders}
    repository.expect_head(ENVIRONMENT_BRANCH)
    worker.story.expect_rows(len(folders) == 1, str(repository.folder) not in folders, commits == {repository.tip(ENVIRONMENT_BRANCH)},
                             repository.git("status", "--porcelain").stdout == "", rows(worker, REACHES)[0]["state"] == "running", detail=f"{folders}, {commits}")


def test_173_the_run_runs_each_committed_proof_of_the_window_by_its_own_command_once_for_each_proof(new_story, monkeypatch):
    worker = checkpoint_worker(new_story, monkeypatch, TEST_LINE, TEST_LINE, SECOND_TEST_LINE)
    merge(worker)
    commands, lines = {task_id: proof["test_command"] for task_id, proof in proofs_by_task(worker).items()}, run_lines(worker)
    worker.story.expect_rows(lines.count(commands[1]) == 2, lines.count(commands[3]) == 1, detail=f"{commands}, {lines}")


def test_174_the_run_runs_the_test_of_the_checkpoint_phase_once(running_checkpoint):
    lines = run_lines(running_checkpoint)
    running_checkpoint.story.expect_rows(lines.count(BUILD_TEST) == 1, detail=str(lines))


def test_174_the_end_of_a_plan_with_no_flagged_phase_runs_the_test_of_its_last_phase_and_of_no_other(ended_plan):
    lines = run_lines(ended_plan)
    ended_plan.story.expect_rows(len(lines) == 4, BUILD_TEST not in lines, detail=str(lines))


def test_176_a_proof_with_no_test_is_not_run_and_the_main_agent_has_its_one_line(running_checkpoint):
    worker = running_checkpoint
    lines = [line for line in worker.main_agent_lines() if UNTESTED_LINE in line]
    worker.story.expect_rows(sorted(run_lines(worker)) == sorted([BUILD_TEST, CART_COMMAND, TOTALS_COMMAND]), len(lines) == 1, detail=f"{run_lines(worker)}, {worker.main_agent_lines()}")


def test_177_a_pass_checks_the_proofs_logs_on_each_task_of_the_window_and_tells_the_main_agent_once(running_checkpoint):
    worker = running_checkpoint
    worker.end_all_tests()
    states = {task_id: proof["state"] for task_id, proof in proofs_by_task(worker).items()}
    for task_id in WINDOW_TASKS:
        worker.story.expect_text(f"task-log list --task {task_id}", PASSED_LOG, actor=worker.story.agent)
    passed_lines = [line for line in worker.main_agent_lines() if PASSED_LINE in line]
    worker.story.expect_rows(set(states.values()) == {"checked"}, len(passed_lines) == 1, rows(worker, REACHES)[0]["state"] == "passed", detail=f"{states}, {worker.main_agent_lines()}")


def test_178_a_pass_saves_the_pass_of_the_checkpoint_and_the_next_phase_waits_for_its_tests_no_more(running_checkpoint):
    worker, story = running_checkpoint, running_checkpoint.story
    waiting_outline = story.run(OUTLINE, actor=story.user).output_text
    worker.end_all_tests()
    passed_outline = story.run(OUTLINE, actor=story.user).output_text
    story.expect_rows(WAITING_PHASE_WORDS in waiting_outline, WAITING_PHASE_WORDS not in passed_outline, [row["phase_id"] for row in rows(worker, PASSES)] == [1],
                      detail=f"{waiting_outline} | {passed_outline}")


def test_179_a_plan_is_finished_by_the_pass_at_its_end_and_not_by_its_last_merge(ended_plan):
    story = ended_plan.story
    merged_lines = " | ".join(ended_plan.main_agent_lines())
    story.expect_text("plan show 1", "state: started", actor=story.agent)
    ended_plan.end_all_tests()
    story.expect_text("plan show 1", "state: completed", actor=story.agent)
    story.expect_rows(PLAN_FINISHED_LINE not in merged_lines, PLAN_FINISHED_LINE in " | ".join(ended_plan.main_agent_lines()), detail=merged_lines)


def test_179_a_plan_whose_run_at_its_end_failed_is_not_finished(ended_plan):
    ended_plan.end_tests(1, 0, 0, 0)
    ended_plan.story.expect_text("plan show 1", "state: started", actor=ended_plan.story.agent)
    ended_plan.story.expect_rows(PLAN_FINISHED_LINE not in " | ".join(ended_plan.main_agent_lines()), rows(ended_plan, REACHES)[0]["state"] == "failed", detail=str(rows(ended_plan, REACHES)))


def test_184_a_task_added_to_the_window_while_its_run_goes_is_not_in_that_run(running_checkpoint):
    worker, story = running_checkpoint, running_checkpoint.story
    task_id = story.new_row_id('task make "Receipts" --environment main')
    story.run(f"phase place {task_id} --phase 1")
    started_count = len(worker.started)
    worker.end_all_tests()
    reach = rows(worker, REACHES)[0]
    story.expect_rows(len(worker.started) == started_count, reach["task_ids"] == "1,2,3", reach["state"] == "passed", detail=f"{reach}, {run_lines(worker)}")


def test_189_the_run_of_a_second_checkpoint_waits_for_the_run_of_the_first_to_end(running_checkpoint):
    worker, story = running_checkpoint, running_checkpoint.story
    story.expect_success(f'phase edit 2 --test-command "{SHIP_TEST}"', actor=story.user)
    story.run("task start 4", actor=story.agent)
    story.expect_success('task close 4 --outcome "nothing to release"', actor=story.agent)
    story.run_listeners()
    waiting_lines = run_lines(worker)
    worker.end_all_tests()
    story.expect_rows(SHIP_TEST not in waiting_lines, run_lines(worker).count(SHIP_TEST) == 1, [row["state"] for row in rows(worker, REACHES)] == ["passed", "passed"],
                      detail=f"{waiting_lines} | {run_lines(worker)} | {rows(worker, REACHES)}")


def test_193_a_plan_cancelled_while_a_run_goes_stops_the_run_and_tells_the_main_agent_of_no_result(running_checkpoint):
    worker, story = running_checkpoint, running_checkpoint.story
    story.expect_success('plan cancel 1 --reason "the cart is dropped"', actor=story.user)
    story.run_listeners()
    states = {process.state for process in worker.started_processes()}
    lines = " | ".join(worker.main_agent_lines())
    for task_id in WINDOW_TASKS:
        story.expect_text(f"task show {task_id}", "state: completed", actor=story.agent)
    story.expect_rows(states == {ProcessState.STOPPED}, PASSED_LINE not in lines, "failed" not in lines, detail=f"{states}, {lines}")


def test_194_the_proof_tests_of_a_run_a_server_update_left_queued_are_started_by_the_sweep_of_waiting_tests(committed_window, monkeypatch):
    worker = committed_window
    with monkeypatch.context() as stopped_server:
        stopped_server.setattr(WorkerTestListener, "start_next", lambda listener, logged: None)
        merge(worker)
    unstarted_count = len(worker.started)
    StalledWorkerTestRuns()(worker.story.container)
    worker.story.run_listeners()
    worker.story.expect_rows(unstarted_count == 1, len(worker.started) == 3, rows(worker, REACHES)[0]["state"] == "running", detail=f"{unstarted_count}, {run_lines(worker)}")
