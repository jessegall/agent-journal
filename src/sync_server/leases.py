from sync_server.account import Account
from sync_server.accounts import Accounts
from sync_server.db.lease_rows import LeaseRows
from sync_server.db.store import Store
from sync_server.device import Device
from sync_server.lease import Lease
from sync_server.refusal import Refusal

LAPSE_SECONDS = 90
UPGRADE_LEASE = "upgrade"


class Leases:
    """Named leases, one device at a time, which know no journal concept: a device acquires a name nobody holds, or one whose holder stopped renewing it for LAPSE_SECONDS, renews it by acquiring it again, and lets it go; two devices racing for one name are settled in one transaction, so exactly one wins. While a device holds the upgrade lease, no other device may push."""

    def __init__(self, store: Store, rows: LeaseRows, accounts: Accounts) -> None:
        self.store, self.rows, self.accounts = store, rows, accounts

    def acquire(self, name: str, device: Device, person: Account, request_at: float) -> Lease:
        with self.store.transaction():
            standing = self.state(name, request_at)
            if standing.excludes(device.id):
                raise Refusal(f"{name} is held by {standing.holder}, last seen {request_at - standing.renewed_at:.0f} seconds ago")
            self.rows.write(name, device.id, person.id, request_at)
            return self.state(name, request_at)

    def is_holder(self, name: str, device: Device, request_at: float) -> bool:
        standing = self.state(name, request_at)
        return standing.device_id == device.id and not standing.is_lapsed

    def require_free(self, name: str, device: Device, request_at: float) -> None:
        standing = self.state(name, request_at)
        if standing.excludes(device.id):
            raise Refusal(f"the team is upgrading on {standing.holder}'s machine: this journal's changes wait until it is done")

    def release(self, name: str, device: Device, request_at: float) -> Lease:
        with self.store.transaction():
            if self.state(name, request_at).device_id == device.id:
                self.rows.remove(name)
            return self.state(name, request_at)

    def state(self, name: str, request_at: float) -> Lease:
        row = self.rows.current(name)
        if row is None:
            return Lease(name)
        return Lease(name, row["device_id"], self.accounts.find(row["account_id"]).name, row["renewed_at"], request_at - row["renewed_at"] > LAPSE_SECONDS)
