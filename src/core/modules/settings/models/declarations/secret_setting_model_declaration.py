from engine.module.model_declaration import ModelDeclaration
from core.modules.settings.models.secret_setting import SecretSetting


class SecretSettingModelDeclaration(ModelDeclaration):
    """How the module declares SecretSetting."""

    model = SecretSetting
    excluded_subcommands = ["make", "list", "show"]
