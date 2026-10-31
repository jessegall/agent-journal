from dataclasses import dataclass

from core.base.actor import Actor
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState
from core.modules.skills.models.lifecycles.agent_skill_lifecycle import AgentSkillLifecycle


@dataclass(frozen=True, kw_only=True)
class AgentSkill(Model):
    """One skill for one agent: due to be read until the agent reads its file, then loaded with the digest of the
    text it read."""

    model_name = "agent_skill"
    cli_name = "agent-skill"
    lifecycle = AgentSkillLifecycle

    agent_id: int
    creator_id: int
    skill: str
    digest: str = ""
    state: AgentSkillState = AgentSkillState.DUE
    loaded_at: Timestamp | None = None

    def load(self, timestamp: Timestamp, actor: Actor, digest: str) -> "AgentSkill":
        return self.moved(AgentSkillLifecycle.load, digest=digest, loaded_at=timestamp)

    def reset(self, timestamp: Timestamp, actor: Actor) -> "AgentSkill":
        return self.moved(AgentSkillLifecycle.reset, digest="", loaded_at=None)
