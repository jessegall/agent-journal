from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import AGENT, USER, V3Row, seconds
from journal.models.author import Author
from journal.models.environment import Environment
from journal.repositories.messages import Messages

TITLE = 80


class MessagesShaper(Shaper):
    """A message's first seer is its author; one the other side has read is completed, as version 3 marked it."""

    type = "message"

    def __init__(self, messages: Messages) -> None:
        self.messages = messages

    def rows(self, environment: Environment) -> list[V3Row]:
        """An agent's reply to a message is the comment on it, not a message of its own, so the chat shows it once."""
        return [self.row(m) for m in self.messages.in_(environment.id) if not (m.reply_to and m.author == Author.AGENT)]

    @staticmethod
    def row(m) -> V3Row:
        author = USER if m.author == Author.USER else AGENT
        other = AGENT if author == USER else USER
        read = seconds(m.read_at)
        return V3Row.of("message", m, title=(m.text[:TITLE - 1] + "…") if len(m.text) > TITLE else m.text, brief=m.text,
                        seen=[author, other] if read else [author], refs=[f"message:{m.reply_to}"] if m.reply_to else [],
                        data={"idempotency": m.idempotency or f"v4:{m.id}", "acknowledgement": False}, completed=read, outcome="read" if read else "")
