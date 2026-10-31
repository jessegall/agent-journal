from tests.stories.core.modules.chat.support.mark_samples import mark_count
from tests.stories.core.modules.reviews.support.review_fixtures import ReviewTaken

MARKS = "chat-mark list --environment 1 --oldest"


def reported_in_the_chat(story, report: str, *expected: str) -> None:
    story.run(f'review record "{report}"', actor=story.reviewer)
    story.run_listeners()
    story.expect_success(MARKS, *expected)


def test_a_review_taken_shows_a_mark(new_story):
    story = new_story(fixture=ReviewTaken)
    story.run_listeners()
    story.expect_success(MARKS, f"Reviewer {story.reviewer.id} is reviewing task 1")


def test_an_approving_report_shows_one_mark_with_the_outcome_passed(new_story):
    story = new_story(fixture=ReviewTaken)
    reported_in_the_chat(story, "1 passed. 2 passed", f"Reviewer {story.reviewer.id} reports on task 1: 1 passed. 2 passed")
    story.expect_success("chat-mark list --environment 1 --outcome passed", "reports on task 1")


def test_a_report_sent_back_shows_a_mark_with_the_outcome_failed(new_story):
    story = new_story(fixture=ReviewTaken)
    reported_in_the_chat(story, "1 passed. 2 short: wrong total", "reports on task 1: 1 passed. 2 short: wrong total")
    story.expect_success("chat-mark list --environment 1 --outcome failed", "reports on task 1")


def test_an_undecided_report_shows_a_mark_with_no_outcome(new_story):
    story = new_story(fixture=ReviewTaken)
    reported_in_the_chat(story, "1 passed. 2 undecided: cannot run", "reports on task 1: 1 passed. 2 undecided: cannot run")
    story.expect_success("chat-mark list --environment 1 --outcome none", "reports on task 1")


def test_the_report_mark_is_in_the_chat_of_the_agent_that_asked(new_story):
    story = new_story(fixture=ReviewTaken)
    reported_in_the_chat(story, "1 passed. 2 passed", "reports on task 1")
    story.expect_success(f"chat-mark list --environment 1 --agent {story.agent.id}", "reports on task 1")


def test_a_refused_report_shows_no_mark(new_story):
    story = new_story(fixture=ReviewTaken)
    story.run_listeners()
    before = mark_count(story)
    story.expect_refusal('review record "1 passed. 2 passed"', "not the reviewer", actor=story.agent)
    story.run_listeners()
    assert mark_count(story) == before
