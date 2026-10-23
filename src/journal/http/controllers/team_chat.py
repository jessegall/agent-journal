from journal.http.support.request import Request
from journal.support.response import Response
from journal.sync.team_chat import TeamChat
from journal.sync.team_account import TeamAccount
from journal.sync.team_requests import TeamRequests


class TeamChatController:
    """The Team chat's holder as its page shows it, one line, whether this machine holds it and whether anyone may claim it, the Claim that makes this machine hold it, and the Release that lets it go."""

    def __init__(self, chat: TeamChat, account: TeamAccount) -> None:
        self.chat, self.account = chat, account

    def show(self, request: Request) -> Response:
        lease = TeamRequests.reached(self.chat.holder)
        mine = self.account.is_chat_holder()
        return Response.json({"line": "Held by you" if mine else TeamChat.holder_line(lease), "mine": mine, "claimable": not mine and (not lease.holder or lease.is_lapsed), "holder": lease.holder})

    def claim(self, request: Request) -> Response:
        TeamRequests.reached(lambda: self.chat.claim(request.body.get("agent", "claude")))
        return self.show(request)

    def release(self, request: Request) -> Response:
        TeamRequests.reached(self.chat.release)
        return self.show(request)
