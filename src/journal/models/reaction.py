from dataclasses import dataclass

from journal.events.rows.reaction_added import ReactionAdded
from journal.models.agent_role import AgentRole
from journal.models.author import Author
from journal.models.message import Message
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Reaction(Scoped):
    """One face by one side on one message; the message it sits on is a link of kind reacts."""

    face: str = ""
    author: Author = Author.USER

    def reacted_message(self, message: Message) -> "Reaction":
        if message.agent_role != AgentRole.MAIN:
            return self
        return self.with_event(ReactionAdded(environment_id=self.environment_id, face=self.face, message_id=message.row_id, user_origin=self.author == Author.USER))
