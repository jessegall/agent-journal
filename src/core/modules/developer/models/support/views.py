from engine.query.condition_join import ConditionJoin
from engine.query.conditions.any_of import AnyOf
from engine.query.enums.comparison_operator import ComparisonOperator
from engine.query.enums.sql_function import SqlFunction
from engine.query.expressions.aliased import Aliased
from engine.query.expressions.case_when import CaseWhen
from engine.query.expressions.cast_integer import CastInteger
from engine.query.expressions.column import Column
from engine.query.expressions.comparison import Comparison
from engine.query.expressions.concat import Concat
from engine.query.expressions.expression import Expression
from engine.query.expressions.function_call import FunctionCall
from engine.query.expressions.json_each import JsonEach
from engine.query.expressions.json_path import JsonPath
from engine.query.expressions.lag import Lag
from engine.query.expressions.literal import Literal
from engine.query.expressions.scalar_subselect import ScalarSubselect
from engine.query.expressions.subtraction import Subtraction
from engine.query.order import Order
from engine.query.select import Select

BOOKKEEPING_EVENTS = ("process part-start %", "process part-end %", "process end %", "process start %", "process sandbox %")


# The value at a path of the request's JSON payload.
def payload(path: str, column: str = "payload") -> FunctionCall:
    return FunctionCall(SqlFunction.JSON_EXTRACT, [Column(column), Literal(path)])


def first_value(*expressions: Expression) -> FunctionCall:
    return FunctionCall(SqlFunction.COALESCE, list(expressions))


def role_equals(role: str) -> Comparison:
    return Comparison(payload("$.role"), ComparisonOperator.EQUAL, Literal(role))


def text_part(start: int, length: Expression) -> FunctionCall:
    return FunctionCall(SqlFunction.SUBSTR, [payload("$.received_at"), Literal(start), length])


EVENT = payload("$.body.event")
EVENT_TEXT = first_value(EVENT, Literal(""))
SPACE_AT = FunctionCall(SqlFunction.INSTR, [EVENT, Literal(" ")])
EVENT_NAME = first_value(EVENT, payload("$.body.hook_event_name"), Literal("hook"))
DAY = text_part(1, Literal(10))
AGENT = payload("$.agent")
HELPER_LABEL = ScalarSubselect(
    Select("registry").selecting(Concat([payload("$.label", "value"), CaseWhen(
        [(Comparison(first_value(AGENT, Literal("")), ComparisonOperator.UNEQUAL, Literal("")), Concat([Literal(" "), AGENT]))], Literal(""))]))
    .joined(ConditionJoin(JsonEach(Column("registry.entries"), "$.helper_types")))
    .matching(Comparison(payload("$.key", "value"), ComparisonOperator.EQUAL, payload("$.role"))))

HOOK_REQUEST_ROWS_SELECT = Select("hook_requests").selecting(
    Column("id"),
    Aliased(payload("$.received_at"), "received_at"),
    Aliased(payload("$.program"), "program"),
    Aliased(CastInteger(first_value(FunctionCall(SqlFunction.NULLIF, [AGENT, Literal("")]), Literal("0"))), "agent_id"),
    Aliased(CaseWhen([(role_equals("viewer"), Literal("viewer")), (role_equals("cli"), Literal("command line"))], Literal("hook")), "category"),
    Aliased(CaseWhen([
        (AnyOf([Comparison(Concat([EVENT_TEXT, Literal(" ")]), ComparisonOperator.LIKE, Literal(event)) for event in BOOKKEEPING_EVENTS]),
         Literal("process bookkeeping")),
        (Comparison(FunctionCall(SqlFunction.INSTR, [EVENT_TEXT, Literal(" ")]), ComparisonOperator.GREATER, Literal(0)),
         FunctionCall(SqlFunction.SUBSTR, [EVENT, Literal(1), Subtraction(SPACE_AT, Literal(1))])),
    ], EVENT_NAME), "family"),
    Aliased(JsonPath(Column("payload"), "$.headers"), "headers_json"),
    Aliased(JsonPath(Column("payload"), "$.body"), "body_json"),
    Aliased(payload("$.duration_ms"), "duration_ms"),
    Aliased(first_value(payload("$.queued_ms"), Literal(0)), "queued_ms"),
    Aliased(CastInteger(first_value(payload('$.headers."X-Journal-Retries"'), Literal(0))), "retries"),
    Aliased(CaseWhen([(role_equals("viewer"), Literal("Viewer")), (role_equals("cli"), Literal("Command line"))], first_value(HELPER_LABEL, Literal("Main agent"))),
            "sender"),
    Aliased(payload("$.outcome"), "outcome"),
    Aliased(EVENT_NAME, "event"),
    Aliased(first_value(payload("$.body.tool.name"), payload("$.body.tool_name"), Literal("")), "tool"),
    Aliased(first_value(FunctionCall(SqlFunction.JSON_ARRAY_LENGTH, [Column("payload"), Literal("$.body.tool.shell.parts")]), Literal(0)), "part_count"),
    Aliased(DAY, "day"),
    Aliased(text_part(12, Literal(12)), "time"),
    Aliased(Comparison(Lag(DAY, Order("id", True)), ComparisonOperator.DISTINCT, DAY), "day_start"),
).view_sql()
