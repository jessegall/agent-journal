from dataclasses import dataclass

from engine.enums.agent_role import AgentRole
from engine.query.conditions.equal import Equal
from engine.query.enums.sql_function import SqlFunction
from engine.query.expressions.case_expression import CaseExpression
from engine.query.expressions.column import Column
from engine.query.expressions.concat import Concat
from engine.query.expressions.function_call import FunctionCall
from engine.query.expressions.literal import Literal

MAIN_ROLE = AgentRole.MAIN.value
MAIN_NAME = "Main agent"


@dataclass(frozen=True)
class AgentName:
    """The one name of an agent: its role and its number, such as Helper 848, and Main agent for the main agent;
    a given name and a row id are never part of it. A sentence writes it in lower case (label) and a card in
    capitals (title); a view of the database builds the same name with agent_name."""

    role: str
    number: int

    @property
    def title(self) -> str:
        return MAIN_NAME if self.role == MAIN_ROLE else f"{self.role.capitalize()} {self.number}"

    @property
    def label(self) -> str:
        return self.title.lower()


# The name of the agent row an alias stands for, as the code names it: Main agent, or its role and its number, such as
# Helper 848.
def agent_name(alias: str) -> CaseExpression:
    role = Column(f"{alias}.role")
    capital = FunctionCall(SqlFunction.UPPER, [FunctionCall(SqlFunction.SUBSTR, [role, Literal(1), Literal(1)])])
    return CaseExpression([(Equal(f"{alias}.role", MAIN_ROLE), Literal(MAIN_NAME))],
                    Concat([capital, FunctionCall(SqlFunction.SUBSTR, [role, Literal(2)]), Literal(" "), Column(f"{alias}.number")]))
