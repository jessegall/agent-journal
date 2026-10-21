from typing import ClassVar

from journal.engine.nudge import Nudge
from journal.engine.support.transition import Transition


class Conduct:
    """A feature's conduct toward the agent in every state: on_ listeners named for their event alone, on_tool_starting, folded into the base state at boot. Every listener runs on the state, after the state's own, and answers with the state's own answers, none, swap, push, pop, forward or refuse, which the base state inherits from here."""

    name: ClassVar[str]

    def none(self, *nudges: Nudge) -> Transition:
        return Transition(self, nudges=nudges)

    def swap(self, next: "Conduct", *nudges: Nudge) -> Transition:
        return Transition(next, nudges=nudges)

    def push(self, destination: "Conduct", *nudges: Nudge) -> Transition:
        return Transition(self, pushed=destination, nudges=nudges)

    def pop(self, *nudges: Nudge) -> Transition:
        return Transition(self, popped=True, nudges=nudges)

    def forward(self, *nudges: Nudge) -> Transition:
        return Transition(self, popped=True, nudges=nudges, handed_down=True)

    def refuse(self, reason: Nudge) -> Transition:
        return Transition(self, refusal=reason)
