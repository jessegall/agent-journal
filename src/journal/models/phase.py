from dataclasses import dataclass

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Phase(Scoped):
    """One stretch of a plan: its title, what is true when it is complete, and whether the user looks before the plan goes on. Linked to its plan; its tasks are linked to it."""

    title: str = ""
    complete_when: str = ""
    checkpoint: bool = False
