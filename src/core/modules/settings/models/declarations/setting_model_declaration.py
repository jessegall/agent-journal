from engine.module.model_declaration import ModelDeclaration
from core.modules.settings.models.setting import Setting


class SettingModelDeclaration(ModelDeclaration):
    """How the module declares Setting."""

    model = Setting
    excluded_subcommands = ["show"]
