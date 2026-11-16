from engine.helper_type.helper_type_book import HelperTypeBook
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.commands.record_agent_launch_failure.record_agent_launch_failure import RecordAgentLaunchFailure
from core.modules.agents.agent_messages.agent_start_failed_message import AgentStartFailedMessage
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from engine.driver.message_sender import MessageSender

SOURCE = "agents.launch-failed"


class RecordAgentLaunchFailureHandler(Handler[RecordAgentLaunchFailure, None]):
    """Tells an agent's parent that its program could not start, writes the moment of the failure on its row,
    and ends the row of one with no folder of its own, so it holds no place; an agent with a folder of its own
    keeps its row, to start again."""

    command = RecordAgentLaunchFailure
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, message_sender: MessageSender, bus: Bus, types: HelperTypeBook, rows: EventRows, repository: Repository) -> None:
        self.queries, self.message_sender, self.bus, self.types = queries, message_sender, bus, types
        self.rows, self.repository = rows, repository

    def handle(self, command: RecordAgentLaunchFailure, context: Context) -> None:
        agent = self.repository.update(self.rows.required(Agent, command.agent_id), context, launch_failed_at=context.timestamp)
        if agent.ended_at is None and not self.types.has_separate_folder(agent.role):
            self.bus.dispatch(EndAgent(agent.id), context)
        notice = AgentStartFailedMessage.declared().agent_message(agent=agent.id)
        if agent.parent_id is not None and not self.queries.query(AgentLine).filter(source=SOURCE, text=notice.text).exists():
            self.message_sender.send(agent.parent_id, AgentStartFailedMessage.declared(), SOURCE, context, agent=agent.id)
