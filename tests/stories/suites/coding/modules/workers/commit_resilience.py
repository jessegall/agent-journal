import pytest

from engine.testing.examples.hook_samples import HookSamples
from suites.coding.modules.workers.commands.commit_worker_work.commit_worker_work_handler import CommitWorkerWorkHandler
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.commands.commit_worker_work.worker_task_commit import WorkerTaskCommit
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.hand_in_rebase import StoppedDelivery
from tests.stories.suites.coding.modules.workers.phase_unfinished import expect_open_undelegated
from tests.stories.suites.coding.modules.workers.queued_commands import operation_story
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.held_tasks import proofs, prove_task, unplanned_holding_worker
from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, TEST_LINE, StoryWorker
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_LIMIT

THREE_TASKS = 3
LATE_PROOF = 'proof make 1 --task 3 "cart.py:1, the cart total"'


def prove_first_two(worker: StoryWorker) -> StoryWorker:
    prove_task(worker, 1, 1, TEST_LINE)
    prove_task(worker, 2, 1, SECOND_TEST_LINE)
    return worker


def branch_tip(worker: StoryWorker) -> str:
    return worker.repository.tip(worker.repository.worker_branch(worker.worker.id))


def expect_task_states(worker: StoryWorker, state: str, *task_ids: int) -> None:
    for task_id in task_ids:
        worker.story.expect_text(f"task show {task_id}", f"state: {state}", actor=worker.story.agent)


@pytest.fixture
def two_proved(new_story, monkeypatch) -> StoryWorker:
    """A worker that holds tasks 1 and 2 started, in no plan, and proved each with a test."""
    return prove_first_two(unplanned_holding_worker(new_story, monkeypatch))


@pytest.fixture
def two_of_three_proved(new_story, monkeypatch) -> StoryWorker:
    """A worker that holds tasks 1, 2 and 3 started, in no plan, and proved tasks 1 and 2 with a test each."""
    return prove_first_two(unplanned_holding_worker(new_story, monkeypatch, THREE_TASKS))


def test_60_a_second_commit_right_after_the_first_finds_nothing_staged_and_makes_no_second_git_commit(two_of_three_proved):
    worker = two_of_three_proved
    worker.story.expect_success(COMMIT, actor=worker.worker)
    committed_tip = branch_tip(worker)
    refused = worker.story.run(COMMIT, actor=worker.worker)
    worker.story.expect_rows(refused.code != 0, "nothing is staged" in refused.output_text, branch_tip(worker) == committed_tip, detail=refused.output_text)


def test_61_a_proof_shown_while_a_commit_runs_is_no_part_of_it_and_waits_for_the_next_commit(two_of_three_proved, monkeypatch):
    worker, story = two_of_three_proved, two_of_three_proved.story
    git_commit = WorkerTaskCommit.commit

    def commit_then_late_proof(task_commit, *arguments):
        git_commit(task_commit, *arguments)
        with operation_story(story) as second_story:
            second_story.run(LATE_PROOF, actor=worker.worker)

    monkeypatch.setattr(WorkerTaskCommit, "commit", commit_then_late_proof)
    outcome = story.run(COMMIT, actor=worker.worker)
    expect_task_states(worker, "started", 3)
    story.expect_rows(outcome.code == 0, "committed tasks 1, 2 as " in outcome.output_text, [(proof.task_id, proof.state) for proof in proofs(worker)][-1] == (3, ProofState.SHOWN), detail=outcome.output_text)


def test_63_a_worker_whose_program_stopped_keeps_its_shown_proofs_is_told_of_them_at_its_restart_and_commits(two_proved):
    worker, story = two_proved, two_proved.story
    worker.program_ended()
    opening = story.hook(worker.session, HookSamples.session_start())
    opening_text = " ".join(opening.lines)
    story.expect_success(COMMIT, actor=worker.worker)
    story.expect_rows(all(f"task:{task_id}" in opening_text for task_id in (1, 2)), "Tasks 1, 2 are proven" in opening_text, "journal worker commit" in opening_text, detail=opening_text)


def test_64_a_commit_whose_program_stopped_after_the_git_commit_is_taken_again_without_a_second_git_commit(two_proved, monkeypatch):
    worker, story = two_proved, two_proved.story
    finish_rows = CommitWorkerWorkHandler.handle
    stopped_commands = []

    def stopped_at_the_first(handler, command, context):
        if not stopped_commands:
            stopped_commands.append(command)
            raise StoppedDelivery()
        return finish_rows(handler, command, context)

    monkeypatch.setattr(CommitWorkerWorkHandler, "handle", stopped_at_the_first)
    with pytest.raises(StoppedDelivery):
        story.run(COMMIT, actor=worker.worker)
    story.expect_text("proof list", "shown", actor=story.agent)
    stopped_tip = branch_tip(worker)
    story.expect_success(COMMIT, actor=worker.worker)
    expect_task_states(worker, "testing", 1, 2)
    story.expect_rows(branch_tip(worker) == stopped_tip, detail=f"{stopped_tip} | {branch_tip(worker)}")


def test_65_a_worker_released_after_an_interim_commit_leaves_its_started_task_open_and_keeps_its_shown_proof_and_its_branch(two_of_three_proved):
    worker, story = two_of_three_proved, two_of_three_proved.story
    story.expect_success(COMMIT, actor=worker.worker)
    prove_task(worker, 3, 1)
    story.expect_success(f'worker release {agent_number(story, worker.worker.id)} --abandon "the plan changed"', actor=story.agent)
    expect_open_undelegated(worker, 3)
    story.expect_rows(proofs(worker)[-1].state is ProofState.SHOWN, bool(branch_tip(worker)), detail=str(proofs(worker)[-1]))


def test_66_a_task_cancelled_after_its_proof_was_shown_is_named_as_left_out_of_the_commit(two_proved):
    worker, story = two_proved, two_proved.story
    story.expect_success('task cancel 2 --reason "the tax is dropped"', actor=story.user)
    outcome = story.run(COMMIT, actor=worker.worker)
    expect_task_states(worker, "testing", 1)
    story.expect_rows(outcome.code == 0, "task 2 is cancelled and left out" in outcome.output_text, detail=outcome.output_text)


def test_a_commit_of_a_worker_whose_row_a_restart_ended_while_its_program_runs_goes_through_and_the_worker_goes_on(two_of_three_proved):
    worker, story = two_of_three_proved, two_of_three_proved.story
    free_task = story.new_row_id('task make "Free job" --brief "A small job" --complexity 1 --environment main', actor=story.agent)
    story.expect_success(f"agent end {worker.worker.id}", actor=story.agent)
    outcome = story.run(COMMIT, actor=worker.worker)
    late_proof = prove_task(worker, 3, 1)
    story.expect_rows(outcome.code == 0, "go on with task 3" in outcome.output_text, late_proof.code == 0, detail=f"{outcome.output_text} | {late_proof.output_text}")
    expect_task_states(worker, "testing", 1, 2)
    expect_task_states(worker, "started", 3)
    expect_open_undelegated(worker, free_task)





def test_while_more_workers_run_than_the_limit_a_finished_worker_gets_no_free_task_and_a_send_of_tasks_is_refused(two_proved):
    worker, story = two_proved, two_proved.story
    free_task = story.new_row_id('task make "Free job" --brief "A small job" --complexity 1 --environment main', actor=story.agent)
    story.expect_success(f"setting set {WORKER_RUN_LIMIT} 0 --environment main", actor=story.user)
    outcome = story.run(COMMIT, actor=worker.worker)
    story.expect_rows(outcome.code == 0, detail=outcome.output_text)
    expect_open_undelegated(worker, free_task)
    story.expect_refusal(f"worker send {agent_number(story, worker.worker.id)} --task {free_task}", "the running limit is 0", actor=story.agent)
    expect_open_undelegated(worker, free_task)
