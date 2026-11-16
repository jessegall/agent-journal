from core.modules.processes.tick_handlers.cadence_watch_tick_handler import CadenceWatchTickHandler
from core.modules.processes.tick_handlers.hang_watch_tick_handler import HangWatchTickHandler
from core.modules.processes.tick_handlers.output_checks_tick_handler import OutputChecksTickHandler
from core.modules.processes.tick_handlers.output_reading_tick_handler import OutputReadingTickHandler
from core.modules.processes.tick_handlers.process_pruning_tick_handler import ProcessPruningTickHandler
from core.modules.processes.tick_handlers.request_log_import_tick_handler import RequestLogImportTickHandler
from core.modules.processes.tick_handlers.run_end_recovery_tick_handler import RunEndRecoveryTickHandler
from core.modules.processes.tick_handlers.run_slot_grant_tick_handler import RunSlotGrantTickHandler
from core.modules.processes.tick_handlers.run_timeouts_tick_handler import RunTimeoutsTickHandler

PROCESSES_TICK_HANDLERS = [OutputReadingTickHandler, RunSlotGrantTickHandler,
                     RunTimeoutsTickHandler, HangWatchTickHandler, CadenceWatchTickHandler, OutputChecksTickHandler,
                     RunEndRecoveryTickHandler,
                     ProcessPruningTickHandler, RequestLogImportTickHandler]
