from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import MAIN_NUMBER, MAIN_ROLE, Agent

FIRST_OTHER_NUMBER = 2


class AgentNumbers:
    """Chooses the number of a new agent inside its environment. A main agent takes 1 while no agent has it.
    Any other agent takes the highest number of the environment plus one, retired agents counted, and never 1."""

    def __init__(self, queries: Queries, scopes: Scopes) -> None:
        self.queries, self.scopes = queries, scopes

    def next_number(self, environment_id: int | None, role: str) -> int:
        with self.scopes.opened(None, environment_id):
            agents = self.queries.query(Agent).with_removed()
            if role == MAIN_ROLE and not agents.filter(number=MAIN_NUMBER).exists():
                return MAIN_NUMBER
            highest = agents.descending("number").first()
        return FIRST_OTHER_NUMBER if highest is None else max(FIRST_OTHER_NUMBER, highest.number + 1)
