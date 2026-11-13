from engine.database.kept_rows import KeptRows
from core.modules.messages.models.message import Message
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.message_tokens import MessageTokens

COMPARED_MESSAGES = 5
MINIMUM_TOKENS = 4
REPEATED_SHARE = 0.7


class RepeatedMessages:
    """Finds the one of an agent's last five chat messages that already said most of a new text: 70 percent of
    its content words, each in about the same part of the text. A question, a text of three words or fewer,
    or one naming a number the earlier message did not, repeats nothing. The last messages are one kept load,
    so two messages checked in one request read them once."""

    def __init__(self, messages: MessageQuery, kept: KeptRows) -> None:
        self.messages, self.kept = messages, kept

    def repeated(self, creator_id: int, text: str, new_id: int | None = None) -> Message | None:
        if "?" in text or len(MessageTokens.tokens(text)) < MINIMUM_TOKENS:
            return None
        saved = self.messages.agent_messages().filter(creator_id=creator_id).newest()
        newest = self.kept.read_newest(saved, lambda: saved.take(COMPARED_MESSAGES + 1), name="messages.newest_of_agent")
        previous = [row for row in newest if row.id != new_id][:COMPARED_MESSAGES]
        return next((row for row in previous if self.repeats_previous(row.text, text)), None)

    @staticmethod
    def repeats_previous(previous: str, text: str) -> bool:
        return not MessageTokens.adds_number(previous, text) and MessageTokens.repeated_share(previous, text) >= REPEATED_SHARE
