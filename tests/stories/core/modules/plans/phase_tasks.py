from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import PhaseWithThreeTasks, PlanWithTasks
from tests.stories.core.modules.plans.phases import plan_with_three_phases


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


def test_a_place_is_made_only_by_placing_a_task(new_story):
    story = plan_with_tasks(new_story)
    story.expect_usage_error("phase-task make 2 1 1")
    story.expect_usage_error("phase-task edit 1 --position 2")


def test_a_phase_with_tasks_placed_cannot_be_deleted(new_story):
    story = plan_with_tasks(new_story)
    story.run(lines.FIRST_TASK_PLACE)
    story.expect_refusal("phase delete 1", "this phase is still referred to by phase_tasks")


def test_deleting_a_task_removes_its_place_first(new_story):
    story = plan_with_tasks(new_story)
    story.run(lines.FIRST_TASK_PLACE)
    story.expect_success(lines.TASK_DELETION, "the task is deleted")
    story.expect_success("phase-task list", "nothing found")


def test_a_task_moved_out_of_the_middle_of_a_phase_closes_its_place_and_the_next_task_takes_the_end(new_story):
    story = new_story(fixture=PhaseWithThreeTasks)
    story.run("phase place 2 --phase 2")
    story.expect_success(lines.FIRST_PHASE_PLACES, "1  1  1  1", "3  1  3  2")
    story.run('task make "Fourth" --environment main')
    story.expect_success("phase place 4 --phase 1", "position: 3")


def test_a_task_deleted_from_the_middle_of_a_phase_closes_its_place(new_story):
    story = new_story(fixture=PhaseWithThreeTasks)
    story.expect_success("task delete 2", "the task is deleted")
    story.expect_success(lines.FIRST_PHASE_PLACES, "1  1  1  1", "3  1  3  2")

