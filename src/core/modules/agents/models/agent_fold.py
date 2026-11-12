from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class AgentFold(EnvironmentScoped, Model):
    """A main agent row folded into its environment's one main agent: the folded row, its actor row and its
    sessions as they were, kept so an old id, number or session still finds the agent it became."""

    model_name = "agent_fold"
    cli_name = "agent-fold"

    environment_id: int = 0
    folded_agent_id: int
    survivor_id: int
    folded_number: int
    agent_row: str
    actor_row: str
    sessions: str
    folded_at: str
