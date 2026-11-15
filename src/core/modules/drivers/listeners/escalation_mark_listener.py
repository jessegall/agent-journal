from engine.enums.responder import Responder
from engine.enums.mark_outcome import MarkOutcome
from engine.event.changed import Changed
from engine.event.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.drivers.models.agent_escalation import AgentEscalation
from core.modules.drivers.models.enums.escalation_mark_type import EscalationMarkType
from core.modules.drivers.models.enums.escalation_mark_variant import EscalationMarkVariant
from core.modules.drivers.models.enums.escalation_state import EscalationState
from core.modules.drivers.support.driver_settings import MODULE_KEY

OPENED_TEXT = "Asked the {responder} for help after {count} refused {kind} in a row"
PASSED_TEXT = "Its parent retired, so you answer this escalation after {count} refusals"
ANSWERED_TEXT = "The {responder} answered: {answer}"


class EscalationMarkListener(MarkListener[Changed[AgentEscalation]]):
    """Shows in the chat, once each, that an agent's escalation opened and that its responder answered it (doc
    1310 section 4.6)."""

    name = "drivers.escalation-mark"
    module_name = MODULE_KEY

    def handle(self, event: Changed[AgentEscalation], logged: LoggedEvent) -> None:
        escalation = event.row
        if event.old_row is None:
            text = OPENED_TEXT.format(responder=escalation.responder.value, count=escalation.refusal_count, kind=escalation.escalation_type.value)
            self.show(logged, EscalationMarkType.ESCALATION, EscalationMarkVariant.OPENED, text, agent_id=escalation.session_agent_id, outcome=MarkOutcome.WARNED)
        elif escalation.responder is Responder.PERSON and event.old_row.responder is not Responder.PERSON:
            self.show(logged, EscalationMarkType.ESCALATION, EscalationMarkVariant.REASSIGNED, PASSED_TEXT.format(count=escalation.refusal_count),
                      agent_id=escalation.session_agent_id, outcome=MarkOutcome.WARNED)
        elif event.old_row.state is EscalationState.OPEN and escalation.state is not EscalationState.OPEN:
            text = ANSWERED_TEXT.format(responder=escalation.responder.value, answer=escalation.answer or escalation.state.value)
            self.show(logged, EscalationMarkType.ESCALATION, EscalationMarkVariant.ANSWERED, text, agent_id=escalation.session_agent_id, outcome=MarkOutcome.PASSED)
