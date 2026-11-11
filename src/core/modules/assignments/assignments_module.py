from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from core.modules.assignments.commands.assign.assign_handler import AssignHandler
from core.modules.assignments.commands.assign.assign_subcommand import AssignSubcommand
from core.modules.assignments.commands.unassign.unassign_handler import UnassignHandler
from core.modules.assignments.commands.unassign.unassign_subcommand import UnassignSubcommand
from core.modules.assignments.migrations.m001_assignments import AssignmentsTableMigration
from core.modules.assignments.models.assignment import Assignment


class AssignmentsModule(Module):
    """Adds assignments: any row of a model that declares itself assignable can be given to actors."""

    name = "journal.core.assignments"
    requires_core = ">=5,<6"
    move_reason = "version 4 has no assignments table: it kept who works on a task in a column of the task"
    seed_reason = "an assignment shows on the row it is about, which the module of that row seeds"
    dependencies = ["journal.core.actors", "journal.core.agents"]
    models = [ModelDeclaration(Assignment, excluded_subcommands=["make", "edit"])]
    migrations = [AssignmentsTableMigration]
    subcommands = [AssignSubcommand, UnassignSubcommand]
    handlers = [AssignHandler, UnassignHandler]
