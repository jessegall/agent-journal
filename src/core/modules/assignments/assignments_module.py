from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from core.modules.assignments.commands.assign_row.assign_row_handler import AssignRowHandler
from core.modules.assignments.commands.assign_row.assign_row_subcommand import AssignRowSubcommand
from core.modules.assignments.commands.unassign_row.unassign_row_handler import UnassignRowHandler
from core.modules.assignments.commands.unassign_row.unassign_row_subcommand import UnassignRowSubcommand
from core.modules.assignments.guards.assigned_actor_guard import AssignedActorGuard
from core.modules.assignments.listeners.child_created_listener import ChildCreatedListener
from core.modules.assignments.listeners.link_created_listener import LinkCreatedListener
from core.modules.assignments.listeners.link_removed_listener import LinkRemovedListener
from core.modules.assignments.listeners.row_deleted_listener import RowDeletedListener
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
    subcommands = [AssignRowSubcommand, UnassignRowSubcommand]
    handlers = [AssignRowHandler, UnassignRowHandler]
    listeners = [RowDeletedListener, ChildCreatedListener, LinkCreatedListener, LinkRemovedListener]
    guards = [AssignedActorGuard]
