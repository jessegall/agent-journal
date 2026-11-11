from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from core.modules.assignments.migrations.m001_assignments import AssignmentsTableMigration
from core.modules.assignments.models.assignment import Assignment


class AssignmentsModule(Module):
    """Adds assignments: any row of a model that declares itself assignable can be given to actors."""

    name = "journal.core.assignments"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors"]
    models = [ModelDeclaration(Assignment, excluded_subcommands=["make", "edit"])]
    migrations = [AssignmentsTableMigration]
