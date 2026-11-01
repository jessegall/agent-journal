import tempfile
from pathlib import Path

from core.base.actor_type import ActorType
from core.base.code_copy import CodeCopy
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.journal_home import JournalHome
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.updates.commands.install_release.install_release import InstallRelease
from core.modules.updates.models.release import Release
from core.modules.updates.support.release_source import ReleaseSource


class InstallReleaseHandler(Handler[InstallRelease, Release]):
    """Downloads the newest release, checks its archive against its checksum, copies its code into the journal's
    src folder, which the server reloads from at its next request, and records the release; only the user
    installs one."""

    command = InstallRelease

    def __init__(self, source: ReleaseSource, home: JournalHome, repository: Repository) -> None:
        self.source, self.home, self.repository = source, home, repository

    def handle(self, command: InstallRelease, context: Context) -> Release:
        if context.actor.type is not ActorType.USER:
            raise Refusal("only the user installs a release, with the Install button on the Updates window", "journal update check tells you whether one is out")
        release = self.source.newest(fresh=True)
        with tempfile.TemporaryDirectory() as folder:
            CodeCopy(self.source.unpacked(release, Path(folder)), self.home).make()
        return self.repository.save(Release(creator_id=context.actor.id, checksum=release.checksum, tag=release.tag), context)
