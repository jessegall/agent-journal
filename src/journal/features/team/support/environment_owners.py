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

    def owner_number(self, environment: Environment) -> int:
        owners = self.links.typed_sources(environment, OWNER, User.table())
        return owners[0].id if owners else 0

    def owner_name(self, environment: Environment) -> str:
        number = self.owner_number(environment)
        names = [user.name for user in self.users.numbered([number])] if number else []
        return names[0] if names else ""

    def is_colleague(self, actor: Actor, environment: Environment) -> bool:
        owner = self.owner_number(environment)
        return actor.is_user() and owner != 0 and actor.stamp != Actor.user(owner).stamp
