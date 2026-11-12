from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.core.support.plan_steps import started_plan

PLAN_FOCUS = "plan focus"
DEFAULT_FOCUS = "the default, the oldest started plan with work you can take"


class ThreeStartedPlans(StoryFixture):
    """Plans 1, Shop, 2, Depot, and 3, Port, started in that order, each with one phase of two open tasks:
    tasks 1 and 2 in Shop, 3 and 4 in Depot, 5 and 6 in Port. Nobody has named a focus."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        for plan_id, title in enumerate(("Shop", "Depot", "Port"), 1):
            started_plan(story, plan_id, title)

    def expect(self, story: Story) -> None:
        story.expect_success("plan show 3", "state: started")
        story.expect_success("task show 6", "state: open")


class OldestPlanWaitsOutside(StoryFixture):
    """Both tasks of plan 1, Shop, wait on task 7, Supplier contract, an open task in no plan."""

    parent = ThreeStartedPlans

    def steps(self, story: Story) -> None:
        story.run('task make "Supplier contract" --environment main', actor=story.user)
        for task_id in (1, 2):
            story.run(f"task depend {task_id} --on 7", actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_success("task show 1", "state: blocked")
        story.expect_success("task show 7", "state: open")


class OldestPlanWaitsOnAPerson(StoryFixture):
    """Task 7, Supplier contract, which both tasks of plan 1 wait on, waits on a user: nobody can take it."""

    parent = OldestPlanWaitsOutside

    def steps(self, story: Story) -> None:
        story.run('task block 7 --until-user --reason "Ada signs the contract"', actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_success("task show 7", "state: blocked")

