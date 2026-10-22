import hashlib
import secrets

from sync_server.account import Account
from sync_server.accounts import Accounts
from sync_server.db.device_rows import DeviceRows
from sync_server.db.failed_login_rows import FailedLoginRows
from sync_server.device import Device
from sync_server.refusal import Refusal

FAILURES_ALLOWED = 5
LOCKOUT_SECONDS = 15 * 60


class Devices:
    """The machines that may reach the team server: a login trades an email and a password for a device token, kept only as a hash; too many failed logins from one address shut it out for a while. The address is the one the proxy in front forwards, since every request reaches the server from the proxy."""

    def __init__(self, rows: DeviceRows, failures: FailedLoginRows, accounts: Accounts) -> None:
        self.rows, self.failures, self.accounts = rows, failures, accounts

    def login(self, email: str, password: str, name: str, address: str, login_at: float) -> tuple[Device, str]:
        if self.failures.count(address, login_at - LOCKOUT_SECONDS) >= FAILURES_ALLOWED:
            raise Refusal(f"too many failed logins from {address}: try again in {LOCKOUT_SECONDS // 60} minutes")
        try:
            person = self.accounts.verified(email, password)
        except Refusal:
            self.failures.insert(address, login_at)
            raise
        token = secrets.token_urlsafe(32)
        return self.find(self.rows.insert(person.id, name, self.token_hash(token), login_at)), token

    def person(self, token: str) -> Account:
        return self.accounts.find(self.device(token).account_id)

    def device(self, token: str) -> Device:
        row = self.rows.with_token_hash(self.token_hash(token))
        if row is None:
            raise Refusal("this device is not known to the team: log in again with journal team login")
        device = self.find(row["id"])
        if device.is_revoked():
            raise Refusal("this device was revoked: log in again with journal team login")
        return device

    def find(self, id: int) -> Device:
        row = self.rows.numbered(id)
        if row is None:
            raise Refusal(f"no device {id}")
        return Device(row["id"], row["account_id"], row["name"], row["revoked_at"])

    def listed(self) -> list[Device]:
        return [self.find(id) for id in self.rows.ids()]

    def revoke(self, id: int, revoked_at: float) -> Device:
        self.find(id)
        self.rows.revoke(id, revoked_at)
        return self.find(id)

    @staticmethod
    def token_hash(token: str) -> str:
        return hashlib.sha256(token.encode()).hexdigest()
