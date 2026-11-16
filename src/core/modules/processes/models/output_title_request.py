from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class OutputTitleRequest(EnvironmentScoped, Model):
    """A run its agent moved to the background with no descriptive title, which the agent is asked to name: the run,
    its agent, and when the request closed, as the run was titled or ended (doc 1310 section 4.6)."""

    model_name = "output_title_request"
    cli_name = "output-title-request"

    environment_id: int = 0
    session_agent_id: int
    process_id: int
    closed_at: Timestamp | None = None
