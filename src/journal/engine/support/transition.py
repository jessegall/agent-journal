from dataclasses import dataclass, replace
from typing import TYPE_CHECKING

from journal.engine.nudge import Nudge

if TYPE_CHECKING:
    from journal.engine.base_state import BaseState


@dataclass(frozen=True)
class Transition:
    """What a state answered an event with: the state as it stands now, a state pushed on top of it, whether it popped itself, the nudges said, the nudges typed, the nudge that holds the event, if any, and the moves dropped because an earlier answer already moved."""

    to: "BaseState"
    pushed: "BaseState | None" = None
    popped: bool = False
    nudges: tuple[Nudge, ...] = ()
    typed: tuple[Nudge, ...] = ()
    held: Nudge | None = None
    dropped: tuple[str, ...] = ()

    def typing(self, *typed: Nudge) -> "Transition":
        return replace(self, typed=typed)

    def has_move(self) -> bool:
        return self.pushed is not None or self.popped

    def move_named(self) -> str:
        return f"push {self.pushed.name}" if self.pushed else "pop"

    @classmethod
    def merged(cls, state: "BaseState", answers: list["Transition"]) -> "Transition":
        moving = [answer for answer in answers if answer.has_move()]
        move = moving[0] if moving else cls(state)
        return cls(
            to=next((answer.to for answer in answers if answer.to is not state), state),
            pushed=move.pushed,
            popped=move.popped,
            nudges=tuple(nudge for answer in answers for nudge in answer.nudges),
            typed=tuple(nudge for answer in answers for nudge in answer.typed),
            held=next((answer.held for answer in answers if answer.held), None),
            dropped=tuple(answer.move_named() for answer in moving[1:]),
        )
