from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.countdown import Countdown


class CountdownModelDeclaration(ModelDeclaration):
    """How the module declares Countdown."""

    model = Countdown
    excluded_subcommands = ["make", "edit", "delete"]
