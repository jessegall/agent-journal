from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
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
