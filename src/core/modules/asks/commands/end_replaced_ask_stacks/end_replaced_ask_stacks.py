from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class EndReplacedAskStacks(Command[None]):
    """Ends the stacks of a topic that a newer one replaced: the one in force when a stack comes into force, the
    older waiting one when a new one waits."""

    stack_id: int
