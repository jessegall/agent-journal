from dataclasses import replace

from engine.version.code_versions import CodeVersions
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.journal.journal_home import JournalHome
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.updates.commands.record_release_install.record_release_install import RecordReleaseInstall
from core.modules.updates.models.enums.update_step import UpdateStep
from core.modules.updates.models.release import Release
from core.modules.updates.models.release_install import ReleaseInstall


class RecordReleaseInstallHandler(Handler[RecordReleaseInstall, ReleaseInstall]):
    """Confirms a release only once its code became active; failed attempts remain available to retry."""

    command = RecordReleaseInstall

    def __init__(self, queries: Queries, repository: Repository, home: JournalHome) -> None:
        self.queries, self.repository, self.home = queries, repository, home

    def handle(self, command: RecordReleaseInstall, context: Context) -> ReleaseInstall:
        install = self.queries.query(ReleaseInstall).find(command.install_id)
        if install.step.is_ended:
            return install
        if command.step is UpdateStep.FINISHED:
            if CodeVersions(self.home).link.resolve().name != install.code_version:
                raise Refusal("the release's code has not taken over", "retry with journal update install")
            self.repository.save(Release(creator_id=install.creator_id, checksum=install.checksum, tag=install.tag), context)
        return self.repository.save(replace(install, step=command.step, detail=command.detail), context)
