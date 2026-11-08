from core.modules.messages.models.message import Message
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.message_words import MessageWords

COMPARED_MESSAGES = 5
SHORTEST_WORDS = 4
ALREADY_SAID_SHARE = 0.7


class RepeatedMessages:
    """Finds the one of an agent's last five chat messages that already said most of a new text: 70 percent of its
    content words, each in about the same part of the text. A question, a text of three words or fewer, or one naming a number the earlier message did not,
    repeats nothing."""

    def __init__(self, messages: MessageQuery) -> None:
        self.messages = messages

    def repeated(self, creator_id: int, text: str, new_id: int | None = None) -> Message | None:
        if "?" in text or len(MessageWords.words(text)) < SHORTEST_WORDS:
            return None
        newest = self.messages.agent_messages().filter(creator_id=creator_id).newest().limited(COMPARED_MESSAGES + 1)
        earlier = [row for row in newest if row.id != new_id][:COMPARED_MESSAGES]
        return next((row for row in earlier if self.says_nothing_new(row.text, text)), None)

    @staticmethod
    def says_nothing_new(earlier: str, text: str) -> bool:
        return not MessageWords.names_a_new_number(earlier, text) and MessageWords.already_said(earlier, text) >= ALREADY_SAID_SHARE
