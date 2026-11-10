from engine.change.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from engine.query.queries import Queries
from core.modules.agents.events.agent_ended import AgentEnded
from core.modules.documents.models.open_document import OpenDocument
from core.modules.documents.actions.ended_documents import EndedDocuments


class CloseEndedDocumentListener(CommitListener[AgentEnded]):
    """Keeps an ended author's text and tells its parent that the document was closed."""

    name = "documents.close-ended-document"

    def __init__(self, queries: Queries, ended: EndedDocuments) -> None:
        self.queries, self.ended = queries, ended

    def handle(self, event: AgentEnded, logged: LoggedEvent) -> None:
        opened = self.queries.query(OpenDocument).filter(author_id=event.row.id).first()
        if opened is None:
            return
        self.ended.close(opened, event.row, logged.id)
