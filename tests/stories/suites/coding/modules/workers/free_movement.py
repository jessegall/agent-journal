import pytest

from engine.database.database import READ_LIMIT_ROWS, Database
from engine.query.queries import Queries
from core.modules.chat.models.journal_exception import JournalException
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH
from tests.stories.suites.coding.modules.workers.support.held_tasks import holding_worker, proofs, prove_task, unplanned_holding_worker
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, PLAN_DISPATCH, TEST_LINE, StoryWorker, approve_plan, dispatched_story_worker, planned_story

THREE_TASKS = 3
BLOCK_REASON = "the tax table is not there"
NEXT_ANSWER = "started task 2; nothing was committed or tested: journal worker commit does that"
MANY_TASKS = 55


@pytest.fixture
def one_task(new_story, monkeypatch) -> StoryWorker:
    """A worker of phase Build that holds task 1 started; tasks 2 and 3 of the phase are open, and task 4 is the
    one task of phase Ship."""
    return holding_worker(new_story, monkeypatch, 1)


@pytest.fixture
def two_tasks(new_story, monkeypatch) -> StoryWorker:
    """A worker of phase Build that holds tasks 1 and 2 started; task 3 of the phase is open."""
    return holding_worker(new_story, monkeypatch, 2)


@pytest.fixture
def after_a_checkpoint(new_story, monkeypatch) -> StoryWorker:
    """Plan 1 has a third phase, Later, with task 5; phase Ship is a checkpoint that has not passed. A worker of
    the whole plan holds task 1 started."""
    story = planned_story(new_story, approve=False)
    story.run('phase edit 2 --checkpoint')
    story.run('phase make --plan 1 "Later"')
    story.run('task make "Clean up" --phase 3 --environment main')
    approve_plan(story)
    return dispatched_story_worker(story, PLAN_DISPATCH, monkeypatch)


def startable_ids(worker: StoryWorker) -> list[int]:
    return [task["id"] for task in worker.status_json()["startable"]]


def test_18_a_task_after_a_checkpoint_that_has_not_passed_is_refused_and_a_task_up_to_it_starts(after_a_checkpoint):
    worker = after_a_checkpoint
    refused = worker.story.run("task start 5", actor=worker.worker)
    started = worker.story.run("task start 4", actor=worker.worker)
    worker.story.expect_rows(refused.code != 0, "checkpoint" in refused.output_text, "phase 2" in refused.output_text, started.code == 0, detail=f"{refused.output_text} | {started.output_text}")


def test_19_a_task_that_waits_on_an_open_task_is_refused_with_the_task_it_waits_for(one_task):
    one_task.story.expect_success("task depend 3 --on 2", actor=one_task.story.agent)
    refused = one_task.story.run("task start 3", actor=one_task.worker)
    one_task.story.expect_rows(refused.code != 0, "task 3 is blocked: waits on task 2" in refused.output_text, detail=refused.output_text)


def test_20_71_a_worker_blocks_one_started_task_goes_on_with_another_and_the_main_agent_hears_who_can_unblock_it(two_tasks):
    story = two_tasks.story
    story.expect_success(f'task block 2 --reason "{BLOCK_REASON}"', actor=two_tasks.worker)
    started = story.run("task start 3", actor=two_tasks.worker)
    story.expect_text("task show 2", "state: blocked", actor=story.agent)
    story.expect_text("task show 1", "state: started", actor=story.agent)
    blocked_lines = [line for line in two_tasks.main_agent_lines() if "task:2" in line and "blocked" in line]
    story.expect_rows(started.code == 0, len(blocked_lines) == 1, "only you or the person can unblock it" in blocked_lines[0], detail=str(two_tasks.main_agent_lines()))


def test_21_205_worker_next_with_a_proved_task_starts_the_next_task_commits_and_tests_nothing_and_says_so(one_task):
    prove_task(one_task, 1, 1, TEST_LINE)
    tip = one_task.repository.tip(one_task.repository.worker_branch(one_task.worker.id))
    outcome = one_task.story.run("worker next --wait", actor=one_task.worker)
    one_task.story.run_listeners()
    one_task.story.expect_text("task show 2", "state: started", actor=one_task.story.agent)
    one_task.story.expect_text("task show 1", "state: started", actor=one_task.story.agent)
    one_task.story.expect_rows(outcome.code == 0, NEXT_ANSWER in outcome.output_text, one_task.repository.tip(one_task.repository.worker_branch(one_task.worker.id)) == tip,
                               [proof.state.value for proof in proofs(one_task)] == ["shown"], one_task.started == [], detail=outcome.output_text)


def test_21_worker_next_with_no_task_left_to_start_says_so_and_names_the_commit(new_story, monkeypatch):
    worker = holding_worker(new_story, monkeypatch, THREE_TASKS)
    outcome = worker.story.run("worker next --wait", actor=worker.worker)
    worker.story.expect_rows("no task is left to start" in outcome.output_text, "journal worker commit" in outcome.output_text, detail=outcome.output_text)


def test_22_the_status_lists_started_tasks_with_their_missing_points_tasks_to_start_and_blocked_tasks_with_their_reasons(two_tasks):
    story = two_tasks.story
    prove_task(two_tasks, 1, 1, TEST_LINE)
    story.expect_success(f'task block 2 --reason "{BLOCK_REASON}"', actor=two_tasks.worker)
    status, listed = two_tasks.status(), two_tasks.status_json()
    story.expect_rows("Tasks you may start: 1" in status, "task 3" in status, "Tasks blocked: 1" in status, BLOCK_REASON in status, startable_ids(two_tasks) == [3],
                      [task["id"] for task in listed["blocked"]] == [2], [task["id"] for task in listed["staged"]] == [1], detail=status)


def test_23_a_task_that_waits_on_a_task_of_another_agent_is_listed_to_start_once_that_task_is_closed(new_story, monkeypatch):
    worker = unplanned_holding_worker(new_story, monkeypatch)
    story = worker.story
    audit = story.new_row_id('task make "Audit" --brief "The audit"', actor=story.agent)
    receipts = story.new_row_id('task make "Receipts" --brief "The receipts"', actor=story.agent)
    story.expect_success(f"task depend {receipts} --on {audit}", actor=story.agent)
    story.expect_success(f"worker send --wait {agent_number(story, worker.worker.id)} --task {receipts}", actor=story.agent)
    listed_while_waiting = startable_ids(worker)
    story.expect_success(f'task cancel {audit} --reason "no audit is needed"', actor=story.user)
    story.run_listeners()
    story.expect_rows(receipts not in listed_while_waiting, receipts in startable_ids(worker), detail=f"{listed_while_waiting} | {startable_ids(worker)}")


def test_62_a_start_and_a_proof_of_a_task_one_worker_started_are_refused_to_another_worker_with_the_worker_that_holds_it(one_task):
    receipts = one_task.story.new_row_id('task make "Receipts" --environment main', actor=one_task.story.agent)
    second = one_task.added_worker(f"{DISPATCH.removesuffix(' 1')} {receipts}")
    refused = one_task.story.run("task start 1", actor=second.worker)
    refused_proof = prove_task(second, 1, 1)
    holder_words = f"task 1 is held by worker {agent_number(one_task.story, one_task.worker.id)}"
    one_task.story.expect_rows(refused.code != 0, holder_words in refused.output_text, refused_proof.code != 0, holder_words in refused_proof.output_text, proofs(one_task) == (),
                               detail=f"{refused.output_text} | {refused_proof.output_text}")


def test_the_status_of_a_worker_reads_a_checkpoint_phase_of_many_tasks_without_loading_them_all(new_story, monkeypatch):
    story = planned_story(new_story, approve=False)
    story.run('phase edit 2 --checkpoint')
    for number in range(MANY_TASKS):
        story.run(f'task make "Ship part {number}" --phase 2 --environment main')
    story.run('phase make --plan 1 "Later"')
    later_task = story.new_row_id('task make "Clean up" --phase 3 --environment main')
    approve_plan(story)
    worker = dispatched_story_worker(story, PHASE_DISPATCH, monkeypatch)
    database = story.container.get(Database)
    database.read_limit_rows, database.collected_large_reads = READ_LIMIT_ROWS, None
    started = story.run("task start 2", actor=worker.worker)
    status = story.run("worker status", actor=worker.worker)
    faults = [row.message for row in story.container.get(Queries).query(JournalException).all_rows()]
    story.expect_rows(started.code == 0, status.code == 0, "Tasks you may start" in status.output_text, later_task not in startable_ids(worker), faults == [],
                      detail=f"{started.output_text} | {status.output_text} | {faults}")

