from collections.abc import Mapping, Sequence

from engine.command.context import Context
from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter
from core.modules.processes.errors.decision_without_exit_error import DecisionWithoutExitError
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reading_decision_row import ReadingDecisionRow
from core.modules.processes.support.decisions.reading_decider import ReadingDecider
from core.modules.processes.support.decisions.reading_decisions import ReadingDecisions
from core.modules.processes.support.decisions.reading_case import ReadingCase
from core.modules.processes.support.reading.reading_facts import ReadingFacts


class ShadowDecisions:
    """Decides the reader of each part of a run beside the old code and keeps the decision, which nothing acts on
    yet. The facts and the kept decisions of all parts are read together, once. A decision the engine cannot build
    is written to the system log, and the run goes on."""

    def __init__(self, facts: ReadingFacts, decider: ReadingDecider, decisions: ReadingDecisions, log: SystemLogWriter) -> None:
        self.facts, self.decider, self.decisions, self.log = facts, decider, decisions, log

    def store(self, process: Process, parts: Sequence[ProcessPart], moment: ReadingMoment, context: Context) -> None:
        if not parts:
            return
        stored = self.decisions.kept(process, moment)
        for part, case in zip(parts, self.facts.cases_for(process, parts, moment)):
            self.store_part(process, part, case, stored, context)

    def store_part(self, process: Process, part: ProcessPart, case: ReadingCase, stored: Mapping[int, ReadingDecisionRow], context: Context) -> None:
        try:
            decision = self.decider.decide(case)
        except DecisionWithoutExitError as error:
            self.log.write(LogLevel.WARNING, f"output {process.id} part {part.position}: no reading decision at {case.moment.value}: {error}")
            return
        self.decisions.store(process, part, case.moment, decision, stored.get(part.position), context)
