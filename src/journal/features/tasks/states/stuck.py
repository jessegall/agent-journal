from dataclasses import dataclass

from journal.engine.states.wait import Wait


@dataclass(frozen=True)
class Stuck(Wait):
    """The agent said it is truly stuck. Nothing is said until it works again or the user speaks: its own next tool use or a word from the user pops it."""

    name = "stuck"
    title = "Stuck"
    why: str = ""

    def awaiting(self) -> tuple[str, str]:
        return self.why, ""
