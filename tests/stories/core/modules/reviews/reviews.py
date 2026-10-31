from tests.stories.core.modules.reviews.support.review_fixtures import REVIEW_POINTS, REVIEW_REQUEST, REVIEW_SHOW, ReviewRequested, ReviewTaken


def test_a_review_is_requested_for_a_subject_row_and_waits_queued(new_story):
    story = new_story(fixture=ReviewRequested)
    story.expect_success(REVIEW_SHOW, "state: queued", "subject_model: task", "subject_id: 1", "point_count: 2")


def test_a_subject_with_an_unfinished_review_is_refused_a_second(new_story):
    story = new_story(fixture=ReviewRequested)
    story.expect_refusal(REVIEW_REQUEST, "already has an unfinished review", actor=story.agent)


def test_a_subject_is_reviewed_again_once_its_review_is_abandoned(new_story):
    story = new_story(fixture=ReviewRequested)
    story.run("review abandon 1", actor=story.agent)
    story.expect_success(REVIEW_SHOW, "state: abandoned")
    story.expect_success(REVIEW_REQUEST, "state: queued", actor=story.agent)


def test_a_report_that_passes_every_point_approves_the_review(new_story):
    story = new_story(fixture=ReviewTaken)
    story.expect_success('review record "1 passed\n2 passed"', actor=story.reviewer)
    story.expect_success(REVIEW_SHOW, "state: approved")


def test_a_point_short_sends_the_review_back_with_the_reason(new_story):
    story = new_story(fixture=ReviewTaken)
    story.run('review record "1 passed\n2 short: the total is in dollars"', actor=story.reviewer)
    story.expect_success(REVIEW_SHOW, "state: sent_back")
    story.expect_success(REVIEW_POINTS, "short", "the total is in dollars")


def test_a_point_undecided_leaves_the_review_to_the_agent_that_asked(new_story):
    story = new_story(fixture=ReviewTaken)
    story.run('review record "1 passed\n2 undecided: the tests cannot run here"', actor=story.reviewer)
    story.expect_success(REVIEW_SHOW, "state: undecided")
    story.expect_success(REVIEW_POINTS, "undecided", "the tests cannot run here")


def test_a_point_the_report_does_not_name_leaves_the_review_to_the_agent_that_asked(new_story):
    story = new_story(fixture=ReviewTaken)
    story.run('review record "1 passed"', actor=story.reviewer)
    story.expect_success(REVIEW_SHOW, "state: undecided")


def test_a_report_from_an_agent_that_is_not_the_reviewer_is_refused(new_story):
    story = new_story(fixture=ReviewTaken)
    story.expect_refusal('review record "1 passed\n2 passed"', "not the reviewer", actor=story.agent)
    story.expect_success(REVIEW_SHOW, "state: reviewing")


def test_a_second_report_is_refused(new_story):
    story = new_story(fixture=ReviewTaken)
    story.run('review record "1 passed\n2 passed"', actor=story.reviewer)
    story.expect_refusal('review record "1 short: wrong"', "already reported", actor=story.reviewer)
    story.expect_success(REVIEW_SHOW, "state: approved")


def test_the_queue_of_an_environment_is_read_oldest_first(new_story):
    story = new_story(fixture=ReviewRequested)
    story.run("review request task 2 --points 1 --environment main", actor=story.agent)
    story.expect_ordered_lines("review list --state queued --oldest", "1  1  task  1", "2  1  task  2")
    story.expect_text("review list --state reviewing", "nothing found")
