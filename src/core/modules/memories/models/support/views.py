from engine.agent.agent_name import agent_name
from engine.query.condition_join import ConditionJoin
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.conditions.equal import Equal
from engine.query.conditions.greater import Greater
from engine.query.conditions.has_value import HasValue
from engine.query.enums.comparison_operator import ComparisonOperator
from engine.query.enums.sql_function import SqlFunction
from engine.query.expressions.aliased import Aliased
from engine.query.expressions.column import Column
from engine.query.expressions.comparison import Comparison
from engine.query.expressions.function_call import FunctionCall
from engine.query.expressions.literal import Literal
from engine.query.expressions.scalar_subselect import ScalarSubselect
from engine.query.select import Select

DELIVERED_AT = Column("memory_deliveries.created_at")


def state_count(state: str, name: str) -> Aliased:
    return Aliased(FunctionCall(SqlFunction.SUM, [Comparison(Column("state"), ComparisonOperator.EQUAL, Literal(state))]), name)


def or_empty(select: Select) -> FunctionCall:
    return FunctionCall(SqlFunction.COALESCE, [ScalarSubselect(select), Literal("")])


# The rows of a table of the agent a memory was delivered to.
def delivered_agent_rows(table: str) -> Select:
    return Select(table).matching(ColumnCompare(f"{table}.session_agent_id", "=", "memory_deliveries.session_agent_id"))


ACTIVE_MEMORIES_SELECT = Select("memories").selecting(
    Aliased(Column("memories.id"), "memory_id"), *(Column(f"memories.{name}") for name in ("environment_id", "agent_id", "text", "weight")),
).matching(Equal("memories.state", "active")).matching(Greater("memories.weight", 0)).view_sql()

MEMORY_COUNTS = Select("memories").selecting(Column("agent_id"), state_count("active", "active_memories"), state_count("removed", "removed_memories")).matching(
    HasValue("agent_id")).grouped("agent_id")
MEMORY_HOLDERS_SELECT = Select("agents").selecting(
    Aliased(Column("agents.id"), "agent_id"), Column("agents.environment_id"), Column("agents.role"), Aliased(agent_name("agents"), "name"),
    Aliased(Column("agents.created_at"), "started_at"), Column("agents.ended_at"), Column("counts.active_memories"), Column("counts.removed_memories"),
).joined(ConditionJoin(ScalarSubselect(MEMORY_COUNTS), condition=ColumnCompare("counts.agent_id", "=", "agents.id"), alias="counts")).view_sql()

LAST_COMPACTION = or_empty(delivered_agent_rows("hook_calls").selecting(FunctionCall(SqlFunction.MAX, [Column("hook_calls.created_at")]))
                           .matching(Equal("hook_calls.hook", "compact")))
SESSION_START = or_empty(delivered_agent_rows("agent_sessions").selecting(
    FunctionCall(SqlFunction.COALESCE, [Column("agent_sessions.started_at"), Column("agent_sessions.created_at")])).ordered("agent_sessions.id", True).sliced(1, 0))
CONTEXT_MEMORIES_SELECT = Select("memory_deliveries").selecting(
    Aliased(Column("memory_deliveries.id"), "delivery_id"),
    *(Column(f"memory_deliveries.{name}") for name in ("session_agent_id", "memory_id", "cause")),
    Aliased(DELIVERED_AT, "delivered_at"),
).matching(Comparison(DELIVERED_AT, ComparisonOperator.GREATER, LAST_COMPACTION)).matching(
    Comparison(DELIVERED_AT, ComparisonOperator.AT_LEAST, SESSION_START)).view_sql()

KEYWORD_MEMORIES_SELECT = Select("memory_keywords").selecting(
    Aliased(Column("memory_keywords.id"), "keyword_id"), Column("memory_keywords.word"), Column("active_memories.*"),
).joined(ConditionJoin("active_memories", condition=ColumnCompare("active_memories.memory_id", "=", "memory_keywords.memory_id"))).view_sql()
