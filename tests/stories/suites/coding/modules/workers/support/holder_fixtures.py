from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.tasks.support.assignment_migration_fixtures import TasksWithOldAssignments, run_task_assignments_migration
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, repository_environment

TWO_TASK_DISPATCH = "worker dispatch --test-command python=pytest --model sonnet 1 2"


def second_task_story(new_story) -> Story:
    """The orchestrator's repository, which a cached fixture cannot hold, and a second open task, Second job."""
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    return story


def worker_on_first_task(new_story) -> Story:
    """One worker, story.worker, was sent task 1 and started it; task 2 is open and nobody's."""
    story = second_task_story(new_story)
    story.worker = Actor(story.new_row_id(DISPATCH, actor=story.agent), ActorType.AGENT)
    return story


def worker_on_two_tasks(new_story) -> Story:
    """One worker, story.worker, was sent tasks 1 and 2 and started task 1."""
    story = second_task_story(new_story)
    story.worker = Actor(story.new_row_id(TWO_TASK_DISPATCH, actor=story.agent), ActorType.AGENT)
    return story


def free_third_task(new_story) -> Story:
    """Beside the worker on tasks 1 and 2, task 3 is open and nobody's, and Ada is a user of the journal: story.user."""
    story = worker_on_two_tasks(new_story)
    story.run('task make "Third job" --brief "Do the third job" --environment main', actor=story.agent)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    return story


class UpgradedTasks(StoryFixture):
    """The tasks of an older journal after the migration that copies the column delegated_to into the assignments."""

    parent = TasksWithOldAssignments

    def steps(self, story: Story) -> None:
        run_task_assignments_migration(story)
