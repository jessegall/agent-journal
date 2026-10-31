from core.modules.actors.module import ActorsModule
from core.modules.agents.module import AgentsModule
from core.modules.drivers.module import DriversModule
from core.modules.environments.module import EnvironmentsModule
from core.modules.messages.module import MessagesModule
from core.modules.plans.module import PlansModule
from core.modules.settings.module import SettingsModule
from core.modules.tasks.module import TasksModule
from core.modules.waits.module import WaitsModule
from core.suites.coding.module import CodingModule

DEFAULT_MODULES = (ActorsModule, EnvironmentsModule, AgentsModule, SettingsModule, DriversModule, TasksModule, PlansModule, MessagesModule, WaitsModule, CodingModule)
