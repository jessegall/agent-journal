from engine.query.condition_join import ConditionJoin
from engine.query.conditions.all_of import AllOf
from engine.query.conditions.among import Among
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.conditions.equal import Equal
from engine.query.conditions.has_value import HasValue
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.enums.comparison_operator import ComparisonOperator
from engine.query.enums.sql_function import SqlFunction
from engine.query.expressions.aliased import Aliased
from engine.query.expressions.case_when import CaseWhen
from engine.query.expressions.column import Column
from engine.query.expressions.comparison import Comparison
from engine.query.expressions.function_call import FunctionCall
from engine.query.expressions.literal import Literal
from engine.query.expressions.scalar_subselect import ScalarSubselect
from engine.query.select import Select
from core.modules.assignments.models.support.views import assigned_row_ids

QUEUE_COLUMNS = ("id", "environment_id", "session_agent_id", "line", "category", "state", "exit_code", "created_at", "started_at", "ended_at", "queued_at",
                 "is_queue_run", "slot_assigned", "plugin")
RUNNING_STATES = ("running", "background")
MAIN_RUN_CATEGORIES = ("test run", "build")
MAIN_ROLE = Equal("agents.role", "main")

PROCESS_ROWS_SELECT = Select("processes").selecting(*(Column(name) for name in ("id", "environment_id", "session_agent_id", "line", "state"))).view_sql()

RUN_TASK = ScalarSubselect(
    Select("tasks").selecting(Column("tasks.id"))
    .matching(AnyOf([ColumnCompare("tasks.holder_id", "=", "processes.session_agent_id"),
                     SubqueryMatch("tasks.id", assigned_row_ids("task", "processes.session_agent_id"))]))
    .matching(ColumnCompare("tasks.started_at", "<=", "processes.created_at")).ordered("tasks.started_at", True).ordered("tasks.id", True).sliced(1, 0))

PROCESS_QUEUE_ROWS_SELECT = Select("processes").selecting(
    *(Column(f"processes.{name}") for name in QUEUE_COLUMNS),
    Aliased(Comparison(Column("agents.role"), ComparisonOperator.EQUAL, Literal("main")), "is_main"),
    Aliased(FunctionCall(SqlFunction.COALESCE, [Column("processes.owner_agent_id"), CaseWhen(
        [(Comparison(Column("agents.role"), ComparisonOperator.NOT_EQUAL, Literal("main")), Column("agents.id"))])]), "owner_agent_id"),
    Aliased(FunctionCall(SqlFunction.COALESCE, [Column("processes.task_id"), RUN_TASK]), "task_id"),
    Aliased(CaseWhen([(Among("processes.state", RUNNING_STATES, negated=True), Literal("recent")), (HasValue("processes.queued_at"), Literal("waiting"))],
                     Literal("running")), "section"),
).joined(ConditionJoin("agents", condition=ColumnCompare("agents.id", "=", "processes.session_agent_id"))).matching(
    AnyOf([Equal("processes.is_queue_run", 1), AllOf([MAIN_ROLE, Among("processes.category", MAIN_RUN_CATEGORIES)])])).view_sql()
