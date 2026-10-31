from core.base.module.module import Module
from core.base.module.noun import Noun
from core.settings.setting import Setting


class SettingsModule(Module):
    """Adds settings: values kept for an environment or for the whole project."""

    name = "settings"
    requires_core = ">=5,<6"
    dependencies = ("actors", "environments")
    nouns = (Noun(Setting),)
    migrations = ("core.settings.migrations.m001_settings:SettingsTable",)
    bindings = (("core.base.guard.guard_switches:GuardSwitches", "core.settings.setting_guard_switches:SettingGuardSwitches"),)
