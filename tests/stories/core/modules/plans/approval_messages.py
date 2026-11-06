import pytest

from core.base.query.queries import Queries
from core.modules.documents.models.link import Link
from core.modules.messages.models.message import Message
from tests.stories.core.modules.plans.support.approval_fixtures import CancelledApprovalPlan, ReadyApprovalPlan


def test_approval_sends_a_message_linked_to_the_plan(new_story):
    story = new_story(fixture=ReadyApprovalPlan)
    story.expect_success('plan approve 1 --message "Skip phase 3 for now" --environment main',
                         "state: approved", actor=story.user)
    story.expect_text("plan comments 1", "Skip phase 3 for now", actor=story.user)
    story.expect_text("message list", "Skip phase 3 for now", actor=story.user)


def test_a_cancelled_plan_refuses_approval_without_leaving_a_message(new_story):
    story = new_story(fixture=CancelledApprovalPlan)
    story.expect_refusal('plan approve 1 --message "Too late" --environment main',
                         "plan 1 is cancelled, so it cannot approve", actor=story.user)
    story.expect_rows(story.container.get(Queries).query(Message).count() == 0,
                      story.container.get(Queries).query(Link).count() == 0)
    story.expect_success("plan show 1", "state: cancelled")


def test_a_plan_of_another_environment_is_refused_without_a_message(new_story):
    story = new_story(fixture=ReadyApprovalPlan)
    story.expect_success("environment make other /work/other", actor=story.user)
    story.expect_refusal('plan approve 1 --message "Wrong environment" --environment other',
                         "no plan 1", actor=story.user)
    story.expect_rows(story.container.get(Queries).query(Message).count() == 0,
                      story.container.get(Queries).query(Link).count() == 0)
    story.expect_success("plan show 1", "state: ready")


@pytest.mark.parametrize("flags", ["", "--skip-guard core.lifecycle"])
@pytest.mark.parametrize("message", ["", '--message "Approve this"'])
def test_an_agent_cannot_approve_even_when_skipping_a_guard(new_story, flags, message):
    story = new_story(fixture=ReadyApprovalPlan)
    story.expect_refusal(f"plan approve 1 --environment main {flags} {message}",
                         "only a person approves a plan", actor=story.agent)
    story.expect_rows(story.container.get(Queries).query(Message).count() == 0)
    story.expect_success("plan show 1", "state: ready")


def test_an_empty_approval_message_creates_no_comment(new_story):
    story = new_story(fixture=ReadyApprovalPlan)
    story.expect_success('plan approve 1 --message "   " --environment main', "state: approved", actor=story.user)
    story.expect_rows(story.container.get(Queries).query(Message).count() == 0)
