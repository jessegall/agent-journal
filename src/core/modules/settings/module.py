from core.base.guard.guard_switches import GuardSwitches
from core.modules.settings.migrations.m001_settings import SettingsTableMigration
from core.modules.settings.setting_guard_switches import SettingGuardSwitches
from core.base.module.module import Module
from core.base.module.model_declaration import ModelDeclaration
from core.modules.settings.setting import Setting


class SettingsModule(Module):
    """Adds settings: values kept for an environment or for the whole project."""

    name = "journal.core.settings"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments"]
    models = [ModelDeclaration(Setting)]
    migrations = [SettingsTableMigration]
    bindings = [(GuardSwitches, SettingGuardSwitches)]
