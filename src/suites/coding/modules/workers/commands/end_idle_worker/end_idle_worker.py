from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class EndIdleWorker(Command[Agent]):
    """Ends the row of a worker idle too long; a listener stops its program once this has committed."""

    worker_id: int
