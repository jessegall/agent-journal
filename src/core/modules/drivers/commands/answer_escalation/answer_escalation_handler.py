from engine.driver.nudger import Nudger
from engine.command.context import Context
from engine.command.handler import Handler
from engine.enums.responder import Responder
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.listeners.escalation_responder_listener import ESCALATION_SOURCE
from core.modules.drivers.nudges.escalation_answered_nudge import EscalationAnsweredNudge
from core.modules.drivers.commands.answer_escalation.answer_escalation import AnswerEscalation
from core.modules.drivers.models.agent_escalation import AgentEscalation
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.models.enums.escalation_state import EscalationState


class AnswerEscalationHandler(Handler[AnswerEscalation, AgentEscalation]):
    """Ends an open escalation with its responder's words: only that responder answers it (the agent's parent,
    or a person), and the agent's refusal counts go back to 0."""

    command = AnswerEscalation

    def __init__(self, queries: Queries, repository: Repository, agents: AgentRows, nudger: Nudger) -> None:
        self.queries, self.repository, self.agents, self.nudger = queries, repository, agents, nudger

    def handle(self, command: AnswerEscalation, context: Context) -> AgentEscalation:
        row = self.queries.query(AgentEscalation).filter(id=command.escalation_id).first()
        if row is None or row.state is not EscalationState.OPEN:
            raise Refusal(f"escalation {command.escalation_id} is not open", "journal escalation list lists the open ones")
        parent_id = self.agents.find(row.session_agent_id).parent_id
        if context.actor.is_agent() and (row.responder is Responder.PERSON or context.actor.id != parent_id):
            raise Refusal(f"only the {row.responder} the escalation asked may answer it")
        stack = self.queries.query(AgentStack).filter(session_agent_id=row.session_agent_id).first()
        if stack is not None:
            self.repository.save(stack.changed(stop_refusals=0, tool_refusals=0), context)
        answered = self.repository.save(row.changed(state=EscalationState.CONTINUED, answer=command.text, ended_at=context.timestamp), context)
        # the answer wakes the agent, whose wakes waited while the escalation was open (doc 1310 section 4.6)
        self.nudger.send(row.session_agent_id, EscalationAnsweredNudge.declared(), ESCALATION_SOURCE, context, escalation=row.id)
        return answered
