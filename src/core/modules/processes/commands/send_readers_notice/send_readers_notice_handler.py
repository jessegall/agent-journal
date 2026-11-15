from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from engine.driver.nudger import Nudger
from core.modules.processes.commands.send_readers_notice.send_readers_notice import SendReadersNotice
from core.modules.processes.nudges.readonly_missing_notice_nudge import ReadonlyMissingNoticeNudge
from core.modules.processes.nudges.readers_missing_fields_nudge import ReadersMissingFieldsNudge
from core.modules.processes.nudges.readers_need_repair_nudge import ReadersNeedRepairNudge
from core.modules.processes.nudges.stock_reader_stale_nudge import StockReaderStaleNudge
from core.modules.processes.nudges.unreadable_audit_nudge import UnreadableAuditNudge
from core.modules.processes.support.reading.catalogue_audit import AUDIT_SOURCE, REPAIR_AFTER_OUTPUTS, CatalogueAudit


class SendReadersNoticeHandler(Handler[SendReadersNotice, None]):
    """Tells each main agent, without blocking it, what the reader audit finds: the readers that lack
    required fields, the readers that picked no line of their last outputs, the commands agents
    marked unreadable, the commands of read-only helpers that ended without a proper reader, and the
    stock readers an edit froze that fell behind the shipped ones, said once for each change of the
    shipped one: the row then keeps the digest of the entry it was told about."""

    command = SendReadersNotice

    def __init__(self, audit: CatalogueAudit, queries: Queries, nudger: Nudger, repository: Repository) -> None:
        self.audit, self.queries, self.nudger, self.repository = audit, queries, nudger, repository

    def handle(self, command: SendReadersNotice, context: Context) -> None:
        fields_missing = self.audit.fields_missing_count()
        broken = self.audit.readers_needing_repair()
        stale_readers = self.audit.stale_readers()
        main_agents = MainAgentFinder.rows(self.queries)
        for agent in main_agents:
            last_audit_at = self.audit.last_audit_at(agent)
            missing_readers = self.audit.missing_reader_decisions(last_audit_at, [main.id for main in main_agents])
            agent_marks = self.audit.agent_marks_count(last_audit_at)
            if fields_missing:
                self.nudger.send(agent.id, ReadersMissingFieldsNudge.declared(), AUDIT_SOURCE, context, count=fields_missing)
            for reader in broken:
                self.nudger.send(agent.id, ReadersNeedRepairNudge.declared(), AUDIT_SOURCE, context, reader=reader.name, count=REPAIR_AFTER_OUTPUTS)
            if agent_marks:
                self.nudger.send(agent.id, UnreadableAuditNudge.declared(), AUDIT_SOURCE, context, count=agent_marks)
            if missing_readers:
                self.nudger.send(agent.id, ReadonlyMissingNoticeNudge.declared(), AUDIT_SOURCE, context, count=missing_readers)
            for reader, _ in stale_readers:
                self.nudger.send(agent.id, StockReaderStaleNudge.declared(), AUDIT_SOURCE, context, reader=reader.name)
        for reader, digest in stale_readers:
            self.repository.update(reader, context, shipped_digest=digest)
