from datetime import timedelta

from core.base.journal_home import LAUNCHER_SOCKET
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.ticks.interrupted_agent_wake import InterruptedAgentWake
from core.testing.fake_launcher import FakeLauncher
from core.testing.hook_samples import HookSamples
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderStarted

WAKE = "you were interrupted: go on with your work"


class InterruptedMain(StoryFixture):
    """The main agent started its session and its turn was interrupted: the launcher told the journal."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        story.hook("s-1", HookSamples.session_start())
        story.expect_success(f"agent interrupted {story.agent.id}")


def interrupted_story(new_story, silent_answer: bytes) -> tuple[Story, FakeLauncher]:
    story = new_story(fixture=InterruptedMain)
    return story, FakeLauncher(story.home.socket(LAUNCHER_SOCKET), answer=silent_answer, request_count=1).serve()


def wake_lines(story: Story) -> list[AgentLine]:
    return list(story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id, source="drivers.interrupted").all_rows())


def wake_after(story: Story, seconds: int) -> None:
    story.advance(timedelta(seconds=seconds))
    InterruptedAgentWake()(story.container)
    story.run_listeners()


def test_an_interrupted_agent_is_woken_once_nobody_typed_for_30_seconds(new_story):
    story, launcher = interrupted_story(new_story, b"quiet 600\n")
    try:
        wake_after(story, 10)
        story.expect_rows(wake_lines(story) == [], story.row(Agent, story.agent.id).interrupted_at is not None)
        wake_after(story, 25)
        lines = wake_lines(story)
        story.expect_rows(len(lines) == 1, lines[0].text == WAKE, lines[0].state is AgentLineState.ENTERED, story.row(Agent, story.agent.id).interrupted_at is None, detail=str(lines))
        wake_after(story, 60)
        story.expect_rows(len(wake_lines(story)) == 1)
    finally:
        launcher.server.close()


def test_an_interrupted_agent_is_not_woken_when_the_person_typed_after_the_interrupt(new_story):
    story, launcher = interrupted_story(new_story, b"quiet 5\n")
    try:
        wake_after(story, 40)
        story.expect_rows(wake_lines(story) == [], story.row(Agent, story.agent.id).interrupted_at is None)
    finally:
        launcher.server.close()


def test_an_agent_that_stopped_on_its_own_after_the_interrupt_is_not_woken(new_story):
    story, launcher = interrupted_story(new_story, b"quiet 600\n")
    try:
        story.advance(timedelta(seconds=5))
        story.hook("s-1", HookSamples.stop())
        wake_after(story, 40)
        story.expect_rows(wake_lines(story) == [], story.row(Agent, story.agent.id).interrupted_at is None)
    finally:
        launcher.server.close()

