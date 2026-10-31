from tests.stories.core.support import story_lines as lines
from core.testing.hook_samples import HookSamples
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.base.drivers.support.hook_agents import hook_agent
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
        story.agent = hook_agent(story, story.hook("s-1", HookSamples.session_start()))

    def expect(self, story: Story) -> None:
        story.expect_success(f"agent show {story.agent.id}", "session: s-1")


class LeadLocked(StoryFixture):
    """A person opened edit lock 1 over agent 1, which silences the lead's own rules."""

    parent = LeadStarted

    def steps(self, story: Story) -> None:
        story.run(f"edit-lock make {story.agent.id}")

    def expect(self, story: Story) -> None:
        story.expect_success("edit-lock show 1", f"agent_id: {story.agent.id}", "state: open")


class LeadWaiting(StoryFixture):
    """The lead's agent waits on task 1, the review, which a person made."""

    parent = LeadStarted

    def steps(self, story: Story) -> None:
        story.run('task make "The review" --environment main')
        story.run("wait on 'the review of the cart' --target tasks:1", actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success("wait show 1", "type: rows", "state: open")


class LeadLinesWaiting(StoryFixture):
    """Five lines, line 1 to line 5, wait for agent 1's next hook."""

    parent = LeadStarted

    def steps(self, story: Story) -> None:
        for number in range(1, 6):
            story.run(f'agent-line make {story.agent.id} "line {number}"')

    def expect(self, story: Story) -> None:
        story.expect_text(f"agent-line list --agent {story.agent.id} --state waiting", "line 1", "line 5")
