from sync_server.account import Account
from sync_server.accounts import Accounts
from sync_server.device import Device
from sync_server.device_list import DeviceList
from sync_server.devices import Devices
from sync_server.invitation_answer import InvitationAnswer
from sync_server.invitations import Invitations
from sync_server.server_clock import ServerClock
from sync_server.team_details import TeamDetails
from sync_server.team_summary import TeamSummary


class AdminHandler:
    """What only an admin does: invite a person by email, list the devices, revoke one, remove a person with every device of theirs, pin the team to a journal version, and say whether a journal must run exactly it."""

    def __init__(self, devices: Devices, accounts: Accounts, invitations: Invitations, clock: ServerClock, details: TeamDetails) -> None:
        self.devices, self.accounts, self.invitations, self.clock, self.details = devices, accounts, invitations, clock, details

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

    def pin(self, token: str, version: str) -> TeamSummary:
        self.devices.admin(token)
        self.details.record_version(version)
        return self.details.answer()

    def allow(self, token: str, rule: str) -> TeamSummary:
        self.devices.admin(token)
        self.details.record_versions(rule)
        return self.details.answer()

    def remove(self, token: str, account_id: int) -> Account:
        self.devices.admin(token)
        removed = self.accounts.remove(account_id, self.clock.time())
        self.devices.revoke_person(account_id, self.clock.time())
        return removed
