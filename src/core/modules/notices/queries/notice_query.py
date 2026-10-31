from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from core.modules.notices.models.notice import Notice


class NoticeQuery(Query[Notice]):
    """Reads notices, with the open ones of an environment."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Notice)

    def open_ones(self, environment_id: int) -> Self:
        return self.filter(environment_id=environment_id).matching(IsNull("closed_at"))
