from typing import ClassVar

from engine.testing.seeds.seed_facts import SeedFacts


class Seed:
    """One kind of seeded row: the table it fills and what one row of it holds. The seeder gives each row its
    id and its timestamps, unless the seed states an id of its own; a seed states every other column of its
    table that has no default. A seed reads
    the ids of the rows seeded before it, so a task can name a seeded agent and a phase a seeded plan."""

    table: ClassVar[str]

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        raise NotImplementedError
