from core.modules.settings.declarations.settings_migrations import SETTINGS_MIGRATIONS
from core.modules.settings.declarations.settings_handlers import SETTINGS_HANDLERS
from core.modules.settings.declarations.settings_subcommands import SETTINGS_SUBCOMMANDS
from core.modules.settings.declarations.settings_bindings import SETTINGS_BINDINGS
from core.modules.settings.windows.settings_windows import SETTINGS_WINDOWS
from core.modules.settings.models.declarations.setting_model_declaration import SettingModelDeclaration
from core.modules.settings.models.declarations.secret_setting_model_declaration import SecretSettingModelDeclaration
from engine.module.module import Module
from core.modules.settings.guards.person_set_setting_guard import PersonSetSettingGuard
from core.modules.settings.listeners.setting_rows_listener import SettingRowsListener
from core.modules.settings.support.settings_tree import SETTINGS_SETTINGS
from core.modules.settings.upgrade.settings_move import SettingsMove


class SettingsModule(Module):
    """Adds settings: values kept for an environment or for the whole project, set and read by the keys
    modules declare, a secret kept apart from the event log."""

    name = "journal.core.settings"
    seed_reason = "its rows are the settings the other modules declare"
    requires_engine = ">=7,<8"
    file_events = ["managed-hook.changed", "managed-hook.scanned", "managed-hook.restored"]
    settings = SETTINGS_SETTINGS
    dependencies = ["journal.core.actors", "journal.core.environments"]
    models = [SettingModelDeclaration, SecretSettingModelDeclaration]
    migrations = SETTINGS_MIGRATIONS
    handlers = SETTINGS_HANDLERS
    windows = SETTINGS_WINDOWS
    subcommands = SETTINGS_SUBCOMMANDS
    bindings = SETTINGS_BINDINGS
    guards = [PersonSetSettingGuard]
    listeners = [SettingRowsListener]
    moves = [SettingsMove]
