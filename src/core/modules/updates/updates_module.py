from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.updates.commands.install_release.install_release_handler import InstallReleaseHandler
from core.modules.updates.commands.update_check.update_check_subcommand import UpdateCheckSubcommand
from core.modules.updates.commands.install_release.install_release_subcommand import InstallReleaseSubcommand
from core.modules.updates.commands.update_notes.update_notes_subcommand import UpdateNotesSubcommand
from core.modules.updates.migrations.m001_releases import ReleasesTableMigration
from core.modules.updates.models.support.update_setting import UPDATE_SETTINGS
from core.modules.updates.models.release import Release
from core.modules.updates.upgrade.updates_move import UpdatesMove
from core.modules.updates.support.skeletons import UPDATES_UPDATES_SKELETON


class UpdatesModule(Module):
    """Adds the update check: the newest release at the address install.sh downloads from, told apart by its
    archive's checksum, installed into the journal's code by the user, and the Updates window."""

    name = "journal.core.updates"
    seed_reason = "a demo installs no release"
    moves = [UpdatesMove]
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.settings"]
    settings = UPDATE_SETTINGS
    models = [ModelDeclaration(Release, excluded_subcommands=["make", "edit", "delete"])]
    migrations = [ReleasesTableMigration]
    handlers = [InstallReleaseHandler]
    subcommands = (UpdateCheckSubcommand, InstallReleaseSubcommand, UpdateNotesSubcommand)
    windows = [WindowDeclaration("updates.updates", "Updates", "updates.js", WindowLoading.COMPONENT, skeleton=UPDATES_UPDATES_SKELETON, group="project", icon=WindowIcon.UPDATE,
                                 reads=["update check", "update notes", "release list"], runs=["update install"], events=["release.*"])]
