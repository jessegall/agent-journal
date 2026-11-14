from tests.stories.core.support.agent_labels import agent_number
import json

import pytest

from engine.command.bus import Bus
from core.modules.drivers.commands.resume_agent.resume_agent import ResumeAgent
from core.modules.agents.models.agent import Agent
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client
from tests.integration.support.fixture_journal import FixtureJournal


class ResumeRequested(StoryFixture):
    """A user paused the agent, and the agent asked to be resumed, so the dock holds the question."""

    parent = UserJoined

    def steps(self, story: FixtureJournal) -> None:
        story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.user)
        story.expect_refusal(f"agent resume {agent_number(story, story.agent.id)} --reason needed", "A user was asked in the dock", actor=story.agent)


@pytest.fixture
def resume_approval(played):
    story = played(ResumeRequested)
    approval = story.first_row(ApprovalRequest)
    story.expect_rows(approval is not None)
    return story, approval


def approvals(story) -> list[ApprovalRequest]:
    return list(story.story_rows(ApprovalRequest))










def test_a_command_run_as_approved_by_an_approval_asks_nobody_again_whoever_runs_it(played):
    story = played(ResumeRequested)
    story.expect_text(f"approval list", "Resume the paused main agent", actor=story.user)
    story.container.get(Bus).run(ResumeAgent(story.agent.id), story.agent, environment_id=1, approval_id=1)
    story.expect_rows(story.row(Agent, story.agent.id).paused_at is None)
