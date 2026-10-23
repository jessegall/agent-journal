from journal.features.team.support.team_join import TeamJoin
from journal.http.support.request import Request
from journal.support.response import Response
from journal.sync.sync_status import SyncStatus
from journal.sync.team_account import TeamAccount
from journal.sync.team_requests import TeamRequests
from journal.sync.team_server_link import TeamServerLink


class TeamController:
    """The viewer's Team tab: how this journal stands with its team, the join a journal in no team makes from it, as journal team join does, and the admin's invitation, which answers with the line the person joins with."""

    def __init__(self, account: TeamAccount, joining: TeamJoin, link: TeamServerLink, status: SyncStatus) -> None:
        self.account, self.joining, self.link, self.status = account, joining, link, status

    def show(self, request: Request) -> Response:
        if not self.account.is_joined():
            return Response.json({"joined": False})
        return Response.json({"joined": True, "address": self.account.address(), "line": self.status.line(), "version": self.account.team_version()})

    def join(self, request: Request) -> Response:
        body = request.body
        outcome = TeamRequests.reached(lambda: self.joining.join(str(body.get("address", "")).strip().rstrip("/"), str(body.get("code", "")).strip(), str(body.get("password", "")), str(body.get("fingerprint", "")).strip(), str(body.get("name", "")).strip()))
        return Response.json({"outcome": outcome}, 201)

    def invite(self, request: Request) -> Response:
        answer = TeamRequests.reached(lambda: self.link.invite(str(request.body.get("email", "")).strip()))
        return Response.json({"email": answer.email, "line": self.account.join_line(answer.code)})
