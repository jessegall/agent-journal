from journal.http.controllers.controller import Controller
from journal.http.model_fields import ModelFields
from journal.http.request import Request
from journal.http.response import Response
from journal.models.author import Author
from journal.models.link import Link
from journal.models.message import Message
from journal.models.ref import Ref
from journal.support.refused import Refused
from journal.repositories.links import Links
from journal.repositories.messages import Messages

COMMENTED = ("tasks", "plans", "docs", "reports", "facts", "rules", "reminders", "questions")
"""The rows the viewer writes comments under."""


class CommentController(Controller[Message]):
    """A comment written under a row in the viewer is a message of the user's linked to the row as comments_on, drawn under it; it reaches the agent as any message does."""

    timeline = True

    def __init__(self, messages: Messages, links: Links) -> None:
        self.repository, self.links = messages, links

    def rows(self) -> list[Message]:
        """The user's messages written under a row, found by their links in one read."""
        on = self.repository.linked(Messages.COMMENTS_ON)
        return [m for m in self.repository.numbered(tuple(on)) if m.author == Author.USER] if on else []

    def shown_page(self, rows: list[Message]) -> list[dict]:
        on = self.repository.linked(Messages.COMMENTS_ON)
        return [{**ModelFields.of(m), "on": [str(ref) for ref in on.get(m.id, [])]} for m in rows]

    def store(self, request: Request) -> Response:
        on = self.row(str(request.body.get("on", "")))
        message = self.repository.save(Message(author=Author.USER, text=request.body.get("text", "")), request.actor)
        self.links.save(Link(source=Ref.to(message), target=on, kind=Messages.COMMENTS_ON), request.actor)
        return Response.json(self.shown(message), 201)

    def row(self, named: str) -> Ref:
        """The row a comment is written under, named as tasks:12, which must be there."""
        kind, _, id = named.partition(":")
        if kind not in COMMENTED or not id.isdigit() or not self.links.is_row(Ref(kind, int(id))):
            raise Refused(f"a comment is written under a task, a plan, a document, a report, a fact, a rule, a reminder or a question that is there, named as tasks:12, not {named!r}")
        return Ref(kind, int(id))
