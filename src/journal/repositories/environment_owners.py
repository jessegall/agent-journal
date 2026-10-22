from journal.models.environment import Environment
from journal.models.link import Link
from journal.models.message import Message
from journal.models.model import Model
from journal.models.user import User
from journal.repositories.links import Links
from journal.repositories.users import Users
from journal.support.actor import Actor
from journal.support.actor_kind import ActorKind

OWNER = "owner"


class EnvironmentOwners:
    """Who owns each environment, by the owner link from a user to it, whether a person is a colleague there, a user who is not its owner in an environment that has one, and so what that person may not write there: any shared row but a message and the links it brings; this machine's own records, such as the hook log, are no colleague's."""

    def __init__(self, links: Links, users: Users) -> None:
        self.links, self.users = links, users

    def owner_number(self, environment_id: int) -> int:
        owners = self.links.typed_sources(Environment(id=environment_id), OWNER, User.table())
        return owners[0].id if owners else 0

    def owner_name(self, environment_id: int) -> str:
        number = self.owner_number(environment_id)
        return self.person_name(number) if number else ""

    def person_name(self, number: int) -> str:
        names = [user.name for user in self.users.numbered([number])]
        return names[0] if names and names[0] else f"user {number}"

    def is_colleague(self, actor: Actor, environment_id: int) -> bool:
        if actor.kind != ActorKind.USER:
            return False
        owner = self.owner_number(environment_id)
        return owner != 0 and actor.stamp != Actor.user(owner).stamp

    def start_refusal(self, environment: Environment, person: int) -> str:
        owner = self.owner_number(environment.row_id)
        if not owner or owner == person:
            return ""
        return f"environment {environment.name} is {self.owner_name(environment.row_id) or f'user {owner}'}'s: an agent starts only in your own environment, so one session per environment holds across the team's machines"

    def write_refusal(self, actor: Actor, row: Model) -> str:
        environment_id = row.row_id if isinstance(row, Environment) and not row.is_new else getattr(row, "environment_id", 0)
        if not row.shared or isinstance(row, (Message, Link)) or not environment_id or not self.is_colleague(actor, environment_id):
            return ""
        return f"this environment is {self.owner_name(environment_id) or 'a colleague'}'s: in a colleague's environment you only comment in the chat"
