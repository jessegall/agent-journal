import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client


@pytest.fixture
def helper_request(new_story):
    story = new_story(fixture=BuilderWithUser)
    helper = Actor(story.new_row_id(f"agent start help-shop claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)
    story.expect_refusal("phone pair", "main agent was asked", actor=helper)
    approval = story.container.get(Queries).query(ApprovalRequest).filter(requester_id=helper.id).first()
    return story, helper, approval


def test_a_helpers_request_is_addressed_to_its_main_agent_and_has_no_person_card(helper_request):
    story, helper, approval = helper_request
    items = tuple(story.container.get(Queries).query(DockItem).filter(target_model="approval", target_id=approval.id, state=DockItemState.DOCKED).all_rows())
    story.expect_rows(approval.recipient_agent_id == story.agent.id, not items)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "needs your review", actor=story.agent)
    with viewer_client(story) as viewer:
        viewer.refusal("messages.chat", ["approval", "accept", str(approval.id)], "addressed to agent")


def test_only_the_addressed_main_agent_can_relay_the_request(helper_request):
    story, helper, approval = helper_request
    story.expect_refusal(f"approval relay {approval.id}", "only the main agent", actor=helper)
    story.expect_success(f"approval relay {approval.id}", actor=story.agent)
    saved = story.container.get(Queries).query(ApprovalRequest).find(approval.id)
    items = tuple(story.container.get(Queries).query(DockItem).filter(target_model="approval", target_id=approval.id, state=DockItemState.DOCKED).all_rows())
    story.expect_rows(saved.recipient_agent_id is None, saved.relayed_by_id == story.agent.id, len(items) == 1)
    story.expect_refusal("phone pair", "A person was asked", actor=helper)
    saved = story.container.get(Queries).query(ApprovalRequest).find(approval.id)
    story.expect_rows(saved.recipient_agent_id is None)
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "refuse", str(approval.id)])
    items = tuple(story.container.get(Queries).query(DockItem).filter(target_model="approval", target_id=approval.id, state=DockItemState.DOCKED).all_rows())
    story.expect_rows(not items)
