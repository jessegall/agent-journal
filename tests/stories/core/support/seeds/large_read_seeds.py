import json

from engine.actor.actor import CORE_ACTOR_ID
from engine.testing.seeds.seed import Seed
from engine.testing.seeds.seed_facts import SeedFacts
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

"""The seeds of the reads that grew past the read limit: many finished helper jobs, saved builds, refused hook calls,
ended child helpers and skill rows of one agent. A story names the agent or the helper they belong to as a fixed
column."""

SEEDED_PROFILE = f"{RESEARCHER_PROFILE.name}"
DRIVERS_MODULE = "journal.core.drivers"


class FinishedHelperJobSeed(Seed):
    """A finished job of the researcher profile that read a file of its own; the story names its parent and helper."""

    table = "helper_jobs"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        brief = f"Read src/seeded/file_{index}.py"
        return {"environment_id": facts.environment_id, "creator_id": CORE_ACTOR_ID, "tool_key": f"seeded-tool-{index}", "profile": SEEDED_PROFILE,
                "program_model": "sonnet", "program": "claude", "description": SEEDED_PROFILE, "title": "seeded job", "instruction": brief, "brief": brief,
                "started_at": facts.timestamp, "ended_at": facts.timestamp, "cost_baseline": 0.0, "new_session": 1}


class SavedBuildSeed(Seed):
    """A saved build, each in a folder of its own, so no two of them run the same program on the same target."""

    table = "aliases"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"creator_id": CORE_ACTOR_ID, "name": f"seeded-build-{index}", "line": f"cd seeded/package_{index} && make all", "description": "", "category": "build"}


class RefusedHookCallSeed(Seed):
    """A hook call refused by the rule the story does not skip; the story names the agent."""

    table = "hook_calls"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        rules = {DRIVERS_MODULE: {"rules": [{"rule": "tasks.writes-need-a-task", "outcome": "refused"}]}}
        return {"environment_id": facts.environment_id, "creator_id": CORE_ACTOR_ID, "hook": "pre_tool_use", "firing": f"seeded-refused-{index}", "answer": "refused",
                "metadata": json.dumps(rules)}


class EndedChildHelperSeed(Seed):
    """An ended and retired helper of an agent; the story names its id, its number and its parent."""

    table = "agents"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"environment_id": facts.environment_id, "creator_id": CORE_ACTOR_ID, "session": f"seeded-child-session-{index}", "program": "claude", "role": "helper",
                "given_name": f"Seeded child {index}", "ended_at": facts.timestamp,
                "retired_at": facts.timestamp, "retirement_reason": "its work is done"}


class AgentSkillSeed(Seed):
    """A skill row of one agent that it read at the digest it has now; the story names the agent."""

    table = "agent_skills"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"creator_id": CORE_ACTOR_ID, "skill": f"seeded-skill-{index}", "digest": "seeded", "state": "loaded", "loaded_at": facts.timestamp}


class StoryTaskSeed(Seed):
    """A task of the story's own environment that needs no seeded agent; the story names its state and holder."""

    table = "tasks"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"environment_id": facts.environment_id, "creator_id": CORE_ACTOR_ID, "title": f"Seeded story task {index + 1}", "brief": "A seeded task; done when it is done.",
                "state": "completed", "outcome": "done", "closed_at": facts.timestamp, "complexity": 1}
