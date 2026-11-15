from dataclasses import dataclass

from engine.agent_stack.stack import Stack
from engine.agent_machine.record.stack_move import StackMove


@dataclass(frozen=True)
class BuiltStack:
    """The stack a step built from the needs and facts it read, with the moves that took the old stack there."""

    stack: Stack
    moves: tuple[StackMove, ...]
