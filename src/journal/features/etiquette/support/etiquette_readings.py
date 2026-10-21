from dataclasses import dataclass


@dataclass(frozen=True)
class EtiquetteReadings:
    """The etiquette feature's reading: the lines the journal said to the agent since it last reminded it what a line is."""

    lines_since_reminder: int
