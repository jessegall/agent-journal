import re

from events import Fact
from events.agents import AgentReported
from events.put_off_work import WorkDeferred
from receiving import Listener
from resources.base import AGENT
from resources.types import AgentRow, Todo
from serving import Providers, ReadRows

DEFERS = re.compile(r"\b(I'?ll (do|get to|come back to|handle|look at) (that|it|this)|after this|once (the|this|that) \w+ (is|are|finishes|lands)|next,? I'?ll|later on|I'?ll come back"
                    r"|(?:dat|dit|het) doe ik (?:straks|later|daarna)|ik doe (?:dat|dit|het) (?:straks|later|daarna)|(?:daar|hier|er) kom ik (?:straks |later )?op terug"
                    r"|ik kom (?:er|hier|daar) (?:straks |later )?op terug|hierna|na dit|zodra (?:de|het|dit|dat) \w+ (?:klaar|binnen|er) is|daarna doe ik)\b", re.IGNORECASE)
SINCE = 600


def parked_since(todos: ReadRows[Todo], when: float) -> bool:
    return any(todo.seen[:1] == [AGENT] and todo.created >= when for todo in todos.rows.every())


class SpotDeferredWork(Listener[AgentReported]):
    def listen(self, event: AgentReported, providers: Providers, agents: ReadRows[AgentRow], todos: ReadRows[Todo]) -> list[Fact]:
        row = agents.peek(event.agent)
        text = providers.last_said(row)
        found = DEFERS.search(text) if text else None
        if not found or parked_since(todos, float(row.at) - SINCE):
            return []
        return [WorkDeferred(agent=event.agent, words=found.group(0)).due()]
