from engine.event.created import Created
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.support.question_message import QuestionMessage


class QuestionMessageGuard(Guard[Created[Message]]):
    """Directs an agent's unanswered choice question to the question tool. Text the agent ended its turn with is
    already written, so it is shown in the chat and AgentTextRule says where a choice belongs."""

    name = "messages.question-tool"
    short_flag = "confirm"

    def check(self, event: Created[Message], context: Context) -> None:
        message = event.row
        if message.type is not MessageType.AGENT or message.is_agent_text or not QuestionMessage.is_choice(message.text):
            return
        raise Refusal("a choice for the user belongs in the question tool",
                      'journal question ask "<short title>" --context "<a few sentences>" --options "<choice>" "<choice>" --recommend "<choice>"')
