from collections.abc import Sequence

from engine.database.schema_column import SchemaColumn
from engine.errors.refusal import Refusal
from engine.database.seed_tables import ID_COLUMN
from engine.database.id_column_set import IdColumnSet

AGENT_TABLES = ("agents", "actors")
AGENT_COLUMN_NAMES = ("actor_id", "holder_id", "creator_id", "parent_id", "session_agent_id", "agent_id", "survivor_id",
                      "folded_agent_id", "lifter_id", "sender_id", "assignee_id", "owner_id", "test_agent_id")
AGENT_COLUMN_SUFFIX = "_agent_id"
POLYMORPHIC_PAIRS = (("row_model", "row_id"), ("subject_model", "subject_id"), ("target_model", "target_id"), ("source_model", "source_id"),
                     ("row_table", "row_id"))
AGENT_MODEL_NAMES = ("agent", "agents", "actor", "actors")
FOLD_TABLES = ("agent_folds", "agent_fold_rows")
NON_AGENT_COLUMNS = (("agent_lines", "wakes_agent"), ("agents", "launch_agent_id"), ("aliases", "agent_access"), ("context_compaction_notices", "agent_number"),
                     ("trigger_action_runs", "notify_agent"))


class IdColumns:
    """Finds every column of the live schema that holds an actor's or an agent's id, which are one id space:
    foreign keys to agents or actors, the id columns that hold one with no key, and the model and id pairs; a
    table holding an agent-like column it cannot place is refused, so a rewrite never misses one. The fold
    record's own tables are left out."""

    @staticmethod
    def found(schema: Sequence[SchemaColumn]) -> IdColumnSet:
        tables = {column.table for column in schema if column.table not in FOLD_TABLES}
        table_columns = {table: {column.column: column for column in schema if column.table == table} for table in tables}
        plain = tuple(sorted((column.table, column.column) for column in schema
                             if column.table in tables and IdColumns.has_agent_reference(column)))
        pairs = tuple(sorted((table, model, row_id) for table, columns in table_columns.items() for model, row_id in POLYMORPHIC_PAIRS
                             if model in columns and row_id in columns))
        IdColumns.check_placed(schema, tables, plain)
        return IdColumnSet(plain, pairs)

    @staticmethod
    def has_agent_reference(column: SchemaColumn) -> bool:
        if column.column == ID_COLUMN or (column.table, column.column) in NON_AGENT_COLUMNS:
            return False
        if column.target is not None:
            return column.target in AGENT_TABLES
        return column.column in AGENT_COLUMN_NAMES or column.column.endswith(AGENT_COLUMN_SUFFIX)

    @staticmethod
    def check_placed(schema: Sequence[SchemaColumn], tables: set[str], plain: tuple[tuple[str, str], ...]) -> None:
        unplaced = [f"{column.table}.{column.column}" for column in schema
                    if column.table in tables and "agent" in column.column and (column.table, column.column) not in plain and (column.table, column.column) not in NON_AGENT_COLUMNS
                    and column.target is None and not column.column.endswith(("_at", "_count", "_name", "_text", "_reason"))]
        if unplaced:
            raise Refusal(f"the fold cannot place these agent-like columns: {', '.join(unplaced)}", "name each one in IdColumns as an id column or as not one")
