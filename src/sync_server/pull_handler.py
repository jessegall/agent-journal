from sync_server.change_log import ChangeLog
from sync_server.devices import Devices
from sync_server.pull_answer import PullAnswer
from sync_server.server_clock import ServerClock

WAIT_SECONDS = 25


class PullHandler:
    """Answers a device with the team's changes past the sequence it holds, not its own, in order; while none are new it holds the request up to WAIT_SECONDS and answers the moment one arrives. The sequence it holds is recorded, so the log can be trimmed once every device is past it."""

    def __init__(self, log: ChangeLog, devices: Devices, clock: ServerClock) -> None:
        self.log, self.devices, self.clock = log, devices, clock

    def answer(self, token: str, sequence: int, wait_seconds: float) -> PullAnswer:
        device = self.devices.device(token)
        self.devices.record_pull(device, sequence)
        deadline = self.clock.monotonic() + min(wait_seconds, WAIT_SECONDS)
        head = self.log.head()
        changes = self.log.pull_page(sequence, device.id)
        while not changes and not self.log.is_closed and self.clock.monotonic() < deadline:
            self.log.wait_past(head, deadline - self.clock.monotonic())
            head = self.log.head()
            changes = self.log.pull_page(sequence, device.id)
        return PullAnswer(tuple(changes), changes[-1].sequence if changes else head, self.clock.time())
