from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.documents.commands.open_doc.open_doc import OpenDoc
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.open_document import OpenDocument
from core.modules.agents.models.agent import Agent
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.support.agent_label import AgentLabel


class OpenDocHandler(Handler[OpenDoc, OpenDocument]):
    """Reserves a document for its author's edits until close."""

    command = OpenDoc

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: OpenDoc, context: Context) -> OpenDocument:
        self.queries.query(Doc).find(command.doc_id)
        author_document = self.queries.query(OpenDocument).filter(author_id=context.actor.id).first()
        if author_document is not None:
            raise Refusal(f"doc {author_document.doc_id} is open; journal doc close {author_document.doc_id}")
        opened = self.queries.query(OpenDocument).filter(doc_id=command.doc_id).first()
        if opened is not None:
            agent = self.queries.query(Agent).filter(id=opened.author_id).first()
            author = self.queries.query(ActorRecord).find(opened.author_id)
            name = agent.given_name if agent is not None and agent.given_name else author.name
            opener = f"{AgentLabel.from_agent(agent).text} ({name})" if agent is not None else name
            raise Refusal(f"doc {command.doc_id} is open by {opener}; wait for its author to close it")
        return self.repository.save(OpenDocument(doc_id=command.doc_id, author_id=context.actor.id), context)
