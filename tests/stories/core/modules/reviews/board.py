import json

from tests.stories.core.modules.reviews.support.review_fixtures import ReviewInProgress, reviewer_of


def board(story) -> dict:
    return json.loads(story.run("review board --json").output_text)


def test_a_review_in_progress_is_on_the_board_with_its_steps(new_story):
    story = new_story(fixture=ReviewInProgress)
    story.run_listeners()
    answer = board(story)
    assert answer["queued"] == 0
    assert [review["title"] for review in answer["reviews"]] == ["task 1"]
    assert [step["text"] for step in answer["reviews"][0]["steps"]] == ["Started reviewing task 1"]


def test_a_review_that_has_reported_leaves_the_board(new_story):
    story = new_story(fixture=ReviewInProgress)
    story.run('review record "1 passed"', actor=reviewer_of(story))
    story.run_listeners()
    assert board(story)["reviews"] == []
