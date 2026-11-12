from collections import defaultdict
from collections.abc import Sequence

from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.reading_decision_query import ReadingDecisionQuery
from core.modules.processes.queries.unreadable_mark_query import UnreadableMarkQuery
from engine.time.timestamp import Timestamp
from core.modules.processes.support.reader_judge import ReaderJudge
from core.modules.processes.support.reader_rows import ReaderRows
from core.modules.processes.support.reading.stock_reader_edits import StockReaderEdits
from core.modules.processes.support.stock_digest import StockDigest
from core.modules.processes.support.stock_reader import STOCK_READERS

MARK_CREATORS_REASON = "every creator of a recent mark is checked for an agent"

AUDIT_SOURCE = "processes.readers-at-start"
REPAIR_AFTER_OUTPUTS = 3
RECENT_OUTPUTS = 50


class CatalogueAudit:
    """What the main agent hears of the readers when its session starts: the readers that lack required fields, by
    the judge every reader is judged by, the readers that picked no line of their last outputs, and the runs of
    agents that may not write readers whose end was decided without a proper reader since the main agent last heard
    the audit, and the stock readers an edit froze that fell behind the shipped ones. Only a main agent writes readers."""

    def __init__(self, reader_rows: ReaderRows, judge: ReaderJudge, decisions: ReadingDecisionQuery, queries: Queries, outputs: OutputQuery,
                 marks: UnreadableMarkQuery, edits: StockReaderEdits) -> None:
        self.reader_rows, self.judge, self.decisions, self.queries, self.outputs, self.marks = reader_rows, judge, decisions, queries, outputs, marks
        self.edits = edits

    def readers_behind(self) -> tuple[tuple[Reader, str], ...]:
        """The stock rows an edit froze whose shipped entry changed since: each with the digest of the entry now."""
        stock_rows = {reader.name: reader for reader in self.reader_rows.all() if reader.is_stock}
        edited = self.edits.edited_ids(stock_rows.values())
        return tuple((stock_rows[stock.name], StockDigest.of(stock)) for stock in STOCK_READERS
                     if stock.name in stock_rows and stock_rows[stock.name].id in edited and stock_rows[stock.name].shipped_digest != StockDigest.of(stock))

    def fields_missing_count(self) -> int:
        readers = self.reader_rows.all()
        samples = self.judge.reader_samples(readers)
        return sum(self.has_missing_fields(reader, samples[reader.id]) for reader in readers)

    def has_missing_fields(self, reader: Reader, samples: Sequence[ProcessPart]) -> bool:
        categories = {CommandCategory.CHECK, *(part.category for part in samples)}
        return any(self.judge.fields_missing(reader, category) for category in categories)

    def last_audit_at(self, main_agent: Agent) -> Timestamp:
        """When the main agent was last told the audit, or when it started, before its first audit line."""
        last_audit = self.queries.query(AgentLine).filter(session_agent_id=main_agent.id, source=AUDIT_SOURCE).newest().first()
        return last_audit.creation_timestamp() if last_audit is not None else main_agent.creation_timestamp()

    def missing_reader_decisions(self, last_audit_at: Timestamp, main_agent_ids: Sequence[int]) -> int:
        return self.decisions.lacking_a_reader_at_end().of_runs_outside(main_agent_ids).since(last_audit_at).count()

    def agent_marks_count(self, last_audit_at: Timestamp) -> int:
        """How many commands agents marked unreadable since the main agent last heard the audit; marks of the
        engine and of a person are not counted."""
        creators = [mark.creator_id for mark in self.marks.made_after(last_audit_at).standing().descending("created_at", "id").take(RECENT_OUTPUTS)]
        if not creators:
            return 0
        agents = {actor.id for actor in self.queries.query(ActorRecord).matching(Among("id", sorted(set(creators)))).filter(type=ActorType.AGENT).every_row(MARK_CREATORS_REASON)}
        return sum(creator in agents for creator in creators)

    def readers_needing_repair(self) -> tuple[Reader, ...]:
        """The readers whose last outputs with lines, three of them, each had no line the reader kept."""
        kept_lines: defaultdict[int, list[int]] = defaultdict(list)
        for output in self.outputs.read_with_lines().newest().take(RECENT_OUTPUTS):
            kept_lines[output.reader_id].append(output.reader_lines)
        broken = {reader_id for reader_id, counts in kept_lines.items() if len(counts) >= REPAIR_AFTER_OUTPUTS and not any(counts[:REPAIR_AFTER_OUTPUTS])}
        return tuple(reader for reader in self.reader_rows.all() if reader.id in broken)
