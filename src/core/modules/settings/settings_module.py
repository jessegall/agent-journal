from core.modules.settings.migrations.m003_helper_driver_key import HelperDriverKeyMigration
from core.base.viewer.window_read_search import WindowReadSearch
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_key import WindowKey
from core.base.viewer.key_loading import KeyLoading
from core.base.viewer.window_place import WindowPlace
from engine.guard.guard_switches import GuardSwitches
from core.modules.settings.migrations.m001_settings import SettingsTableMigration
from core.modules.settings.bindings.setting_guard_switches import SettingGuardSwitches
from core.base.module.module import Module
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.sync_notes import SyncNotes
from core.modules.settings.models.setting import Setting
from core.modules.settings.guards.person_set_setting_guard import PersonSetSettingGuard
from core.modules.settings.listeners.setting_rows_listener import SettingRowsListener
from core.modules.settings.support.undeclared_setting_notes import UndeclaredSettingNotes
from core.modules.settings.models.secret_setting import SecretSetting
from core.modules.settings.migrations.m002_secret_settings import SecretSettingsTableMigration
from core.modules.settings.commands.set_setting.set_setting_handler import SetSettingHandler
from core.modules.settings.commands.set_setting.set_setting_subcommand import SetSettingSubcommand
from core.modules.settings.commands.set_managed_hook.set_managed_hook_handler import SetManagedHookHandler
from core.modules.settings.commands.set_managed_hook.set_managed_hook_subcommand import SetManagedHookSubcommand
from core.modules.settings.commands.scan_managed_hooks.scan_managed_hooks_handler import ScanManagedHooksHandler
from core.modules.settings.commands.scan_managed_hooks.scan_managed_hooks_subcommand import ScanManagedHooksSubcommand
from core.modules.settings.commands.restore_managed_hooks.restore_managed_hooks_handler import RestoreManagedHooksHandler
from core.modules.settings.commands.restore_managed_hooks.restore_managed_hooks_subcommand import RestoreManagedHooksSubcommand
from core.modules.settings.commands.remove_managed_hooks.remove_managed_hooks_handler import RemoveManagedHooksHandler
from core.modules.settings.commands.remove_managed_hooks.remove_managed_hooks_subcommand import RemoveManagedHooksSubcommand
from core.modules.settings.commands.list_managed_hooks.list_managed_hooks_subcommand import ListManagedHooksSubcommand
from core.modules.settings.commands.switch_setting_group.switch_setting_group_handler import SwitchSettingGroupHandler
from core.modules.settings.commands.switch_setting_group.switch_setting_group_subcommand import SwitchSettingGroupSubcommand
from core.modules.settings.commands.setting_show.setting_show_subcommand import SettingShowSubcommand
from core.modules.settings.commands.setting_tree.setting_tree_subcommand import SettingTreeSubcommand
from core.modules.settings.support.settings_tree import SETTINGS_SETTINGS
from core.modules.settings.upgrade.settings_move import SettingsMove
from core.modules.settings.support.skeletons import PROJECT_HOOKS_SKELETON, SETTINGS_SETTINGS_SKELETON


class SettingsModule(Module):
    """Adds settings: values kept for an environment or for the whole project, set and read by the keys
    modules declare, a secret kept apart from the event log."""

    name = "journal.core.settings"
    seed_reason = "its rows are the settings the other modules declare"
    requires_core = ">=5,<6"
    file_events = ["managed-hook.changed", "managed-hook.scanned", "managed-hook.restored"]
    settings = SETTINGS_SETTINGS
    dependencies = ["journal.core.actors", "journal.core.environments"]
    models = [ModelDeclaration(Setting, excluded_subcommands=["show"]), ModelDeclaration(SecretSetting, excluded_subcommands=["make", "list", "show"])]
    migrations = [HelperDriverKeyMigration, SettingsTableMigration, SecretSettingsTableMigration]
    handlers = [SetSettingHandler, SwitchSettingGroupHandler, SetManagedHookHandler, RemoveManagedHooksHandler, ScanManagedHooksHandler, RestoreManagedHooksHandler]
    windows = [WindowDeclaration("settings.settings", "Settings", "settings.js", WindowLoading.COMPONENT, skeleton=SETTINGS_SETTINGS_SKELETON, place=WindowPlace.PAGE, group="project", icon=WindowIcon.MENU, search=WindowReadSearch("setting tree", "Find a setting", ("title", "description", "key")),
                                 reads=["setting tree", "environment list", "environment cards", "alias saved"], keys=[WindowKey("settings", "setting tree", tab="settings", events=["setting.*"]), WindowKey("environments", "environment cards", tab="environments", events=["environment.*"]), WindowKey("commands", "alias saved --limit 1000", events=["alias.*"], loading=KeyLoading.REQUESTED)], runs=["setting set", "setting switch", "environment delete"], events=["setting.*", "environment.*", "alias.*"]),
               WindowDeclaration("settings.project-hooks", "Hooks", "project_hooks.js", WindowLoading.COMPONENT, place=WindowPlace.PAGE, group="project", icon=WindowIcon.MENU, skeleton=PROJECT_HOOKS_SKELETON,
                                 reads=["managed-hook list", "hook-call feed"], keys=[WindowKey("hooks", "managed-hook list", events=["managed-hook.*"])], runs=["managed-hook set", "managed-hook scan", "managed-hook give-back"], events=["managed-hook.*", "hook_call.*"])]
    subcommands = [SetSettingSubcommand, SwitchSettingGroupSubcommand, SettingShowSubcommand, SettingTreeSubcommand, ListManagedHooksSubcommand, SetManagedHookSubcommand, RemoveManagedHooksSubcommand, ScanManagedHooksSubcommand, RestoreManagedHooksSubcommand]
    bindings = {GuardSwitches: SettingGuardSwitches, SyncNotes: UndeclaredSettingNotes}
    guards = [PersonSetSettingGuard]
    listeners = [SettingRowsListener]
    moves = [SettingsMove]
