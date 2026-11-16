from collections.abc import Sequence

from engine.database.schema_column import SchemaColumn
from engine.errors.refusal import Refusal
from core.modules.agents.support.column_sets import ColumnSets
from core.modules.agents.support.reference_columns import FOLD_TABLES, POLYMORPHIC_PAIRS

AGENT_COLUMN_SUFFIX = "agent_id"
AGENT_COLUMN_NAMES = ("helper_id", "asker_id", "receiver_id")
ACTOR_COLUMN_NAMES = ("actor_id", "creator_id", "holder_id", "person_id", "author_id", "requester_id", "retiring_actor_id", "lifter_id")
AGENT_KEY_COLUMNS = (("agents", "parent_id"), ("asks", "parent_id"), ("reviewers", "id"))
AGENT_WORD_COLUMNS = (("agent_lines", "wakes_agent"), ("aliases", "agent_access"), ("context_compaction_notices", "agent_number"),
                 ("trigger_action_runs", "notify_agent"))
TEXT_ENDINGS = ("_at", "_count", "_name", "_text", "_reason", "_key", "_json", "_access")


class ColumnRule:
    """Says of every column of the live schema whether it holds an agent's id or an actor's: a column that
    references agents, or whose name says agent, holds an agent id and may not reference actors; every other
    column that references actors holds an actor id; a column that breaks the rule, or one that looks like an
    agent's but is in neither set, is refused."""

    @staticmethod
    def sets(schema: Sequence[SchemaColumn]) -> ColumnSets:
        columns = [column for column in schema if column.table not in FOLD_TABLES]
        agent = tuple(sorted((column.table, column.column) for column in columns if ColumnRule.is_agent_column(column)))
        actor = tuple(sorted((column.table, column.column) for column in columns
                             if not ColumnRule.is_agent_column(column) and column.target in ("actors", "agents")))
        table_columns = {table: {column.column for column in columns if column.table == table} for table in {column.table for column in columns}}
        pairs = tuple(sorted((table, model, row_id) for table, names in table_columns.items() for model, row_id in POLYMORPHIC_PAIRS
                             if model in names and row_id in names))
        ColumnRule.check(columns)
        return ColumnSets(agent, actor, pairs)

    @staticmethod
    def is_agent_column(column: SchemaColumn) -> bool:
        if (column.table, column.column) in AGENT_WORD_COLUMNS or column.column in ACTOR_COLUMN_NAMES:
            return False
        return (column.target == "agents" or column.column.endswith(AGENT_COLUMN_SUFFIX) or column.column in AGENT_COLUMN_NAMES
                or (column.table, column.column) in AGENT_KEY_COLUMNS)

    @staticmethod
    def check(columns: Sequence[SchemaColumn]) -> None:
        broken = [f"{column.table}.{column.column}" for column in columns if ColumnRule.is_agent_column(column) and column.target == "actors"]
        broken += [f"{column.table}.{column.column}" for column in columns if column.column in ACTOR_COLUMN_NAMES and column.target == "agents"]
        unplaced = [f"{column.table}.{column.column}" for column in columns
                    if "agent" in column.column and not ColumnRule.is_agent_column(column) and (column.table, column.column) not in AGENT_WORD_COLUMNS
                    and column.target is None and not column.column.endswith(TEXT_ENDINGS)]
        if broken or unplaced:
            raise Refusal(f"these columns break the column rule: {', '.join(broken + unplaced)}", "name it in ColumnRule")
