from tests.stories.core.support.agent_labels import agent_number
from core.modules.agents.models.agent import Agent
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.drivers.support.driver_settings import AUTOMATIC_APPROVAL
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.approvals.standing_approvals import REQUESTED, requests, save_preset, standing_yeses
from tests.stories.core.modules.viewer.support.window_samples import NOTES
from tests.stories.core.support.fixtures import UserJoined

SWITCH_ON = f"setting set {AUTOMATIC_APPROVAL} true --project"


class EveryApprovalAccepted(StoryFixture):
    """A user switched Accept every approval on for the project."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        story.expect_success(SWITCH_ON, actor=story.user)


def test_with_the_setting_on_a_request_is_accepted_at_once_as_the_person_who_switched_it_on_and_its_command_runs(new_story):
    story = new_story(NOTES, fixture=EveryApprovalAccepted)
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.user)
    story.expect_text(f"agent resume {agent_number(story, story.agent.id)} --reason needed", "the setting Accept every approval accepted approval", actor=story.agent)
    accepted = requests(story)[0]
    story.expect_rows(accepted.state is ApprovalState.ACCEPTED, accepted.standing_id is None, standing_yeses(story) == [], story.row(Agent, story.agent.id).paused_at is None, detail=str(accepted))
    story.expect_text(save_preset("Mine"), "accepted approval", actor=story.agent)
    story.expect_rows([request.state for request in requests(story)] == [ApprovalState.ACCEPTED, ApprovalState.ACCEPTED])


def test_an_agent_cannot_switch_the_setting_on_and_its_request_waits_for_the_person(new_story):
    story = new_story(NOTES, fixture=UserJoined)
    story.expect_rows(story.run(SWITCH_ON, actor=story.agent).code != 0)
    story.expect_refusal(save_preset("Mine"), REQUESTED, actor=story.agent)
    story.expect_rows(requests(story)[-1].state is ApprovalState.OPEN)
