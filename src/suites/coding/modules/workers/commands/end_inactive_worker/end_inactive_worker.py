from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class EndInactiveWorker(Command[Agent]):
    """Ends the row of a worker idle too long; a listener stops its program once this has committed."""

    worker_id: int
