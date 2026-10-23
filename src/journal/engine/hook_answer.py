from journal.engine.delivery import Delivery
from journal.engine.state_machine import StateMachine
from journal.engine.support.session_agents import SessionAgents
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.models.agent_role import AgentRole
from journal.support.decision import Decision


class HookAnswer(AgentListener[AgentEvent]):
    """The one blocking listener on every agent event: asks the state machine for its reply, has the delivery carry out what the reply asks of the terminal, and answers the hook with its decision; a worker's lines wait on its row for its next hook."""

    blocking = True
    is_worker_listener = True

    rank = 0

    def __init__(self, machine: StateMachine, delivery: Delivery, sessions: SessionAgents) -> None:
        self.machine, self.delivery, self.sessions = machine, delivery, sessions

    def handle(self, event: AgentEvent) -> Decision:
        if isinstance(event, ToolStarting) and event.call.is_panic_line():
            return Decision()
        agent = self.sessions.agent(event.session, event.environment_id, event.provider)
        self.delivery.silence(event)
        reply = self.machine.reply(agent, event)
        self.delivery.applied(reply, event.typing_delay)
        if agent.role == AgentRole.WORKER:
            return self.machine.worker_decision(agent.row_id, reply.decision, event)
        return self.delivery.hook_decision(event, reply.decision)
