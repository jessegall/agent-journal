from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RestoreStackedState(Command[str]):
    """Ends a person's suppression of a Working frame, so the work shows on the agent's stack again."""

    agent_id: int
    stacked_state: str
