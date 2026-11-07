from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.commands.report_silent_agent.report_silent_agent import ReportSilentAgent
from suites.coding.modules.workers.support.worker_recovery_reports import WorkerRecoveryReports


class RecordWorkerRecoveryReports(WorkerRecoveryReports):
    """Records recovery failures through their command."""

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def report(self, agent: Agent, reason: str, inactive_at: Timestamp) -> None:
        self.bus.run(ReportSilentAgent(agent.id, reason, inactive_at), Actor.core(), environment_id=agent.environment_id)
