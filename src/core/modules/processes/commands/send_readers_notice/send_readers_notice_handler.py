from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from engine.driver.nudger import Nudger
from core.modules.processes.commands.send_readers_notice.send_readers_notice import SendReadersNotice
from core.modules.processes.support.process_nudges import READONLY_MISSING_NOTICE, READERS_MISSING_FIELDS, READERS_NEED_REPAIR, STOCK_READER_STALE, UNREADABLE_AUDIT
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
        behind = self.audit.stale_readers()
        main_agents = MainAgentFinder.rows(self.queries)
        for agent in main_agents:
            last_audit_at = self.audit.last_audit_at(agent)
            missing_readers = self.audit.missing_reader_decisions(last_audit_at, [main.id for main in main_agents])
            agent_marks = self.audit.agent_marks_count(last_audit_at)
            if fields_missing:
                self.nudger.send(agent.id, READERS_MISSING_FIELDS, AUDIT_SOURCE, context, count=fields_missing)
            for reader in broken:
                self.nudger.send(agent.id, READERS_NEED_REPAIR, AUDIT_SOURCE, context, reader=reader.name, count=REPAIR_AFTER_OUTPUTS)
            if agent_marks:
                self.nudger.send(agent.id, UNREADABLE_AUDIT, AUDIT_SOURCE, context, count=agent_marks)
            if missing_readers:
                self.nudger.send(agent.id, READONLY_MISSING_NOTICE, AUDIT_SOURCE, context, count=missing_readers)
            for reader, _ in behind:
                self.nudger.send(agent.id, STOCK_READER_STALE, AUDIT_SOURCE, context, reader=reader.name)
        for reader, digest in behind:
            self.repository.update(reader, context, shipped_digest=digest)
