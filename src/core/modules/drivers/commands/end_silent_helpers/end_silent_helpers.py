from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class EndSilentHelpers(Command[None]):
    """Ends the helpers of an environment that have sent no hook for a long time."""

