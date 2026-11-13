import json

from engine.actor.actor import Actor
from suites.coding.modules.workers.support.available_work import AvailableWork
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.plan_assignment import story_with_two_workers
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.support.phase_steps import PLAN_DISPATCH, dispatched_story_worker, planned_story, single_task_worker, unplanned_worker
from tests.stories.suites.coding.support.main_controls_fixture import scope_line

RECEIPT = 'task make "Print the receipt" --brief "Print it" --environment main'


def startable_ids(story, worker: Actor) -> list[int]:
    return [task["id"] for task in json.loads(story.run("worker status --json", actor=worker).output_text)["startable"]]


def delegatable(story) -> tuple[int, ...]:
    with scope_line(story):
        return story.container.get(AvailableWork).answer(story.agent.id).delegatable


def test_the_main_agent_assigns_a_task_to_a_worker_and_the_workers_next_task_and_status_show_it(new_story, monkeypatch):
    worker = single_task_worker(new_story, monkeypatch)
    story = worker.story
    receipt = story.new_row_id(RECEIPT, actor=story.agent)
    story.expect_rows(startable_ids(story, worker.worker) == [])
    story.expect_success(f"task assign {receipt} --to {agent_number(story, worker.worker.id)}", actor=story.agent)
    story.expect_text(f"task info {receipt}", f"assigned to: agent {worker.worker.id}", actor=story.agent)
    story.expect_rows(startable_ids(story, worker.worker) == [receipt], detail=worker.status())
    story.expect_success("worker next --wait", actor=worker.worker)
    story.expect_text(f"task show {receipt}", "state: started", f"holder_id: {worker.worker.id}", actor=story.agent)


def test_a_workers_next_task_is_the_first_in_plan_order_of_its_assigned_open_tasks_that_wait_on_nothing(new_story, monkeypatch):
    worker = dispatched_story_worker(planned_story(new_story), PLAN_DISPATCH, monkeypatch)
    story = worker.story
    story.expect_success("task depend 2 --on 3", actor=story.agent)
    story.expect_success("task edit 4 --priority high", actor=story.agent)
    story.expect_rows(2 not in startable_ids(story, worker.worker), {3, 4} <= set(startable_ids(story, worker.worker)), detail=worker.status())
    story.expect_success("worker next --wait", actor=worker.worker)
    story.expect_text("task show 3", "state: started", actor=story.agent)
    story.expect_text("task show 2", "state: open", actor=story.agent)
    story.expect_text("task show 4", "state: open", actor=story.agent)


def test_a_free_task_is_never_offered_to_a_worker(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    story = worker.story
    story.expect_success("task start 2", actor=worker.worker)
    free = story.new_row_id(RECEIPT, actor=story.agent)
    story.expect_rows(startable_ids(story, worker.worker) == [], detail=worker.status())
    refused = story.run("worker next --wait", actor=worker.worker)
    story.expect_rows(refused.code != 0, "no task is left to start" in refused.output_text, detail=refused.output_text)
    story.expect_text(f"task show {free}", "state: open", actor=story.agent)
    story.expect_text(f"task info {free}", "assigned to: nobody", actor=story.agent)


def test_the_moment_a_task_is_assigned_to_a_worker_status_the_next_task_start_and_the_stop_check_see_it(new_story, monkeypatch):
    worker = single_task_worker(new_story, monkeypatch)
    story = worker.story
    story.expect_success('task block 1 --reason "waits for a user"', actor=worker.worker)
    story.expect_rows(not worker.stop().refusal, detail=worker.status())
    receipt = story.new_row_id(RECEIPT, actor=story.agent)
    story.expect_success(f"task assign {receipt} --to {agent_number(story, worker.worker.id)}", actor=story.agent)
    story.expect_rows(startable_ids(story, worker.worker) == [receipt], detail=worker.status())
    assigned_stop = worker.stop().refusal
    story.expect_rows(f"Task {receipt}" in assigned_stop, detail=assigned_stop)
    story.expect_success("worker next --wait", actor=worker.worker)
    story.expect_text(f"task show {receipt}", "state: started", actor=story.agent)


def test_a_task_assigned_to_worker_a_is_not_offered_to_worker_b_whatever_its_priority(new_story, monkeypatch):
    story, first, second = story_with_two_workers(new_story)
    urgent = story.new_row_id('task make "Urgent job" --priority critical --environment main', actor=story.agent)
    story.expect_success(f"task assign {urgent} --to {agent_number(story, first.id)}", actor=story.agent)
    story.expect_rows(urgent in startable_ids(story, first), urgent not in startable_ids(story, second))


def test_available_work_lists_only_unassigned_tasks(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.expect_success(RECEIPT, actor=story.agent)
    story.expect_success(f"task assign 2 --to {agent_number(story, story.agent.id)}", actor=story.agent)
    story.expect_rows(delegatable(story) == tuple([1]), detail=str(delegatable(story)))


def test_a_task_anyone_has_is_not_in_available_work(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    story = worker.story
    story.expect_success('task make "Free job" --brief "Do it" --environment main', actor=story.agent)
    story.expect_rows(delegatable(story) == tuple([3]), detail=str(delegatable(story)))
