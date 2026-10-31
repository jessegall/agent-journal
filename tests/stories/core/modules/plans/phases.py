from tests.stories.core.support.fixtures import PlanWithPhases
from tests.stories.core.modules.tasks.task_lifecycle import started_story


def plan_with_three_phases(new_story):
    return new_story(fixture=PlanWithPhases)


def test_phases_are_made_in_order_at_the_end_of_their_plan(new_story):
    story = plan_with_three_phases(new_story)
    story.expect_success("phase list --plan 1 --oldest", "1  1  1  Values  values pass their tests", "3  1  3  Queries  queries pass their tests")


def test_a_phase_moved_forward_shifts_the_phases_between(new_story):
    story = plan_with_three_phases(new_story)
    story.expect_success("phase move 3 --to 1", "position: 1", "title: Queries")
    story.expect_success("phase list --plan 1 --oldest", "1  1  2  Values  values pass their tests", "2  1  3  Models  models pass their tests")


def test_a_phase_moved_back_shifts_the_phases_between(new_story):
    story = plan_with_three_phases(new_story)
    story.expect_success("phase move 1 --to 3", "position: 3", "title: Values")
    story.expect_success("phase show 3", "position: 2")


def test_a_place_outside_the_plan_is_refused(new_story):
    story = plan_with_three_phases(new_story)
    story.expect_refusal("phase move 1 --to 4", "plan 1 has places 1 to 3, not 4")


def test_a_phase_changes_place_only_by_a_move(new_story):
    story = plan_with_three_phases(new_story)
    story.expect_refusal("phase edit 1 --position 2", "a phase changes its place only with journal phase move")
    story.expect_success('phase edit 1 --title "Value objects"', "title: Value objects", "position: 1")


def test_a_phase_deleted_from_the_middle_closes_its_place_and_the_next_phase_takes_the_end(new_story):
    story = plan_with_three_phases(new_story)
    story.expect_success("phase delete 2", "the phase is deleted")
    story.expect_success("phase show 3", "position: 2")
    story.expect_success('phase make --plan 1 "Commands"', "position: 3")
    story.expect_success("phase move 3 --to 1", "position: 1")
