from engine.module.model_declaration import ModelDeclaration
from suites.coding.modules.checks.models.check import Check
from suites.coding.modules.checks.queries.check_query import CheckQuery


class CheckModelDeclaration(ModelDeclaration):
    """How the module declares Check."""

    model = Check
    query = CheckQuery
    excluded_subcommands = ["make", "edit", "show", "list", "delete"]
