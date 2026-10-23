from journal.http.support.request import Request
from journal.repositories.environment_owners import EnvironmentOwners
from journal.repositories.environments import Environments
from journal.repositories.users import Users
from journal.support.response import Response
from journal.sync.team_account import TeamAccount


class PeopleController:
    """Who the viewer is and who else is on the journal: the viewer's own user number, whoever signed in on a hosted journal, and this machine's device, every person by number and name, and who owns each environment, so the viewer says you only for its own person."""

    def __init__(self, account: TeamAccount, users: Users, environments: Environments, owners: EnvironmentOwners) -> None:
        self.account, self.users, self.environments, self.owners = account, users, environments, owners

    def show(self, request: Request) -> Response:
        people = [{"id": user.row_id, "name": user.name} for user in self.users.rows()]
        owners = {str(environment.row_id): self.owners.owner_number(environment.row_id) for environment in self.environments.rows()}
        return Response.json({"me": request.actor.number(), "device": self.account.device(), "people": people, "owners": owners})
