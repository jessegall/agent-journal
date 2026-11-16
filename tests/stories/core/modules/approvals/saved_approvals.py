from tests.stories.core.support.agent_labels import agent_number
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.models.enums.saved_scope import SavedScope
from core.modules.approvals.models.saved_approval import SavedApproval
from engine.testing.stories.story import Story
from core.modules.approvals.models.enums.approval_dock_type import ApprovalDockType
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.viewer.support.window_samples import NOTES
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

TEST_ROWS_REASON = "the test reads every row it checks"

SHAPE = '{"tabs":["notes.board"],"active":"notes.board","width":"full"}'
REQUESTED = "A user was asked in the dock"


def save_preset(name: str) -> str:
    return f"person-preset save --page home --name {name} --shape '{SHAPE}' --reason needed --environment main"


def requests(story: Story) -> list[ApprovalRequest]:
    return list(story.story_rows(ApprovalRequest))


def saved_yeses(story: Story) -> list[SavedApproval]:
    return list(story.story_rows(SavedApproval))


def permanent_acceptance(story: Story, request: ApprovalRequest, scope: str) -> None:
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "accept", str(request.id), "--always", scope])


def resume_request(story: Story) -> None:
    story.expect_success(f"agent pause {agent_number(story, story.agent.agent_id())}", actor=story.user)
    story.expect_refusal(f"agent resume {agent_number(story, story.agent.agent_id())} --reason needed", REQUESTED, actor=story.agent)


def resume_approved(story: Story) -> None:
    story.expect_success(f"agent pause {agent_number(story, story.agent.agent_id())}", actor=story.user)
    story.expect_text(f"agent resume {agent_number(story, story.agent.agent_id())} --reason needed", "accepted approval", actor=story.agent)


class ResumeRequested(StoryFixture):
    """A user paused the agent and the agent asked to be resumed, so the dock holds the question."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        resume_request(story)


class ResumeFixedSession(StoryFixture):
    """The user accepted that question and kept a saved yes for the same request."""

    parent = ResumeRequested

    def steps(self, story: Story) -> None:
        permanent_acceptance(story, requests(story)[0], "same")


def test_accept_once_keeps_no_saved_yes_and_the_next_request_asks_again(new_story):
    story = new_story(NOTES, fixture=ResumeRequested)
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "accept", str(requests(story)[0].id)])
    story.expect_rows(saved_yeses(story) == [], story.row(Agent, story.agent.id).paused_at is None)
    resume_request(story)
    story.expect_rows([request.state for request in requests(story)] == [ApprovalState.ACCEPTED, ApprovalState.OPEN])


def test_always_for_the_same_request_accepts_the_same_request_with_no_card_and_still_asks_about_another_kind(new_story):
    story = new_story(NOTES, fixture=ResumeFixedSession)
    saved = saved_yeses(story)
    story.expect_rows(len(saved) == 1, saved[0].scope is SavedScope.EXACT, saved[0].creator_id == story.user.id, detail=str(saved))
    resume_approved(story)
    covered = requests(story)[1]
    story.expect_rows(covered.state is ApprovalState.ACCEPTED, covered.saved_approval_id == saved[0].id, story.row(Agent, story.agent.id).paused_at is None, detail=str(covered))
    story.expect_refusal(save_preset("Mine"), REQUESTED, actor=story.agent)
    story.expect_rows(requests(story)[2].state is ApprovalState.OPEN, len(requests(story)) == 3)


def test_a_request_a_saved_yes_accepted_leaves_a_chat_mark_naming_it(new_story):
    story = new_story(NOTES, fixture=ResumeFixedSession)
    story.expect_text("saved-approval list", "ResumeAgent", actor=story.user)
    resume_approved(story)
    story.run_listeners()
    story.expect_text("chat-mark list --environment main", f"Saved yes {saved_yeses(story)[0].id} accepted approval {requests(story)[1].id}", actor=story.user)
    notices = docked(story, ApprovalDockType.SAVED_USED.value)
    story.expect_rows(docked(story, ApprovalDockType.REQUEST.value) == [], len(notices) == 1, notices[0].target_id == saved_yeses(story)[0].id, notices[0].leaves_at is not None, detail=str(notices))
    story.expect_rows(notices[0].title == "Approval automatically accepted", notices[0].text == requests(story)[1].text.splitlines()[0], detail=notices[0].title)


def test_always_for_any_request_like_it_covers_the_same_kind_and_target_whatever_follows(new_story):
    story = new_story(NOTES, fixture=UserJoined)
    story.expect_refusal(save_preset("Mine"), REQUESTED, actor=story.agent)
    permanent_acceptance(story, requests(story)[0], "like")
    story.expect_rows(saved_yeses(story)[0].scope is SavedScope.LIKE)
    story.expect_text(save_preset("Other"), "accepted approval", actor=story.agent)
    story.expect_rows(len(requests(story)) == 2, requests(story)[1].state is ApprovalState.ACCEPTED, requests(story)[1].saved_approval_id == saved_yeses(story)[0].id)
    resume_request(story)
    story.expect_rows(requests(story)[2].state is ApprovalState.OPEN)


def test_a_removed_saved_yes_asks_again(new_story):
    story = new_story(NOTES, fixture=ResumeFixedSession)
    story.expect_success(f"saved-approval delete {saved_yeses(story)[0].id}", actor=story.user)
    story.expect_rows(saved_yeses(story) == [])
    resume_request(story)
    story.expect_rows(requests(story)[1].state is ApprovalState.OPEN)


def test_an_agent_cannot_make_or_remove_a_saved_yes(new_story):
    story = new_story(NOTES, fixture=ResumeFixedSession)
    story.expect_refusal(f"saved-approval delete {saved_yeses(story)[0].id}", "an agent cannot", actor=story.agent)


def docked(story, dock_type):
    return list(story.container.get(Queries).query(DockItem).filter(type=dock_type, state=DockItemState.DOCKED).every_row(TEST_ROWS_REASON))
