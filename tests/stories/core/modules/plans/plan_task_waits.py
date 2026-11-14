import pytest

from engine.testing.stories.story_fixture import StoryFixture

from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import PlanTaskWaiting, PlanTasksWaitingOutside


def test_the_next_task_starter_skips_a_task_that_waits_and_starts_the_next_free_one(free_plan_task):
    story = free_plan_task
    story.expect_success(lines.THIRD_TASK_DETAILS, "state: blocked")


def test_the_next_task_starter_starts_nothing_when_every_open_task_waits(waiting_plan_task):
    story = waiting_plan_task
    story.expect_success(lines.THIRD_TASK_DETAILS, "state: blocked")


class NextPlanTaskClosed(StoryFixture):
    parent = PlanTaskWaiting

    def steps(self, story):
        story.run(lines.SECOND_TASK_START, actor=story.agent)
        story.run('task close 2 --outcome "done"', actor=story.agent)


class WaitingPlanTaskClosed(NextPlanTaskClosed):
    parent = PlanTasksWaitingOutside


@pytest.fixture
def free_plan_task(new_story):
    story = new_story(fixture=NextPlanTaskClosed)
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {story.agent.id}")
    return story


@pytest.fixture
def waiting_plan_task(new_story):
    story = new_story(fixture=WaitingPlanTaskClosed)
    story.expect_success(lines.TASK_DETAILS, "state: blocked")
    return story
