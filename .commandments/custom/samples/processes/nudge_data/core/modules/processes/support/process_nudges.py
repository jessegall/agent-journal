from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

# @sin architecture_processes_nudge_carries_row_data
RUN_COMMAND = NudgeDeclaration("samples.run_command", NudgeType.STEERING, "output {output} runs {command}")
# @sin architecture_processes_nudge_carries_row_data
RUN_TITLE = NudgeDeclaration("samples.run_title", NudgeType.STEERING, "output {output} is called {title}")
# @sin architecture_processes_nudge_carries_row_data
LAST_LINES = NudgeDeclaration("samples.last_lines", NudgeType.STEERING, "output {output} ended. Last lines: {lines}")
# @righteous architecture_processes_nudge_carries_row_data
READER_MISSED = NudgeDeclaration("samples.reader_missed", NudgeType.STEERING, "reader {reader} picked none of {lines} lines of output {output}")
# @righteous architecture_processes_nudge_carries_row_data
SILENT_RUN = NudgeDeclaration("samples.silent_run", NudgeType.NOTICE, "output {output} printed nothing for {seconds} seconds")
