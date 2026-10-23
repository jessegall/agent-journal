from dataclasses import dataclass


@dataclass(frozen=True)
class EtiquetteData:
    """The etiquette feature's reading: the lines the journal said to the agent since it last reminded it what a line is, and how many edits of code files it has made."""

    reminder_gap: int
    code_edits: int
