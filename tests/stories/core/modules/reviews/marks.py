from tests.stories.core.modules.reviews.support.review_fixtures import ProgressReview, read_reviewer

MARKS = "chat-mark list --environment 1 --oldest"


def chat_report(story, report: str, *expected: str) -> None:
    story.run(f'review record "{report}"', actor=read_reviewer(story))
    story.run_listeners()
    story.expect_text(MARKS, *expected)


def test_a_review_taken_shows_a_mark(new_story):
    story = new_story(fixture=ProgressReview)
    story.run_listeners()
    story.expect_text(MARKS, f"Reviewer {read_reviewer(story).id} is reviewing task 1")


def test_a_report_rejected_shows_a_mark_with_the_outcome_failed(new_story):
    story = new_story(fixture=ProgressReview)
    chat_report(story, "1 passed. 2 short: wrong total", "reports on task 1: 1 passed. 2 short: wrong total")
    story.expect_text("chat-mark list --environment 1 --outcome failed", "reports on task 1")
