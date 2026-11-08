import pytest

from core.base.query.queries import Queries
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


@pytest.fixture
def phone_request(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal("phone pair --reason needed", "A person was asked in the dock", actor=story.agent)
    return story, story.container.get(Queries).query(ApprovalRequest).first()


@pytest.fixture
def phone_viewer(phone_request):
    with viewer_client(phone_request[0]) as viewer:
        yield viewer


def test_a_second_decision_cannot_run_the_action_again(phone_request, phone_viewer):
    story, request = phone_request
    phone_viewer.value("messages.chat", ["approval", "accept", str(request.id)])
    phone_viewer.refusal("messages.chat", ["approval", "accept", str(request.id)], "begin")
    story.expect_rows(len(tuple(story.container.get(Queries).query(PhoneCode).all_rows())) == 1)


def test_a_missing_open_card_is_restored_after_a_registry_refresh(phone_request, phone_viewer):
    story, request = phone_request
    item = story.container.get(Queries).query(DockItem).filter(target_model="approval", target_id=request.id).first()
    phone_viewer.value("messages.chat", ["dock", "remove", str(item.id)])
    story.expect_sync_success(UPGRADE)
    story.run_listeners()
    items = tuple(story.container.get(Queries).query(DockItem).filter(target_model="approval", target_id=request.id, state=DockItemState.DOCKED).all_rows())
    story.expect_rows(len(items) == 1, items[0].kept)


def test_a_failed_action_keeps_its_card_open_for_refusal(new_story):
    story = new_story(NOTES, fixture=UserJoined)
    with viewer_client(story) as viewer:
        viewer.value("viewer.shell", ["viewer-layout", "save", "--suite", "notes", "--page", "home", "--layout", "{}"])
    line = "viewer-layout save --suite notes --page home --layout '{}' --base-version 1 --reason needed --environment main"
    story.expect_refusal(line, "A person was asked in the dock", actor=story.agent)
    request = story.container.get(Queries).query(ApprovalRequest).first()
    with viewer_client(story) as viewer:
        viewer.value("viewer.shell", ["viewer-layout", "save", "--suite", "notes", "--page", "home", "--layout", '{"root":"changed"}'])
        viewer.refusal("messages.chat", ["approval", "accept", str(request.id)], "the requested action failed")
        saved = story.container.get(Queries).query(ApprovalRequest).find(request.id)
        story.expect_rows(saved.state is ApprovalState.OPEN)
        viewer.value("messages.chat", ["approval", "refuse", str(request.id)])
    saved = story.container.get(Queries).query(ApprovalRequest).find(request.id)
    story.expect_rows(saved.state is ApprovalState.REFUSED)


def test_an_action_that_raises_can_be_accepted_again(phone_request, phone_viewer, monkeypatch):
    story, request = phone_request
    run_action = AnswerApprovalHandler.run_action

    def fail(*args):
        raise RuntimeError("action stopped")

    monkeypatch.setattr(AnswerApprovalHandler, "run_action", fail)
    with pytest.raises(AssertionError):
        phone_viewer.value("messages.chat", ["approval", "accept", str(request.id)])
    story.expect_rows(story.row(ApprovalRequest, request.id).state is ApprovalState.OPEN)
    story.expect_refusal("phone pair --reason needed", "A person was asked in the dock", actor=story.agent)
    monkeypatch.setattr(AnswerApprovalHandler, "run_action", run_action)
    phone_viewer.value("messages.chat", ["approval", "accept", str(request.id)])
    story.expect_rows(story.row(ApprovalRequest, request.id).state is ApprovalState.ACCEPTED)
