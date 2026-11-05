from core.base.model.model import Model
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.documents.commands.support.comment_read import CommentRead
from core.modules.documents.models.comment_selection import CommentSelection
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.messages.models.message import Message
from core.modules.plans.models.plan import Plan
from core.modules.tasks.models.task import Task
from core.modules.documents.models.text_row import TextRow

MESSAGE_MODEL = "message"


class RowComments:
    """The messages written on a row as comments, oldest first, alone or with what each keeps beside it."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def comments(self, row: Model) -> tuple[Message, ...]:
        links = self.queries.query(Link).filter(target_model=row.model_name, target_id=row.id, link_type=LinkType.COMMENT, source_model=MESSAGE_MODEL).oldest()
        return tuple(self.queries.query(Message).find_many([link.source_id for link in links.all_rows()]))

    def reads(self, row: TextRow | Plan | Task) -> tuple[CommentRead, ...]:
        messages = self.comments(row)
        selections = {selection.message_id: selection for selection in self.queries.query(CommentSelection).matching(Among("message_id", [message.id for message in messages])).all_rows()}
        return tuple(self.read(message, selections.get(message.id), row) for message in messages)

    def read(self, message: Message, selection: CommentSelection | None, row: TextRow | Plan | Task) -> CommentRead:
        created_at = message.created_at.text if message.created_at else ""
        if selection is None:
            return CommentRead(message.id, message.text, message.text.removeprefix(f"On {row.cli_name} {row.id}, {row.title}: "), message.creator_id, created_at)
        return CommentRead(message.id, message.text, selection.body, message.creator_id, created_at, selection.quote, selection.position, selection.selection_type, selection.revision)
