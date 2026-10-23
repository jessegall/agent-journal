from journal.db.schema import Schema
from journal.sync.journal_copy import JournalCopy
from journal.sync.team_account import TeamAccount
from journal.sync.team_server_link import TeamServerLink
from sync_server.leases import UPGRADE_LEASE


class TeamUpgrade:
    """A joined journal's upgrade to the team's version: before the new version installs it takes the team server's upgrade lease, which holds every other device's pushes, and marks itself the upgrader in team.json, so the new version's seeds write the shipped shared rows on this machine alone; once the new version has booted and migrated it uploads its migrated copy in place of the team's when the team's rows are on an older migration than its own, then lets the lease go and the mark with it."""

    def __init__(self, account: TeamAccount, link: TeamServerLink, schema: Schema, copy: JournalCopy) -> None:
        self.account, self.link, self.schema, self.copy = account, link, schema, copy

    def claim(self) -> None:
        self.link.acquire_lease(UPGRADE_LEASE)
        self.account.write({**self.account.contents(), "upgrade": True})

    def finish(self) -> None:
        self.link.acquire_lease(UPGRADE_LEASE)
        if self.link.summary(self.account.address()).migration < self.schema.version():
            rows = self.copy.rows()
            answer = self.link.upgrade(rows, self.copy.highest(rows), self.account.sequence())
            self.account.record_sequence(answer.head)
        self.link.release_lease(UPGRADE_LEASE)
        self.account.write({**self.account.contents(), "upgrade": False})
