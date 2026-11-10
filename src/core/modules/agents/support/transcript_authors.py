from collections.abc import Sequence
from dataclasses import replace

from engine.enums.agent_role import AgentRole
from core.base.provider.transcript_author import JOURNAL_AUTHOR, MONITOR_AUTHOR, USER_AUTHOR
from core.base.provider.transcript_row import TranscriptRow
from core.modules.agents.models.agent import Agent

ASSISTANT_TYPE = "assistant"


class TranscriptAuthors:
    """Names transcript authors, using the session role for its own messages."""

    def tagged(self, agent: Agent, rows: Sequence[TranscriptRow]) -> tuple[TranscriptRow, ...]:
        if agent.role == AgentRole.MAIN:
            return tuple(rows)
        return tuple(replace(row, author=self.author(agent, row)) for row in rows)

    def author(self, agent: Agent, row: TranscriptRow) -> str:
        if row.row_type == ASSISTANT_TYPE:
            return agent.role
        if row.row_type == USER_AUTHOR and row.author != MONITOR_AUTHOR:
            return self.sender(agent, row)
        return row.author

    def sender(self, agent: Agent, row: TranscriptRow) -> str:
        return JOURNAL_AUTHOR
