from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.modules.chat.models.chat_mark import ChatMark


class ChatMarkQuery(Query[ChatMark]):
    """Reads chat marks, by environment, by agent and by the run they belong to."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, ChatMark)

    def environment_marks(self, environment_id: int) -> Self:
        return self.filter(environment_id=environment_id)

    def agent_marks(self, agent_id: int) -> Self:
        return self.filter(agent_id=agent_id)

    def run_marks(self, run_key: str) -> Self:
        return self.filter(run_key=run_key).ordered("run_step")
