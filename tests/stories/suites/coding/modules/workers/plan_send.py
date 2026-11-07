import pytest

from core.base.query.queries import Queries
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from core.modules.tasks.models.task import Task
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.core.support.plan_steps import ready_plan
from tests.stories.suites.coding.modules.workers.kept_workers import stopped
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


@pytest.fixture
def idle_plan(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
    monkeypatch.setattr(ClaudeCodeProvider, "session_matches_folder", lambda provider, folder, session: True)
    stopped(story, worker)
    story.expect_success('plan make "Next plan" --environment main', actor=story.user)
    story.expect_success('phase make --plan 1 "Build"', actor=story.user)
    story.expect_success('phase make --plan 1 "Ship"', actor=story.user)
    for number, phase in ((2, 1), (3, 1), (4, 2)):
        task = story.new_row_id(f'task make "Task {number}" --environment main', actor=story.agent)
        story.expect_success(f"phase place {task} --phase {phase}", actor=story.agent)
    story.expect_success("task block 3 --on task:2", actor=story.agent)
    ready_plan(story, actor=story.user)
    story.expect_success("plan approve 1 --environment main", actor=story.user)
    return story, worker


def test_idle_worker_refusal_keeps_the_plan_and_phase(idle_plan):
    story, worker = idle_plan
    story.expect_refusal("worker dispatch --model sonnet --plan 1 --phase 1", f"journal worker send {worker.id} --plan 1 --phase 1", actor=story.agent)


def test_a_plan_sent_to_an_idle_worker_keeps_its_order_and_blocked_tasks(idle_plan):
    story, worker = idle_plan
    story.expect_success(f"worker send --wait {worker.id} --plan 1", actor=story.agent)
    tasks = story.container.get(Queries).query(Task).find_many([2, 3, 4])
    story.expect_rows(all(task.delegated_to == worker.id for task in tasks))
    story.expect_text("task show 2", "state: started", f"holder_id: {worker.id}", actor=story.agent)
    story.expect_text("plan inspect 1", "delegated", actor=story.agent)


def test_sending_one_phase_leaves_the_other_phase_unassigned(idle_plan):
    story, worker = idle_plan
    story.expect_success(f"worker send --wait {worker.id} --plan 1 --phase 1", actor=story.agent)
    tasks = story.container.get(Queries).query(Task).find_many([2, 3, 4])
    story.expect_rows(tasks[0].delegated_to == worker.id, tasks[1].delegated_to == worker.id, tasks[2].delegated_to is None)


def test_a_large_plan_dispatch_updates_dependencies_without_repeated_reads(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.expect_success('plan make "Many tasks" --environment main', actor=story.user)
    story.expect_success('phase make --plan 1 "Build"', actor=story.user)
    story.expect_success("phase place 1 --phase 1", actor=story.agent)
    for number in range(2, 15):
        task = story.new_row_id(f'task make "Task {number}" --environment main', actor=story.agent)
        story.expect_success(f"phase place {task} --phase 1", actor=story.agent)
        story.expect_success(f"task block {task} --on task:1", actor=story.agent)
    ready_plan(story, actor=story.user)
    story.expect_success("plan approve 1 --environment main", actor=story.user)
    worker = dispatched_worker(story, "worker dispatch --model sonnet --plan 1")
    tasks = story.container.get(Queries).query(Task).find_many(list(range(1, 15)))
    story.expect_rows(all(task.delegated_to == worker.id for task in tasks))
