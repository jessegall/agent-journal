import tempfile
from pathlib import Path

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.journal_home import JournalHome
from core.base.repository.repository import Repository
from core.modules.updates.commands.install_release.install_release import InstallRelease
from core.modules.updates.models.release import Release
from core.modules.updates.support.release_source import ReleaseSource
from install.code_handover import CodeHandover


class InstallReleaseHandler(Handler[InstallRelease, Release]):
    """Downloads the newest release, checks its archive against its checksum, copies its code beside the running
    code, starts the hand-over to a server on that code, and records the release."""

    command = InstallRelease

    def __init__(self, source: ReleaseSource, home: JournalHome, repository: Repository) -> None:
        self.source, self.home, self.repository = source, home, repository

    def handle(self, command: InstallRelease, context: Context) -> Release:
        release = self.source.newest(online=True)
        with tempfile.TemporaryDirectory() as folder:
            CodeHandover(self.home).begin(self.source.unpacked(release, Path(folder)))
        return self.repository.save(Release(creator_id=context.actor.id, checksum=release.checksum, tag=release.tag), context)
