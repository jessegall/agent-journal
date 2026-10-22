from dataclasses import replace

from sync_server.account import Account
from sync_server.change_log import ChangeLog
from sync_server.devices import Devices
from sync_server.logged_change import LoggedChange
from sync_server.push_answer import PushAnswer
from sync_server.push_request import PushRequest
from sync_server.pushed_change import PushedChange
from sync_server.refusal import Refusal
from sync_server.rejected_field import RejectedField
from sync_server.row_settlement import RowSettlement
from sync_server.settlement import Settlement

USER_PREFIX = "user:"


class PushHandler:
    """Takes one device's queued changes in order: each is stamped with the person whose device sent it, never with what the request says, its times put on the server's clock by the device's offset, and its fields settled against the row as the server holds it. A change that names another person as its writer refuses the whole push before anything is kept."""

    def __init__(self, log: ChangeLog, devices: Devices) -> None:
        self.log, self.devices = log, devices

    def answer(self, token: str, request: PushRequest, received_at: float) -> PushAnswer:
        device, person = self.devices.device(token), self.devices.person(token)
        changes = [self.stamped(change, person, device.id, request.clock_offset) for change in request.changes]
        settlements = [self.outcome(change) for change in changes]
        return PushAnswer(tuple(settlement.change.sequence for settlement in settlements), tuple(self.add_writer_name(field) for settlement in settlements for field in settlement.rejected), received_at)

    def add_writer_name(self, field: RejectedField) -> RejectedField:
        return replace(field, writer=self.devices.accounts.find(int(field.writer)).name) if field.writer else field

    def stamped(self, change: PushedChange, person: Account, device_id: int, clock_offset: float) -> LoggedChange:
        if change.actor.startswith(USER_PREFIX) and change.actor != f"{USER_PREFIX}{person.id}":
            raise Refusal(f"a change names {change.actor} as its writer, but this device is {person.name}'s: a person sends only their own writes")
        return change.logged_change(person.id, device_id, clock_offset)

    def outcome(self, change: LoggedChange) -> Settlement:
        settlement = RowSettlement.outcome(change, self.log.row(change.row_table, change.row), self.log.is_deleted(change.row_table, change.row))
        if settlement.is_empty():
            return settlement
        return Settlement(self.log.appended(settlement.change), settlement.rejected)
