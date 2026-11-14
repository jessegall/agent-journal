from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.documents.commands.keep_revision.keep_revision import KeepRevision
from core.modules.documents.models.open_document import OpenDocument
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport

OPEN_DOCUMENTS_REASON = "every document left open by an ended author is closed with its text kept"


class EndedDocuments:
    """Closes documents left open by ended agents and tells their parents."""

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def close(self, opened: OpenDocument, agent: Agent, cause_id: int | None = None) -> None:
        self.bus.run(KeepRevision(opened.doc_id), Actor.core(), cause_id=cause_id)
        if agent.parent_id is not None:
            self.bus.run(RecordParentReport(agent.id, agent.parent_id,
                f"doc {opened.doc_id} closed after its author ended; its text was kept"), Actor.core(), cause_id=cause_id)

    def close_all(self) -> None:
        opened = tuple(self.queries.query(OpenDocument).every_row(OPEN_DOCUMENTS_REASON))
        if not opened:
            return
        agents = {agent.id: agent for agent in self.queries.query(Agent).matching(Among("id", [row.author_id for row in opened])).every_row(OPEN_DOCUMENTS_REASON)}
        for row in opened:
            agent = agents.get(row.author_id)
            if agent is not None and agent.ended_at is not None:
                self.close(row, agent)
