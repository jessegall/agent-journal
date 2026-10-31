from dataclasses import dataclass, replace

from core.base.actor import Actor
from core.base.command.command import Command
from core.base.moment import Moment


@dataclass(frozen=True)
class Context:
    """The circumstances a command runs in: who asked, when, and which guards they chose to pass."""

    actor: Actor
    moment: Moment
    command: Command[object]
    skipped_guards: frozenset[str] = frozenset()
    cause_id: int | None = None
    environment_id: int | None = None

    def nested(self, command: Command[object]) -> "Context":
        return replace(self, command=command)
