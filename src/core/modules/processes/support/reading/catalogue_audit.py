from collections.abc import Sequence

from engine.enums.command_category import CommandCategory
from engine.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reading_decision_query import ReadingDecisionQuery
from core.modules.processes.support.reader_judge import ReaderJudge
from core.modules.processes.support.reader_rows import ReaderRows

AUDIT_SOURCE = "processes.readers-at-start"


class CatalogueAudit:
    """What the main agent hears of the readers when its session starts: the readers that lack required fields, by
    the judge every reader is judged by, and the runs of agents that may not write readers whose end was decided
    without a proper reader since the main agent last heard the audit. Only a main agent writes readers."""

    def __init__(self, reader_rows: ReaderRows, judge: ReaderJudge, decisions: ReadingDecisionQuery, queries: Queries) -> None:
        self.reader_rows, self.judge, self.decisions, self.queries = reader_rows, judge, decisions, queries

    def fields_missing_count(self) -> int:
        readers = self.reader_rows.all()
        samples = self.judge.reader_samples(readers)
        return sum(self.has_missing_fields(reader, samples[reader.id]) for reader in readers)

    def has_missing_fields(self, reader: Reader, samples: Sequence[ProcessPart]) -> bool:
        categories = {CommandCategory.CHECK, *(part.category for part in samples)}
        return any(self.judge.fields_missing(reader, category) for category in categories)

    def missing_reader_decisions(self, main_agent_id: int, main_agent_ids: Sequence[int]) -> int:
        decisions = self.decisions.lacking_a_reader_at_end().of_runs_outside(main_agent_ids)
        last_audit = self.queries.query(AgentLine).filter(session_agent_id=main_agent_id, source=AUDIT_SOURCE).newest().first()
        return (decisions.since(last_audit.creation_timestamp()) if last_audit is not None else decisions).count()
