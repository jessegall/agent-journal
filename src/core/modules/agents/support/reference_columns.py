from collections.abc import Sequence
from dataclasses import dataclass

from engine.database.schema_columns import SchemaColumn
from engine.errors.refusal import Refusal

AGENT_TABLES = ("agents", "actors")
ROW_KEY = "id"
AGENT_COLUMN_NAMES = ("actor_id", "holder_id", "delegated_to", "creator_id", "parent_id", "session_agent_id", "agent_id", "survivor_id",
                      "folded_agent_id", "lifter_id", "sender_id", "assignee_id", "owner_id", "worker_id", "launch_agent_id", "test_agent_id")
AGENT_COLUMN_SUFFIX = "_agent_id"
POLYMORPHIC_PAIRS = (("row_model", "row_id"), ("subject_model", "subject_id"), ("target_model", "target_id"), ("source_model", "source_id"),
                     ("row_table", "row_id"))
AGENT_MODEL_NAMES = ("agent", "agents", "actor", "actors")
FOLD_TABLES = ("agent_folds", "agent_fold_rows")
NOT_AGENT_COLUMNS = (("agent_lines", "wakes_agent"), ("aliases", "agent_access"), ("context_compaction_notices", "agent_number"),
                     ("helper_jobs", "new_agent_reason"), ("trigger_action_runs", "notify_agent"), ("worker_worktrees", "new_agent_reason"))


@dataclass(frozen=True)
class AgentColumns:
    """The columns of the schema that hold an agent: plain id columns, and pairs of a model column and an id
    column whose model names an agent or an actor."""

    plain: tuple[tuple[str, str], ...]
    pairs: tuple[tuple[str, str, str], ...]


class ReferenceColumns:
    """Finds every column that points at an agent: foreign keys to agents or actors, the id columns that hold an
    agent with no key, and the model and id pairs; a table holding an agent-like column it cannot place is
    refused, so a fold never misses one. The fold record's own tables are left out."""

    @staticmethod
    def agent_columns(schema: Sequence[SchemaColumn]) -> AgentColumns:
        tables = {column.table for column in schema if column.table not in FOLD_TABLES}
        by_table = {table: {column.column: column for column in schema if column.table == table} for table in tables}
        plain = tuple(sorted((column.table, column.column) for column in schema
                             if column.table in tables and ReferenceColumns.holds_agent(column)))
        pairs = tuple(sorted((table, model, row_id) for table, columns in by_table.items() for model, row_id in POLYMORPHIC_PAIRS
                             if model in columns and row_id in columns))
        ReferenceColumns.check_placed(schema, tables, plain)
        return AgentColumns(plain, pairs)

    @staticmethod
    def holds_agent(column: SchemaColumn) -> bool:
        if column.column == ROW_KEY:
            return False
        if column.target is not None:
            return column.target in AGENT_TABLES
        return column.column in AGENT_COLUMN_NAMES or column.column.endswith(AGENT_COLUMN_SUFFIX)

    @staticmethod
    def check_placed(schema: Sequence[SchemaColumn], tables: set[str], plain: tuple[tuple[str, str], ...]) -> None:
        unplaced = [f"{column.table}.{column.column}" for column in schema
                    if column.table in tables and "agent" in column.column and (column.table, column.column) not in plain and (column.table, column.column) not in NOT_AGENT_COLUMNS
                    and column.target is None and not column.column.endswith(("_at", "_count", "_name", "_text"))]
        if unplaced:
            raise Refusal(f"the fold cannot place these agent-like columns: {', '.join(unplaced)}", "name each one in ReferenceColumns as an agent column or as not one")
