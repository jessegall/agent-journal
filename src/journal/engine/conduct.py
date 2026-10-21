from typing import ClassVar

from journal.engine.nudge import Nudge
from journal.engine.support.transition import Transition


class Conduct:
    """A feature's conduct toward the agent in every state: on_ listeners named for the feature, on_tool_starting_inbox, folded into the base state at boot. Every listener runs on the state and answers with the state's own answers, unchanged, changed, push, pop or hold, which the base state inherits from here."""

    name: ClassVar[str]

    def unchanged(self, *nudges: Nudge) -> Transition:
        return Transition(self, nudges=nudges)

    def changed(self, next: "Conduct", *nudges: Nudge) -> Transition:
        return Transition(next, nudges=nudges)

    def push(self, to: "Conduct", *nudges: Nudge) -> Transition:
        return Transition(self, pushed=to, nudges=nudges)

    def pop(self, *nudges: Nudge) -> Transition:
        return Transition(self, popped=True, nudges=nudges)

    def pop_through(self, *nudges: Nudge) -> Transition:
        return Transition(self, popped=True, nudges=nudges, handed_down=True)

    def hold(self, why: Nudge) -> Transition:
        return Transition(self, held=why)
