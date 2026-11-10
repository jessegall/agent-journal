from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.refusal_skip import RefusalSkip


@dataclass(frozen=True)
class SkipRefusal(Command[RefusalSkip]):
    """Passes the refusal of one rule or guard that just refused the agent, saying why; a guard's skip is used
    at once."""

    name: str
    reason: str
    is_used: bool = False
