from datetime import timedelta

from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.timestamp import Timestamp
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.sharing.commands.leave_share_comment.leave_share_comment import LeaveShareComment
from core.modules.sharing.models.share_comment import ShareComment
from core.modules.sharing.models.share_link import ShareLink

NAME_LENGTH = 40
TEXT_LENGTH = 2000
COMMENTS_IN_WINDOW = 10
WINDOW_MINUTES = 10


class LeaveShareCommentHandler(Handler[LeaveShareComment, ShareComment]):
    """Keeps a visitor's comment on a link that takes them and tells the chat, as the journal's words and never the person's; only the viewer brings one in, and a link takes ten in ten minutes."""

    command = LeaveShareComment

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: LeaveShareComment, context: Context) -> ShareComment:
        if context.actor.type is not ActorType.CORE:
            raise Refusal("only a visitor of a link comments through it")
        link = self.queries.query(ShareLink).find(command.link_id)
        name, text = command.visitor_name.strip(), command.text.strip()
        if not link.comments:
            raise Refusal("this link takes no comments")
        if not 1 <= len(name) <= NAME_LENGTH or not 1 <= len(text) <= TEXT_LENGTH:
            raise Refusal(f"a comment has a name of up to {NAME_LENGTH} characters and a text of up to {TEXT_LENGTH}")
        since = Timestamp(context.timestamp.value - timedelta(minutes=WINDOW_MINUTES)).text
        if self.queries.query(ShareComment).filter(share_link_id=link.id).matching(Greater("created_at", since)).count() >= COMMENTS_IN_WINDOW:
            raise Refusal("this link has had many comments just now", "try again in a few minutes")
        comment = self.repository.save(ShareComment(share_link_id=link.id, creator_id=link.creator_id, visitor_name=name, text=text), context)
        self.repository.save(Message(environment_id=link.environment_id, creator_id=link.creator_id, type=MessageType.JOURNAL,
                                     text=f"{name} commented on {link.row_model} {link.row_id} through a shared link: {text}"), context)
        return comment
