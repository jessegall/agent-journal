from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.agent_message import AgentMessage
from engine.driver.message_sender import MessageSender
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from suites.coding.modules.workers.commands.remind_inactive_main_agent.remind_inactive_main_agent import RemindInactiveMainAgent
from suites.coding.modules.workers.support.available_work import AvailableWork
from suites.coding.modules.workers.support.coding_main_options import CodingMainOptions
from suites.coding.agent_messages.task_assignment_message import TaskAssignmentMessage

WAKE_SOURCE = "coding.keep-going"


class RemindInactiveMainAgentHandler(Handler[RemindInactiveMainAgent, None]):
    """Wakes the idle main agent while keep going is on and work is left for it: the task it is handed, or the
    open tasks a free worker place can take. It is told once for each such state, so an agent that chose to
    leave the work is not woken again until the work changes."""

    command = RemindInactiveMainAgent
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, options: CodingMainOptions, work: AvailableWork, hook_calls: HookCallQuery, message_sender: MessageSender) -> None:
        self.queries, self.options, self.work, self.hook_calls, self.message_sender = queries, options, work, hook_calls, message_sender

    def handle(self, command: RemindInactiveMainAgent, context: Context) -> None:
        if not self.options.options().continues_work:
            return
        for agent in MainAgentFinder.rows(self.queries):
            if not self.hook_calls.is_idle(agent.id, context.timestamp):
                continue
            agent_message = self.waking_agent_message(agent.id)
            if agent_message is None or self.was_informed(agent.id, agent_message):
                continue
            self.message_sender.send_agent_message(agent.id, agent_message, WAKE_SOURCE, context, wakes_agent=True)

    def waking_agent_message(self, agent_id: int) -> AgentMessage | None:
        available = self.work.answer(agent_id)
        if available.assigned_task is not None:
            return TaskAssignmentMessage.declared().agent_message(task=available.assigned_task.id)
        return None

    def was_informed(self, agent_id: int, agent_message: AgentMessage) -> bool:
        last = self.queries.query(AgentLine).filter(session_agent_id=agent_id, source=WAKE_SOURCE).newest().first()
        return last is not None and last.text == agent_message.text
