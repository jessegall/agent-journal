import tempfile
from pathlib import Path

from engine.time.clock import Clock
from core.base.command.context import Context
from core.base.command.bus import Bus
from engine.version.code_versions import CodeVersions
from core.base.command.handler import Handler
from engine.journal.journal_home import JournalHome
from engine.repository.repository import Repository
from core.modules.updates.commands.install_release.install_release import InstallRelease
from core.modules.updates.models.release_install import ReleaseInstall
from core.modules.updates.models.enums.update_step import UpdateStep
from core.modules.updates.commands.record_release_install.record_release_install import RecordReleaseInstall
from core.modules.updates.support.release_install_steps import ReleaseInstallSteps
from core.modules.updates.support.release_source import ReleaseSource
from core.base.serving.code_handover import CodeHandover


class InstallReleaseHandler(Handler[InstallRelease, ReleaseInstall]):
    """Downloads the newest release, checks its archive against its checksum, copies its code beside the running
    code, and records an attempt before starting the asynchronous handover."""

    command = InstallRelease
    runs_once = True

    def __init__(self, source: ReleaseSource, home: JournalHome, repository: Repository, bus: Bus, clock: Clock) -> None:
        self.source, self.home, self.repository, self.bus, self.clock = source, home, repository, bus, clock

    def handle(self, command: InstallRelease, context: Context) -> ReleaseInstall:
        release = self.source.newest(online=True)
        with tempfile.TemporaryDirectory() as folder:
            tag = CodeVersions(self.home).add(self.source.unpacked(release, Path(folder)), self.clock)
        install = self.repository.save(ReleaseInstall(creator_id=context.actor.id, checksum=release.checksum,
                                                      tag=release.tag, code_version=tag), context)
        handover = CodeHandover(self.home, ReleaseInstallSteps(self.home, install.id))
        running_pid = handover.server_pid()
        if not running_pid:
            handover.request_takeover(tag, "")
            return self.bus.dispatch(RecordReleaseInstall(install.id, UpdateStep.FINISHED), context)
        handover.begin_version(tag, running_pid)
        return install
