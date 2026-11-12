import json

from engine.testing.seeds.seed import Seed
from engine.testing.seeds.seed_facts import SeedFacts

FOLDED_AGENT_ID = 9001
FOLDED_NUMBER = 33
FOLDED_SESSION = "s-folded"


class AgentFoldSeed(Seed):
    """A main agent row folded into the story's main agent: its old id, number and session, kept in the record."""

    table = "agent_folds"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"environment_id": facts.environment_id, "folded_agent_id": FOLDED_AGENT_ID + index, "folded_number": FOLDED_NUMBER + index,
                "agent_row": json.dumps({"id": FOLDED_AGENT_ID + index, "session": FOLDED_SESSION}), "actor_row": "{}", "sessions": "[]",
                "folded_at": facts.timestamp}
