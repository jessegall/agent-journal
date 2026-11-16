from core.modules.processes.lines.alias_suggestion_lines import AliasSuggestionLines
from core.modules.processes.lines.dock_title_lines import DockTitleLines
from core.modules.processes.lines.ended_output_line_lines import EndedOutputLineLines
from core.modules.processes.lines.orphan_process_lines import OrphanProcessLines
from core.modules.processes.lines.output_status_monitor_lines import OutputStatusMonitorLines
from core.modules.processes.lines.read_advice_lines import ReadAdviceLines
from core.modules.processes.lines.reader_request_lines import ReaderRequestLines
from core.modules.processes.lines.reading_lines import ReadingLines
from core.modules.processes.lines.run_queue_halted_lines import RunQueueHaltedLines
from core.modules.processes.lines.run_title_lines import RunTitleLines
from core.modules.processes.lines.runner_missing_lines import RunnerMissingLines
from core.modules.processes.lines.watch_lines_lines import WatchLinesLines

PROCESSES_LINES = [AliasSuggestionLines, DockTitleLines, EndedOutputLineLines, OrphanProcessLines, OutputStatusMonitorLines, ReadAdviceLines, ReaderRequestLines, ReadingLines, RunnerMissingLines, RunQueueHaltedLines, RunTitleLines, WatchLinesLines]
