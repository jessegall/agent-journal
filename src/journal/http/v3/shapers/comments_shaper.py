from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import USER, V3Row, viewer_ref
from journal.models.author import Author
from journal.repositories.messages import Messages


class CommentsShaper(Shaper):
    """A comment the user writes under a row is a message linked to that row, drawn under it."""

    type = "comment"

    def __init__(self, messages: Messages) -> None:
        self.messages = messages

    def rows(self) -> list[V3Row]:
        """The messages written under a row, found by their links in one read, not by a look at every message."""
        on = self.messages.linked(Messages.COMMENTS_ON)
        if not on:
            return []
        return [V3Row.of("comment", m, title=m.text[:80], brief=m.text, refs=[viewer_ref(target) for target in on[m.id]], seen=[USER])
                for m in self.messages.numbered(tuple(on)) if m.author == Author.USER]
