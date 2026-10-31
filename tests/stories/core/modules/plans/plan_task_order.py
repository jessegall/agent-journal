from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import PlanFirstTaskClosed


def test_finishing_a_task_starts_the_next_open_task_by_phase_and_place_not_by_id(new_story):
    story = new_story(fixture=PlanFirstTaskClosed)
    story.expect_success(lines.THIRD_TASK_DETAILS, "state: started", f"holder_id: {story.agent.id}")
    story.expect_success(lines.TASK_DETAILS, "state: open")


def test_finishing_the_last_task_of_a_phase_starts_the_first_task_of_the_next_phase(new_story):
    story = new_story(fixture=PlanFirstTaskClosed)
    story.run('task close 3 --outcome "done"', actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {story.agent.id}")


def test_cancelling_a_plan_cancels_its_open_tasks_in_every_phase_and_leaves_the_completed_ones(new_story):
    story = new_story(fixture=PlanFirstTaskClosed)
    story.expect_success('plan cancel 1 --reason "replaced"', "state: cancelled")
    story.expect_success(lines.SECOND_TASK_DETAILS, "state: completed")
    story.expect_success(lines.THIRD_TASK_DETAILS, "state: cancelled", "reason: plan 1 was cancelled")
    story.expect_success(lines.TASK_DETAILS, "state: cancelled", "reason: plan 1 was cancelled")
