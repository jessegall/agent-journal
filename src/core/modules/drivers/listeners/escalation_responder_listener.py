from engine.command.context import Context
from engine.driver.nudger import Nudger
from engine.enums.responder import Responder
from engine.event.created import Created
from engine.listener.save_listener import SaveListener
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.agent_escalation import AgentEscalation
from core.modules.drivers.nudges.escalation_help_nudge import EscalationHelpNudge

ESCALATION_SOURCE = "drivers.escalation"


class EscalationResponderListener(SaveListener[Created[AgentEscalation]]):
    """An escalation its agent's parent answers gives that parent a line that wakes it, in the escalation's write
    (doc 1310 section 4.6); the person sees it in the chat."""

    name = "drivers.escalation-responder"

    def __init__(self, agents: AgentRows, nudger: Nudger) -> None:
        self.agents, self.nudger = agents, nudger

    def handle(self, event: Created[AgentEscalation], context: Context) -> None:
        escalation = event.row
        if escalation.responder is not Responder.PARENT:
            return
        agent = self.agents.find(escalation.session_agent_id)
        if agent.parent_id is not None:
            self.nudger.send(agent.parent_id, EscalationHelpNudge.declared(), ESCALATION_SOURCE, context, agent=agent.number, count=escalation.refusal_count,
                             kind=escalation.escalation_type.value, escalation=escalation.id)
