from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.guard.guard_switches import GuardSwitches
from core.modules.settings.migrations.m001_settings import SettingsTableMigration
from core.modules.settings.bindings.setting_guard_switches import SettingGuardSwitches
from core.base.module.module import Module
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.sync_notes import SyncNotes
from core.modules.settings.models.setting import Setting
from core.modules.settings.support.undeclared_setting_notes import UndeclaredSettingNotes
from core.modules.settings.models.secret_setting import SecretSetting
from core.modules.settings.migrations.m002_secret_settings import SecretSettingsTableMigration
from core.modules.settings.commands.set_setting_handler import SetSettingHandler
from core.modules.settings.commands.set_setting_subcommand import SetSettingSubcommand
from core.modules.settings.commands.switch_setting_group_handler import SwitchSettingGroupHandler
from core.modules.settings.commands.switch_setting_group_subcommand import SwitchSettingGroupSubcommand
from core.modules.settings.commands.setting_show_subcommand import SettingShowSubcommand
from core.modules.settings.commands.setting_tree_subcommand import SettingTreeSubcommand
from core.modules.settings.support.settings_tree import SETTINGS_SETTINGS
from core.modules.settings.upgrade.settings_move import SettingsMove


class SettingsModule(Module):
    """Adds settings: values kept for an environment or for the whole project, set and read by the keys modules
    declare, a secret kept apart from the event log."""

    name = "journal.core.settings"
    seed_reason = "its rows are the settings the other modules declare"
    requires_core = ">=5,<6"
    settings = SETTINGS_SETTINGS
    dependencies = ["journal.core.actors", "journal.core.environments"]
    models = [ModelDeclaration(Setting, excluded_subcommands=["show"]), ModelDeclaration(SecretSetting, excluded_subcommands=["make", "list", "show"])]
    migrations = [SettingsTableMigration, SecretSettingsTableMigration]
    handlers = [SetSettingHandler, SwitchSettingGroupHandler]
    windows = [WindowDeclaration("settings.settings", "Settings", "settings.js", WindowLoading.COMPONENT, icon=WindowIcon.MENU,
                                 reads=["setting tree"], runs=["setting set", "setting switch"], events=["setting.*"])]
    subcommands = (SetSettingSubcommand, SwitchSettingGroupSubcommand, SettingShowSubcommand, SettingTreeSubcommand)
    bindings = [(GuardSwitches, SettingGuardSwitches), (SyncNotes, UndeclaredSettingNotes)]
    moves = [SettingsMove]
