from core.modules.docking.migrations.m008_dock_item_session import DockItemSessionMigration
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.docking.commands.add_dock_item.add_dock_item_handler import AddDockItemHandler
from core.modules.docking.commands.keep_dock_item.keep_dock_item_handler import KeepDockItemHandler
from core.modules.docking.commands.remove_dock_item.remove_dock_item_handler import RemoveDockItemHandler
from core.modules.docking.commands.release_dock_item.release_dock_item_handler import ReleaseDockItemHandler
from core.modules.docking.commands.add_dock_item.add_dock_item_subcommand import AddDockItemSubcommand
from core.modules.docking.commands.keep_dock_item.keep_dock_item_subcommand import KeepDockItemSubcommand
from core.modules.docking.commands.remove_dock_item.remove_dock_item_subcommand import RemoveDockItemSubcommand
from core.modules.docking.commands.release_dock_item.release_dock_item_subcommand import ReleaseDockItemSubcommand
from core.modules.docking.commands.dock_item_read.dock_item_read_subcommand import DockItemReadSubcommand
from core.modules.docking.commands.main_dock_items.main_dock_items_subcommand import MainDockItemsSubcommand
from core.modules.docking.commands.make_dock.make_dock_handler import MakeDockHandler
from core.modules.docking.guards.own_environment_guard import OwnEnvironmentGuard
from core.modules.docking.guards.dock_capacity_guard import DockCapacityGuard
from core.modules.docking.guards.dock_title_guard import DockTitleGuard
from core.modules.docking.guards.dock_type_guard import DockTypeGuard
from core.modules.docking.guards.one_item_per_row_guard import OneItemPerRowGuard
from core.modules.docking.guards.type_capacity_guard import TypeCapacityGuard
from core.modules.docking.guards.user_dock_guard import UserDockGuard
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.docking.commands.schedule_dock_item_leave.schedule_dock_item_leave_handler import ScheduleDockItemLeaveHandler
from core.modules.docking.listeners.dock_item_leave_listener import DockItemLeaveListener
from core.modules.docking.listeners.pending_dock_items_listener import PendingDockItemsListener
from core.modules.docking.listeners.environment_dock_listener import EnvironmentDockListener
from core.modules.docking.migrations.m001_docks import DocksTableMigration
from core.modules.docking.migrations.m002_docks_of_existing_environments import ExistingEnvironmentDocksMigration
from core.modules.docking.migrations.m003_dock_item_labels import DockItemLabelsMigration
from core.modules.docking.migrations.m004_dock_item_indexes import DockItemIndexesMigration
from core.modules.docking.migrations.m005_dock_item_agents import DockItemAgentsMigration
from core.modules.docking.migrations.m006_dock_item_due_index import DockItemDueIndexMigration
from core.modules.docking.migrations.m007_pending_dock_items_index import PendingDockItemsIndexMigration
from core.modules.docking.migrations.m009_dock_item_state_index import DockItemStateIndexMigration
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.support.dock_limits import DOCKING_SETTINGS
from core.modules.docking.seeders.docking_seeder import DockingSeeder
from core.modules.docking.ticks.dock_item_leaves import DockItemLeaves


class DockingModule(Module):
    """Adds the dock above an environment's chat and the items modules dock in it."""

    name = "journal.core.docking"
    move_reason = "version 4 had no docked items, its dock was drawn from open rows"
    requires_core = ">=5,<6"
    settings = DOCKING_SETTINGS
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.chat", "journal.core.settings"]
    models = [ModelDeclaration(Dock), ModelDeclaration(DockItem, query=DockItemQuery)]
    migrations = [DockItemSessionMigration, DocksTableMigration, ExistingEnvironmentDocksMigration, DockItemLabelsMigration, DockItemIndexesMigration, DockItemAgentsMigration, DockItemDueIndexMigration, PendingDockItemsIndexMigration, DockItemStateIndexMigration]
    handlers = [MakeDockHandler, AddDockItemHandler, KeepDockItemHandler, ReleaseDockItemHandler, RemoveDockItemHandler, ScheduleDockItemLeaveHandler]
    subcommands = [DockItemReadSubcommand, AddDockItemSubcommand, KeepDockItemSubcommand, ReleaseDockItemSubcommand, RemoveDockItemSubcommand, MainDockItemsSubcommand]
    listeners = [EnvironmentDockListener, DockItemLeaveListener, PendingDockItemsListener]
    guards = [DockTypeGuard, DockTitleGuard, OneItemPerRowGuard, TypeCapacityGuard, DockCapacityGuard, OwnEnvironmentGuard, UserDockGuard]
    seeders = [DockingSeeder]
    tick_handlers = [TickHandler(TickInterval(seconds=2), DockItemLeaves(), "dock item leaves")]
