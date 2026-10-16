from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import USER, V3Row, viewer_ref
from journal.models.author import Author
from journal.repositories.links import Links
from journal.repositories.messages import Messages


class CommentsShaper(Shaper):
    """A comment the user writes under a row is a message linked to that row, drawn under it."""

    type = "comment"

    def __init__(self, messages: Messages, links: Links) -> None:
        self.messages, self.links = messages, links

    def rows(self) -> list[V3Row]:
        return [V3Row.of("comment", m, title=m.text[:80], brief=m.text, refs=[viewer_ref(target) for target in targets], seen=[USER])
                for m in self.messages.in_() if m.author == Author.USER and (targets := self.links.targets(m, Messages.COMMENTS_ON))]
