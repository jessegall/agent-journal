import sqlite3
from datetime import datetime, timedelta

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.text_digest import TextDigest
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_ref import VersionFourRef
from core.base.upgrade.version_four_source import VersionFourSource
from core.modules.sharing.commands.make_share_link_handler import LINK_LIFETIME_DAYS

TABLE = "shares"
ROW_MODELS = {"plans": "plan"}
ENDED_TABLE = "shares stopped or past their end"


class ShareMove(VersionFourMove):
    """Carries version 4's live shares, the ones not stopped and not past their end, as active share links on the
    plan the share's link names, kept by the digest of the old token so the old address still opens it. A
    stopped or ended share is dropped and counted; one whose row is no plan, or did not move, is skipped and
    told."""

    name = "sharing"
    reads = [TABLE, "links (shares)"]
    id_modules = ["journal.core.actors", "journal.core.environments", "journal.core.plans"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        targets = self.targets(source)
        for row in source.rows(TABLE):
            if row["stopped_at"] or (row["expires_at"] and row["expires_at"] <= context.timestamp):
                report.drop(ENDED_TABLE, 1)
                continue
            shared = self.shared_row(targets.get(row["id"]), map)
            if shared is None or not row["token"]:
                report.skip(TABLE, row["id"], "its row is no plan that moved, or it has no token")
                continue
            report.count("share_links", map.transfer(TABLE, row["id"], "share_links", lambda: self.insert(rows, row, shared, creators.actor_id(row["creator"]), context)))
        return report

    def targets(self, source: VersionFourSource) -> dict[int, VersionFourRef]:
        targets: dict[int, VersionFourRef] = {}
        for link in [row for row in source.rows("links") if row["link_type"] == "shares"]:
            share = VersionFourRef.parsed(link["source"])
            if share.table == TABLE and share.number is not None:
                targets[share.number] = VersionFourRef.parsed(link["target"])
        return targets

    def shared_row(self, ref: VersionFourRef | None, map: MoveMap) -> tuple[str, int] | None:
        if ref is None or ref.table not in ROW_MODELS or ref.number is None:
            return None
        row_id = map.new_id(ref.table, ref.number)
        return (ROW_MODELS[ref.table], row_id) if row_id is not None else None

    def insert(self, rows: RowInsert, row: sqlite3.Row, shared: tuple[str, int], creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        ends = row["expires_at"] or (datetime.fromisoformat(context.timestamp) + timedelta(days=LINK_LIFETIME_DAYS)).isoformat()
        return rows.insert("share_links", {"environment_id": row["environment_id"], "creator_id": creator_id, "token_digest": TextDigest().hex_digest(row["token"]),
                                           "row_model": shared[0], "row_id": shared[1], "expires_at": ends, "comments": 0,
                                           "created_at": created, "updated_at": row["updated_at"] or created})
