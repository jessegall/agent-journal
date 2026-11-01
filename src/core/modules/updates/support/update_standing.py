from dataclasses import dataclass

from core.modules.updates.models.release import Release
from core.modules.updates.support.published_release import PublishedRelease


@dataclass(frozen=True)
class UpdateStanding:
    """The newest release beside the one this journal runs, when one is recorded."""

    newest: PublishedRelease
    installed: Release | None

    @property
    def line(self) -> str:
        tag = f" {self.newest.tag}" if self.newest.tag else ""
        if self.installed is None:
            return f"the release this journal runs is not recorded: journal update install puts in the newest release{tag}"
        if self.installed.checksum == self.newest.checksum:
            return f"up to date: this journal runs the newest release{tag}"
        return f"a newer release{tag} is out: journal update install puts it in"
