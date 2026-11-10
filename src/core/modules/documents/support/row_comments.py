from engine.model.model import Model
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.query.query import Query
from engine.row.page import Page
from engine.query.conditions.subquery_match import SubqueryMatch
from core.modules.documents.support.comment_read import CommentRead
from core.modules.messages.conditions.message_text_segment import MessageTextSegment
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
        return tuple(self.query(row).oldest().limited(25))

    def query(self, row: Model) -> Query[Message]:
        links = self.queries.query(Link).filter(target_model=row.model_name, target_id=row.id, link_type=LinkType.COMMENT, source_model=MESSAGE_MODEL).oldest()
        return self.queries.query(Message).matching(SubqueryMatch("id", links.select.column("source_id")))

    def previews(self, row: Model, characters: int) -> Query[Message]:
        comments = self.query(row)
        return comments.with_select(comments.select.column(MessageTextSegment(0, characters).columns(comments.table.columns)))

    def reads(self, row: TextRow | Plan | Task) -> tuple[CommentRead, ...]:
        return self.page(row).rows

    def page(self, row: TextRow | Plan | Task, number: int = 1, size: int = 25) -> Page[CommentRead]:
        messages = self.query(row).oldest().page(number, size)
        ids = tuple(message.id for message in messages.rows)
        selections = {selection.message_id: selection for selection in self.queries.query(CommentSelection).matching(Among("message_id", ids)).limited(len(ids))}
        return Page(tuple(self.read(message, selections.get(message.id), row) for message in messages.rows), number, size, messages.total)

    def read(self, message: Message, selection: CommentSelection | None, row: TextRow | Plan | Task) -> CommentRead:
        created_at = message.created_at.text if message.created_at else ""
        if selection is None:
            return CommentRead(message.id, message.text, message.text.removeprefix(f"On {row.cli_name} {row.id}, {row.title}: "), message.creator_id, created_at)
        return CommentRead(message.id, message.text, selection.body, message.creator_id, created_at, selection.quote, selection.position, selection.selection_type, selection.revision)
