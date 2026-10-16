from dataclasses import dataclass

from journal.engine.states.paused import Paused


@dataclass(frozen=True)
class Stuck(Paused):
    """The agent said it is truly stuck. Nothing is said until it works again or the user speaks: its own next tool use, through the workflow Stuck, or a word from the user take it back."""

    name = "stuck"
    title = "Stuck"
    why: str = ""

    def awaiting(self) -> tuple[str, str]:
        return self.why, ""

