from engine.testing.stories.story import Story
from tests.stories.core.support.seeds.large_read_seeds import EndedChildHelperSeed, FinishedHelperJobSeed, SEEDED_PROFILE
from tests.stories.core.support.seeds.project_seeds import AgentActorSeed

FIRST_CHILD_NUMBER = -5000


def seeded_children(story: Story, parent_id: int, count: int) -> tuple[int, ...]:
    """Ended and retired helpers of the parent, of the researcher profile, numbered far below the base seed."""
    actor_ids = story.seed(AgentActorSeed, count)
    for index, actor_id in enumerate(actor_ids):
        story.seed(EndedChildHelperSeed, 1, id=actor_id, number=FIRST_CHILD_NUMBER - index, parent_id=parent_id, profile=SEEDED_PROFILE,
                   session=f"seeded-child-session-{actor_id}")
    return actor_ids


def seeded_finished_jobs(story: Story, parent_id: int, helper_id: int, count: int) -> None:
    """Finished jobs of the researcher profile under the parent, older than every job a story starts."""
    story.seed(FinishedHelperJobSeed, count, session_agent_id=parent_id, helper_id=helper_id)
