import pytest
import json

from engine.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.settings.models.setting import Setting
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client
from core.modules.project_rules.support.rule_settings import RULE_APPROVAL_SETTING
from core.modules.settings.support.settings_tree import BACKUP_MINUTES_SETTING

SETTING = f"{RULE_APPROVAL_SETTING}"
AGENT_SETTING = f"{BACKUP_MINUTES_SETTING}"
REQUEST = f'setting request {SETTING} on --reason "Rules need no card" --environment main'


@pytest.fixture
def setting_story(new_story):
    return new_story(fixture=UserJoined)


@pytest.fixture(params=[False, True], ids=["environment", "project"])
def pending_setting(setting_story, request):
    story = setting_story
    line = f'{REQUEST} --project' if request.param else REQUEST
    request_id = story.new_row_id(line, actor=story.agent)
    return story, request_id, request.param


@pytest.fixture
def setting_viewer(pending_setting):
    with viewer_client(pending_setting[0]) as viewer:
        yield viewer


def test_the_request_shows_the_old_value_new_value_and_reason_in_the_dock(setting_story):
    story = setting_story
    story.expect_success(REQUEST, "A user was asked in the dock: approval 1", actor=story.agent)
    story.expect_text("approval show 1", "Agents make rules without approval", "from False to True", "why: Rules need no card", "state: open")
    story.expect_text(f"setting show {SETTING} --environment main", "value: False", actor=story.user)


@pytest.mark.parametrize("decision,value", [("accept", True), ("refuse", False)])
def test_the_person_decides_the_setting_from_the_shared_dock(pending_setting, setting_viewer, decision, value):
    story, request_id, project = pending_setting
    setting_viewer.value("messages.chat", ["approval", decision, str(request_id)])
    setting = story.container.get(Queries).query(Setting).filter(key=SETTING).first()
    story.expect_rows((setting is not None and json.loads(setting.value)) is value)
    if value:
        story.expect_rows(setting.environment_id == (None if project else 1), setting.creator_id == story.user.id)


def test_a_person_cannot_make_the_request(setting_story):
    story = setting_story
    story.expect_refusal(REQUEST, "only an agent asks for a setting", actor=story.user)
    story.expect_rows(not story.container.get(Queries).query(ApprovalRequest).exists())


def test_a_setting_an_agent_may_set_itself_is_not_asked_for(setting_story):
    story = setting_story
    story.expect_refusal(f'setting request {AGENT_SETTING} 30 --reason "Copy more often" --environment main', f"an agent may set {AGENT_SETTING} itself", actor=story.agent)
    story.expect_rows(not story.container.get(Queries).query(ApprovalRequest).exists())


def test_a_request_with_no_reason_is_refused(setting_story):
    story = setting_story
    story.expect_refusal(f'setting request {SETTING} on --reason " " --environment main', "say why the setting should change", actor=story.agent)
    story.expect_rows(not story.container.get(Queries).query(ApprovalRequest).exists())


def test_a_value_of_the_wrong_type_is_refused_before_requesting_approval(setting_story):
    story = setting_story
    story.expect_refusal(f'setting request {SETTING} maybe --reason "Rules need no card" --environment main', f"{SETTING} is a", actor=story.agent)
    story.expect_rows(not story.container.get(Queries).query(ApprovalRequest).exists())


@pytest.mark.parametrize("decision", ["accept", "refuse"])
def test_the_requesting_agent_cannot_decide_or_close_it(pending_setting, decision):
    story, request_id, _ = pending_setting
    story.expect_refusal(f"approval {decision} {request_id}", "an agent cannot decide", actor=story.agent)


def test_no_agent_can_skip_the_person_decision_guard(setting_story):
    story = setting_story
    story.expect_refusal('refusal skip approvals.person-decides --reason "I need it" --environment main', "safety refusal", actor=story.agent)


def test_a_setting_approval_closes_itself_when_its_own_setting_changes_before_it_is_decided(setting_story):
    story = setting_story
    story.expect_success(f'setting request {SETTING} on --reason "Stale soon" --environment main', actor=story.agent)
    story.expect_success(f"setting set {AGENT_SETTING} 30 --project", actor=story.user)
    story.run_listeners()
    story.expect_text("approval show 1", "state: open")
    story.expect_success(f"setting set {SETTING} true --environment main", actor=story.user)
    story.run_listeners()
    story.expect_text("approval show 1", "state: closed", f"outdated: {SETTING} changed since this change was asked for")
