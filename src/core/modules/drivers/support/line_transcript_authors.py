from core.base.provider.transcript_author import JOURNAL_AUTHOR
from core.base.provider.transcript_row import TranscriptRow
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.transcript_authors import TranscriptAuthors
from core.modules.drivers.models.agent_line import AgentLine

MAIN_AGENT_AUTHOR = "main agent"


class LineTranscriptAuthors(TranscriptAuthors):
    """Tells who sent a row a helper's program filed as the user's from the lines the journal kept for the
    agent, whose text and sender it recorded: a line an agent made is that agent's, any other is the
    journal's, and a row that no line holds the text of is the journal's too."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def sender(self, agent: Agent, row: TranscriptRow) -> str:
        lines = self.queries.query(AgentLine).filter(session_agent_id=agent.id).oldest().all_rows()
        line = next((candidate for candidate in lines if candidate.text and (candidate.text in row.text or row.text in candidate.text)), None)
        if line is None:
            return JOURNAL_AUTHOR
        return MAIN_AGENT_AUTHOR if self.queries.query(Agent).filter(id=line.creator_id).exists() else JOURNAL_AUTHOR
