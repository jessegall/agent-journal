from dataclasses import dataclass, replace

from engine.command.context import Context
from core.modules.assignments.errors.cascade_depth_error import CascadeDepthError

MOST_LEVELS = 8


@dataclass(frozen=True)
class CascadeWalk:
    """What one walk from an assigned row down to its children carries: the command's context, whether the
    command overrides assignments given by hand, and how many levels down it is."""

    context: Context
    override: bool
    level: int = 1

    def deeper(self, model_name: str) -> "CascadeWalk":
        if self.level >= MOST_LEVELS:
            raise CascadeDepthError(model_name, MOST_LEVELS)
        return replace(self, level=self.level + 1)
