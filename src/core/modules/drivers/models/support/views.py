from engine.query.conditions.column_compare import ColumnCompare
from engine.query.conditions.equal import Equal
from engine.query.conditions.exists import Exists
from engine.query.conditions.is_null import IsNull
from engine.query.enums.comparison_operator import ComparisonOperator
from engine.query.enums.sql_function import SqlFunction
from engine.query.expressions.aliased import Aliased
from engine.query.expressions.column import Column
from engine.query.expressions.comparison import Comparison
from engine.query.expressions.function_call import FunctionCall
from engine.query.expressions.inlined import Inlined
from engine.query.expressions.literal import Literal
from engine.query.expressions.scalar_subselect import ScalarSubselect
from engine.query.select import Select

STOP_CHECKS_PATH = '$."journal.core.drivers".stop_checks'
SUITE_SETTING = "journal.core.drivers.suite"

HOOK_CALL_ROWS_SELECT = Select("hook_calls").selecting(
    *(Column(name) for name in ("id", "session_agent_id", "hook", "tool", "summary", "answer", "refusal")),
    Aliased(FunctionCall(SqlFunction.COALESCE, [FunctionCall(SqlFunction.JSON_EXTRACT, [Column("metadata"), Literal(STOP_CHECKS_PATH)]), Literal("[]")]),
            "stop_checks"),
).view_sql()

AGENT_ACTIVITIES_SELECT = Select("agents").selecting(
    *(Column(f"agents.{name}") for name in ("id", "parent_id", "created_at", "ended_at")),
    Aliased(ScalarSubselect(Select("hook_calls").selecting(Column("hook_calls.created_at"))
                            .matching(ColumnCompare("hook_calls.session_agent_id", "=", "agents.id"))
                            .matching(Comparison(Column("hook_calls.hook"), ComparisonOperator.NOT_EQUAL, Literal("tick")))
                            .ordered("hook_calls.id", True).sliced(1, 0)), "last_hook_at"),
).view_sql()

NUDGE_TOTALS_SELECT = Select("nudge_records").selecting(
    Aliased(Column("key"), "nudge_key"),
    Aliased(FunctionCall(SqlFunction.SUM, [Column("delivery_count")]), "delivery_count"),
    Aliased(FunctionCall(SqlFunction.COALESCE, [FunctionCall(SqlFunction.MAX, [Column("last_delivered_at")]), Literal("")]), "last_delivered_at"),
).grouped("key").view_sql()


# The suite a setting names, in the scope the condition picks.
def suite_setting(scope: Equal | ColumnCompare | IsNull) -> ScalarSubselect:
    return ScalarSubselect(Select("settings").selecting(FunctionCall(SqlFunction.JSON_EXTRACT, [Column("settings.value"), Literal("$")]))
                           .matching(scope).matching(Equal("settings.key", SUITE_SETTING)))


ENVIRONMENT_MENU_ROWS_SELECT = Select("environments").selecting(
    *(Column(f"environments.{name}") for name in ("id", "name", "folder", "branch")),
    Aliased(FunctionCall(SqlFunction.COALESCE, [suite_setting(ColumnCompare("settings.environment_id", "=", "environments.id")),
                                                suite_setting(IsNull("settings.environment_id")), Literal("")]), "suite_setting"),
    Aliased(Inlined(Exists(Select("agents").matching(ColumnCompare("agents.environment_id", "=", "environments.id")).matching(Equal("agents.role", "main"))
                           .matching(IsNull("agents.ended_at")))), "main_running"),
).matching(Equal("environments.test", 0)).view_sql()
