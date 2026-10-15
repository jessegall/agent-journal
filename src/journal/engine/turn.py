from journal.models.agent import Agent
from journal.repositories.entries import Entries

MOVES = ("Idle", "SessionStarted", "PromptSubmitted", "ToolStarting", "ToolFinished")


class Turn:
    """Whether an agent is between turns: its latest move was a stop or a start, or it has made none."""

    def __init__(self, entries: Entries) -> None:
        self.entries = entries

    def over(self, agent: Agent) -> bool:
        moves = [e for e in self.entries.of_kind_in(agent.environment_id, 200) if e.kind in MOVES and e.actor and e.actor.id == agent.session]
        return not moves or moves[0].kind in ("Idle", "SessionStarted")
