from dataclasses import replace

from sync_server.account import Account
from sync_server.change_log import ChangeLog
from sync_server.db.store import Store
from sync_server.devices import Devices
from sync_server.logged_change import LoggedChange
from sync_server.push_answer import PushAnswer
from sync_server.push_request import PushRequest
from sync_server.push_results import PushResults
from sync_server.pushed_change import PushedChange
from sync_server.refusal import Refusal
from sync_server.rejected_field import RejectedField
from sync_server.row_settlement import RowSettlement
from sync_server.settlement import Settlement

USER_PREFIX = "user:"


class PushHandler:
    """Takes one device's queued changes in order: each is stamped with the person whose device sent it, never with what the request says, its times put on the server's clock by the device's offset, and its fields settled against the row as the server holds it. A change that names another person as its writer refuses the whole push before anything is kept; a change the device sent before, known by its local number, is answered as it was the first time and kept once."""

    def __init__(self, store: Store, log: ChangeLog, devices: Devices, results: PushResults) -> None:
        self.store, self.log, self.devices, self.results = store, log, devices, results

    def answer(self, token: str, request: PushRequest, received_at: float) -> PushAnswer:
        device, person = self.devices.device(token), self.devices.person(token)
        changes = [(change.local_number, self.stamped(change, person, device.id, request.clock_offset)) for change in request.changes]
        settlements = [self.outcome(device.id, local_number, change) for local_number, change in changes]
        return PushAnswer(tuple(settlement.change.sequence for settlement in settlements), tuple(field for settlement in settlements for field in settlement.rejected), received_at)

    def stamped(self, change: PushedChange, person: Account, device_id: int, clock_offset: float) -> LoggedChange:
        if not self.may_send(change, person):
            raise Refusal(f"a change names {change.actor} as its writer, but this device is {person.name}'s: a person sends only their own writes")
        return change.logged_change(person.id, device_id, clock_offset)

    @staticmethod
    def may_send(change: PushedChange, person: Account) -> bool:
        return person.is_relay() or not change.actor.startswith(USER_PREFIX) or change.actor == f"{USER_PREFIX}{person.id}"

    def outcome(self, device_id: int, local_number: int, change: LoggedChange) -> Settlement:
        with self.store.transaction():
            first_answer = self.results.first_answer(device_id, local_number, change) if local_number else None
            if first_answer is not None:
                return first_answer
            settlement = self.settlement(change)
            if local_number:
                self.results.record(device_id, local_number, settlement)
            return settlement

    def settlement(self, change: LoggedChange) -> Settlement:
        settlement = RowSettlement.outcome(change, self.log.row(change.row_table, change.row), self.log.is_deleted(change.row_table, change.row))
        rejected = tuple(self.add_writer_name(field) for field in settlement.rejected)
        if settlement.is_empty():
            return Settlement(settlement.change, rejected)
        return Settlement(self.log.appended(settlement.change), rejected)

    def add_writer_name(self, field: RejectedField) -> RejectedField:
        return replace(field, writer=self.devices.accounts.find(int(field.writer)).name) if field.writer else field
