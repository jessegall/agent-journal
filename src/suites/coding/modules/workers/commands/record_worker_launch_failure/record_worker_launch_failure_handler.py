from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.commands.record_worker_launch_failure.record_worker_launch_failure import RecordWorkerLaunchFailure
from suites.coding.modules.workers.support.worker_nudges import WORKER_START_FAILED

SOURCE = "workers.launch-failed"


class RecordWorkerLaunchFailureHandler(Handler[RecordWorkerLaunchFailure, None]):
    """Tells the main agent once when a worker's program could not start."""

    command = RecordWorkerLaunchFailure
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, main_agent_line: MainAgentLine) -> None:
        self.queries, self.main_agent_line = queries, main_agent_line

    def handle(self, command: RecordWorkerLaunchFailure, context: Context) -> None:
        worker = self.queries.query(Agent).find(command.worker_id)
        notice = WORKER_START_FAILED.nudge(worker=worker.id)
        if self.queries.query(AgentLine).filter(source=SOURCE, text=notice.text).exists():
            return
        self.main_agent_line.send(worker.environment_id, notice.text, SOURCE, context)
