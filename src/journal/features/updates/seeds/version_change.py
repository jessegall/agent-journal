from journal.features.seed import Seed
from journal.features.updates.support.session_restart import SessionRestart
from journal.models.journal_version import JournalVersion
from journal.repositories.journal_versions import JournalVersions
from journal.support.actor import Actor
from journal.version import VERSION


class VersionChange(Seed):
    """At boot, the version the journal runs is kept as the one it started on, and a change from the last is told as the journal having been updated, with a notice when the change needs the agent's session started again; the first start of a journal tells nothing."""

    def __init__(self, versions: JournalVersions, restart: SessionRestart) -> None:
        self.versions, self.restart = versions, restart

    def run(self) -> None:
        last = self.versions.current()
        if last is None:
            self.versions.save(JournalVersion(version=VERSION), Actor.system())
        elif last.version != VERSION:
            self.versions.save(last.started(VERSION), Actor.system())
            if SessionRestart.is_crossed(last.version, VERSION):
                self.restart.notice()
