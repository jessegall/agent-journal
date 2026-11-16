from core.modules.docking.declarations.docking_dependencies import DOCKING_DEPENDENCIES
from core.modules.docking.declarations.docking_migrations import DOCKING_MIGRATIONS
from core.modules.docking.declarations.docking_handlers import DOCKING_HANDLERS
from core.modules.docking.declarations.docking_subcommands import DOCKING_SUBCOMMANDS
from core.modules.docking.declarations.docking_guards import DOCKING_GUARDS
from core.modules.docking.models.declarations.dock_item_model_declaration import DockItemModelDeclaration
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from core.modules.docking.listeners.dock_item_leave_listener import DockItemLeaveListener
from core.modules.docking.listeners.pending_dock_items_listener import PendingDockItemsListener
from core.modules.docking.listeners.environment_dock_listener import EnvironmentDockListener
from core.modules.docking.models.dock import Dock
from core.modules.docking.support.dock_limits import DOCKING_SETTINGS
from core.modules.docking.seeders.docking_seeder import DockingSeeder
from core.modules.docking.tick_handlers.dock_item_leaves_tick_handler import DockItemLeavesTickHandler


class DockingModule(Module):
    """Adds the dock above an environment's chat and the items modules dock in it."""

    name = "journal.core.docking"
    move_reason = "version 4 had no docked items, its dock was drawn from open rows"
    requires_engine = ">=5,<6"
    settings = DOCKING_SETTINGS
    dependencies = DOCKING_DEPENDENCIES
    models = [ModelDeclaration(Dock), DockItemModelDeclaration]
    migrations = DOCKING_MIGRATIONS
    handlers = DOCKING_HANDLERS
    subcommands = DOCKING_SUBCOMMANDS
    listeners = [EnvironmentDockListener, DockItemLeaveListener, PendingDockItemsListener]
    guards = DOCKING_GUARDS
    seeders = [DockingSeeder]
    tick_handlers = [DockItemLeavesTickHandler]
