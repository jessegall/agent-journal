from collections.abc import Sequence

from engine.agent_stack.reason import Reason
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.record.question import Question
from engine.enums.decision_class import DecisionClass
from engine.query.conditions.among import Among
from core.modules.messages.agent_messages.unread_display_refusal_message import UnreadDisplayRefusalMessage
from core.modules.messages.queries.message_query import MessageQuery

MESSAGES_POLICY_RANK = "messages.policies"


class UnreadMessageShowPolicy(Policy):
    """Refuses journal message show of a user's unread message: it is read with journal message read."""
    key = "messages.unread-show"
    rank = MESSAGES_POLICY_RANK

    def __init__(self, messages: MessageQuery) -> None:
        self.messages = messages

    def refusals(self, question: Question, view: AgentView) -> Sequence[Reason]:
        tool = question.tool()
        numbers = tool.shell.journal_command_numbers("message show") if tool is not None and tool.shell is not None else ()
        if not numbers:
            return []
        unread = self.messages.unread(view.agent.agent_id).matching(Among("id", numbers)).oldest().first()
        if unread is None:
            return []
        return [Reason(self.key, DecisionClass.REFUSE, self.rank, UnreadDisplayRefusalMessage.declared().agent_message(message=unread.id).text)]
