from collections.abc import Sequence

from engine.database.id_columns import AGENT_MODEL_NAMES, FOLD_TABLES, POLYMORPHIC_PAIRS, IdColumns
from engine.database.schema_column import SchemaColumn
from core.modules.agents.support.agent_columns import AgentColumns

OWN_ACTOR_COLUMN = ("agents", "actor_id")

__all__ = ["AGENT_MODEL_NAMES", "FOLD_TABLES", "POLYMORPHIC_PAIRS", "ReferenceColumns"]


class ReferenceColumns:
    """The columns the fold of main agents rewrites: every column that holds an agent's id, as the engine's
    IdColumns finds them, except an agent row's own actor_id, which is its id and goes with its row."""

    @staticmethod
    def agent_columns(schema: Sequence[SchemaColumn]) -> AgentColumns:
        found = IdColumns.found(schema)
        return AgentColumns(tuple(column for column in found.plain if column != OWN_ACTOR_COLUMN), found.pairs)
