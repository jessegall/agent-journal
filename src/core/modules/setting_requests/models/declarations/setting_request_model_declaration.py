from engine.module.model_declaration import ModelDeclaration
from core.modules.setting_requests.models.setting_request import SettingRequest


class SettingRequestModelDeclaration(ModelDeclaration):
    """How the module declares SettingRequest."""

    model = SettingRequest
    excluded_subcommands = ["make", "edit", "delete"]
