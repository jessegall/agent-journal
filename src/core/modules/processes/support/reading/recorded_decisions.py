from collections.abc import Mapping, Sequence

from engine.command.context import Context
from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter
from core.modules.processes.errors.exitless_decision_error import ExitlessDecisionError
from core.modules.processes.models.enums.reading_phase import ReadingPhase
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reading_decision_row import ReadingDecisionRow
from core.modules.processes.support.decisions.reading_decider import ReadingDecider
from core.modules.processes.support.decisions.reading_decisions import ReadingDecisions
from core.modules.processes.support.decisions.reading_case import ReadingCase
from core.modules.processes.support.decisions.decided_part import DecidedPart
from core.modules.processes.support.reading.reading_facts import ReadingFacts


class RecordedDecisions:
    """Decides the reader of each part of a run beside the old code and keeps the decision, which nothing acts on
    yet. The facts and the kept decisions of all parts are read together, once; a run with no parts reads and
    keeps nothing. A decision the engine cannot build is written to the system log, and the run goes on."""

    def __init__(self, facts: ReadingFacts, decider: ReadingDecider, decisions: ReadingDecisions, log: SystemLogWriter) -> None:
        self.facts, self.decider, self.decisions, self.log = facts, decider, decisions, log

    def store(self, process: Process, parts: Sequence[ProcessPart], phase: ReadingPhase, context: Context) -> None:
        if not parts:
            return
        self.keep(process, self.decided(process, parts, phase), phase, context)

    # Keeps the decisions of a run that has just started, which has none kept yet, so nothing is read; a merge the
    # journal runs itself has no reader to judge, so it keeps none, as at its end.
    def store_initial(self, process: Process, parts: Sequence[ProcessPart], context: Context) -> None:
        if not parts or process.is_journal_merge:
            return
        self.keep_parts(process, self.decided(process, parts, ReadingPhase.START), {}, context)

    # Reads the output and judges the readers, which takes time: run it outside the write that keeps the decisions.
    def decided(self, process: Process, parts: Sequence[ProcessPart], phase: ReadingPhase) -> tuple[DecidedPart, ...]:
        return tuple(decided for part, case in zip(parts, self.facts.gathered_cases(process, parts, phase)) if (decided := self.decided_part(process, part, case)) is not None)

    def decided_part(self, process: Process, part: ProcessPart, case: ReadingCase) -> DecidedPart | None:
        try:
            return DecidedPart(part, case.phase, self.decider.decide(case))
        except ExitlessDecisionError as error:
            self.log.write(LogLevel.WARNING, f"output {process.id} part {part.position}: no reading decision at {case.phase.value}: {error}")
            return None

    def keep(self, process: Process, decided: Sequence[DecidedPart], phase: ReadingPhase, context: Context) -> None:
        if decided:
            self.keep_parts(process, decided, self.decisions.kept(process, phase), context)

    def keep_parts(self, process: Process, decided: Sequence[DecidedPart], stored: Mapping[int, ReadingDecisionRow], context: Context) -> None:
        for item in decided:
            self.decisions.store(process, item.part, item.phase, item.decision, stored.get(item.part.position), context)
