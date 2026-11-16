from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.journal_booting import JournalBooting
from engine.event.logged_event import LoggedEvent
from engine.event.registry_synced import RegistrySynced
from engine.listener.commit.commit_listener import CommitListener
from core.modules.drivers.commands.advance_driver_versions.advance_driver_versions import AdvanceDriverVersions


class JournalStartReadVersionsListener(CommitListener[JournalBooting | RegistrySynced]):
    """A server boot and a module sync, which publish profiles and may change a driver's table, move the
    driver version of every environment."""

    name = "drivers.journal-start-basis"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: JournalBooting | RegistrySynced, logged: LoggedEvent) -> None:
        self.bus.run(AdvanceDriverVersions(), Actor.core(), cause_id=logged.id)
