from sync_server.accounts import Accounts
from sync_server.devices import Devices
from sync_server.people_answer import PeopleAnswer
from sync_server.team_person import TeamPerson


class PeopleHandler:
    """Answers any device of the team with the team's people, each with their role and when a device of theirs last pulled, so a journal can say who is on the team and who was seen lately."""

    def __init__(self, accounts: Accounts, devices: Devices) -> None:
        self.accounts, self.devices = accounts, devices

    def answer(self, token: str) -> PeopleAnswer:
        self.devices.device(token)
        devices = [device for device in self.devices.listed() if not device.is_revoked()]
        return PeopleAnswer(tuple(TeamPerson(account.id, account.name, account.role, max((d.pulled_at for d in devices if d.account_id == account.id), default=0.0)) for account in self.accounts.active()))
