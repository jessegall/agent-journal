from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class OverviewRead(Model):
    """An overview an agent read, by the command and the target it read, kept to refuse a second read in the same
    context window."""

    model_name = "overview_read"
    cli_name = "overview-read"

    session_agent_id: int
    creator_id: int
    command_name: str
    target: str
