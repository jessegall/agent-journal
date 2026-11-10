from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class SwitchWorkerSandbox(Command[Agent]):
    """Sets whether one worker runs its shell lines in the sandbox, whatever the project setting says."""

    worker_id: int
    sandboxed: bool
