from engine.module.model_declaration import ModelDeclaration
from core.modules.usage.models.statistic import Statistic


class StatisticModelDeclaration(ModelDeclaration):
    """How the module declares Statistic."""

    model = Statistic
    excluded_subcommands = ["make", "edit", "show", "list", "delete"]
