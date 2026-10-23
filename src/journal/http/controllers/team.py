import time

from journal.features.team.support.team_join import TeamJoin
from journal.http.support.request import Request
from journal.repositories.environment_owners import EnvironmentOwners
from journal.repositories.environments import Environments
from journal.support.response import Response
from journal.sync.sync_status import SyncStatus
from journal.sync.team_account import TeamAccount
from journal.sync.team_requests import TeamRequests
from journal.sync.team_server_link import TeamServerLink
from journal.version import VERSION

ONLINE_SECONDS = 120


class TeamController:
    """The viewer's Team tab: how this journal stands with its team, the join a journal in no team makes from it, as journal team join does, the team's people with their environments and when they were last seen, and for an admin the invitation, answered with the line the person joins with, and the devices, one of which can be revoked."""

    def __init__(self, account: TeamAccount, joining: TeamJoin, link: TeamServerLink, status: SyncStatus, environments: Environments, owners: EnvironmentOwners) -> None:
        self.account, self.joining, self.link, self.status = account, joining, link, status
        self.environments, self.owners = environments, owners

    def show(self, request: Request) -> Response:
        if not self.account.is_joined():
            return Response.json({"joined": False})
        return Response.json({"joined": True, "address": self.account.address(), "line": self.status.line(), "state": self.status.state(), "version": self.account.team_version(), "running": VERSION, "waiting": self.status.waiting(), "admin": self.account.is_admin(), "device": self.account.device()})

    def join(self, request: Request) -> Response:
        body = request.body
        outcome = TeamRequests.reached(lambda: self.joining.join(str(body.get("address", "")).strip().rstrip("/"), str(body.get("code", "")).strip(), str(body.get("password", "")), str(body.get("fingerprint", "")).strip(), str(body.get("name", "")).strip()))
        return Response.json({"outcome": outcome, "environment": self.account.personal_name(request.environment)}, 201)

    def people(self, request: Request) -> Response:
        answer = TeamRequests.reached(self.link.people)
        rows = self.environments.rows()
        checked_at = time.time()
        return Response.json({"people": [{"id": person.id, "name": person.name, "role": person.role, "me": person.id == request.actor.number(), "online": checked_at - person.pulled_at < ONLINE_SECONDS, "seen_at": person.pulled_at, "environments": [{"id": row.row_id, "name": row.name} for row in rows if self.owners.owner_number(row.row_id) == person.id]} for person in answer.people]})

    def invite(self, request: Request) -> Response:
        answer = TeamRequests.reached(lambda: self.link.invite(str(request.body.get("email", "")).strip()))
        return Response.json({"email": answer.email, "line": self.account.join_line(answer.code)})

    def devices(self, request: Request) -> Response:
        names = {person.id: person.name for person in TeamRequests.reached(self.link.people).people}
        listed = TeamRequests.reached(self.link.devices).devices
        return Response.json({"devices": [{"id": device.id, "name": device.name, "person": names.get(device.account_id, f"user {device.account_id}"), "pulled_at": device.pulled_at, "this": str(device.id) == str(self.account.device())} for device in listed if not device.is_revoked()]})

    def revoke(self, request: Request) -> Response:
        TeamRequests.reached(lambda: self.link.revoke(request.number("id")))
        return self.devices(request)
