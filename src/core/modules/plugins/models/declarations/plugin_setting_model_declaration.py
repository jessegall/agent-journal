from engine.module.model_declaration import ModelDeclaration
from core.modules.plugins.models.plugin_setting import PluginSetting
from engine.module.model_declaration import ALL_SUBCOMMANDS


class PluginSettingModelDeclaration(ModelDeclaration):
    """How the module declares PluginSetting."""

    model = PluginSetting
    excluded_subcommands = ALL_SUBCOMMANDS
