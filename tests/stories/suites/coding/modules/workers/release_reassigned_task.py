from tests.stories.core.modules.tasks.support.holder_assignee_check import assignee_of
from tests.stories.core.support.agent_labels import agent_number
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.queries.task_query import TaskQuery
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from engine.testing.expectations.expect_row import expect_row


def test_releasing_the_first_worker_leaves_the_second_workers_started_task_unchanged(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    first_worker = dispatched_worker(story)
    story.expect_success('task release 1 --reason "another worker will take it"', actor=first_worker)
    second_worker = dispatched_worker(story)
    tasks = story.container.get(TaskQuery)
    task = tasks.find(1)
    expect_row(task, state=TaskState.STARTED)
    expect_row(task, holder_id=second_worker.id)
    story.expect_rows(assignee_of(story, task) == second_worker.id)

    story.expect_success(f'worker release {agent_number(story, first_worker.id)} "old worker stopped"', actor=story.agent)

    expect_tasks(tasks, 1, task)
    story.expect_success("worker-worktree show 1", "state: removed")
    repository.expect_no_folder(first_worker.id)


def expect_tasks(tasks, number, expected) -> None:
    actual = tasks.find(number)
    assert actual == expected, actual
