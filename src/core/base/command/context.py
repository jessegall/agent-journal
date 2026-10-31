from dataclasses import dataclass, replace

from core.base.actor import Actor
from core.base.command.command import Command
from core.base.guard.explanation import Explanation
from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class Context:
    """What a command runs with: who asked, when, which guards they chose to pass, and, with
    --explain, where every refusal is collected instead of the first one stopping the command."""

    actor: Actor
    timestamp: Timestamp
    command: Command[object]
    skipped_guards: frozenset[str] = frozenset()
    cause_id: int | None = None
    environment_id: int | None = None
    explanation: Explanation | None = None

    def nested(self, command: Command[object]) -> "Context":
        return replace(self, command=command)
