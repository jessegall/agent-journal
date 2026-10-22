from journal.http.support.request import Request
from journal.support.response import Response
from journal.sync.team_chat import TeamChat
from journal.sync.team_requests import TeamRequests


class TeamChatController:
    """The Team chat's holder as its page shows it, one line, and the Claim button that makes this machine hold it."""

    def __init__(self, chat: TeamChat) -> None:
        self.chat = chat

    def show(self, request: Request) -> Response:
        return Response.json({"line": TeamRequests.reached(lambda: TeamChat.holder_line(self.chat.holder()))})

    def claim(self, request: Request) -> Response:
        TeamRequests.reached(lambda: self.chat.claim(request.body.get("agent", "claude")))
        return self.show(request)
