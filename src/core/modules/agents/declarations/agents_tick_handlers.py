from core.modules.agents.tick_handlers.unused_launcher_tick_handler import UnusedLauncherTickHandler
from core.modules.agents.tick_handlers.agent_renumber_finish_tick_handler import AgentRenumberFinishTickHandler
from core.modules.agents.tick_handlers.agent_reconcile_tick_handler import AgentReconcileTickHandler
from core.modules.agents.tick_handlers.program_settings_watch_tick_handler import ProgramSettingsWatchTickHandler

AGENTS_TICK_HANDLERS = [AgentReconcileTickHandler,
                     ProgramSettingsWatchTickHandler, AgentRenumberFinishTickHandler, UnusedLauncherTickHandler]
