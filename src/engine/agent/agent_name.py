from engine.query.conditions.equal import Equal
from engine.query.enums.sql_function import SqlFunction
from engine.query.expressions.case_when import CaseWhen
from engine.query.expressions.column import Column
from engine.query.expressions.concat import Concat
from engine.query.expressions.function_call import FunctionCall
from engine.query.expressions.literal import Literal

MAIN_ROLE = "main"
MAIN_NAME = "Main agent"


def agent_name(alias: str) -> CaseWhen:
    """The name of the agent row an alias stands for, as the code names it: Main agent, or its role and its number,
    such as Worker 848."""
    role = Column(f"{alias}.role")
    capital = FunctionCall(SqlFunction.UPPER, [FunctionCall(SqlFunction.SUBSTR, [role, Literal(1), Literal(1)])])
    return CaseWhen([(Equal(f"{alias}.role", MAIN_ROLE), Literal(MAIN_NAME))],
                    Concat([capital, FunctionCall(SqlFunction.SUBSTR, [role, Literal(2)]), Literal(" "), Column(f"{alias}.number")]))
