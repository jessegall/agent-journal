from core.base.change.created import Created
from core.base.command.context import Context
from core.base.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.support.question_message import QuestionMessage


class QuestionMessageGuard(Guard[Created[Message]]):
    """Directs an agent's unanswered choice question to the question tool."""

    name = "messages.question-tool"
    short_flag = "confirm"

    def check(self, event: Created[Message], context: Context) -> None:
        message = event.row
        if message.type is not MessageType.AGENT or not QuestionMessage.is_choice(message.text):
            return
        raise Refusal("a choice for the user belongs in the question tool",
                      'journal question ask "<short title>" --context "<a few sentences>" --options "<choice>" "<choice>" --recommend "<choice>"')
