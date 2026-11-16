import pytest

from engine.database.database import READ_LIMIT_ROWS, Database
from core.modules.chat.models.journal_exception import JournalException
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH
from tests.stories.suites.coding.modules.workers.support.held_tasks import worker_with_tasks, proofs, prove_task, unplanned_worker_with_tasks
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, PLAN_DISPATCH, TEST_LINE, StoryWorker, approve_plan, dispatched_story_worker, planned_story

THREE_TASKS = 3
BLOCK_REASON = "the tax table is not there"
NEXT_ANSWER = "started task 2; nothing was committed or tested: journal worker commit does that"
SEVERAL_TASKS = 55


@pytest.fixture
def task_worker(new_story) -> StoryWorker:
    """A worker of phase Build that holds task 1 started; tasks 2 and 3 of the phase are open, and task 4 is the
    one task of phase Ship."""
    return worker_with_tasks(new_story, 1)


@pytest.fixture
def two_tasks(new_story) -> StoryWorker:
    """A worker of phase Build that holds tasks 1 and 2 started; task 3 of the phase is open."""
    return worker_with_tasks(new_story, 2)


@pytest.fixture
def after_a_checkpoint(new_story) -> StoryWorker:
    """Plan 1 has a third phase, Later, with task 5; phase Ship is a checkpoint that has not passed. A worker of
    the whole plan holds task 1 started."""
    story = planned_story(new_story, approve=False)
    story.run('phase edit 2 --checkpoint')
    story.run('phase make --plan 1 "Later"')
    story.run('task make "Clean up" --phase 3 --environment main')
    approve_plan(story)
    return dispatched_story_worker(story, PLAN_DISPATCH)


def startable_ids(worker: StoryWorker) -> list[int]:
    return [task["id"] for task in worker.status_json()["startable"]]


def test_19_a_task_that_waits_on_an_open_task_is_refused_with_the_task_it_waits_for(task_worker):
    task_worker.story.expect_success("task depend 3 --on 2", actor=task_worker.story.agent)
    refused = task_worker.story.run("task start 3", actor=task_worker.worker)
    task_worker.story.expect_rows(refused.code != 0, "task 3 is blocked: waits on task 2" in refused.output_text, detail=refused.output_text)


def test_20_71_a_worker_blocks_one_started_task_goes_on_with_another_and_the_main_agent_hears_who_can_unblock_it(two_tasks):
    story = two_tasks.story
    story.expect_success(f'task block 2 --reason "{BLOCK_REASON}"', actor=two_tasks.worker)
    started = story.run("task start 3", actor=two_tasks.worker)
    story.expect_text("task show 2", "state: blocked", actor=story.agent)
    story.expect_text("task show 1", "state: started", actor=story.agent)
    blocked_lines = [line for line in two_tasks.main_agent_lines() if "task:2" in line and "blocked" in line]
    story.expect_rows(started.code == 0, len(blocked_lines) == 1, "only you or a user can unblock it" in blocked_lines[0], detail=str(two_tasks.main_agent_lines()))


def test_21_205_worker_next_with_a_proved_task_starts_the_next_task_commits_and_tests_nothing_and_says_so(task_worker):
    prove_task(task_worker, 1, 1, TEST_LINE)
    tip = task_worker.repository.tip(task_worker.repository.worker_branch(task_worker.worker.id))
    outcome = task_worker.story.run("worker next --wait", actor=task_worker.worker)
    task_worker.story.run_listeners()
    task_worker.story.expect_text("task show 2", "state: started", actor=task_worker.story.agent)
    task_worker.story.expect_text("task show 1", "state: started", actor=task_worker.story.agent)
    task_worker.story.expect_rows(outcome.code == 0, NEXT_ANSWER in outcome.output_text, task_worker.repository.tip(task_worker.repository.worker_branch(task_worker.worker.id)) == tip,
                               [proof.state.value for proof in proofs(task_worker)] == ["shown"], task_worker.started == [], detail=outcome.output_text)




def test_22_the_status_lists_started_tasks_with_their_missing_points_tasks_to_start_and_blocked_tasks_with_their_reasons(two_tasks):
    story = two_tasks.story
    prove_task(two_tasks, 1, 1, TEST_LINE)
    story.expect_success(f'task block 2 --reason "{BLOCK_REASON}"', actor=two_tasks.worker)
    status, listed = two_tasks.status(), two_tasks.status_json()
    story.expect_rows("Tasks you may start: 1" in status, "task 3" in status, "Tasks blocked: 1" in status, BLOCK_REASON in status, startable_ids(two_tasks) == [3],
                      [task["id"] for task in listed["blocked"]] == [2], [task["id"] for task in listed["staged"]] == [1], detail=status)




def test_62_a_start_and_a_proof_of_a_task_one_worker_started_are_refused_to_another_worker_with_the_worker_that_holds_it(task_worker):
    receipts = task_worker.story.new_row_id('task make "Receipts" --environment main', actor=task_worker.story.agent)
    second = task_worker.added_worker(f"{DISPATCH.removesuffix(' 1')} {receipts}")
    refused = task_worker.story.run("task start 1", actor=second.worker)
    refused_proof = prove_task(second, 1, 1)
    holder_terms = f"task 1 is held by worker {task_worker.worker.id}"
    task_worker.story.expect_rows(refused.code != 0, holder_terms in refused.output_text, refused_proof.code != 0, holder_terms in refused_proof.output_text, proofs(task_worker) == (),
                               detail=f"{refused.output_text} | {refused_proof.output_text}")





def test_a_task_of_the_unit_another_worker_started_after_its_proof_is_listed_refused_and_not_counted_as_staged(two_tasks):
    story = two_tasks.story
    prove_task(two_tasks, 1, 1, TEST_LINE)
    story.expect_success('task release 1 --reason "another worker takes it over" --environment main', actor=story.user)
    receipts = story.new_row_id('task make "Receipts" --environment main', actor=story.agent)
    second = two_tasks.added_worker(f"{DISPATCH.removesuffix(' 1')} {receipts}")
    story.expect_success(f"task assign 1 --to {two_tasks.worker.id} --environment main", actor=story.agent)
    story.expect_success("task start 1 --environment main", actor=story.user)
    status = two_tasks.status()
    refused = prove_task(two_tasks, 1, 1, TEST_LINE)
    prepared = prove_task(two_tasks, 2, 1, TEST_LINE)
    story.expect_rows("Tasks someone else holds: 1" in status, "task 1" in status.split("Tasks someone else holds")[1],
                      refused.code != 0, "task 1 is held by" in refused.output_text,
                      "staged for task 2" in prepared.output_text, detail=f"{status} | {refused.output_text} | {prepared.output_text}")
