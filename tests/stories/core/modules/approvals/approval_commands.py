import json

import pytest

from core.base.command.bus import Bus
from core.base.query.queries import Queries
from core.modules.drivers.commands.resume_agent.resume_agent import ResumeAgent
from core.modules.agents.models.agent import Agent
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client


class ResumeRequested(StoryFixture):
    """A person paused the agent, and the agent asked to be resumed, so the dock holds the question."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
        story.expect_refusal(f"agent resume {story.agent.id} --reason needed", "A person was asked in the dock", actor=story.agent)


@pytest.fixture
def resume_approval(new_story):
    story = new_story(fixture=ResumeRequested)
    approval = story.container.get(Queries).query(ApprovalRequest).first()
    story.expect_rows(approval is not None)
    return story, approval


def approvals(story) -> list[ApprovalRequest]:
    return list(story.container.get(Queries).query(ApprovalRequest).all_rows())


def test_an_approval_stores_the_command_its_accept_runs_and_none_of_the_agents_flags(resume_approval):
    story, approval = resume_approval
    stored = json.loads(approval.command_json)
    story.expect_rows(stored["type"].endswith("ResumeAgent"), stored["fields"] == {"agent_id": story.agent.id}, approval.arguments == (), "skip" not in approval.command_json, detail=approval.command_json)


def test_accept_runs_the_stored_command_once_as_the_person_and_no_second_card_comes(resume_approval):
    story, approval = resume_approval
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "accept", str(approval.id)])
    story.expect_rows(story.row(Agent, story.agent.id).paused_at is None)
    decided = approvals(story)
    story.expect_rows(len(decided) == 1, decided[0].state is ApprovalState.ACCEPTED, detail=str(decided))


def test_a_refused_card_runs_nothing(resume_approval):
    story, approval = resume_approval
    story.expect_text(f"approval show {approval.id}", "Resume the paused agent", actor=story.user)
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "refuse", str(approval.id)])
    story.expect_rows(story.row(Agent, story.agent.id).paused_at is not None)
    decided = approvals(story)
    story.expect_rows(len(decided) == 1, decided[0].state is ApprovalState.REFUSED)


def test_the_same_attempt_again_keeps_one_open_card(resume_approval):
    story, approval = resume_approval
    story.expect_refusal(f"agent resume {story.agent.id} --reason needed", "A person was asked in the dock", actor=story.agent)
    story.expect_rows(len(approvals(story)) == 1)


def test_a_command_run_as_approved_by_an_approval_asks_nobody_again_whoever_runs_it(new_story):
    story = new_story(fixture=ResumeRequested)
    story.expect_text(f"approval list", "Resume the paused agent", actor=story.user)
    story.container.get(Bus).run(ResumeAgent(story.agent.id), story.agent, environment_id=1, approval_id=1)
    story.expect_rows(story.row(Agent, story.agent.id).paused_at is None)
