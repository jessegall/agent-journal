from engine.command.context import Context
from engine.database.kept_rows import KeptRows
from engine.repository.repository import Repository
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reading_decision_row import ReadingDecisionRow
from core.modules.processes.queries.reading_decision_query import ReadingDecisionQuery
from core.modules.processes.support.silent_start_runs import SilentStartRuns
from core.modules.processes.support.decisions.reading_decision import ReadingDecision


class ReadingDecisions:
    """Keeps the engine's decision about one part of a run at one moment, in place of the earlier decision of the
    same part and moment; nothing else writes the decisions."""

    def __init__(self, decisions: ReadingDecisionQuery, repository: Repository, kept: KeptRows) -> None:
        self.decisions, self.repository, self.kept_rows = decisions, repository, kept

    def kept(self, process: Process, moment: ReadingMoment) -> dict[int, ReadingDecisionRow]:
        """The kept decision of each part of a run at one moment, by the part's position, read again only after the
        decisions of that run changed, so storing and telling them read once."""
        decisions = self.decisions.for_process(process.id).filter(moment=moment)
        rows = self.kept_rows.read(decisions, lambda: tuple(decisions.get()), name="processes.kept_decisions")
        return {row.part_position: row for row in rows}

    def store(self, process: Process, part: ProcessPart, moment: ReadingMoment, decision: ReadingDecision, stored: ReadingDecisionRow | None, context: Context) -> ReadingDecisionRow:
        values = {"state": decision.state, "action": decision.action, "level": decision.level, "reason": decision.reason, "decided_at": context.timestamp}
        if stored is not None:
            return self.repository.update(stored, context, **values)
        return self.repository.save(ReadingDecisionRow(process_id=process.id, part_position=part.position, command_key=SilentStartRuns.name(part.text, part.program, part.category),
                                                       moment=moment, **values), context)
