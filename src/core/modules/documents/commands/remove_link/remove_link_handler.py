from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.errors.user_approval_refusal import UserApprovalRefusal
from core.base.repository.repository import Repository
from core.modules.documents.commands.remove_link.remove_link import RemoveLink
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.models.link_correction import LinkCorrection
from core.modules.documents.support.row_refs import RowRefs
from core.modules.messages.models.message import Message
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES


class RemoveLinkHandler(Handler[RemoveLink, None]):
    """Deletes a scoped attribution and retains its suppression in the same transaction."""

    command = RemoveLink

    def __init__(self, queries: Queries, rows: EventRows, repository: Repository, refs: RowRefs) -> None:
        self.queries, self.rows, self.repository, self.refs = queries, rows, repository, refs

    def handle(self, command: RemoveLink, context: Context) -> None:
        if context.actor.type not in (ActorType.AGENT, ActorType.USER) or context.environment_id is None:
            raise Refusal("correct attribution as a person or its creating agent in one environment")
        removed = self.queries.query(LinkCorrection).filter(link_id=command.link_id).first()
        link = self.rows.find(Link, command.link_id)
        if removed is not None:
            self.authorize(removed.link_creator_id, context)
            if link is not None:
                raise Refusal("this removed link number has been reused", "inspect the current links before correcting them")
            return
        if link is None:
            raise Refusal("this attribution link does not exist")
        if link.link_type not in (LinkType.SUBJECT, LinkType.EDITED):
            raise Refusal("only about and edited attribution links can be removed")
        self.authorize(link.creator_id, context)
        message = self.rows.required(Message, link.source_id) if link.source_model == Message.model_name else None
        if not self.local_request(message, context):
            raise Refusal("correct a person request attribution in this environment")
        if link.target_model not in ("task", "plan", "doc", "report"):
            raise Refusal("correct a request attribution in this environment")
        if self.refs.existing(link.target_model, link.target_id) is None:
            raise Refusal("the attributed resource is not available in this environment")
        self.repository.save(LinkCorrection(creator_id=context.actor.id,
                            link_id=link.id, link_creator_id=link.creator_id, source_model=link.source_model, source_id=link.source_id,
                            target_model=link.target_model, target_id=link.target_id, link_type=link.link_type), context)
        self.repository.delete_stored(link, context)

    @staticmethod
    def local_request(message: Message | None, context: Context) -> bool:
        return message is not None and message.type in PERSON_MESSAGE_TYPES and message.environment_id == context.environment_id

    def authorize(self, creator_id: int, context: Context) -> None:
        if context.actor.type is ActorType.AGENT and context.actor.id != creator_id:
            raise UserApprovalRefusal("Correct another agent's request attribution?", command=context.command)
