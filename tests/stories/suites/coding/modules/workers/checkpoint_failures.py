import pytest

from engine.testing.expectations.expect_reply import expect_reply_allowed

from tests.stories.core.support.agent_labels import agent_number

from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.support.output_folder import OutputFolder
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.ticks.stalled_worker_test_runs import StalledWorkerTestRuns
from tests.stories.suites.coding.modules.workers.checkpoint_runs import branch_runs_only, BUILD_TEST, CART_COMMAND, OUTLINE, PASSES, PICKER, REACHES, TOTALS_COMMAND, WAITING_PHASE_WORDS, merge, proofs_by_task, rows, run_lines
from tests.stories.suites.coding.modules.workers.checkpoint_runs import committed_window, running_checkpoint  # noqa: F401
from tests.stories.suites.coding.modules.workers.stopped_with_tasks import MERGER_ON
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.merger_launcher import merger_can_start, running_launcher
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, TEST_LINE, StoryWorker, dispatched_story_worker, file_proof_line, planned_story
from suites.coding.modules.workers.support.worker_nudges import WORKER_PHASE_TESTS_FAILED
from engine.testing.expectations.expect_nudge import said
from suites.coding.modules.workers.support.worker_settings import WORKER_PHASE_TEST_RUNS

SELECTED_TEST = "python3 run_tests.py"
FIXED_CART = "TOTAL = 2\n"
FIRST_RUN_SIZE = 3


def end_run(worker: StoryWorker, *failing_lines: str) -> None:
    """Ends every test of the run that goes, also one a test of the run starts: a test whose line is one of the
    failing lines fails, each other one passes."""
    running = [process for process in worker.started_processes() if process.state is ProcessState.RUNNING]
    while running:
        for process in running:
            worker.end_test(process.id, 1 if process.line in failing_lines else 0)
        running = [process for process in worker.started_processes() if process.state is ProcessState.RUNNING]


def output_id(worker: StoryWorker, line: str) -> int:
    return [process.id for process in worker.started_processes() if process.line == line][-1]


def print_output(worker: StoryWorker, line: str, text: str) -> None:
    worker.story.container.get(OutputFolder).write_output(output_id(worker, line), 1, text)


def failure_lines(worker: StoryWorker) -> list[str]:
    return [line for line in worker.worker_lines() if "tests failed" in line]


def expect_returned(worker: StoryWorker, *task_ids: int) -> None:
    for task_id in task_ids:
        worker.story.expect_text(f"task show {task_id}", "state: started", actor=worker.story.agent)
        worker.story.expect_text(f"task info {task_id}", f"assigned to: agent {worker.worker.id}", actor=worker.story.agent)


@pytest.fixture
def failed_cart_proof(running_checkpoint) -> StoryWorker:
    """The run of the checkpoint of phase 1 has ended: the proof test of task 1 failed, the proof test of task
    3 and the checkpoint's own test passed. The worker is woken to fix it, so a launcher runs."""
    with running_launcher(running_checkpoint.story):
        end_run(running_checkpoint, CART_COMMAND)
    return running_checkpoint


@pytest.fixture
def fixed_cart_proof(failed_cart_proof) -> StoryWorker:
    """The worker proved the point of the returned task 1 again and committed it, and that work is merged: the
    checkpoint of phase 1 is reached a second time and its second run goes."""
    worker = failed_cart_proof
    worker.repository.changed(worker.worker.id, "cart.py", FIXED_CART)
    worker.story.expect_success(f'proof make 1 --task 1 "cart.py:1, the fixed cart total" --test "{file_proof_line(TEST_LINE)}"', actor=worker.worker)
    worker.story.expect_success(COMMIT, actor=worker.worker)
    worker.story.run_listeners()
    merge(worker)
    return worker


def test_180_a_failed_proof_test_returns_its_task_to_the_worker_that_held_it_and_names_the_output(failed_cart_proof):
    worker, story = failed_cart_proof, failed_cart_proof.story
    proof, failed_output_id, reach = proofs_by_task(worker)[1], output_id(worker, CART_COMMAND), rows(worker, REACHES)[0]
    expect_returned(worker, 1)
    story.expect_text("task show 3", "state: completed", actor=story.agent)
    story.expect_rows(proof["state"] == "short", str(failed_output_id) in proof["shortfall"], said(WORKER_PHASE_TESTS_FAILED).is_in(' | '.join(failure_lines(worker))),
                      detail=f"{proof} | {worker.worker_lines()}")
    story.expect_rows(reach["state"] == "failed", reach["failed_task_ids"] == "1", WAITING_PHASE_WORDS in story.run(OUTLINE, actor=story.user).output_text, detail=str(reach))


def test_180_a_worker_with_two_failed_proof_tests_gets_both_tasks_and_one_line_with_both_outputs(running_checkpoint):
    worker = running_checkpoint
    end_run(worker, CART_COMMAND, TOTALS_COMMAND)
    lines = failure_lines(worker)
    expect_returned(worker, 1)
    worker.story.expect_text("task show 3", "state: open", actor=worker.story.agent)
    worker.story.expect_text("task info 3", f"assigned to: agent {worker.worker.id}", actor=worker.story.agent)
    worker.story.expect_text(f"agent-line list --agent {worker.worker.id}", f"Output {output_id(worker, CART_COMMAND)}, {output_id(worker, TOTALS_COMMAND)}")
    worker.story.expect_rows(len(lines) == 1, detail=str(worker.worker_lines()))


def test_182_a_failed_own_test_goes_to_the_task_whose_proof_names_the_failing_path(running_checkpoint):
    worker, story = running_checkpoint, running_checkpoint.story
    print_output(worker, BUILD_TEST, "FAILED tests/cart.py::test_total - assert 3 == 4\n")
    end_run(worker, BUILD_TEST)
    reach = rows(worker, REACHES)[0]
    expect_returned(worker, 1)
    story.expect_text("proof show 1", "state: checked", actor=story.agent)
    story.expect_rows(reach["failed_task_ids"] == "1", f"output {output_id(worker, BUILD_TEST)}" in " | ".join(failure_lines(worker)), detail=f"{reach} | {worker.worker_lines()}")


def test_183_a_failure_that_names_no_task_goes_to_the_task_completed_last_and_the_merger_gets_a_line(running_checkpoint, monkeypatch):
    worker, story = running_checkpoint, running_checkpoint.story
    merger_can_start(monkeypatch)
    story.expect_success(MERGER_ON, actor=story.user)
    print_output(worker, BUILD_TEST, "FAILED tests/receipts.py::test_print - assert 3 == 4\n")
    with running_launcher(story):
        end_run(worker, BUILD_TEST)
        merger_lines = " | ".join(line.text for line in story.story_rows(MergerLine))
        main_agent_lines = " | ".join(worker.main_agent_lines())
    expect_returned(worker, 3)
    story.expect_rows("task:3" in merger_lines, "names no task" in merger_lines, "tests failed" not in main_agent_lines, "task:3" not in main_agent_lines, detail=f"{merger_lines} || {main_agent_lines}")


def test_175_183_the_run_makes_the_selected_run_over_the_files_the_window_changed_and_its_failure_goes_to_a_task(committed_window):
    worker, story = committed_window, committed_window.story
    story.expect_success(f'setting set journal.suites.coding.workers.affected-tests-command "{PICKER}" --environment main')
    story.expect_success(f'setting set journal.suites.coding.workers.project-test-command "{SELECTED_TEST}" --environment main')
    merge(worker)
    picks = [line for line in run_lines(worker) if line.startswith(PICKER)]
    story.expect_rows(len(picks) == 1, "cart.py" in "".join(picks), detail=str(run_lines(worker)))
    print_output(worker, picks[0], "tests/receipts.py\n")
    end_run(worker, f"{SELECTED_TEST} tests/receipts.py")
    reach = rows(worker, REACHES)[0]
    expect_returned(worker, 3)
    story.expect_rows(reach["state"] == "failed", reach["failed_task_ids"] == "3", detail=f"{reach} | {run_lines(worker)}")


def test_187_a_failed_test_of_a_run_the_main_agent_started_early_returns_the_task_in_testing_to_its_worker(new_story, monkeypatch):
    branch_runs_only(monkeypatch)
    worker = dispatched_story_worker(planned_story(new_story), PHASE_DISPATCH, monkeypatch)
    worker.story.run("task start 2", actor=worker.worker)
    worker.prove_commit(TEST_LINE)
    StalledWorkerTestRuns()(worker.story.container)
    worker.story.expect_success("plan check 1", actor=worker.story.agent)
    worker.story.run_listeners()
    end_run(worker, CART_COMMAND)
    expect_returned(worker, 1)
    worker.story.expect_rows(proofs_by_task(worker)[1]["state"] == "short", len(failure_lines(worker)) == 1, detail=str(worker.worker_lines()))


def test_181_192_the_run_after_a_fix_runs_what_failed_and_the_own_test_and_its_pass_opens_the_later_phases(fixed_cart_proof):
    worker, story = fixed_cart_proof, fixed_cart_proof.story
    second_run = sorted(run_lines(worker)[FIRST_RUN_SIZE:])
    end_run(worker)
    passed_phase_ids, outline = [row["phase_id"] for row in rows(worker, PASSES)], story.run(OUTLINE, actor=story.user).output_text
    story.expect_rows(passed_phase_ids == [1], WAITING_PHASE_WORDS not in outline, [row["state"] for row in rows(worker, REACHES)] == ["failed", "passed"], detail=str(rows(worker, REACHES)))
    story.expect_rows(second_run == sorted([BUILD_TEST, CART_COMMAND]), proofs_by_task(worker)[3]["state"] == "checked", detail=str(run_lines(worker)))


@pytest.mark.real_git
def test_195_a_task_returned_after_its_merge_gets_a_new_worktree_cut_from_the_head_of_the_base_branch_and_keeps_its_proofs(running_checkpoint):
    worker, story = running_checkpoint, running_checkpoint.story
    worktrees = story.container.get(WorktreeQuery)
    merged_worktree = worktrees.worker_worktrees(worker.worker.id)[-1]
    end_run(worker, CART_COMMAND)
    returned_worktree = worktrees.worker_worktrees(worker.worker.id)[-1]
    story.expect_rows(returned_worktree.id != merged_worktree.id, returned_worktree.task_id == 1, returned_worktree.branch != merged_worktree.branch, returned_worktree.state == "cut",
                      returned_worktree.base_commit == worker.repository.tip(ENVIRONMENT_BRANCH), detail=f"{merged_worktree} | {returned_worktree}")
    worker.edit_prove(TEST_LINE)
    states = {task_id: proof["state"] for task_id, proof in proofs_by_task(worker).items()}
    story.expect_rows(states == {1: "shown", 2: "checked", 3: "checked"}, len(rows(worker, "proof list --json --oldest --limit 20")) == 3, detail=str(states))


def test_a_short_proof_left_on_a_released_worktree_fails_no_later_run_once_a_new_worktree_proved_its_point(failed_cart_proof):
    worker, story = failed_cart_proof, failed_cart_proof.story
    number = agent_number(story, worker.worker.id)
    story.expect_success(f'worker release {number} "its work is taken in by hand"', actor=story.agent)
    story.expect_success(f"worker send {number} --task 1 --wait", actor=story.agent)
    worker.repository.changed(worker.worker.id, "cart.py", FIXED_CART)
    story.expect_success(f'proof make 1 --task 1 "cart.py:1, the fixed cart total" --test "{file_proof_line(TEST_LINE)}"', actor=worker.worker)
    story.expect_success(COMMIT, actor=worker.worker)
    story.run_listeners()
    merge(worker)
    end_run(worker)
    story.expect_text("task show 1", "state: completed", actor=story.agent)
    story.expect_rows([row["state"] for row in rows(worker, REACHES)] == ["failed", "passed"], detail=str(rows(worker, REACHES)))


def test_a_worker_whose_checkpoint_tests_failed_runs_a_test_without_spending_its_count(failed_cart_proof):
    worker, story = failed_cart_proof, failed_cart_proof.story
    story.expect_success(f"setting set {WORKER_PHASE_TEST_RUNS} 0 --environment main", actor=story.user)
    story.expect_rows("Point: fix" in worker.status(), detail=worker.status())
    expect_reply_allowed(worker.run_test())
