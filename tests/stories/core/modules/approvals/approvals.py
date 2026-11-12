from typing import NamedTuple

import pytest

from engine.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from engine.setting.setting_values import SettingValues
from engine.testing.stories.story import Story
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

TEST_ROWS_REASON = "the test reads every row it checks"

SETTING = "journal.core.project-rules.agents-make-rules"
CHANGE_SETTING = f"setting set {SETTING} true --project --reason needed"


class PendingSetting(NamedTuple):
    story: Story
    request: ApprovalRequest


class PendingRule(NamedTuple):
    story: Story
    rule_id: int
    request: ApprovalRequest


@pytest.fixture
def pending_setting(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_refusal(CHANGE_SETTING, "A person was asked in the dock", actor=story.agent)
    request = story.container.get(Queries).query(ApprovalRequest).first()
    story.expect_rows(request is not None)
    return PendingSetting(story, request)


@pytest.fixture
def proposed_rule(new_story):
    story = new_story(fixture=UserBuilder)
    rule_id = story.new_row_id('rule make "Name every file plainly"', actor=story.agent)
    request = story.container.get(Queries).query(ApprovalRequest).first()
    story.expect_rows(request is not None, request.requester_id == story.agent.id)
    return PendingRule(story, rule_id, request)


@pytest.fixture
def rule_viewer(proposed_rule):
    with viewer_client(proposed_rule.story) as viewer:
        yield viewer


def test_accepting_a_docked_request_runs_the_action_with_the_viewer_persons_rights(pending_setting):
    story, request = pending_setting
    story.expect_text("dock-item main --environment main", "approvals.request", actor=story.user)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        server.viewer_line_value(cookie, {"window": "messages.chat", "environment": "main", "line": ["approval", "accept", str(request.id)]})
    story.expect_rows(story.container.get(SettingValues).flag(SETTING))
    story.expect_text(f"approval show {request.id}", "state: accepted")


def test_refusing_a_docked_request_keeps_the_protected_setting(pending_setting):
    story, request = pending_setting
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        server.viewer_line_value(cookie, {"window": "messages.chat", "environment": "main", "line": ["approval", "refuse", str(request.id)]})
    story.expect_rows(not story.container.get(SettingValues).flag(SETTING))
    story.expect_text(f"approval show {request.id}", "state: refused")


@pytest.mark.parametrize("decision", ["accept", "refuse"])
def test_an_agent_can_never_decide_a_docked_request(pending_setting, decision):
    story, request = pending_setting
    story.expect_refusal(f"approval {decision} {request.id}", "an agent cannot decide", actor=story.agent)
    story.expect_text(f"approval show {request.id}", "state: open")


def test_an_agent_cannot_hide_a_pending_approval(pending_setting):
    story, request = pending_setting
    item = story.container.get(Queries).query(DockItem).filter(target_model="approval", target_id=request.id).first()
    story.expect_refusal(f"dock remove {item.id}", "an agent cannot change a card waiting for a person", actor=story.agent)
    story.expect_text(f"approval show {request.id}", "state: open")


def test_every_pending_approval_stays_visible_beyond_the_ordinary_dock_limit(new_story):
    story = new_story(fixture=UserBuilder)
    for number in range(8):
        story.new_row_id(f'rule make "Keep rule {number}"', actor=story.agent)
    items = tuple(story.container.get(Queries).query(DockItem).filter(type="approvals.request", state=DockItemState.DOCKED).every_row(TEST_ROWS_REASON))
    story.expect_rows(len(items) == 8, all(item.kept for item in items))


@pytest.mark.parametrize("decision,state", [("accept", "active"), ("refuse", "denied")])
def test_a_rule_proposal_uses_the_same_dock_and_person_decision(proposed_rule, rule_viewer, decision, state):
    story, rule_id, request = proposed_rule
    story.expect_refusal(f"rule approve {rule_id}", "a person was asked", actor=story.agent)
    rule_viewer.value("messages.chat", ["approval", decision, str(request.id)])
    story.expect_text(f"rule show {rule_id}", f"state: {state}")


def test_an_explicit_setting_request_also_uses_the_shared_dock(new_story):
    story = new_story(fixture=UserBuilder)
    request_id = story.new_row_id(f'setting request {SETTING} true --project --reason "Let agents maintain these rules"', actor=story.agent)
    story.expect_text("dock-item main --environment main", "approvals.request", actor=story.user)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        server.viewer_line_value(cookie, {"window": "messages.chat", "environment": "main", "line": ["approval", "accept", str(request_id)]})
    story.expect_rows(story.container.get(SettingValues).flag(SETTING))
