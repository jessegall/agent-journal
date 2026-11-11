from collections import defaultdict
from collections.abc import Sequence

from engine.enums.command_category import CommandCategory
from engine.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.reading_decision_query import ReadingDecisionQuery
from core.modules.processes.support.reader_judge import ReaderJudge
from core.modules.processes.support.reader_rows import ReaderRows

AUDIT_SOURCE = "processes.readers-at-start"
REPAIR_AFTER_OUTPUTS = 3
RECENT_OUTPUTS = 50


class CatalogueAudit:
    """What the main agent hears of the readers when its session starts: the readers that lack required fields, by
    the judge every reader is judged by, the readers that picked no line of their last outputs, and the runs of
    agents that may not write readers whose end was decided without a proper reader since the main agent last heard
    the audit. Only a main agent writes readers."""

    def __init__(self, reader_rows: ReaderRows, judge: ReaderJudge, decisions: ReadingDecisionQuery, queries: Queries, outputs: OutputQuery) -> None:
        self.reader_rows, self.judge, self.decisions, self.queries, self.outputs = reader_rows, judge, decisions, queries, outputs

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

    def readers_needing_repair(self) -> tuple[Reader, ...]:
        """The readers whose last outputs with lines, three of them, each had no line the reader kept."""
        kept_lines: defaultdict[int, list[int]] = defaultdict(list)
        for output in self.outputs.read_with_lines().newest().limited(RECENT_OUTPUTS):
            kept_lines[output.reader_id].append(output.reader_lines)
        broken = {reader_id for reader_id, counts in kept_lines.items() if len(counts) >= REPAIR_AFTER_OUTPUTS and not any(counts[:REPAIR_AFTER_OUTPUTS])}
        return tuple(reader for reader in self.reader_rows.all() if reader.id in broken)
