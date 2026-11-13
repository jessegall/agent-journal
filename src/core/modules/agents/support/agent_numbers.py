from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import MAIN_NUMBER, MAIN_ROLE, Agent
from core.modules.agents.support.fold_record import FoldRecord

FIRST_NON_MAIN_NUMBER = 2


class AgentNumbers:
    """Chooses the number of a new agent inside its environment. A main agent takes 1 while no agent has it. Any
    other agent takes the highest number of the environment plus one, retired and folded agents counted, and
    never 1."""

    def __init__(self, queries: Queries, scopes: Scopes, folds: FoldRecord) -> None:
        self.queries, self.scopes, self.folds = queries, scopes, folds

    def next_number(self, environment_id: int | None, role: str) -> int:
        with self.scopes.opened(None, environment_id):
            agents = self.queries.query(Agent).with_removed()
            if role == MAIN_ROLE and not agents.filter(number=MAIN_NUMBER).exists():
                return MAIN_NUMBER
            highest = agents.descending("number").first()
            folded = self.folds.highest_number()
        numbers = [number for number in (None if highest is None else highest.number, folded) if number is not None]
        return max([FIRST_NON_MAIN_NUMBER, *(number + 1 for number in numbers)])
