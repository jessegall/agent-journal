from journal.models.agent import Agent
from journal.repositories.entries import Entries
from journal.support.scope import Scope

MOVES = ("Idle", "SessionStarted", "PromptSubmitted", "ToolStarting", "ToolFinished")


class Turn:
    """Whether an agent is between turns: its latest move was a stop or a start, or it has made none."""

    def __init__(self, entries: Entries, scope: Scope) -> None:
        self.entries, self.scope = entries, scope

    def over(self, agent: Agent) -> bool:
        with self.scope.of(agent.environment_id):
            moves = [e for e in self.entries.of_kind_in(200) if e.kind in MOVES and e.actor and e.actor.id == agent.session]
        return not moves or moves[0].kind in ("Idle", "SessionStarted")
