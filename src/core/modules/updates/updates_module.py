from core.modules.updates.declarations.updates_subcommands import UPDATES_SUBCOMMANDS
from core.modules.updates.windows.updates_windows import UPDATES_WINDOWS
from core.modules.updates.models.declarations.release_install_model_declaration import ReleaseInstallModelDeclaration
from core.modules.updates.models.declarations.release_model_declaration import ReleaseModelDeclaration
from core.modules.updates.migrations.m002_release_installs import ReleaseInstallsMigration
from core.modules.updates.commands.record_release_install.record_release_install_handler import RecordReleaseInstallHandler
from core.modules.updates.listeners.release_install_listener import ReleaseInstallListener
from engine.module.module import Module
from core.modules.updates.commands.install_release.install_release_handler import InstallReleaseHandler
from core.modules.updates.commands.show_update_step.show_update_step_handler import ShowUpdateStepHandler
from core.modules.updates.marks.server_update_mark import ServerUpdateMark
from core.modules.updates.migrations.m001_releases import ReleasesTableMigration
from core.modules.updates.models.enums.update_setting import UPDATE_SETTINGS
from core.modules.updates.upgrade.updates_move import UpdatesMove


class UpdatesModule(Module):
    """Adds the update check: the newest release at the address install.sh downloads from, told apart by its
    archive's checksum, installed into the journal's code by the user, and the Updates window."""

    name = "journal.core.updates"
    seed_reason = "a demo installs no release"
    moves = [UpdatesMove]
    requires_engine = ">=6,<7"
    dependencies = ["journal.core.actors", "journal.core.chat", "journal.core.settings"]
    settings = UPDATE_SETTINGS
    models = [ReleaseInstallModelDeclaration, ReleaseModelDeclaration]
    migrations = [ReleasesTableMigration, ReleaseInstallsMigration]
    listeners = [ReleaseInstallListener]
    handlers = [RecordReleaseInstallHandler, InstallReleaseHandler, ShowUpdateStepHandler]
    subcommands = UPDATES_SUBCOMMANDS
    marks = [ServerUpdateMark]
    windows = UPDATES_WINDOWS
