from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import PlanTaskWaiting, PlanTasksWaitingOutside


def test_the_next_task_starter_skips_a_task_that_waits_and_starts_the_next_free_one(new_story):
    story = new_story(fixture=PlanTaskWaiting)
    story.run(lines.SECOND_TASK_START, actor=story.agent)
    story.run('task close 2 --outcome "done"', actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {story.agent.id}")
    story.expect_success(lines.THIRD_TASK_DETAILS, "state: open")


def test_the_next_task_starter_starts_nothing_when_every_open_task_waits(new_story):
    story = new_story(fixture=PlanTasksWaitingOutside)
    story.run(lines.SECOND_TASK_START, actor=story.agent)
    story.run('task close 2 --outcome "done"', actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: open")
    story.expect_success(lines.THIRD_TASK_DETAILS, "state: open")
