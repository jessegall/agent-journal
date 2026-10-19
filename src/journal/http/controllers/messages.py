from datetime import datetime, timezone

from journal.features.messages.mentions import Mentions
from journal.http.attachments.attachments import Attachments
from journal.http.controllers.controller import Controller
from journal.http.counts import Counts
from journal.http.listed import Listed
from journal.http.listing import Listing
from journal.http.support.model_fields import ModelFields
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.messages import Messages
from journal.repositories.reactions import Reactions

class MessageController(Controller[Message]):
    """The chat: the user's, the agent's and the journal's messages by id, read a page at a time from the database; the user's are sent from here, as the user."""

    timeline = True

    def __init__(self, messages: Messages, reactions: Reactions, attachments: Attachments) -> None:
        self.repository, self.reactions, self.attachments = messages, reactions, attachments

    def listed(self, listing: Listing) -> Listed:
        """The page asked for, read by id from the database alone, and the counts from queries: the chat never loads the whole history."""
        page = listing.listed(self.asked(listing), lambda m: True, timeline=True)
        unread = self.repository.unseen_by_user()
        counts = Counts(all=self.repository.count_in(), open=len(self.open_ids()) + unread, unread=unread)
        return Listed(rows=self.shown_page(page["rows"]), more=page["more"], counts=counts)

    def asked(self, listing: Listing) -> list[Message]:
        if listing.ids:
            return self.repository.numbered(listing.ids)
        if listing.since:
            return self.repository.changed_since(datetime.fromtimestamp(listing.since, timezone.utc))
        return self.repository.window(listing.limit + 1, listing.before, listing.after)

    def open_ids(self) -> set[int]:
        """The user's messages the agent has not answered or not read."""
        return {m.id for m in self.repository.unanswered()} | {m.id for m in self.repository.unread()}

    def shown_page(self, rows: list[Message]) -> list[dict]:
        """Each message with whether the agent answered it, the tasks filed from it, the rows it is a comment on and the rows its text names."""
        filed, commented, unanswered = self.repository.linked(Messages.ABOUT), self.repository.linked(Messages.COMMENTS_ON), {m.id for m in self.repository.unanswered()}
        return [{**ModelFields.of(m), "answered": m.id not in unanswered, "filed": [ref.id for ref in filed.get(m.id, [])],
                 "comments_on": [str(ref) for ref in commented.get(m.id, [])], "mentions": [str(ref) for ref in Mentions.in_(m.text)]} for m in rows]

    def store(self, request: Request) -> Response:
        """A message of the user's; one sent again with the same key lands once."""
        key = request.body.get("idempotency", "")
        already = self.repository.sent_with(key) if key else []
        if already:
            return Response.json(self.shown(already[0]), 201)
        message = Message(author=Author.USER, text=request.body.get("text", ""), reply_to=request.body.get("reply_to"), idempotency=key)
        return Response.json(self.shown(self.repository.save(message, request.actor)), 201)

    def read(self, request: Request) -> Response:
        return Response.json(self.shown(self.repository.mark_read(self.repository.find(request.number("id")), request.actor)))

    def read_all(self, request: Request) -> Response:
        if "ids" not in request.body:
            return Response.json({})
        for id in request.body["ids"]:
            self.repository.mark_read(self.repository.find(int(id)), request.actor)
        return Response.json({})

    def reply(self, request: Request) -> Response:
        answered = self.repository.find(request.number("id"))
        message = Message(environment_id=answered.environment_id, author=Author.USER, text=request.body.get("text", ""), reply_to=answered.id)
        return Response.json(self.shown(self.repository.save(message, request.actor)), 201)

    def react(self, request: Request) -> Response:
        """A face of the user's on the message, or the same face taken off again."""
        made = self.reactions.toggle(self.repository.find(request.number("id")), request.body.get("face", ""), Author.USER, request.actor)
        return Response.json(made or {})

    def press(self, request: Request) -> Response:
        """The buttons pressed on a message's card, so the chat shows them spent."""
        message = self.repository.find(request.number("id"))
        pressed = [str(label) for label in request.body.get("pressed", [])]
        return Response.json(self.shown(self.repository.save(message.with_(data={**message.data, "pressed": pressed}), request.actor)))

    def attach(self, request: Request) -> Response:
        """The files a multipart request carried, stored beside the message and named on it."""
        message = self.repository.find(request.number("id"))
        names = tuple(self.attachments.store(Message.table(), message.id, name, data) for name, data in request.files.items())
        saved = self.repository.save(message.with_(files=(*message.files, *names)), request.actor) if names else message
        return Response.json(self.shown(saved))
