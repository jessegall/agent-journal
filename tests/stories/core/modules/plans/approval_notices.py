from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.modules.messages.models.message import Message
from core.modules.plans.support.plan_nudges import PLAN_APPROVED, PLAN_APPROVED_WITH_MESSAGE
from core.modules.plans.support.plan_approval import PlanApproval
from core.modules.plans.models.plan import Plan
from core.testing.expect_reply import expect_reply_allowed
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.plans.support.approval_fixtures import ReadyApprovalPlan

VIEW_LINE = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, [])).with_fields(event="post_tool_use")


def test_the_main_agent_is_told_to_read_the_approval_message(new_story):
    story = new_story(fixture=ReadyApprovalPlan)
    story.advance(timedelta(seconds=1))
    story.expect_success('plan approve 1 --message "Skip phase 3 for now" --environment main', actor=story.user)
    message = next(story.container.get(Queries).query(Message).all_rows())
    story.expect_rows(PlanApproval.message_id(story.row(Plan, 1)) == message.id)
    reply = story.hook("s-1", VIEW_LINE)
    expect_reply_allowed(reply)
    story.expect_rows(PLAN_APPROVED_WITH_MESSAGE.nudge(plan=1, message=message.id).text in reply.lines,
                      PLAN_APPROVED.nudge(plan=1).text not in reply.lines)


def test_an_approval_without_a_message_keeps_the_plain_notice(new_story):
    story = new_story(fixture=ReadyApprovalPlan)
    story.advance(timedelta(seconds=1))
    story.expect_success("plan approve 1 --environment main", actor=story.user)
    reply = story.hook("s-1", VIEW_LINE)
    expect_reply_allowed(reply)
    story.expect_rows(PLAN_APPROVED.nudge(plan=1).text in reply.lines,
                      story.container.get(Queries).query(Message).count() == 0)
