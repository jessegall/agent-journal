from engine.testing.seeds.seed import Seed
from engine.testing.seeds.seed_facts import SeedFacts


class AgentRuleSeed(Seed):
    """A rule for one agent, written as a rule left behind by an older journal would be; the story names the
    environment, the person, the place and the agent row, which may no longer exist."""

    table = "assign_rules"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"version": 1, "enabled": 1, "target": "agent", "program": "", "program_model": "", "queue_limit": 0}


class RuleConditionSeed(Seed):
    """A condition of a rule as it is stored; the story names the rule, the field, the operator and the value,
    which may be one no line can write."""

    table = "assign_rule_conditions"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"version": 1, "value": ""}
