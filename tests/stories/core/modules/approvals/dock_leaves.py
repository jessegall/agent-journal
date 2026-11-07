from core.base.command.bus import Bus
from core.base.command.close_user_approval import CloseUserApproval
from core.base.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from tests.stories.core.modules.approvals.approvals import SETTING, pending_setting
from tests.stories.server.support.server_client import server_story

__all__ = ["pending_setting"]


def docked_cards(story, request) -> int:
    return len(tuple(story.container.get(Queries).query(DockItem).filter(target_model="approval", target_id=request.id, state=DockItemState.DOCKED).all_rows()))


def decide(story, request, decision: str) -> None:
    with server_story(story) as server:
        server.viewer_line_value(server.expect_viewer_login(server.viewer_key("Ada")), {"window": "messages.chat", "environment": "main", "line": ["approval", decision, str(request.id)]})


def test_an_accepted_approval_and_a_refused_one_leave_the_dock(pending_setting):
    story, request = pending_setting
    rule_id = story.new_row_id('rule make "Name every file plainly"', actor=story.agent)
    refused = story.container.get(Queries).query(ApprovalRequest).newest().first()
    story.expect_rows(docked_cards(story, request) == 1, docked_cards(story, refused) == 1, refused.id != request.id)
    decide(story, request, "accept")
    decide(story, refused, "refuse")
    story.expect_rows(docked_cards(story, request) == 0, docked_cards(story, refused) == 0)
    story.expect_text(f"rule show {rule_id}", "state: denied")


def test_an_approval_closed_as_outdated_leaves_the_dock(pending_setting):
    story, request = pending_setting
    story.expect_success(f"setting set {SETTING} false --project", actor=story.user)
    story.run_listeners()
    story.expect_text(f"approval show {request.id}", "state: closed")
    story.expect_rows(docked_cards(story, request) == 0)


def test_an_approval_whose_asking_request_ended_leaves_the_dock(pending_setting):
    story, request = pending_setting
    story.container.get(Bus).run(CloseUserApproval(request.arguments), story.user, environment_id=request.environment_id)
    story.run_listeners()
    story.expect_text(f"approval show {request.id}", "state: closed")
    story.expect_rows(docked_cards(story, request) == 0)
