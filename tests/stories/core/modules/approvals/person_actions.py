from typing import NamedTuple

import pytest

from engine.model.model import Model
from engine.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.phone.models.phone_code import PhoneCode
from core.modules.viewer.models.person_preset import PersonPreset
from core.modules.viewer.models.viewer_layout import ViewerLayout
from core.modules.viewer.models.window_permission import WindowPermission
from tests.stories.core.modules.viewer.support.window_samples import NOTES
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

SHAPE = '{"tabs":["notes.board"],"active":"notes.board","width":"full"}'
SAVE_PRESET = f"person-preset save --page home --name Mine --shape '{SHAPE}' --reason needed --environment main"


class PersonAction(NamedTuple):
    line: str
    model: type[Model]


@pytest.fixture
def person_story(new_story):
    return new_story(NOTES, fixture=UserJoined)


@pytest.fixture(params=[
    PersonAction("window allow notes.board --type reads --reason needed --environment main", WindowPermission),
    PersonAction("window trust notes --reason needed --environment main", WindowPermission),
    PersonAction("viewer-layout save --suite notes --page home --layout '{}' --reason needed --environment main", ViewerLayout),
    PersonAction(SAVE_PRESET, PersonPreset),
    PersonAction("phone pair --reason needed", PhoneCode),
])
def pending_person_action(person_story, request):
    story = person_story
    action = request.param
    story.expect_refusal(action.line, "A person was asked in the dock", actor=story.agent)
    approval = story.container.get(Queries).query(ApprovalRequest).first()
    story.expect_rows(approval is not None, approval.required_person_id is None)
    return story, approval, action.model


@pytest.fixture
def action_viewer(pending_person_action):
    with viewer_client(pending_person_action[0]) as viewer:
        yield viewer


def test_accepting_builds_the_row_with_the_real_persons_identity(pending_person_action, action_viewer):
    story, approval, model = pending_person_action
    action_viewer.value("messages.chat", ["approval", "accept", str(approval.id)])
    row = story.container.get(Queries).query(model).first()
    story.expect_rows(row is not None, row.person_id == story.user.id, row.creator_id == story.user.id)


@pytest.fixture
def pending_rename(person_story):
    story = person_story
    story.new_row_id('actor make user "Bob"')
    with viewer_client(story) as viewer:
        viewer.value("viewer.shell", ["person-preset", "save", "--page", "home", "--name", "Mine", "--shape", SHAPE])
    preset = story.container.get(Queries).query(PersonPreset).first()
    story.expect_refusal(f"person-preset rename {preset.id} --name Review --reason needed", "A person was asked in the dock", actor=story.agent)
    request = story.container.get(Queries).query(ApprovalRequest).first()
    story.expect_rows(request.required_person_id == story.user.id)
    return story, request, preset


@pytest.fixture
def rename_viewer(pending_rename):
    with viewer_client(pending_rename[0]) as viewer:
        yield viewer


def test_a_different_person_cannot_accept_an_owners_approval(pending_rename, rename_viewer):
    story, request, preset = pending_rename
    cookie = rename_viewer.server.expect_viewer_login(rename_viewer.server.viewer_key("Bob"))
    body = {"window": "messages.chat", "environment": "main", "line": ["approval", "accept", str(request.id)]}
    rename_viewer.server.expect_viewer_line(cookie, body, 200, "this approval belongs to another person")
    rename_viewer.value("messages.chat", ["approval", "accept", str(request.id)])
    saved = story.container.get(Queries).query(PersonPreset).find(preset.id)
    story.expect_rows(saved.name == "Review", saved.person_id == story.user.id)
