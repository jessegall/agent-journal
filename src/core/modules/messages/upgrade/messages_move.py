import json
import sqlite3

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource
from core.modules.messages.models.enums.message_type import MessageType

TABLE = "messages"
TYPES = {"user": MessageType.USER, "agent": MessageType.AGENT}


class MessagesMove(VersionFourMove):
    """Carries what the user and the agents wrote in version 4 with its number, type, text, environment,
    reading moment, the message it answers and the agent that wrote it. Version 4 also kept chat cards, marks,
    reports and notices as messages with a kind in their data: they are not messages, they are dropped and
    counted by kind, since version 5 makes its chat marks from events."""

    name = "messages"
    reads = ["messages"]
    id_modules = ["journal.core.actors", "journal.core.environments", "journal.core.agents"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(source, map), RowInsert(target)
        for row in source.rows(TABLE):
            card_type = self.card_type(row["data"])
            if card_type:
                report.drop(f"chat card {card_type}", 1)
            elif row["author"] not in TYPES:
                report.skip(TABLE, row["id"], f"author {row['author']} is none of {', '.join(TYPES)}")
            else:
                report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: self.insert(rows, row, creators, map, context)))
        return report

    def card_type(self, data: str | None) -> str:
        if not data:
            return ""
        try:
            return str(json.loads(data).get("kind", ""))
        except (ValueError, AttributeError):
            return ""

    def insert(self, rows: RowInsert, row: sqlite3.Row, creators: CreatorResolver, map: MoveMap, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        agent = creators.actor_id(f"agent:{row['session']}") if row["author"] == MessageType.AGENT.value and row["session"] else None
        parent = map.new_id(TABLE, row["reply_target"]) if row["reply_target"] is not None else None
        return rows.insert(TABLE, {"id": row["id"], "environment_id": row["environment_id"], "agent_id": agent, "parent_id": parent,
                                   "creator_id": creators.actor_id(row["creator"]), "type": TYPES[row["author"]].value, "text": row["text"] or "",
                                   "read_at": row["read_at"], "created_at": created, "updated_at": row["updated_at"] or created})
