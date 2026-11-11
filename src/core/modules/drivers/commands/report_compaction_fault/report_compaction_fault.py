from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class ReportCompactionFault(Command[None]):
    """Closes one compaction that can no longer go on, or tells a person about it once, in its agent's
    environment."""

    compaction_id: int
