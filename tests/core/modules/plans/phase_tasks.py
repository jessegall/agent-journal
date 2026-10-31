from tests.core import story_lines as lines
from tests.core.fixtures import PlanWithTasks
from tests.core.modules.plans.phases import plan_with_three_phases


def plan_with_tasks(new_story):
    return new_story(fixture=PlanWithTasks)


def test_a_task_is_placed_at_the_end_of_a_phase(new_story):
    story = plan_with_tasks(new_story)
    story.expect_success(lines.FIRST_TASK_PLACE, "phase_id: 1", "task_id: 1", "position: 1")
    story.expect_success("phase place 2 --phase 1", "position: 2")


def test_placing_a_task_in_another_phase_moves_it_there(new_story):
    story = plan_with_tasks(new_story)
    story.run(lines.FIRST_TASK_PLACE)
    story.expect_success("phase place 1 --phase 2", "phase_id: 2", "position: 1")
    story.expect_success("phase-task list --phase 1", "nothing found")


def test_a_task_cannot_have_two_places(new_story):
    story = plan_with_tasks(new_story)
    story.run(lines.FIRST_TASK_PLACE)
    story.expect_refusal("phase-task make 2 1 1", "a phase-task with that task_id exists already")


def test_a_phase_with_tasks_placed_cannot_be_deleted(new_story):
    story = plan_with_tasks(new_story)
    story.run(lines.FIRST_TASK_PLACE)
    story.expect_refusal("phase delete 1", "this phase is still referred to by phase_tasks")


def test_deleting_a_task_removes_its_place_first(new_story):
    story = plan_with_tasks(new_story)
    story.run(lines.FIRST_TASK_PLACE)
    story.expect_success(lines.TASK_DELETION, "the task is deleted")
    story.expect_success("phase-task list", "nothing found")
