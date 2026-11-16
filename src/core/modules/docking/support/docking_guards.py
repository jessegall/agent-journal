from core.modules.docking.guards.dock_capacity_guard import DockCapacityGuard
from core.modules.docking.guards.dock_title_guard import DockTitleGuard
from core.modules.docking.guards.dock_type_guard import DockTypeGuard
from core.modules.docking.guards.one_item_per_row_guard import OneItemPerRowGuard
from core.modules.docking.guards.own_environment_guard import OwnEnvironmentGuard
from core.modules.docking.guards.type_capacity_guard import TypeCapacityGuard
from core.modules.docking.guards.user_dock_guard import UserDockGuard

DOCKING_GUARDS = [DockTypeGuard, DockTitleGuard, OneItemPerRowGuard, TypeCapacityGuard, DockCapacityGuard, OwnEnvironmentGuard, UserDockGuard]
