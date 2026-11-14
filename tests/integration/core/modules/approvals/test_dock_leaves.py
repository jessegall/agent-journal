from engine.command.bus import Bus
from engine.command.close_user_approval import CloseUserApproval
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from tests.integration.core.modules.approvals.test_approvals import SETTING, pending_setting
from server.work.booting_work import BootingWork
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client


__all__ = ["pending_setting"]


def docked_cards(story, request) -> int:
    return len(tuple(story.story_rows(DockItem, target_model="approval", target_id=request.id, state=DockItemState.DOCKED)))


def decide(story, request, decision: str) -> None:
    with server_story(story) as server:
        server.viewer_line_value(server.expect_viewer_login(server.viewer_key("Ada")), {"window": "messages.chat", "environment": "main", "line": ["approval", decision, str(request.id)]})


def test_an_accepted_approval_and_a_refused_one_leave_the_dock(pending_setting):
    story, request = pending_setting
    rule_id = story.new_row_id('rule make "Name every file plainly"', actor=story.agent)
    refused = story.newest_row(ApprovalRequest)
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


def test_a_decided_approval_is_never_docked_again_and_shows_in_no_dock_before_a_viewer_opens(pending_setting):
    story, request = pending_setting
    decide(story, request, "accept")
    story.run_listeners()
    story.expect_rows(docked_cards(story, request) == 0)
    with viewer_client(story):
        BootingWork().run(story.container)
    story.run_listeners()
    story.expect_rows(docked_cards(story, request) == 0)
