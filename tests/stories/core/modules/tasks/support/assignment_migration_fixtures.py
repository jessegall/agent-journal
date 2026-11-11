import json

from engine.actor.actor import Actor
from engine.database.database import Database
from engine.database.statement import Statement
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.tasks.migrations.m025_task_assignments import TaskAssignmentsMigration
from tests.stories.core.support.coding_fixtures import UserBuilder

WORKER_START = "agent start s-2 claude worker --environment main"
TASK_TITLES = ("Delegated and open", "Delegated and started", "Started with no delegation", "Delegated to a gone actor", "Nobody's")
DELEGATED_TASKS = (1, 2)
STARTED_TASKS = (2, 3)
MISSING_ACTOR_TASK = 4
MISSING_ACTOR_ID = 999_999


def worker(story: Story) -> Actor:
    """The worker TasksWithOldAssignments started, found through the agent list."""
    agents = json.loads(story.run("agent list --json", actor=story.user).output_text)["rows"]
    return Actor(next(agent["id"] for agent in agents if agent["role"] == "worker"), ActorType.AGENT)


class TasksWithOldAssignments(StoryFixture):
    """A main agent, a worker and a person, and five tasks: tasks 2 and 3 are started by the worker."""

    parent = UserBuilder

    def steps(self, story: Story) -> None:
        story.run(WORKER_START)
        for title in TASK_TITLES:
            story.expect_success(f'task make "{title}" --brief "A task of the upgrade story"', actor=story.agent)
        for task_id in STARTED_TASKS:
            story.expect_success(f"task start {task_id}", actor=worker(story))


def run_task_assignments_migration(story: Story) -> None:
    """Brings the tasks to what an older journal held, with the delegation in the column alone, and runs the
    migration that copies the column. The column is written directly, as the migration reads it and no command
    of today leaves it in that older state."""
    for task_id in range(1, len(TASK_TITLES) + 1):
        story.expect_success(f"unassign task {task_id} --environment main", actor=story.user)
    database = story.container.get(Database)
    database.update(Statement("UPDATE tasks SET delegated_to = NULL"))
    database.update(Statement(f"UPDATE tasks SET delegated_to = {worker(story).id} WHERE id IN ({', '.join(str(task_id) for task_id in DELEGATED_TASKS)})"))
    database.update(Statement(f"UPDATE tasks SET delegated_to = {MISSING_ACTOR_ID} WHERE id = {MISSING_ACTOR_TASK}"))
    for statement in TaskAssignmentsMigration.statements:
        database.update(Statement(statement))
