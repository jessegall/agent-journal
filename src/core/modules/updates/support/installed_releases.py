import json
from dataclasses import dataclass

from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from engine.query.queries import Queries
from core.modules.updates.models.release import Release

INSTALLED_RELEASE_FILE = "installed-release.json"


@dataclass(frozen=True)
class InstalledRelease:
    """The code a journal runs, named as its release check names the newest release."""

    checksum: str
    tag: str


class InstalledReleases:
    """Which release this journal runs: the one journal update install recorded last, or the one install.sh named
    in the runtime folder when it installed after that, since an install from the shell records no release row."""

    def __init__(self, queries: Queries, home: JournalHome) -> None:
        self.queries, self.home = queries, home

    def installed(self) -> InstalledRelease | None:
        recorded = self.queries.query(Release).newest().first()
        named = self.named()
        if named is not None and (recorded is None or named[1] > recorded.creation_timestamp().text):
            return named[0]
        return InstalledRelease(recorded.checksum, recorded.tag) if recorded is not None else None

    # the release install.sh named, with the time it was installed
    def named(self) -> tuple[InstalledRelease, str] | None:
        file = self.home.folder / "runtime" / INSTALLED_RELEASE_FILE
        if not FileAccess.exists(file):
            return None
        try:
            values = json.loads(FileAccess.read(file))
            return InstalledRelease(str(values["checksum"]), str(values.get("tag", ""))), str(values["at"])
        except (ValueError, KeyError):
            return None
