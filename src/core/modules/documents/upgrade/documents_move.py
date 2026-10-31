import sqlite3
from datetime import datetime, timezone
from functools import partial

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.timestamp import Timestamp
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_ref import VersionFourRef
from core.base.upgrade.version_four_source import VersionFourSource

TEXT_TABLES = ("docs", "reports")
REVISIONS = "doc_revisions"
REVISION_LINK_TYPE = "revision_of"
LINK_TYPES = ("about", "mentions", "comments_on")
LINK_END_TABLES = ("docs", "reports", "tasks", "plans", "messages", "questions")
PROJECT_ENVIRONMENT = 0


class DocumentsMove(VersionFourMove):
    """Carries version 4's documents and reports with their numbers (a project one, environment 0, has no
    environment; a signed off one is closed with its reason), each document's revisions through their
    revision_of links, and the about, mentions and comments_on links of a document or report whose two ends
    moved; links to a row that did not move are counted."""

    name = "documents"
    reads = [*TEXT_TABLES, REVISIONS]
    id_modules = ["journal.core.actors", "journal.core.environments", "journal.core.messages", "journal.core.tasks", "journal.core.plans"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for table in TEXT_TABLES:
            for row in source.rows(table):
                report.count(table, map.transfer(table, row["id"], table, partial(self.insert_text, rows, table, row, creators.actor_id(row["creator"]), context)))
        links = source.rows("links")
        revisions = {row["id"]: row for row in source.rows(REVISIONS)}
        for link in [link for link in links if link["link_type"] == REVISION_LINK_TYPE]:
            revision_ref = VersionFourRef.parsed(link["source"])
            revision = revisions.get(revision_ref.number) if revision_ref.number is not None else None
            doc_id = map.linked_id(VersionFourRef.parsed(link["target"]), "docs")
            if revision is None or doc_id is None:
                report.skip("links", link["id"], "its revision or its document did not move")
                continue
            report.count(REVISIONS, map.transfer(REVISIONS, revision["id"], REVISIONS, partial(self.insert_revision, rows, revision, doc_id,
                                                                                                creators.actor_id(revision["creator"]), context)))
        kept_links: set[tuple[str, str, str]] = set()
        for link in [link for link in links if link["link_type"] in LINK_TYPES and self.touches_text(link)]:
            ends = [self.moved_end(map, link[end]) for end in ("source", "target")]
            if not all(ends):
                report.drop("links to a row that did not move", 1)
                continue
            if (ends[0], ends[1], link["link_type"]) in kept_links:
                report.drop("links written twice in version 4", 1)
                continue
            kept_links.add((ends[0], ends[1], link["link_type"]))
            report.count("links", map.transfer("links", link["id"], "links", partial(rows.insert, "links", {
                "creator_id": creators.actor_id(link["creator"]), "source": ends[0], "target": ends[1], "link_type": link["link_type"],
                "created_at": link["created_at"] or context.timestamp, "updated_at": link["updated_at"] or link["created_at"] or context.timestamp})))
        return report

    def insert_text(self, rows: RowInsert, table: str, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        environment_id = None if row["environment_id"] in (None, PROJECT_ENVIRONMENT) else row["environment_id"]
        return rows.insert(table, {"id": row["id"], "environment_id": environment_id, "creator_id": creator_id, "title": row["title"], "abstract": row["abstract"],
                                   "body": row["body"] or "", "close_reason": row["settled_reason"] or "", "created_at": created, "updated_at": row["updated_at"] or created})

    def insert_revision(self, rows: RowInsert, row: sqlite3.Row, doc_id: int, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        closes_at = Timestamp(datetime.fromtimestamp(row["closes_at"], timezone.utc)).text if row["closes_at"] is not None else created
        return rows.insert(REVISIONS, {"doc_id": doc_id, "creator_id": creator_id, "number": row["number"], "title": row["title"], "abstract": row["abstract"],
                                       "body": row["body"] or "", "change": row["change"] or "", "closes_at": closes_at, "created_at": created,
                                       "updated_at": row["updated_at"] or created})

    @staticmethod
    def touches_text(link: sqlite3.Row) -> bool:
        return any(VersionFourRef.parsed(link[end]).table in TEXT_TABLES for end in ("source", "target"))

    @staticmethod
    def moved_end(map: MoveMap, text: str) -> str:
        end = VersionFourRef.parsed(text)
        new_id = map.linked_id(end, end.table) if end.table in LINK_END_TABLES else None
        return f"{end.table}:{new_id}" if new_id is not None else ""
