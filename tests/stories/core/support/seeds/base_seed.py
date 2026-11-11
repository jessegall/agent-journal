from engine.database.database import Database
from engine.environment.environment_names import EnvironmentNames
from engine.testing.seeds.seed import Seed
from engine.testing.seeds.seeder import Seeder
from engine.testing.stories.story import Story
from tests.stories.core.support.seeds.project_seeds import (PHASES_IN_A_PLAN, PLACED_TASKS, PLAN_SIZES, AgentActorSeed, AgentLineSeed, AgentSeed, EventSeed, HookCallSeed,
                                                            MessageSeed, PersonSeed, PhaseSeed, PhaseTaskSeed, PlanSeed, TaskAssignmentSeed, TaskLogSeed, TaskSeed)

SEEDED_AGENTS = 80
SEEDED_TASKS = 800
BASE_SEEDS: tuple[tuple[type[Seed], int], ...] = (
    (AgentActorSeed, SEEDED_AGENTS),
    (PersonSeed, 10),
    (AgentSeed, SEEDED_AGENTS),
    (PlanSeed, len(PLAN_SIZES)),
    (PhaseSeed, len(PLAN_SIZES) * PHASES_IN_A_PLAN),
    (TaskSeed, SEEDED_TASKS),
    (TaskAssignmentSeed, SEEDED_TASKS),
    (PhaseTaskSeed, PLACED_TASKS),
    (TaskLogSeed, 900),
    (MessageSeed, 6_000),
    (AgentLineSeed, 5_000),
    (HookCallSeed, 50_000),
    (EventSeed, 80_000),
)

"""The base seed lies under every story: the rows of a project that has run for months, sized at about a tenth of
the journal this code is written with. A seed is added by one line here; the order matters where a seed points
at the rows of another."""


def fill_base_seed(story: Story, environment: str) -> None:
    environment_id = story.container.get(EnvironmentNames).environment_id(environment)
    seeder = Seeder(story.container.get(Database), story.clock.timestamp().text, environment_id)
    with seeder.filling():
        for seed, count in BASE_SEEDS:
            seeder.seed(seed(), count)
