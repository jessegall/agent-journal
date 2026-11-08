from core.modules.messages.models.message import Message
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.message_tokens import MessageTokens

COMPARED_MESSAGES = 5
MINIMUM_TOKENS = 4
REPEATED_SHARE = 0.7


class RepeatedMessages:
    """Finds the one of an agent's last five chat messages that already said most of a new text: 70 percent of
    its content words, each in about the same part of the text. A question, a text of three words or fewer,
    or one naming a number the earlier message did not, repeats nothing."""

    def __init__(self, messages: MessageQuery) -> None:
        self.messages = messages

    def repeated(self, creator_id: int, text: str, new_id: int | None = None) -> Message | None:
        if "?" in text or len(MessageTokens.tokens(text)) < MINIMUM_TOKENS:
            return None
        newest = self.messages.agent_messages().filter(creator_id=creator_id).newest().limited(COMPARED_MESSAGES + 1)
        previous = [row for row in newest if row.id != new_id][:COMPARED_MESSAGES]
        return next((row for row in previous if self.repeats_previous(row.text, text)), None)

    @staticmethod
    def repeats_previous(previous: str, text: str) -> bool:
        return not MessageTokens.adds_number(previous, text) and MessageTokens.repeated_share(previous, text) >= REPEATED_SHARE
