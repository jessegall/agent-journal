from dataclasses import dataclass


@dataclass(frozen=True)
class EtiquetteData:
    """The etiquette feature's reading: the lines the journal said to the agent since it last reminded it what a line is."""

    reminder_gap: int
