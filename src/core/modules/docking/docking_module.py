from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.docking.commands.add_dock_item_handler import AddDockItemHandler
from core.modules.docking.commands.keep_dock_item_handler import KeepDockItemHandler
from core.modules.docking.commands.remove_dock_item_handler import RemoveDockItemHandler
from core.modules.docking.commands.add_dock_item_subcommand import AddDockItemSubcommand
from core.modules.docking.commands.keep_dock_item_subcommand import KeepDockItemSubcommand
from core.modules.docking.commands.remove_dock_item_subcommand import RemoveDockItemSubcommand
from core.modules.docking.commands.make_dock_handler import MakeDockHandler
from core.modules.docking.guards.dock_limit_guard import DockLimitGuard
from core.modules.docking.guards.dock_type_guard import DockTypeGuard
from core.modules.docking.guards.one_item_per_row_guard import OneItemPerRowGuard
from core.modules.docking.guards.type_limit_guard import TypeLimitGuard
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.docking.listeners.environment_dock_listener import EnvironmentDockListener
from core.modules.docking.migrations.m001_docks import DocksTableMigration
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.dock_item import DockItem


class DockingModule(Module):
    """Adds the dock above an environment's chat and the items modules dock in it."""

    name = "journal.core.docking"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.chat", "journal.core.settings"]
    models = [ModelDeclaration(Dock), ModelDeclaration(DockItem, query=DockItemQuery)]
    migrations = [DocksTableMigration]
    handlers = [MakeDockHandler, AddDockItemHandler, KeepDockItemHandler, RemoveDockItemHandler]
    subcommands = [AddDockItemSubcommand, KeepDockItemSubcommand, RemoveDockItemSubcommand]
    listeners = [EnvironmentDockListener]
    guards = [DockTypeGuard, OneItemPerRowGuard, TypeLimitGuard, DockLimitGuard]
