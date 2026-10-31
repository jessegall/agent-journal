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
from core.base.viewer.layout_shape import LayoutTabs, stored_layout

LAYOUT_PAGES = {"layout": "home", "inspector_layout": "inspector", "worker_layout": "worker"}
VIEW_WINDOWS = {"chat": "messages.chat", "tasks": "tasks.tasks", "plans": "plans.plans", "agents": "agents.agents", "subagents": "agents.subagents",
                "transcript": "agents.transcript", "hooks": "drivers.hook-calls", "questions": "questions.questions", "skills": "skills.skills"}
ABSENT_PREFIX = "gone."
SUITE = "coding"


class ViewerMove(VersionFourMove):
    """Carries the layouts version 4 kept as viewer settings (its home, inspector and worker layouts) as
    layouts of the first person for the first environment, the views of the panes in their order as the tabs
    of one pane, each view named as the window that replaces it and a view with no window kept in place as a
    gone window. The pairing codes of version 4 are dropped and counted."""

    name = "viewer"
    reads = ["settings (layouts)"]
    drops = ["phone_codes"]
    id_modules = ["journal.core.actors", "journal.core.environments"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        person, environments = self.first_user(source, map), source.rows("environments")
        for row in [row for row in source.rows("settings") if row["key"] in LAYOUT_PAGES]:
            windows = self.windows(row["value"])
            if person is None or not environments or not windows:
                report.skip("settings", row["id"], "there is no person, no environment or no view in the layout")
                continue
            report.count("viewer_layouts", map.transfer("settings", row["id"], "viewer_layouts", lambda: self.insert(
                rows, row, windows, person, environments[0]["id"], creators.actor_id(row["creator"]), context)))
        report.drop("phone_codes", len(source.rows("phone_codes")))
        return report

    def first_user(self, source: VersionFourSource, map: MoveMap) -> int | None:
        users = source.rows("users")
        return map.new_id("users", users[0]["id"]) if users else None

    def windows(self, text: str) -> list[str]:
        try:
            panes = json.loads(text)["panes"]
            views = [view for pane in panes.values() for view in pane["tabs"]]
        except (ValueError, KeyError, TypeError, AttributeError):
            return []
        return [VIEW_WINDOWS.get(view, f"{ABSENT_PREFIX}{view}") for view in views]

    def insert(self, rows: RowInsert, row: sqlite3.Row, windows: list[str], person: int, environment_id: int, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        return rows.insert("viewer_layouts", {"environment_id": environment_id, "person_id": person, "creator_id": creator_id, "suite": SUITE,
                                              "page": LAYOUT_PAGES[row["key"]], "driver": "", "layout": json.dumps(stored_layout(LayoutTabs(tuple(windows), windows[0]))),
                                              "created_at": created, "updated_at": row["updated_at"] or created})
