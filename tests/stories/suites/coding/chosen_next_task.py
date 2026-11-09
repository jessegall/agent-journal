import pytest

from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask
from suites.coding.support.next_task import NextTask
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment


def new_task(story, title, *flags):
    return story.new_row_id(f'task make "{title}" --brief "Do it" {" ".join(flags)}', actor=story.agent)


def next_for_main_agent(story):
    return story.container.get(NextTask).following(story.agent.id).id


@pytest.fixture
def two_tasks(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    return story, new_task(story, "Second job"), new_task(story, "Third job")


@pytest.fixture
def worker_with_task(two_tasks):
    story, second, _ = two_tasks
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f"task assign {second} --to {worker.id}", actor=story.agent)
    return story, worker, second


def test_a_chosen_task_goes_before_a_critical_task(two_tasks):
    story, second, _ = two_tasks
    new_task(story, "Urgent job", "--priority critical")
    story.expect_success(f"task next {second}", actor=story.agent)
    story.expect_rows(next_for_main_agent(story) == second)


def test_the_main_agent_chooses_for_a_worker(worker_with_task):
    story, worker, second = worker_with_task
    story.expect_success(f"task next {second} --agent {worker.id}", actor=story.agent)
    story.expect_rows(story.container.get(WorkerNextTask).following(worker.id).id == second)


def test_a_worker_cannot_choose_for_another_agent(worker_with_task):
    story, worker, second = worker_with_task
    story.expect_refusal(f"task next {second} --agent {story.agent.id}", "only a main agent", actor=worker)


def test_a_task_that_belongs_to_another_agent_is_refused(worker_with_task):
    story, worker, second = worker_with_task
    story.expect_refusal(f"task next {second}", f"reserved for agent {worker.id}", actor=story.agent)


@pytest.mark.parametrize(("line", "state"), [('task cancel {task} --reason "No longer needed"', "cancelled"), ('task block {task} --reason "Waits on a key"', "blocked")])
def test_a_task_that_is_not_open_is_refused(two_tasks, line, state):
    story, second, _ = two_tasks
    story.expect_success(line.format(task=second), actor=story.agent)
    story.expect_refusal(f"task next {second}", f"task {second} is {state}", actor=story.agent)


def test_a_chosen_task_blocked_afterwards_waits_and_is_next_once_it_opens(two_tasks):
    story, second, third = two_tasks
    story.expect_success(f"task next {third}", actor=story.agent)
    story.expect_success(f'task block {third} --reason "Waits on a key"', actor=story.agent)
    story.expect_rows(next_for_main_agent(story) != third)
    story.expect_success(f"task unblock {third}", actor=story.agent)
    story.expect_rows(next_for_main_agent(story) == third, second != third)


def test_a_chosen_task_given_to_another_agent_is_no_longer_next(worker_with_task):
    story, worker, second = worker_with_task
    story.expect_success(f"task assign {second} --to {story.agent.id}", actor=story.agent)
    story.expect_success(f"task next {second}", actor=story.agent)
    story.expect_success(f"task assign {second} --to {worker.id}", actor=story.agent)
    story.expect_rows(next_for_main_agent(story) != second)


def test_after_the_chosen_task_the_assigner_picks_again(two_tasks):
    story, _, third = two_tasks
    story.expect_success(f"task next {third}", actor=story.agent)
    story.expect_success(f"task start {third}", actor=story.agent)
    story.expect_success(f'task close {third} --outcome "Done"', actor=story.agent)
    story.expect_rows(next_for_main_agent(story) != third)
