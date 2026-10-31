from core.testing.hook_samples import HookSamples
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.base.drivers.support.hook_agents import hook_agent
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import MainEnvironment


class CodingEnvironment(StoryFixture):
    """Environment main runs the coding suite, whose builder drives the main agent."""

    parent = MainEnvironment

    def steps(self, story: Story) -> None:
        story.run("suite choose coding --environment main")

    def expect(self, story: Story) -> None:
        story.expect_text("suite current main", "suite: coding", "main: coding.builder")


class BuilderStarted(StoryFixture):
    """Session s-1 sent its first hook, which started story.agent under the builder."""

    parent = CodingEnvironment

    def steps(self, story: Story) -> None:
        story.agent = hook_agent(story, story.hook("s-1", HookSamples.session_start()))

    def expect(self, story: Story) -> None:
        story.expect_success(f"agent show {story.agent.id}", "session: s-1", "role: main")


class BuilderWithOpenTask(StoryFixture):
    """Task 1, Fix the cart, is open in main and nobody holds it."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        story.run(lines.NEW_TASK)

    def expect(self, story: Story) -> None:
        story.expect_success(lines.TASK_DETAILS, "state: open")


class OrchestratorWithOpenTask(StoryFixture):
    """The orchestrator drives the main agent in main, and task 1, Fix the cart, is open."""

    parent = BuilderWithOpenTask

    def steps(self, story: Story) -> None:
        story.run("driver choose coding.orchestrator --environment main")

    def expect(self, story: Story) -> None:
        story.expect_text("suite current main", "main: coding.orchestrator")


class SubagentStarted(StoryFixture):
    """The builder's session s-1 sent a subagent, sub-1, whose first hook started story.subagent under it."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        story.subagent = hook_agent(story, story.hook("s-1", HookSamples.prompt("Find where the cart total is worked out").with_fields(subagent="sub-1")))

    def expect(self, story: Story) -> None:
        story.expect_success(f"agent show {story.subagent.id}", "role: subagent", f"parent_id: {story.agent.id}")


class BuilderWithStartedTask(StoryFixture):
    """The builder's agent started task 1, Fix the cart, and holds it."""

    parent = BuilderWithOpenTask

    def steps(self, story: Story) -> None:
        story.run(lines.TASK_START, actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {story.agent.id}")
