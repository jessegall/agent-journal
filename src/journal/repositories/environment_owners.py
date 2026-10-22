from journal.models.environment import Environment
from journal.models.user import User
from journal.repositories.links import Links
from journal.repositories.users import Users
from journal.support.actor import Actor

OWNER = "owner"


class EnvironmentOwners:
    """Who owns each environment, by the owner link from a user to it, and whether a person is a colleague there: a user who is not its owner, in an environment that has one."""

    def __init__(self, links: Links, users: Users) -> None:
        self.links, self.users = links, users

    def owner_number(self, environment_id: int) -> int:
        owners = self.links.typed_sources(Environment(id=environment_id), OWNER, User.table())
        return owners[0].id if owners else 0

    def owner_name(self, environment_id: int) -> str:
        number = self.owner_number(environment_id)
        names = [user.name for user in self.users.numbered([number])] if number else []
        return names[0] if names else ""

    def is_colleague(self, actor: Actor, environment_id: int) -> bool:
        owner = self.owner_number(environment_id)
        return actor.is_user() and owner != 0 and actor.stamp != Actor.user(owner).stamp

    def start_refusal(self, environment: Environment, person: int) -> str:
        owner = self.owner_number(environment.row_id)
        if not owner or owner == person:
            return ""
        return f"environment {environment.name} is {self.owner_name(environment.row_id) or f'user {owner}'}'s: an agent starts only in your own environment, so one session per environment holds across the team's machines"
