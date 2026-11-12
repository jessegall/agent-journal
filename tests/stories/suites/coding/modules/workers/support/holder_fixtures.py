from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.tasks.support.assignment_migration_fixtures import TasksWithOldAssignments, run_task_assignments_migration
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, repository_environment

TWO_TASK_DISPATCH = "worker dispatch --test-command python=pytest --model sonnet 1 2"


def dispatched(story: Story) -> Actor:
    """The worker the fixture dispatched, which the story keeps as its helper."""
    return story.helper


class SecondTaskOrchestrator(StoryFixture):
    """The orchestrator's repository is set up and a second task, Second job, is open."""

    parent = OpenTaskOrchestrator

    def steps(self, story: Story) -> None:
        repository_environment(story)
        story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)


class WorkerOnFirstTask(StoryFixture):
    """One worker, story.helper, was sent task 1 and started it; task 2 is open and nobody's."""

    parent = SecondTaskOrchestrator

    def steps(self, story: Story) -> None:
        story.helper = Actor(story.new_row_id(DISPATCH, actor=story.agent), ActorType.AGENT)


class WorkerOnTwoTasks(StoryFixture):
    """One worker, story.helper, was sent tasks 1 and 2 and started task 1."""

    parent = SecondTaskOrchestrator

    def steps(self, story: Story) -> None:
        story.helper = Actor(story.new_row_id(TWO_TASK_DISPATCH, actor=story.agent), ActorType.AGENT)


class UpgradedTasks(StoryFixture):
    """The tasks of an older journal after the migration that copies the column delegated_to into the assignments."""

    parent = TasksWithOldAssignments

    def steps(self, story: Story) -> None:
        run_task_assignments_migration(story)


class FreeThirdTask(StoryFixture):
    """Beside the worker on tasks 1 and 2, task 3 is open and nobody's, and Ada is a person of the journal: story.user."""

    parent = WorkerOnTwoTasks

    def steps(self, story: Story) -> None:
        story.run('task make "Third job" --brief "Do the third job" --environment main', actor=story.agent)
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
