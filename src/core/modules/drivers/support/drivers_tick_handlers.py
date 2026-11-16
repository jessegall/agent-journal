from core.modules.drivers.tick_handlers.agent_minute_steps_tick_handler import AgentMinuteStepsTickHandler
from core.modules.drivers.tick_handlers.agent_step_round_tick_handler import AgentStepRoundTickHandler
from core.modules.drivers.tick_handlers.agent_wake_delivery_tick_handler import AgentWakeDeliveryTickHandler
from core.modules.drivers.tick_handlers.compaction_faults_tick_handler import CompactionFaultsTickHandler
from core.modules.drivers.tick_handlers.end_silent_helpers_tick_handler import EndSilentHelpersTickHandler
from core.modules.drivers.tick_handlers.event_pruning_tick_handler import EventPruningTickHandler
from core.modules.drivers.tick_handlers.hook_pruning_tick_handler import HookPruningTickHandler
from core.modules.drivers.tick_handlers.panic_watch_tick_handler import PanicWatchTickHandler
from core.modules.drivers.tick_handlers.released_session_wake_tick_handler import ReleasedSessionWakeTickHandler
from core.modules.drivers.tick_handlers.row_pruning_tick_handler import RowPruningTickHandler

DRIVERS_TICK_HANDLERS = [AgentWakeDeliveryTickHandler, AgentMinuteStepsTickHandler, AgentStepRoundTickHandler, EndSilentHelpersTickHandler, CompactionFaultsTickHandler, PanicWatchTickHandler, ReleasedSessionWakeTickHandler,
                     HookPruningTickHandler, RowPruningTickHandler,
                     EventPruningTickHandler]
