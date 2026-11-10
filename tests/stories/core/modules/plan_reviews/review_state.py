import pytest

from engine.database.database import Database
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined


CRITIQUE_COMMAND = 'template send 1 --on=plan:1 --set=agents=2 --set=size="a normal read" --environment main'


class ReviewPlan(StoryFixture):
    """Plan 1 in main, sent for a critique by Ada with a template of their own, so it is under review."""

    parent = UserJoined

    def steps(self, story) -> None:
        story.expect_success('template make "Read it" --brief "Say what is wrong" --applies-to plan --purpose critique', actor=story.user)
        story.expect_success('plan make "Cart plan" --environment main')
        story.expect_success("plan ready 1")
        story.expect_success(CRITIQUE_COMMAND, actor=story.user)

    def expect(self, story) -> None:
        story.expect_text("plan show 1", "state: reviewing")


def test_story_1_a_plan_under_review_cannot_be_approved_or_started(new_story):
    story = new_story(fixture=ReviewPlan)
    story.expect_refusal("plan approve 1 --environment main", "plan 1 is reviewing, so it cannot approve", actor=story.user)
    story.expect_refusal("plan start 1 --environment main", "plan 1 is reviewing, so it cannot start", actor=story.user)


def test_a_refused_approval_of_a_plan_under_review_leaves_no_message(new_story):
    story = new_story(fixture=ReviewPlan)
    story.expect_refusal('plan approve 1 --message "Go ahead" --environment main', "so it cannot approve", actor=story.user)
    story.expect_no_text("message list", "Go ahead")


def test_a_wait_on_a_plan_under_review_does_not_resolve(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('template make "Read it" --brief "Say what is wrong" --applies-to plan --purpose critique', actor=story.user)
    story.expect_success('plan make "Cart plan" --environment main')
    story.expect_success('task make "Ship it" --environment main', actor=story.agent)
    story.expect_success("task block 1 --on plan:1", actor=story.agent)
    story.expect_success("plan ready 1")
    story.expect_success(CRITIQUE_COMMAND, actor=story.user)
    story.run_listeners()
    story.expect_text("task show 1", "state: blocked", actor=story.user)


def test_a_second_press_on_a_plan_under_review_is_refused(new_story):
    story = new_story(fixture=ReviewPlan)
    story.expect_refusal(CRITIQUE_COMMAND, "so it cannot review", actor=story.user)


def test_story_2_the_critique_report_ends_the_review(new_story):
    story = new_story(fixture=ReviewPlan)
    story.expect_success('report make "Critique" --abstract "What the review found" --body "Fine" --about plan:1 --environment main', actor=story.agent)
    story.run_listeners()
    story.expect_text("plan show 1", "state: ready")


def test_a_report_about_a_plan_not_under_review_moves_nothing(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('plan make "Cart plan" --environment main')
    story.expect_success('report make "Note" --abstract "A note" --body "Fine" --about plan:1 --environment main', actor=story.agent)
    story.run_listeners()
    story.expect_text("plan show 1", "state: draft")


def test_story_3_a_person_ends_the_review_when_no_report_comes(new_story):
    story = new_story(fixture=ReviewPlan)
    story.expect_success("plan reviewed 1", actor=story.user)
    story.expect_text("plan show 1", "state: ready")


def test_a_plan_under_review_can_be_cancelled_and_edited(new_story):
    story = new_story(fixture=ReviewPlan)
    story.expect_success('plan edit 1 --brief "A sharper goal"', actor=story.user)
    story.expect_success('plan cancel 1 --reason "not needed"', actor=story.user)


def test_the_plan_board_lists_a_plan_under_review(new_story):
    story = new_story(fixture=ReviewPlan)
    story.expect_text("plan board --environment main --json", "Cart plan", actor=story.user)


def test_listing_by_the_added_state_finds_the_plan(new_story):
    story = new_story(fixture=ReviewPlan)
    story.expect_text("plan list --state reviewing", "Cart plan", actor=story.user)


def test_a_raw_update_to_a_word_nothing_registers_is_refused_by_the_trigger(new_story):
    story = new_story(fixture=ReviewPlan)
    with pytest.raises(Exception, match="no move of a plan"):
        story.container.get(Database).connection.execute("UPDATE plans SET state = 'nowhere' WHERE id = 1")
