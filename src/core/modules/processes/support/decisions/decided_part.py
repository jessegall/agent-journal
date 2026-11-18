from dataclasses import dataclass

from core.modules.processes.models.enums.reading_phase import ReadingPhase
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.decisions.reading_decision import ReadingDecision


@dataclass(frozen=True)
class DecidedPart:
    """The reading decision of one part of a run at one point, decided before the write that keeps it."""

    part: ProcessPart
    phase: ReadingPhase
    decision: ReadingDecision
