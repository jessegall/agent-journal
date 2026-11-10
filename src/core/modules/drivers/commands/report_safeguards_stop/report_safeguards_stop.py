from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class ReportSafeguardsStop(Command[None]):
    """Tells the person in the chat that an agent's turn was ended again by an API safeguards error, with the
    error's words and its request id."""

    agent_id: int
    details: str
    request_id: str | None
