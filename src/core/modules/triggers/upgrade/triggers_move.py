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
from core.base.upgrade.version_four_source import VersionFourSource
from core.modules.triggers.models.enums.trigger_action import TriggerAction
from core.modules.triggers.models.trigger import TEXT_LIMIT_CHARACTERS

TABLE = "triggers"
ACTIONS = {member.value for member in TriggerAction}


class TriggersMove(VersionFourMove):
    """Carries version 4's triggers with their numbers: phrases and action, and for a scheduled one its
    next time, interval, cron line, end and limit; a scheduled trigger with no next time is over and
    moves struck. A trigger with no text, a text too long, an action version 5 does not know, or neither
    a phrase nor a time is skipped and told."""

    name = "triggers"
    reads = [TABLE]
    id_modules = ["journal.core.actors"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(TABLE):
            problem = self.problem(row)
            if problem:
                report.skip(TABLE, row["id"], problem)
            else:
                report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, partial(self.insert, rows, row, creators.actor_id(row["creator"]), context)))
        return report

    def problem(self, row: sqlite3.Row) -> str:
        text = row["text"] or ""
        if not 1 <= len(text) <= TEXT_LIMIT_CHARACTERS:
            return f"its text is {len(text)} characters, and a trigger's is 1 to {TEXT_LIMIT_CHARACTERS}"
        if (row["action"] or TriggerAction.NUDGE.value) not in ACTIONS:
            return f"its action {row['action']} is none of {', '.join(sorted(ACTIONS))}"
        if not self.phrases(row) and not row["is_scheduled"]:
            return "it has no phrase and no time"
        return ""

    def phrases(self, row: sqlite3.Row) -> list[str]:
        try:
            phrases = json.loads(row["phrases"] or "[]")
        except ValueError:
            return []
        return [phrase for phrase in phrases if isinstance(phrase, str)] if is_list(phrases) else []

    def insert(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        updated = row["updated_at"] or created
        scheduled = bool(row["is_scheduled"])
        return rows.insert(TABLE, {"id": row["id"], "creator_id": creator_id, "phrases": json.dumps(self.phrases(row)), "action": row["action"] or TriggerAction.NUDGE.value,
                                   "text": row["text"], "next_at": row["next_at"] if scheduled else None, "interval_minutes": row["interval_minutes"] or None,
                                   "cron_line": row["cron_line"] or "", "end_at": row["end_at"], "fire_limit": row["fire_limit"] or None,
                                   "fired_count": row["fired_count"] or 0, "ended_at": updated if scheduled and not row["next_at"] else None,
                                   "created_at": created, "updated_at": updated})
