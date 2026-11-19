import json

from engine.database.database import Database
from engine.database.id_columns import AGENT_MODEL_NAMES
from engine.database.reference_rewrite import SCHEMA_REASON
from engine.database.schema_columns import SchemaColumns
from engine.database.statement import Statement
from engine.enums.work_type import WorkType

JSON_ID_COLUMNS = (("agent_stacks", "stacked_states"),)
AGENT_WORK_TYPES = (WorkType.UNIT.value, WorkType.MAIN_AGENT_TASKS.value)


class StoredJsonIds:
    """Rewrites the actor and agent ids kept inside the JSON a step reads back, the agent stacks: a row
    reference whose model is an agent or an actor, and a piece of work named by its agent. Event data,
    metadata and texts are history and keep the ids they were written with. A column the live schema does not hold yet,
    as on an older database whose module migrations run after this one, holds no ids to rewrite."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def rewritten(self, map_table: str) -> int:
        mapping = {int(row["old_id"]): int(row["new_id"]) for row in self.database.rows(Statement(f"SELECT old_id, new_id FROM {map_table}", scan_reason=SCHEMA_REASON))}
        count = 0
        present = {(column.table, column.column) for column in SchemaColumns(self.database).columns()}
        for table, column in (pair for pair in JSON_ID_COLUMNS if pair in present):
            for row in self.database.rows(Statement(f'SELECT id, "{column}" AS stored FROM "{table}"', scan_reason=SCHEMA_REASON)):
                stored = json.loads(row["stored"])
                moved = self.moved(stored, mapping)
                if moved != stored:
                    count += self.database.update(Statement(f'UPDATE "{table}" SET "{column}" = ? WHERE id = ?', [json.dumps(moved), row["id"]]))
        return count

    def moved(self, value: object, mapping: dict[int, int]) -> object:
        if isinstance(value, list):
            return [self.moved(item, mapping) for item in value]
        if not isinstance(value, dict):
            return value
        moved = {key: self.moved(item, mapping) for key, item in value.items()}
        if moved.get("model") in AGENT_MODEL_NAMES and moved.get("row_id") in mapping:
            moved["row_id"] = mapping[moved["row_id"]]
        if moved.get("work_type") in AGENT_WORK_TYPES and moved.get("work_id") in mapping:
            moved["work_id"] = mapping[moved["work_id"]]
        return moved
