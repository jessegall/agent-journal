from engine.query.condition_join import ConditionJoin
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.conditions.equal import Equal
from engine.query.conditions.exists import Exists
from engine.query.conditions.has_value import HasValue
from engine.query.conditions.is_null import IsNull
from engine.query.enums.comparison_operator import ComparisonOperator
from engine.query.enums.sql_function import SqlFunction
from engine.query.expressions.aliased import Aliased
from engine.query.expressions.case_when import CaseWhen
from engine.query.expressions.column import Column
from engine.query.expressions.comparison import Comparison
from engine.query.expressions.concat import Concat
from engine.query.expressions.count_all import CountAll
from engine.query.expressions.function_call import FunctionCall
from engine.query.expressions.inlined import Inlined
from engine.query.expressions.json_object import JsonObject
from engine.query.expressions.literal import Literal
from engine.query.expressions.scalar_subselect import ScalarSubselect
from engine.query.select import Select
from engine.agent.agent_name import agent_name
from core.modules.assignments.models.support.views import assigned_actor
from core.modules.tasks.models.support.views import TASK_ACTOR, PURELY_AUTOMATIC, HELPER_COLUMNS, TASK_TAGS, is_main, json_rows, or_zero, task_helper_match

PLACE_TASK = ConditionJoin("tasks", condition=ColumnCompare("tasks.id", "=", "plan_tasks.task_id"))
PLAN_ACTOR = assigned_actor("plan", "plans.id")


# The places of the plan the outer row names.
def plan_places() -> Select:
    return Select("plan_tasks").matching(ColumnCompare("plan_tasks.plan_id", "=", "plans.id"))


def place_count(condition: Comparison) -> ScalarSubselect:
    return ScalarSubselect(plan_places().selecting(CountAll()).matching(condition))


def place_state(operator: ComparisonOperator, state: str) -> Comparison:
    return Comparison(Column("plan_tasks.state"), operator, Literal(state))


PLAN_TASKS_SELECT = Select("phase_tasks").selecting(
    Column("phase_tasks.task_id"), Column("phases.plan_id"), Column("phase_tasks.phase_id"), Aliased(Column("phases.position"), "phase_position"),
    Column("phases.checkpoint"), Column("phase_tasks.position"), Column("tasks.state"), Column("tasks.priority"), Column("tasks.closed_at"),
    Aliased(Inlined(Exists(Select("checkpoint_passes").named_as("passes").matching(ColumnCompare("passes.plan_id", "=", "phases.plan_id"))
                           .matching(ColumnCompare("passes.phase_id", "=", "phases.id")))), "checkpoint_passed"),
).joined(ConditionJoin("phases", condition=ColumnCompare("phases.id", "=", "phase_tasks.phase_id"))).joined(
    ConditionJoin("tasks", condition=ColumnCompare("tasks.id", "=", "phase_tasks.task_id"))).view_sql()

PLAN_PROGRESS_SELECT = Select("plans").selecting(
    Aliased(Column("plans.id"), "plan_id"),
    Aliased(place_count(place_state(ComparisonOperator.UNEQUAL, "cancelled")), "task_count"),
    Aliased(place_count(place_state(ComparisonOperator.EQUAL, "completed")), "completed_count"),
    Aliased(place_count(place_state(ComparisonOperator.EQUAL, "testing")), "testing_count"),
    Aliased(or_zero(ScalarSubselect(plan_places().selecting(FunctionCall(SqlFunction.MIN, [Column("plan_tasks.phase_position")]))
                                    .matching(IsNull("plan_tasks.closed_at")))), "current_phase"),
    Aliased(ScalarSubselect(plan_places().selecting(FunctionCall(SqlFunction.ROUND, [FunctionCall(SqlFunction.AVG, [Column("tasks.complexity")]), Literal(1)]))
                            .joined(PLACE_TASK).matching(place_state(ComparisonOperator.UNEQUAL, "cancelled")).matching(HasValue("tasks.complexity"))),
            "complexity"),
).view_sql()

NEWEST_TASK_CHANGE = ScalarSubselect(plan_places().selecting(FunctionCall(SqlFunction.MAX, [Column("tasks.updated_at")])).joined(PLACE_TASK))

PLAN_CARDS_SELECT = Select("plans").selecting(
    *(Column(f"plans.{name}") for name in ("id", "environment_id", "title", "state")),
    *(Column(f"plan_progress.{name}") for name in ("task_count", "completed_count", "testing_count", "current_phase", "complexity")),
    Aliased(FunctionCall(SqlFunction.MAX, [Column("plans.updated_at"), FunctionCall(SqlFunction.COALESCE, [NEWEST_TASK_CHANGE, Column("plans.updated_at")])]),
            "changed_at"),
    Aliased(json_rows(plan_places().joined(PLACE_TASK).joined(ConditionJoin("agents", condition=task_helper_match(), alias="helper"))
                         .matching(IsNull("plan_tasks.closed_at")),
                         {"id": Column("helper.id"), "name": agent_name("helper"), "main": is_main("helper"), "task_id": Column("tasks.id"),
                          "task_title": Column("tasks.title")}), "agents"),
    Aliased(json_rows(plan_places().joined(PLACE_TASK).matching(place_state(ComparisonOperator.EQUAL, "started")),
                         {"id": Column("tasks.id"), "title": Column("tasks.title")}), "working"),
    Aliased(ScalarSubselect(Select("agents").named_as("assignee")
                            .selecting(JsonObject({"id": Column("assignee.id"), "name": agent_name("assignee"), "main": is_main("assignee")}))
                            .matching(Comparison(Column("assignee.id"), ComparisonOperator.EQUAL, PLAN_ACTOR))), "assignee"),
).joined(ConditionJoin("plan_progress", condition=ColumnCompare("plan_progress.plan_id", "=", "plans.id"))).view_sql()

CANCELLED = Equal("tasks.state", "cancelled")
PLAN_EVENT_ROWS_SELECT = (
    Select("plan_tasks").selecting(
        Column("plan_tasks.plan_id"), Aliased(Concat([Literal("made:"), Column("tasks.id")]), "event_key"), Aliased(Column("tasks.created_at"), "time"),
        Aliased(Literal("made"), "event_type"), Aliased(Column("tasks.id"), "task_id"), Column("tasks.title"), Aliased(Literal(None), "text"),
    ).joined(PLACE_TASK)
    .union(Select("plan_tasks").selecting(
        Column("plan_tasks.plan_id"), Concat([Literal("ended:"), Column("tasks.id")]), Column("tasks.closed_at"),
        CaseWhen([(CANCELLED, Literal("cancelled"))], Literal("completed")), Column("tasks.id"), Column("tasks.title"),
        CaseWhen([(CANCELLED, Column("tasks.reason"))], Column("tasks.outcome")),
    ).joined(PLACE_TASK).matching(HasValue("tasks.closed_at")))
    .union(Select("task_logs").selecting(
        Column("plan_tasks.plan_id"), Concat([Literal("logged:"), Column("task_logs.id")]), Column("task_logs.created_at"), Literal("logged"),
        Column("tasks.id"), Column("tasks.title"), Column("task_logs.line"),
    ).joined(ConditionJoin("plan_tasks", condition=ColumnCompare("plan_tasks.task_id", "=", "task_logs.task_id")))
           .joined(ConditionJoin("tasks", condition=ColumnCompare("tasks.id", "=", "task_logs.task_id"))))
).view_sql()

PLAN_OUTLINE_TASKS_SELECT = Select("plan_tasks").selecting(
    *(Column(f"plan_tasks.{name}") for name in ("task_id", "plan_id", "phase_id", "phase_position", "priority", "state")),
    *(Column(f"tasks.{name}") for name in ("title", "complexity", "reason")), Aliased(TASK_ACTOR, "assignee_id"),
    TASK_TAGS, PURELY_AUTOMATIC,
    Aliased(or_zero(ScalarSubselect(Select("agents").selecting(is_main("agents")).matching(Comparison(Column("agents.id"), ComparisonOperator.EQUAL, TASK_ACTOR)))), "main_delegate"),
    *HELPER_COLUMNS,
).joined(PLACE_TASK).joined(ConditionJoin("agents", left=True, condition=task_helper_match(), alias="helper")).view_sql()
