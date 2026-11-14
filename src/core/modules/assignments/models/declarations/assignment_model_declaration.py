from engine.module.model_declaration import ModelDeclaration
from core.modules.assignments.models.assignment import Assignment


class AssignmentModelDeclaration(ModelDeclaration):
    """How the module declares Assignment."""

    model = Assignment
    excluded_subcommands = ["make", "edit"]
