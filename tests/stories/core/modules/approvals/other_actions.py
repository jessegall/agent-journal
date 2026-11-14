import json

import pytest

from engine.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.mcp.models.mcp_server import McpServer
from core.modules.messages.models.message import Message
from core.modules.settings.models.setting import Setting
from tests.stories.core.modules.memories.support.memory_owners import MainAndWorkerMemories, WORKER_FACT
from tests.stories.core.modules.templates.sending import CRITIQUE
from tests.stories.core.modules.templates.support.sending_templates import SendingTemplates
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.suites.coding.modules.checks.checks import StoppedCheck
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client
from core.modules.library.support.library_address import ADDRESS_SETTING


@pytest.fixture
def approval_story(new_story):
    return new_story(fixture=UserBuilder)


def test_a_person_adds_an_agents_mcp_server_request_in_the_viewer(approval_story):
    story = approval_story
    story.expect_refusal("mcp add shop https://mcp.shop.example/mcp --reason needed", "A user was asked in the dock", actor=story.agent)
    request = story.container.get(Queries).query(ApprovalRequest).first()
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "accept", str(request.id)])
    server = story.container.get(Queries).query(McpServer).first()
    story.expect_rows(server.name == "shop", server.creator_id == story.user.id)


def test_a_person_changes_the_shared_server_address_through_the_same_dock(approval_story):
    story = approval_story
    key = f"{ADDRESS_SETTING}"
    story.expect_refusal(f"setting set {key} https://shared.example --project --reason needed", "A user was asked in the dock", actor=story.agent)
    request = story.container.get(Queries).query(ApprovalRequest).first()
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "accept", str(request.id)])
    setting = story.container.get(Queries).query(Setting).filter(key=key).first()
    story.expect_rows(json.loads(setting.value) == "https://shared.example", setting.creator_id == story.user.id)


@pytest.fixture
def pending_template(new_story):
    story = new_story(fixture=SendingTemplates)
    story.expect_refusal(CRITIQUE, "A user was asked in the dock", actor=story.agent)
    request = story.container.get(Queries).query(ApprovalRequest).newest().first()
    return story, request


@pytest.fixture
def template_viewer(pending_template):
    with viewer_client(pending_template[0]) as viewer:
        yield viewer


@pytest.mark.parametrize("decision", ["accept", "refuse"])
def test_a_template_becomes_a_person_request_only_after_acceptance(pending_template, template_viewer, decision):
    story, request = pending_template
    template_viewer.value("messages.chat", ["approval", decision, str(request.id)])
    messages = tuple(story.story_rows(Message))
    if decision == "refuse":
        story.expect_rows(not messages)
        return
    story.expect_rows(len(messages) == 1, messages[0].creator_id == story.user.id, "give plan 1 a normal read" in messages[0].text)


@pytest.fixture(params=["memory agents --reason needed", "memory counts --reason needed", "memory page --reason needed --environment main"])
def pending_memory_read(new_story, request):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_refusal(request.param, "A user was asked in the dock", actor=story.agent)
    approval = story.container.get(Queries).query(ApprovalRequest).first()
    return story, approval


@pytest.fixture
def memory_viewer(pending_memory_read):
    with viewer_client(pending_memory_read[0]) as viewer:
        yield viewer


def test_a_private_memory_view_is_returned_only_to_the_deciding_person(pending_memory_read, memory_viewer):
    story, request = pending_memory_read
    answer = memory_viewer.value("messages.chat", ["approval", "accept", str(request.id)])
    saved = story.container.get(Queries).query(ApprovalRequest).find(request.id)
    story.expect_rows(bool(answer["viewer_output"]), saved.state is ApprovalState.ACCEPTED, WORKER_FACT not in saved.text)


def test_an_agent_running_a_stopped_check_is_refused_and_no_approval_is_asked(new_story):
    story = new_story(fixture=StoppedCheck)
    story.expect_refusal("check run 1", "check 1 is stopped", actor=story.agent)
    story.expect_rows(story.container.get(Queries).query(ApprovalRequest).first() is None)