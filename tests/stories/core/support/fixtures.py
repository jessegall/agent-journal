from tests.stories.core.support import story_lines as lines
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


class AgentWithProcess(StoryFixture):
    """An agent session s-7 started in main by the agent program running as pid 700: story.agent."""

    parent = MainEnvironment

    def steps(self, story: Story) -> None:
        story.agent = Actor(story.new_row_id(lines.AGENT_START_WITH_PROCESS), ActorType.AGENT)

    def expect(self, story: Story) -> None:
        story.expect_success(f"agent show {story.agent.id}", "session: s-7", "pid: 700")


class ThreeTasks(StoryFixture):
    """Three open tasks in main: First (1), Second (2) and Third (3)."""

    parent = AgentStarted

    def steps(self, story: Story) -> None:
        for title in ("First", "Second", "Third"):
            story.run(f'task make "{title}" --environment main')

    def expect(self, story: Story) -> None:
        story.expect_success("task list --oldest", "1  First  open  normal", "3  Third  open  normal")


class TaskWaitingOnSecond(StoryFixture):
    """Task 1, First, waits on task 2, Second, which is open."""

    parent = ThreeTasks

    def steps(self, story: Story) -> None:
        story.run(lines.FIRST_TASK_DEPENDENCY)

    def expect(self, story: Story) -> None:
        story.expect_text("task-dependency list --task 1", "2")


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


class PhaseWithThreeTasks(StoryFixture):
    """Phase 1, Values, of plan 1 holds tasks First (1), Second (2) and Third (3) at places 1, 2 and 3."""

    parent = PlanWithPhases

    def steps(self, story: Story) -> None:
        for task_id, title in enumerate(("First", "Second", "Third"), 1):
            story.run(f'task make "{title}" --environment main')
            story.run(f"phase place {task_id} --phase 1")

    def expect(self, story: Story) -> None:
        story.expect_success("phase-task list --phase 1 --oldest", "1  1  1  1", "3  1  3  3")


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


class PlanAcrossPhases(StoryFixture):
    """A started plan 1 with phases Build (1) and Ship (2): task 1, Release, sits in Ship; tasks 2, Cart, and 3, Tax,
    sit in Build in that order, so the order of phases and places differs from the order the tasks were made."""

    parent = AgentStarted

    def steps(self, story: Story) -> None:
        story.run(lines.NEW_PLAN)
        story.run('phase make --plan 1 "Build"')
        story.run('phase make --plan 1 "Ship"')
        for title, phase in (("Release", 2), ("Cart", 1), ("Tax", 1)):
            task_id = story.new_row_id(f'task make "{title}" --environment main')
            story.run(f"phase place {task_id} --phase {phase}")
        for move in ("ready", "approve", "start"):
            story.run(f"plan {move} 1")

    def expect(self, story: Story) -> None:
        story.expect_success("plan show 1", "state: started")


class PlanFirstTaskClosed(StoryFixture):
    """The agent finished task 2, Cart, the first task of plan 1 by phase and place."""

    parent = PlanAcrossPhases

    def steps(self, story: Story) -> None:
        story.run("task start 2", actor=story.agent)
        story.run('task close 2 --outcome "done"', actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success("task show 2", "state: completed")


class PlanTaskWaiting(StoryFixture):
    """In plan 1, task 3, Tax, the next by phase and place after Cart, waits on task 1, Release, which is open."""

    parent = PlanAcrossPhases

    def steps(self, story: Story) -> None:
        story.run("task depend 3 --on 1")

    def expect(self, story: Story) -> None:
        story.expect_success("task show 3", "state: open")


class PlanTasksWaitingOutside(StoryFixture):
    """Tasks 1, Release, and 3, Tax, of plan 1 both wait on task 4, Outside, an open task in no plan."""

    parent = PlanAcrossPhases

    def steps(self, story: Story) -> None:
        story.run('task make "Outside" --environment main')
        story.run("task depend 3 --on 4")
        story.run("task depend 1 --on 4")

    def expect(self, story: Story) -> None:
        story.expect_success("task show 4", "state: open")


class MessageAnswered(StoryFixture):
    """Ada's message 1, answered by the agent's reply 2."""

    parent = UnansweredMessage

    def steps(self, story: Story) -> None:
        story.run('message reply 1 "On it" --environment main', actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success("message show 2", "parent_id: 1", "type: agent")


class StartedPlanTask(StoryFixture):
    """Plan 1 approved and started, its first task started by the agent, the second still open."""

    parent = PlanTasksPlaced

    def steps(self, story: Story) -> None:
        for move in ("ready", "approve", "start"):
            story.run(f"plan {move} 1")
        story.run(lines.TASK_START, actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success("task show 1", "state: started")


class DependencyChain(StoryFixture):
    """Task 1 waits on task 2 and task 2 on task 3, so task 3 waiting on task 1 would close a loop."""

    parent = ThreeTasks

    def steps(self, story: Story) -> None:
        story.run(lines.FIRST_TASK_DEPENDENCY)
        story.run("task depend 2 --on 3")

    def expect(self, story: Story) -> None:
        story.expect_refusal(lines.THIRD_TASK_DEPENDENCY, "refused by tasks.no-dependency-loop")
