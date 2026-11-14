from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.current_context_window import COMPACTION_ENDED_AT
from engine.module.driver_entries import DRIVERS_MODULE
from engine.row.metadata import Metadata

SKILLS_MODULE = "journal.core.skills"
KEPT_RECORDED = "kept_recorded"


class KeptSkillMark:
    """Tells one session and compaction of an agent apart, and keeps on the agent which of them has had its kept skills
    recorded: the program writes what it put back only at a session start or a compaction, so a new mark needs a new
    record."""

    @staticmethod
    def of(agent: Agent) -> str:
        return f"{agent.session} {agent.metadata.module_part(DRIVERS_MODULE).get(COMPACTION_ENDED_AT)}"

    @classmethod
    def is_recorded(cls, agent: Agent) -> bool:
        return agent.metadata.module_part(SKILLS_MODULE).get(KEPT_RECORDED) == cls.of(agent)

    @classmethod
    def recorded(cls, agent: Agent) -> Metadata:
        return Metadata({**agent.metadata.values, SKILLS_MODULE: {**agent.metadata.module_part(SKILLS_MODULE), KEPT_RECORDED: cls.of(agent)}})
