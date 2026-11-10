from engine.query.queries import Queries
from engine.scope.environment_scope import EnvironmentScope
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import MAIN_NUMBER, MAIN_ROLE, Agent

FIRST_OTHER_NUMBER = 2


class AgentNumbers:
    """Gives a new agent its number inside its environment. A main agent takes 1 while no agent has it; any
    other agent takes the number after the highest one ever given, and never 1. A number is not given twice,
    also not after its agent is retired."""

    def __init__(self, queries: Queries, scopes: Scopes) -> None:
        self.queries, self.scopes = queries, scopes

    def next_number(self, environment_id: int, role: str) -> int:
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            agents = self.queries.query(Agent).with_removed().filter(environment_id=environment_id)
            if role == MAIN_ROLE and not agents.filter(number=MAIN_NUMBER).exists():
                return MAIN_NUMBER
            highest = agents.descending("number").first()
        return FIRST_OTHER_NUMBER if highest is None else max(FIRST_OTHER_NUMBER, highest.number + 1)
