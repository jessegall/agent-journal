from engine.provider.transcript_author import JOURNAL_AUTHOR
from engine.provider.transcript_row import TranscriptRow
from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.transcript_authors import TranscriptAuthors
from core.modules.drivers.models.agent_line import AgentLine

MAIN_AGENT_AUTHOR = "main agent"


class LineTranscriptAuthors(TranscriptAuthors):
    """Tells who sent a row a helper's program filed as the user's from the lines the journal kept for the
    agent, whose text and sender it recorded: a line an agent made is that agent's, any other is the
    journal's, and a row that no line holds the text of is the journal's too."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def sender(self, agent: Agent, row: TranscriptRow) -> str:
        lines = self.kept.read("agent_lines", lambda: tuple(self.queries.query(AgentLine).filter(session_agent_id=agent.id).oldest().all_rows()),
                               "session_agent_id = ?", [agent.id], name="drivers.transcript_lines")
        line = next((candidate for candidate in lines if candidate.text and (candidate.text in row.text or row.text in candidate.text)), None)
        if line is None:
            return JOURNAL_AUTHOR
        return MAIN_AGENT_AUTHOR if self.is_agent(line.creator_id) else JOURNAL_AUTHOR

    def is_agent(self, actor_id: int) -> bool:
        return self.kept.read("agents", self.queries.query(Agent).filter(id=actor_id).exists, "id = ?", [actor_id], name="drivers.transcript_agent")
