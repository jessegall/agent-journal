from tests.stories.core.modules.reviews.support.review_fixtures import REVIEW_REQUEST, REVIEW_SHOW, ReviewRequested
from tests.stories.core.support.fixtures import ThreeTasks

ONE_REVIEWER = "setting make reviews.reviewers-most 1"


def test_a_reviewer_that_is_added_takes_the_next_queued_review_at_once(new_story):
    story = new_story(fixture=ReviewRequested)
    story.run("setting make reviews.reviewers-most 1 --environment main")
    reviewer_id = story.new_row_id("reviewer add", actor=story.agent)
    story.expect_success(REVIEW_SHOW, "state: reviewing", f"reviewer_id: {reviewer_id}")
    story.expect_success(f"agent show {reviewer_id}", "role: reviewer")


def test_a_reviewer_past_the_limit_is_refused(new_story):
    story = new_story(fixture=ThreeTasks)
    story.run(ONE_REVIEWER)
    story.run("reviewer add", actor=story.agent)
    story.expect_refusal("reviewer add", "1 reviewers are out, the limit reviews.reviewers-most sets", actor=story.agent)


def test_an_idle_reviewer_is_let_go_and_none_idle_is_refused(new_story):
    story = new_story(fixture=ThreeTasks)
    story.run(ONE_REVIEWER)
    story.run("reviewer add", actor=story.agent)
    story.expect_success("reviewer retire", "retired", actor=story.agent)
    story.expect_refusal("reviewer retire", "no reviewer is idle", actor=story.agent)


def test_a_queued_review_with_no_reviewer_gets_one_added(new_story):
    story = new_story(fixture=ThreeTasks)
    story.run(ONE_REVIEWER)
    story.run(REVIEW_REQUEST, actor=story.agent)
    story.expect_success(REVIEW_SHOW, "state: reviewing")
    story.expect_success("reviewer list", "reviewers: 1, reviews waiting: 0")


def test_a_reviewer_that_ends_while_reviewing_gives_its_review_back_as_abandoned(new_story):
    story = new_story(fixture=ThreeTasks)
    story.run(ONE_REVIEWER)
    story.run(REVIEW_REQUEST, actor=story.agent)
    story.run("agent end 2")
    story.expect_success(REVIEW_SHOW, "state: abandoned")


def test_the_reviewer_list_names_each_reviewer_and_the_waiting_reviews_in_order(new_story):
    story = new_story(fixture=ThreeTasks)
    story.run(ONE_REVIEWER)
    story.run(REVIEW_REQUEST, actor=story.agent)
    story.run("review request task 2 --points 1 --environment main", actor=story.agent)
    story.run("review request task 3 --points 1 --environment main", actor=story.agent)
    story.expect_ordered_lines("reviewer list", "reviewing", "reviews waiting", "task 2", "task 3")
    story.expect_text("reviewer list", "reviewers: 1, reviews waiting: 2")


def test_a_reviewer_is_refused_while_reviewers_are_switched_off(new_story):
    story = new_story(fixture=ThreeTasks)
    story.run(ONE_REVIEWER)
    story.run("setting make reviews.reviewers false")
    story.expect_refusal("reviewer add", "reviewers are switched off", actor=story.agent)
