from engine.agent.agent_name import agent_name
from engine.query.conditions.condition import Condition
from engine.query.condition_join import ConditionJoin
from engine.query.conditions.all_of import AllOf
from engine.query.conditions.among import Among
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.conditions.equal import Equal
from engine.query.conditions.excluding import Excluding
from engine.query.conditions.exists import Exists
from engine.query.conditions.has_value import HasValue
from engine.query.conditions.is_null import IsNull
from engine.query.enums.comparison_operator import ComparisonOperator
from engine.query.enums.sql_function import SqlFunction
from engine.query.expressions.aliased import Aliased
from engine.query.expressions.case_when import CaseWhen
from engine.query.expressions.cast_integer import CastInteger
from engine.query.expressions.column import Column
from engine.query.expressions.comparison import Comparison
from engine.query.expressions.concat import Concat
from engine.query.expressions.count_all import CountAll
from engine.query.expressions.expression import Expression
from engine.query.expressions.function_call import FunctionCall
from engine.query.expressions.inlined import Inlined
from engine.query.expressions.json_list import JsonList
from engine.query.expressions.json_object import JsonObject
from engine.query.expressions.literal import Literal
from engine.query.expressions.scalar_subselect import ScalarSubselect
from engine.query.select import Select
from core.modules.assignments.models.support.views import assigned_actor

UNFINISHED_STATES = ("open", "started", "blocked", "testing")
TASK_ACTOR = assigned_actor("task", "tasks.id")
DEPENDENT_ACTOR = assigned_actor("task", "dependent.id")


def is_main(table: str) -> Comparison:
    return Comparison(Column(f"{table}.role"), ComparisonOperator.EQUAL, Literal("main"))


def or_zero(expression: Expression) -> FunctionCall:
    return FunctionCall(SqlFunction.COALESCE, [expression, Literal(0)])


# Matches the agent named helper that works a task: its assigned actor, else its holder, and a main agent only when it
# is assigned the task and nobody holds it.
def task_helper_match() -> AllOf:
    task_agent = FunctionCall(SqlFunction.COALESCE, [TASK_ACTOR, Column("tasks.holder_id")])
    return AllOf([Comparison(Column("helper.id"), ComparisonOperator.EQUAL, task_agent),
                  AnyOf([Comparison(Column("helper.role"), ComparisonOperator.NOT_EQUAL, Literal("main")),
                         AllOf([Comparison(Column("helper.id"), ComparisonOperator.EQUAL, TASK_ACTOR), IsNull("tasks.holder_id")])])])


def open_task_waits() -> Select:
    return Select("task_waits").matching(ColumnCompare("task_id", "=", "tasks.id")).matching(IsNull("ended_at"))


USER_TASK_WAIT = Exists(open_task_waits().matching(Equal("target", "user")))
AUTOMATIC_TASK_WAIT = Exists(open_task_waits().matching(AnyOf([Comparison(Column("command"), ComparisonOperator.NOT_EQUAL, Literal("")),
                                                                Comparison(Column("target"), ComparisonOperator.NOT_EQUAL, Literal("user"))])))
AUTOMATIC_ONLY = Aliased(Inlined(AllOf([AUTOMATIC_TASK_WAIT, Excluding(USER_TASK_WAIT)])), "automatic")
TASK_TAGS = Aliased(ScalarSubselect(Select("words").reading(ScalarSubselect(
    Select("task_tags").selecting(Column("word")).matching(ColumnCompare("task_id", "=", "tasks.id")).ordered("word", False)))
    .selecting(JsonList(Column("word")))), "tags")


# The rows of a select as one JSON list of objects.
def json_rows(select: Select, fields: dict[str, Expression]) -> ScalarSubselect:
    return ScalarSubselect(select.selecting(FunctionCall(SqlFunction.JSON_GROUP_ARRAY, [JsonObject(fields)])))


def latest_renewal(column: str, function: SqlFunction) -> ScalarSubselect:
    return ScalarSubselect(Select("task_block_renewals").selecting(FunctionCall(function, [Column(column)])).matching(ColumnCompare("task_id", "=", "tasks.id")))


OPEN_DEPENDENCIES_SELECT = (
    Select("task_dependencies").selecting(Column("task_dependencies.id"), Column("task_dependencies.task_id"), Column("task_dependencies.dependency_id"))
    .joined(ConditionJoin("tasks", condition=ColumnCompare("tasks.id", "=", "task_dependencies.dependency_id")))
    .joined(ConditionJoin("tasks", condition=ColumnCompare("dependent.id", "=", "task_dependencies.task_id"), alias="dependent"))
    .matching(IsNull("tasks.closed_at"))
    .matching(Excluding(AllOf([Among("tasks.state", ["started", "testing"]), HasValue(TASK_ACTOR.sql()),
                               Comparison(TASK_ACTOR, ComparisonOperator.IS, DEPENDENT_ACTOR)])))
).view_sql()


def actor_value(column: str) -> ScalarSubselect:
    return ScalarSubselect(Select("actors").selecting(Column(column)).matching(Comparison(Column("actors.id"), ComparisonOperator.EQUAL, TASK_ACTOR)))


ASSIGNED_NAME = ScalarSubselect(Select("actors").selecting(CaseWhen(
    [(Equal("actors.type", "agent"), ScalarSubselect(Select("agents").selecting(agent_name("agents")).matching(ColumnCompare("agents.id", "=", "actors.id"))))],
    Column("actors.name"))).matching(Comparison(Column("actors.id"), ComparisonOperator.EQUAL, TASK_ACTOR)))
MAIN_ASSIGNEE = ScalarSubselect(Select("agents").selecting(is_main("agents")).matching(Comparison(Column("agents.id"), ComparisonOperator.EQUAL, TASK_ACTOR)))

TASK_CARDS_SELECT = Select("tasks").selecting(
    *(Column(f"tasks.{name}") for name in ("id", "environment_id", "title", "state", "priority", "complexity", "reason", "closed_at")),
    Aliased(TASK_ACTOR, "assigned_actor_id"), TASK_TAGS, AUTOMATIC_ONLY,
    Aliased(ASSIGNED_NAME, "assigned_name"), Aliased(actor_value("actors.type"), "assigned_type"), Aliased(or_zero(MAIN_ASSIGNEE), "is_main_assignee"),
).view_sql()

TASK_TAG_COUNTS_SELECT = Select("task_tags").selecting(Column("word"), Aliased(CountAll(), "count")).grouped("word").view_sql()

TASK_EDGES_SELECT = (
    Select("task_dependencies").selecting(Column("task_id"), Aliased(Column("dependency_id"), "blocker_id"))
    .union(Select("task_waits").selecting(Column("task_id"), CastInteger(FunctionCall(SqlFunction.SUBSTR, [Column("target"), Literal(7)])))
           .matching(IsNull("ended_at")).matching(Comparison(Column("target"), ComparisonOperator.LIKE, Literal("tasks:%"))), every=False)
).view_sql()

HELPER_COLUMNS = (Aliased(Column("helper.id"), "helper_id"), Aliased(agent_name("helper"), "helper_name"), Aliased(or_zero(is_main("helper")), "helper_main"))

TASK_INSPECTIONS_SELECT = Select("tasks").selecting(
    Aliased(Column("tasks.id"), "task_id"), TASK_TAGS,
    Aliased(json_rows(Select("task_dependencies").joined(ConditionJoin("tasks", condition=ColumnCompare("waited.id", "=", "task_dependencies.dependency_id"), alias="waited"))
                      .matching(ColumnCompare("task_dependencies.task_id", "=", "tasks.id")),
                      {"id": Column("waited.id"), "title": Column("waited.title"), "state": Column("waited.state")}), "waits"),
    Aliased(json_rows(Select("latest").reading(ScalarSubselect(
        Select("task_logs").selecting(Column("task_logs.id"), Column("task_logs.line"), Column("task_logs.created_at"))
        .matching(ColumnCompare("task_logs.task_id", "=", "tasks.id")).ordered("task_logs.id", True).sliced(100, 0))).named_as("latest"),
        {"id": Column("latest.id"), "line": Column("latest.line"), "created_at": Column("latest.created_at")}), "logs"),
    Aliased(json_rows(Select("task_waits").matching(ColumnCompare("task_waits.task_id", "=", "tasks.id")).matching(IsNull("task_waits.ended_at")),
                      {"id": Column("task_waits.id"), "command": Column("task_waits.command"), "target": Column("task_waits.target")}), "openers"),
    Aliased(json_rows(Select("renewal").reading(ScalarSubselect(
        Select("task_block_renewals").selecting(Column("id"), Column("reason"), Column("created_at")).matching(ColumnCompare("task_id", "=", "tasks.id"))
        .ordered("id", False))).named_as("renewal"),
        {"id": Column("renewal.id"), "reason": Column("renewal.reason"), "created_at": Column("renewal.created_at")}), "block_renewals"),
    *HELPER_COLUMNS,
).joined(ConditionJoin("agents", left=True, condition=task_helper_match(), alias="helper")).view_sql()

NEWEST_RENEWAL = latest_renewal("created_at", SqlFunction.MAX)
LAST_REVIEW_NOTICE = ScalarSubselect(Select("nudge_records").selecting(FunctionCall(SqlFunction.MAX, [Column("last_delivered_at")]))
                                     .matching(ColumnCompare("session_agent_id", "=", "agents.id"))
                                     .matching(Comparison(Column("key"), ComparisonOperator.EQUAL, Concat([Literal("tasks.block_review."), Column("tasks.id")]))))

TASK_BLOCK_REVIEWS_SELECT = Select("tasks").selecting(
    Aliased(Column("tasks.id"), "task_id"), Aliased(Column("agents.id"), "session_agent_id"), Column("tasks.environment_id"), Column("tasks.state"),
    Aliased(Column("tasks.version"), "task_version"),
    Aliased(or_zero(latest_renewal("task_version", SqlFunction.MAX)), "block_version"),
    Aliased(FunctionCall(SqlFunction.MAX, [FunctionCall(SqlFunction.COALESCE, [NEWEST_RENEWAL, Column("tasks.updated_at")]),
                                           FunctionCall(SqlFunction.COALESCE, [LAST_REVIEW_NOTICE, Literal("")])]), "reviewed_at"),
    Aliased(FunctionCall(SqlFunction.MAX, [Column("tasks.updated_at"), FunctionCall(SqlFunction.COALESCE, [NEWEST_RENEWAL, Literal("")])]), "moved_at"),
    Aliased(Inlined(USER_TASK_WAIT), "user_wait"), Aliased(Inlined(AUTOMATIC_TASK_WAIT), "automatic"),
).joined(ConditionJoin("agents", condition=AllOf([ColumnCompare("agents.environment_id", "=", "tasks.environment_id"), Equal("agents.role", "main")]))).view_sql()


def environment_count(table: str, condition: Condition) -> ScalarSubselect:
    return ScalarSubselect(Select(table).selecting(CountAll()).matching(ColumnCompare(f"{table}.environment_id", "=", "environments.id")).matching(condition))


ENVIRONMENT_CARDS_SELECT = Select("environments").selecting(
    *(Column(f"environments.{name}") for name in ("id", "name", "folder", "branch")),
    Aliased(environment_count("agents", IsNull("agents.ended_at")), "running_agent_count"),
    Aliased(environment_count("tasks", Among("tasks.state", UNFINISHED_STATES)), "unfinished_task_count"),
).matching(Equal("environments.test", 0)).view_sql()
