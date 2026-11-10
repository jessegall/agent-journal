from engine.actor.actor import Actor
from core.base.change.journal_booting import JournalBooting
from core.base.change.logged_event import LoggedEvent
from engine.version.code_versions import CodeVersions
from engine.command.bus import Bus
from engine.journal.journal_home import JournalHome
from core.base.listener.commit_listener import CommitListener
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.updates.commands.record_release_install.record_release_install import RecordReleaseInstall
from core.modules.updates.models.enums.update_step import UpdateStep
from core.modules.updates.models.release_install import ReleaseInstall


class ReleaseInstallListener(CommitListener[JournalBooting]):
    """The activated server confirms installation attempts for the code it now serves."""

    name = "updates.release-installed"

    def __init__(self, home: JournalHome, queries: Queries, bus: Bus) -> None:
        self.home, self.queries, self.bus = home, queries, bus

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        active = CodeVersions(self.home).link.resolve().name
        installs = self.queries.query(ReleaseInstall).filter(code_version=active).matching(Among("step", [UpdateStep.PROOF, UpdateStep.HANDOVER, UpdateStep.SERVING])).all_rows()
        for install in installs:
            self.bus.run(RecordReleaseInstall(install.id, UpdateStep.FINISHED), Actor.core())
