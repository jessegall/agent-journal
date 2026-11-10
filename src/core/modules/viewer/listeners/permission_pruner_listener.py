from engine.actor.actor import Actor
from core.base.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.viewer.commands.prune_window_permissions.prune_window_permissions import PruneWindowPermissions
from core.base.change.registry_synced import RegistrySynced


class PermissionPrunerListener(CommitListener[RegistrySynced]):
    """After the installed modules change, deletes the permissions of the windows and modules that are gone.
    """

    name = "viewer.prune-permissions"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: RegistrySynced, logged: LoggedEvent) -> None:
        self.bus.run(PruneWindowPermissions(), Actor.core(), cause_id=logged.id)
