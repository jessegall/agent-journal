from tests.stories.core import story_lines as lines
from core.base.actor import Actor, ActorType
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture


class MainEnvironment(StoryFixture):
    """An environment called main, with no agent in it yet."""

    def steps(self, story: Story) -> None:
        story.run(lines.NEW_ENVIRONMENT)

    def expect(self, story: Story) -> None:
        story.expect_success("environment show 1", "name: main")


class AgentStarted(StoryFixture):
    """One agent session started in main: story.agent."""

    parent = MainEnvironment

    def steps(self, story: Story) -> None:
        story.agent = Actor(story.new_row_id(lines.AGENT_START), ActorType.AGENT)

    def expect(self, story: Story) -> None:
        story.expect_success(f"agent show {story.agent.id}", "session: s-1", "environment_id: 1")


class ThreeTasks(StoryFixture):
    """Three open tasks in main: First (1), Second (2) and Third (3)."""

    parent = AgentStarted

    def steps(self, story: Story) -> None:
        for title in ("First", "Second", "Third"):
            story.run(f'task make "{title}" --environment main')

    def expect(self, story: Story) -> None:
        story.expect_success("task list --oldest", "1  First  open  normal", "3  Third  open  normal")


class UserJoined(StoryFixture):
    """A person, Ada, beside the agent: story.user."""

    parent = AgentStarted

    def steps(self, story: Story) -> None:
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)

    def expect(self, story: Story) -> None:
        story.expect_success(f"actor show {story.user.id}", "type: user", "name: Ada")


class PlanWithPhases(StoryFixture):
    """A draft plan 1 in main with three phases in order: Values, Models and Queries."""

    parent = AgentStarted

    def steps(self, story: Story) -> None:
        story.run(lines.NEW_PLAN)
        for title in ("Values", "Models", "Queries"):
            story.run(f'phase make --plan 1 "{title}" --goal "{title.lower()} pass their tests"')

    def expect(self, story: Story) -> None:
        story.expect_success("phase show 3", "position: 3", "title: Queries")


class PlanWithTasks(StoryFixture):
    """The plan with phases, and two open tasks not yet placed: First (1) and Second (2)."""

    parent = PlanWithPhases

    def steps(self, story: Story) -> None:
        for title in ("First", "Second"):
            story.run(f'task make "{title}" --environment main')

    def expect(self, story: Story) -> None:
        story.expect_success("task show 2", "title: Second", "state: open")


class OpenTask(StoryFixture):
    """One open task, Fix the cart (1), in main."""

    parent = AgentStarted

    def steps(self, story: Story) -> None:
        story.run(lines.NEW_TASK)

    def expect(self, story: Story) -> None:
        story.expect_success(lines.TASK_DETAILS, "title: Fix the cart", "state: open")


class AssignedTask(StoryFixture):
    """Fix the cart (1), started by the agent, which holds it."""

    parent = OpenTask

    def steps(self, story: Story) -> None:
        story.run(lines.TASK_START, actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {story.agent.id}")


class UnansweredMessage(StoryFixture):
    """Ada's message 1 in main, not yet answered."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        story.run(lines.USER_MESSAGE, actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_success("message show 1", "type: user", "text: Fix the cart first")


class PlanTasksPlaced(StoryFixture):
    """A draft plan 1 with one phase, Everything, holding the open tasks First (1) and Second (2) in that order."""

    parent = AgentStarted

    def steps(self, story: Story) -> None:
        story.run(lines.NEW_PLAN)
        story.run('phase make --plan 1 "Everything"')
        for task_id, title in enumerate(("First", "Second"), 1):
            story.run(f'task make "{title}" --environment main')
            story.run(f"phase place {task_id} --phase 1")

    def expect(self, story: Story) -> None:
        story.expect_success("phase-task list --phase 1 --oldest", "1  1  1  1", "2  1  2  2")


class MessageAnswered(StoryFixture):
    """Ada's message 1, answered by the agent's reply 2."""

    parent = UnansweredMessage

    def steps(self, story: Story) -> None:
        story.run('message reply 1 "On it" --environment main', actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success("message show 2", "parent_id: 1", "type: agent")
