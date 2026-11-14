from engine.module.model_declaration import ModelDeclaration
from suites.coding.modules.workers.models.affected_test import AffectedTest


class AffectedTestModelDeclaration(ModelDeclaration):
    """How the module declares AffectedTest."""

    model = AffectedTest
    excluded_subcommands = ["make", "edit", "delete"]
