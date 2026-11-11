from engine.command.context import Context
from engine.repository.repository import Repository
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reading_decision_row import ReadingDecisionRow
from core.modules.processes.queries.reading_decision_query import ReadingDecisionQuery
from core.modules.processes.support.silent_start_runs import SilentStartRuns
from core.modules.processes.support.reading.reading_decision import ReadingDecision


class ReadingDecisions:
    """Keeps the engine's decision about one part of a run at one moment, in place of the earlier decision of the
    same part and moment; nothing else writes the decisions."""

    def __init__(self, decisions: ReadingDecisionQuery, repository: Repository) -> None:
        self.decisions, self.repository = decisions, repository

    def store(self, process: Process, part: ProcessPart, moment: ReadingMoment, decision: ReadingDecision, context: Context) -> ReadingDecisionRow:
        stored = self.decisions.for_process(process.id).filter(part_position=part.position, moment=moment).first()
        values = {"state": decision.state, "action": decision.action, "level": decision.level, "reason": decision.reason, "decided_at": context.timestamp}
        if stored is not None:
            return self.repository.update(stored, context, **values)
        return self.repository.save(ReadingDecisionRow(process_id=process.id, part_position=part.position, command_key=SilentStartRuns.name(part.text, part.program, part.category),
                                                       moment=moment, **values), context)
