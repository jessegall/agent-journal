from core.modules.processes.effects.leftover_run_effect import LeftoverRunEffect
from core.modules.processes.effects.long_run_dock_effect import LongRunDockEffect
from core.modules.processes.effects.orphan_process_effect import OrphanProcessEffect
from core.modules.processes.effects.reader_request_effect import ReaderRequestEffect
from core.modules.processes.effects.runner_start_effect import RunnerStartEffect
from core.modules.processes.effects.watch_lines_effect import WatchLinesEffect

PROCESSES_EFFECTS = [LeftoverRunEffect, LongRunDockEffect, OrphanProcessEffect, ReaderRequestEffect, RunnerStartEffect, WatchLinesEffect]
