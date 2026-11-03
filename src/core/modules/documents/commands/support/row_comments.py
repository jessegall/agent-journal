from core.base.model.model import Model
from core.base.query.queries import Queries
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.messages.models.message import Message

MESSAGE_MODEL = "message"


class RowComments:
    """The messages written on a row as comments, oldest first."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def on(self, row: Model) -> tuple[Message, ...]:
        links = self.queries.query(Link).filter(target_model=row.model_name, target_id=row.id, link_type=LinkType.COMMENT, source_model=MESSAGE_MODEL).oldest()
        return tuple(self.queries.query(Message).find_many([link.source_id for link in links.all_rows()]))
