from collections.abc import Sequence
from dataclasses import replace

from core.base.agent_role import AgentRole
from core.base.provider.transcript_author import JOURNAL_AUTHOR, MONITOR_AUTHOR, USER_AUTHOR
from core.base.provider.transcript_row import TranscriptRow
from core.modules.agents.models.agent import Agent

ASSISTANT_TYPE = "assistant"


class TranscriptAuthors:
    """Names who wrote each row of a helper's transcript. A helper's own rows say its role, a worker's say
    worker; a helper never hears from the user, so a row its program filed as the user's is the journal's, and
    a monitor's stays a monitor's. The main agent's rows are left as its program wrote them."""

    def tagged(self, agent: Agent, rows: Sequence[TranscriptRow]) -> tuple[TranscriptRow, ...]:
        if agent.role is AgentRole.MAIN:
            return tuple(rows)
        return tuple(replace(row, author=self.author(agent, row)) for row in rows)

    def author(self, agent: Agent, row: TranscriptRow) -> str:
        if row.row_type == ASSISTANT_TYPE:
            return agent.role.value
        if row.row_type == USER_AUTHOR and row.author != MONITOR_AUTHOR:
            return self.sender(agent, row)
        return row.author

    def sender(self, agent: Agent, row: TranscriptRow) -> str:
        return JOURNAL_AUTHOR
