from datetime import datetime, timezone

from journal.features.messages.mentions import Mentions
from journal.http.v3.listed_rows import ListedRows
from journal.http.v3.listing import Listing
from journal.http.v3.row_counts import RowCounts
from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import AGENT, USER, V3Row, seconds, viewer_ref
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.messages import Messages

TITLE = 80
PAGE = 200


class MessagesShaper(Shaper):
    """A message's first seer is its author and the other side joins once it has read it. A message of yours closes once the agent answered it, by a reply or a face; one of the agent's closes once you have seen it; a card of the system's is closed as it is made."""

    type = "message"

    def __init__(self, messages: Messages) -> None:
        self.messages = messages

    def rows(self) -> list[V3Row]:
        """The newest page of messages, the user's, the agent's and the system's cards alike, a reply standing at its own number with the message it answers in reply_to."""
        return self.shaped(self.messages.window(PAGE))

    def answer(self, listing: Listing) -> ListedRows:
        """The page the chat asks for, read from the database alone, and the counts from queries: the chat never loads the whole history."""
        open_ = self.open_ids()
        counts = RowCounts(all=self.messages.count_in(), open=len(open_) + self.messages.unseen_by_user(), unread=self.messages.unseen_by_user())
        return ListedRows(**listing.listed(self.shaped(self.asked(listing), open_)), counts=counts)

    def asked(self, listing: Listing) -> list[Message]:
        if listing.only:
            return self.messages.numbered(listing.only)
        if listing.since:
            return self.messages.changed_since(datetime.fromtimestamp(listing.since, timezone.utc))
        return self.messages.window(listing.last + 1, listing.before, listing.after)

    def open_ids(self) -> set[int]:
        return {m.id for m in self.messages.unanswered()} | {m.id for m in self.messages.unread()}

    def shaped(self, messages: list[Message], open_: set[int] | None = None) -> list[V3Row]:
        open_ = self.open_ids() if open_ is None else open_
        about, commented = self.messages.linked(Messages.ABOUT), self.messages.linked(Messages.COMMENTS_ON)
        return [self.row(m, m.id not in open_, [f"todo:{ref.id}" for ref in about.get(m.id, [])], [viewer_ref(ref) for ref in commented.get(m.id, [])]) for m in messages]

    @staticmethod
    def closed_at(author: str, answered: bool, read: float) -> float:
        """When a person's message counts as closed: the user's once answered, the agent's once read; open until then."""
        settled = (author == USER and answered) or (author == AGENT and read)
        return read if settled else 0.0

    @staticmethod
    def row(m, answered: bool, filed: list[str], commented: list[str]) -> V3Row:
        author = m.author.value
        other = AGENT if author == USER else USER
        read = seconds(m.read_at)
        closed = seconds(m.created_at) if m.author == Author.SYSTEM else MessagesShaper.closed_at(author, answered, read)
        return V3Row.of("message", m, title=(m.text[:TITLE - 1] + "…") if len(m.text) > TITLE else m.text, brief=m.text,
                        seen=[author, other] if read else [author], refs=[*(f"message:{n}" for n in (m.reply_to,) if n is not None), *filed, *[ref for ref in Mentions.in_(m.text) if ref not in filed]],
                        data={"idempotency": m.idempotency or f"v4:{m.id}", "author": author, "actor": m.created_by.stamp if m.created_by else "", "reply_to": m.reply_to or 0, "acknowledgement": m.acknowledgement, "delivered": bool(read), "files": {name: "" for name in m.files}, "card": m.data, "comments_on": commented, "buttons": m.data.get("buttons", []), "pressed": m.data.get("pressed", [])}, completed=closed, outcome="answered" if closed and author == USER else "")
