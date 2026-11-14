import pytest

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

TEST_ROWS_REASON = "the test reads every row it checks"


def test_a_ready_plan_is_docked_as_its_own_card_and_asks_no_approval_of_its_own(played):
    story = played(ReadyApprovalPlan)
    cards = story.container.get(DockItemQuery).type_items(PlanDockType.WAITING.value).row_items(Plan.model_name, 1).filter(state=DockItemState.DOCKED).every_row(TEST_ROWS_REASON)
    story.expect_rows(len(tuple(cards)) == 1, len(story.story_rows(ApprovalRequest)) == 0)




@pytest.fixture
def waiting_trigger(played):
    story = played(UserBuilder)
    story.expect_success('trigger make "deploy" "Check the release notes" --environment main', actor=story.agent)
    request = story.first_row(ApprovalRequest)
    story.expect_rows(request is not None)
    return story, request


@pytest.fixture
def trigger_viewer(waiting_trigger):
    with viewer_client(waiting_trigger[0]) as viewer:
        yield viewer




@pytest.fixture
def waiting_share(played):
    story = played(PhasesPlan)
    story.new_row_id("share make plans:1 --environment main", actor=story.agent)
    request = story.first_row(ApprovalRequest, arguments=("share", "accept", "1"))
    story.expect_rows(request is not None)
    return story, request


@pytest.fixture
def share_viewer(waiting_share):
    with viewer_client(waiting_share[0]) as viewer:
        yield viewer


