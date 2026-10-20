from dataclasses import dataclass

from journal.events.rows.reaction_given import ReactionGiven
from journal.models.author import Author
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Reaction(Scoped):
    """One face by one side on one message; the message it sits on is a link of kind reacts."""

    face: str = ""
    author: Author = Author.USER

    def given_on(self, message_id: int) -> "Reaction":
        return self.with_event(ReactionGiven(environment_id=self.environment_id, face=self.face, message_id=message_id, by_user=self.author == Author.USER))
