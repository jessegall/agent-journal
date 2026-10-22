from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.repositories.environment_owners import OWNER
from journal.models.environment import Environment
from journal.models.link import Link
from journal.models.support.ref import Ref
from journal.models.user import User
from journal.repositories.links import Links
from journal.sync.team_account import TeamAccount


class EnvironmentOwnerRecord(Listener[Created]):
    """An environment made on this machine is owned by this machine's person, linked from their user row; one pulled from a colleague's machine arrives with its own link, and the Team chat is owned by no one."""

    blocking = True

    def __init__(self, links: Links, account: TeamAccount) -> None:
        self.links, self.account = links, account

    def handle(self, event: Created) -> None:
        if isinstance(event.model, Environment) and not event.model.is_team_chat:
            self.links.save(Link(source=Ref(User.table(), self.account.user_number()), target=Ref.build(event.model), kind=OWNER), event.actor)
