import sqlite3
from functools import partial

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from engine.text.text_digest import TextDigest
from engine.upgrade.creator_resolver import CreatorResolver
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_ref import VersionFourRef
from engine.upgrade.version_four_source import VersionFourSource

TABLE = "shares"
ROW_MODELS = {"plans": "plan"}
ENDED_TABLE = "shares stopped or past their end"


class ShareMove(VersionFourMove):
    """Carries version 4's live shares, the ones not stopped and not past their end, as share links on the
    plan the
    share's link names, kept by the digest of the old token so the old address still opens it; one not yet
    approved waits. A stopped or ended share is dropped and counted; one whose row is no plan, or did not
    move,
    or that has a password this version cannot read, is skipped and told."""

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
            if row["password"]:
                report.skip(TABLE, row["id"], "it has a password, which could not be carried, so it would open for anyone")
                continue
            shared = self.shared_row(targets.get(row["id"]), map)
            if shared is None or not row["token"]:
                report.skip(TABLE, row["id"], "its row is no plan that moved, or it has no token")
                continue
            report.count("share_links", map.transfer(TABLE, row["id"], "share_links", partial(self.insert, rows, row, shared, creators.actor_id(row["creator"]), context)))
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
        return rows.insert("share_links", {"environment_id": row["environment_id"], "creator_id": creator_id, "token_digest": TextDigest().hex_digest(row["token"]),
                                           "row_model": shared[0], "row_id": shared[1], "expires_at": row["expires_at"], "comments": row["comments"], "view_count": row["views"],
                                           "state": "active" if row["approved"] else "waiting",
                                           "created_at": created, "updated_at": row["updated_at"] or created})
