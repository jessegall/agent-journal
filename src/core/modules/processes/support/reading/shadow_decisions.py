from collections.abc import Sequence

from engine.command.context import Context
from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter
from core.modules.processes.errors.decision_without_exit_error import DecisionWithoutExitError
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.reading.reading_decider import ReadingDecider
from core.modules.processes.support.reading.reading_decisions import ReadingDecisions
from core.modules.processes.support.reading.reading_facts import ReadingFacts


class ShadowDecisions:
    """Decides the reader of each part of a run beside the old code and keeps the decision, which nothing acts on
    yet. A decision the engine cannot build is written to the system log, and the run goes on."""

    def __init__(self, facts: ReadingFacts, decider: ReadingDecider, decisions: ReadingDecisions, log: SystemLogWriter) -> None:
        self.facts, self.decider, self.decisions, self.log = facts, decider, decisions, log

    def store(self, process: Process, parts: Sequence[ProcessPart], moment: ReadingMoment, context: Context) -> None:
        for part in parts:
            self.store_part(process, part, moment, context)

    def store_part(self, process: Process, part: ProcessPart, moment: ReadingMoment, context: Context) -> None:
        try:
            decision = self.decider.decide(self.facts.case_for(process, part, moment))
        except DecisionWithoutExitError as error:
            self.log.write(LogLevel.WARNING, f"output {process.id} part {part.position}: no reading decision at {moment.value}: {error}")
            return
        self.decisions.store(process, part, moment, decision, context)
