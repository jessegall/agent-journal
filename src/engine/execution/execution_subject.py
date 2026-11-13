from dataclasses import dataclass

from engine.enums.command_category import CommandCategory
from engine.enums.execution_source import ExecutionSource
from engine.enums.process_type import ProcessType
from engine.execution.execution_starter import ExecutionStarter


@dataclass(frozen=True)
class ExecutionSubject:
    """What is about to run, as much as the class table asks of it: where it comes from, who started it, its
    command category and process type, the plugin and kind of a plugin's run, its line, and whether the person's
    window asked to go first."""

    source: ExecutionSource
    starter: ExecutionStarter
    category: CommandCategory | None = None
    process_type: ProcessType | None = None
    plugin_name: str = ""
    plugin_kind: str = ""
    line: str = ""
    is_first_window: bool = False
