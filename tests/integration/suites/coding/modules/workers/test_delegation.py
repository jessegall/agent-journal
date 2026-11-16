from tests.stories.suites.coding.modules.workers.delegation import expect_next_open_tasks
from tests.stories.suites.coding.modules.workers.delegation import expect_ready_plan_tasks
import pytest

from core.modules.plans.support.next_plan_tasks import NextPlanTasks
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask
from engine.query.queries import Queries
from core.modules.messages.models.message import Message
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, repository_environment
from tests.stories.support.story_checks import expect_value


def delegated_story(played):
    story = played(OpenTaskOrchestrator)
    repository = repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = story.agent_actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2", actor=story.agent))
    return story, repository, worker


def last_message_id(story) -> int:
    return story.container.get(Queries).query(Message).newest().page(1, 1).rows[0].id


@pytest.fixture
def judge_worker(played):
    return delegated_story(played)


@pytest.fixture
def delegated(played):
    return delegated_story(played)


def dispatch_sample(*arguments: str):
    return HookSamples.shell("journal worker dispatch", ShellPart("journal", "journal", ["worker", "dispatch", *arguments]))


def ended_worker_story(played):
    story = played(OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.run(f"agent end {worker.id}")
    story.run('task make "Tax" --brief "Add the tax in cart.py" --environment main', actor=story.agent)
    story.run('task make "Till" --brief "Print the till in till.py" --environment main', actor=story.agent)
    return story, worker


def test_a_chained_queue_goes_on_while_the_workers_earlier_task_is_in_testing(played):
    story, _, worker = delegated_story(played)
    story.expect_success("task depend 2 --on 1", actor=story.agent)
    next_task = story.container.get(WorkerNextTask)
    story.expect_success("task test 1", actor=worker)
    expect_value(next_task.following(worker.id).id, 2)
    story.expect_success("task start 2", actor=worker)


def test_a_plan_hands_out_only_its_tasks_that_no_worker_was_given(played):
    story, _, _ = delegated_story(played)
    plan_id = story.new_row_id('plan make "Cart" --brief "The cart counts" --environment main', actor=story.agent)
    phase_id = story.new_row_id(f'phase make --plan {plan_id} "First" --goal "It counts"', actor=story.agent)
    story.expect_success(f"phase place 2 --phase {phase_id}", actor=story.agent)
    plans = story.container.get(NextPlanTasks)
    expect_ready_plan_tasks(story, plans, plan_id, [])
    free_id = story.new_row_id('task make "Fix the till" --environment main', actor=story.agent)
    story.expect_success(f"phase place {free_id} --phase {phase_id}", actor=story.agent)
    expect_ready_plan_tasks(story, plans, plan_id, [free_id])


def test_the_assigner_leaves_a_delegated_task_alone(played):
    story, _, _ = delegated_story(played)
    tasks = story.container.get(TaskQuery)
    expect_next_open_tasks(tasks, 1, "closed_at", None)


def expect_total_started_groups(groups, expected) -> None:
    actual = groups['started']['total']
    assert actual == expected, actual


def expect_id_open_groups(groups, expected) -> None:
    actual = [row['id'] for row in groups['open']['rows']]
    assert actual == expected, actual


def expect_id_next_delegated(next_task, worker, expected) -> None:
    actual = next_task.following(worker.id).id
    assert actual == expected, actual
