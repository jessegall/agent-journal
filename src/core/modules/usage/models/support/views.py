from engine.module.driver_entries import DRIVERS_MODULE
from engine.query.conditions.condition import Condition
from engine.query.condition_join import ConditionJoin
from engine.query.conditions.conjunction import Conjunction
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.conditions.equal import Equal
from engine.query.conditions.exists import Exists
from engine.query.conditions.greater import Greater
from engine.query.conditions.has_value import HasValue
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.enums.comparison_operator import ComparisonOperator
from engine.query.enums.sql_function import SqlFunction
from engine.query.expressions.aliased import Aliased
from engine.query.expressions.case_expression import CaseExpression
from engine.query.expressions.column import Column
from engine.query.expressions.comparison import Comparison
from engine.query.expressions.count_all import CountAll
from engine.query.expressions.expression import Expression
from engine.query.expressions.function_call import FunctionCall
from engine.query.expressions.inlined import Inlined
from engine.query.expressions.json_object import JsonObject
from engine.query.expressions.literal import Literal
from engine.query.expressions.scalar_subselect import ScalarSubselect
from engine.query.select import Select
from core.modules.drivers.support.current_context_window import COMPACTION_ENDED_AT
from core.modules.assignments.models.support.views import assigned_actor, assigned_row_ids

AGENT_COLUMNS = ("id", "number", "environment_id", "session", "role", "access", "program", "program_model", "profile", "given_name", "paused_at",
                 "usage_limit_ends_at", "ended_at", "retired_at", "retirement_reason")
LISTED_COLUMNS = ("id", "title", "state")
COMPACTION_PATH = f'$."{DRIVERS_MODULE}".{COMPACTION_ENDED_AT}'
TASK_ACTOR = assigned_actor("task", "tasks.id")


def empty_fallback(expression: Expression) -> FunctionCall:
    return FunctionCall(SqlFunction.COALESCE, [expression, Literal("")])


# The rows of a table that belong to the agent of the outer row by their session_agent_id.
def agent_rows(table: str) -> Select:
    return Select(table).matching(ColumnCompare(f"{table}.session_agent_id", "=", "agents.id"))


def row_count(select: Select) -> ScalarSubselect:
    return ScalarSubselect(select.selecting(CountAll()))


def holder_started_tasks() -> Select:
    return Select("tasks").matching(ColumnCompare("tasks.holder_id", "=", "agents.id")).matching(Equal("tasks.state", "started")).ordered("tasks.id", True).sliced(1, 0)


# One part of the tasks an agent card lists, with its closed time as text and the part it belongs to.
def listed_tasks(part: int, condition: Condition) -> Select:
    return Select("tasks").selecting(*(Column(f"tasks.{name}") for name in LISTED_COLUMNS), Aliased(empty_fallback(Column("tasks.closed_at")), "closed_at"),
                                     Aliased(Literal(part), "part")).matching(condition)


def running_window(expression: Expression) -> CaseExpression:
    return CaseExpression([(IsNull("agents.ended_at"), empty_fallback(expression))], Literal(""))


OPEN_BLOCKS = agent_rows("agent_blocks").matching(IsNull("agent_blocks.closed_at"))
BLOCKED_TASKS = Conjunction([Comparison(Column("agents.role"), ComparisonOperator.UNEQUAL, Literal("main")), ColumnCompare("tasks.holder_id", "=", "agents.id"),
                    Comparison(FunctionCall(SqlFunction.COALESCE, [TASK_ACTOR, Literal(0)]), ComparisonOperator.UNEQUAL, Column("agents.id"))])
MAIN_STARTED = Conjunction([Equal("agents.role", "main"), Comparison(Column("tasks.id"), ComparisonOperator.EQUAL, ScalarSubselect(
    Select("tasks").named_as("started").selecting(Column("started.id")).matching(ColumnCompare("started.holder_id", "=", "agents.id"))
    .matching(Equal("started.state", "started")).ordered("started.id", True).sliced(1, 0)))])
LISTED = (listed_tasks(0, BLOCKED_TASKS).union(listed_tasks(0, MAIN_STARTED))
          .union(listed_tasks(1, SubqueryMatch("tasks.id", assigned_row_ids("task", "agents.id")))).ordered("part", False).ordered("id", False))
CARD_TASKS = ScalarSubselect(
    Select("listed").reading(ScalarSubselect(LISTED)).named_as("listed")
    .selecting(FunctionCall(SqlFunction.JSON_GROUP_ARRAY, [JsonObject({
        "id": Column("listed.id"), "title": Column("listed.title"), "state": Column("listed.state"), "closed_at": Column("listed.closed_at"),
        "plan_id": Column("task_plan.id"), "plan_title": Column("task_plan.title")})]))
    .joined(ConditionJoin("phase_tasks", is_outer=True, condition=ColumnCompare("phase_tasks.task_id", "=", "listed.id")))
    .joined(ConditionJoin("phases", is_outer=True, condition=ColumnCompare("phases.id", "=", "phase_tasks.phase_id")))
    .joined(ConditionJoin("plans", is_outer=True, condition=ColumnCompare("task_plan.id", "=", "phases.plan_id"), alias="task_plan")))
AGENT_REPORTS = (agent_rows("messages").matching(Equal("messages.type", "agent")).matching(Equal("messages.is_chat_visible", 0)))
LAST_REPORT = ScalarSubselect(AGENT_REPORTS.selecting(Column("messages.text")).matching(ColumnCompare("messages.creator_id", "=", "agents.id"))
                              .ordered("messages.id", True).sliced(1, 0))
LAST_RETURN = ScalarSubselect(Select("helper_jobs").named_as("latest").selecting(Column("latest.returned"))
                              .matching(ColumnCompare("latest.helper_id", "=", "agents.id")).ordered("latest.id", True).sliced(1, 0))
FIRST_JOB = ScalarSubselect(Select("helper_jobs").selecting(FunctionCall(SqlFunction.MIN, [Column("helper_jobs.id")]))
                            .matching(ColumnCompare("helper_jobs.helper_id", "=", "agents.id")))
CURRENT_JOB = ScalarSubselect(Select("helper_jobs").selecting(Column("id")).matching(ColumnCompare("helper_id", "=", "agents.id"))
                              .ordered(Inlined(IsNull("ended_at")).text(), True).ordered("id", True).sliced(1, 0))


def job_text(table: str, column: str, name: str) -> Aliased:
    return Aliased(empty_fallback(Column(f"{table}.{column}")), name)


AGENT_CARDS_SELECT = Select("agents").selecting(
    *(Column(f"agents.{name}") for name in AGENT_COLUMNS),
    Aliased(ScalarSubselect(holder_started_tasks().selecting(Column("tasks.id"))), "started_task_id"),
    Aliased(empty_fallback(ScalarSubselect(holder_started_tasks().selecting(Column("tasks.title")))), "started_task_title"),
    Aliased(CARD_TASKS, "tasks"),
    Aliased(running_window(ScalarSubselect(OPEN_BLOCKS.selecting(FunctionCall(SqlFunction.MIN, [Column("agent_blocks.created_at")])))), "block_started_at"),
    Aliased(running_window(ScalarSubselect(OPEN_BLOCKS.selecting(Column("agent_blocks.nudge_text")).ordered("agent_blocks.id", False).sliced(1, 0))), "block_reason"),
    Aliased(Inlined(Conjunction([IsNull("agents.ended_at"), Exists(Select("tasks").matching(ColumnCompare("tasks.holder_id", "=", "agents.id"))
                                                            .matching(Equal("tasks.state", "blocked")))])), "task_blocked"),
    Aliased(empty_fallback(ScalarSubselect(agent_rows("hook_calls").selecting(Column("hook_calls.created_at")).ordered("hook_calls.id", True).sliced(1, 0))),
            "last_activity"),
    job_text("dispatch", "program_model", "job_model"), job_text("dispatch", "profile", "job_profile"),
    job_text("dispatch", "description", "job_description"), job_text("dispatch", "instruction", "job_instruction"),
    job_text("current_job", "description", "helper_job_description"), job_text("current_job", "brief", "helper_job_brief"),
    job_text("current_job", "title", "helper_job_title"),
    Aliased(FunctionCall(SqlFunction.COALESCE, [FunctionCall(SqlFunction.NULLIF, [Column("current_job.program"), Literal("")]), Column("agents.program")]),
            "helper_job_program"),
    Aliased(Column("current_job.new_session"), "helper_job_new_session"),
    Aliased(Inlined(Exists(Select("helper_jobs").matching(ColumnCompare("helper_jobs.helper_id", "=", "agents.id")).matching(HasValue("helper_jobs.started_at")).matching(IsNull("helper_jobs.ended_at")))), "is_helper_job_open"),
    Aliased(FunctionCall(SqlFunction.JSON_EXTRACT, [Column("agents.metadata"), Literal(COMPACTION_PATH)]), "compaction_ended_at"),
    Aliased(row_count(agent_rows("agent_sessions")), "session_count"),
    Aliased(ScalarSubselect(agent_rows("agent_sessions").selecting(Column("agent_sessions.end_reason"))
                            .matching(ColumnCompare("agent_sessions.session", "!=", "agents.session")).ordered("agent_sessions.id", True).sliced(1, 0)),
            "replaced_session_end_reason"),
    Aliased(row_count(Select("memories").matching(ColumnCompare("memories.environment_id", "=", "agents.environment_id"))
                     .matching(ColumnCompare("memories.agent_id", "=", "agents.id")).matching(Equal("memories.state", "active"))
                     .matching(Greater("memories.weight", 0))), "memory_count"),
    Aliased(row_count(AGENT_REPORTS), "report_count"),
    Aliased(ScalarSubselect(Select("actors").selecting(Column("actors.name")).matching(ColumnCompare("actors.id", "=", "agents.retiring_actor_id"))),
            "retiring_actor_name"),
    Aliased(FunctionCall(SqlFunction.COALESCE, [LAST_REPORT, LAST_RETURN, Literal("")]), "job_returned"),
).joined(ConditionJoin("helper_jobs", is_outer=True, condition=Comparison(Column("dispatch.id"), ComparisonOperator.EQUAL, FIRST_JOB), alias="dispatch")).joined(
    ConditionJoin("helper_jobs", is_outer=True, condition=Comparison(Column("current_job.id"), ComparisonOperator.EQUAL, CURRENT_JOB), alias="current_job")).view_sql()

AGENT_LISTING_SELECT = Select("agent_cards").selecting(
    Column("agent_cards.*"), *(Column(f"agents.{name}") for name in ("parent_id", "created_at", "updated_at", "process_started_at")),
).joined(ConditionJoin("agents", condition=ColumnCompare("agents.id", "=", "agent_cards.id"))).view_sql()

AGENT_FILTER_OPTIONS_SELECT = Select("agents").selecting(
    Column("environment_id"),
    Aliased(FunctionCall(SqlFunction.JSON_GROUP_ARRAY, [Column("role")], distinct=True), "roles"),
    Aliased(FunctionCall(SqlFunction.JSON_GROUP_ARRAY, [Column("profile")], distinct=True), "profiles"),
).grouped("environment_id").view_sql()

AGENT_COUNTS_SELECT = Select("agents").selecting(
    Column("environment_id"), Column("role"), Column("profile"), Aliased(CountAll(), "kept"),
    Aliased(FunctionCall(SqlFunction.SUM, [CaseExpression([(IsNull("ended_at"), Literal(1))], Literal(0))]), "running"),
).matching(IsNull("retired_at")).grouped("environment_id", "role", "profile").view_sql()
