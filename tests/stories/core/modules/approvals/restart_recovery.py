from datetime import timedelta

from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.query.queries import Queries
from core.modules.approvals.commands.move_approval.move_approval import MoveApproval
from core.modules.approvals.commands.recover_approvals.recover_approvals import RecoverApprovals
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.models.lifecycles.approval_lifecycle import ApprovalLifecycle
from server.booting_work import BootingWork
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client


def test_a_claim_from_a_stopped_server_is_reopened(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal("phone pair --reason needed", "A person was asked in the dock", actor=story.agent)
    request = story.container.get(Queries).query(ApprovalRequest).first()
    with viewer_client(story):
        BootingWork().run(story.container)
        story.advance(timedelta(seconds=1))
        story.container.get(Bus).run(MoveApproval(request.id, ApprovalLifecycle.begin), story.user, environment_id=request.environment_id)
        story.advance(timedelta(minutes=6))
        assert story.container.get(Bus).run(RecoverApprovals(), Actor.core()) == 0
    story.advance(timedelta(seconds=1))
    with viewer_client(story) as viewer:
        BootingWork().run(story.container)
        assert story.container.get(Bus).run(RecoverApprovals(), Actor.core()) == 1
        story.expect_rows(story.row(ApprovalRequest, request.id).state is ApprovalState.OPEN)
        story.expect_refusal("phone pair --reason needed", "A person was asked in the dock", actor=story.agent)
        viewer.value("messages.chat", ["approval", "accept", str(request.id)])
    story.expect_rows(story.row(ApprovalRequest, request.id).state is ApprovalState.ACCEPTED)
