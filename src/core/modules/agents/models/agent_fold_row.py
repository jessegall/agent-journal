from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class AgentFoldRow(EnvironmentScoped, Model):
    """A row a fold removed or closed to settle a clash between two agents that became one, kept whole with the
    rule that settled it."""

    model_name = "agent_fold_row"
    cli_name = "agent-fold-row"

    environment_id: int = 0
    fold_id: int
    table_name: str
    row: str
    rule: str
