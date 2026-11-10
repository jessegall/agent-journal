from dataclasses import dataclass, field, replace

from engine.actor.actor import Actor
from engine.command.command import Command
from engine.command.outside_runs import OutsideRuns
from engine.text.explanation import Explanation
from engine.errors.refusal import Refusal
from engine.time.timestamp import Timestamp


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
    external_runs: OutsideRuns = field(default_factory=OutsideRuns, compare=False)
    approval_id: int | None = None

    def required_environment_id(self) -> int:
        if self.environment_id is None:
            raise Refusal("this runs in an environment", "name one with --environment")
        return self.environment_id

    def nested(self, command: Command[object]) -> "Context":
        return replace(self, command=command)
