from journal.http.controllers.controller import Controller
from journal.http.request import Request
from journal.http.response import Response
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.messages import Messages
from journal.repositories.not_found import NotFound


class MessageController(Controller[Message]):
    """The chat: the user's messages are sent from here, as the user."""

    def __init__(self, messages: Messages) -> None:
        self.repository = messages

    def store(self, request: Request) -> Response:
        message = Message(author=Author.USER, text=request.body.get("text", ""), reply_to=request.body.get("reply_to"))
        return Response.json(self.repository.save(message, request.actor), 201)

    def read(self, request: Request) -> Response:
        try:
            message = self.repository.find(request.number("id"))
        except NotFound as missing:
            return Response.not_found(str(missing))
        return Response.json(self.repository.mark_read(message, request.actor))
