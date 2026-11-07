import re

from core.modules.messages.models.message import Message
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.word_distance import WordDistance

COMPARED_MESSAGES = 5
SHORTEST_WORDS = 4
REPEATED_SIMILARITY = 0.6
NUMBERS = re.compile(r"\b\d+\b")


class RepeatedMessages:
    """Finds the one of an agent's last five chat messages that a new text says much the same as, by its words; a
    question, a text of three words or fewer, or one naming a number the earlier message did not, repeats nothing."""

    def __init__(self, messages: MessageQuery) -> None:
        self.messages = messages

    def repeated(self, creator_id: int, text: str, new_id: int | None = None) -> Message | None:
        if "?" in text or len(WordDistance.words(text)) < SHORTEST_WORDS:
            return None
        newest = self.messages.agent_messages().filter(creator_id=creator_id).newest().limited(COMPARED_MESSAGES + 1)
        earlier = [row for row in newest if row.id != new_id][:COMPARED_MESSAGES]
        return next((row for row in earlier if self.says_nothing_new(row.text, text)), None)

    @staticmethod
    def says_nothing_new(earlier: str, text: str) -> bool:
        names_no_new_number = set(NUMBERS.findall(text)) <= set(NUMBERS.findall(earlier))
        return names_no_new_number and WordDistance.similarity(earlier, text) >= REPEATED_SIMILARITY
