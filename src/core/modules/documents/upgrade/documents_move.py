import sqlite3
from datetime import datetime, timezone
from functools import partial

from engine.database.database import Database
from engine.database.row_insert import RowInsert
from engine.time.timestamp import Timestamp
from engine.upgrade.creator_resolver import CreatorResolver
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_ref import VersionFourRef
from engine.upgrade.version_four_source import VersionFourSource

TEXT_TABLES = ("docs", "reports")
REVISIONS = "doc_revisions"
REVISION_LINK_TYPE = "revision_of"


class DocumentsMove(VersionFourMove):
    """Moves version 4 documents, reports and their revisions into the project library."""

    name = "documents"
    reads = [*TEXT_TABLES, REVISIONS]
    drops = ["library_items", "collections"]
    id_modules = ["journal.core.actors", "journal.core.environments", "journal.core.messages", "journal.core.tasks", "journal.core.plans"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for table in self.drops:
            report.drop(table, source.count(table))
        for table in TEXT_TABLES:
            for row in source.rows(table):
                report.count(table, map.transfer(table, row["id"], table, partial(self.insert_text, rows, table, row, creators.actor_id(row["creator"]), context)))
        revisions = {row["id"]: row for row in source.rows(REVISIONS)}
        for link in source.links(REVISION_LINK_TYPE):
            revision_ref = VersionFourRef.parsed(link["source"])
            revision = revisions.get(revision_ref.number) if revision_ref.number is not None else None
            doc_id = map.linked_id(VersionFourRef.parsed(link["target"]), "docs")
            if revision is None or doc_id is None:
                report.skip("links", link["id"], "its revision or its document did not move")
                continue
            report.count(REVISIONS, map.transfer(REVISIONS, revision["id"], REVISIONS, partial(self.insert_revision, rows, revision, doc_id,
                                                                                                creators.actor_id(revision["creator"]), context)))
        return report

    def insert_text(self, rows: RowInsert, table: str, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        return rows.insert(table, {"id": row["id"], "creator_id": creator_id, "title": row["title"], "abstract": row["abstract"],
                                   "body": row["body"] or "", "close_reason": row["settled_reason"] or "", "created_at": created, "updated_at": row["updated_at"] or created})

    def insert_revision(self, rows: RowInsert, row: sqlite3.Row, doc_id: int, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        closes_at = Timestamp(datetime.fromtimestamp(row["closes_at"], timezone.utc)).text if row["closes_at"] is not None else created
        return rows.insert(REVISIONS, {"doc_id": doc_id, "creator_id": creator_id, "author_id": creator_id, "number": row["number"], "title": row["title"], "abstract": row["abstract"],
                                       "body": row["body"] or "", "change": row["change"] or "", "closes_at": closes_at, "created_at": created,
                                       "updated_at": row["updated_at"] or created})

