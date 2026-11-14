from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.hook_timeout_notice import HookTimeoutNotice


class HookTimeoutNoticeModelDeclaration(ModelDeclaration):
    """How the module declares HookTimeoutNotice."""

    model = HookTimeoutNotice
    excluded_subcommands = ["make", "edit", "delete"]
