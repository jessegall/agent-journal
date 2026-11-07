from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class EndReplacedMain(Command[Agent]):
    """Ends a running main agent because a new session took its environment; its program is stopped after the hook."""

    row_id: int
