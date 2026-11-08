from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.models.enums.standing_scope import StandingScope
from core.modules.approvals.models.standing_approval import StandingApproval
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.viewer.support.window_samples import NOTES
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

SHAPE = '{"tabs":["notes.board"],"active":"notes.board","width":"full"}'
ASKED = "A person was asked in the dock"


def save_preset(name: str) -> str:
    return f"person-preset save --page home --name {name} --shape '{SHAPE}' --reason needed --environment main"


def requests(story: Story) -> list[ApprovalRequest]:
    return list(story.container.get(Queries).query(ApprovalRequest).all_rows())


def standing_yeses(story: Story) -> list[StandingApproval]:
    return list(story.container.get(Queries).query(StandingApproval).all_rows())


def accepted_always(story: Story, request: ApprovalRequest, scope: str) -> None:
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "accept", str(request.id), "--always", scope])


def ask_for_resume(story: Story) -> None:
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.expect_refusal(f"agent resume {story.agent.id} --reason needed", ASKED, actor=story.agent)


class ResumeAsked(StoryFixture):
    """A person paused the agent and the agent asked to be resumed, so the dock holds the question."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        ask_for_resume(story)


class ResumeAlwaysSame(StoryFixture):
    """The person accepted that question and kept a standing yes for the same request."""

    parent = ResumeAsked

    def steps(self, story: Story) -> None:
        accepted_always(story, requests(story)[0], "same")


def test_accept_once_keeps_no_standing_yes_and_the_next_request_asks_again(new_story):
    story = new_story(NOTES, fixture=ResumeAsked)
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "accept", str(requests(story)[0].id)])
    story.expect_rows(standing_yeses(story) == [], story.row(Agent, story.agent.id).paused_at is None)
    ask_for_resume(story)
    story.expect_rows([request.state for request in requests(story)] == [ApprovalState.ACCEPTED, ApprovalState.OPEN])


def test_always_for_the_same_request_accepts_the_same_request_with_no_card_and_still_asks_about_another_kind(new_story):
    story = new_story(NOTES, fixture=ResumeAlwaysSame)
    standing = standing_yeses(story)
    story.expect_rows(len(standing) == 1, standing[0].scope is StandingScope.SAME, standing[0].creator_id == story.user.id, detail=str(standing))
    ask_for_resume(story)
    covered = requests(story)[1]
    story.expect_rows(covered.state is ApprovalState.ACCEPTED, covered.standing_id == standing[0].id, story.row(Agent, story.agent.id).paused_at is None, detail=str(covered))
    story.expect_refusal(save_preset("Mine"), ASKED, actor=story.agent)
    story.expect_rows(requests(story)[2].state is ApprovalState.OPEN, len(requests(story)) == 3)


def test_a_request_a_standing_yes_accepted_leaves_a_chat_mark_naming_it(new_story):
    story = new_story(NOTES, fixture=ResumeAlwaysSame)
    story.expect_text("standing-approval list", "ResumeAgent", actor=story.user)
    ask_for_resume(story)
    story.run_listeners()
    story.expect_text("chat-mark list --environment main", f"Standing yes {standing_yeses(story)[0].id} accepted approval {requests(story)[1].id}", actor=story.user)


def test_always_for_any_request_like_it_covers_the_same_kind_and_target_whatever_follows(new_story):
    story = new_story(NOTES, fixture=UserJoined)
    story.expect_refusal(save_preset("Mine"), ASKED, actor=story.agent)
    accepted_always(story, requests(story)[0], "like")
    story.expect_rows(standing_yeses(story)[0].scope is StandingScope.LIKE)
    story.expect_refusal(save_preset("Other"), "", actor=story.agent)
    story.run_listeners()
    story.expect_rows(len(requests(story)) == 2, requests(story)[1].state is ApprovalState.ACCEPTED, requests(story)[1].standing_id == standing_yeses(story)[0].id)
    ask_for_resume(story)
    story.expect_rows(requests(story)[2].state is ApprovalState.OPEN)


def test_a_removed_standing_yes_asks_again(new_story):
    story = new_story(NOTES, fixture=ResumeAlwaysSame)
    story.expect_success(f"standing-approval delete {standing_yeses(story)[0].id}", actor=story.user)
    story.expect_rows(standing_yeses(story) == [])
    ask_for_resume(story)
    story.expect_rows(requests(story)[1].state is ApprovalState.OPEN)


def test_an_agent_cannot_make_or_remove_a_standing_yes(new_story):
    story = new_story(NOTES, fixture=ResumeAlwaysSame)
    story.expect_refusal(f"standing-approval delete {standing_yeses(story)[0].id}", "an agent cannot", actor=story.agent)
