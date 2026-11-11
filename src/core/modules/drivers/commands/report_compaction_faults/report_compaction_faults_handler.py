from dataclasses import replace
from datetime import timedelta

from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.among import Among
from engine.query.conditions.maximum import Maximum
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.report_compaction_fault.report_compaction_fault import ReportCompactionFault
from core.modules.drivers.commands.report_compaction_faults.report_compaction_faults import ReportCompactionFaults
from core.modules.drivers.models.context_compaction import ContextCompaction
from core.modules.drivers.models.enums.compaction_state import CompactionState

FAULT_SECONDS = 600
UNFINISHED_STATES = (CompactionState.REQUESTED, CompactionState.STARTED, CompactionState.ENDED)
FAULT_ROWS_REASON = "The compactions still requested, started or unmeasured ten minutes after they were made: one for each agent at most, read together on a tick."


class ReportCompactionFaultsHandler(Handler[ReportCompactionFaults, None]):
    """Reads, in one query, the compactions that are still requested, started or unmeasured ten minutes after
    they were made, and their agents in a second one, and reports each in the environment of its agent."""

    command = ReportCompactionFaults

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def handle(self, command: ReportCompactionFaults, context: Context) -> None:
        newest_creation = Timestamp(context.timestamp.value - timedelta(seconds=FAULT_SECONDS))
        rows = self.queries.query(ContextCompaction).matching(Among("state", UNFINISHED_STATES)).matching(Maximum("created_at", newest_creation.text)).full_table(FAULT_ROWS_REASON).all_rows()
        agents = {agent.id: agent for agent in self.queries.query(Agent).find_many(list({row.session_agent_id for row in rows}))}
        for row in rows:
            self.bus.dispatch(ReportCompactionFault(row.id), replace(context, environment_id=agents[row.session_agent_id].environment_id))
