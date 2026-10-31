from tests.core import story_lines as lines
from tests.core.modules.plans.phase_tasks import plan_with_tasks


def test_a_plan_with_no_tasks_has_a_row_of_zeros(new_story):
    story = plan_with_tasks(new_story)
    story.expect_success("plan progress 1", "plan_id: 1", "task_count: 0", "completed_count: 0", "current_phase: 0")


def test_cancelled_tasks_are_not_counted_and_the_current_phase_moves_on_as_tasks_close(new_story):
    story = plan_with_tasks(new_story)
    story.run('task make "Third" --environment main')
    story.run(lines.FIRST_TASK_PLACE)
    story.run("phase place 2 --phase 2")
    story.run("phase place 3 --phase 2")
    story.run('task cancel 3 --reason "not needed"')
    story.expect_success("plan progress 1", "task_count: 2", "completed_count: 0", "current_phase: 1")
    story.run(lines.TASK_START, actor=story.agent)
    story.run(lines.TASK_CLOSE, actor=story.agent)
    story.expect_success("plan progress 1", "task_count: 2", "completed_count: 1", "current_phase: 2")
