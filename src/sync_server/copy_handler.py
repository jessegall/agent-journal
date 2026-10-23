from sync_server.change_log import ChangeLog
from sync_server.db.store import Store
from sync_server.devices import Devices
from sync_server.full_copy import FullCopy
from sync_server.server_clock import ServerClock


class CopyHandler:
    """Answers a joining machine with every row of the team's journal and the sequence they stand at, read together so no change falls between them."""

    def __init__(self, store: Store, log: ChangeLog, devices: Devices, clock: ServerClock) -> None:
        self.store, self.log, self.devices, self.clock = store, log, devices, clock

    def answer(self, token: str) -> FullCopy:
        device = self.devices.device(token)
        with self.store.transaction():
            copy = FullCopy(tuple(self.log.copied_rows()), self.log.head(), self.clock.time())
        self.devices.record_pull(device, copy.head, self.clock.time())
        return copy
