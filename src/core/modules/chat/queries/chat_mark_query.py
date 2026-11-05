from typing import Self

from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.modules.chat.models.chat_mark import ChatMark


class ChatMarkQuery(Query[ChatMark]):
    """Reads chat marks, by environment, by agent and by the run they belong to."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, ChatMark)
        self.kept = kept

    def keyed(self, environment_id: int, key: str) -> ChatMark | None:
        return self.kept.read(self.table.name, self.filter(environment_id=environment_id, key=key).first,
                              "environment_id = ? AND key = ?", [environment_id, key], name="chat.keyed_mark")

    def remember(self, mark: ChatMark) -> None:
        self.kept.update(self.table.name, lambda previous: mark, "environment_id = ? AND key = ?",
                         [mark.environment_id, mark.key], name="chat.keyed_mark")

    def environment_marks(self, environment_id: int) -> Self:
        return self.filter(environment_id=environment_id)

    def agent_marks(self, agent_id: int) -> Self:
        return self.filter(agent_id=agent_id)

    def run_marks(self, run_key: str) -> Self:
        return self.filter(run_key=run_key).ordered("run_step")
