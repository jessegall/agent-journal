from engine.command.context import Context
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.context_compaction import ContextCompaction
from core.modules.drivers.models.context_compaction_notice import ContextCompactionNotice
from core.modules.drivers.models.enums.compaction_notice_type import CompactionNoticeType
from core.modules.drivers.support.driver_nudges import COMPACTION_NOTICE
from core.modules.drivers.support.main_agent_line import MainAgentLine

SOURCE = "drivers.compaction-notice"


class CompactionNotices:
    """Tells the user and the main agent once about a compaction that went wrong: one notice row for each
    notice of each compaction, which the chat shows, and a line to the main agent naming the notice row."""

    def __init__(self, queries: Queries, repository: Repository, main_line: MainAgentLine) -> None:
        self.queries, self.repository, self.main_line = queries, repository, main_line

    def report(self, compaction: ContextCompaction, agent: Agent, notice: CompactionNoticeType, context: Context) -> None:
        if self.queries.query(ContextCompactionNotice).filter(compaction_id=compaction.id, notice=notice).exists():
            return
        reported = self.repository.save(ContextCompactionNotice(compaction_id=compaction.id, session_agent_id=agent.id, agent_number=agent.number, notice=notice, cause=compaction.failure), context)
        self.main_line.send_nudge(COMPACTION_NOTICE.nudge(notice=reported.id, agent=agent.number), SOURCE, context)
