from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import AGENT, USER, V3Row, seconds
from journal.models.author import Author
from journal.models.environment import Environment
from journal.repositories.messages import Messages
from journal.repositories.reactions import Reactions

TITLE = 80


class MessagesShaper(Shaper):
    """A message's first seer is its author and the other side joins once it has read it. A message of yours closes once the agent answered it, by a reply or a face; one of the agent's closes once you have seen it, as version 3 had it."""

    type = "message"

    def __init__(self, messages: Messages, reactions: Reactions) -> None:
        self.messages, self.reactions = messages, reactions

    def rows(self, environment: Environment) -> list[V3Row]:
        """An agent's reply to a message is the comment on it, not a message of its own, so the chat shows it once."""
        all_rows = self.messages.in_(environment.id)
        replied = {m.reply_to for m in all_rows if m.reply_to and m.author == Author.AGENT}
        return [self.row(m, m.id in replied or self.reacted_by_agent(m)) for m in all_rows if not (m.reply_to and m.author == Author.AGENT)]

    def reacted_by_agent(self, m) -> bool:
        return m.author == Author.USER and any(r.author == Author.AGENT for r in self.reactions.on(m))

    @staticmethod
    def row(m, answered: bool) -> V3Row:
        author = USER if m.author == Author.USER else AGENT
        other = AGENT if author == USER else USER
        read = seconds(m.read_at)
        closed = read if (author == USER and answered) or (author == AGENT and read) else 0.0
        return V3Row.of("message", m, title=(m.text[:TITLE - 1] + "…") if len(m.text) > TITLE else m.text, brief=m.text,
                        seen=[author, other] if read else [author], refs=[f"message:{m.reply_to}"] if m.reply_to else [],
                        data={"idempotency": m.idempotency or f"v4:{m.id}", "acknowledgement": m.acknowledgement, "delivered": bool(read)}, completed=closed, outcome="answered" if closed and author == USER else "")
