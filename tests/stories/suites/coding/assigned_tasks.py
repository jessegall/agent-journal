from core.base.query.queries import Queries
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder

LATER = 1


class AssignedLaterTask(StoryFixture):
    """Task 1, Later job, is assigned to the main agent for later."""

    parent = UserBuilder

    def steps(self, story):
        story.expect_success('task make "Later job" --brief "Do it"', actor=story.agent)
        story.expect_success(f"task assign {LATER} --to {story.agent.id}", actor=story.agent)


def task_row(story, task_id):
    return story.container.get(Queries).query(Task).find(task_id)


def test_a_task_assigned_to_the_main_agent_stays_open_while_another_task_is_next(new_story):
    story = new_story(fixture=AssignedLaterTask)
    first = story.new_row_id('task make "First job" --brief "Do it"', actor=story.agent)
    other = story.new_row_id('task make "Other job" --brief "Do it"', actor=story.agent)
    story.expect_success(f"task start {first}", actor=story.agent)
    story.expect_success(f'task close {first} --outcome "done"', actor=story.agent)
    story.expect_rows(task_row(story, other).state is TaskState.STARTED, task_row(story, LATER).state is TaskState.OPEN)


def test_a_released_task_that_was_assigned_to_the_main_agent_stays_open(new_story):
    story = new_story(fixture=AssignedLaterTask)
    story.expect_success(f"task start {LATER}", actor=story.agent)
    story.expect_success(f'task release {LATER} --reason "later"', actor=story.agent)
    story.expect_rows(task_row(story, LATER).state is TaskState.OPEN, task_row(story, LATER).holder_id is None)


def test_assigning_a_task_to_the_main_agent_reserves_it_for_that_agent_only(new_story):
    story = new_story(fixture=AssignedLaterTask)
    story.expect_rows(task_row(story, LATER).delegated_to == story.agent.id)
