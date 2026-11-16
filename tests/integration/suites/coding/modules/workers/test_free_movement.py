import pytest

from engine.database.database import READ_LIMIT_ROWS, Database
from core.modules.chat.models.journal_exception import JournalException
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH
from tests.stories.suites.coding.modules.workers.support.held_tasks import worker_with_tasks, proofs, prove_task, unplanned_worker_with_tasks
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, PLAN_DISPATCH, TEST_LINE, StoryWorker, approve_plan, dispatched_story_worker, planned_story

THREE_TASKS = 3
BLOCK_REASON = "the tax table is not there"
NEXT_ANSWER = "started task 2; nothing was committed or tested: journal worker commit does that"
SEVERAL_TASKS = 55


@pytest.fixture
def task_worker(played) -> StoryWorker:
    """A worker of phase Build that holds task 1 started; tasks 2 and 3 of the phase are open, and task 4 is the
    one task of phase Ship."""
    return worker_with_tasks(played, 1)


@pytest.fixture
def two_tasks(played) -> StoryWorker:
    """A worker of phase Build that holds tasks 1 and 2 started; task 3 of the phase is open."""
    return worker_with_tasks(played, 2)


@pytest.fixture
def after_a_checkpoint(played) -> StoryWorker:
    """Plan 1 has a third phase, Later, with task 5; phase Ship is a checkpoint that has not passed. A worker of
    the whole plan holds task 1 started."""
    story = planned_story(played, approve=False)
    story.run('phase edit 2 --checkpoint')
    story.run('phase make --plan 1 "Later"')
    story.run('task make "Clean up" --phase 3 --environment main')
    approve_plan(story)
    return dispatched_story_worker(story, PLAN_DISPATCH)


def startable_ids(worker: StoryWorker) -> list[int]:
    return [task["id"] for task in worker.status_json()["startable"]]








def test_21_worker_next_with_no_task_left_to_start_says_so_and_names_the_commit(played):
    worker = worker_with_tasks(played, THREE_TASKS)
    outcome = worker.story.run("worker next --wait", actor=worker.worker)
    worker.story.expect_rows("no task is left to start" in outcome.output_text, "journal worker commit" in outcome.output_text, detail=outcome.output_text)




def test_23_a_task_that_waits_on_a_task_of_another_agent_is_listed_to_start_once_that_task_is_closed(played):
    worker = unplanned_worker_with_tasks(played)
    story = worker.story
    audit = story.new_row_id('task make "Audit" --brief "The audit"', actor=story.agent)
    receipts = story.new_row_id('task make "Receipts" --brief "The receipts"', actor=story.agent)
    story.expect_success(f"task depend {receipts} --on {audit}", actor=story.agent)
    story.expect_success(f"worker send --wait {agent_number(story, worker.worker.id)} --task {receipts}", actor=story.agent)
    listed_while_waiting = startable_ids(worker)
    story.expect_success(f'task cancel {audit} --reason "no audit is needed"', actor=story.user)
    story.run_listeners()
    story.expect_rows(receipts not in listed_while_waiting, receipts in startable_ids(worker), detail=f"{listed_while_waiting} | {startable_ids(worker)}")




def test_the_status_of_a_worker_reads_a_checkpoint_phase_of_many_tasks_without_loading_them_all(played):
    story = planned_story(played, approve=False)
    story.run('phase edit 2 --checkpoint')
    for number in range(SEVERAL_TASKS):
        story.run(f'task make "Ship part {number}" --phase 2 --environment main')
    story.run('phase make --plan 1 "Later"')
    later_task = story.new_row_id('task make "Clean up" --phase 3 --environment main')
    approve_plan(story)
    worker = dispatched_story_worker(story, PHASE_DISPATCH)
    database = story.container.get(Database)
    database.read_limit_rows, database.collected_large_reads = READ_LIMIT_ROWS, None
    started = story.run("task start 2", actor=worker.worker)
    status = story.run("worker status", actor=worker.worker)
    faults = [row.message for row in story.story_rows(JournalException)]
    story.expect_rows(started.code == 0, status.code == 0, "Tasks you may start" in status.output_text, later_task not in startable_ids(worker), faults == [],
                      detail=f"{started.output_text} | {status.output_text} | {faults}")



