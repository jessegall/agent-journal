from core.base.actor import Actor
from core.base.change.event_log import REGISTRY_SYNC_EVENT
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.viewer.window_permission_prune import WindowPermissionPrune


class PermissionPruner(CommitListener):
    """After the installed modules change, deletes the permissions of the windows and modules that are gone."""

    name = "viewer.prune-permissions"
    event = REGISTRY_SYNC_EVENT

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: LoggedEvent) -> None:
        self.bus.run(WindowPermissionPrune(), Actor.core(), cause_id=event.id)
