from tests.stories.core.support import story_lines as lines
from core.testing.hook_samples import HookSamples
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import MainEnvironment


class SamplesChosen(StoryFixture):
    """Environment main runs the sample suite, whose lead drives the main agent."""

    parent = MainEnvironment

    def steps(self, story: Story) -> None:
        story.run("suite choose samples --environment main")

    def expect(self, story: Story) -> None:
        story.expect_success("suite current main", "suite: samples", "drivers: main: samples.lead")


class LeadStarted(StoryFixture):
    """Session s-1 sent its first hook, which started agent 1 under the sample lead."""

    parent = SamplesChosen

    def steps(self, story: Story) -> None:
        story.hook("s-1", HookSamples.session_start())

    def expect(self, story: Story) -> None:
        story.expect_success("agent show 1", "session: s-1")


class LeadLocked(StoryFixture):
    """A person opened edit lock 1 over agent 1, which silences the lead's own rules."""

    parent = LeadStarted

    def steps(self, story: Story) -> None:
        story.run(lines.EDIT_LOCK)

    def expect(self, story: Story) -> None:
        story.expect_success("edit-lock show 1", "agent_id: 1", "state: open")
