from engine.helper_type.helper_type_book import HelperTypeBook
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.commands.record_agent_launch_failure.record_agent_launch_failure import RecordAgentLaunchFailure
from core.modules.agents.commands.record_agent_launch_failure.launch_nudges import AGENT_START_FAILED
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudger import Nudger

SOURCE = "agents.launch-failed"


class RecordAgentLaunchFailureHandler(Handler[RecordAgentLaunchFailure, None]):
    """Tells an agent's parent that its program could not start, and ends the row of one with no folder of its own,
    so it holds no place; an agent with a folder of its own keeps its row, to start again."""

    command = RecordAgentLaunchFailure
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, nudger: Nudger, bus: Bus, types: HelperTypeBook, rows: EventRows) -> None:
        self.queries, self.nudger, self.bus, self.types = queries, nudger, bus, types
        self.rows = rows

    def handle(self, command: RecordAgentLaunchFailure, context: Context) -> None:
        agent = self.rows.required(Agent, command.agent_id)
        if agent.ended_at is None and not self.types.find(agent.role).separate_folder:
            self.bus.dispatch(EndAgent(agent.id), context)
        notice = AGENT_START_FAILED.nudge(agent=agent.id)
        if agent.parent_id is not None and not self.queries.query(AgentLine).filter(source=SOURCE, text=notice.text).exists():
            self.nudger.send(agent.parent_id, AGENT_START_FAILED, SOURCE, context, agent=agent.id)
