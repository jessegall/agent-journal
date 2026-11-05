from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.commands.record_agent_launch_failure.record_agent_launch_failure import AGENT_START_FAILED, RecordAgentLaunchFailure
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudger import Nudger

SOURCE = "agents.launch-failed"


class RecordAgentLaunchFailureHandler(Handler[RecordAgentLaunchFailure, None]):
    """Ends the row of an agent whose program could not start, so it holds no place, and tells its parent why."""

    command = RecordAgentLaunchFailure
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, nudger: Nudger, bus: Bus) -> None:
        self.queries, self.nudger, self.bus = queries, nudger, bus

    def handle(self, command: RecordAgentLaunchFailure, context: Context) -> None:
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.ended_at is None:
            self.bus.dispatch(EndAgent(agent.id), context)
        notice = AGENT_START_FAILED.nudge(agent=agent.id)
        if agent.parent_id is not None and not self.queries.query(AgentLine).filter(source=SOURCE, text=notice.text).exists():
            self.nudger.send(agent.parent_id, AGENT_START_FAILED, SOURCE, context, agent=agent.id)
