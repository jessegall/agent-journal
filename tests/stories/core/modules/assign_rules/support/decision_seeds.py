from engine.testing.seeds.seed import Seed
from engine.testing.seeds.seed_facts import SeedFacts


class AssignDecisionSeed(Seed):
    """A decision the rules recorded about one task, written as the engine of a later phase would record it; the
    story names the task, the rule, the outcome and the reason."""

    table = "assign_decisions"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"version": 1, "outcome": "assigned", "reason": ""}
