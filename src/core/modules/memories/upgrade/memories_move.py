import json
import sqlite3
from functools import partial

from engine.database.database import Database
from engine.database.row_insert import RowInsert
from engine.types.type_guards import is_list
from engine.upgrade.creator_resolver import CreatorResolver
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_ref import VersionFourRef
from engine.upgrade.version_four_source import VersionFourSource
from core.modules.documents.upgrade.whole_text_documents import WholeTextDocuments
from core.modules.memories.models.enums.memory_state import MemoryState
from core.modules.memories.models.memory import FADING_REMOVAL_REASON, LOWEST_WEIGHT, TEXT_LIMIT_CHARACTERS

TABLE = "memories"
REMINDERS = "reminders"
EMPTY_CONDITION = "{}"
KEYWORD_LIMITS = (2, 40)


class MemoriesMove(VersionFourMove):
    """Imports version 4 memories and reminders, preserving content and removing zero-weight facts."""

    name = "memories"
    reads = ["memories", REMINDERS]
    id_modules = ["journal.core.actors", "journal.core.environments", "journal.core.tasks"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        documents = WholeTextDocuments(rows, TEXT_LIMIT_CHARACTERS, "memory")
        for row in source.rows(TABLE):
            if row["expires_at"] and row["expires_at"] <= context.timestamp:
                report.drop("memories past their end", 1)
                continue
            if row["expires_at"]:
                report.note(f"memory {row['id']} had an end on {row['expires_at'][:10]}: it moved without it, remove it when it is done")
            if not row["text"]:
                report.skip(TABLE, row["id"], "it has no text")
                continue
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: self.insert(rows, documents, row, creators.actor_id(row["creator"]), map, context)))
        self.move_instructions(source, rows, documents, creators, map, report, context)
        if documents.document_ids:
            report.note(documents.note())
        return report

    def move_instructions(self, source: VersionFourSource, rows: RowInsert, documents: WholeTextDocuments, creators: CreatorResolver, map: MoveMap,
                          report: MoveReport, context: MoveContext) -> None:
        for row in source.rows(REMINDERS):
            if row["due_at"]:
                report.count(REMINDERS, map.transfer(REMINDERS, row["id"], REMINDERS, partial(self.insert_timed_reminder, rows, row, creators.actor_id(row["creator"]), context)))
                continue
            if row["trigger"] or (row["condition"] and row["condition"] != EMPTY_CONDITION):
                report.note(f"reminder {row['id']} had a trigger or a condition version 5 does not carry: it moved without it")
            report.count(REMINDERS, map.transfer(REMINDERS, row["id"], TABLE, partial(self.insert_reminder, rows, documents, row, creators.actor_id(row["creator"]), context)))

    def insert_timed_reminder(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        return rows.insert(REMINDERS, {"environment_id": row["environment_id"], "creator_id": creator_id, "text": row["text"], "due_at": row["due_at"], "single_use": 1,
                                             "created_at": created, "updated_at": row["updated_at"] or created})

    def insert_reminder(self, rows: RowInsert, documents: WholeTextDocuments, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        memory_id = rows.insert(TABLE, {"environment_id": row["environment_id"], "creator_id": creator_id,
                                        "text": documents.fitting_text(row, creator_id, created),
                                        "created_at": created, "updated_at": row["updated_at"] or created})
        self.keep_words(rows, memory_id, creator_id, row["keywords"], created)
        return memory_id

    def insert(self, rows: RowInsert, documents: WholeTextDocuments, row: sqlite3.Row, creator_id: int, map: MoveMap, context: MoveContext) -> int:
        created, expiry = row["created_at"] or context.timestamp, VersionFourRef.parsed(row["expiry_row"])
        task_id = map.new_id("tasks", expiry.number) if expiry.table == "tasks" and expiry.number is not None else None
        faded = row["weight"] == LOWEST_WEIGHT and not row["removed_at"]
        removed_at = context.timestamp if faded else row["removed_at"]
        memory_id = rows.insert(TABLE, {"id": row["id"], "environment_id": row["environment_id"], "task_id": task_id, "creator_id": creator_id,
                                        "text": documents.fitting_text(row, creator_id, created), "weight": row["weight"], "removed_at": removed_at,
                                        "reason": FADING_REMOVAL_REASON if faded else "",
                                        "created_at": created, "updated_at": row["updated_at"] or created})
        if removed_at:
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
