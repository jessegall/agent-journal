import pytest

from engine.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.questions.models.question import Question
from core.modules.questions.models.enums.question_state import QuestionState
from engine.setting.setting_values import SettingValues
from tests.stories.core.modules.approvals.support.legacy_setting_requests import MODULE, SETTING, UPGRADE, LegacySettingQuestion
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client


@pytest.fixture
def restored_question(new_story):
    story = new_story(MODULE, fixture=LegacySettingQuestion)
    story.expect_sync_success(UPGRADE)
    story.run_listeners()
    request = story.container.get(Queries).query(ApprovalRequest).first()
    story.expect_rows(request is not None, "old request" in request.why)
    return story, request


@pytest.fixture
def legacy_viewer(restored_question):
    with viewer_client(restored_question[0]) as viewer:
        yield viewer


@pytest.mark.parametrize("decision,changed", [("accept", True), ("refuse", False)])
def test_a_pending_old_setting_question_uses_the_shared_dock_after_upgrade(restored_question, legacy_viewer, decision, changed):
    story, request = restored_question
    legacy_viewer.value("messages.chat", ["approval", decision, str(request.id)])
    legacy_viewer.server.expect_eventually(f"setting show {SETTING} --environment main", f"value: {changed}")
    question = story.container.get(Queries).query(Question).find(1)
    story.expect_rows(story.container.get(SettingValues).flag(SETTING) is changed)
    story.expect_rows(question.state is QuestionState.ANSWERED)


def test_closing_the_original_question_closes_its_pending_card(restored_question):
    story, request = restored_question
    story.expect_success("question close 1", actor=story.agent)
    ended = story.container.get(Queries).query(ApprovalRequest).find(request.id)
    story.expect_rows(ended.state is ApprovalState.CLOSED, not story.container.get(SettingValues).flag(SETTING))


def test_an_agent_cannot_answer_the_old_permission_question(restored_question):
    story, request = restored_question
    story.expect_refusal("question answer 1 --answer 'Yes, approve'", "a person was asked", actor=story.agent)
    story.expect_refusal("question answer 1 --answer 'Yes, approve' --skip-guard setting-requests.person-answers",
                         "safety refusal", actor=story.agent)
    saved = story.container.get(Queries).query(ApprovalRequest).find(request.id)
    story.expect_rows(saved.state is ApprovalState.OPEN)


def test_answering_the_original_question_in_the_viewer_resolves_its_card(restored_question, legacy_viewer):
    story, request = restored_question
    legacy_viewer.value("questions.questions", ["question", "answer", "1", "--answer", "Yes, approve"])
    story.run_listeners()
    saved = story.container.get(Queries).query(ApprovalRequest).find(request.id)
    story.expect_rows(saved.state is ApprovalState.CLOSED, story.container.get(SettingValues).flag(SETTING))
