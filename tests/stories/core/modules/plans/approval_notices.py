from datetime import timedelta

from engine.driver.command_category import CommandCategory
from engine.query.queries import Queries
from core.modules.messages.models.message import Message
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.plans.support.plan_nudges import PLAN_APPROVED, PLAN_APPROVED_WITH_MESSAGE, PLAN_WAITING
from core.modules.plans.support.plan_approval import PlanApproval
from core.modules.plans.models.plan import Plan
from core.testing.expect_reply import expect_reply_allowed
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.plans.support.approval_fixtures import ReadyApprovalPlan
from tests.stories.core.support.fixtures import UserJoined

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


def docked_types(story) -> list[str]:
    return [item.type for item in story.container.get(Queries).query(DockItem).filter(state=DockItemState.DOCKED).all_rows()]


def test_a_plan_a_helper_marks_ready_shows_one_plan_card_and_no_approval(new_story):
    story = new_story(fixture=ReadyApprovalPlan)
    story.run_listeners()
    story.expect_rows(docked_types(story) == ["plans.waiting"], story.container.get(Queries).query(ApprovalRequest).count() == 0, detail=str(docked_types(story)))


def test_the_main_agent_is_told_the_ready_plan_waits_for_a_person(new_story):
    story = new_story(fixture=UserJoined)
    story.run('plan make "Release" --environment main', actor=story.user)
    story.advance(timedelta(seconds=1))
    story.run("plan ready 1", actor=story.agent)
    reply = story.hook("s-1", VIEW_LINE)
    expect_reply_allowed(reply)
    story.expect_rows(PLAN_WAITING.nudge(plan=1).text in reply.lines, detail=str(reply.lines))


def test_a_person_approves_a_ready_plan_from_its_card_and_the_card_leaves(new_story):
    story = new_story(fixture=ReadyApprovalPlan)
    story.run_listeners()
    story.expect_success("plan approve 1 --environment main", "state: approved", actor=story.user)
    story.run_listeners()
    story.expect_rows(docked_types(story) == [], story.container.get(Queries).query(ApprovalRequest).count() == 0, detail=str(docked_types(story)))
