from engine.command.context import Context
from engine.driver.message_sender import MessageSender
from engine.enums.responder import Responder
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.agent_escalation import AgentEscalation
from core.modules.drivers.agent_messages.escalation_help_message import EscalationHelpMessage

ESCALATION_SOURCE = "drivers.escalation"


class EscalationResponderListener(SaveListener[Changed[AgentEscalation]]):
    """An escalation its agent's parent answers gives that parent a line that wakes it, in the escalation's
    write, when it opens and when a hold or a piece of work joins it (doc 1310 section 4.6); the person sees
    it in the chat."""

    name = "drivers.escalation-responder"

    def __init__(self, agents: AgentRows, message_sender: MessageSender) -> None:
        self.agents, self.message_sender = agents, message_sender

    def handle(self, event: Changed[AgentEscalation], context: Context) -> None:
        escalation, previous = event.row, event.old_row
        if escalation.responder is not Responder.PARENT or (previous is not None and not EscalationResponderListener.has_grown(escalation, previous)):
            return
        agent = self.agents.find(escalation.session_agent_id)
        if agent.parent_id is not None:
            self.message_sender.send(agent.parent_id, EscalationHelpMessage.declared(), ESCALATION_SOURCE, context, agent=agent.id, count=escalation.refusal_count,
                             escalation=escalation.id)

    # a hold or a piece of work that joined; the refusal counts reset at each rest, so they cannot tell a join
    @staticmethod
    def has_grown(escalation: AgentEscalation, previous: AgentEscalation) -> bool:
        return not set(escalation.block_ids) <= set(previous.block_ids) or not set(escalation.work_keys) <= set(previous.work_keys)
