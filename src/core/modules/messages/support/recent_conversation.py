from dataclasses import dataclass

from core.modules.messages.models.message import Message

SIDE_MESSAGE_COUNT = 5
SHOWN_CHARACTERS = 300


@dataclass(frozen=True)
class RecentConversation:
    """What an agent and one other party said to each other lately."""

    actor: str
    agent_id: int
    messages: tuple[Message, ...]

    @property
    def has_answer(self) -> bool:
        return bool(self.theirs())

    def mine(self) -> tuple[Message, ...]:
        return tuple(message for message in self.messages if message.creator_id == self.agent_id)

    def theirs(self) -> tuple[Message, ...]:
        return tuple(message for message in self.messages if message.creator_id != self.agent_id)

    def shown(self) -> tuple[Message, ...]:
        return tuple(sorted((*self.mine()[-SIDE_MESSAGE_COUNT:], *self.theirs()[-SIDE_MESSAGE_COUNT:]), key=lambda message: message.id))

    def lines(self) -> str:
        return "\n".join([f"with {self.actor}:", *(self.line(message) for message in self.shown())])

    def line(self, message: Message) -> str:
        speaker = "you" if message.creator_id == self.agent_id else self.actor
        return f"{message.creation_timestamp().text}  {speaker}: {' '.join(message.text.split())[:SHOWN_CHARACTERS]}"
