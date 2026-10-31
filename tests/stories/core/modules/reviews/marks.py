from tests.stories.core.modules.chat.support.mark_samples import mark_count
from tests.stories.core.modules.reviews.support.review_fixtures import ReviewInProgress, reviewer_of

MARKS = "chat-mark list --environment 1 --oldest"


def reported_in_the_chat(story, report: str, *expected: str) -> None:
    story.run(f'review record "{report}"', actor=reviewer_of(story))
    story.run_listeners()
    story.expect_text(MARKS, *expected)


def test_a_review_taken_shows_a_mark(new_story):
    story = new_story(fixture=ReviewInProgress)
    story.run_listeners()
    story.expect_text(MARKS, f"Reviewer {reviewer_of(story).id} is reviewing task 1")


def test_an_approving_report_shows_one_mark_for_the_agent_that_asked_with_the_outcome_passed(new_story):
    story = new_story(fixture=ReviewInProgress)
    reported_in_the_chat(story, "1 passed. 2 passed", f"Reviewer {reviewer_of(story).id} reports on task 1: 1 passed. 2 passed")
    story.expect_text("chat-mark list --environment 1 --outcome passed", "reports on task 1")
    story.expect_text(f"chat-mark list --environment 1 --agent {story.agent.id}", "reports on task 1")


def test_a_report_rejected_shows_a_mark_with_the_outcome_failed(new_story):
    story = new_story(fixture=ReviewInProgress)
    reported_in_the_chat(story, "1 passed. 2 short: wrong total", "reports on task 1: 1 passed. 2 short: wrong total")
    story.expect_text("chat-mark list --environment 1 --outcome failed", "reports on task 1")


def test_an_undecided_report_shows_a_mark_with_no_outcome(new_story):
    story = new_story(fixture=ReviewInProgress)
    reported_in_the_chat(story, "1 passed. 2 undecided: cannot run", "reports on task 1: 1 passed. 2 undecided: cannot run")
    story.expect_text("chat-mark list --environment 1 --outcome none", "reports on task 1")


def test_a_refused_report_shows_no_mark(new_story):
    story = new_story(fixture=ReviewInProgress)
    story.run_listeners()
    starting_count = mark_count(story)
    story.expect_refusal('review record "1 passed. 2 passed" --environment main', "not the reviewer", actor=story.agent)
    story.run_listeners()
    assert mark_count(story) == starting_count
