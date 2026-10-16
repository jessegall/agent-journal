from journal.features.messages.mentions import Mentions
from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import AGENT, USER, V3Row, seconds
from journal.models.author import Author
from journal.models.environment import Environment
from journal.repositories.links import Links
from journal.repositories.messages import Messages

TITLE = 80


class MessagesShaper(Shaper):
    """A message's first seer is its author and the other side joins once it has read it. A message of yours closes once the agent answered it, by a reply or a face; one of the agent's closes once you have seen it; a card of the system's is closed as it is made."""

    type = "message"

    def __init__(self, messages: Messages, links: Links) -> None:
        self.messages, self.links = messages, links

    def rows(self, environment: Environment) -> list[V3Row]:
        """Every message, the user's, the agent's and the system's cards alike, a reply standing at its own number with the message it answers in reply_to."""
        open_ = {m.id for m in self.messages.unanswered(environment.id)} | {m.id for m in self.messages.unread(environment.id)}
        return [self.row(m, m.id not in open_, [f"todo:{ref.id}" for ref in self.links.targets(m, "about")]) for m in self.messages.in_(environment.id)]

    @staticmethod
    def row(m, answered: bool, filed: list[str]) -> V3Row:
        author = m.author.value
        other = AGENT if author == USER else USER
        read = seconds(m.read_at)
        closed = seconds(m.created_at) if m.author == Author.SYSTEM else read if (author == USER and answered) or (author == AGENT and read) else 0.0
        return V3Row.of("message", m, title=(m.text[:TITLE - 1] + "…") if len(m.text) > TITLE else m.text, brief=m.text,
                        seen=[author, other] if read else [author], refs=[*([f"message:{m.reply_to}"] if m.reply_to else []), *filed, *[ref for ref in Mentions.in_(m.text) if ref not in filed]],
                        data={"idempotency": m.idempotency or f"v4:{m.id}", "author": author, "actor": m.created_by.stamp if m.created_by else "", "reply_to": m.reply_to or 0, "acknowledgement": m.acknowledgement, "delivered": bool(read), "files": {name: "" for name in m.files}, "card": m.data}, completed=closed, outcome="answered" if closed and author == USER else "")
