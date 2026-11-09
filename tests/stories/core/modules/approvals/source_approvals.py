import pytest

from core.base.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.plans.models.enums.plan_dock_type import PlanDockType
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.triggers.models.trigger import Trigger
from core.modules.sharing.models.share_link import ShareLink
from core.modules.sharing.models.enums.share_link_state import ShareLinkState
from tests.stories.core.modules.plans.support.approval_fixtures import ReadyApprovalPlan
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.fixtures import PhasesPlan
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client
from tests.stories.core.modules.approvals.support.legacy_setting_requests import UPGRADE


def test_a_ready_plan_is_docked_as_its_own_card_and_asks_no_approval_of_its_own(new_story):
    story = new_story(fixture=ReadyApprovalPlan)
    cards = story.container.get(DockItemQuery).type_items(PlanDockType.WAITING.value).row_items(Plan.model_name, 1).filter(state=DockItemState.DOCKED).all_rows()
    story.expect_rows(len(cards) == 1, story.container.get(Queries).query(ApprovalRequest).count() == 0)


def test_a_person_approves_the_ready_plan_on_its_card_and_a_registry_change_asks_nothing_more(new_story):
    story = new_story(fixture=ReadyApprovalPlan)
    story.expect_sync_success(UPGRADE)
    story.run_listeners()
    story.expect_rows(story.container.get(Queries).query(ApprovalRequest).count() == 0)
    story.expect_success("plan approve 1 --environment main", "state: approved", actor=story.user)
    story.expect_rows(story.container.get(Queries).query(Plan).find(1).state is PlanState.APPROVED)


@pytest.fixture
def waiting_trigger(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success('trigger make "deploy" "Check the release notes" --environment main', actor=story.agent)
    request = story.container.get(Queries).query(ApprovalRequest).first()
    story.expect_rows(request is not None)
    return story, request


@pytest.fixture
def trigger_viewer(waiting_trigger):
    with viewer_client(waiting_trigger[0]) as viewer:
        yield viewer


@pytest.mark.parametrize("decision", ["accept", "refuse"])
def test_a_waiting_trigger_uses_the_shared_dock(waiting_trigger, trigger_viewer, decision):
    story, request = waiting_trigger
    trigger_viewer.value("messages.chat", ["approval", decision, str(request.id)])
    trigger = story.container.get(Queries).query(Trigger).find(1)
    story.expect_rows((not trigger.needs_enabling) if decision == "accept" else trigger.ended_at is not None)


@pytest.fixture
def waiting_share(new_story):
    story = new_story(fixture=PhasesPlan)
    story.new_row_id("share make plans:1 --environment main", actor=story.agent)
    request = story.container.get(Queries).query(ApprovalRequest).filter(arguments=("share", "accept", "1")).first()
    story.expect_rows(request is not None)
    return story, request


@pytest.fixture
def share_viewer(waiting_share):
    with viewer_client(waiting_share[0]) as viewer:
        yield viewer


@pytest.mark.parametrize("decision,state", [("accept", ShareLinkState.ACTIVE), ("refuse", ShareLinkState.DENIED)])
def test_an_agents_share_request_creates_the_approval_without_another_command(waiting_share, share_viewer, decision, state):
    story, request = waiting_share
    share_viewer.value("messages.chat", ["approval", decision, str(request.id)])
    share = story.container.get(Queries).query(ShareLink).find(1)
    story.expect_rows(share.state is state)
    if state is ShareLinkState.ACTIVE:
        story.expect_rows(share.creator_id == story.user.id)
