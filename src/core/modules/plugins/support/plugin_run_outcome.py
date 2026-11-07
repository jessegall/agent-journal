from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plugins.support.plugin_answer import PluginAnswer


@dataclass(frozen=True)
class PluginRunOutcome:
    """How one run of a plugin ended: its answer, or the text of its fault, and the fault or clean run to record."""

    answer: PluginAnswer | None = None
    fault_text: str = ""
    is_late: bool = False
    is_server_stop: bool = False
    records: tuple[Command[object], ...] = ()
