from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.updates.commands.install_release_handler import InstallReleaseHandler
from core.modules.updates.commands.update_check_subcommand import UpdateCheckSubcommand
from core.modules.updates.commands.update_install_subcommand import UpdateInstallSubcommand
from core.modules.updates.migrations.m001_releases import ReleasesTableMigration
from core.modules.updates.models.enums.update_setting import UPDATE_SETTINGS
from core.modules.updates.models.release import Release


class UpdatesModule(Module):
    """Adds the update check: the newest release at the address install.sh downloads from, told apart by its
    archive's checksum, installed into the journal's code by the user, and the Updates window."""

    name = "journal.core.updates"
    seed_reason = "a demo installs no release"
    move_reason = "version 4's release messages were written for version 4's releases"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.settings"]
    settings = UPDATE_SETTINGS
    models = [ModelDeclaration(Release, excluded_subcommands=["make", "edit", "delete"])]
    migrations = [ReleasesTableMigration]
    handlers = [InstallReleaseHandler]
    subcommands = (UpdateCheckSubcommand, UpdateInstallSubcommand)
    windows = [WindowDeclaration("updates.updates", "Updates", "updates.js", WindowLoading.COMPONENT, icon=WindowIcon.UPDATE,
                                 reads=["update check", "release list"], runs=["update install"], events=["release.*"])]
