from typing import NamedTuple

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.phone.models.phone_code import PhoneCode
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from engine.testing.stories.story import Story
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client


class HelperApproval(NamedTuple):
    story: Story
    helper: Actor
    approval: ApprovalRequest


@pytest.fixture
def helper_request(new_story):
    story = new_story(fixture=UserBuilder)
    helper = Actor(story.new_row_id(f"agent start help-shop claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)
    story.expect_refusal("phone pair --reason needed", "main agent was asked", actor=helper)
    approval = story.container.get(Queries).query(ApprovalRequest).filter(requester_id=helper.id).first()
    return HelperApproval(story, helper, approval)


def test_a_helpers_request_is_addressed_to_its_main_agent_and_has_no_person_card(helper_request):
    story, helper, approval = helper_request
    items = tuple(story.container.get(Queries).query(DockItem).filter(target_model="approval", target_id=approval.id, state=DockItemState.DOCKED).all_rows())
    story.expect_rows(approval.recipient_agent_id == story.agent.id, not items)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "needs your review", actor=story.agent)
    with viewer_client(story) as viewer:
        viewer.refusal("messages.chat", ["approval", "accept", str(approval.id)], "addressed to main agent")


def test_only_the_addressed_main_agent_can_relay_the_request(helper_request):
    story, helper, approval = helper_request
    story.expect_refusal(f"approval relay {approval.id}", "only the main agent", actor=helper)
    story.expect_success(f"approval relay {approval.id}", actor=story.agent)
    saved = story.container.get(Queries).query(ApprovalRequest).find(approval.id)
    items = tuple(story.container.get(Queries).query(DockItem).filter(target_model="approval", target_id=approval.id, state=DockItemState.DOCKED).all_rows())
    story.expect_rows(saved.recipient_agent_id is None, saved.relayer_id == story.agent.id, len(items) == 1)
    story.expect_refusal("phone pair --reason needed", "A person was asked", actor=helper)
    saved = story.container.get(Queries).query(ApprovalRequest).find(approval.id)
    story.expect_rows(saved.recipient_agent_id is None)
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "refuse", str(approval.id)])
    items = tuple(story.container.get(Queries).query(DockItem).filter(target_model="approval", target_id=approval.id, state=DockItemState.DOCKED).all_rows())
    story.expect_rows(not items)


def test_main_answers_the_helper_without_a_person_or_a_protected_action(helper_request):
    story, helper, approval = helper_request
    line = f'approval answer {approval.id} --text "Use the existing paired phone"'
    story.expect_refusal(line, "only the main agent", actor=helper)
    story.expect_success(line, actor=story.agent)
    saved = story.container.get(Queries).query(ApprovalRequest).find(approval.id)
    story.expect_rows(saved.state is ApprovalState.CLOSED, saved.review_answer == "Use the existing paired phone",
                      saved.responder_id == story.agent.id, not tuple(story.story_rows(PhoneCode)))
