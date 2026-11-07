import pytest

from core.base.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.triggers.models.trigger import Trigger
from core.modules.sharing.models.share_link import ShareLink
from core.modules.sharing.models.enums.share_link_state import ShareLinkState
from tests.stories.core.modules.plans.support.approval_fixtures import ReadyApprovalPlan
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.core.support.fixtures import PlanWithPhases
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client


@pytest.fixture
def ready_plan(new_story):
    story = new_story(fixture=ReadyApprovalPlan)
    request = story.container.get(Queries).query(ApprovalRequest).first()
    story.expect_rows(request is not None, request.requester_id == story.agent.id)
    return story, request


@pytest.fixture
def plan_viewer(ready_plan):
    with viewer_client(ready_plan[0]) as viewer:
        yield viewer


@pytest.mark.parametrize("decision,state", [("accept", PlanState.APPROVED), ("refuse", PlanState.READY)])
def test_a_ready_plan_is_automatically_docked_for_the_persons_decision(ready_plan, plan_viewer, decision, state):
    story, request = ready_plan
    plan_viewer.value("messages.chat", ["approval", decision, str(request.id)])
    plan = story.container.get(Queries).query(Plan).find(1)
    story.expect_rows(plan.state is state)


@pytest.fixture
def waiting_trigger(new_story):
    story = new_story(fixture=BuilderWithUser)
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
    story = new_story(fixture=PlanWithPhases)
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
