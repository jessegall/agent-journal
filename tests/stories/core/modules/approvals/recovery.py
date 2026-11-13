import pytest

from engine.query.queries import Queries
from core.modules.approvals.commands.answer_approval.answer_approval_handler import AnswerApprovalHandler
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.phone.models.phone_code import PhoneCode
from tests.stories.core.modules.approvals.support.legacy_setting_requests import UPGRADE
from tests.stories.core.modules.viewer.support.window_samples import NOTES
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

TEST_ROWS_REASON = "the test reads every row it checks"


@pytest.fixture
def phone_request(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal("phone pair --reason needed", "A user was asked in the dock", actor=story.agent)
    return story, story.container.get(Queries).query(ApprovalRequest).first()


@pytest.fixture
def phone_viewer(phone_request):
    with viewer_client(phone_request[0]) as viewer:
        yield viewer


def test_a_second_decision_cannot_run_the_action_again(phone_request, phone_viewer):
    story, request = phone_request
    phone_viewer.value("messages.chat", ["approval", "accept", str(request.id)])
    phone_viewer.refusal("messages.chat", ["approval", "accept", str(request.id)], "begin")
    story.expect_rows(len(tuple(story.story_rows(PhoneCode))) == 1)


def test_a_missing_open_card_is_restored_after_a_registry_refresh(phone_request, phone_viewer):
    story, request = phone_request
    item = story.container.get(Queries).query(DockItem).filter(target_model="approval", target_id=request.id).first()
    phone_viewer.value("messages.chat", ["dock", "remove", str(item.id)])
    story.expect_sync_success(UPGRADE)
    story.run_listeners()
    items = tuple(story.container.get(Queries).query(DockItem).filter(target_model="approval", target_id=request.id, state=DockItemState.DOCKED).every_row(TEST_ROWS_REASON))
    story.expect_rows(len(items) == 1, items[0].kept)


def test_a_failed_action_ends_the_request_failed_with_its_reason_and_is_not_offered_again(new_story):
    story = new_story(NOTES, fixture=UserJoined)
    with viewer_client(story) as viewer:
        viewer.value("viewer.shell", ["viewer-layout", "save", "--suite", "notes", "--page", "home", "--layout", "{}"])
    line = "viewer-layout save --suite notes --page home --layout '{}' --base-version 1 --reason needed --environment main"
    story.expect_refusal(line, "A user was asked in the dock", actor=story.agent)
    request = story.container.get(Queries).query(ApprovalRequest).first()
    with viewer_client(story) as viewer:
        viewer.value("viewer.shell", ["viewer-layout", "save", "--suite", "notes", "--page", "home", "--layout", '{"root":"changed"}'])
        viewer.refusal("messages.chat", ["approval", "accept", str(request.id)], "the requested action failed")
    saved = story.container.get(Queries).query(ApprovalRequest).find(request.id)
    docked = story.container.get(Queries).query(DockItem).filter(target_model="approval", target_id=request.id, state=DockItemState.DOCKED).every_row(TEST_ROWS_REASON)
    story.expect_rows(saved.state is ApprovalState.FAILED, saved.failure != "", not tuple(docked))
    story.expect_rows(not tuple(story.container.get(Queries).query(ApprovalRequest).filter(state=ApprovalState.OPEN).every_row(TEST_ROWS_REASON)))


def test_an_action_that_raises_ends_the_request_failed_and_the_agent_asks_again(phone_request, phone_viewer, monkeypatch):
    story, request = phone_request
    run_action = AnswerApprovalHandler.run_action

    def fail(*args):
        raise RuntimeError("action stopped")

    monkeypatch.setattr(AnswerApprovalHandler, "run_action", fail)
    with pytest.raises(AssertionError):
        phone_viewer.value("messages.chat", ["approval", "accept", str(request.id)])
    failed = story.row(ApprovalRequest, request.id)
    story.expect_rows(failed.state is ApprovalState.FAILED, failed.failure == "action stopped")
    monkeypatch.setattr(AnswerApprovalHandler, "run_action", run_action)
    story.expect_refusal("phone pair --reason needed", "A user was asked in the dock", actor=story.agent)
    asked_again = story.container.get(Queries).query(ApprovalRequest).filter(state=ApprovalState.OPEN).first()
    story.expect_rows(asked_again is not None, asked_again.id != request.id)
    phone_viewer.value("messages.chat", ["approval", "accept", str(asked_again.id)])
    story.expect_rows(story.row(ApprovalRequest, asked_again.id).state is ApprovalState.ACCEPTED)
