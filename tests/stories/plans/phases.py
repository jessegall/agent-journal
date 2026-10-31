from tests.stories.tasks.task_lifecycle import started_story


def plan_with_three_phases(story_on):
    story = started_story(story_on)
    story.run('plan make "Version 5 core" --environment main')
    for title in ("Values", "Models", "Queries"):
        story.run(f'phase make --plan 1 "{title}" --goal "{title.lower()} pass their tests"')
    return story


def test_phases_are_made_in_order_at_the_end_of_their_plan(story_on):
    story = plan_with_three_phases(story_on)
    story.expect_success("phase list --plan 1 --oldest", "1  1  1  Values  values pass their tests", "3  1  3  Queries  queries pass their tests")


def test_a_phase_moved_forward_shifts_the_phases_between(story_on):
    story = plan_with_three_phases(story_on)
    story.expect_success("phase move 3 --to 1", "position: 1", "title: Queries")
    story.expect_success("phase list --plan 1 --oldest", "1  1  2  Values  values pass their tests", "2  1  3  Models  models pass their tests")


def test_a_phase_moved_back_shifts_the_phases_between(story_on):
    story = plan_with_three_phases(story_on)
    story.expect_success("phase move 1 --to 3", "position: 3", "title: Values")
    story.expect_success("phase show 3", "position: 2")


def test_a_place_outside_the_plan_is_refused(story_on):
    story = plan_with_three_phases(story_on)
    story.expect_refusal("phase move 1 --to 4", "plan 1 has places 1 to 3, not 4")


def test_two_phases_cannot_share_a_place(story_on):
    story = plan_with_three_phases(story_on)
    story.expect_refusal("phase edit 1 --position 2", "a phase with that plan_id, position exists already")
