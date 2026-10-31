import json
import sqlite3
from functools import partial

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.type_guards import is_list
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_ref import VersionFourRef
from core.base.upgrade.version_four_source import VersionFourSource
from core.modules.memories.models.enums.memory_state import MemoryState
from core.modules.memories.models.memory import TEXT_LIMIT_CHARACTERS

TABLE = "memories"
TYPE = "fact"
RULES, REMINDERS = "rules", "reminders"
EMPTY_CONDITION = "{}"
KEYWORD_LIMITS = (2, 40)


class MemoriesMove(VersionFourMove):
    """Carries only version 4's memory rows, as facts of their environment with their numbers: the text
    cut to 400 characters, the weight as it is (0 stays 0), the keywords, a removed memory as removed, and
    an expiry on a task as the task the memory is tied to. A memory whose end has passed is not moved and
    is counted; one with an end still to come moves without it and is listed in the report for the person
    to remove. Version 4's rules and reminders move as rule and reminder memories; a trigger or condition
    of theirs, which version 5 does not carry, is told."""

    name = "memories"
    reads = ["memories", RULES, REMINDERS]
    id_modules = ["journal.core.actors", "journal.core.environments", "journal.core.tasks"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(TABLE):
            if row["expires_at"] and row["expires_at"] <= context.timestamp:
                report.drop("memories past their end", 1)
                continue
            if row["expires_at"]:
                report.note(f"memory {row['id']} had an end on {row['expires_at'][:10]}: it moved without it, remove it when it is done")
            if not row["text"]:
                report.skip(TABLE, row["id"], "it has no text")
                continue
            if len(row["text"]) > TEXT_LIMIT_CHARACTERS:
                report.drop("memory text beyond 400 characters", len(row["text"]) - TEXT_LIMIT_CHARACTERS)
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: self.insert(rows, row, creators.actor_id(row["creator"]), map, context)))
        self.move_instructions(source, rows, creators, map, report, context)
        return report

    def move_instructions(self, source: VersionFourSource, rows: RowInsert, creators: CreatorResolver, map: MoveMap, report: MoveReport,
                                  context: MoveContext) -> None:
        for table, memory_type in ((RULES, "rule"), (REMINDERS, "reminder")):
            for row in source.rows(table):
                if row["trigger"] or (row["condition"] and row["condition"] != EMPTY_CONDITION):
                    report.note(f"{memory_type} {row['id']} had a trigger or a condition version 5 does not carry: it moved without it")
                if len(row["text"]) > TEXT_LIMIT_CHARACTERS:
                    report.skip(table, row["id"], f"its text is longer than {TEXT_LIMIT_CHARACTERS} characters")
                    continue
                report.count(table, map.transfer(table, row["id"], TABLE, partial(self.insert_instruction, rows, row, table, memory_type,
                                                                                 creators.actor_id(row["creator"]), context)))

    def insert_instruction(self, rows: RowInsert, row: sqlite3.Row, table: str, memory_type: str, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        memory_id = rows.insert(TABLE, {"environment_id": row["environment_id"] if table == REMINDERS else None, "creator_id": creator_id, "type": memory_type,
                                        "text": row["text"], "reason": row["reason"] if table == RULES else "", "due_at": row["due_at"] if table == REMINDERS else None,
                                        "created_at": created, "updated_at": row["updated_at"] or created})
        self.keep_words(rows, memory_id, creator_id, row["keywords"], created)
        return memory_id

    def insert(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, map: MoveMap, context: MoveContext) -> int:
        created, expiry = row["created_at"] or context.timestamp, VersionFourRef.parsed(row["expiry_row"])
        task_id = map.new_id("tasks", expiry.number) if expiry.table == "tasks" and expiry.number is not None else None
        memory_id = rows.insert(TABLE, {"id": row["id"], "environment_id": row["environment_id"], "task_id": task_id, "creator_id": creator_id, "type": TYPE,
                                        "text": row["text"][:TEXT_LIMIT_CHARACTERS], "weight": row["weight"], "removed_at": row["removed_at"],
                                        "created_at": created, "updated_at": row["updated_at"] or created})
        if row["removed_at"]:
            rows.set_state(TABLE, memory_id, MemoryState.REMOVED.value)
        self.keep_words(rows, memory_id, creator_id, row["keywords"], created)
        return memory_id

    def keep_words(self, rows: RowInsert, memory_id: int, creator_id: int, keywords: str | None, created: str) -> None:
        for word in self.words(keywords):
            rows.insert("memory_keywords", {"memory_id": memory_id, "creator_id": creator_id, "word": word, "created_at": created, "updated_at": created})

    def words(self, text: str | None) -> list[str]:
        try:
            parsed: object = json.loads(text) if text else []
        except ValueError:
            return []
        if not is_list(parsed):
            return []
        distinct = {str(item).lower() for item in parsed if isinstance(item, str)}
        return sorted(item for item in distinct if KEYWORD_LIMITS[0] <= len(item) <= KEYWORD_LIMITS[1])
