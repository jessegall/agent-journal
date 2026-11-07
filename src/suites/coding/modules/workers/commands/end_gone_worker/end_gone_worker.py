from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class EndGoneWorker(Command[None]):
    """Ends a worker whose process is gone."""

    agent_id: int
