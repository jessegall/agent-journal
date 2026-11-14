from suites.coding.support.shipped_profiles import MERGER_PROFILE
from engine.testing.seeds.seed import Seed
from engine.testing.seeds.seed_facts import SeedFacts

FIRST_NUMBER = 901
JOURNAL_ACTOR = 1
OLD_ROWS = (("verifier", "", "writing", True), ("reviewer", "", "read-only", True), ("helper", MERGER_PROFILE.name, "read-only", False))


class OldRoleAgentSeed(Seed):
    """Agent rows as an older journal stored them: an ended verifier, an ended reviewer and a running helper with
    the merger profile, each on a seeded agent actor."""

    table = "agents"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        role, profile, access, ended = OLD_ROWS[index % len(OLD_ROWS)]
        return {"id": facts.row_id("actors", index), "environment_id": facts.environment_id, "creator_id": JOURNAL_ACTOR,
                "session": f"old-role-{index}", "program": "claude", "role": role, "profile": profile, "access": access,
                "number": FIRST_NUMBER + index, "ended_at": facts.timestamp if ended else None}
