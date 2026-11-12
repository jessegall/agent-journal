from engine.query.conditions.among import Among
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.conditions.equal import Equal
from engine.query.conditions.exists import Exists
from engine.query.enums.sql_function import SqlFunction
from engine.query.expressions.aliased import Aliased
from engine.query.expressions.column import Column
from engine.query.expressions.concat import Concat
from engine.query.expressions.function_call import FunctionCall
from engine.query.expressions.literal import Literal
from engine.query.expressions.scalar_subselect import ScalarSubselect
from engine.query.select import Select

PERSON_WAIT_TYPES = ("help_request", "answer")


def wait_targets() -> Select:
    return Select("wait_targets").matching(ColumnCompare("wait_targets.wait_id", "=", "waits.id"))


TARGETS = ScalarSubselect(wait_targets().selecting(FunctionCall(SqlFunction.GROUP_CONCAT, [
    Concat([Column("wait_targets.row_table"), Literal(":"), Column("wait_targets.row_id")]), Literal(", ")])))

WAITING_ROWS_SELECT = Select("waits").selecting(
    *(Column(f"waits.{name}") for name in ("id", "focus", "state", "opened_at")),
    Aliased(FunctionCall(SqlFunction.COALESCE, [TARGETS, Literal("")]), "targets"),
).matching(Equal("waits.state", "open")).matching(AnyOf([
    Among("waits.type", PERSON_WAIT_TYPES), Exists(wait_targets().matching(Equal("wait_targets.row_table", "questions")))])).view_sql()
