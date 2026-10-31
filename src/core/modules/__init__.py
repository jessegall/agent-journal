from core.modules.actors.actors_module import ActorsModule
from core.modules.agents.agents_module import AgentsModule
from core.modules.chat.chat_module import ChatModule
from core.modules.claude_code.claude_code_module import ClaudeCodeModule
from core.modules.codex.codex_module import CodexModule
from core.modules.docking.docking_module import DockingModule
from core.modules.drivers.drivers_module import DriversModule
from core.modules.environments.environments_module import EnvironmentsModule
from core.modules.memories.memories_module import MemoriesModule
from core.modules.messages.messages_module import MessagesModule
from core.modules.plans.plans_module import PlansModule
from core.modules.settings.settings_module import SettingsModule
from core.modules.tasks.tasks_module import TasksModule
from core.modules.waits.waits_module import WaitsModule
from core.modules.viewer.viewer_module import ViewerModule

DEFAULT_MODULES = (ActorsModule, EnvironmentsModule, AgentsModule, SettingsModule, DriversModule, TasksModule, PlansModule, MessagesModule, ChatModule, DockingModule, MemoriesModule, WaitsModule, ViewerModule, ClaudeCodeModule, CodexModule)
