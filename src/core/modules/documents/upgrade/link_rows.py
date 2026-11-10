import sqlite3
from collections.abc import Iterable

from core.base.database.database import Database
from core.base.database.moved_row import MovedRow
from core.base.database.row_insert import RowInsert
from engine.upgrade.creator_resolver import CreatorResolver
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_ref import VersionFourRef
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.references.row_ref import RowRef

END_MODELS = {"docs": "doc", "reports": "report", "tasks": "task", "plans": "plan", "messages": "message",
              "questions": "question", "agents": "agent", "phases": "phase", "task_logs": "task_log"}
DOMAIN_LINKS = {"depends": "task dependencies", "holds": "task holders", "phase_of": "plan phases", "in_phase": "phase tasks",
                "revision_of": "document revisions", "reacts": "message reactions", "shares": "shared rows"}
LINK_TYPES = frozenset(link_type.value for link_type in LinkType)


class LinkRows:
    """Copies mapped general links once, preserving existing rows and explaining every omitted edge."""

    def __init__(self, target: Database, mapping: MoveMap, context: MoveContext) -> None:
        self.rows, self.mapping, self.context = RowInsert(target), mapping, context
        self.creators = CreatorResolver(target, mapping)

    @staticmethod
    def has_question_end(link: sqlite3.Row) -> bool:
        return any(VersionFourRef.parsed(link[end]).table == "questions" for end in ("source", "target"))

    def move(self, links: Iterable[sqlite3.Row]) -> MoveReport:
        report = MoveReport()
        handled: dict[str, int] = {}
        for link in links:
            link_type = link["link_type"]
            if link_type in DOMAIN_LINKS:
                owner = f"{link_type}: {DOMAIN_LINKS[link_type]}"
                handled[owner] = handled.get(owner, 0) + 1
                continue
            if link_type not in LINK_TYPES:
                report.drop(f"unsupported link type {link_type}", 1)
                report.skip("links", link["id"], f"unsupported link type {link_type}")
                continue
            if self.mapping.moved_row("links", link["id"]) is not None:
                owner = "already mapped general links"
                handled[owner] = handled.get(owner, 0) + 1
                continue
            source_end, target_end = self.end(link["source"]), self.end(link["target"])
            if isinstance(source_end, str) or isinstance(target_end, str):
                reason = "; ".join(end for end in (source_end, target_end) if isinstance(end, str))
                report.drop("links to a row that did not move", 1)
                report.skip("links", link["id"], reason)
                continue
            identity = {"source_model": source_end.model, "source_id": source_end.row_id, "target_model": target_end.model, "target_id": target_end.row_id, "link_type": link_type}
            existing = self.rows.matching_row_id("links", identity)
            if existing is not None:
                self.mapping.record(MovedRow("links", link["id"], "links", existing))
                report.drop("duplicate links", 1)
                continue
            created = link["created_at"] or self.context.timestamp
            new_id = self.rows.insert("links", {**identity, "creator_id": self.creators.actor_id(link["creator"]),
                                               "created_at": created, "updated_at": link["updated_at"] or created})
            self.mapping.record(MovedRow("links", link["id"], "links", new_id))
            report.count("links", True)
        for owner, count in sorted(handled.items()):
            report.note(f"handled elsewhere: {owner}: {count} links")
        return report

    def end(self, text: str | None) -> RowRef | str:
        reference = VersionFourRef.parsed(text)
        if reference.table not in END_MODELS or reference.number is None:
            return f"{text!r} is not a supported mapped endpoint"
        moved = self.mapping.moved_row(reference.table, reference.number)
        if moved is None:
            return f"{text} did not move"
        if moved.new_table != reference.table:
            return f"{text} maps to {moved.new_table}, not {reference.table}"
        if self.rows.matching_row_id(moved.new_table, {"id": moved.new_id}) is None:
            return f"{text} no longer exists"
        return RowRef(END_MODELS[reference.table], moved.new_id)
