from sync_server.account import Account
from sync_server.accounts import Accounts
from sync_server.device import Device
from sync_server.device_list import DeviceList
from sync_server.devices import Devices
from sync_server.invitation_answer import InvitationAnswer
from sync_server.invitations import Invitations
from sync_server.server_clock import ServerClock


class AdminHandler:
    """What only an admin does: invite a person by email, list the devices, revoke one, and remove a person with every device of theirs."""

    def __init__(self, devices: Devices, accounts: Accounts, invitations: Invitations, clock: ServerClock) -> None:
        self.devices, self.accounts, self.invitations, self.clock = devices, accounts, invitations, clock

    def invite(self, token: str, email: str) -> InvitationAnswer:
        self.devices.admin(token)
        code, expires_at = self.invitations.issue(email, self.clock.time())
        return InvitationAnswer(code, email.lower(), expires_at)

    def listed(self, token: str) -> DeviceList:
        self.devices.admin(token)
        return DeviceList(tuple(self.devices.listed()))

    def revoke(self, token: str, device_id: int) -> Device:
        self.devices.admin(token)
        return self.devices.revoke(device_id, self.clock.time())

    def remove(self, token: str, account_id: int) -> Account:
        self.devices.admin(token)
        removed = self.accounts.remove(account_id, self.clock.time())
        self.devices.revoke_person(account_id, self.clock.time())
        return removed
