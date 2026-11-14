import json
import sqlite3

from engine.database.database import Database
from engine.database.row_insert import RowInsert
from engine.errors.refusal import Refusal
from core.modules.sequences.models.support.sequence_guards import SequenceGuards
from core.modules.sequences.models.support.sequence_triggers import SequenceTriggers
from engine.upgrade.creator_resolver import CreatorResolver
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_source import VersionFourSource
from core.modules.sequences.upgrade.version_four_step import VersionFourStep

TABLE = "sequences"
RENAMED_EVENTS = {"plan.review_started": "review.assign"}
TRIGGER_ROW_PREFIX = "trigger:"


class SequencesMove(VersionFourMove):
    """Carries version 4's sequences with their numbers, each step as its title and its instructions, with
    their
    triggers and each step's edit hold and allowed commands; a record's moment becomes version 5's event. A
    sequence
    whose triggers or guards do not read is skipped and told, since one such row would fail every read of them
    all."""

    name = "sequences"
    reads = [TABLE]
    id_modules = ["journal.core.actors"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(TABLE):
            steps = [VersionFourStep.parsed(fields).text for fields in json.loads(row["steps"] or "[]")]
            if not steps:
                report.skip(TABLE, row["id"], "it has no step")
                continue
            problem = self.problem(row)
            if problem:
                report.skip(TABLE, row["id"], problem)
                continue
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: self.insert(rows, row, steps, creators.actor_id(row["creator"]), context)))
            for event_name in self.dead_events(row):
                report.note(f"sequence {row['id']}, {row['title']}, starts on {event_name}, which no longer happens: give it a new trigger")
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, steps: list[str], creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        return rows.insert(TABLE, {"id": row["id"], "creator_id": creator_id, "title": row["title"], "steps": json.dumps(steps), "triggers": json.dumps(self.triggers(row)), "step_guards": json.dumps(self.guards(row)),
                                   "created_at": created, "updated_at": row["updated_at"] or created})

    def problem(self, row: sqlite3.Row) -> str | None:
        try:
            SequenceTriggers.parsed(json.dumps(self.triggers(row)))
            SequenceGuards.parsed(json.dumps(self.guards(row)))
        except Refusal as refusal:
            return refusal.reason
        return None

    @staticmethod
    def triggers(row: sqlite3.Row) -> list[dict[str, object]]:
        moved: list[dict[str, object]] = []
        for trigger in json.loads(row["triggers"] or "[]"):
            event_name = trigger.pop("moment", "")
            moved.append({**trigger, "event": RENAMED_EVENTS.get(event_name, event_name.replace(".created", ".create"))} if event_name else trigger)
        return moved

    def dead_events(self, row: sqlite3.Row) -> list[str]:
        return [str(trigger["event"]) for trigger in self.triggers(row) if str(trigger.get("event", "")).startswith(TRIGGER_ROW_PREFIX)]

    @staticmethod
    def guards(row: sqlite3.Row) -> list[dict[str, object]]:
        return [{"file_edits_allowed": fields.get("file_edits_allowed", True), "allowed_commands": fields.get("allowed_commands", [])} for fields in json.loads(row["steps"] or "[]")]
