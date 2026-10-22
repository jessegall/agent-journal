from journal.models.agent import Agent
from journal.repositories.entries import Entries
from journal.repositories.scope import Scope

MOVES = ("Stop", "SessionStarted", "PromptSubmitted", "ToolStarting", "ToolFinished")


class Turn:
    """Whether an agent is between turns: its latest move was a stop or a start, or it has made none."""

    def __init__(self, entries: Entries, scope: Scope) -> None:
        self.entries, self.scope = entries, scope

    def is_finished(self, agent: Agent) -> bool:
        with self.scope.environment(agent.environment_id):
            moves = self.entries.session_moves(MOVES, agent.session)
        return not moves or moves[0].kind in ("Stop", "SessionStarted")
