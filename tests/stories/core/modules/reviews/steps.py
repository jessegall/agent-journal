from tests.stories.core.modules.reviews.support.review_fixtures import ReviewInProgress, reviewer_of

STEPS = "review-step list --review 1 --oldest"


def test_a_review_that_is_taken_shows_that_it_started(new_story):
    story = new_story(fixture=ReviewInProgress)
    story.run_listeners()
    story.expect_text(STEPS, "Started reviewing task 1")


def test_a_report_shows_one_step_per_point_and_a_last_step_handing_it_over_in_order(new_story):
    story = new_story(fixture=ReviewInProgress)
    story.run('review record "1 passed\n2 short: the total is in dollars"', actor=reviewer_of(story))
    story.run_listeners()
    story.expect_ordered_lines(STEPS, "Started reviewing task 1", "1 passed", "2 short: the total is in dollars", "Handed the report to the agent that asked")


def test_a_step_is_good_when_its_point_passed_and_bad_when_it_fell_short(new_story):
    story = new_story(fixture=ReviewInProgress)
    story.run('review record "1 passed\n2 short: the total is in dollars"', actor=reviewer_of(story))
    story.run_listeners()
    story.expect_text("review-step list --review 1 --outcome passed", "1 passed")
    story.expect_text("review-step list --review 1 --outcome failed", "2 short: the total is in dollars")


def test_a_point_undecided_is_a_step_with_no_outcome(new_story):
    story = new_story(fixture=ReviewInProgress)
    story.run('review record "1 passed\n2 undecided: the tests cannot run here"', actor=reviewer_of(story))
    story.run_listeners()
    story.expect_text("review-step list --review 1 --outcome none", "2 undecided: the tests cannot run here")


def test_a_step_cannot_be_made_by_hand(new_story):
    story = new_story(fixture=ReviewInProgress)
    story.expect_usage_error('review-step make --review 1 "a step"', actor=story.agent)
