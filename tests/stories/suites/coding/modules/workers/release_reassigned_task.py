from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.queries.task_query import TaskQuery
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment


def test_releasing_the_first_worker_leaves_the_second_workers_started_task_unchanged(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    first_worker = dispatched_worker(story)
    story.expect_success('task release 1 --reason "another worker will take it"', actor=first_worker)
    second_worker = dispatched_worker(story)
    tasks = story.container.get(TaskQuery)
    task = tasks.find(1)
    assert task.state is TaskState.STARTED
    assert task.holder_id == second_worker.id
    assert task.delegated_to == second_worker.id

    story.expect_success(f'worker release {first_worker.id} "old worker stopped"', actor=story.agent)

    assert tasks.find(1) == task
    story.expect_success("worker-worktree show 1", "state: removed")
    repository.expect_no_folder(first_worker.id)
