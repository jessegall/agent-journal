import json
import sqlite3

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.refusal import Refusal
from core.modules.sequences.support.sequence_guards import SequenceGuards
from core.modules.sequences.support.sequence_triggers import SequenceTriggers
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource
from core.modules.sequences.upgrade.version_four_step import VersionFourStep

TABLE = "sequences"


class SequencesMove(VersionFourMove):
    """Carries version 4's sequences with their numbers, each step as its title and its instructions, with their
    triggers and each step's edit hold and allowed commands; a record's moment takes version 5's event name. A sequence
    whose triggers or guards do not read is skipped and told, since one such row would fail every read of them all."""

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
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, steps: list[str], creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        return rows.insert(TABLE, {"id": row["id"], "creator_id": creator_id, "title": row["title"], "steps": json.dumps(steps), "triggers": json.dumps(self.triggers(row)), "step_guards": json.dumps(self.guards(row)),
                                   "created_at": created, "updated_at": row["updated_at"] or created})

    def problem(self, row: sqlite3.Row) -> str | None:
        try:
            SequenceTriggers.parsed(row["triggers"] or "[]")
            SequenceTriggers.parsed(json.dumps(self.triggers(row)))
            SequenceGuards.parsed(json.dumps(self.guards(row)))
        except Refusal as refusal:
            return refusal.reason
        return None

    @staticmethod
    def triggers(row: sqlite3.Row) -> list[dict]:
        return [{**trigger, "moment": trigger["moment"].replace(".created", ".create")} if trigger.get("moment") else trigger for trigger in json.loads(row["triggers"] or "[]")]

    @staticmethod
    def guards(row: sqlite3.Row) -> list[dict]:
        return [{"file_edits_allowed": fields.get("file_edits_allowed", True), "allowed_commands": fields.get("allowed_commands", [])} for fields in json.loads(row["steps"] or "[]")]
