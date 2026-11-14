from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.report_compaction_fault.report_compaction_fault import ReportCompactionFault
from core.modules.drivers.models.context_compaction import ContextCompaction
from core.modules.drivers.models.enums.compaction_notice_type import CompactionNoticeType
from core.modules.drivers.models.enums.compaction_state import CompactionState
from core.modules.drivers.support.compaction_notices import CompactionNotices
from core.modules.drivers.support.context_compactions import ContextCompactions

UNSTARTED_LINE_FAILURE = "its line never started"


class ReportCompactionFaultHandler(Handler[ReportCompactionFault, None]):
    """A request whose line never started fails and the user is told once; a compaction that ended with no
    context size read since is told once; and an open one whose agent is paused, ended or retired is given up,
    so nothing is typed to an agent that cannot take it."""

    command = ReportCompactionFault

    def __init__(self, queries: Queries, compactions: ContextCompactions, notices: CompactionNotices) -> None:
        self.queries, self.compactions, self.notices = queries, compactions, notices

    def handle(self, command: ReportCompactionFault, context: Context) -> None:
        compaction = self.queries.query(ContextCompaction).find(command.compaction_id)
        agent = self.queries.query(Agent).find(compaction.session_agent_id)
        if compaction.state.is_open and not agent.is_typable:
            self.compactions.abandon(compaction, context)
        elif compaction.state is CompactionState.REQUESTED:
            self.notices.report(self.compactions.fail(compaction, UNSTARTED_LINE_FAILURE, context), agent, CompactionNoticeType.UNSTARTED, context)
        elif compaction.state is CompactionState.ENDED and agent.ended_at is None:
            self.notices.report(compaction, agent, CompactionNoticeType.UNMEASURED, context)
