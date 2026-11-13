from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.tasks.support.task_brief_requirement import TaskBriefRequirement
from engine.testing.stories.helper_expectation import HelperExpectation
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.engine.driver.support.hook_agents import hook_agent
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import MainEnvironment, expect_person, person_joined
from suites.coding.support.coding_settings import AUTO_MODE_SETTING
from suites.coding.support.coding_settings import KEEP_RUNNING_SETTING


class CodingEnvironment(StoryFixture):
    """Environment main runs the coding suite, whose main driver drives the main agent."""

    parent = MainEnvironment

    def steps(self, story: Story) -> None:
        story.run("suite choose coding --environment main")

    def expect(self, story: Story) -> None:
        story.expect_text(lines.CURRENT_SUITE, "suite: coding", "main: coding.main")


class BuilderStarted(StoryFixture):
    """Session s-1 sent its first hook, which started story.agent under the main driver."""

    parent = CodingEnvironment

    def steps(self, story: Story) -> None:
        story.agent = hook_agent(story, story.hook("s-1", HookSamples.session_start()))

    def expect(self, story: Story) -> None:
        story.expect_success("agent show 1", "session: s-1", "role: main", actor=story.agent)


class OpenTaskBuilder(StoryFixture):
    """Task 1, Fix the cart, is open in main and nobody holds it."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        story.run(lines.NEW_TASK)

    def expect(self, story: Story) -> None:
        story.expect_success(lines.TASK_DETAILS, "state: open")


class OpenTaskOrchestrator(StoryFixture):
    """The main agent in main has Auto off and Keep going on, so it sends tasks to workers, and task 1, Fix
    the cart, is open."""

    parent = OpenTaskBuilder

    def steps(self, story: Story) -> None:
        story.run(f"setting set {AUTO_MODE_SETTING} off --environment main")
        story.run(f"setting set {KEEP_RUNNING_SETTING} on --environment main")

    def expect(self, story: Story) -> None:
        story.expect_text(f"setting show {AUTO_MODE_SETTING} --environment main", "value: False")

class OrchestratorWithPerson(StoryFixture):
    """The orchestrator with task 1 open, and a user, Ada, beside it: story.user."""

    parent = OpenTaskOrchestrator

    def steps(self, story: Story) -> None:
        person_joined(story)

    def expect(self, story: Story) -> None:
        expect_person(story)



class BuilderHelper(HelperExpectation, StoryFixture):
    """The main agent's session s-1 has a helper with session sub-1 under it: story.helper."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        story.helper = Actor(story.new_row_id(f"agent start sub-1 claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)


class StartedTaskBuilder(StoryFixture):
    """The main agent started task 1, Fix the cart, and holds it."""

    parent = OpenTaskBuilder

    def steps(self, story: Story) -> None:
        story.run(lines.TASK_START, actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {story.agent.id}")


class UserBuilder(StoryFixture):
    """A user, Ada, beside the started builder: story.user."""

    parent = BuilderStarted

    def steps(self, story) -> None:
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)

    def expect(self, story) -> None:
        story.expect_success(f"actor show {story.user.id}", "type: user", "name: Ada")


class BriefedTaskBuilder(StoryFixture):
    """Task 1, Fix the cart, has a brief and is open; nobody holds it."""

    parent = UserBuilder

    def steps(self, story) -> None:
        story.run('task make "Fix the cart" --brief "the total is in cents" --environment main', actor=story.agent)

    def expect(self, story) -> None:
        story.expect_success(lines.TASK_DETAILS, "state: open", "brief: the total is in cents")


class UnreadTaskBuilder(StoryFixture):
    """The main agent started task 1 and has not read its brief, so it is blocked."""

    parent = BriefedTaskBuilder

    def steps(self, story) -> None:
        story.container.get(TaskBriefRequirement).is_required = True
        story.run(lines.TASK_START, actor=story.agent)

    def expect(self, story) -> None:
        story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {story.agent.id}")


class ReadTaskBuilder(StoryFixture):
    """The builder's agent holds task 1 and ran its brief, so it is no longer blocked."""

    parent = UnreadTaskBuilder

    def steps(self, story) -> None:
        story.run("task overview 1", actor=story.agent)

    def expect(self, story) -> None:
        story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))


class StartedBuilderWithPerson(StoryFixture):
    """The builder with task 1 started, and a user, Ada, beside it: story.user."""

    parent = StartedTaskBuilder

    def steps(self, story: Story) -> None:
        person_joined(story)

    def expect(self, story: Story) -> None:
        expect_person(story)


class OpenBuilderWithPerson(StoryFixture):
    """The builder with task 1 open, and a user, Ada, beside it: story.user."""

    parent = OpenTaskBuilder

    def steps(self, story: Story) -> None:
        person_joined(story)

    def expect(self, story: Story) -> None:
        expect_person(story)
