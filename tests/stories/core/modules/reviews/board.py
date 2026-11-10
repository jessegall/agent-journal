import json

from tests.stories.core.modules.reviews.support.review_fixtures import ProgressReview, read_reviewer
from engine.testing.expectations.expect_row import expect_row


def board(story) -> dict:
    return json.loads(story.run("review board --json").output_text)


def test_a_review_in_progress_is_on_the_board_with_its_steps(new_story):
    story = new_story(fixture=ProgressReview)
    story.run_listeners()
    answer = board(story)
    expect_row(answer, queued=0)
    expect_title_review_reviews(answer, ["task 1"])
    expect_step_steps_reviews(answer, ["Started reviewing task 1"])


def test_a_review_that_has_reported_leaves_the_board(new_story):
    story = new_story(fixture=ProgressReview)
    story.run('review record "1 passed"', actor=read_reviewer(story))
    story.run_listeners()
    expect_row(board(story), reviews=[])


def expect_step_steps_reviews(answer, expected) -> None:
    actual = [step['text'] for step in answer['reviews'][0]['steps']]
    assert actual == expected, actual


def expect_title_review_reviews(answer, expected) -> None:
    actual = [review['title'] for review in answer['reviews']]
    assert actual == expected, actual
