from dataclasses import dataclass, replace

from core.base.actor import Actor
from core.base.command.command import Command
from core.base.guard.explanation import Explanation
from core.base.moment import Moment


@dataclass(frozen=True)
class Context:
    """The circumstances a command runs in: who asked, when, which guards they chose to pass, and, with
    --explain, where every verdict is collected instead of the first refusal stopping the command."""

    actor: Actor
    moment: Moment
    command: Command[object]
    skipped_guards: frozenset[str] = frozenset()
    cause_id: int | None = None
    environment_id: int | None = None
    explanation: Explanation | None = None

    def nested(self, command: Command[object]) -> "Context":
        return replace(self, command=command)
