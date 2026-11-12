from typing import Self

from engine.database.database import Database
from engine.database.kept_rows import KeptRows
from engine.model.tables import Tables
from engine.query.query import Query
from core.modules.chat.models.chat_mark import ChatMark


class ChatMarkQuery(Query[ChatMark]):
    """Reads chat marks, by environment, by agent and by the run they belong to."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, ChatMark)
        self.kept = kept

    def keyed(self, key: str) -> ChatMark | None:
        marks = self.filter(key=key)
        return self.kept.read(marks, marks.first, name="chat.keyed_mark")

    def remember(self, mark: ChatMark) -> None:
        self.kept.update(self.filter(key=mark.key), lambda previous: mark, name="chat.keyed_mark")

    def agent_marks(self, agent_id: int) -> Self:
        return self.filter(session_agent_id=agent_id)

    def run_marks(self, run_key: str) -> Self:
        return self.filter(run_key=run_key).ordered("run_step")
