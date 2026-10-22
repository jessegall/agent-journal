from journal.events.listener import Listener
from journal.events.models.deleting import Deleting
from journal.events.models.model_event import ModelEvent
from journal.events.models.saving import Saving
from journal.repositories.environment_owners import EnvironmentOwners
from journal.support.rejection import Rejection

GUARDED = (Saving, Deleting)


class ColleagueWriteGuard(Listener[ModelEvent]):
    """A person's save or deletion in an environment a colleague owns is refused before it is made, but for a message."""

    blocking = True

    def __init__(self, owners: EnvironmentOwners) -> None:
        self.owners = owners

    def handle(self, event: ModelEvent) -> None:
        refusal = self.owners.write_refusal(event.actor, event.model) if isinstance(event, GUARDED) else ""
        if refusal:
            raise Rejection(refusal)
