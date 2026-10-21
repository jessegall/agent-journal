from journal.features.seed import Seed
from journal.models.journal_version import JournalVersion
from journal.repositories.journal_versions import JournalVersions
from journal.support.actor import Actor
from journal.version import VERSION


class VersionChange(Seed):
    """At boot, the version the journal runs is kept as the one it started on, and a change from the last is told as the journal having been updated; the first start of a journal tells nothing."""

    def __init__(self, versions: JournalVersions) -> None:
        self.versions = versions

    def run(self) -> None:
        last = self.versions.current()
        if last is None:
            self.versions.save(JournalVersion(version=VERSION), Actor.system())
        elif last.version != VERSION:
            self.versions.save(last.started(VERSION), Actor.system())
