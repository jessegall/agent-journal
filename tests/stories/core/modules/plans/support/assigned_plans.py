from engine.actor.actor import Actor
from engine.database.database import Database
from engine.database.statement import Statement
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.plans.migrations.m016_plan_assignments import PlanAssignmentsMigration
from tests.stories.core.support.fixtures import UserJoined

TASKS_IN_A_PHASE = 3
PHASE_COUNT = 2


def plan_worker(story: Story, position: int) -> Actor:
    """One of the three workers PlanWithTwoPhases started after Ada: position 1 (W), 2 (V) or 3 (X)."""
    return Actor(story.user.id + position, ActorType.AGENT)


def phase_task_ids(phase_id: int) -> list[int]:
    """The ids of the tasks PlanWithTwoPhases placed in a phase: 1 to 3 in phase 1, 4 to 6 in phase 2."""
    first_id = (phase_id - 1) * TASKS_IN_A_PHASE + 1
    return list(range(first_id, first_id + TASKS_IN_A_PHASE))


class PlanWithTwoPhases(StoryFixture):
    """The main agent, the person Ada, three workers W, V and X, and plan 1 of two phases with three open tasks in
    each, nobody assigned."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        for session in ("s-2", "s-3", "s-4"):
            story.run(f"agent start {session} claude worker --environment main")
        story.run('plan make "Rebuild the cart" --environment main', actor=story.user)
        for phase_id in range(1, PHASE_COUNT + 1):
            story.run(f'phase make --plan 1 "Phase {phase_id}"', actor=story.user)
            for task_id in phase_task_ids(phase_id):
                story.run(f'task make "Task {task_id}" --brief "A task of the plan" --environment main', actor=story.agent)
                story.run(f"phase place {task_id} --phase {phase_id}", actor=story.agent)


OLD_ASSIGNEE_PATH = '$."journal.core.plans".assignee_id'
HAND_GIVEN_TASK = 2


class PlanWithOldAssignee(StoryFixture):
    """Plan 1 as an older journal kept it: worker W named in the plan's metadata and each task given by hand, W's
    but task 2, which is V's. The metadata is written directly: no command of today writes that key."""

    parent = PlanWithTwoPhases

    def steps(self, story: Story) -> None:
        for task_id in [*phase_task_ids(1), *phase_task_ids(2)]:
            position = 2 if task_id == HAND_GIVEN_TASK else 1
            story.run(f"assign task {task_id} --to {plan_worker(story, position).id} --environment main", actor=story.user)
        story.container.get(Database).update(Statement(f"UPDATE plans SET metadata = json_set(metadata, '{OLD_ASSIGNEE_PATH}', {plan_worker(story, 1).id}) WHERE id = 1"))


def run_plan_assignments_migration(story: Story) -> None:
    database = story.container.get(Database)
    for statement in PlanAssignmentsMigration.statements:
        database.update(Statement(statement))
