from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType

# @sin architecture_processes_nudge_carries_row_data
RUN_COMMAND = MessageTemplate("samples.run_command", AgentMessageType.STEERING, "output {output} runs {command}")
# @sin architecture_processes_nudge_carries_row_data
RUN_TITLE = MessageTemplate("samples.run_title", AgentMessageType.STEERING, "output {output} is called {title}")
# @sin architecture_processes_nudge_carries_row_data
LAST_LINES = MessageTemplate("samples.last_lines", AgentMessageType.STEERING, "output {output} ended. Last lines: {lines}")
# @righteous architecture_processes_nudge_carries_row_data
READER_MISSED = MessageTemplate("samples.reader_missed", AgentMessageType.STEERING, "reader {reader} picked none of {lines} lines of output {output}")
# @righteous architecture_processes_nudge_carries_row_data
SILENT_RUN = MessageTemplate("samples.silent_run", AgentMessageType.NOTICE, "output {output} printed nothing for {seconds} seconds")
