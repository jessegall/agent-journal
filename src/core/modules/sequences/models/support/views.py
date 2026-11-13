from engine.query.conditions.condition_join import ConditionJoin
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.conditions.is_null import IsNull
from engine.query.expressions.column import Column
from engine.query.select import Select

RUN_COLUMNS = ("id", "environment_id", "session_agent_id", "sequence_id")
STEP_COLUMNS = ("step_number", "step_started", "created_at")

SEQUENCE_RUN_ROWS_SELECT = Select("sequence_runs").selecting(
    *(Column(f"sequence_runs.{name}") for name in RUN_COLUMNS), Column("sequences.title"), Column("sequences.steps"),
    *(Column(f"sequence_runs.{name}") for name in STEP_COLUMNS),
).joined(ConditionJoin("sequences", condition=ColumnCompare("sequences.id", "=", "sequence_runs.sequence_id"))).matching(
    IsNull("sequence_runs.ended_at")).view_sql()
