from dataclasses import dataclass, field, replace

from core.base.actor import Actor
from core.base.command.command import Command
from core.base.command.outside_runs import OutsideRuns
from core.base.explanation import Explanation
from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class Context:
    """What a command runs with: who asked, when, which guards they chose to pass, the approval that let it
    run, with --explain, where every refusal is collected instead of the first one stopping the command,
    and its outside runs, closed unless the bus opened them."""

    actor: Actor
    timestamp: Timestamp
    command: Command[object]
    skipped_guards: frozenset[str] = frozenset()
    cause_id: int | None = None
    environment_id: int | None = None
    explanation: Explanation | None = None
    outside_runs: OutsideRuns = field(default_factory=OutsideRuns, compare=False)
    approval_id: int | None = None

    def nested(self, command: Command[object]) -> "Context":
        return replace(self, command=command)
