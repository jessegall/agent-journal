from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from engine.driver.nudger import Nudger
from core.modules.processes.commands.send_readers_notice.send_readers_notice import SendReadersNotice
from core.modules.processes.support.process_nudges import READ_ONLY_MISSING_NOTICE, READERS_MISSING_FIELDS
from core.modules.processes.support.reading.catalogue_audit import AUDIT_SOURCE, CatalogueAudit


class SendReadersNoticeHandler(Handler[SendReadersNotice, None]):
    """Tells each main agent, without blocking it, what the reader audit counts: the readers that lack required
    fields, and the commands of read-only helpers that ended without a proper reader."""

    command = SendReadersNotice

    def __init__(self, audit: CatalogueAudit, queries: Queries, nudger: Nudger) -> None:
        self.audit, self.queries, self.nudger = audit, queries, nudger

    def handle(self, command: SendReadersNotice, context: Context) -> None:
        fields_missing = self.audit.fields_missing_count()
        mains = MainAgentFinder.rows(self.queries)
        for agent in mains:
            missing_readers = self.audit.missing_reader_decisions(agent.id, [main.id for main in mains])
            if fields_missing:
                self.nudger.send(agent.id, READERS_MISSING_FIELDS, AUDIT_SOURCE, context, count=fields_missing)
            if missing_readers:
                self.nudger.send(agent.id, READ_ONLY_MISSING_NOTICE, AUDIT_SOURCE, context, count=missing_readers)
