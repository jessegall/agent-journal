from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.database.database import Database
from engine.module.journal_container import synced_container
from engine.journal.journal_home import JournalHome
from core.modules.updates.commands.record_release_install.record_release_install import RecordReleaseInstall
from core.modules.updates.models.enums.update_step import UpdateStep
from engine.serving.update_steps import UpdateSteps


class ReleaseInstallSteps(UpdateSteps):
    """Records a background handover's progress through a separate database connection."""

    def __init__(self, home: JournalHome, install_id: int) -> None:
        self.home, self.install_id = home, install_id

    def record(self, step: str, detail: str = "") -> None:
        container = synced_container(self.home)
        try:
            container.get(Bus).run(RecordReleaseInstall(self.install_id, UpdateStep(step), detail), Actor.core())
        finally:
            container.get(Database).close()
