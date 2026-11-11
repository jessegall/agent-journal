import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.tasks.queries.task_query import TaskQuery
from tests.stories.core.support.coding_fixtures import UserBuilder

TASK_COUNT = 4


class TwoWorkersFourTasks(StoryFixture):
    """The main agent, the person Ada, the workers W and V, and four open tasks that nobody is assigned to."""

    parent = UserBuilder

    def steps(self, story: Story) -> None:
        story.run("agent start s-2 claude worker --environment main")
        story.run("agent start s-3 claude worker --environment main")
        for number in range(1, TASK_COUNT + 1):
            story.run(f'task make "Job {number}" --brief "Do job {number}" --environment main', actor=story.agent)


@pytest.fixture
def workshop(new_story):
    return new_story(fixture=TwoWorkersFourTasks)


def worker_w(story: Story) -> Actor:
    return Actor(story.user.id + 1, ActorType.AGENT)


def worker_v(story: Story) -> Actor:
    return Actor(story.user.id + 2, ActorType.AGENT)


def assign(story: Story, task_id: int, actor: Actor) -> None:
    story.expect_success(f"assign task {task_id} --to {actor.id} --environment main", actor=story.user)


def assigned_ids(story: Story, actor: Actor) -> list[int]:
    return [task.id for task in story.container.get(TaskQuery).assigned(actor.id)]


def ready_ids(story: Story, actor: Actor) -> list[int]:
    return sorted(task.id for task in story.container.get(TaskQuery).assigned_ready(actor.id))


def free_ids(story: Story) -> list[int]:
    return [task.id for task in story.container.get(TaskQuery).free().oldest().all_rows()]


def test_the_open_tasks_assigned_to_a_worker_come_oldest_first_and_a_free_task_is_never_among_them(workshop):
    assign(workshop, 3, worker_w(workshop))
    assign(workshop, 1, worker_w(workshop))
    workshop.expect_rows(assigned_ids(workshop, worker_w(workshop)) == [1, 3], detail=str(assigned_ids(workshop, worker_w(workshop))))


def test_a_task_assigned_to_a_worker_is_in_that_workers_assigned_tasks_at_once(workshop):
    workshop.expect_rows(assigned_ids(workshop, worker_w(workshop)) == [], detail="nothing assigned yet")
    assign(workshop, 2, worker_w(workshop))
    workshop.expect_rows(assigned_ids(workshop, worker_w(workshop)) == [2], detail=str(assigned_ids(workshop, worker_w(workshop))))
    assign(workshop, 2, worker_v(workshop))
    workshop.expect_rows(assigned_ids(workshop, worker_w(workshop)) == [], assigned_ids(workshop, worker_v(workshop)) == [2], detail="the task follows its new assignee at once")


def test_a_task_assigned_to_worker_a_is_not_in_worker_bs_assigned_tasks_whatever_its_priority(workshop):
    workshop.expect_success("task edit 4 --priority critical --environment main", actor=workshop.agent)
    assign(workshop, 4, worker_w(workshop))
    assign(workshop, 1, worker_v(workshop))
    workshop.expect_rows(assigned_ids(workshop, worker_v(workshop)) == [1], ready_ids(workshop, worker_v(workshop)) == [1], detail=str(assigned_ids(workshop, worker_v(workshop))))


def test_free_tasks_are_those_nobody_has(workshop):
    workshop.expect_rows(free_ids(workshop) == [1, 2, 3, 4], detail=str(free_ids(workshop)))
    workshop.expect_success("task start 1 --environment main", actor=workshop.agent)
    workshop.expect_rows(free_ids(workshop) == [2, 3, 4], detail="a started task is no longer free")


def test_a_task_given_to_anyone_leaves_the_free_tasks(workshop):
    assign(workshop, 1, worker_w(workshop))
    assign(workshop, 2, workshop.user)
    assign(workshop, 3, workshop.agent)
    workshop.expect_rows(free_ids(workshop) == [4], detail=str(free_ids(workshop)))
    workshop.expect_success("unassign task 2 --environment main", actor=workshop.user)
    workshop.expect_rows(free_ids(workshop) == [2, 4], detail=str(free_ids(workshop)))


def test_an_assigned_task_with_an_open_dependency_is_assigned_but_not_ready(workshop):
    assign(workshop, 1, worker_w(workshop))
    assign(workshop, 2, worker_w(workshop))
    workshop.expect_success("task depend 2 --on 3 --environment main", actor=workshop.agent)
    workshop.expect_rows(assigned_ids(workshop, worker_w(workshop)) == [1, 2], ready_ids(workshop, worker_w(workshop)) == [1], detail=str(ready_ids(workshop, worker_w(workshop))))
